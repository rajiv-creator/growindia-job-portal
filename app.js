;(function(){
  const { createClient } = window.supabase
  const supabase = createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.sb = { supabase };

  async function currentUser(){ const { data:{ user } } = await supabase.auth.getUser(); return user }
  async function signOut(){ await supabase.auth.signOut(); window.location.href="/index.html" }
  async function sendMagicLink(email){
    const { error } = await supabase.auth.signInWithOtp({
      email, options:{ emailRedirectTo: window.__SITE_URL__ + "/dashboard.html" }
    }); if(error) throw error; return true
  }

  // Storage helpers (public bucket for MVP)
  async function ensureBucket(){ try{ await supabase.storage.createBucket('resumes', { public: true }) }catch(e){} }
  async function uploadResume(file, userId){
    if(!file) return null
    await ensureBucket()
    const path = `${userId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('resumes').upload(path, file, { upsert:true })
    if(error) throw error
    const { data } = supabase.storage.from('resumes').getPublicUrl(path)
    return data.publicUrl
  }

  window.sbAuth = { currentUser, signOut, sendMagicLink }
  window.sbUploads = { uploadResume }
})();

