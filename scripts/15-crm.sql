-- Nino360 — Step 11: CRM (Multi-Tenant Client Portal) — 100% Production
-- Complete CRM with internal sales pipeline and secure client portal

-- Creating CRM and Client Portal schemas
create schema if not exists crm;
create schema if not exists cportal;

-- ACCOUNTS (companies)
create table if not exists crm.accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  domain text,
  industry text,
  size text,
  owner_id uuid references core.users(id) on delete set null,
  billing_client_id uuid references finance.clients(id) on delete set null,
  status text default 'active' check (status in ('active','inactive','prospect','customer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, name)
);
create index if not exists idx_crm_accounts_tenant on crm.accounts(tenant_id);

-- CONTACTS (people)
create table if not exists crm.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  account_id uuid references crm.accounts(id) on delete set null,
  first_name text,
  last_name text,
  email text,
  phone text,
  title text,
  owner_id uuid references core.users(id) on delete set null,
  status text default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now()
);
create index if not exists idx_crm_contacts_tenant on crm.contacts(tenant_id, account_id);

-- LEADS
create table if not exists crm.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  source text,
  first_name text,
  last_name text,
  email text,
  phone text,
  company text,
  title text,
  owner_id uuid references core.users(id) on delete set null,
  score int2 default 0,
  status text default 'new' check (status in ('new','contacted','qualified','disqualified','converted')),
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_crm_leads_tenant on crm.leads(tenant_id, status);

-- OPPORTUNITY STAGES
create table if not exists crm.opportunity_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  position int2 not null,
  win_prob int2 default 0,
  unique(tenant_id, position)
);

-- OPPORTUNITIES (sales pipeline)
create table if not exists crm.opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  account_id uuid references crm.accounts(id) on delete set null,
  contact_id uuid references crm.contacts(id) on delete set null,
  title text not null,
  amount numeric(14,2) default 0,
  currency text default 'USD',
  stage_id uuid references crm.opportunity_stages(id) on delete set null,
  close_date date,
  owner_id uuid references core.users(id) on delete set null,
  status text default 'open' check (status in ('open','won','lost','withdrawn')),
  probability int2 default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_crm_opportunities_tenant on crm.opportunities(tenant_id, stage_id);

-- ACTIVITIES / ENGAGEMENT
create table if not exists crm.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  account_id uuid references crm.accounts(id) on delete set null,
  contact_id uuid references crm.contacts(id) on delete set null,
  opportunity_id uuid references crm.opportunities(id) on delete set null,
  type text not null check (type in ('note','call','email','meeting','task')),
  subject text,
  body text,
  when_at timestamptz default now(),
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists idx_crm_activities_tenant on crm.activities(tenant_id, opportunity_id);

-- PROPOSALS & DOCUMENTS
create table if not exists crm.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  account_id uuid references crm.accounts(id) on delete set null,
  opportunity_id uuid references crm.opportunities(id) on delete set null,
  title text not null,
  kind text not null check (kind in ('proposal','quote','msa','nda','sow','other')),
  file_url text not null,
  mime text,
  status text default 'draft' check (status in ('draft','shared','viewed','signed','expired','void')),
  expires_at date,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);

-- QUOTES / PRICING
create table if not exists crm.quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  opportunity_id uuid references crm.opportunities(id) on delete cascade,
  currency text default 'USD',
  subtotal numeric(14,2) default 0,
  tax_total numeric(14,2) default 0,
  total numeric(14,2) default 0,
  status text default 'draft' check (status in ('draft','sent','accepted','rejected')),
  created_at timestamptz default now()
);

create table if not exists crm.quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references crm.quotes(id) on delete cascade,
  line_no int2 not null,
  description text not null,
  qty numeric(10,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  amount numeric(14,2) not null default 0,
  unique(quote_id, line_no)
);

-- CLIENT PORTAL ACCOUNTS & USERS
create table if not exists cportal.accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  crm_account_id uuid references crm.accounts(id) on delete cascade,
  name text not null,
  status text default 'invited' check (status in ('invited','active','suspended')),
  branding jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(tenant_id, crm_account_id)
);

