/* config.js — plain JavaScript (NO <script> tags here) */

const SUPABASE_URL = "https://aaokjgrnhjqccvrdyjy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpxY2N2cmR5ank..."; // your real key

// Important:
// - Keep the global "supabase" SDK as-is (it must still have .createClient)
// - Expose a *client instance* as "sb" (and auth shorthand as "sbAuth")
if (!window.sb) {
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "growindia-auth",
    },
  });
}
window.sbAuth = window.sb.auth;
