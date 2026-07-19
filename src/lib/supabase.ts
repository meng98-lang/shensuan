import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.COZE_SUPABASE_URL || 'https://ygdhtrflyndrhwynmbnv.supabase.co'
const supabaseKey = process.env.COZE_SUPABASE_SECRET_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
