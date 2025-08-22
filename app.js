/* app.js — replace whole file with this */

// ===============================
// Supabase init (uses config.js)
// ===============================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ===============================
// Admin allow-list (edit emails here)
// Keep this SAME list in admin.html guard too.
// ===============================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// ===================================================
// Redirect only when a user has just signed in
// (prevents “always redirect on every page view”)
// ===================================================
supabase.auth.onAuthStateChange((event, session) => {
  if (event !== 'SIGNED_IN') return;                 // only after a login
  const email = session?.user?.email || '';
  const target = ADMIN_EMAILS.includes(email) ? '/admin.html'
                                              : '/dashboard.html';
  if (location.pathname !== target) location.href = target;
});

// ===================================================
// Helper APIs exposed globally (so HTML can call them)
// ===================================================
window.sbAuth = {
  async signInWithPassword({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); throw error; }
    // onAuthStateChange above will do the redirect
    return true;
  },

  // Simple prompt-based login (keeps you moving fast)
  async openLogin() {
    const email = prompt('Email:');
    if (!email) return;
    const password = prompt('Password:');
    if (!password) return;
    await window.sbAuth.signInWithPassword({ email, password });
  },

  async signOut() {
    await supabase.auth.signOut();
    // bring the user back to the public home
    location.href = '/';
  }
};

// ===================================================
// “Smart Dashboard” helper for header links/buttons
// Sends admins to /admin.html, everyone else to /dashboard.html
// ===================================================
window.goToDashboard = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || '';
  const target = ADMIN_EMAILS.includes(email) ? '/admin.html'
                                              : '/dashboard.html';
  location.href = target;
};

// ===================================================
// Optional: tiny UI helper to show/hide login/logout
// ===================================================
window.refreshAuthButtons = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const loggedIn = !!user;
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (loginBtn)  loginBtn.hidden  = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
};
document.addEventListener('DOMContentLoaded', window.refreshAuthButtons);
