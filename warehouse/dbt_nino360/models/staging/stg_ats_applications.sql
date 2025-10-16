{{
  config(
    materialized='view',
    tags=['staging', 'ats']
  )
}}

with changes as (
  select
    json_extract_scalar(data, '$.id') as id,
    json_extract_scalar(data, '$.tenant_id') as tenant_id,
    json_extract_scalar(data, '$.job_id') as job_id,
    json_extract_scalar(data, '$.candidate_id') as candidate_id,
    json_extract_scalar(data, '$.stage') as stage,
    json_extract_scalar(data, '$.status') as status,
    json_extract_scalar(data, '$.source') as source,
    cast(json_extract_scalar(data, '$.score') as numeric) as score,
    timestamp(json_extract_scalar(data, '$.applied_at')) as applied_at,
    timestamp(json_extract_scalar(data, '$.hired_at')) as hired_at,
    ts as changed_at,
    op as operation
  from {{ source('raw', 'ats_applications_changes') }}
),

ranked as (
  select 
    *,
    row_number() over (partition by id order by changed_at desc) as rn
  from changes
)

select
  id,
  tenant_id,
  job_id,
  candidate_id,
  stage,
  status,
  source,
  score,
  datetime(applied_at, '{{ var("reporting_timezone") }}') as applied_at_ist,
  datetime(hired_at, '{{ var("reporting_timezone") }}') as hired_at_ist,
  changed_at as _last_updated
from ranked
where rn = 1 and operation != 'D'
