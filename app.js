// app.js (must be pure JS — no <script> tags in this file)
console.log('[app.js] loaded');
window.sbAuth = window.sbAuth || {};
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

// Helpers
const $id = (id) => document.getElementById(id);

async function refreshAuthButtons() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const loginBtn  = $id('loginBtn');
    const logoutBtn = $id('logoutBtn');
    if (loginBtn)  loginBtn.hidden  = !!user;
    if (logoutBtn) logoutBtn.hidden = !user;
  } catch (e) {
    console.error('refreshAuthButtons error', e);
  }
}

// ==============================
// Central redirect on auth state
// (Runs after magic-link or password login)
// ==============================
supabase.auth.onAuthStateChange(async (_evt, session) => {
  await refreshAuthButtons();

  const user   = session?.user || null;
  const here   = location.pathname.toLowerCase();
  const atHome = (here === '/' || here.endsWith('/index.html'));

  if (!user) {
    if (here.endsWith('/admin.html')) location.href = '/';
    return;
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  const target  = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only bounce from home; otherwise stay where the user is
  if (atHome && here !== target) location.href = target;
  if (here.endsWith('/admin.html') && !isAdmin) location.href = '/';
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

  // Simple prompt-based login
  async openLogin() {
    const email = (prompt('Email:') || '').trim();
    if (!email) return;

    const pwd = prompt('Password (leave blank for magic link):') || '';
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

  // Optional: direct magic-link sender
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
    location.href = '/';
  }
};

// Smart “Dashboard” route chooser
window.goToDashboard = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// First paint: set header buttons correctly
refreshAuthButtons();
console.log('app.js loaded; sbAuth available:', !!window.sbAuth);
