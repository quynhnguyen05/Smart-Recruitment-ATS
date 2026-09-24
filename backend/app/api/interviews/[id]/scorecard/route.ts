import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();
const scorecardSchema = z.object({ score: z.number().int().min(1).max(10), notes: z.string().min(1) });

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const { id } = await ctx.params;
  const scorecard = await prisma.scorecard.findUnique({ where: { interviewId: id } });
  if (!scorecard) throw new NotFoundError('Chưa có scorecard cho vòng phỏng vấn này');
  return NextResponse.json(scorecard);
});

export const POST = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const { id } = await ctx.params;
  const parsed = scorecardSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError('Score phải là số nguyên từ 1 đến 10 và cần có ghi chú');

  const interview = await prisma.interviewRound.findUnique({ where: { id } });
  if (!interview) throw new NotFoundError('Không tìm thấy vòng phỏng vấn');
  if (authResult.role === 'INTERVIEWER' && interview.interviewerId !== authResult.userId) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Bạn không phải interviewer của vòng này' } }, { status: 403 });
  }

  const scorecard = await prisma.scorecard.upsert({
    where: { interviewId: id },
    create: { interviewId: id, interviewerId: authResult.userId, ...parsed.data },
    update: { score: parsed.data.score, notes: parsed.data.notes, interviewerId: authResult.userId },
  });
  await logAudit(authResult.userId, 'SUBMIT_SCORECARD', 'Scorecard', scorecard.id, { interviewId: id, score: parsed.data.score });
  return NextResponse.json(scorecard);
});