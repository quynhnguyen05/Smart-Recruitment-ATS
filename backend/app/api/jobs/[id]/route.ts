import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { NotFoundError } from '@/lib/errors';

const prisma = new PrismaClient();

export const GET = withErrorHandler(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const job = await prisma.jobPosting.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundError(`Không tìm thấy Job với id ${id}`);
    }

    return NextResponse.json(job);
  }
);