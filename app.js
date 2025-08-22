<script>
// ================================
// Supabase init (uses config.js)
// ================================
const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// ================
// Admin allow-list
// ================
const ADMIN_EMAILS = ['rajiv.growindia1@gmail.com'];  // <-- edit if you add more admins

// ===================================================
// Central redirect after ANY login (password or magic)
// ===================================================
supabase.auth.onAuthStateChange(async (_event, session) => {
  const email = session?.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);

  const target = isAdmin ? '/admin.html' : '/dashboard.html';

  // Only redirect if we're not already there
  const here = location.pathname.toLowerCase();
  if (here !== target) location.href = target;
});

// =======================================
// Small helper: toggle Login/Logout UI
// =======================================
async function refreshAuthButtons() {
  const { data: { session } } = await supabase.auth.getSession();
  const loggedIn = !!session;

  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginBtn)  loginBtn.hidden  = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
}
window.refreshAuthButtons = refreshAuthButtons;

// =======================================
// Route the "Dashboard" button/link smartly
// =======================================
window.goToDashboard = async function goToDashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(email);
  location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// =======================================
// Authentication helpers exposed on window
// =======================================
window.sbAuth = {
  // Magic-link flow
  async sendMagicLink() {
    const email = prompt('Enter your email for a magic link:');
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // where the email link should return after clicking
        emailRedirectTo: (window.__SITE_URL__ || window.location.origin) + '/dashboard.html'
      }
    });
    if (error) { alert(error.message); return; }
    alert('Check your email for the sign-in link.');
  },

  // Password flow (optional)
  async signInWithPassword(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); throw error; }
  },

  // Simple prompt-based login (optional helper)
  async openLogin() {
    // Use magic link by default
    return window.sbAuth.sendMagicLink();
    // If you prefer password prompts instead, comment the line above
    // and uncomment the lines below:
    /*
    const email = prompt('Email:');
    if (!email) return;
    const password = prompt('Password:');
    if (!password) return;
    await window.sbAuth.signInWithPassword(email, password);
    */
  },

  async signOut() {
    await supabase.auth.signOut();
    location.href = '/';
  }
};

// First render of login/logout buttons
refreshAuthButtons();
</script>
