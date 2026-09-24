import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Import the parser core; the package root runs a missing test fixture under Turbopack.
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError } from '@/lib/errors';

const prisma = new PrismaClient();

const STOP_WORDS = new Set([
  'and', 'the', 'with', 'for', 'from', 'this', 'that', 'you', 'your', 'are',
  'cua', 'cho', 'voi', 'va', 'cac', 'mot', 'nhung', 'trong', 'yeu', 'can',
]);

function keywords(value: string) {
  return [...new Set(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9+#.]{3,}/g) || [])]
    .filter((word) => !STOP_WORDS.has(word));
}

async function readCv(applicationCvUrl: string) {
  const isRemote = /^https?:\/\//i.test(applicationCvUrl);
  const fileName = isRemote ? path.basename(new URL(applicationCvUrl).pathname) : path.basename(applicationCvUrl);
  const extension = path.extname(fileName).toLowerCase();
  const buffer = isRemote
    ? Buffer.from(await (await fetch(applicationCvUrl)).arrayBuffer())
    : await readFile(path.join(process.cwd(), 'storage', 'cv', fileName));

  if (extension === '.txt') return { text: buffer.toString('utf8'), supported: true };
  if (extension !== '.pdf') return { text: '', supported: false };
  const parsed = await pdfParse(buffer);
  return { text: parsed.text, supported: true };
}

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await ctx.params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { select: { title: true, requirements: true } } },
  });
  if (!application) throw new NotFoundError('Không tìm thấy application');

  const cv = await readCv(application.cvUrl);
  if (!cv.supported || !cv.text.trim()) {
    return NextResponse.json({
      status: 'INSUFFICIENT_DATA',
      matchScore: null,
      matchedSkills: [],
      missingSkills: keywords(application.job.requirements),
      explanation: 'Chưa thể trích xuất nội dung text từ CV DOCX hoặc CV không có text. Không tự động chấm điểm.',
      jobTitle: application.job.title,
    });
  }

  const cvText = cv.text.toLowerCase();
  const required = keywords(application.job.requirements);
  const matchedSkills = required.filter((skill) => cvText.includes(skill));
  const missingSkills = required.filter((skill) => !matchedSkills.includes(skill));
  const matchScore = required.length === 0 ? 0 : Math.round((matchedSkills.length / required.length) * 100);

  return NextResponse.json({
    status: 'OK',
    matchScore,
    matchedSkills,
    missingSkills,
    explanation: `${matchedSkills.length}/${required.length} từ khóa yêu cầu xuất hiện trong nội dung CV. Điểm chỉ là hỗ trợ quyết định, cần con người xác nhận.`,
    jobTitle: application.job.title,
  });
});