// --- Supabase client (reads from config.js) ---
if (!window.__SUPABASE_URL__ || !window.__SUPABASE_ANON_KEY__) {
  console.error('Missing Supabase config: set __SUPABASE_URL__ and __SUPABASE_ANON_KEY__ in config.js');
}

const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // handles magic-link return
    }
  }
);

// --- Single place to manage admins (keep in sync if you change) ---
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// Expose a tiny helper namespace
window.sb = {
  supabase,
  ADMIN_EMAILS,
  isAdminEmail(email){ return !!email && ADMIN_EMAILS.includes(String(email).toLowerCase()); }
};

// --- Auth helpers used by index.html buttons ---
window.sbAuth = {
  async openLogin(){
    const email = prompt('Enter your email to receive a magic link:');
    if (!email) return;

    const redirectTo = (window.__SITE_URL__ || window.location.origin) + '/dashboard.html';
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo }
    });
    if (error) {
      alert(error.message || 'Could not send magic link');
    } else {
      alert('Magic link sent! Check your inbox.');
    }
  },

  async signOut(){
    await supabase.auth.signOut();
    // Hard reload so any guards/UI update immediately
    window.location.reload();
  },

  async currentUser(){
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user || null;
  }
};

// --- Routing helper used by the "Dashboard" link in index.html ---
window.goToDashboard = async function goToDashboard(){
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If not logged in, start login flow
    return window.sbAuth.openLogin();
  }

  const email = (user.email || '').toLowerCase();
  if (window.sb.isAdminEmail(email)) {
    window.location.href = '/admin.html';
  } else {
    window.location.href = '/dashboard.html';
  }
};

// Optional: small convenience so pages can react to auth changes if needed
supabase.auth.onAuthStateChange((_event, _session) => {
  // no-op by default; index.html refreshes its buttons on load
});
