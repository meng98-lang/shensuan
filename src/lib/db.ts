import { getSupabase } from './supabase'

export interface SiteSettings {
  siteName: string
  avatarUrl: string
  backgroundColor: string
  themeColor: string
  noteText: string
  adminPassword: string
}

export interface Contact {
  id: string
  platform: string
  displayName: string
  link: string
  enabled: boolean
  order: number
}

export interface Pixel {
  id: string
  type: string
  name: string
  pixelId: string
  customCode: string
  enabled: boolean
}

export interface Click {
  id: string
  contactId: string
  platform: string
  timestamp: string
  page: string
  ip: string
}

// 设置相关
export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from('settings')
    .select('*')
    .single()

  if (error || !data) {
    return {
      siteName: '神算黃鐵口',
      avatarUrl: '/avatar.jpg',
      backgroundColor: '#f5f5dc',
      themeColor: '#4a7c59',
      noteText: '不要重複點擊添加哦\n前面加的會優先回復',
      adminPassword: 'admin888'
    }
  }

  return data as SiteSettings
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const { error } = await getSupabase()
    .from('settings')
    .upsert({ id: 1, ...settings })

  if (error) throw error
}

// 联系方式相关
export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await getSupabase()
    .from('contacts')
    .select('*')
    .eq('enabled', true)
    .order('order')

  if (error) return []
  return data as Contact[]
}

export async function getAllContacts(): Promise<Contact[]> {
  const { data, error } = await getSupabase()
    .from('contacts')
    .select('*')
    .order('order')

  if (error) return []
  return data as Contact[]
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  const { data, error } = await getSupabase()
    .from('contacts')
    .insert(contact)
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<void> {
  const { error } = await getSupabase()
    .from('contacts')
    .update(contact)
    .eq('id', id)

  if (error) throw error
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 像素代码相关
export async function getPixels(): Promise<Pixel[]> {
  const { data, error } = await getSupabase()
    .from('pixels')
    .select('*')
    .order('type')

  if (error) return []
  return data as Pixel[]
}

export async function updatePixels(pixels: Pixel[]): Promise<void> {
  for (const pixel of pixels) {
    const { error } = await getSupabase()
      .from('pixels')
      .upsert(pixel)

    if (error) throw error
  }
}

// 点击统计相关
export async function recordClick(contactId: string, platform: string, page: string, ip: string): Promise<void> {
  const { error } = await getSupabase()
    .from('clicks')
    .insert({ contactId, platform, page, ip })

  if (error) throw error
}

export async function getClickStats(): Promise<{ clicks: Click[]; total: number; today: number }> {
  const { data: clicks, error } = await getSupabase()
    .from('clicks')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) return { clicks: [], total: 0, today: 0 }

  const today = new Date().toISOString().split('T')[0]
  const todayClicks = clicks.filter(c => c.timestamp.startsWith(today))

  return {
    clicks: clicks as Click[],
    total: clicks.length,
    today: todayClicks.length
  }
}
