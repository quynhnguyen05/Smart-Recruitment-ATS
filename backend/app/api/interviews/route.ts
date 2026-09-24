import { NextResponse } from 'next/server';
import { PrismaClient, InterviewRoundStatus } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();

const createSchema = z.object({
  applicationId: z.string().uuid(),
  interviewerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

const updateSchema = z.object({ status: z.nativeEnum(InterviewRoundStatus) });

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const interviews = await prisma.interviewRound.findMany({
    include: { application: { include: { job: true } }, questions: true, scorecard: true },
    orderBy: { scheduledAt: 'asc' },
  });
  return NextResponse.json(interviews);
});

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Thiếu applicationId, interviewerId hoặc scheduledAt hợp lệ');

  const scheduledAt = new Date(parsed.data.scheduledAt);
  const [application, interviewer, conflict] = await Promise.all([
    prisma.application.findUnique({ where: { id: parsed.data.applicationId } }),
    prisma.user.findUnique({ where: { id: parsed.data.interviewerId } }),
    prisma.interviewRound.findFirst({
      where: { interviewerId: parsed.data.interviewerId, scheduledAt, status: 'SCHEDULED' },
    }),
  ]);
  if (!application) throw new NotFoundError('Không tìm thấy application');
  if (!interviewer || interviewer.role !== 'INTERVIEWER' || interviewer.disabled) {
    throw new ValidationError('Interviewer không hợp lệ hoặc đã bị khóa');
  }
  if (conflict) throw new ConflictError('INTERVIEW_CONFLICT', 'Interviewer đã có lịch vào thời gian này');

  const interview = await prisma.interviewRound.create({
    data: { applicationId: parsed.data.applicationId, interviewerId: parsed.data.interviewerId, scheduledAt },
  });
  await logAudit(authResult.userId, 'CREATE_INTERVIEW', 'InterviewRound', interview.id, parsed.data);
  return NextResponse.json(interview, { status: 201 });
});

export const PATCH = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const body = await req.json();
  const id = z.string().uuid().safeParse(body.id);
  const parsed = updateSchema.safeParse(body);
  if (!id.success || !parsed.success) throw new ValidationError('Cần id và status hợp lệ');

  const existing = await prisma.interviewRound.findUnique({ where: { id: body.id } });
  if (!existing) throw new NotFoundError('Không tìm thấy lịch phỏng vấn');
  const interview = await prisma.interviewRound.update({ where: { id: body.id }, data: { status: parsed.data.status } });
  await logAudit(authResult.userId, 'UPDATE_INTERVIEW_STATUS', 'InterviewRound', body.id, parsed.data);
  return NextResponse.json(interview);
});