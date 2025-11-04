-- =====================================================
-- Nino360 Step 15: Admin Enhancements
-- Feature Flags, GenAI Config, API Gateway, System Health, Security, AI Audit
-- =====================================================

-- =====================
-- FEATURE FLAGS
-- =====================
create schema if not exists ff;

create table ff.flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  default_state boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ff.rollouts (
  id uuid primary key default gen_random_uuid(),
  flag_id uuid not null references ff.flags(id) on delete cascade,
  tenant_id uuid references core.tenants(id) on delete cascade,
  user_id uuid references core.users(id) on delete cascade,
  segment text, -- 'beta', 'internal', 'enterprise', etc.
  state boolean not null,
  percentage int check (percentage >= 0 and percentage <= 100), -- for gradual rollout
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz default now()
);

create index on ff.rollouts(flag_id, tenant_id);
create index on ff.rollouts(flag_id, user_id);
create index on ff.rollouts(segment);

-- RLS: everyone can read flags; only admins write
alter table ff.flags enable row level security;
alter table ff.rollouts enable row level security;

create policy ff_read on ff.flags for select using (true);
create policy ff_write on ff.flags for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy ffr_read on ff.rollouts for select using (true);
create policy ffr_write on ff.rollouts for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

-- =====================
-- GENAI CONFIGURATION
-- =====================
create schema if not exists ai;

create table ai.models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('chat', 'embedding', 'vision', 'moderation', 'function')),
  provider text not null, -- 'openai', 'anthropic', 'groq', 'local'
  endpoint text,
  api_key_alias text, -- reference to vault/secret manager
  default_params jsonb default '{}'::jsonb,
  is_default boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ai.policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  name text not null,
  moderation jsonb default '{}'::jsonb, -- blocklists, content filters
  redaction jsonb default '{}'::jsonb, -- PII regex patterns to mask
  output_limits jsonb default '{"max_tokens": 2048}'::jsonb,
  temperature_range int[] default '{0, 100}',
  allowed_tools text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ai.bindings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  module text not null, -- 'crm', 'hrms', 'finance', 'reports', 'hotlist', 'lms'
  use_case text not null, -- 'summarize', 'match', 'forecast', 'qna', 'parse'
  model_id uuid references ai.models(id) on delete set null,
  policy_id uuid references ai.policies(id) on delete set null,
  enabled boolean default true,
  created_at timestamptz default now()
);

create index on ai.models(tenant_id, kind, is_active);
create index on ai.bindings(tenant_id, module, use_case);

alter table ai.models enable row level security;
alter table ai.policies enable row level security;
alter table ai.bindings enable row level security;

create policy ai_models_rw on ai.models for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy ai_policies_rw on ai.policies for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy ai_bindings_rw on ai.bindings for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

-- =====================
-- API GATEWAY
-- =====================
create schema if not exists apigw;

create table apigw.apis (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  name text not null,
  base_path text not null,
  is_public boolean default false,
  rate_limit_per_min int default 60,
  quota_per_day int default 10000,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table apigw.keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  api_id uuid references apigw.apis(id) on delete cascade,
  name text,
  hashed_key text not null unique,
  scopes text[] default '{}',
  expires_at timestamptz,
  is_active boolean default true,
  last_used_at timestamptz,
  created_at timestamptz default now()
);

create table apigw.routes (
  id uuid primary key default gen_random_uuid(),
  api_id uuid references apigw.apis(id) on delete cascade,
  method text not null check (method in ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  path text not null,
  target text not null, -- edge function name or internal URL
  auth_required boolean default true,
  scope_required text,
  created_at timestamptz default now()
);

create table apigw.usage (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  api_id uuid,
  key_id uuid,
  route_id uuid,
  method text,
  path text,
  status int,
  duration_ms int,
  bytes_in int,
  bytes_out int,
  occurred_at timestamptz default now()
);

create index on apigw.usage(tenant_id, api_id, occurred_at);
create index on apigw.usage(key_id, occurred_at);
create index on apigw.keys(hashed_key);

alter table apigw.apis enable row level security;
alter table apigw.keys enable row level security;
alter table apigw.routes enable row level security;
alter table apigw.usage enable row level security;

create policy apis_rw on apigw.apis for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy keys_rw on apigw.keys for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy routes_rw on apigw.routes for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy usage_read on apigw.usage for select using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

-- =====================
-- SYSTEM HEALTH & INCIDENTS
-- =====================
create schema if not exists ops;

create table ops.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  meta jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table ops.heartbeats (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references ops.services(id) on delete cascade,
  region text default 'default',
  status text not null check (status in ('up', 'degraded', 'down')),
  latency_ms int,
  note text,
  occurred_at timestamptz default now()
);

create table ops.incidents (
  id uuid primary key default gen_random_uuid(),
  severity text not null check (severity in ('info', 'warning', 'critical')),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'investigating', 'monitoring', 'resolved')),
  service_id uuid references ops.services(id) on delete set null,
  created_at timestamptz default now(),
  resolved_at timestamptz,
  resolved_by uuid references core.users(id)
);

