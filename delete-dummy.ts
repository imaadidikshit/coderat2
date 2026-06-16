import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
     env[match[1]] = match[2];
  }
});

const SUPABASE_URL = env['VITE_SUPABASE_URL'] || '';
const SUPABASE_SERVICE_ROLE_KEY = env['VITE_SUPABASE_ANON_KEY'] || '';

if (!SUPABASE_URL) {
  console.log("No Supabase URL found.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const { data: workspaces } = await supabase.from('workspaces').select('id');
    const { data: projects, error } = await supabase.from('projects').delete().eq('repo_name', 'default-app');
    console.log("Deleted old dummy projects.", error);
    
    // Also delete any 'Core App (Staging)' project
    const { data: p2, error: e2 } = await supabase.from('projects').delete().eq('name', 'Core App (Staging)');
    console.log("Deleted old Core App projects.", e2);
}
main();
