import { NextResponse } from 'next/server';
import { getPixels, upsertPixel, deletePixel } from '@/lib/db';
import type { Pixel } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pixels = await getPixels();
  return NextResponse.json(pixels);
}

export async function POST(request: Request) {
  const body = await request.json();
  const pixel: Pixel = {
    id: body.id || crypto.randomUUID(),
    type: body.type || '',
    name: body.name || '',
    pixelId: body.pixelId || '',
    customCode: body.customCode || '',
    enabled: body.enabled !== false,
  };
  await upsertPixel(pixel);
  const pixels = await getPixels();
  return NextResponse.json(pixels);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deletePixel(id);
  const pixels = await getPixels();
  return NextResponse.json(pixels);
}
