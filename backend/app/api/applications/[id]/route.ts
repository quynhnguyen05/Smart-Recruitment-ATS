import { NextResponse } from 'next/server';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const updateSchema = z.object({ status: z.nativeEnum(ApplicationStatus) });

export const PATCH = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Trạng thái application không hợp lệ');

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy application');

  const application = await prisma.application.update({ where: { id }, data: parsed.data });
  await logAudit(authResult.userId, 'UPDATE_APPLICATION_STATUS', 'Application', id, parsed.data);
  return NextResponse.json(application);
});