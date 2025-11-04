-- Nino360 — Step 4: ATS / Talent Module
-- Production-grade Applicant Tracking System with AI parsing, matching, and automation

-- Schema
create schema if not exists ats;

-- JOBS / REQUISITIONS
create table if not exists ats.jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  code text not null,
  title text not null,
  department text,
  location text,
  remote boolean default true,
  employment_type text check (employment_type in ('C2C','W2','Contract','Contract-to-Hire','Full-Time')),
  description text,
  skills_required text[],
  skills_nice text[],
  headcount int2 default 1,
  budget_currency text default 'USD',
  bill_rate_max numeric(14,2),
  pay_rate_max numeric(14,2),
  status text not null default 'draft' check (status in ('draft','open','on_hold','closed','cancelled')),
  hiring_manager uuid references core.users(id) on delete set null,
  recruiter_id uuid references core.users(id) on delete set null,
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, code)
);
create index if not exists idx_ats_jobs_tenant on ats.jobs(tenant_id);
create index if not exists idx_ats_jobs_status on ats.jobs(status);

-- CANDIDATES
create table if not exists ats.candidates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  source text default 'upload' check (source in ('upload','sourced','referral','job_board','vendor','crm')),
  full_name text not null,
  email text,
  phone text,
  location text,
  work_auth text,
  remote boolean default true,
  relocation boolean default false,
  headline text,
  summary text,
  skills text[],
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  resume_url text,
  rate_currency text default 'USD',
  bill_rate_min numeric(14,2),
  bill_rate_max numeric(14,2),
  availability_date date,
  tags text[] default '{}',
  status text default 'active' check (status in ('active','on_hold','placed','blacklist')),
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_ats_candidates_tenant on ats.candidates(tenant_id);
create index if not exists idx_ats_candidates_skills on ats.candidates using gin (skills);
create index if not exists idx_ats_candidates_status on ats.candidates(status);

-- APPLICATIONS (candidate ↔ job)
create table if not exists ats.applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  job_id uuid not null references ats.jobs(id) on delete cascade,
  candidate_id uuid not null references ats.candidates(id) on delete cascade,
  status text not null default 'applied',
  score numeric(5,2) default 0,
  owner_id uuid references core.users(id) on delete set null,
  source text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, candidate_id)
);

-- Add stage column if it doesn't exist (migration from older schema)
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'ats' and table_name = 'applications' and column_name = 'stage'
  ) then
    alter table ats.applications add column stage text not null default 'applied' check (stage in ('applied','screen','manager_review','interview','offer','hired','rejected'));
  end if;
  
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'ats' and table_name = 'applications' and column_name = 'stage_changed_at'
  ) then
    alter table ats.applications add column stage_changed_at timestamptz default now();
  end if;
end $$;

create index if not exists idx_ats_apps_tenant_job on ats.applications(tenant_id, job_id);
create index if not exists idx_ats_apps_stage on ats.applications(stage);

-- ACTIVITIES / NOTES
create table if not exists ats.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  application_id uuid references ats.applications(id) on delete cascade,
  candidate_id uuid references ats.candidates(id) on delete cascade,
  job_id uuid references ats.jobs(id) on delete cascade,
  actor_user_id uuid references core.users(id) on delete set null,
  kind text not null check (kind in ('note','email','call','task','status_change')),
  body text,
  created_at timestamptz default now()
);
create index if not exists idx_ats_activities_tenant on ats.activities(tenant_id);

-- INTERVIEWS
create table if not exists ats.interviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  application_id uuid not null references ats.applications(id) on delete cascade,
  round_no int2 default 1,
  panel jsonb default '[]'::jsonb,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  location text,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled','no_show')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_ats_interviews_tenant on ats.interviews(tenant_id);
create index if not exists idx_ats_interviews_app on ats.interviews(application_id);

-- FEEDBACK / SCORECARDS
create table if not exists ats.feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  interview_id uuid references ats.interviews(id) on delete cascade,
  reviewer_id uuid references core.users(id) on delete set null,
  scores jsonb default '{}'::jsonb,
  decision text check (decision in ('advance','hold','reject')),
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_ats_feedback_tenant on ats.feedback(tenant_id);

-- ASSESSMENTS
create table if not exists ats.assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  application_id uuid not null references ats.applications(id) on delete cascade,
  kind text check (kind in ('mcq','coding_link','case')),
  details jsonb default '{}'::jsonb,
  assigned_at timestamptz default now(),
  completed_at timestamptz,
  score numeric(5,2)
);
create index if not exists idx_ats_assessments_tenant on ats.assessments(tenant_id);

