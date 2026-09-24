import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError } from '@/lib/errors';

const prisma = new PrismaClient();

export const GET = withErrorHandler(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const authResult = requireRole(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER', 'CANDIDATE'])(req);
  if (authResult instanceof NextResponse) return authResult;
  const { id } = await ctx.params;
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) throw new NotFoundError('Không tìm thấy application');
  if (authResult.role === 'CANDIDATE' && application.candidateId !== authResult.userId) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xem CV này' } }, { status: 403 });
  }

  const isRemoteFile = /^https?:\/\//i.test(application.cvUrl);
  const fileName = isRemoteFile ? path.basename(new URL(application.cvUrl).pathname) : path.basename(application.cvUrl);
  const extension = path.extname(fileName).toLowerCase();
  const contentType = extension === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (isRemoteFile) {
    const remoteResponse = await fetch(application.cvUrl);
    if (!remoteResponse.ok) throw new NotFoundError('Không thể tải CV từ kho lưu trữ');
    const remoteFile = await remoteResponse.arrayBuffer();
    return new NextResponse(remoteFile, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  }

  try {
    const file = await readFile(path.join(process.cwd(), 'storage', 'cv', fileName));
    return new NextResponse(file, { headers: { 'Content-Type': contentType, 'Content-Disposition': `inline; filename="${fileName}"` } });
  } catch {
    throw new NotFoundError('File CV không còn tồn tại trên server');
  }
});