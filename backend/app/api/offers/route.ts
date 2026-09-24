import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const createSchema = z.object({ applicationId: z.string().uuid(), salary: z.coerce.number().positive() });

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const offers = await prisma.offer.findMany({
    where: authResult.role === 'CANDIDATE' ? { application: { candidateId: authResult.userId } } : undefined,
    include: { application: { include: { job: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(offers);
});

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Cần applicationId và salary hợp lệ');

  const application = await prisma.application.findUnique({ where: { id: parsed.data.applicationId } });
  if (!application) throw new NotFoundError('Không tìm thấy application');
  if (application.status === 'REJECTED') throw new ValidationError('Không thể tạo offer cho application đã bị từ chối');

  const existing = await prisma.offer.findUnique({ where: { applicationId: parsed.data.applicationId } });
  if (existing) throw new ConflictError('OFFER_ALREADY_EXISTS', 'Application này đã có offer');

  const offer = await prisma.offer.create({
    data: { applicationId: parsed.data.applicationId, salary: parsed.data.salary },
  });
  await logAudit(authResult.userId, 'CREATE_OFFER', 'Offer', offer.id, { applicationId: application.id });
  return NextResponse.json(offer, { status: 201 });
});