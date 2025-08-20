;(function(){
  const { createClient } = window.supabase;
  const supabase = createClient(
    window.__SUPABASE_URL__,
    window.__SUPABASE_ANON_KEY__,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
  window.sb = { supabase };

  // -------- Auth helpers --------
  async function currentUser(){ const { data:{ user } } = await supabase.auth.getUser(); return user }
  async function signOut(){ await supabase.auth.signOut(); window.location.href="/index.html" }
  async function sendMagicLink(email){
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{ emailRedirectTo: (window.__SITE_URL__ || window.location.origin) + "/dashboard.html" }
    });
    if(error) throw error; return true;
  }

  // -------- Storage: private resumes --------
  async function ensureBucket(){
    try{ await supabase.storage.createBucket('resumes', { public:false }) }catch(_e){}
  }

  // Upload resume -> returns a PATH (not public URL)
  async function uploadResume(file, userId){
    if(!file) return null;
    await ensureBucket();
    const key = `${userId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('resumes').upload(key, file, { upsert:true });
    if(error) throw error;
    return key; // store path in applications.resume_url
  }

  // Turn a stored path (or an old public URL) into a clickable link
  async function signedUrlMaybe(pathOrUrl, expiresSec=3600){
    if(!pathOrUrl) return null;
    if(/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // old public link still works
    const { data, error } = await supabase.storage.from('resumes').createSignedUrl(pathOrUrl, expiresSec);
    if(error) return null;
    return data.signedUrl;
  }

  // -------- Lookup helpers (used in admin job form) --------
  async function getLookups(){
    const [industries, jobTypes, levels, locations] = await Promise.all([
      supabase.from('lookup_industries').select('name').order('name'),
      supabase.from('lookup_job_types').select('name').order('name'),
      supabase.from('lookup_levels').select('name').order('name'),
      supabase.from('lookup_locations').select('name').order('name'),
    ]);
    return {
      industries: (industries.data||[]).map(x=>x.name),
      jobTypes:   (jobTypes.data||[]).map(x=>x.name),
      levels:     (levels.data||[]).map(x=>x.name),
      locations:  (locations.data||[]).map(x=>x.name),
    };
  }

  window.sbAuth    = { currentUser, signOut, sendMagicLink };
  window.sbUploads = { uploadResume, signedUrlMaybe };
  window.sbData    = { getLookups };
})();
