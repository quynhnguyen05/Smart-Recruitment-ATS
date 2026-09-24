import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError } from '@/lib/errors';

const prisma = new PrismaClient();

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const interview = await prisma.interviewRound.findUnique({
    where: { id },
    include: { application: { include: { job: true } }, scorecard: true },
  });
  if (!interview) throw new NotFoundError('Không tìm thấy vòng phỏng vấn');
  return NextResponse.json(interview);
});