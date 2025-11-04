-- ============================================================================
-- Nino360 HRMS — Step 5: Bench Management
-- ============================================================================
-- Schema: bench
-- Tables: consultants, allocations, forecasts, activities
-- Features: bench.tracking, bench.allocation, bench.forecasting, bench.ai_recommend
-- ============================================================================

-- Create bench schema
create schema if not exists bench;

-- ============================================================================
-- Table: bench.consultants
-- ============================================================================
create table if not exists bench.consultants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  hr_employee_id uuid,                           -- optional link to hr.employees (future)
  first_name text,                              -- old column
  last_name text,                               -- old column
  full_name text,                               -- new column
  email text,
  phone text,
  location text,
  work_auth text,
  remote boolean default true,
  relocation boolean default false,
  skills text[] default '{}',
  seniority text,                                -- 'Junior','Mid','Senior','Lead'
  job_role text,                                 -- 'FE Engineer'
  last_project text,
  rolloff_date date,                             -- when available/bench started
  availability_date date,
  cost_rate numeric(14,2),                       -- internal cost
  bill_rate_expected numeric(14,2),
  summary text,
  resume_url text,
  status text default 'bench' check (status in ('bench','allocated','pipeline','inactive','placed')),
  tags text[] default '{}',
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add missing columns for migration from older schema versions
do $$
begin
  -- Add full_name column if missing (for migration from first_name/last_name schema)
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'full_name'
  ) then
    alter table bench.consultants add column full_name text;
    -- Migrate data from first_name/last_name if they exist
    if exists (
      select 1 from information_schema.columns 
      where table_schema = 'bench' 
      and table_name = 'consultants' 
      and column_name = 'first_name'
    ) then
      update bench.consultants 
      set full_name = concat_ws(' ', first_name, last_name)
      where full_name is null;
    end if;
  end if;

  -- Add work_auth column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'work_auth'
  ) then
    alter table bench.consultants add column work_auth text;
  end if;

  -- Add rolloff_date if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'rolloff_date'
  ) then
    alter table bench.consultants add column rolloff_date date;
  end if;

  -- Add availability_date if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'availability_date'
  ) then
    alter table bench.consultants add column availability_date date;
  end if;

  -- Add job_role if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'job_role'
  ) then
    alter table bench.consultants add column job_role text;
  end if;

  -- Add summary if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'summary'
  ) then
    alter table bench.consultants add column summary text;
  end if;

  -- Add resume_url if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'resume_url'
  ) then
    alter table bench.consultants add column resume_url text;
  end if;

  -- Add remote column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'remote'
  ) then
    alter table bench.consultants add column remote boolean default true;
  end if;

  -- Add relocation column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'relocation'
  ) then
    alter table bench.consultants add column relocation boolean default false;
  end if;

  -- Add seniority column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'seniority'
  ) then
    alter table bench.consultants add column seniority text;
  end if;

  -- Add last_project column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'last_project'
  ) then
    alter table bench.consultants add column last_project text;
  end if;

  -- Add cost_rate column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'cost_rate'
  ) then
    alter table bench.consultants add column cost_rate numeric(14,2);
  end if;

  -- Add bill_rate_expected column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'bill_rate_expected'
  ) then
    alter table bench.consultants add column bill_rate_expected numeric(14,2);
  end if;

  -- Add tags column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'bench' 
    and table_name = 'consultants' 
    and column_name = 'tags'
  ) then
    alter table bench.consultants add column tags text[] default '{}';
  end if;
end $$;

create index if not exists idx_bench_consultants_tenant on bench.consultants(tenant_id);
create index if not exists idx_bench_consultants_skills on bench.consultants using gin (skills);
create index if not exists idx_bench_consultants_status on bench.consultants(tenant_id, status);
create index if not exists idx_bench_consultants_rolloff on bench.consultants(tenant_id, rolloff_date) where rolloff_date is not null;

-- ============================================================================
-- Table: bench.allocations
-- ============================================================================
create table if not exists bench.allocations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  consultant_id uuid not null references bench.consultants(id) on delete cascade,
  kind text not null check (kind in ('ats_job','internal','client_direct')),
  job_id uuid references ats.jobs(id) on delete set null,  -- if kind='ats_job'
  title text,                                 -- allocation title
  start_date date,
  end_date date,
  percent int2 default 100 check (percent between 1 and 100),
  status text default 'proposed' check (status in ('proposed','confirmed','active','completed','cancelled')),
  notes text,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_bench_allocations_tenant on bench.allocations(tenant_id);
create index if not exists idx_bench_allocations_consultant on bench.allocations(consultant_id);
create index if not exists idx_bench_allocations_job on bench.allocations(job_id) where job_id is not null;
create index if not exists idx_bench_allocations_status on bench.allocations(tenant_id, status);

-- ============================================================================
-- Table: bench.forecasts
-- ============================================================================
create table if not exists bench.forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  source text not null check (source in ('sales','pm','hr','ai')),
  title text not null,
  needed_skills text[] default '{}',
  headcount int2 default 1,
  start_date date,
  end_date date,
  probability numeric(5,2) default 50.0,
  notes text,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_bench_forecasts_tenant on bench.forecasts(tenant_id);