create table if not exists cportal.users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  portal_account_id uuid not null references cportal.accounts(id) on delete cascade,
  role text default 'member' check (role in ('admin','member','billing','viewer')),
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(user_id, portal_account_id)
);

-- SHARES: what external client users can see
create table if not exists cportal.shares (
  id uuid primary key default gen_random_uuid(),
  portal_account_id uuid not null references cportal.accounts(id) on delete cascade,
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  opportunity_id uuid references crm.opportunities(id) on delete cascade,
  document_id uuid references crm.documents(id) on delete set null,
  ticket_id uuid references hr.tickets(id) on delete set null,
  can_comment boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_cportal_shares_portal on cportal.shares(portal_account_id, opportunity_id);

-- Enable RLS on all CRM and portal tables
alter table crm.accounts enable row level security;
alter table crm.contacts enable row level security;
alter table crm.leads enable row level security;
alter table crm.opportunity_stages enable row level security;
alter table crm.opportunities enable row level security;
alter table crm.activities enable row level security;
alter table crm.documents enable row level security;
alter table crm.quotes enable row level security;
alter table crm.quote_lines enable row level security;
alter table cportal.accounts enable row level security;
alter table cportal.users enable row level security;
alter table cportal.shares enable row level security;

-- RLS Policies for internal users (tenant-scoped)
create policy crm_accounts_read on crm.accounts for select using (tenant_id = sec.current_tenant_id());
create policy crm_accounts_write on crm.accounts for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = crm.accounts.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','sales_manager','sales_rep','account_manager')
  )
);

create policy crm_contacts_read on crm.contacts for select using (tenant_id = sec.current_tenant_id());
create policy crm_contacts_write on crm.contacts for all using (tenant_id = sec.current_tenant_id());

create policy crm_leads_read on crm.leads for select using (tenant_id = sec.current_tenant_id());
create policy crm_leads_write on crm.leads for all using (tenant_id = sec.current_tenant_id());

create policy crm_stages_read on crm.opportunity_stages for select using (tenant_id = sec.current_tenant_id());
create policy crm_stages_write on crm.opportunity_stages for all using (tenant_id = sec.current_tenant_id());

create policy crm_opportunities_read on crm.opportunities for select using (tenant_id = sec.current_tenant_id());
create policy crm_opportunities_write on crm.opportunities for all using (tenant_id = sec.current_tenant_id());

create policy crm_activities_read on crm.activities for select using (tenant_id = sec.current_tenant_id());
create policy crm_activities_write on crm.activities for all using (tenant_id = sec.current_tenant_id());

create policy crm_documents_read on crm.documents for select using (tenant_id = sec.current_tenant_id());
create policy crm_documents_write on crm.documents for all using (tenant_id = sec.current_tenant_id());

create policy crm_quotes_read on crm.quotes for select using (tenant_id = sec.current_tenant_id());
create policy crm_quotes_write on crm.quotes for all using (tenant_id = sec.current_tenant_id());

create policy crm_quote_lines_read on crm.quote_lines for select using (
  exists (select 1 from crm.quotes q where q.id = crm.quote_lines.quote_id and q.tenant_id = sec.current_tenant_id())
);
create policy crm_quote_lines_write on crm.quote_lines for all using (
  exists (select 1 from crm.quotes q where q.id = crm.quote_lines.quote_id and q.tenant_id = sec.current_tenant_id())
);

-- Client portal helper function
create or replace function cportal.current_portal_id() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'portal_account_id','')::uuid;
$$;

-- RLS Policies for client portal users
create policy cportal_shares_read on cportal.shares for select using (portal_account_id = cportal.current_portal_id());
create policy cportal_users_read on cportal.users for select using (portal_account_id = cportal.current_portal_id());
create policy cportal_accounts_read on cportal.accounts for select using (
  id = cportal.current_portal_id() or tenant_id = sec.current_tenant_id()
);

