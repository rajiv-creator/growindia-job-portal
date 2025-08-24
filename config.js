
// config.js  (works with supabase-js v2 CDN)
// Make sure your HTML includes: <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://aaoikjrrhjqccvdrdyjy.supabase.co";   // <-- replace
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY"; eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpxY2N2ZHJkeWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODkwODIsImV4cCI6MjA2ODI2NTA4Mn0.oEbTJSk-NMiYcJW7cvWOZkN9QUoLxgSpLnzm4tI4dnk                  // <-- replace

if (!window.supabase) {
  // Create the global client (so pages can use window.supabase)
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "growindia-auth"
    }
  });
}

// tiny self-check (shows once in dev tools so you know it loaded)
console.log("[config] supabase client ready:", !!window.supabase);
