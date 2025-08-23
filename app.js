<!-- app.js (REPLACE WHOLE FILE) -->
<script>
// ================================
// Supabase init (uses config.js)
// ================================
const supabase = window.supabase?.createClient
  ? window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__)
  : window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__);

// also expose for admin.html and other inline scripts
window.supabase = supabase;

// ================================
// Admin allow-list (edit emails here)
// ================================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// ---------------- Helper: get by id
const $id = (id) => document.getElementById(id);

// ---------------- Show/Hide Login/Logout based on session
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

// ---------------- Smart Dashboard
async function goToDashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  const target = isAdmin ? '/admin.html' : '/dashboard.html';
  if (location.pathname.toLowerCase() !== target) location.href = target;
}

// ================================
// Central redirect on auth state
// (Runs after magic-link or password login)
// ================================
supabase.auth.onAuthStateChange(async (evt, session) => {
  await refreshAuthButtons();
  // Only redirect when signed in
  if (!session) return;
  const email = session.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  const target = isAdmin ? '/admin.html' : '/dashboard.html';
  const here   = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// ================================
// Auth helpers exported globally
// ================================
async function signInWithPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { alert(error.message); throw error; }
}

async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.__SITE_URL__ || window.location.origin }});
  if (error) { alert(error.message); throw error; }
  alert('Magic link sent. Check your email.');
}

async function openLogin() {
  const email = prompt('Email:');
  if (!email) return;
  const magic = confirm(`Send magic link to ${email}?  Press Cancel for password login.`);
  if (magic) return sendMagicLink(email);
  const password = prompt('Password:');
  if (!password) return;
  await signInWithPassword(email, password);
}

async function signOut() {
  await supabase.auth.signOut();
  await refreshAuthButtons();
  location.href = '/';
}

// export to window (so HTML onclick or other scripts can use it)
window.sbAuth = { openLogin, signInWithPassword, sendMagicLink, signOut };
window.goToDashboard = goToDashboard;

// ================================
// Auto-wire buttons/links (no HTML edits needed)
// ================================
document.addEventListener('DOMContentLoaded', async () => {
  // show/hide Login/Logout now
  await refreshAuthButtons();

  // wire buttons if present
  $id('loginBtn')?.addEventListener('click', (e) => { e.preventDefault(); window.sbAuth.openLogin(); });
  $id('logoutBtn')?.addEventListener('click', (e) => { e.preventDefault(); window.sbAuth.signOut(); });

  // Make any plain link <a href="dashboard.html"> smart (admins -> admin.html)
  // We ONLY intercept the header-style "dashboard.html" (no querystring).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href$="dashboard.html"]');
    if (!a) return;
    // ignore "Apply" links like dashboard.html?apply=123
    try {
      const url = new URL(a.getAttribute('href'), location.origin);
      if (url.search) return; // has ?query -> likely apply; don't intercept
    } catch {}
    e.preventDefault();
    window.goToDashboard();
  });
});

console.log('app.js loaded; sbAuth available:', typeof window.sbAuth === 'object');
</script>
