import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface Settings {
  siteName: string;
  avatarUrl: string;
  bgColor: string;
  themeColor: string;
  note: string;
}

export interface Contact {
  id: string;
  platform: string;
  displayName: string;
  link: string;
  active: boolean;
}

export interface Pixels {
  googleAnalytics: string;
  facebookPixel: string;
  tiktokPixel: string;
  customCode: string;
}

async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Settings
export async function getSettings(): Promise<Settings> {
  return readJson<Settings>('settings.json');
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  await writeJson('settings.json', settings);
  return settings;
}

// Contacts
export async function getContacts(): Promise<Contact[]> {
  return readJson<Contact[]>('contacts.json');
}

export async function addContact(contact: Contact): Promise<Contact[]> {
  const contacts = await getContacts();
  contact.id = Date.now().toString();
  contacts.push(contact);
  await writeJson('contacts.json', contacts);
  return contacts;
}

export async function deleteContact(id: string): Promise<Contact[]> {
  const contacts = await getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  await writeJson('contacts.json', filtered);
  return filtered;
}

export async function toggleContact(id: string): Promise<Contact[]> {
  const contacts = await getContacts();
  const updated = contacts.map(c => c.id === id ? { ...c, active: !c.active } : c);
  await writeJson('contacts.json', updated);
  return updated;
}

// Pixels
export async function getPixels(): Promise<Pixels> {
  return readJson<Pixels>('pixels.json');
}

export async function updatePixels(pixels: Pixels): Promise<Pixels> {
  await writeJson('pixels.json', pixels);
  return pixels;
}

// Auth
export const ADMIN_PASSWORD = 'admin888';

// Generic data access
export async function readData<T>(filename: string): Promise<T> {
  return readJson<T>(filename);
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  await writeJson(filename, data);
}
