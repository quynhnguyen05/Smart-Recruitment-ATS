import { NextResponse } from 'next/server';
import { AppError } from './errors';

type Handler<TContext = undefined> = (req: Request, ctx: TContext) => Promise<NextResponse>;

export function withErrorHandler<TContext>(handler: Handler<TContext>): Handler<TContext> {
  return async (req: Request, ctx: TContext) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof AppError) {
        return NextResponse.json(
          { error: { code: err.code, message: err.message } },
          { status: err.status }
        );
      }

      console.error('[UNHANDLED_ERROR]', err);
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Đã có lỗi xảy ra, vui lòng thử lại sau' } },
        { status: 500 }
      );
    }
  };
}