import { NextResponse } from 'next/server';
import { getContacts, createContact, deleteContact, updateContact } from '@/lib/db';

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const contacts = await createContact(body);
  return NextResponse.json(contacts);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const contacts = await deleteContact(id);
  return NextResponse.json(contacts);
}

export async function PATCH(request: Request) {
  const { id, enabled } = await request.json();
  const contacts = await updateContact(id, enabled);
  return NextResponse.json(contacts);
}
