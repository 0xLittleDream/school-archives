import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnhgfgdrzeglgvsclnil.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DivwZS6L-lwcEBueOi6N3w_oEEX5fh_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
