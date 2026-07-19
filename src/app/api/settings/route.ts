import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await updateSettings(body);
  const settings = await getSettings();
  return NextResponse.json(settings);
}
