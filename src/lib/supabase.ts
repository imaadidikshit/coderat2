import { createClient } from '@supabase/supabase-js';

// Use environment variables if set in AI studio, otherwise fallback to the user's provided project details to avoid startup crash.
const defaultUrl = 'https://qxpcbhjqpxbnkwvhrdri.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cGNiaGpxcHhibmt3dmhyZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTc4ODEsImV4cCI6MjA5NjU3Mzg4MX0.kbY3rzUQbK_Qc8Vpio42qnvp_rhySwFC1N0j0K7WmHo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

