pnpm run dev-- Schema for Tenant Dashboard data used by page components and realtime
create schema if not exists app;

-- Audit log with blockchain-style linking
create table if not exists app.audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  user_id uuid,
  action text not null,
  entity text,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  prev_hash text,
  hash text
);
create index if not exists idx_audit_tenant_time on app.audit_log(tenant_id, created_at desc);

-- Module usage for realtime updates
create table if not exists app.module_usage (
  id bigserial primary key,
  tenant_id uuid not null,
  module text not null,
  events integer not null default 0,
  updated_at timestamptz default now()
);
create index if not exists idx_module_usage_tenant_module on app.module_usage(tenant_id, module);

-- Minimal tenants and feature_flags for context (no-op if existing elsewhere)
create table if not exists public.tenants (
  id uuid primary key,
  slug text unique,
  name text,
  timezone text default 'UTC'
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  feature_key text not null,
  enabled boolean not null default false,
  unique(tenant_id, feature_key)
);

create table if not exists public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  user_id uuid not null,
  status text default 'active'
);

-- Forecasts and ML insights
create table if not exists public.tenant_forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  type text not null,
  date date not null,
  value numeric,
  lower numeric,
  upper numeric
);
create index if not exists idx_tenant_forecasts_tenant_type on public.tenant_forecasts(tenant_id, type, date);

create table if not exists public.ml_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  title text,
  summary text,
  score numeric,
  created_at timestamptz default now()
);

-- RPA status view/table
create table if not exists public.rpa_status (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text,
  status text,
  last_run_at timestamptz
);

-- Grants for anon/authenticated to read dashboard-safe data
grant select on app.audit_log, app.module_usage to authenticated;
grant select on public.tenant_forecasts, public.ml_insights, public.rpa_status to authenticated;
