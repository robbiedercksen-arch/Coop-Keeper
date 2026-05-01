import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gzoxsnszbjmatdxwyhh.supabase.co",
  "YOUR_ANON_KEY"
);