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
// =====================================================
supabase.auth.onAuthStateChange(async (_event, session) => {
  const email = session?.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  const target = isAdmin ? '/admin.html' : '/dashboard.html';

  const here = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// ================================
// Helpers exposed globally
// ================================

window.goToDashboard = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = ADMIN_EMAILS.includes(user?.email || '');
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

window.sbAuth = {
  async signInWithPassword(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); throw error; }
  },
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

window.refreshAuthButtons = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (loginBtn && logoutBtn) {
    loginBtn.style.display  = user ? 'none' : '';
    logoutBtn.style.display = user ? ''    : 'none';
  }
};

// ================================
// One-time boot wiring
// - hooks Login/Logout buttons
// - auto-routes ANY "Dashboard" link
//   (works even if it's still href="dashboard.html")
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (loginBtn)  loginBtn.addEventListener('click', () => window.sbAuth.openLogin());
  if (logoutBtn) logoutBtn.addEventListener('click', () => window.sbAuth.signOut());
  window.refreshAuthButtons();

  // Intercept any link that points to dashboard.html OR
  // has a helper class/attr, and route smartly.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = (a.getAttribute('href') || '').toLowerCase();
    const wantsDashboard =
      a.classList.contains('js-dashboard') ||
      a.hasAttribute('data-dashboard') ||
      /dashboard\.html$/.test(href);

    if (wantsDashboard) {
      e.preventDefault();
      window.goToDashboard();
    }
  });
});
