-- Nino360 — Step 8: Reports & AI Copilot
-- Complete analytics layer with semantic warehouse, materialized metrics, dashboards, and conversational AI

-- =====================
-- REPORTING SCHEMA
-- =====================
create schema if not exists rpt;

-- =====================
-- SOURCE SNAPSHOTS (daily aggregations)
-- =====================
create materialized view if not exists rpt.kpi_ats_daily as
select date_trunc('day', a.applied_at) as d,
       a.tenant_id,
       count(*) filter (where a.status='hired') as hires,
       count(*) filter (where a.status='offered') as offers,
       count(*) as applications
from ats.applications a
group by 1,2;
create index if not exists idx_kpi_ats_daily on rpt.kpi_ats_daily(tenant_id,d);

create materialized view if not exists rpt.kpi_bench_daily as
select date_trunc('day', c.created_at) as d,
       c.tenant_id,
       count(*) filter (where c.status='bench') as bench,
       count(*) filter (where c.status='marketing') as marketing,
       count(*) filter (where c.status='deployed') as deployed
from bench.consultants c
group by 1,2;
create index if not exists idx_kpi_bench_daily on rpt.kpi_bench_daily(tenant_id,d);

create materialized view if not exists rpt.kpi_finance_daily as
select g.d, g.tenant_id,
       coalesce(inv.total,0) as ar_invoiced,
       coalesce(pay.total,0) as ar_collected,
       coalesce(bill.total,0) as ap_billed,
       coalesce(payout.total,0) as ap_paid
from (
  select distinct date_trunc('day', i.created_at) d, i.tenant_id from finance.invoices i
) g
left join (
  select date_trunc('day', created_at) d, tenant_id, sum(total) total from finance.invoices group by 1,2
) inv using (d,tenant_id)
left join (
  select date_trunc('day', received_at) d, tenant_id, sum(amount) total from finance.payments group by 1,2
) pay using (d,tenant_id)
left join (
  select date_trunc('day', created_at) d, tenant_id, sum(total) total from finance.bills group by 1,2
) bill using (d,tenant_id)
left join (
  select date_trunc('day', paid_at) d, tenant_id, sum(amount) total from finance.payouts group by 1,2
) payout using (d,tenant_id);
create index if not exists idx_kpi_finance_daily on rpt.kpi_finance_daily(tenant_id,d);

create materialized view if not exists rpt.kpi_projects_daily as
select date_trunc('day', t.updated_at) d, t.tenant_id,
       count(*) filter (where t.status='done') as tasks_done,
       sum(t.estimate_hours) as est_hours,
       sum(t.logged_hours) as logged_hours
from proj.tasks t
group by 1,2;
create index if not exists idx_kpi_projects_daily on rpt.kpi_projects_daily(tenant_id,d);

-- =====================
-- CONFORMED DIMENSIONS
-- =====================
create view rpt.dim_clients as select id, tenant_id, name, currency from finance.clients;
create view rpt.dim_vendors as select id, name from vms.vendor_orgs;
create view rpt.dim_jobs as select id, tenant_id, title, department from ats.jobs;

-- =====================
-- FACT TABLES (thin views)
-- =====================
create view rpt.fact_revenue as
select i.tenant_id, i.id invoice_id, i.client_id, i.issue_date, i.due_date, i.total, i.currency, i.status
from finance.invoices i;

create view rpt.fact_expense as
select b.tenant_id, b.id bill_id, b.vendor_id, b.bill_date, b.due_date, b.total, b.currency, b.status
from finance.bills b;

create view rpt.fact_timesheet as
select t.tenant_id, t.id timesheet_id, e.work_date, e.hours, e.bill_rate, e.pay_rate, t.person_id, t.placement_id
from finance.timesheets t join finance.timesheet_entries e on e.timesheet_id=t.id;

-- =====================
-- KPI ROLLUPS (current)
-- =====================
create or replace view rpt.kpis_current as
select
  t.id tenant_id,
  (select count(*) from ats.jobs j where j.tenant_id=t.id and j.status='open') as open_jobs,
  (select count(*) from bench.consultants c where c.tenant_id=t.id and c.status='bench') as bench_pool,
  (select sum(total) from finance.invoices i where i.tenant_id=t.id and i.status in ('approved','sent','partially_paid')) as ar_open,
  (select sum(total) from finance.bills b where b.tenant_id=t.id and b.status in ('approved','scheduled')) as ap_open,
  (select count(*) from proj.projects p where p.tenant_id=t.id and p.status='active') as active_projects
from core.tenants t;

-- =====================
-- QUERY CACHE & AUDIT
-- =====================
create table if not exists rpt.query_cache (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  key text not null,
  result jsonb not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  ttl_seconds int4 not null default 600
);
create index if not exists idx_rpt_cache_tenant_key on rpt.query_cache(tenant_id, key);

create table if not exists rpt.query_audit (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  ui text, -- dashboard|copilot|explorer
  prompt text,
  sql text,
  rowcount int4,
  duration_ms int4,
  created_at timestamptz default now()
);
create index if not exists idx_rpt_audit_tenant on rpt.query_audit(tenant_id, created_at desc);

-- =====================
-- SEMANTIC LAYER — ALLOWLIST
-- =====================
create table if not exists rpt.allowlist (
  rel text primary key,
  description text
);

insert into rpt.allowlist(rel, description) values
  ('rpt.kpis_current','Tenant snapshot KPIs'),
  ('rpt.kpi_ats_daily','ATS daily KPIs'),
  ('rpt.kpi_bench_daily','Bench daily KPIs'),
  ('rpt.kpi_finance_daily','Finance daily KPIs'),
  ('rpt.kpi_projects_daily','Project daily KPIs'),
  ('rpt.fact_revenue','Invoices'),
  ('rpt.fact_expense','Bills'),
  ('rpt.fact_timesheet','Timesheet hours')
on conflict do nothing;

-- =====================
-- SAVED LOOKS
-- =====================
create table if not exists rpt.saved_looks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  title text not null,
  sql text not null,
  viz text not null,
  schedule text,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists idx_saved_looks_tenant on rpt.saved_looks(tenant_id);

-- =====================
-- RLS & GRANTS
-- =====================
alter materialized view if exists rpt.kpi_ats_daily owner to postgres;
alter materialized view if exists rpt.kpi_bench_daily owner to postgres;
alter materialized view if exists rpt.kpi_finance_daily owner to postgres;
alter materialized view if exists rpt.kpi_projects_daily owner to postgres;

revoke all on schema rpt from anon;
grant usage on schema rpt to authenticated;
grant select on all tables in schema rpt to authenticated;
grant select on all tables in schema rpt to authenticated;

-- =====================
-- REFRESH FUNCTION
-- =====================
create or replace function rpt.refresh_all_matviews()
returns void language plpgsql security definer as $$
begin
  refresh materialized view concurrently rpt.kpi_ats_daily;
  refresh materialized view concurrently rpt.kpi_bench_daily;
  refresh materialized view concurrently rpt.kpi_finance_daily;
  refresh materialized view concurrently rpt.kpi_projects_daily;
end; $$;

comment on schema rpt is 'Reporting schema with materialized views, dimensions, facts, and KPI rollups';
