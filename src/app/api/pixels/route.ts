import { NextResponse } from 'next/server';
import { getPixels, updatePixels } from '@/lib/db';

export async function GET() {
  const pixels = await getPixels();
  return NextResponse.json(pixels);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const pixels = await updatePixels(body);
  return NextResponse.json(pixels);
}
