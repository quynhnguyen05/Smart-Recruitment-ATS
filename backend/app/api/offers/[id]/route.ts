import { NextResponse } from 'next/server';
import { PrismaClient, OfferStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const updateSchema = z.object({ status: z.nativeEnum(OfferStatus) });

export const PATCH = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Offer status không hợp lệ');
  if (parsed.data.status === 'CONFIRMED' && !['ADMIN', 'HIRING_MANAGER'].includes(authResult.role)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Offer cần Hiring Manager xác nhận' } }, { status: 403 });
  }

  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy offer');

  const offer = await prisma.offer.update({
    where: { id },
    data: {
      status: parsed.data.status,
      confirmedByHm: parsed.data.status === 'CONFIRMED' ? authResult.userId : existing.confirmedByHm,
    },
  });
  await logAudit(authResult.userId, 'UPDATE_OFFER_STATUS', 'Offer', id, { status: parsed.data.status });
  return NextResponse.json(offer);
});