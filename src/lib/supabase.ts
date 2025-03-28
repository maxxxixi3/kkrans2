import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Use Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client with type safety
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export default supabase;
