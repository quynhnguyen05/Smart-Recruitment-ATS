import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function requireRole(allowedRoles: string[]) {
  return (req: Request): { userId: string; role: string } | NextResponse => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Thiếu token' } },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };
      if (!allowedRoles.includes(payload.role)) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Không có quyền truy cập' } },
          { status: 403 }
        );
      }
      return payload;
    } catch {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Token không hợp lệ' } },
        { status: 401 }
      );
    }
  };
}