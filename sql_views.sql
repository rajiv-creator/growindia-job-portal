-- Public jobs view with robust types (casts enum to text)
create or replace view public.v_job_public as
select
  j.id, j.title, j.description, j.location,
  j.employment::text as employment,
  j.salary_min, j.salary_max, j.currency, j.is_remote,
  j.status::text as status,
  j.created_at,
  c.name as company_name, c.website as company_website
from public.jobs j
join public.companies c on c.id = j.company_id
where j.status::text in ('Active','active');

-- Employer applications view
create or replace view public.v_employer_applications as
select
  a.id           as application_id,
  a.created_at   as applied_at,
  a.status::text as application_status,
  p.full_name    as applicant_name,
  p.email        as applicant_email,
  a.resume_url,
  j.id           as job_id,
  j.title        as job_title,
  j.location     as job_location,
  c.id           as company_id,
  c.name         as company_name,
  c.owner_id
from public.applications a
join public.jobs        j on j.id = a.job_id
join public.companies   c on c.id = j.company_id
join public.profiles    p on p.id = a.applicant_id
where c.owner_id = auth.uid();
