/* config.js — plain JavaScript (NO <script> tags here) */

/* 1) Your real project values */
const SUPABASE_URL = "https://aaoikjrrnhjqccvdrdyjy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpjY2…"; // <-- keep your full key

/* 2) Create one shared client and expose it globally */
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "growindia-auth",
  },
});

/* -------- Helpers used by your pages (index/admin/post-auth) -------- */

/** Return the current session object (or null) */
window.getSession = async function () {
  const { data: { session } = {} } = await window.supabase.auth.getSession();
  return session ?? null;
};

/** Start magic-link sign in (opens prompt) and send user back to /post-auth.html */
window.login = async function () {
  const email = prompt("Enter your email to sign in / sign up:");
  if (!email) return;
  const { error } = await window.supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${location.origin}/post-auth.html` },
  });
  if (error) {
    alert(error.message);
  } else {
    alert("Check your email for the sign-in link.");
  }
};

/** Sign out and go to the account page */
window.logout = async function () {
  await window.supabase.auth.signOut();
  location.assign("/post-auth.html");
};

/**
 * Update the top-right auth button + Dashboard link.
 * Expects:
 *   <a id="loginLink">…</a>
 *   <a id="dashboardLink">Dashboard</a>
 */
window.refreshAuthButtons = async function () {
  const loginLink = document.getElementById("loginLink");
  const dashLink = document.getElementById("dashboardLink");
  const session = await window.getSession();

  if (session) {
    if (dashLink) dashLink.href = "/admin.html";
    if (loginLink) {
      loginLink.textContent = "Logout";
      loginLink.onclick = async (e) => {
        e.preventDefault();
        await window.logout();
      };
    }
  } else {
    if (dashLink) dashLink.href = "/post-auth.html";
    if (loginLink) {
      loginLink.textContent = "Login / Sign up";
      loginLink.onclick = (e) => {
        e.preventDefault();
        window.login();
      };
    }
  }
};
