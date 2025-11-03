-- ============================================================================
-- Nino360 Talent Onboarding Module
-- Full employee onboarding: offer→hire, checklists, forms, background checks,
-- equipment provisioning, training plans, automation, candidate portal
-- ============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. HIRES / ONBOARDINGS
-- ============================================================================

create table if not exists talent.hires (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  application_id uuid references talent.applications(id),
  candidate_id uuid references talent.candidates(id),
  user_id uuid references auth.users(id), -- created employee id after provisioning
  hire_date date,
  start_date date not null,
  location text,
  region text,
  job_title text,
  department text,
  manager_id uuid references auth.users(id),
  status text default 'pending' check (status in ('pending','in_progress','completed','on_hold','canceled')),
  onboarding_meta jsonb default '{}'::jsonb,  -- {checklist_id, automation_run_id, provisioning, portal_token}
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_hires_tenant on talent.hires(tenant_id);
create index idx_hires_status on talent.hires(status);
create index idx_hires_start_date on talent.hires(start_date);
create index idx_hires_manager on talent.hires(manager_id);

comment on table talent.hires is 'Employee hires and onboarding records';

-- ============================================================================
-- 2. CHECKLISTS & TEMPLATES
-- ============================================================================

create table if not exists talent.onboard_checklists (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  name text not null,
  description text,
  scope jsonb default '{}'::jsonb,    -- {roles:['engineer'], region:['US'], plan:'standard'}
  items jsonb not null,               -- [{key,label,kind:'task'|'form'|'approval'|'training', owner_role:'hr'|'manager'|'it', due_days:int, sla_hours:int, meta:{...}}]
  created_by uuid references auth.users(id),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_checklists_tenant on talent.onboard_checklists(tenant_id);
create index idx_checklists_active on talent.onboard_checklists(active);

comment on table talent.onboard_checklists is 'Onboarding checklist templates';

-- ============================================================================
-- 3. ONBOARDING TASKS (per hire instance)
-- ============================================================================

create table if not exists talent.onboard_tasks (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  hire_id uuid not null references talent.hires(id) on delete cascade,
  key text not null,
  label text not null,
  description text,
  kind text not null check (kind in ('task','form','approval','training','provision')),
  owner_id uuid references auth.users(id), -- assigned person
  owner_role text,                          -- fallback role
  status text default 'pending' check (status in ('pending','in_progress','completed','blocked','skipped','canceled')),
  due_at timestamptz,
  sla_due_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_tasks_tenant on talent.onboard_tasks(tenant_id);
create index idx_tasks_hire on talent.onboard_tasks(hire_id);
create index idx_tasks_status on talent.onboard_tasks(status);
create index idx_tasks_owner on talent.onboard_tasks(owner_id);
create index idx_tasks_due on talent.onboard_tasks(due_at);

comment on table talent.onboard_tasks is 'Onboarding tasks per hire';

-- ============================================================================
-- 4. FORMS & SIGNATURES
-- ============================================================================

create table if not exists talent.onboard_forms (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  hire_id uuid not null references talent.hires(id) on delete cascade,
  form_key text not null,           -- 'i9','tax_w4','nda','bank_setup'
  form_name text not null,
  data jsonb default '{}'::jsonb,   -- filled data (PII -- access controlled)
  signed boolean default false,
  signed_by uuid references auth.users(id) null, -- or candidate contact email hashed
  signed_at timestamptz,
  storage_key text,                 -- uploaded doc key in Supabase Storage
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_forms_tenant on talent.onboard_forms(tenant_id);
create index idx_forms_hire on talent.onboard_forms(hire_id);
create index idx_forms_key on talent.onboard_forms(form_key);
create index idx_forms_signed on talent.onboard_forms(signed);

comment on table talent.onboard_forms is 'Onboarding forms and signatures (PII protected)';

-- ============================================================================
-- 5. BACKGROUND CHECKS
-- ============================================================================

create table if not exists talent.background_checks (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  hire_id uuid not null references talent.hires(id) on delete cascade,
  provider text,                    -- 'sterling'|'checkr' (stub)
  provider_ref text,
  package_key text,                 -- 'standard'|'enhanced'
  status text default 'requested' check (status in ('requested','in_progress','clear','consider','failed','error')),
  result jsonb default '{}'::jsonb,
  requested_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_bg_tenant on talent.background_checks(tenant_id);
create index idx_bg_hire on talent.background_checks(hire_id);
create index idx_bg_status on talent.background_checks(status);

comment on table talent.background_checks is 'Background check orchestration';

-- ============================================================================
-- 6. PROVISIONING EVENTS (equipment/access)
-- ============================================================================

create table if not exists talent.provision_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  hire_id uuid not null references talent.hires(id) on delete cascade,
  type text not null,         -- 'device_request','account_create','email_setup','software_access'
  provider text null,
  status text default 'requested' check (status in ('requested','in_progress','done','failed')),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_provision_tenant on talent.provision_events(tenant_id);
create index idx_provision_hire on talent.provision_events(hire_id);
create index idx_provision_type on talent.provision_events(type);
create index idx_provision_status on talent.provision_events(status);

comment on table talent.provision_events is 'Equipment and access provisioning events';

-- ============================================================================
-- 7. AUTOMATION RUNS & LOGS
-- ============================================================================

create table if not exists talent.onboard_automation_runs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  hire_id uuid references talent.hires(id),
  flow_key text not null,
  status text default 'running' check (status in ('running','completed','failed','paused')),
  log jsonb default '[]'::jsonb,    -- step logs
  context jsonb default '{}'::jsonb,
  started_at timestamptz default now(),
  finished_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_automation_tenant on talent.onboard_automation_runs(tenant_id);
create index idx_automation_hire on talent.onboard_automation_runs(hire_id);
create index idx_automation_status on talent.onboard_automation_runs(status);

comment on table talent.onboard_automation_runs is 'Automation workflow runs and logs';

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table talent.hires                    enable row level security;
alter table talent.onboard_checklists       enable row level security;
alter table talent.onboard_tasks            enable row level security;
alter table talent.onboard_forms            enable row level security;
alter table talent.background_checks        enable row level security;
alter table talent.provision_events         enable row level security;
alter table talent.onboard_automation_runs  enable row level security;

-- RLS Policies
create policy rls_hires on talent.hires 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_checklists on talent.onboard_checklists 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_tasks on talent.onboard_tasks 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_forms on talent.onboard_forms 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_bg on talent.background_checks 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_prov on talent.provision_events 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

create policy rls_runs on talent.onboard_automation_runs 
  for all using (tenant_id = app.current_tenant_id()) 
  with check (tenant_id = app.current_tenant_id());

-- ============================================================================
-- 9. UTILITY FUNCTIONS
-- ============================================================================

-- Generate hire number
create or replace function talent.generate_hire_number(p_tenant_id uuid)
returns text as $$
declare
  v_count int;
  v_year text;
begin
  v_year := to_char(now(), 'YY');
  select count(*) into v_count from talent.hires where tenant_id = p_tenant_id;
  return 'HIRE-' || v_year || '-' || lpad((v_count + 1)::text, 4, '0');
end;
$$ language plpgsql;

-- Check if hire is overdue
create or replace function talent.is_hire_overdue(p_hire_id uuid)
returns boolean as $$
declare
  v_overdue_count int;
begin
  select count(*) into v_overdue_count
  from talent.onboard_tasks
  where hire_id = p_hire_id
    and status in ('pending', 'in_progress')
    and due_at < now();
  return v_overdue_count > 0;
end;
$$ language plpgsql;

-- Calculate hire progress percentage
create or replace function talent.calculate_hire_progress(p_hire_id uuid)
returns int as $$
declare
  v_total int;
  v_completed int;
begin
  select count(*) into v_total from talent.onboard_tasks where hire_id = p_hire_id;
  select count(*) into v_completed from talent.onboard_tasks where hire_id = p_hire_id and status = 'completed';
  if v_total = 0 then return 0; end if;
  return round((v_completed::numeric / v_total::numeric) * 100);
end;
$$ language plpgsql;

-- ============================================================================
-- 10. SEED DATA - Default Checklists
-- ============================================================================

-- Standard New Hire Checklist
insert into talent.onboard_checklists (tenant_id, name, description, scope, items, active)
select 
  id as tenant_id,
  'Standard New Hire' as name,
  'Default onboarding checklist for all new hires' as description,
  '{"roles": ["all"], "region": ["all"]}'::jsonb as scope,
  '[
    {"key": "welcome_email", "label": "Send Welcome Email", "kind": "task", "owner_role": "hr", "due_days": 0, "sla_hours": 24, "meta": {}},
    {"key": "i9_form", "label": "Complete I-9 Form", "kind": "form", "owner_role": "candidate", "due_days": 3, "sla_hours": 72, "meta": {"form_key": "i9"}},
    {"key": "tax_w4", "label": "Complete W-4 Tax Form", "kind": "form", "owner_role": "candidate", "due_days": 3, "sla_hours": 72, "meta": {"form_key": "tax_w4"}},
    {"key": "nda_sign", "label": "Sign NDA", "kind": "form", "owner_role": "candidate", "due_days": 1, "sla_hours": 24, "meta": {"form_key": "nda"}},
    {"key": "background_check", "label": "Background Check", "kind": "approval", "owner_role": "hr", "due_days": 7, "sla_hours": 168, "meta": {"package": "standard"}},
    {"key": "device_request", "label": "Request Device", "kind": "provision", "owner_role": "it", "due_days": 5, "sla_hours": 120, "meta": {"type": "device_request"}},
    {"key": "email_setup", "label": "Setup Email Account", "kind": "provision", "owner_role": "it", "due_days": 1, "sla_hours": 24, "meta": {"type": "email_setup"}},
    {"key": "software_access", "label": "Grant Software Access", "kind": "provision", "owner_role": "it", "due_days": 1, "sla_hours": 24, "meta": {"type": "software_access"}},
    {"key": "training_plan", "label": "Assign Training Plan", "kind": "training", "owner_role": "manager", "due_days": 7, "sla_hours": 168, "meta": {}},
    {"key": "buddy_assign", "label": "Assign Onboarding Buddy", "kind": "task", "owner_role": "manager", "due_days": 3, "sla_hours": 72, "meta": {}},
    {"key": "first_day_checkin", "label": "First Day Check-in", "kind": "task", "owner_role": "manager", "due_days": 0, "sla_hours": 8, "meta": {}}
  ]'::jsonb as items,
  true as active
from app.tenants
where not exists (
  select 1 from talent.onboard_checklists 
  where name = 'Standard New Hire' and tenant_id = app.tenants.id
)
limit 1;

-- Engineering New Hire Checklist
insert into talent.onboard_checklists (tenant_id, name, description, scope, items, active)
select 
  id as tenant_id,
  'Engineering New Hire' as name,
  'Specialized onboarding for engineering roles' as description,
  '{"roles": ["engineer", "developer"], "region": ["all"]}'::jsonb as scope,
  '[
    {"key": "welcome_email", "label": "Send Welcome Email", "kind": "task", "owner_role": "hr", "due_days": 0, "sla_hours": 24, "meta": {}},
    {"key": "i9_form", "label": "Complete I-9 Form", "kind": "form", "owner_role": "candidate", "due_days": 3, "sla_hours": 72, "meta": {"form_key": "i9"}},
    {"key": "tax_w4", "label": "Complete W-4 Tax Form", "kind": "form", "owner_role": "candidate", "due_days": 3, "sla_hours": 72, "meta": {"form_key": "tax_w4"}},
    {"key": "nda_sign", "label": "Sign NDA", "kind": "form", "owner_role": "candidate", "due_days": 1, "sla_hours": 24, "meta": {"form_key": "nda"}},
    {"key": "background_check", "label": "Background Check", "kind": "approval", "owner_role": "hr", "due_days": 7, "sla_hours": 168, "meta": {"package": "enhanced"}},
    {"key": "laptop_request", "label": "Request Laptop", "kind": "provision", "owner_role": "it", "due_days": 5, "sla_hours": 120, "meta": {"type": "device_request", "device": "laptop"}},
    {"key": "email_setup", "label": "Setup Email Account", "kind": "provision", "owner_role": "it", "due_days": 1, "sla_hours": 24, "meta": {"type": "email_setup"}},
    {"key": "github_access", "label": "Grant GitHub Access", "kind": "provision", "owner_role": "it", "due_days": 1, "sla_hours": 24, "meta": {"type": "software_access", "tool": "github"}},
    {"key": "aws_access", "label": "Grant AWS Access", "kind": "provision", "owner_role": "it", "due_days": 2, "sla_hours": 48, "meta": {"type": "software_access", "tool": "aws"}},
    {"key": "slack_invite", "label": "Invite to Slack", "kind": "provision", "owner_role": "it", "due_days": 1, "sla_hours": 24, "meta": {"type": "software_access", "tool": "slack"}},
    {"key": "eng_training", "label": "Assign Engineering Training", "kind": "training", "owner_role": "manager", "due_days": 7, "sla_hours": 168, "meta": {"courses": ["git_basics", "code_review", "architecture"]}},
    {"key": "buddy_assign", "label": "Assign Engineering Buddy", "kind": "task", "owner_role": "manager", "due_days": 3, "sla_hours": 72, "meta": {}},
    {"key": "codebase_tour", "label": "Codebase Tour", "kind": "task", "owner_role": "manager", "due_days": 2, "sla_hours": 48, "meta": {}},
    {"key": "first_pr", "label": "Submit First PR", "kind": "task", "owner_role": "candidate", "due_days": 14, "sla_hours": 336, "meta": {}}
  ]'::jsonb as items,
  true as active
from app.tenants
where not exists (
  select 1 from talent.onboard_checklists 
  where name = 'Engineering New Hire' and tenant_id = app.tenants.id
)
limit 1;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
