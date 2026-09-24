import { NextResponse } from 'next/server';
import { PrismaClient, JobStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  requirements: z.string().min(1).optional(),
  status: z.nativeEnum(JobStatus).optional(),
}).refine((data) => Object.keys(data).length > 0, 'Cần ít nhất một trường để cập nhật');

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: { _count: { select: { applications: true } } },
  });
  if (!job) throw new NotFoundError('Không tìm thấy job posting');

  const { _count, ...jobData } = job;
  return NextResponse.json({ ...jobData, applicantsCount: _count.applications });
});

export const PATCH = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Thông tin cập nhật job không hợp lệ');

  const existing = await prisma.jobPosting.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy job posting');
  if (authResult.role !== 'ADMIN' && existing.createdBy !== authResult.userId) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Bạn không phải người tạo job này' } }, { status: 403 });
  }

  const job = await prisma.jobPosting.update({ where: { id }, data: parsed.data });
  await logAudit(authResult.userId, 'UPDATE_JOB', 'JobPosting', id, { from: existing, to: parsed.data });
  return NextResponse.json(job);
});