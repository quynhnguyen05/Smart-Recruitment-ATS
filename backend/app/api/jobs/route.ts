import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
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

export const GET = withErrorHandler(async (req: Request) => {
  const authHeader = req.headers.get('authorization');

  let canSeeAll = false;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(
        authHeader.replace(/^Bearer\s+/i, ''),
        process.env.JWT_SECRET!
      ) as { role: string };
      canSeeAll = ['RECRUITER', 'ADMIN'].includes(payload.role);
    } catch {
      // token sai/hết hạn -> coi như chưa đăng nhập
    }
  }

  const jobs = await prisma.jobPosting.findMany({
    where: canSeeAll ? {} : { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(jobs);
});