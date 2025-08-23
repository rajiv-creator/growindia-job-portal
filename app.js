// --- Supabase client (reads from config.js) ---
if (!window.__SUPABASE_URL__ || !window.__SUPABASE_ANON_KEY__) {
  console.error('Missing Supabase config: set __SUPABASE_URL__ and __SUPABASE_ANON_KEY__ in config.js');
}

const supabase = window.supabase.createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // handles magic-link return
    }
  }
);

// Roles that count as admin
const ADMIN_ROLES = ['admin', 'super_admin'];

// Expose a tiny helper namespace
window.sb = {
  supabase,
  ADMIN_ROLES
};

// --- Auth helpers used by pages ---
const roleCache = new Map(); // userId -> role

window.sbAuth = {
  async openLogin(){
    const email = prompt('Enter your email to receive a magic link:');
    if (!email) return;

    // 🔁 route via post-auth.html (decides admin vs user)
    const redirectTo = (window.__SITE_URL__ || window.location.origin) + '/post-auth.html';

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo }
    });
    if (error) {
      alert(error.message || 'Could not send magic link');
    } else {
      alert('Magic link sent! Check your inbox.');
    }
  },

  async signOut(){
    await supabase.auth.signOut();
    window.location.reload();
  },

  async currentUser(){
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user || null;
  },

  async getRole(userId){
    if (!userId) return null;
    if (roleCache.has(userId)) return roleCache.get(userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const role = error ? null : (data?.role || null);
    roleCache.set(userId, role);
    return role;
  },

  async isAdmin(){
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const role = await this.getRole(user.id);
    return ADMIN_ROLES.includes(String(role || '').toLowerCase());
  }
};

// --- Routing helper used by the "Dashboard" link in index.html ---
window.goToDashboard = async function goToDashboard(){
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return window.sbAuth.openLogin();
  }

  const isAdmin = await window.sbAuth.isAdmin();
  window.location.href = isAdmin ? '/admin.html' : '/dashboard.html';
};

// Optional: pages can react to auth changes if needed
supabase.auth.onAuthStateChange((_event, _session) => {
  // no-op
});
