-- Nino360 — Step 5A: Bench Management
-- Complete bench schema with consultants, marketing, submissions, placements

create schema if not exists bench;

-- Master data: Skills
create table bench.skills (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  unique(tenant_id, name)
);

-- Consultants on bench
create table bench.consultants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  email text not null,
  phone text,
  first_name text,
  last_name text,
  work_authorization text, -- US: H1B, H4 EAD, L2, GC, USC, etc.
  location text,
  relocation boolean default false,
  remote_ok boolean default true,
  experience_years numeric(4,1),
  primary_skill text,
  skills text[],
  current_rate numeric(14,2), -- hourly if US, monthly if offshore
  notice_period_days int2 default 0,
  availability_date date default now(),
  visa_expiry date,
  summary text,
  resume_url text,
  owner_id uuid references core.users(id) on delete set null,
  status text not null default 'bench' check (status in ('bench','marketing','interview','offered','deployed','hold','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  search_tsv tsvector
);

create index on bench.consultants(tenant_id);
create index on bench.consultants(status);
create index on bench.consultants using gin (skills);
create index on bench.consultants using gin (search_tsv);

-- FTS trigger for consultants
create or replace function bench.consultant_tsv_update() returns trigger language plpgsql as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.first_name,'')||' '||coalesce(new.last_name,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.primary_skill,'')), 'A') ||
    setweight(to_tsvector('simple', array_to_string(new.skills,' ')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.summary,'')), 'C');
  return new;
end; $$;

create trigger trg_bench_tsv before insert or update on bench.consultants 
  for each row execute function bench.consultant_tsv_update();

-- Rate cards (tenant-wide defaults + per consultant override)
create table bench.rate_cards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  location_region text not null, -- US, India, EU, etc.
  role_title text not null,
  min_rate numeric(14,2) not null,
  max_rate numeric(14,2) not null,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz default now(),
  unique(tenant_id, location_region, role_title, currency)
);

create index on bench.rate_cards(tenant_id);

-- Marketing targets (account/contact via CRM integration)
create table bench.marketing_targets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  consultant_id uuid not null references bench.consultants(id) on delete cascade,
  account_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  channel text default 'email', -- email, linkedin, phone, portal
  status text not null default 'queued' check (status in ('queued','sent','responded','interested','not_interested','blocked')),
  last_action text,
  last_action_at timestamptz,
  owner_id uuid references core.users(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

create index on bench.marketing_targets(tenant_id);
create index on bench.marketing_targets(consultant_id);
create index on bench.marketing_targets(status);

-- Submissions (to client/vendor/job)
create table bench.submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  consultant_id uuid not null references bench.consultants(id) on delete cascade,
  job_ref text, -- free text or ats.jobs id reference
  submission_date timestamptz default now(),
  pay_rate numeric(14,2),
  bill_rate numeric(14,2),
  currency text default 'USD',
  resume_url text,
  vendor_name text,
  client_name text,
  status text not null default 'submitted' check (status in ('submitted','shortlisted','interview','rejected','offered','withdrawn','placed')),
  owner_id uuid references core.users(id) on delete set null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on bench.submissions(tenant_id);
create index on bench.submissions(consultant_id);
create index on bench.submissions(status);

-- Placements
create table bench.placements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  consultant_id uuid not null references bench.consultants(id) on delete restrict,
  client_name text not null,
  project_name text,
  start_date date not null,
  end_date date,
  pay_rate numeric(14,2),
  bill_rate numeric(14,2),
  currency text default 'USD',
  location text,
  employment_type text default 'contract',
  po_number text,
  notes text,
  created_at timestamptz default now()
);

create index on bench.placements(tenant_id);
create index on bench.placements(consultant_id);

-- Enable RLS
alter table bench.skills enable row level security;
alter table bench.consultants enable row level security;
alter table bench.rate_cards enable row level security;
alter table bench.marketing_targets enable row level security;
alter table bench.submissions enable row level security;
alter table bench.placements enable row level security;

-- RLS policies (tenant read; recruiter/manager/admin write)
create policy b_read on bench.consultants for select 
  using (tenant_id = sec.current_tenant_id());

create policy b_write on bench.consultants for all 
  using (
    tenant_id = sec.current_tenant_id() and exists (
      select 1 from core.user_roles ur join core.roles r on r.id = ur.role_id
      where ur.tenant_id = bench.consultants.tenant_id 
        and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','manager','recruiter')
    )
  );

create policy sk_read on bench.skills for select 
  using (tenant_id = sec.current_tenant_id());

create policy sk_write on bench.skills for all 
  using (tenant_id = sec.current_tenant_id());

create policy rc_read on bench.rate_cards for select 
  using (tenant_id = sec.current_tenant_id());

create policy rc_write on bench.rate_cards for all 
  using (
    tenant_id = sec.current_tenant_id() and exists (
      select 1 from core.user_roles ur join core.roles r on r.id = ur.role_id
      where ur.tenant_id = bench.rate_cards.tenant_id 
        and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','manager','finance')
    )
  );

create policy mt_read on bench.marketing_targets for select 
  using (tenant_id = sec.current_tenant_id());

create policy mt_write on bench.marketing_targets for all 
  using (tenant_id = sec.current_tenant_id());

create policy sub_read on bench.submissions for select 
  using (tenant_id = sec.current_tenant_id());

create policy sub_write on bench.submissions for all 
  using (tenant_id = sec.current_tenant_id());

create policy pl_read on bench.placements for select 
  using (tenant_id = sec.current_tenant_id());

create policy pl_write on bench.placements for all 
  using (
    tenant_id = sec.current_tenant_id() and exists (
      select 1 from core.user_roles ur join core.roles r on r.id = ur.role_id
      where ur.tenant_id = bench.placements.tenant_id 
        and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','manager')
    )
  );

-- Audit helper
create or replace function bench.audit(_action text, _resource text, _payload jsonb)
returns void language sql security definer as $$ 
  select sec.log_action(sec.current_tenant_id(), sec.current_user_id(), _action, _resource, _payload); 
$$;

-- Trigger to auto-update consultant status on placement
create or replace function bench.on_placement_consultant_update() 
returns trigger language plpgsql as $$
begin
  update bench.consultants set status='deployed' where id=new.consultant_id;
  perform bench.audit('placed','consultant', jsonb_build_object('consultant_id',new.consultant_id,'placement_id',new.id));
  return new;
end; 
$$;

create trigger trg_bench_place after insert on bench.placements 
  for each row execute function bench.on_placement_consultant_update();

-- Dashboard KPIs view
create or replace view bench.dashboard_kpis as
select
  tenant_id,
  count(*) filter (where status = 'bench') as on_bench,
  count(*) filter (where status = 'marketing') as marketing,
  count(*) filter (where status = 'interview') as interviews,
  count(*) filter (where status = 'offered') as offers,
  count(*) filter (where status = 'deployed') as deployed,
  count(*) filter (where status = 'hold') as on_hold,
  count(*) filter (where status = 'inactive') as inactive
from bench.consultants
group by tenant_id;
