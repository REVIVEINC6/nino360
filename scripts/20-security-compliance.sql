-- Nino360 Step 16: Security & Compliance
-- Hash-chained audit, DLP, PII vault, exports, I-9 hardening

-- ==============
-- HASH-CHAINED AUDIT (blockchain-style immutability)
-- ==============
create schema if not exists secx;

create table secx.audit_chain (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  actor_user_id uuid references core.users(id) on delete set null,
  module text not null,
  action text not null,
  resource text not null,
  payload jsonb default '{}'::jsonb,
  prev_hash text,
  curr_hash text not null,
  created_at timestamptz default now()
);

create index idx_audit_chain_tenant on secx.audit_chain(tenant_id, created_at desc);
create index idx_audit_chain_module on secx.audit_chain(module, created_at desc);

-- Function to append audit with hash chaining
create or replace function secx.append_audit(
  _tenant uuid,
  _actor uuid,
  _module text,
  _action text,
  _resource text,
  _payload jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer as $$
declare
  _prev text;
  _id uuid;
  _curr text;
begin
  -- Get previous hash
  select curr_hash into _prev
  from secx.audit_chain
  where tenant_id = _tenant
  order by created_at desc
  limit 1;

  _id := gen_random_uuid();
  
  -- Calculate current hash: SHA256(prev_hash | module | action | resource | payload)
  _curr := encode(
    digest(
      coalesce(_prev, '') || '|' ||
      coalesce(_module, '') || '|' ||
      coalesce(_action, '') || '|' ||
      coalesce(_resource, '') || '|' ||
      coalesce(_payload::text, ''),
      'sha256'
    ),
    'hex'
  );

  insert into secx.audit_chain(
    id, tenant_id, actor_user_id, module, action, resource, payload, prev_hash, curr_hash
  ) values (
    _id, _tenant, _actor, _module, _action, _resource, _payload, _prev, _curr
  );

  return _id;
end;
$$;

-- Blockchain anchors table
create table secx.anchors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  merkle_root text not null,
  chain text not null check (chain in ('ots', 'eth', 'btc')),
  tx_id text,
  block_height bigint,
  anchored_at timestamptz default now(),
  verified_at timestamptz
);

create index idx_anchors_tenant on secx.anchors(tenant_id, anchored_at desc);

-- ==============
-- DLP POLICIES & FINDINGS
-- ==============
create schema if not exists dlp;

create table dlp.policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  name text not null,
  description text,
  rules jsonb not null, -- {detectors: ['SSN','PAN','AADHAAR','API_KEY'], regex: [...]}
  actions jsonb default '{"block_upload":true,"mask_preview":true,"notify":true}'::jsonb,
  scope jsonb default '{"storage":true,"database":true}'::jsonb,
  status text default 'active' check (status in ('active', 'paused', 'archived')),
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table dlp.findings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  policy_id uuid references dlp.policies(id) on delete set null,
  location text not null, -- 'storage:bucket/key' or 'db:schema.table.column:row_id'
  detector text not null, -- 'PAN','SSN','AADHAAR','API_KEY','BANK_ACCOUNT'
  preview text, -- masked preview
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  action_taken text, -- 'blocked','masked','notified'
  status text default 'open' check (status in ('open', 'resolved', 'false_positive')),
  resolved_by uuid references core.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

create index idx_dlp_findings_tenant on dlp.findings(tenant_id, created_at desc);
create index idx_dlp_findings_severity on dlp.findings(severity, status);

-- ==============
-- PII TOKEN VAULT (format-preserving tokenization)
-- ==============
create schema if not exists vault;

create table vault.tokens (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  kind text not null check (kind in ('email', 'phone', 'ssn', 'pan', 'aadhaar', 'bank_account')),
  clear_hash text not null, -- SHA256 of clear value for lookup
  token text not null, -- format-preserving token
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  accessed_at timestamptz,
  unique(tenant_id, kind, token)
);

create index idx_vault_tokens_hash on vault.tokens(tenant_id, kind, clear_hash);

-- ==============
-- EXPORT JOBS / LEGAL HOLD
-- ==============
create schema if not exists exp;

create table exp.jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  requester_user_id uuid references core.users(id) on delete set null,
  kind text not null check (kind in ('gdpr_subject', 'tenant_export', 'audit_log', 'i9_bundle', 'immigration', 'dlp_report')),
  params jsonb default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  file_url text,
  checksum text, -- SHA256 of export file
  error text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index idx_exp_jobs_tenant on exp.jobs(tenant_id, created_at desc);
create index idx_exp_jobs_status on exp.jobs(status, created_at);

create table exp.legal_holds (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  case_name text not null,
  description text,
  scope jsonb not null, -- {modules: ['hrms','crm'], user_ids: [...], date_range: {...}}
  status text default 'active' check (status in ('active', 'released')),
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  released_at timestamptz,
  released_by uuid references core.users(id) on delete set null
);

