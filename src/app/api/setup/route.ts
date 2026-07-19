import { NextResponse } from 'next/server'
import { Client } from 'pg'

export const dynamic = 'force-dynamic'

const SQL = `
CREATE TABLE IF NOT EXISTS ss_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT '神算黃鐵口',
  avatar_url TEXT DEFAULT 'https://i.imgur.com/LoZbIWD.jpeg',
  background_color TEXT DEFAULT '#f5f5dc',
  theme_color TEXT DEFAULT '#4a7c59',
  note_text TEXT DEFAULT E'不要重複點擊添加哦\\n前面加的會優先回復',
  admin_password TEXT DEFAULT 'admin888'
);

CREATE TABLE IF NOT EXISTS ss_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  display_name TEXT NOT NULL,
  link TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ss_pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  pixel_id TEXT DEFAULT '',
  custom_code TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS ss_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page TEXT DEFAULT '',
  ip TEXT DEFAULT ''
);

INSERT INTO ss_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO ss_contacts (platform, display_name, link, enabled, sort_order) VALUES
('line', '通過 line 與我聯繫', 'https://line.me/R/ti/p/@111jmsxv', true, 1),
('whatsapp', '通過 whatsapp 與我聯繫', 'https://wa.me/13023107970', true, 2)
ON CONFLICT DO NOTHING;
`

export async function GET() {
  const supabaseUrl = process.env.COZE_SUPABASE_URL || 'https://ygdhtrflyndrhwynmbnv.supabase.co'
  const supabaseKey = process.env.COZE_SUPABASE_SECRET_KEY || ''

  if (!supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing COZE_SUPABASE_SECRET_KEY env var' }, { status: 400 })
  }

  // Extract project ref from URL: https://xxx.supabase.co -> xxx
  const urlObj = new URL(supabaseUrl)
  const projectRef = urlObj.hostname.replace('.supabase.co', '')
  const dbHost = `db.${projectRef}.supabase.co`

  const client = new Client({
    host: dbHost,
    port: 5432,
    user: `postgres`,
    password: supabaseKey,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  })

  try {
    await client.connect()
    await client.query(SQL)

    // Verify
    const tables = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'ss_%'"
    )
    const settings = await client.query('SELECT * FROM ss_settings WHERE id = 1')
    const contacts = await client.query('SELECT * FROM ss_contacts')

    return NextResponse.json({
      success: true,
      tables: tables.rows,
      settings: settings.rows,
      contacts: contacts.rows,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  } finally {
    await client.end()
  }
}