-- OFFERS
create table if not exists ats.offers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  application_id uuid not null references ats.applications(id) on delete cascade,
  currency text default 'USD',
  base numeric(14,2),
  bonus numeric(14,2),
  benefits jsonb default '{}'::jsonb,
  letter_url text,
  status text default 'draft' check (status in ('draft','pending_approval','sent','accepted','declined','withdrawn')),
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_ats_offers_tenant on ats.offers(tenant_id);

-- MATCHES (AI scoring cache)
create table if not exists ats.matches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  job_id uuid not null references ats.jobs(id) on delete cascade,
  candidate_id uuid not null references ats.candidates(id) on delete cascade,
  score numeric(5,2) not null,
  factors jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(job_id, candidate_id)
);
create index if not exists idx_ats_matches_tenant_job on ats.matches(tenant_id, job_id);
create index if not exists idx_ats_matches_score on ats.matches(score desc);

-- RLS POLICIES
alter table ats.jobs enable row level security;
alter table ats.candidates enable row level security;
alter table ats.applications enable row level security;
alter table ats.activities enable row level security;
alter table ats.interviews enable row level security;
alter table ats.feedback enable row level security;
alter table ats.assessments enable row level security;
alter table ats.offers enable row level security;
alter table ats.matches enable row level security;

-- Jobs RLS
drop policy if exists jobs_tenant_isolation on ats.jobs;
create policy jobs_tenant_isolation on ats.jobs
  using (tenant_id = sec.current_tenant_id());

drop policy if exists jobs_select on ats.jobs;
create policy jobs_select on ats.jobs for select
  using (sec.has_feature('talent.jobs'));

drop policy if exists jobs_insert on ats.jobs;
create policy jobs_insert on ats.jobs for insert
  with check (sec.has_feature('talent.jobs') and sec.has_perm('talent.jobs.create'));

drop policy if exists jobs_update on ats.jobs;
create policy jobs_update on ats.jobs for update
  using (sec.has_feature('talent.jobs') and sec.has_perm('talent.jobs.update'));

drop policy if exists jobs_delete on ats.jobs;
create policy jobs_delete on ats.jobs for delete
  using (sec.has_feature('talent.jobs') and sec.has_perm('talent.jobs.delete'));

-- Candidates RLS
drop policy if exists candidates_tenant_isolation on ats.candidates;
create policy candidates_tenant_isolation on ats.candidates
  using (tenant_id = sec.current_tenant_id());

drop policy if exists candidates_select on ats.candidates;
create policy candidates_select on ats.candidates for select
  using (sec.has_feature('talent.jobs'));

drop policy if exists candidates_insert on ats.candidates;
create policy candidates_insert on ats.candidates for insert
  with check (sec.has_feature('talent.jobs'));

drop policy if exists candidates_update on ats.candidates;
create policy candidates_update on ats.candidates for update
  using (sec.has_feature('talent.jobs'));

-- Applications RLS
drop policy if exists applications_tenant_isolation on ats.applications;
create policy applications_tenant_isolation on ats.applications
  using (tenant_id = sec.current_tenant_id());

drop policy if exists applications_select on ats.applications;
create policy applications_select on ats.applications for select
  using (sec.has_feature('talent.jobs'));

drop policy if exists applications_insert on ats.applications;
create policy applications_insert on ats.applications for insert
  with check (sec.has_feature('talent.jobs'));

drop policy if exists applications_update on ats.applications;
create policy applications_update on ats.applications for update
  using (sec.has_feature('talent.jobs'));

-- Activities RLS
drop policy if exists activities_tenant_isolation on ats.activities;
create policy activities_tenant_isolation on ats.activities
  using (tenant_id = sec.current_tenant_id());

drop policy if exists activities_select on ats.activities;
create policy activities_select on ats.activities for select
  using (sec.has_feature('talent.jobs'));

drop policy if exists activities_insert on ats.activities;
create policy activities_insert on ats.activities for insert
  with check (sec.has_feature('talent.jobs'));

-- Interviews RLS
drop policy if exists interviews_tenant_isolation on ats.interviews;
create policy interviews_tenant_isolation on ats.interviews
  using (tenant_id = sec.current_tenant_id());

drop policy if exists interviews_select on ats.interviews;
create policy interviews_select on ats.interviews for select
  using (sec.has_feature('talent.interviews'));

drop policy if exists interviews_insert on ats.interviews;
create policy interviews_insert on ats.interviews for insert
  with check (sec.has_feature('talent.interviews'));

drop policy if exists interviews_update on ats.interviews;
create policy interviews_update on ats.interviews for update
  using (sec.has_feature('talent.interviews'));

-- Feedback RLS
drop policy if exists feedback_tenant_isolation on ats.feedback;
create policy feedback_tenant_isolation on ats.feedback
  using (tenant_id = sec.current_tenant_id());

drop policy if exists feedback_select on ats.feedback;
create policy feedback_select on ats.feedback for select
  using (sec.has_feature('talent.interviews'));

