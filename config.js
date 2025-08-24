
const SUPABASE_URL = "https://aaoikjrrhjqccvdrdyjy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhb2lranJyaGpxY2N2ZHJkeWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODkwODIsImV4cCI6MjA2ODI2NTA4Mn0.oEbTJSk-NMiYcJW7cvWOZkN9QUoLxgSpLnzm4tI4dnk";

// IMPORTANT: assign the **client** to window.supabase
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "growindia-auth",
  },
});

