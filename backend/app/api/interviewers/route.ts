import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';

const prisma = new PrismaClient();

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const interviewers = await prisma.user.findMany({
    where: { role: { in: ['INTERVIEWER', 'HIRING_MANAGER'] }, disabled: false },
    select: { id: true, email: true, role: true },
    orderBy: { email: 'asc' },
  });
  return NextResponse.json(interviewers);
});