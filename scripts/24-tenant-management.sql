create schema if not exists tenant;

-- Tenant org profiles with policies and integrations
create table if not exists tenant.org_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  legal_name text,
  brand_name text,
  timezone text default 'Asia/Kolkata',
  locale text default 'en',
  industry text,
  size text,
  logo_url text,
  contacts jsonb default '[]'::jsonb,
  policies jsonb default '{}'::jsonb,
  integrations jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id)
);

-- Tenant documents for RAG
create table if not exists tenant.docs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  title text not null,
  file_url text not null,
  mime text,
  tokens int4 default 0,
  status text default 'ready' check (status in ('ready','processing','error')),
  uploaded_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_tenant_docs_tenant on tenant.docs(tenant_id);
create index if not exists idx_tenant_docs_status on tenant.docs(status);

-- RLS
alter table tenant.org_profiles enable row level security;
alter table tenant.docs enable row level security;

create policy t_org_read on tenant.org_profiles
  for select using (tenant_id = sec.current_tenant_id());

create policy t_org_write on tenant.org_profiles
  for all using (
    tenant_id = sec.current_tenant_id() and 
    (sec.has_role('admin') or sec.has_role('super_admin') or sec.has_role('master_admin'))
  );

create policy t_docs_read on tenant.docs
  for select using (tenant_id = sec.current_tenant_id());

create policy t_docs_write on tenant.docs
  for all using (
    tenant_id = sec.current_tenant_id() and 
    sec.has_feature('tenant.docs')
  );

-- Seeds: Create org_profiles for existing tenants
insert into tenant.org_profiles (tenant_id, brand_name, timezone, locale)
select id, name, 'Asia/Kolkata', 'en'
from core.tenants
where not exists (
  select 1 from tenant.org_profiles where tenant_id = core.tenants.id
);

-- Add enabled_by_default column if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'core' 
    and table_name = 'features' 
    and column_name = 'enabled_by_default'
  ) then
    alter table core.features add column enabled_by_default boolean default true;
  end if;
end $$;

-- Ensure feature keys exist
insert into core.features (key, name, description, enabled_by_default)
values
  ('tenant.docs', 'Tenant Documents', 'Upload and manage tenant documents with RAG embeddings', true),
  ('tenant.copilot', 'Tenant Copilot', 'AI-powered Q&A with document citations', true),
  ('tenant.security', 'Tenant Security', 'MFA and IP allowlist controls', true)
on conflict (key) do nothing;
