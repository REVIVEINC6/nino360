-- Additional CRM helpers to complete 15-crm setup when whole-file execution fails

-- Ensure schemas exist
create schema if not exists crm;
create schema if not exists cportal;
create schema if not exists rpt;

-- Client portal tables (if 15-crm didn't create them yet)
create table if not exists cportal.accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  crm_account_id uuid,
  name text not null,
  status text default 'invited',
  branding jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists cportal.users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  portal_account_id uuid not null,
  role text default 'member',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists cportal.shares (
  id uuid primary key default gen_random_uuid(),
  portal_account_id uuid not null,
  tenant_id uuid not null,
  opportunity_id uuid,
  document_id uuid,
  ticket_id uuid,
  can_comment boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_cportal_shares_portal on cportal.shares(portal_account_id, opportunity_id);

-- Client portal helper function
create or replace function cportal.current_portal_id() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'portal_account_id','')::uuid;
$$;

-- Secure views for client portal access
create or replace view cportal.v_opportunities as
select o.* from crm.opportunities o
join cportal.shares s on s.opportunity_id = o.id
where s.portal_account_id = cportal.current_portal_id();

create or replace view cportal.v_documents as
select d.* from crm.documents d
join cportal.shares s on s.document_id = d.id
where s.portal_account_id = cportal.current_portal_id();

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

-- Automation trigger functions
create or replace function crm.trg_auto_opportunity_created()
returns trigger language plpgsql security definer as $$
begin
  insert into auto.outbox (tenant_id, event_type, resource_type, resource_id, payload)
  values (new.tenant_id, 'created', 'opportunity', new.id, to_jsonb(new));
  return new;
end;
$$;

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

-- Triggers (idempotent re-create)
DROP TRIGGER IF EXISTS trg_auto_opportunity_created ON crm.opportunities;
CREATE TRIGGER trg_auto_opportunity_created
AFTER INSERT ON crm.opportunities
FOR EACH ROW EXECUTE FUNCTION crm.trg_auto_opportunity_created();

DROP TRIGGER IF EXISTS trg_auto_opportunity_stage_changed ON crm.opportunities;
CREATE TRIGGER trg_auto_opportunity_stage_changed
AFTER UPDATE ON crm.opportunities
FOR EACH ROW EXECUTE FUNCTION crm.trg_auto_opportunity_stage_changed();

DROP TRIGGER IF EXISTS trg_auto_document_status_changed ON crm.documents;
CREATE TRIGGER trg_auto_document_status_changed
AFTER UPDATE ON crm.documents
FOR EACH ROW EXECUTE FUNCTION crm.trg_auto_document_status_changed();
