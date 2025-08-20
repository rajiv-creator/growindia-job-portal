Vercel deploy (minimal):
1) Put your Supabase URL + anon key in config.js. Keep __SITE_URL__ = window.location.origin.
2) Create a GitHub repo (web UI) and upload all files.
3) Vercel → New Project → Import Git Repository → Framework: Other, Build: None, Output dir: / → Deploy.
4) Copy the Vercel URL (https://yourapp.vercel.app) and set it as Site URL in Supabase Auth. Add /dashboard.html as an Additional Redirect.
5) Visit the site, Login, create company, post job, apply.
