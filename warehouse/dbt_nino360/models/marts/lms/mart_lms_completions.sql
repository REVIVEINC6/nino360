{{
  config(
    materialized='table',
    tags=['marts', 'lms', 'daily']
  )
}}

with progress as (
  select
    json_extract_scalar(data, '$.id') as id,
    json_extract_scalar(data, '$.tenant_id') as tenant_id,
    json_extract_scalar(data, '$.enrollment_id') as enrollment_id,
    json_extract_scalar(data, '$.lesson_id') as lesson_id,
    json_extract_scalar(data, '$.status') as status,
    cast(json_extract_scalar(data, '$.progress_pct') as numeric) as progress_pct,
    timestamp(json_extract_scalar(data, '$.started_at')) as started_at,
    timestamp(json_extract_scalar(data, '$.completed_at')) as completed_at,
    ts as changed_at,
    op,
    row_number() over (partition by json_extract_scalar(data, '$.id') order by ts desc) as rn
  from {{ source('raw', 'lms_progress_changes') }}
)

select
  tenant_id,
  enrollment_id,
  lesson_id,
  status,
  progress_pct,
  datetime(started_at, '{{ var("reporting_timezone") }}') as started_at_ist,
  datetime(completed_at, '{{ var("reporting_timezone") }}') as completed_at_ist,
  timestamp_diff(completed_at, started_at, hour) as hours_to_complete,
  case when status = 'completed' then 1 else 0 end as is_completed,
  changed_at as _last_updated
from progress
where rn = 1 and op != 'D'
