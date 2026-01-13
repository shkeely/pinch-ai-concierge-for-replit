import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bhtxgnqtnfvuehddkasg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FV9GdWPBR-SIzJk8bNGenQ_aFBLEccq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const isSupabaseConfigured = true;
