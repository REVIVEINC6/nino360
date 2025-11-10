-- CRM prerequisites for schemas and helper functions used by 15-crm.sql
-- Creates minimal sec, auto, rpt, hr scaffolding so 15-crm can run cleanly

-- Extensions commonly required
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Schemas
create schema if not exists sec;
create schema if not exists auto;
create schema if not exists rpt;
create schema if not exists hr;

-- SEC: audit_logs table (blockchain-ready columns included)
create table if not exists sec.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  action text not null,
  resource text,
  payload jsonb default '{}'::jsonb,
  prev_hash text,
  hash text,
  entity text,
  entity_id text,
  diff jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_sec_audit_logs_tenant on sec.audit_logs(tenant_id, created_at);
create index if not exists idx_sec_audit_logs_hash on sec.audit_logs(hash);

-- SEC: helper functions commonly referenced
create or replace function sec.current_tenant_id()
returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid;
$$;

create or replace function sec.current_user_id()
returns uuid language sql stable as $$
  select auth.uid();
$$;

create or replace function sec.log_action(
  _tenant_id uuid,
  _user_id uuid,
  _action text,
  _resource text,
  _payload jsonb
) returns void language sql security definer as $$
  insert into sec.audit_logs(tenant_id, user_id, action, resource, payload)
  values (_tenant_id, _user_id, _action, _resource, _payload);
$$;

-- AUTO: outbox for event-driven automations used by crm triggers
create table if not exists auto.outbox (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  event_type text not null,
  resource_type text not null,
  resource_id uuid,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
-- If an older version of auto.outbox exists, backfill required columns
alter table if exists auto.outbox add column if not exists event_type text;
alter table if exists auto.outbox add column if not exists created_at timestamptz default now();
create index if not exists idx_auto_outbox_tenant on auto.outbox(tenant_id, created_at);
create index if not exists idx_auto_outbox_event on auto.outbox(event_type);

-- HR: minimal tickets table so cportal.shares FK can be created
create table if not exists hr.tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  title text,
  created_at timestamptz default now()
);
