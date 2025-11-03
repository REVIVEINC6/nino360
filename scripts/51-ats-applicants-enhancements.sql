-- Nino360 — ATS Applicants Board Enhancements
-- Extends existing ats schema with additional fields for comprehensive ATS board

-- Extend applications table with new fields
alter table if exists ats.applications
  add column if not exists tags text[] default '{}',
  add column if not exists resume_path text,
  add column if not exists cover_path text,
  add column if not exists source_detail text,
  add column if not exists stage_sla_due_at timestamptz,
  add column if not exists stage_notes text;

-- Create feedback table if not exists (with proper structure)
create table if not exists ats.feedback_v2 (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  interview_id uuid not null references ats.interviews(id) on delete cascade,
  reviewer_id uuid not null references core.users(id),
  ratings jsonb not null default '[]'::jsonb,   -- [{dimension_key, score, note}]
  overall text check (overall in ('strong_yes','yes','lean_yes','no','strong_no')),
  notes text,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  unique(tenant_id, interview_id, reviewer_id)
);

-- Create application activities table
create table if not exists ats.application_activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  application_id uuid not null references ats.applications(id) on delete cascade,
  type text not null check (type in ('note','email','system','file')),
  ts timestamptz default now(),
  actor uuid references core.users(id),
  data jsonb default '{}'::jsonb
);

-- Add indexes for performance
create index if not exists idx_app_stage on ats.applications(tenant_id, job_id, stage);
create index if not exists idx_app_sla on ats.applications(stage_sla_due_at) where stage_sla_due_at is not null;
create index if not exists idx_feedback_interview on ats.feedback_v2(interview_id);
create index if not exists idx_activities_app on ats.application_activities(application_id, ts desc);

-- RLS policies
alter table ats.feedback_v2 enable row level security;
alter table ats.application_activities enable row level security;

drop policy if exists feedback_v2_tenant_isolation on ats.feedback_v2;
create policy feedback_v2_tenant_isolation on ats.feedback_v2
  using (tenant_id = sec.current_tenant_id());

drop policy if exists activities_v2_tenant_isolation on ats.application_activities;
create policy activities_v2_tenant_isolation on ats.application_activities
  using (tenant_id = sec.current_tenant_id());

-- Add interview feedback tracking
alter table ats.interviews
  add column if not exists feedback_due_at timestamptz,
  add column if not exists feedback_submitted boolean default false;
