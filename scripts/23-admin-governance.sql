-- Step 2: Admin Governance (Approvals, Modules, Enhanced Admin UI)
-- Extends Step 1 (RBAC/FBAC/Audit/AI/RAG)

-- ============================================================================
-- 0) Helper Function - sec.is_admin()
-- ============================================================================

-- Add sec.is_admin() helper function for RLS policies
create or replace function sec.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 
    from core.user_roles ur
    join core.roles r on r.id = ur.role_id
    where ur.user_id = sec.current_user_id()
      and r.key = 'admin'
  );
$$;

-- ============================================================================
-- A) Admin Approvals Workflow
-- ============================================================================

create table if not exists core.admin_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  kind text not null check (kind in ('invite','join_request','role_change')),
  subject jsonb not null,  -- {email?, user_id?, requested_roles?[], note?}
  status text not null default 'pending' check (status in ('pending','approved','rejected','revoked')),
  decided_by uuid references core.users(id) on delete set null,
  decided_at timestamptz,
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_admin_approvals_tenant on core.admin_approvals(tenant_id);
create index if not exists idx_admin_approvals_status on core.admin_approvals(status);

alter table core.admin_approvals enable row level security;

create policy admin_approvals_read on core.admin_approvals 
  for select using (tenant_id = sec.current_tenant_id());

create policy admin_approvals_write on core.admin_approvals 
  for all using (
    tenant_id = sec.current_tenant_id() and sec.is_admin()
  );

-- ============================================================================
-- B) Modules & Navigation Mapping (for UI gating)
-- ============================================================================

create table if not exists core.modules (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  path text not null,
  icon text,
  created_at timestamptz default now()
);

-- Add description column if it doesn't exist (for existing tables)
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'core' 
    and table_name = 'modules' 
    and column_name = 'description'
  ) then
    alter table core.modules add column description text;
  end if;
end $$;

create table if not exists core.module_features (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references core.modules(id) on delete cascade,
  feature_id uuid not null references core.features(id) on delete cascade,
  unique(module_id, feature_id)
);

alter table core.modules enable row level security;
alter table core.module_features enable row level security;

create policy modules_read on core.modules for select using (true);
create policy module_features_read on core.module_features for select using (true);
create policy modules_write on core.modules for all using (sec.is_admin());
create policy module_features_write on core.module_features for all using (sec.is_admin());

-- ============================================================================
-- C) Seeds - Modules
-- ============================================================================

insert into core.modules (key, name, path, icon, description) values
  ('admin', 'Admin', '/admin', 'Shield', 'Platform administration and governance'),
  ('tenant', 'Tenant', '/tenant', 'Building', 'Tenant settings and configuration'),
  ('crm', 'CRM', '/crm', 'Users', 'Customer relationship management'),
  ('talent', 'Talent/ATS', '/talent', 'Briefcase', 'Applicant tracking system'),
  ('bench', 'Bench', '/bench', 'UserCheck', 'Consultant bench management'),
  ('hotlist', 'Hotlist', '/hotlist', 'Star', 'Hot candidate matching'),
  ('hrms', 'HRMS', '/hrms', 'UserCog', 'Human resource management'),
  ('finance', 'Finance', '/finance', 'DollarSign', 'Financial management'),
  ('vms', 'VMS', '/vms', 'Truck', 'Vendor management system'),
  ('training', 'Training/LMS', '/training', 'GraduationCap', 'Learning management system'),
  ('reports', 'Reports', '/reports', 'BarChart', 'Analytics and reporting'),
  ('security', 'Security', '/security', 'Lock', 'Security and compliance'),
  ('marketplace', 'Marketplace', '/marketplace', 'ShoppingCart', 'Marketplace integrations')
on conflict (key) do update set
  name = excluded.name,
  path = excluded.path,
  icon = excluded.icon,
  description = excluded.description;

-- ============================================================================
-- D) Seeds - Module-Feature Mappings
-- ============================================================================

-- Map features to modules (using feature keys from Step 1.1)
do $$
declare
  v_module_id uuid;
  v_feature_id uuid;
begin
  -- Admin module features
  select id into v_module_id from core.modules where key = 'admin';
  for v_feature_id in select id from core.features where key in ('admin.users', 'admin.roles', 'admin.audit', 'admin.genai') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Tenant module features
  select id into v_module_id from core.modules where key = 'tenant';
  for v_feature_id in select id from core.features where key in ('tenant.branding', 'tenant.copilot', 'tenant.directory') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- CRM module features
  select id into v_module_id from core.modules where key = 'crm';
  for v_feature_id in select id from core.features where key in ('crm.contacts', 'crm.deals', 'crm.pipeline') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Talent/ATS module features
  select id into v_module_id from core.modules where key = 'talent';
  for v_feature_id in select id from core.features where key in ('ats.jobs', 'ats.candidates', 'ats.interviews') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Bench module features
  select id into v_module_id from core.modules where key = 'bench';
  for v_feature_id in select id from core.features where key in ('bench.consultants', 'bench.skills') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Finance module features
  select id into v_module_id from core.modules where key = 'finance';
  for v_feature_id in select id from core.features where key in ('finance.invoices', 'finance.bills', 'finance.timesheets') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Reports module features
  select id into v_module_id from core.modules where key = 'reports';
  for v_feature_id in select id from core.features where key in ('reports.builder', 'reports.ai_copilot', 'reports.export') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;

  -- Security module features
  select id into v_module_id from core.modules where key = 'security';
  for v_feature_id in select id from core.features where key in ('security.audit_chain', 'security.dlp', 'security.vault') loop
    insert into core.module_features (module_id, feature_id) values (v_module_id, v_feature_id) on conflict do nothing;
  end loop;
end $$;

-- ============================================================================
-- E) Demo Data - Sample Approvals
-- ============================================================================

-- Insert a couple of pending approvals for demo (optional)
insert into core.admin_approvals (tenant_id, kind, subject, status) 
select 
  t.id,
  'invite',
  jsonb_build_object('email', 'newuser@example.com', 'requested_roles', array['employee'], 'note', 'New hire from HR'),
  'pending'
from core.tenants t
limit 1
on conflict do nothing;

insert into core.admin_approvals (tenant_id, kind, subject, status)
select 
  t.id,
  'role_change',
  jsonb_build_object('user_id', u.id, 'requested_roles', array['manager'], 'note', 'Promotion request'),
  'pending'
from core.tenants t
cross join lateral (
  select u.id from core.users u 
  join core.user_tenants ut on ut.user_id = u.id 
  where ut.tenant_id = t.id 
  limit 1
) u
limit 1
on conflict do nothing;
