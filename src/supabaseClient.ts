import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzoxsnsbzjbmatdxwyhh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6b3hzbnNiempibWF0ZHh3eWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDkzMTcsImV4cCI6MjA5MTkyNTMxN30.B6C5IukHZQKu9bPhzP9-XNFP7ypiWvccvlUf6VO5TBI";

export const supabase = createClient(supabaseUrl, supabaseKey);