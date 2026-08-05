import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | https://xmyqimdfizemgwhqtniv.supabase.co;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteXFpbWRmaXplbWd3aHF0bml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjU5NDEsImV4cCI6MjEwMTM0MTk0MX0.pF6ckftcgD6B4fgQqwlSkO0voaqWoTUtozvZtlRUsC8;

if (!rawUrl || !anonKey) {
  throw new Error('Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// If someone accidentally put the REST path in the URL, strip it:
// e.g. https://project.supabase.co/rest/v1/  ->  https://project.supabase.co
const supabaseUrl = rawUrl.replace(/\/+rest\/v1\/?$/i, '').replace(/\/+$/, '');

export const supabase = createClient(supabaseUrl, anonKey);
