<!-- config.js (served from site root) -->
<script>
// ✅ REQUIRED: paste your real values here
window.SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";   // no trailing slash
window.SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

// create client (Supabase v2 CDN build exposes global `supabase`)
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  console.error("config.js: Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

window.supabase = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// convenient exports used by pages
window.sbAuth = window.supabase.auth;

// quick log to confirm init (remove if you like)
console.log("Supabase client ready:", {
  url: window.SUPABASE_URL?.slice(0, 40) + "...",
  hasKey: !!window.SUPABASE_ANON_KEY,
});
</script>