-- Secure views for client portal access
create or replace view cportal.v_opportunities as
select o.* from crm.opportunities o
join cportal.shares s on s.opportunity_id = o.id
where s.portal_account_id = cportal.current_portal_id();

create or replace view cportal.v_documents as
select d.* from crm.documents d
join cportal.shares s on s.document_id = d.id
where s.portal_account_id = cportal.current_portal_id();

-- Audit helper for CRM
create or replace function crm.audit(_action text, _resource text, _payload jsonb)
returns void language sql security definer as $$ 
  select sec.log_action(
    coalesce(sec.current_tenant_id(),'00000000-0000-0000-0000-000000000000'::uuid), 
    sec.current_user_id(), 
    _action, 
    _resource, 
    _payload
  ); 
$$;

-- Add CRM KPIs to reporting schema
create materialized view if not exists rpt.kpi_crm_daily as
select 
  date_trunc('day', o.created_at)::date as d, 
  o.tenant_id,
  count(*) filter (where o.status='open') as open_opps,
  count(*) filter (where o.status='won') as won,
  count(*) filter (where o.status='lost') as lost,
  sum(o.amount * (coalesce(s.win_prob, o.probability)/100.0)) as weighted_pipe
from crm.opportunities o 
left join crm.opportunity_stages s on s.id=o.stage_id
group by 1,2;

create unique index if not exists idx_rpt_kpi_crm_daily on rpt.kpi_crm_daily(tenant_id, d);

-- Event triggers for automation (Step 9 integration)
create or replace function crm.trg_auto_opportunity_created()
returns trigger language plpgsql security definer as $$
begin
  insert into auto.outbox (tenant_id, event_type, resource_type, resource_id, payload)
  values (new.tenant_id, 'created', 'opportunity', new.id, to_jsonb(new));
  return new;
end;
$$;

create trigger trg_auto_opportunity_created
after insert on crm.opportunities
for each row execute function crm.trg_auto_opportunity_created();

create or replace function crm.trg_auto_opportunity_stage_changed()
returns trigger language plpgsql security definer as $$
begin
  if old.stage_id is distinct from new.stage_id then
    insert into auto.outbox (tenant_id, event_type, resource_type, resource_id, payload)
    values (new.tenant_id, 'stage_changed', 'opportunity', new.id, jsonb_build_object('old_stage', old.stage_id, 'new_stage', new.stage_id));
  end if;
  return new;
end;
$$;

create trigger trg_auto_opportunity_stage_changed
after update on crm.opportunities
for each row execute function crm.trg_auto_opportunity_stage_changed();

create or replace function crm.trg_auto_document_status_changed()
returns trigger language plpgsql security definer as $$
begin
  if old.status is distinct from new.status then
    insert into auto.outbox (tenant_id, event_type, resource_type, resource_id, payload)
    values (new.tenant_id, 'status_changed', 'document', new.id, jsonb_build_object('old_status', old.status, 'new_status', new.status));
  end if;
  return new;
end;
$$;

create trigger trg_auto_document_status_changed
after update on crm.documents
for each row execute function crm.trg_auto_document_status_changed();

-- Bootstrap default opportunity stages
insert into crm.opportunity_stages (tenant_id, name, position, win_prob)
select t.id, 'Prospect', 1, 10 from core.tenants t
on conflict (tenant_id, position) do nothing;

insert into crm.opportunity_stages (tenant_id, name, position, win_prob)
select t.id, 'Qualified', 2, 30 from core.tenants t
on conflict (tenant_id, position) do nothing;

insert into crm.opportunity_stages (tenant_id, name, position, win_prob)
select t.id, 'Proposal', 3, 60 from core.tenants t
on conflict (tenant_id, position) do nothing;

insert into crm.opportunity_stages (tenant_id, name, position, win_prob)
select t.id, 'Negotiation', 4, 80 from core.tenants t
on conflict (tenant_id, position) do nothing;

insert into crm.opportunity_stages (tenant_id, name, position, win_prob)
select t.id, 'Closed Won', 5, 100 from core.tenants t
on conflict (tenant_id, position) do nothing;
