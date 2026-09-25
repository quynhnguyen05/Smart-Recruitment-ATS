import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const confirmSchema = z.object({ confirmationToken: z.string().min(1, 'Thiếu confirmationToken') });

export const PATCH = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  
  const { id } = await ctx.params;
  const parsed = confirmSchema.safeParse(await req.json());
  
  if (!parsed.success) {
    throw new ValidationError('Thiếu confirmationToken bắt buộc');
  }
  
  if (parsed.data.confirmationToken !== 'XAC NHAN') {
    throw new ValidationError('Token xác nhận không chính xác');
  }

  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy offer');

  const offer = await prisma.offer.update({
    where: { id },
    data: {
      status: 'CONFIRMED',
      confirmedByHm: authResult.userId,
    },
  });
  
  await logAudit(authResult.userId, 'CONFIRM_OFFER', 'Offer', id, { status: 'CONFIRMED' });
  return NextResponse.json(offer);
});
