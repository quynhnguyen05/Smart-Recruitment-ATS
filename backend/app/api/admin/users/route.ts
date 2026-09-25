import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ValidationError, ConflictError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER', 'CANDIDATE']),
});

export const POST = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError('Thiếu hoặc sai định dạng: email, password (>=6 ký tự), role');
  }

  const { email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('EMAIL_ALREADY_EXISTS', `Email ${email} đã được sử dụng`);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  await logAudit(authResult.userId, 'CREATE_USER', 'User', user.id, { email, role });

  const { id, email: userEmail, role: userRole, disabled, createdAt } = user;
  return NextResponse.json({ id, email: userEmail, role: userRole, disabled, createdAt });
});

export const GET = withErrorHandler(async (req: Request) => {
  const authResult = requireRole(['ADMIN'])(req);
  if (authResult instanceof NextResponse) return authResult;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      disabled: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
});