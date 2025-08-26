
// ---- /config.js (PLAIN JS, no <script> tags) ----
window.SUPABASE_URL = "https://aaoikjrrhjqccvdrdyjy.supabase.co";   // ← replace
window.SUPABASE_ANON_KEY = “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpxY2N2ZHJkeWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODkwODIsImV4cCI6MjA2ODI2NTA4Mn0.oEbTJSk-NMiYcJW7cvWOZkN9QUoLxgSpLnzm4tI4dnk";               // ← replace

// Create Supabase client
window.supabase = supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Export for pages
window.sbAuth = window.supabase.auth;

// (optional) quick log
console.log("Supabase ready:", {
  url: window.SUPABASE_URL,
  hasKey: !!window.SUPABASE_ANON_KEY
});
