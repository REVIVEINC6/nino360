{{
  config(
    materialized='table',
    tags=['marts', 'crm', 'daily']
  )
}}

with opportunities as (
  select
    json_extract_scalar(data, '$.id') as id,
    json_extract_scalar(data, '$.tenant_id') as tenant_id,
    json_extract_scalar(data, '$.account_id') as account_id,
    json_extract_scalar(data, '$.name') as opportunity_name,
    json_extract_scalar(data, '$.stage') as stage,
    cast(json_extract_scalar(data, '$.amount') as numeric) as amount,
    cast(json_extract_scalar(data, '$.probability') as numeric) as probability,
    timestamp(json_extract_scalar(data, '$.close_date')) as close_date,
    json_extract_scalar(data, '$.status') as status,
    ts as changed_at,
    op,
    row_number() over (partition by json_extract_scalar(data, '$.id') order by ts desc) as rn
  from {{ source('raw', 'crm_opportunities_changes') }}
)

select
  tenant_id,
  opportunity_name,
  stage,
  amount,
  probability,
  amount * (probability / 100) as weighted_amount,
  datetime(close_date, '{{ var("reporting_timezone") }}') as close_date_ist,
  date_trunc(date(close_date), week) as close_week,
  date_trunc(date(close_date), month) as close_month,
  status,
  changed_at as _last_updated
from opportunities
where rn = 1 and op != 'D' and status = 'open'
