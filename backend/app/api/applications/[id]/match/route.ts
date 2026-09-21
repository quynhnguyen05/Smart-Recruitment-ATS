import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { computeMatch } from '@/lib/aiMatch';

export const runtime = 'nodejs';

const prisma = new PrismaClient(); // nếu đã có lib/prisma.ts thì import từ đó

type MatchStatus = 'OK' | 'INSUFFICIENT_DATA' | 'ERROR';

function err(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function getAuth(req: NextRequest): { userId: string; role: string } | null {
  const h = req.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(h.slice(7), process.env.JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

async function saveMatch(
  applicationId: string,
  status: MatchStatus,
  out?: { matchScore: number; matchedSkills: string[]; missingSkills: string[]; confidence: string }
) {
  const data = {
    status,
    matchScore: out?.matchScore ?? null,
    matchedSkills: out?.matchedSkills ?? Prisma.JsonNull,
    missingSkills: out?.missingSkills ?? Prisma.JsonNull,
    confidence: out?.confidence ?? null,
  };
  return prisma.matchResult.upsert({
    where: { applicationId },
    create: { applicationId, ...data },
    update: data,
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuth(req);
  if (!auth) return err(401, 'UNAUTHORIZED', 'Thiếu hoặc sai token.');
  if (!['RECRUITER', 'ADMIN'].includes(auth.role)) return err(403, 'FORBIDDEN', 'Không đủ quyền.');

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) return err(404, 'APPLICATION_NOT_FOUND', 'Không tìm thấy hồ sơ.');

  if (!application.cvText || application.cvText.trim().length < 50) {
    return NextResponse.json({ data: await saveMatch(id, 'INSUFFICIENT_DATA') });
  }

  try {
    const out = await computeMatch(application.job, application.cvText);
    return NextResponse.json({ data: await saveMatch(id, 'OK', out) });
  } catch (e) {
    console.error('[match] AI failed:', e);
    return NextResponse.json({ data: await saveMatch(id, 'ERROR') });
  }
}