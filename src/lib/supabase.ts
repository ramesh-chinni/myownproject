import { createClient } from "@supabase/supabase-js";

// Retrieve environment variables with fallback to existing Supabase project credentials
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://xjfecltgrewjvqkgbxwz.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_261JcJ6C6lJOPUVeLmzoFA_NPXlFXoB";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
