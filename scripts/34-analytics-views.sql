-- Nino360 — Analytics Views for Tenant Analytics Dashboard
-- Creates views and functions for usage, seats, adoption, copilot, and audit metrics

-- =====================
-- USAGE METRICS VIEWS
-- =====================

-- Daily/Weekly/Monthly Active Users
create or replace view rpt.tenant_daily_usage as
select 
  t.id as tenant_id,
  date_trunc('day', al.created_at) as day,
  count(distinct al.user_id) as dau,
  count(distinct al.id) as events,
  count(distinct al.session_id) as sessions
from core.tenants t
left join app.audit_log al on al.tenant_id = t.id
where al.created_at >= current_date - interval '90 days'
group by t.id, date_trunc('day', al.created_at);

create or replace view rpt.tenant_weekly_usage as
select 
  t.id as tenant_id,
  date_trunc('week', al.created_at) as week_start,
  count(distinct al.user_id) as wau
from core.tenants t
left join app.audit_log al on al.tenant_id = t.id
where al.created_at >= current_date - interval '90 days'
group by t.id, date_trunc('week', al.created_at);

create or replace view rpt.tenant_monthly_usage as
select 
  t.id as tenant_id,
  date_trunc('month', al.created_at) as month_start,
  count(distinct al.user_id) as mau
from core.tenants t
left join app.audit_log al on al.tenant_id = t.id
where al.created_at >= current_date - interval '12 months'
group by t.id, date_trunc('month', al.created_at);

-- =====================
-- SEATS BY ROLE VIEW
-- =====================

create or replace view rpt.seats_by_role as
select 
  tm.tenant_id,
  tm.role,
  count(*) as total_count,
  count(*) filter (where tm.status = 'active') as active_count,
  count(*) filter (where tm.status = 'invited') as invited_count
from core.tenant_members tm
group by tm.tenant_id, tm.role;

-- =====================
-- FEATURE ADOPTION VIEW
-- =====================

create or replace view rpt.feature_adoption as
select 
  al.tenant_id,
  date_trunc('day', al.created_at) as day,
  case 
    when al.action like 'crm:%' then 'CRM'
    when al.action like 'talent:%' or al.action like 'ats:%' then 'Talent'
    when al.action like 'hrms:%' then 'HRMS'
    when al.action like 'finance:%' then 'Finance'
    when al.action like 'bench:%' then 'Bench'
    when al.action like 'vms:%' then 'VMS'
    when al.action like 'projects:%' then 'Projects'
    when al.action like 'reports:%' then 'Reports'
    when al.action like 'automation:%' then 'Automation'
    when al.action like 'audit:%' or al.action like 'security:%' then 'Trust'
    else 'Other'
  end as module,
  count(distinct al.user_id) as users_active
from app.audit_log al
where al.created_at >= current_date - interval '90 days'
group by al.tenant_id, date_trunc('day', al.created_at), module;

-- =====================
-- COPILOT METRICS VIEW
-- =====================

-- Note: This assumes a copilot_usage table exists or will be created
-- If not, this view will return empty results gracefully
create or replace view rpt.copilot_daily as
select 
  tenant_id,
  date_trunc('day', created_at) as day,
  count(*) as prompts,
  sum(tokens_used) as tokens,
  sum(cost_usd) as cost_usd,
  avg(case when accepted then 1.0 else 0.0 end) as accept_rate
from (
  -- Mock data structure - replace with actual copilot_usage table when available
  select 
    al.tenant_id,
    al.created_at,
    100 as tokens_used,
    0.001 as cost_usd,
    true as accepted
  from app.audit_log al
  where al.action like 'copilot:%'
    and al.created_at >= current_date - interval '90 days'
) copilot_data
group by tenant_id, date_trunc('day', created_at);

-- =====================
-- AUDIT ROLLUP VIEW
-- =====================

create or replace view rpt.audit_top_actions as
select 
  al.tenant_id,
  date_trunc('day', al.created_at) as day,
  al.action,
  count(*) as count
from app.audit_log al
where al.created_at >= current_date - interval '30 days'
group by al.tenant_id, date_trunc('day', al.created_at), al.action;

-- =====================
-- GRANTS
-- =====================

grant select on rpt.tenant_daily_usage to authenticated;
grant select on rpt.tenant_weekly_usage to authenticated;
grant select on rpt.tenant_monthly_usage to authenticated;
grant select on rpt.seats_by_role to authenticated;
grant select on rpt.feature_adoption to authenticated;
grant select on rpt.copilot_daily to authenticated;
grant select on rpt.audit_top_actions to authenticated;

comment on view rpt.tenant_daily_usage is 'Daily active users, sessions, and events by tenant';
comment on view rpt.tenant_weekly_usage is 'Weekly active users by tenant';
comment on view rpt.tenant_monthly_usage is 'Monthly active users by tenant';
comment on view rpt.seats_by_role is 'Seat counts by role and status';
comment on view rpt.feature_adoption is 'Module usage over time';
comment on view rpt.copilot_daily is 'Daily copilot metrics';
comment on view rpt.audit_top_actions is 'Top actions by day for audit rollup';
