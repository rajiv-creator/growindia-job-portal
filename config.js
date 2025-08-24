// config.js (GrowIndia) — replace the two strings below with YOUR real values.
// IMPORTANT: Keep the values in quotes (single or double).

const SUPABASE_URL = "https://aaoikjrrhjqccvdrdyjy.supabase.co";       // ← replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpxY2N2ZHJkeWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODkwODIsImV4cCI6MjA2ODI2NTA4Mn0.oEbTJSk-NMiYcJW7cvWOZkN9QUoLxgSpLnzm4tI4dnk";                          // ← replace

// Create (or reuse) the global Supabase client.
// Requires: <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
window.supabase = window.supabase ?? supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "growindia-auth"
    }
  }
);
