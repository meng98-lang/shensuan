-- 设置表
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT '神算黃鐵口',
  avatar_url TEXT DEFAULT '/avatar.jpg',
  background_color TEXT DEFAULT '#f5f5dc',
  theme_color TEXT DEFAULT '#4a7c59',
  note_text TEXT DEFAULT '不要重複點擊添加哦\n前面加的會優先回復',
  admin_password TEXT DEFAULT 'admin888'
);

-- 联系方式表
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  display_name TEXT NOT NULL,
  link TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0
);

-- 像素代码表
CREATE TABLE IF NOT EXISTS pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  pixel_id TEXT DEFAULT '',
  custom_code TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT true
);

-- 点击统计表
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL,
  platform TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page TEXT DEFAULT '',
  ip TEXT DEFAULT ''
);

-- 插入默认设置
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 插入默认联系方式
INSERT INTO contacts (platform, display_name, link, enabled, order_num) VALUES
('line', '通過 line 與我聯繫', 'https://line.me/R/ti/p/@111jmsxv', true, 1),
('whatsapp', '通過 whats 與我聯繫', 'https://wa.me/13023107970', true, 2)
ON CONFLICT DO NOTHING;
