<!-- config.js -->
<!-- Requires the Supabase v2 CDN to be loaded before this file:
     <script src="https://unpkg.com/@supabase/supabase-js@2"></script> -->

<script>
  // ⬇️ put YOUR real values here
  const SUPABASE_URL      = "https://YOUR-PROJECT-REF.supabase.co";
  const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

  // IMPORTANT: do NOT guard this behind `if (!window.supabase)`
  // We intentionally assign the CLIENT to window.supabase
  // (overriding the library namespace object provided by the CDN).
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "growindia-auth"
    }
  });
</script>
