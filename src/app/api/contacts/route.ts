import { NextResponse } from 'next/server';
import { getContacts, getAllContacts, createContact, deleteContact, updateContact } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const contacts = await getAllContacts();
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const contact = await createContact(body);
  return NextResponse.json(contact);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteContact(id);
  const contacts = await getAllContacts();
  return NextResponse.json(contacts);
}

export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();
  await updateContact(id, updates);
  const contacts = await getAllContacts();
  return NextResponse.json(contacts);
}
