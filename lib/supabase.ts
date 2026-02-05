import { createClient } from '@supabase/supabase-js';

// These should be in your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

if (supabaseUrl.includes('your-project')) {
    console.error("⚠️ CRITICAL: Supabase URL is not set! The app is trying to connect to a placeholder URL. Please set VITE_SUPABASE_URL in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

