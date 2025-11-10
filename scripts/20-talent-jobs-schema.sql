-- Minimal schema to support Talent Jobs module actions and UI
create schema if not exists talent;

-- Core requisitions table
create table if not exists talent.requisitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  title text not null,
  department text,
  location text,
  employment_type text,
  seniority text,
  openings int default 1,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  hiring_manager uuid,
  recruiter_id uuid,
  band text,
  salary_range jsonb,
  skills text[],
  description_md text,
  remote_policy text,
  publish_meta jsonb,
  -- AI/ML decorations used by UI cards
  ai_score numeric,
  ml_fill_probability numeric,
  -- Blockchain-style chain on requisitions
  prev_hash text,
  blockchain_hash text
);
create index if not exists idx_reqs_tenant_status on talent.requisitions(tenant_id, status);
create index if not exists idx_reqs_created on talent.requisitions(created_at desc);

-- Hiring team members
create table if not exists talent.requisition_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requisition_id uuid not null,
  user_id uuid not null,
  role text not null,
  created_at timestamptz default now()
);
create index if not exists idx_req_members_req on talent.requisition_members(requisition_id);

-- Interview plan per requisition
create table if not exists talent.interview_plan (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requisition_id uuid not null,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Scorecards per requisition
create table if not exists talent.scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requisition_id uuid not null,
  name text not null,
  dimensions jsonb not null,
  pos int default 1,
  created_at timestamptz default now()
);
create index if not exists idx_scorecards_req on talent.scorecards(requisition_id, pos);

-- Approvals workflow
create table if not exists talent.requisition_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requisition_id uuid not null,
  approver_id uuid not null,
  step int not null,
  status text not null default 'pending',
  comment text,
  decided_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_req_approvals_req on talent.requisition_approvals(requisition_id, step);

-- Publishing targets (career site, job boards, vendor, internal)
create table if not exists talent.publish_targets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  key text not null,
  name text not null,
  kind text not null,
  enabled boolean default true,
  meta jsonb default '{}'::jsonb,
  unique(tenant_id, key)
);

-- Applications (minimal for status checks)
create table if not exists talent.applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requisition_id uuid not null,
  stage text not null default 'applied'
);

-- Public audit_logs used by actions (simple, non-chain)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  user_id uuid,
  action text not null,
  resource_type text,
  resource_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_audit_logs_tenant on public.audit_logs(tenant_id, created_at desc);

grant select, insert, update on talent.requisitions, talent.requisition_members, talent.interview_plan, talent.scorecards, talent.requisition_approvals, talent.publish_targets, talent.applications to authenticated;
grant select, insert on public.audit_logs to authenticated;