drop policy if exists feedback_insert on ats.feedback;
create policy feedback_insert on ats.feedback for insert
  with check (sec.has_feature('talent.interviews'));

-- Assessments RLS
drop policy if exists assessments_tenant_isolation on ats.assessments;
create policy assessments_tenant_isolation on ats.assessments
  using (tenant_id = sec.current_tenant_id());

drop policy if exists assessments_select on ats.assessments;
create policy assessments_select on ats.assessments for select
  using (sec.has_feature('talent.assessments'));

drop policy if exists assessments_insert on ats.assessments;
create policy assessments_insert on ats.assessments for insert
  with check (sec.has_feature('talent.assessments'));

-- Offers RLS
drop policy if exists offers_tenant_isolation on ats.offers;
create policy offers_tenant_isolation on ats.offers
  using (tenant_id = sec.current_tenant_id());

drop policy if exists offers_select on ats.offers;
create policy offers_select on ats.offers for select
  using (sec.has_feature('talent.offers'));

drop policy if exists offers_insert on ats.offers;
create policy offers_insert on ats.offers for insert
  with check (sec.has_feature('talent.offers'));

drop policy if exists offers_update on ats.offers;
create policy offers_update on ats.offers for update
  using (sec.has_feature('talent.offers'));

-- Matches RLS
drop policy if exists matches_tenant_isolation on ats.matches;
create policy matches_tenant_isolation on ats.matches
  using (tenant_id = sec.current_tenant_id());

drop policy if exists matches_select on ats.matches;
create policy matches_select on ats.matches for select
  using (sec.has_feature('talent.match_ai'));

drop policy if exists matches_insert on ats.matches;
create policy matches_insert on ats.matches for insert
  with check (sec.has_feature('talent.match_ai'));

-- Add enabled_by_default column to core.features if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'core' and table_name = 'features' and column_name = 'enabled_by_default'
  ) then
    alter table core.features add column enabled_by_default boolean default true;
  end if;
end $$;

-- Add ATS features to core.features if not exists
insert into core.features (key, name, description, module, enabled_by_default)
values
  ('talent.jobs', 'Job Requisitions', 'Create and manage job requisitions', 'talent', true),
  ('talent.parse_resume', 'AI Resume Parsing', 'Parse resumes with AI to extract skills and experience', 'talent', false),
  ('talent.parse_jd', 'AI JD Authoring', 'Generate job descriptions with AI assistance', 'talent', false),
  ('talent.match_ai', 'AI Candidate Matching', 'Score and rank candidates against jobs with AI', 'talent', false),
  ('talent.interviews', 'Interview Scheduling', 'Schedule and manage interviews with panels', 'talent', true),
  ('talent.offers', 'Offer Management', 'Create and track job offers', 'talent', true),
  ('talent.assessments', 'Assessments & Scorecards', 'Manage assessments and interview feedback', 'talent', true)
on conflict (key) do nothing;

-- Sample data
do $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_job_id uuid;
  v_candidate_id uuid;
  v_app_id uuid;
begin
  -- Get first tenant and user
  select id into v_tenant_id from core.tenants limit 1;
  select id into v_user_id from core.users limit 1;

  if v_tenant_id is not null and v_user_id is not null then
    -- Sample job
    insert into ats.jobs (tenant_id, code, title, department, location, employment_type, description, skills_required, status, hiring_manager, recruiter_id, opened_at)
    values (
      v_tenant_id,
      'JOB-001',
      'Senior Full Stack Developer',
      'Engineering',
      'Remote',
      'Full-Time',
      'We are seeking an experienced Full Stack Developer to join our team.',
      array['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      'open',
      v_user_id,
      v_user_id,
      now()
    )
    returning id into v_job_id;

    -- Sample candidate
    insert into ats.candidates (tenant_id, full_name, email, phone, location, work_auth, skills, headline, status, created_by)
    values (
      v_tenant_id,
      'John Doe',
      'john.doe@example.com',
      '+1-555-0100',
      'San Francisco, CA',
      'USC',
      array['React', 'TypeScript', 'Node.js', 'AWS'],
      'Senior Software Engineer with 8+ years experience',
      'active',
      v_user_id
    )
    returning id into v_candidate_id;

    -- Sample application
    insert into ats.applications (tenant_id, job_id, candidate_id, stage, score, owner_id, source)
    values (
      v_tenant_id,
      v_job_id,
      v_candidate_id,
      'screen',
      85.5,
      v_user_id,
      'upload'
    )
    returning id into v_app_id;

    -- Sample activity
    insert into ats.activities (tenant_id, application_id, candidate_id, job_id, actor_user_id, kind, body)
    values (
      v_tenant_id,
      v_app_id,
      v_candidate_id,
      v_job_id,
      v_user_id,
      'note',
      'Initial screening completed. Strong technical background.'
    );
  end if;
end $$;
