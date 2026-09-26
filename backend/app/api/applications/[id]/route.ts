import { NextResponse } from 'next/server';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const updateSchema = z.object({ status: z.nativeEnum(ApplicationStatus) });

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) throw new NotFoundError('Không tìm thấy application');

  // Candidate only views own application
  if (authResult.role === 'CANDIDATE' && application.candidateId !== authResult.userId) {
    throw new NotFoundError('Không tìm thấy application');
  }

  return NextResponse.json(application);
});

export const PATCH = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Trạng thái application không hợp lệ');

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy application');

  if (existing.status === 'REJECTED' && parsed.data.status !== 'REJECTED') {
    throw new ValidationError('Hồ sơ đã bị từ chối, không thể quay lại trạng thái trước đó');
  }

  const application = await prisma.application.update({ where: { id }, data: parsed.data });
  await logAudit(authResult.userId, 'UPDATE_APPLICATION_STATUS', 'Application', id, parsed.data);
  return NextResponse.json(application);
});