create index on ops.heartbeats(service_id, occurred_at desc);
create index on ops.incidents(status, severity, created_at desc);

alter table ops.services enable row level security;
alter table ops.heartbeats enable row level security;
alter table ops.incidents enable row level security;

create policy ops_services_read on ops.services for select using (true);
create policy ops_services_write on ops.services for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy ops_heartbeats_read on ops.heartbeats for select using (true);
create policy ops_heartbeats_write on ops.heartbeats for insert with check (true);

create policy ops_incidents_read on ops.incidents for select using (true);
create policy ops_incidents_write on ops.incidents for all using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

-- =====================
-- AI AUDIT LOGS
-- =====================
create schema if not exists audit;

create table audit.ai_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  user_id uuid references core.users(id) on delete set null,
  module text not null,
  use_case text not null,
  model text,
  policy text,
  prompt text,
  output text,
  tokens_prompt int,
  tokens_output int,
  cost numeric(14, 6),
  duration_ms int,
  created_at timestamptz default now()
);

create index on audit.ai_logs(tenant_id, module, created_at desc);
create index on audit.ai_logs(user_id, created_at desc);
create index on audit.ai_logs(created_at desc);

alter table audit.ai_logs enable row level security;

create policy ai_logs_read on audit.ai_logs for select using (
  exists (
    select 1 from core.user_roles ur 
    join core.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() 
    and r.key in ('master_admin', 'super_admin', 'admin')
  )
);

create policy ai_logs_write on audit.ai_logs for insert with check (true);

-- =====================
-- SEED DATA
-- =====================

-- Default services for monitoring
insert into ops.services (name, description) values
  ('web', 'Next.js web application'),
  ('database', 'Supabase PostgreSQL'),
  ('edge', 'Edge functions'),
  ('warehouse', 'BigQuery/Snowflake data warehouse'),
  ('queue', 'Background job processing')
on conflict (name) do nothing;

-- Default AI models
insert into ai.models (name, kind, provider, is_default, is_active) values
  ('gpt-4o', 'chat', 'openai', true, true),
  ('gpt-4o-mini', 'chat', 'openai', false, true),
  ('claude-3-5-sonnet', 'chat', 'anthropic', false, true),
  ('text-embedding-3-small', 'embedding', 'openai', true, true)
on conflict do nothing;

-- Default AI policy
insert into ai.policies (name, moderation, redaction, output_limits) values
  ('default', 
   '{"blocklist": ["violence", "hate"], "content_filter": true}'::jsonb,
   '{"patterns": ["\\b\\d{3}-\\d{2}-\\d{4}\\b", "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"]}'::jsonb,
   '{"max_tokens": 2048, "max_cost_per_request": 0.50}'::jsonb
  )
on conflict do nothing;

-- Default feature flags
insert into ff.flags (key, description, default_state) values
  ('hotlist_ai_matching', 'Enable AI-powered candidate matching in Hotlist', true),
  ('reports_copilot', 'Enable AI Copilot in Reports module', true),
  ('lms_certificates', 'Enable certificate generation in LMS', true),
  ('api_gateway', 'Enable public API gateway', false),
  ('warehouse_sync', 'Enable real-time warehouse sync', true)
on conflict (key) do nothing;

comment on schema ff is 'Feature flags for gradual rollout and A/B testing';
comment on schema ai is 'GenAI model configuration, policies, and bindings';
comment on schema apigw is 'API Gateway for tenant and public APIs';
comment on schema ops is 'System health monitoring and incident management';
comment on schema audit is 'AI audit logs for compliance and cost tracking';
