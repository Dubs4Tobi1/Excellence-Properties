import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!rawUrl || !anonKey) {
  throw new Error('Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// If someone accidentally put the REST path in the URL, strip it:
// e.g. https://project.supabase.co/rest/v1/  ->  https://project.supabase.co
const supabaseUrl = rawUrl.replace(/\/+rest\/v1\/?$/i, '').replace(/\/+$/, '');

export const supabase = createClient(supabaseUrl, anonKey);
