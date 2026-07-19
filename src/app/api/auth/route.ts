import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { password } = await request.json();
  const settings = await getSettings();
  if (password === settings.adminPassword) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
}