-- ==============
-- I-9 HARDENING
-- ==============
-- Add hash verification to existing hr.i9_records
alter table hr.i9_records add column if not exists document_hash text;
alter table hr.i9_records add column if not exists reverification_due_date date;
alter table hr.i9_records add column if not exists everify_case_id text;
alter table hr.i9_records add column if not exists everify_status text check (everify_status in ('pending', 'authorized', 'tentative_nonconfirmation', 'final_nonconfirmation'));

create index idx_i9_reverification on hr.i9_records(reverification_due_date) where reverification_due_date is not null;

-- ==============
-- COMPLIANCE PORTAL ACCESS
-- ==============
create table secx.portal_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  email text not null,
  name text not null,
  company text,
  scopes jsonb default '["audit:read","exports:request"]'::jsonb,
  status text default 'active' check (status in ('active', 'suspended', 'revoked')),
  last_login_at timestamptz,
  created_at timestamptz default now(),
  unique(tenant_id, email)
);

create table secx.portal_shares (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references core.tenants(id) on delete cascade,
  portal_account_id uuid references secx.portal_accounts(id) on delete cascade,
  resource_type text not null, -- 'audit_log','i9_doc','immigration_case','dlp_finding'
  resource_id uuid not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index idx_portal_shares_account on secx.portal_shares(portal_account_id, resource_type);

-- ==============
-- RLS POLICIES
-- ==============
alter table secx.audit_chain enable row level security;
alter table secx.anchors enable row level security;
alter table dlp.policies enable row level security;
alter table dlp.findings enable row level security;
alter table vault.tokens enable row level security;
alter table exp.jobs enable row level security;
alter table exp.legal_holds enable row level security;
alter table secx.portal_accounts enable row level security;
alter table secx.portal_shares enable row level security;

-- Audit chain policies
create policy audit_chain_read on secx.audit_chain
  for select using (
    tenant_id in (select tenant_id from core.user_tenants where user_id = auth.uid())
  );

create policy audit_chain_insert on secx.audit_chain
  for insert with check (
    tenant_id in (select tenant_id from core.user_tenants where user_id = auth.uid())
  );

-- DLP policies
create policy dlp_policies_all on dlp.policies
  for all using (
    tenant_id in (select tenant_id from core.user_tenants where user_id = auth.uid())
  );

create policy dlp_findings_all on dlp.findings
  for all using (
    tenant_id in (select tenant_id from core.user_tenants where user_id = auth.uid())
  );

-- Vault policies (restricted to admins)
create policy vault_tokens_admin on vault.tokens
  for all using (
    exists (
      select 1 from core.user_tenants ut
      join core.roles r on ut.role_id = r.id
      where ut.user_id = auth.uid()
      and ut.tenant_id = vault.tokens.tenant_id
      and r.name in ('Platform Admin', 'Tenant Admin')
    )
  );

-- Export jobs policies
create policy exp_jobs_all on exp.jobs
  for all using (
    tenant_id in (select tenant_id from core.user_tenants where user_id = auth.uid())
  );

-- Legal holds policies (admin only)
create policy exp_legal_holds_admin on exp.legal_holds
  for all using (
    exists (
      select 1 from core.user_tenants ut
      join core.roles r on ut.role_id = r.id
      where ut.user_id = auth.uid()
      and ut.tenant_id = exp.legal_holds.tenant_id
      and r.name in ('Platform Admin', 'Tenant Admin')
    )
  );

-- Portal accounts policies
create policy portal_accounts_admin on secx.portal_accounts
  for all using (
    exists (
      select 1 from core.user_tenants ut
      join core.roles r on ut.role_id = r.id
      where ut.user_id = auth.uid()
      and ut.tenant_id = secx.portal_accounts.tenant_id
      and r.name in ('Platform Admin', 'Tenant Admin')
    )
  );

-- ==============
-- SAMPLE DATA
-- ==============
-- Insert default DLP policy for all tenants
insert into dlp.policies (tenant_id, name, description, rules)
select
  id,
  'Default PII Protection',
  'Detects and blocks common PII patterns',
  $json${
    "detectors": ["SSN", "PAN", "AADHAAR", "API_KEY", "BANK_ACCOUNT"],
    "regex": [
      {"name": "SSN", "pattern": "\\b\\d{3}-\\d{2}-\\d{4}\\b"},
      {"name": "PAN", "pattern": "[A-Z]{5}[0-9]{4}[A-Z]{1}"},
      {"name": "AADHAAR", "pattern": "\\b\\d{4}\\s\\d{4}\\s\\d{4}\\b"},
      {"name": "API_KEY", "pattern": "(api[_-]?key|apikey|access[_-]?token)\\s*[:=]\\s*['\"]?([a-zA-Z0-9_\\-]{20,})['\"]?"},
      {"name": "BANK_ACCOUNT", "pattern": "\\b\\d{9,18}\\b"}
    ]
  }$json$::jsonb
from core.tenants
on conflict do nothing;

comment on schema secx is 'Security: Hash-chained audit logs and blockchain anchors';
comment on schema dlp is 'Data Loss Prevention: Policies and findings';
comment on schema vault is 'PII tokenization vault';
comment on schema exp is 'Export jobs and legal holds';
