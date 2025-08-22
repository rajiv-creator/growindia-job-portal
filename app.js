<!-- app.js (replace everything) -->
<script>
// ==========================
// Supabase init (uses config.js)
// ==========================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ==========================
// Admin allow-list
// put your admin emails here
// ==========================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// =====================================================
// Central redirect AFTER login (password OR magic link)
// Sends admins -> /admin.html, others -> /dashboard.html
// =====================================================
supabase.auth.onAuthStateChange(async (_event, session) => {
  const user = session?.user;
  if (!user) return; // not signed in yet

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  const target  = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only redirect if we aren't already there
  const here = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// ===========================================
// Optional: email+password sign-in helper
// (if you already have one, keep yours;
// this version avoids adding redirect logic,
// because the listener above handles it)
// ===========================================
async function handleSignInWithPassword(e) {
  e?.preventDefault?.();
  const email = document.getElementById('loginEmail')?.value?.trim();
  const password = document.getElementById('loginPassword')?.value || '';
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

// =====================================================
// “Dashboard” button helper — use this for the header
// =====================================================
async function goToDashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
}

// expose helpers for onclick= attributes
window.handleSignInWithPassword = handleSignInWithPassword;
window.goToDashboard           = goToDashboard;
</script>
