import { NextResponse } from 'next/server';
import { PrismaClient, JobStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ValidationError, NotFoundError, ConflictError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();

const statusSchema = z.object({
  status: z.enum(['PUBLISHED', 'CLOSED']),
});

// Định nghĩa các bước chuyển trạng thái hợp lệ
const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  DRAFT: ['PUBLISHED'],
  PUBLISHED: ['CLOSED'],
  CLOSED: [],
};

export const PATCH = withErrorHandler(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const authResult = requireRole(['RECRUITER', 'ADMIN'])(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await ctx.params;

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Trường status chỉ nhận PUBLISHED hoặc CLOSED');
    }

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundError(`Không tìm thấy Job với id ${id}`);
    }

    const { status: newStatus } = parsed.data;
    const allowedNext = ALLOWED_TRANSITIONS[job.status];

    if (!allowedNext.includes(newStatus)) {
      throw new ConflictError(
        'INVALID_STATUS_TRANSITION',
        `Không thể chuyển từ ${job.status} sang ${newStatus}`
      );
    }

    const updated = await prisma.jobPosting.update({
      where: { id },
      data: { status: newStatus },
    });

    await logAudit(authResult.userId, 'UPDATE_JOB_STATUS', 'JobPosting', id, {
      from: job.status,
      to: newStatus,
    });

    return NextResponse.json(updated);
  }
);