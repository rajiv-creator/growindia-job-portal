<script>
// ==============================
// Supabase init (uses config.js)
// ==============================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ==============================
// Admin allow-list (edit emails)
// ==============================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// Small helpers
const $id = (id) => document.getElementById(id);

async function refreshAuthButtons() {
  const { data: { user } } = await supabase.auth.getUser();
  const loginBtn  = $id('loginBtn');
  const logoutBtn = $id('logoutBtn');
  if (loginBtn)  loginBtn.hidden  = !!user;
  if (logoutBtn) logoutBtn.hidden = !user;
}

// ==============================
// Central redirect on auth state
// (Runs after magic-link or password login)
// ==============================
supabase.auth.onAuthStateChange(async (_evt, session) => {
  await refreshAuthButtons();

  const user  = session?.user || null;
  const here  = location.pathname.toLowerCase();
  const atHome = (here === '/' || here.endsWith('/index.html'));

  // If logged out and on admin page, send to home
  if (!user) {
    if (here.endsWith('/admin.html')) location.href = '/';
    return; // stay wherever else we are
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  const target  = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only bounce from the home page; otherwise stay where the user is
  if (atHome) {
    if (here !== target) location.href = target;
  } else if (here.endsWith('/admin.html') && !isAdmin) {
    // Non-admin trying to open admin directly
    location.href = '/';
  }
});

// ==============================
// Global helpers (for onclick)
// ==============================
window.sbAuth = {
  // Email + password sign-in
  async signInWithPassword({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    return { error };
  },

  // Prompt UI for simple login (your header Login button calls this)
  async openLogin() {
    const email = (prompt('Email:') || '').trim();
    if (!email) return;

    const pwd = prompt('Password (leave blank to receive a magic link):') || '';
    if (pwd) {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) alert(error.message);
      return;
    }
    // Magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.__SITE_URL__ || window.location.origin }
    });
    if (error) alert(error.message);
    else alert('Check your email for the magic link.');
  },

  // Optional: direct magic-link sender (kept for compatibility)
  async sendMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.__SITE_URL__ || window.location.origin }
    });
    if (error) alert(error.message);
    return { error };
  },

  async signOut() {
    await supabase.auth.signOut();
    location.href = '/'; // take them back to home; no auto-redirect from home
  }
};

// Smart “Dashboard” helper: Admin → /admin.html, others → /dashboard.html
window.goToDashboard = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// First paint: set button visibility right away
refreshAuthButtons();
</script>
