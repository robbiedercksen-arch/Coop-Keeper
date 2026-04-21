import { createClient } from "@supabase/supabase-js";

// ⚠️ Replace these with your real values later
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

// Safe fallback so app doesn't crash if not configured yet
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;