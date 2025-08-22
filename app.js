// ================================
// Supabase init (uses config.js)
// ================================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ================================
// Admin allow-list (edit emails here)
// Keep the SAME list in admin.html guard too.
// ================================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// =====================================================
// Central redirect after ANY login (password or magic)
// - Admins  -> /admin.html
// - Others  -> /dashboard.html
// This does NOT change your login UI; it only reacts
// once a session exists.
// =====================================================
supabase.auth.onAuthStateChange(async (_event, session) => {
  const email = session?.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  const target = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only redirect if we're not already on that page
  const here = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// ================================
// Public helpers the pages call
// (attached to window)
// ================================

// Decide where “Dashboard” should go for this user
window.goToDashboard = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = ADMIN_EMAILS.includes(user?.email || '');
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// Very small auth helper used by your buttons
window.sbAuth = {
  async signInWithPassword(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      throw error;
    }
  },
  // Simple prompt-based login (keeps things minimal)
  async openLogin() {
    const email = prompt('Email:');
    if (!email) return;
    const password = prompt('Password:');
    if (!password) return;
    await window.sbAuth.signInWithPassword(email, password);
  },
  async signOut() {
    await supabase.auth.signOut();
    location.href = '/';
  }
};

// Show/hide Login vs Logout based on session
window.refreshAuthButtons = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (loginBtn && logoutBtn) {
    loginBtn.style.display  = user ? 'none' : '';
    logoutBtn.style.display = user ? ''    : 'none';
  }
};

// Wire buttons when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (loginBtn)  loginBtn.addEventListener('click', () => window.sbAuth.openLogin());
  if (logoutBtn) logoutBtn.addEventListener('click', () => window.sbAuth.signOut());
  window.refreshAuthButtons();
});
