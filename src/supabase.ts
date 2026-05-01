import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gzoxsnsbzjbmatdxwyhh.supabase.co/rest/v1/",
  "sb_publishable_EYpEiEJ_Q4ElsyvyI1ZDtw_q9lOgU_A"
);