import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if env vars are missing to prevent app crash
const createSupabaseClient = (): SupabaseClient => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables - using placeholder. Please update your secrets.');
    // Use placeholder values to prevent crash - auth will fail gracefully
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key',
      {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    );
  }
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
