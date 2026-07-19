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

// DB row types (snake_case)
interface SettingsRow {
  id: number
  site_name: string
  avatar_url: string
  background_color: string
  theme_color: string
  note_text: string
  admin_password: string
}

interface ContactRow {
  id: string
  platform: string
  display_name: string
  link: string
  enabled: boolean
  sort_order: number
}

interface PixelRow {
  id: string
  type: string
  name: string
  pixel_id: string
  custom_code: string
  enabled: boolean
}

interface ClickRow {
  id: string
  contact_id: string
  platform: string
  timestamp: string
  page: string
  ip: string
}

// Mapping helpers
function rowToSettings(row: SettingsRow): SiteSettings {
  return {
    siteName: row.site_name,
    avatarUrl: row.avatar_url,
    backgroundColor: row.background_color,
    themeColor: row.theme_color,
    noteText: row.note_text,
    adminPassword: row.admin_password,
  }
}

function rowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    platform: row.platform,
    displayName: row.display_name,
    link: row.link,
    enabled: row.enabled,
    order: row.sort_order,
  }
}

function rowToPixel(row: PixelRow): Pixel {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    pixelId: row.pixel_id,
    customCode: row.custom_code,
    enabled: row.enabled,
  }
}

function rowToClick(row: ClickRow): Click {
  return {
    id: row.id,
    contactId: row.contact_id,
    platform: row.platform,
    timestamp: row.timestamp,
    page: row.page,
    ip: row.ip,
  }
}

const defaultSettings: SiteSettings = {
  siteName: '神算黃鐵口',
  avatarUrl: 'https://i.imgur.com/LoZbIWD.jpeg',
  backgroundColor: '#f5f5dc',
  themeColor: '#4a7c59',
  noteText: '不要重複點擊添加哦\n前面加的會優先回復',
  adminPassword: 'admin888',
}

// 设置相关
export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from('ss_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) {
    return defaultSettings
  }

  return rowToSettings(data as SettingsRow)
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const row: Partial<SettingsRow> = {}
  if (settings.siteName !== undefined) row.site_name = settings.siteName
  if (settings.avatarUrl !== undefined) row.avatar_url = settings.avatarUrl
  if (settings.backgroundColor !== undefined) row.background_color = settings.backgroundColor
  if (settings.themeColor !== undefined) row.theme_color = settings.themeColor
  if (settings.noteText !== undefined) row.note_text = settings.noteText
  if (settings.adminPassword !== undefined) row.admin_password = settings.adminPassword

  const { error } = await getSupabase()
    .from('ss_settings')
    .upsert({ id: 1, ...row })

  if (error) throw error
}

// 联系方式相关
export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await getSupabase()
    .from('ss_contacts')
    .select('*')
    .eq('enabled', true)
    .order('sort_order')

  if (error) return []
  return (data as ContactRow[]).map(rowToContact)
}

export async function getAllContacts(): Promise<Contact[]> {
  const { data, error } = await getSupabase()
    .from('ss_contacts')
    .select('*')
    .order('sort_order')

  if (error) return []
  return (data as ContactRow[]).map(rowToContact)
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  const row = {
    platform: contact.platform,
    display_name: contact.displayName,
    link: contact.link,
    enabled: contact.enabled,
    sort_order: contact.order,
  }

  const { data, error } = await getSupabase()
    .from('ss_contacts')
    .insert(row)
    .select()
    .single()

  if (error) throw error
  return rowToContact(data as ContactRow)
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<void> {
  const row: Partial<ContactRow> = {}
  if (contact.platform !== undefined) row.platform = contact.platform
  if (contact.displayName !== undefined) row.display_name = contact.displayName
  if (contact.link !== undefined) row.link = contact.link
  if (contact.enabled !== undefined) row.enabled = contact.enabled
  if (contact.order !== undefined) row.sort_order = contact.order

  const { error } = await getSupabase()
    .from('ss_contacts')
    .update(row)
    .eq('id', id)

  if (error) throw error
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('ss_contacts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 像素代码相关
export async function getPixels(): Promise<Pixel[]> {
  const { data, error } = await getSupabase()
    .from('ss_pixels')
    .select('*')
    .order('type')

  if (error) return []
  return (data as PixelRow[]).map(rowToPixel)
}

export async function upsertPixel(pixel: Pixel): Promise<void> {
  const row = {
    id: pixel.id,
    type: pixel.type,
    name: pixel.name,
    pixel_id: pixel.pixelId,
    custom_code: pixel.customCode,
    enabled: pixel.enabled,
  }

  const { error } = await getSupabase()
    .from('ss_pixels')
    .upsert(row)

  if (error) throw error
}

export async function deletePixel(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('ss_pixels')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// 点击统计相关
export async function recordClick(contactId: string, platform: string, page: string, ip: string): Promise<void> {
  const { error } = await getSupabase()
    .from('ss_clicks')
    .insert({ contact_id: contactId, platform, page, ip })

  if (error) throw error
}

export async function getClickStats(): Promise<{ clicks: Click[]; total: number; today: number }> {
  const { data: clicks, error } = await getSupabase()
    .from('ss_clicks')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) return { clicks: [], total: 0, today: 0 }

  const today = new Date().toISOString().split('T')[0]
  const todayClicks = (clicks as ClickRow[]).filter(c => c.timestamp.startsWith(today))

  return {
    clicks: (clicks as ClickRow[]).map(rowToClick),
    total: clicks.length,
    today: todayClicks.length,
  }
}
