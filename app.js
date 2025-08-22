<script>
// ============================
// Supabase init (from config)
// ============================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ============================
// Admin allow-list (edit emails here)
// Keep this SAME list in admin.html guard too.
// ============================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];

// ==================================================
// Central redirect after ANY login (password or magic)
// - Admins -> /admin.html
// - Everyone else -> /dashboard.html
// This DOESN'T change your existing login code.
// ==================================================
supabase.auth.onAuthStateChange(async (_event, session) => {
  const email = session?.user?.email || '';
  const isAdmin = email && ADMIN_EMAILS.includes(email);

  const target = isAdmin ? '/admin.html' : '/dashboard.html';
  const here   = location.pathname.toLowerCase();

  if (here !== target) location.href = target;
});

// ==================================================
// Helper used by header buttons/links
// Call goToDashboard() to send the user to the right place
// ==================================================
window.goToDashboard = async function goToDashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  const email   = user?.email || '';
  const isAdmin = email && ADMIN_EMAILS.includes(email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// (optional) expose for debugging
window.supabaseClient = supabase;
</script>
