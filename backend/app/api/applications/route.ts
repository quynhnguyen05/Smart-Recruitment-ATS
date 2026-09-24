import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

const createApplicationSchema = z.object({ jobId: z.string().uuid(), candidateId: z.string().uuid().optional() });

const querySchema = z.object({ jobId: z.string().uuid().optional() });

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({ jobId: url.searchParams.get('jobId') || undefined });
  if (!parsed.success) throw new ValidationError('jobId không hợp lệ');

  const applications = await prisma.application.findMany({
    where: authResult.role === 'CANDIDATE'
      ? { candidateId: authResult.userId, ...(parsed.data.jobId ? { jobId: parsed.data.jobId } : {}) }
      : parsed.data.jobId ? { jobId: parsed.data.jobId } : undefined,
    include: {
      job: { select: { id: true, title: true, status: true } },
    },
    orderBy: { appliedAt: 'desc' },
  });

  const candidateIds = [...new Set(applications.map((application) => application.candidateId))];
  const candidates = await prisma.user.findMany({
    where: { id: { in: candidateIds } },
    select: { id: true, email: true },
  });
  const candidateEmails = new Map(candidates.map((candidate) => [candidate.id, candidate.email]));

  return NextResponse.json(applications.map((application) => ({
    ...application,
    candidateEmail: candidateEmails.get(application.candidateId) || 'Không xác định',
  })));
});

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['CANDIDATE', 'ADMIN', 'RECRUITER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const form = await req.formData();
  const file = form.get('cv');
  const urlJobId = new URL(req.url).searchParams.get('jobId');
  const parsed = createApplicationSchema.safeParse({
    jobId: form.get('jobId') || urlJobId,
    candidateId: form.get('candidateId') || undefined,
  });
  if (!parsed.success) throw new ValidationError('Thiếu jobId hợp lệ. Hãy chọn một vị trí đang tuyển.');
  if (!(file instanceof File)) throw new ValidationError('Thiếu file CV. Hãy chọn lại file PDF hoặc DOCX.');
  if (file.size === 0 || file.size > 5 * 1024 * 1024) throw new ValidationError('CV phải có dung lượng từ 1 byte đến 5MB');
  const fileName = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
  const isDocx = file.type === 'application/msword'
    || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || fileName.endsWith('.doc')
    || fileName.endsWith('.docx');
  if (!isPdf && !isDocx) {
    throw new ValidationError('CV chỉ hỗ trợ PDF hoặc DOCX');
  }

  const candidateId = parsed.data.candidateId || authResult.userId;
  const job = await prisma.jobPosting.findUnique({ where: { id: parsed.data.jobId } });
  if (!job) throw new NotFoundError('Không tìm thấy job posting');
  if (job.status !== 'PUBLISHED' && authResult.role === 'CANDIDATE') {
    throw new ValidationError('Job chưa được mở để ứng tuyển');
  }

  const existing = await prisma.application.findUnique({ where: { one_application_per_job_per_candidate: { jobId: parsed.data.jobId, candidateId } } });
  if (existing) throw new ConflictError('APPLICATION_ALREADY_EXISTS', 'Bạn đã ứng tuyển job này');

  const extension = isPdf ? 'pdf' : 'docx';
  const storedName = `${crypto.randomUUID()}.${extension}`;
  const storageDir = path.join(process.cwd(), 'storage', 'cv');
  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, storedName), Buffer.from(await file.arrayBuffer()));

  const application = await prisma.application.create({
    data: { jobId: parsed.data.jobId, candidateId, cvUrl: storedName },
  });
  await logAudit(authResult.userId, 'CREATE_APPLICATION', 'Application', application.id, { jobId: job.id });

  return NextResponse.json(application, { status: 201 });
});