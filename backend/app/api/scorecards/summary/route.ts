import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';

const prisma = new PrismaClient();

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const interviews = await prisma.interviewRound.findMany({
    include: { application: { include: { job: true, offer: true } }, scorecard: true },
    orderBy: { scheduledAt: 'asc' },
  });
  const candidateIds = [...new Set(interviews.map((interview) => interview.application.candidateId))];
  const candidates = await prisma.user.findMany({ where: { id: { in: candidateIds } }, select: { id: true, email: true } });
  const candidateEmails = new Map(candidates.map((candidate) => [candidate.id, candidate.email]));
  const grouped = new Map<string, typeof interviews>();

  interviews.forEach((interview) => {
    const existing = grouped.get(interview.applicationId) || [];
    existing.push(interview);
    grouped.set(interview.applicationId, existing);
  });

  return NextResponse.json([...grouped.entries()].map(([id, rounds]) => {
    const scores = rounds.map((round) => round.scorecard?.score ?? null);
    const availableScores = scores.filter((score): score is number => score !== null);
    const average = availableScores.length ? Number((availableScores.reduce((sum, score) => sum + score, 0) / availableScores.length).toFixed(2)) : null;
    const application = rounds[0].application;
    return {
      id,
      candidateName: candidateEmails.get(application.candidateId) || 'Không xác định',
      position: application.job.title,
      roundOneScore: scores[0] ?? null,
      roundTwoScore: scores[1] ?? null,
      average,
      status: application.status === 'REJECTED' ? 'rejected' : application.offer?.status === 'CONFIRMED' ? 'approved' : 'pending',
    };
  }));
});