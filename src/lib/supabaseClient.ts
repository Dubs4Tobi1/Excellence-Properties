import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xmyqimdfizemgwhqtniv.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteXFpbWRmaXplbWd3aHF0bml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjU5NDEsImV4cCI6MjEwMTM0MTk0MX0.pF6ckftcgD6B4fgQqwlSkO0voaqWoTUtozvZtlRUsC8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
