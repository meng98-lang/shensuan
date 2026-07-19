import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.COZE_SUPABASE_URL || 'https://ygdhtrflyndrhwynmbnv.supabase.co'
    const key = process.env.COZE_SUPABASE_SECRET_KEY || 'placeholder'
    _supabase = createClient(url, key)
  }
  return _supabase
}
