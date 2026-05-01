import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzoxsnszbjmatdxwyhh.supabase.co";
const supabaseAnonKey = "PASTE_YOUR_KEY_HERE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);