import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from '@/lib/requireRole';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { logAudit } from '@/lib/auditLog';

const prisma = new PrismaClient();

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'HIRING_MANAGER', 'CANDIDATE']).optional(),
  disabled: z.boolean().optional(),
});

export const PATCH = withErrorHandler(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const authResult = requireRole(['ADMIN'])(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await ctx.params;

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Chỉ chấp nhận trường role và/hoặc disabled');
    }

    if (!parsed.data.role && parsed.data.disabled === undefined) {
      throw new ValidationError('Phải cung cấp ít nhất 1 trong 2 trường: role hoặc disabled');
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Không tìm thấy user với id ${id}`);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });

    await logAudit(authResult.userId, 'UPDATE_USER', 'User', id, parsed.data);

    const { passwordHash: _omit, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  }
);