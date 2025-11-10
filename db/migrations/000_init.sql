-- Initial schema for Nino360
create schema if not exists public;
create schema if not exists app;
create schema if not exists bill;

-- PUBLIC: LEADS & DEMO
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  work_email text unique not null,
  company text not null,
  size text,
  industry text,
  phone text,
  utm jsonb default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','qualified','demo_scheduled','converted')),
  assigned_to uuid
);

create table if not exists public.demo_bookings (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  calendar_ref text,
  status text not null default 'scheduled' check (status in ('scheduled','completed','no_show'))
);

-- APP: CORE MULTI-TENANCY + RBAC + FBAC
create table if not exists app.tenants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  region text,
  timezone text,
  status text default 'active' check (status in ('active','trial','suspended'))
);

create table if not exists app.user_profiles (
  user_id uuid primary key,
  full_name text,
  avatar_url text,
  phone text,
  title text,
  locale text default 'en',
  last_login_at timestamptz
);

create table if not exists app.tenant_members (
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('tenant_admin','manager','member')),
  status text not null default 'active' check (status in ('active','invited')),
  created_at timestamptz default now(),
  primary key (tenant_id, user_id)
);

create table if not exists app.roles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  key text not null,
  name text not null,
  description text,
  unique(tenant_id, key)
);

create table if not exists app.permissions (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  description text
);

create table if not exists app.role_permissions (
  role_id uuid not null references app.roles(id) on delete cascade,
  permission_key text not null references app.permissions(key) on delete cascade,
  primary key (role_id, permission_key)
);

create table if not exists app.feature_flags (
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  key text not null,
  enabled boolean not null default true,
  primary key (tenant_id, key)
);

-- AUDIT (hash chain)
create table if not exists app.audit_log (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid,
  actor_user_id uuid,
  action text not null,
  entity text,
  entity_id text,
  diff jsonb default '{}'::jsonb,
  prev_hash text,
  hash text,
  created_at timestamptz default now()
);

-- BILLING: PLANS, SUBSCRIPTIONS, INVOICES
create table if not exists bill.plans (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null check (code in ('free','pro','enterprise')),
  name text not null,
  price_month numeric(10,2) default 0,
  price_year numeric(10,2) default 0,
  currency text default 'USD',
  features jsonb default '{}'::jsonb,
  limits jsonb default '{}'::jsonb
);

create table if not exists bill.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  plan_code text not null references bill.plans(code),
  interval text not null check (interval in ('month','year')),
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  provider text check (provider in ('stripe')),
  provider_sub_id text,
  trial_end timestamptz
);

create table if not exists bill.invoices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status text not null check (status in ('draft','open','paid','uncollectible','void')),
  provider_invoice_id text,
  hosted_url text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- RLS (tenant scope)
alter table app.tenants enable row level security;
alter table app.tenant_members enable row level security;
alter table app.roles enable row level security;
alter table app.role_permissions enable row level security;
alter table app.feature_flags enable row level security;
alter table app.audit_log enable row level security;
alter table bill.subscriptions enable row level security;
alter table bill.invoices enable row level security;

-- Policies
create or replace function app.current_tenant_id() returns uuid
language sql stable as $$ select nullif(current_setting('request.jwt.claims', true)::json->>'tenant_id','')::uuid $$;

create policy tenant_read on app.tenants for select using (id = app.current_tenant_id());
create policy tm_read on app.tenant_members for select using (tenant_id = app.current_tenant_id());
create policy tm_write on app.tenant_members for all using (
  tenant_id = app.current_tenant_id()
  and exists (
    select 1 from app.tenant_members m
    where m.tenant_id = app.current_tenant_id() and m.user_id = auth.uid() and m.role in ('tenant_admin','manager')
  )
);
-- NOTE: Repeat analogous read/write policies for roles, role_permissions, feature_flags, audit_log
create policy sub_read on bill.subscriptions for select using (tenant_id = app.current_tenant_id());
create policy inv_read on bill.invoices for select using (tenant_id = app.current_tenant_id());

-- Seeds
insert into bill.plans (code,name,price_month,price_year,currency,features,limits)
values
('free','Free',0,0,'USD','{"modules":["analytics-lite"]}','{}'),
('pro','Pro',49,490,'USD','{"modules":["crm","talent","hrms","finance","automation","trust"]}','{}'),
('enterprise','Enterprise',0,0,'USD','{"modules":["all"],"sso":true,"saml":true,"sla":"24x7"}','{}')
on conflict (code) do nothing;
