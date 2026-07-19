import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/db';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
}
