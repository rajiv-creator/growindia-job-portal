;(function(){
  const { createClient } = window.supabase
  const supabase = createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.sb = { supabase };
  async function sendMagicLink(email){
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.__SITE_URL__ + "/dashboard.html" }
    });
    if (error) throw error; return true;
  }
  async function getUser(){ const { data:{ user } } = await supabase.auth.getUser(); return user; }
  async function signOut(){ await supabase.auth.signOut(); window.location.href="/index.html"; }
  window.sbAuth = { sendMagicLink, getUser, signOut };
})();
