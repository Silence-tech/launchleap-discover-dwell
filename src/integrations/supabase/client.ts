// Supabase client configuration using environment variables
// Make sure these environment variables are set in your .env file:
// - VITE_SUPABASE_URL
// - VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://coaxwkvzkacazkibocuz.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYXh3a3Z6a2FjYXpraWJvY3V6Iiwicm9sZUUiOiJhbm9uIiwiaWF0IjoxNzU2NzU2Njk1LCJleHAiOjIwNzIzMzI2OTV9.Wi6g2ajkwMh0Cg6kNahc615nHbh5ispq1JguDS5WDlc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});