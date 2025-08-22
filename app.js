<script>
// ===============================
// Supabase init (uses config.js)
// ===============================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ===============================
// Admin allow-list (edit emails)
// ===============================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// ===============================
// Central redirect on any login
//  - Admins  -> /admin.html
//  - Others  -> /dashboard.html
// ===============================
supabase.auth.onAuthStateChange(async (_event, session) => {
  // Update UI buttons whenever auth changes
  refreshAuthButtons();

  // If not logged in, do nothing (stay on /)
  if (!session) return;

  const email   = session.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  const target  = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only redirect if we aren't already on the right page
  const here = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// ===============================
// Global helpers
// (PUT THEM ON window so HTML can call them)
// ===============================

// Create the global object if it doesn't exist yet
window.sbAuth = window.sbAuth || {};

// 1) Open a simple login prompt (password or magic link)
window.sbAuth.openLogin = async () => {
  const email = prompt('Email:');
  if (!email) return;

  const password = prompt('Password (leave blank to get a magic link):') || '';

  if (password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.__SITE_URL__ + '/dashboard.html' }
  });
  if (error) alert(error.message);
  else alert('Magic link sent. Check your inbox.');
};

// 2) Clean logout
window.sbAuth.signOut = async () => {
  await supabase.auth.signOut();
  location.href = '/';
};

// 3) Smart dashboard button (sends admins to /admin.html)
window.goToDashboard = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const email   = user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// 4) Show/hide the Login / Logout buttons
async function refreshAuthButtons () {
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!loginBtn && !logoutBtn) return;

  const { data: { user } } = await supabase.auth.getUser();

  if (loginBtn)  loginBtn.hidden  = !!user;
  if (logoutBtn) logoutBtn.hidden = !user;
}

// Run once on load (in case user already signed in)
refreshAuthButtons();
</script>