create index if not exists idx_bench_forecasts_skills on bench.forecasts using gin (needed_skills);
create index if not exists idx_bench_forecasts_dates on bench.forecasts(tenant_id, start_date, end_date);

-- ============================================================================
-- Table: bench.activities
-- ============================================================================
create table if not exists bench.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  consultant_id uuid references bench.consultants(id) on delete cascade,
  actor_user_id uuid references core.users(id) on delete set null,
  kind text not null check (kind in ('note','update','email','call','status_change')),
  body text,
  created_at timestamptz default now()
);

create index if not exists idx_bench_activities_tenant on bench.activities(tenant_id);
create index if not exists idx_bench_activities_consultant on bench.activities(consultant_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================
alter table bench.consultants enable row level security;
alter table bench.allocations enable row level security;
alter table bench.forecasts enable row level security;
alter table bench.activities enable row level security;

-- Consultants
drop policy if exists consultants_select on bench.consultants;
create policy consultants_select on bench.consultants
  for select using (tenant_id = sec.current_tenant_id());

drop policy if exists consultants_insert on bench.consultants;
create policy consultants_insert on bench.consultants
  for insert with check (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.tracking')
  );

drop policy if exists consultants_update on bench.consultants;
create policy consultants_update on bench.consultants
  for update using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.tracking')
  );

drop policy if exists consultants_delete on bench.consultants;
create policy consultants_delete on bench.consultants
  for delete using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.tracking')
  );

-- Allocations
drop policy if exists allocations_select on bench.allocations;
create policy allocations_select on bench.allocations
  for select using (tenant_id = sec.current_tenant_id());

drop policy if exists allocations_insert on bench.allocations;
create policy allocations_insert on bench.allocations
  for insert with check (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.allocation')
  );

drop policy if exists allocations_update on bench.allocations;
create policy allocations_update on bench.allocations
  for update using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.allocation')
  );

drop policy if exists allocations_delete on bench.allocations;
create policy allocations_delete on bench.allocations
  for delete using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.allocation')
  );

-- Forecasts
drop policy if exists forecasts_select on bench.forecasts;
create policy forecasts_select on bench.forecasts
  for select using (tenant_id = sec.current_tenant_id());

drop policy if exists forecasts_insert on bench.forecasts;
create policy forecasts_insert on bench.forecasts
  for insert with check (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.forecasting')
  );

drop policy if exists forecasts_update on bench.forecasts;
create policy forecasts_update on bench.forecasts
  for update using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.forecasting')
  );

drop policy if exists forecasts_delete on bench.forecasts;
create policy forecasts_delete on bench.forecasts
  for delete using (
    tenant_id = sec.current_tenant_id() 
    and sec.has_feature('bench.forecasting')
  );

-- Activities
drop policy if exists activities_select on bench.activities;
create policy activities_select on bench.activities
  for select using (tenant_id = sec.current_tenant_id());

drop policy if exists activities_insert on bench.activities;
create policy activities_insert on bench.activities
  for insert with check (tenant_id = sec.current_tenant_id());

drop policy if exists activities_update on bench.activities;
create policy activities_update on bench.activities
  for update using (tenant_id = sec.current_tenant_id());

drop policy if exists activities_delete on bench.activities;
create policy activities_delete on bench.activities
  for delete using (tenant_id = sec.current_tenant_id());

-- ============================================================================
-- Features (ensure bench features exist)
-- ============================================================================
-- Add module column if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'core' 
    and table_name = 'features' 
    and column_name = 'module'
  ) then
    alter table core.features add column module text;
  end if;
end $$;

-- Insert bench features
insert into core.features (key, name, description, module, enabled_by_default)
values
  ('bench.tracking', 'Bench Tracking', 'Track consultants on bench with skills and availability', 'bench', true),
  ('bench.allocation', 'Bench Allocation', 'Allocate bench resources to jobs and projects', 'bench', true),
  ('bench.forecasting', 'Bench Forecasting', 'Forecast supply vs demand and utilization', 'bench', true),
  ('bench.ai_recommend', 'AI Recommendations', 'AI-powered consultant-to-job matching', 'bench', false)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  module = excluded.module,
  enabled_by_default = excluded.enabled_by_default;

-- ============================================================================
-- Sample Data
-- ============================================================================
-- Insert sample bench consultant
insert into bench.consultants (
  tenant_id,
  full_name,
  email,
  phone,
  location,
  work_auth,
  remote,
  skills,
  seniority,
  job_role,
  last_project,
  rolloff_date,
  availability_date,
  cost_rate,
  bill_rate_expected,
  summary,
  status
)
select
  t.id,
  'John Doe',
  'john.doe@example.com',
  '+1-555-0123',
  'San Francisco, CA',
  'US Citizen',
  true,
  array['React', 'TypeScript', 'Node.js', 'AWS'],
  'Senior',
  'Senior Full Stack Engineer',
  'E-commerce Platform Modernization',
  current_date - interval '7 days',
  current_date,
  85.00,
  165.00,
  'Experienced full-stack engineer with 8+ years building scalable web applications. Strong expertise in React, TypeScript, and cloud infrastructure.',
  'bench'
from core.tenants t
where t.slug = 'acme-corp'
limit 1
on conflict do nothing;
