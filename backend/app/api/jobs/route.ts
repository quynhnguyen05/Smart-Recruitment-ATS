import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ValidationError } from '@/lib/errors';
import { z } from 'zod';

const prisma = new PrismaClient();

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().min(1),
});

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  });

  return NextResponse.json(jobs.map(({ _count, ...job }) => ({
    ...job,
    applicantsCount: _count.applications,
  })));
});

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['RECRUITER', 'ADMIN'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError('Thiếu trường bắt buộc: title, description, requirements');
  }

  const job = await prisma.jobPosting.create({
    data: {
      ...parsed.data,
      createdBy: authResult.userId,
      status: 'DRAFT',
    },
  });

  return NextResponse.json(job);
});