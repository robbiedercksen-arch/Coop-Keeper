import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzoxsnsbzjbmatdxwyhh.supabase.co";
const supabaseAnonKey = "sb_publishable_EYpEiEJ_Q4ElsyvyI1ZDtw_q9lOgU_A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);