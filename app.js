/* app.js — GrowIndia (drop-in)
   Requires config.js to define:
   window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__, window.__SITE_URL__
*/

/* -------------------- Client -------------------- */
if (!window.__SUPABASE_URL__ || !window.__SUPABASE_ANON_KEY__) {
  console.error(
    'Missing Supabase config. Set __SUPABASE_URL__ and __SUPABASE_ANON_KEY__ in config.js'
  );
}

const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // handles magic-link return on post-auth.html
    },
  }
);

/* Expose a small namespace other scripts can reuse */
const ADMIN_ROLES = ['admin', 'super_admin'];
window.sb = { supabase, ADMIN_ROLES };

/* -------------------- Auth helpers -------------------- */
const roleCache = new Map(); // userId -> role

window.sbAuth = {
  /**
   * Opens a prompt, sends a magic link, and redirects back to /post-auth.html
   * which then routes user → dashboard or admin based on role.
   */
  async openLogin() {
    const email = prompt('Enter your email to receive a magic link:');
    if (!email) return;

    const redirectTo =
      (window.__SITE_URL__ || window.location.origin) + '/post-auth.html';

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      alert(error.message || 'Could not send magic link');
    } else {
      alert('Magic link sent! Check your inbox.');
    }
  },

  /**
   * Alternate entry if you already have the email.
   * Usage: sbAuth.sendMagicLink('user@domain.com')
   */
  async sendMagicLink(email) {
    if (!email) return this.openLogin();
    const redirectTo =
      (window.__SITE_URL__ || window.location.origin) + '/post-auth.html';
    const { error } = await supabase.auth.signInWithOtp({
      email: String(email).trim(),
      options: { emailRedirectTo: redirectTo },
    });
    if (error) alert(error.message || 'Could not send magic link');
    else alert('Magic link sent! Check your inbox.');
  },

  async signOut() {
    await supabase.auth.signOut();
    // send them home so protected pages don’t flash
    window.location.href = '/';
  },

  async currentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user || null;
  },

  async getRole(userId) {
    if (!userId) return null;
    if (roleCache.has(userId)) return roleCache.get(userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const role = error ? null : data?.role ?? null;
    roleCache.set(userId, role);
    return role;
  },

  async isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const role = await this.getRole(user.id);
    return ADMIN_ROLES.includes(String(role || '').toLowerCase());
  },
};

/* -------------------- Routing helper -------------------- */
/** Used by the “Dashboard” nav link on index.html */
window.goToDashboard = async function goToDashboard() {
  const user = await window.sbAuth.currentUser();
  if (!user) {
    return window.sbAuth.openLogin();
  }
  const isAdmin = await window.sbAuth.isAdmin();
  window.location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

/* Optional: listen for auth changes (no-op hook for pages) */
supabase.auth.onAuthStateChange((_event, _session) => {
  // Intentionally blank; pages that care already call currentUser()/isAdmin()
});
