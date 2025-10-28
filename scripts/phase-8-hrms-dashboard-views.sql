-- Phase 8: HRMS Dashboard Views
-- Requires: Phase 2 (hrms_employees, hrms_timesheets tables)

-- Added table existence checks to ensure Phase 2 has been run
DO $$ 
BEGIN
  -- Check if required tables exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hrms_employees') THEN
    RAISE EXCEPTION 'Table hrms_employees does not exist. Please run Phase 2 (phase-2-module-tables.sql) first.';
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hrms_timesheets') THEN
    RAISE EXCEPTION 'Table hrms_timesheets does not exist. Please run Phase 2 (phase-2-module-tables.sql) first.';
  END IF;
  
  RAISE NOTICE '🚀 Phase 8: Creating HRMS Dashboard Views...';
END $$;

-- Headcount by month (last 12 months)
create materialized view if not exists vw_headcount_monthly as
with months as (
  select distinct
    e.tenant_id,
    date_trunc('month', generate_series(
      current_date - interval '11 months',
      current_date,
      interval '1 month'
    )) as month
  from hrms_employees e
  where e.tenant_id is not null
  union
  select distinct
    t.id as tenant_id,
    date_trunc('month', generate_series(
      current_date - interval '11 months',
      current_date,
      interval '1 month'
    )) as month
  from core.tenants t
)
select 
  m.tenant_id,
  to_char(m.month, 'YYYY-MM') as month,
  coalesce((
    select count(*)
    from hrms_employees e
    where e.tenant_id = m.tenant_id
      and e.status = 'active'
      and e.hire_date <= (m.month + interval '1 month' - interval '1 day')
  ), 0)::int as value
from months m;

create unique index if not exists idx_vw_headcount_monthly_unique on vw_headcount_monthly(tenant_id, month);

-- Attrition vs Hiring by month
create materialized view if not exists vw_attrition_hiring as
with months as (
  select distinct
    e.tenant_id,
    date_trunc('month', generate_series(
      current_date - interval '11 months',
      current_date,
      interval '1 month'
    )) as month
  from hrms_employees e
  where e.tenant_id is not null
  union
  select distinct
    t.id as tenant_id,
    date_trunc('month', generate_series(
      current_date - interval '11 months',
      current_date,
      interval '1 month'
    )) as month
  from core.tenants t
)
select 
  m.tenant_id,
  to_char(m.month, 'YYYY-MM') as month,
  coalesce((
    select count(*)
    from hrms_employees e
    where e.tenant_id = m.tenant_id
      and date_trunc('month', e.hire_date) = m.month
  ), 0)::int as hired,
  coalesce((
    select count(*)
    from hrms_employees e
    where e.tenant_id = m.tenant_id
      and e.status = 'terminated'
      and date_trunc('month', e.updated_at) = m.month
  ), 0)::int as terminated
from months m;

create unique index if not exists idx_vw_attrition_hiring_unique on vw_attrition_hiring(tenant_id, month);

-- Timesheet compliance by week (last 12 weeks)
create materialized view if not exists vw_timesheet_compliance as
with weeks as (
  select distinct
    t.tenant_id,
    date_trunc('week', generate_series(
      current_date - interval '11 weeks',
      current_date,
      interval '1 week'
    )) as week
  from hrms_timesheets t
  where t.tenant_id is not null
  union
  select distinct
    tn.id as tenant_id,
    date_trunc('week', generate_series(
      current_date - interval '11 weeks',
      current_date,
      interval '1 week'
    )) as week
  from core.tenants tn
)
select 
  w.tenant_id,
  to_char(w.week, 'YYYY-MM-DD') as week,
  coalesce((
    select count(*)
    from hrms_timesheets t
    where t.tenant_id = w.tenant_id
      and date_trunc('week', t.date) = w.week
      and t.status = 'approved'
      and t.created_at <= (w.week + interval '1 week' + interval '2 days')
  ), 0)::int as on_time,
  coalesce((
    select count(*)
    from hrms_timesheets t
    where t.tenant_id = w.tenant_id
      and date_trunc('week', t.date) = w.week
      and t.status = 'approved'
      and t.created_at > (w.week + interval '1 week' + interval '2 days')
  ), 0)::int as late
from weeks w;

create unique index if not exists idx_vw_timesheet_compliance_unique on vw_timesheet_compliance(tenant_id, week);

-- Grant select to authenticated users
grant select on vw_headcount_monthly to authenticated;
grant select on vw_attrition_hiring to authenticated;
grant select on vw_timesheet_compliance to authenticated;

-- Enable RLS
alter materialized view vw_headcount_monthly owner to postgres;
alter materialized view vw_attrition_hiring owner to postgres;
alter materialized view vw_timesheet_compliance owner to postgres;

DO $$ BEGIN
  RAISE NOTICE '✅ Phase 8: HRMS Dashboard Views Created Successfully!';
END $$;
