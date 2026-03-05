import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey
  && supabaseUrl !== 'https://your-project-id.supabase.co'
  && supabaseAnonKey !== 'your-anon-key-here');

// Only create client if credentials are set to avoid throwing on startup
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
