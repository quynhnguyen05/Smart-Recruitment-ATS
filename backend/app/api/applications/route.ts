import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ValidationError, NotFoundError, ConflictError } from '@/lib/errors';
import { uploadCV, FileValidationError } from '@/lib/supabaseStorage';
import { logAudit } from '@/lib/auditLog';
import { extractCvText } from '@/lib/extractCvText';

const prisma = new PrismaClient();

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const formData = await req.formData();
  const jobId = formData.get('jobId');
  const cvFile = formData.get('cv');

  if (typeof jobId !== 'string' || !jobId) {
    throw new ValidationError('Thiếu jobId');
  }
  if (!(cvFile instanceof File)) {
    throw new ValidationError('Thiếu file CV (field "cv")');
  }

  const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new NotFoundError(`Không tìm thấy Job với id ${jobId}`);
  }
  if (job.status !== 'PUBLISHED') {
    throw new ConflictError('JOB_NOT_OPEN', 'Job này hiện không nhận hồ sơ ứng tuyển');
  }

  const existing = await prisma.application.findUnique({
    where: {
      one_application_per_job_per_candidate: {
        jobId,
        candidateId: authResult.userId,
      },
    },
  });
  if (existing) {
    throw new ConflictError('ALREADY_APPLIED', 'Bạn đã ứng tuyển vào job này rồi');
  }

  // Tạo Application trước để lấy id, dùng id đó đặt tên file cho rõ ràng
  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId: authResult.userId,
      cvUrl: 'pending',
      status: 'NEW',
    },
  });

let cvUrl: string;
  const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

  try {
    cvUrl = await uploadCV(cvFile, application.id);
  } catch (err) {
    await prisma.application.delete({ where: { id: application.id } });
    if (err instanceof FileValidationError) {
      throw new ValidationError(err.message);
    }
    throw err;
  }

  const cvText = await extractCvText(cvBuffer, cvFile.type);

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: { cvUrl, cvText },
  });

  await logAudit(authResult.userId, 'CREATE_APPLICATION', 'Application', updated.id, { jobId });

  return NextResponse.json(updated);
});