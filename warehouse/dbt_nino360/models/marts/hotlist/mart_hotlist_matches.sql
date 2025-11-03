{{
  config(
    materialized='table',
    tags=['marts', 'hotlist', 'hourly']
  )
}}

with matches as (
  select
    json_extract_scalar(data, '$.id') as id,
    json_extract_scalar(data, '$.tenant_id') as tenant_id,
    json_extract_scalar(data, '$.candidate_id') as candidate_id,
    json_extract_scalar(data, '$.requirement_id') as requirement_id,
    cast(json_extract_scalar(data, '$.score') as numeric) as match_score,
    json_extract_scalar(data, '$.status') as status,
    timestamp(json_extract_scalar(data, '$.matched_at')) as matched_at,
    timestamp(json_extract_scalar(data, '$.submitted_at')) as submitted_at,
    ts as changed_at,
    op,
    row_number() over (partition by json_extract_scalar(data, '$.id') order by ts desc) as rn
  from {{ source('raw', 'hot_matches_changes') }}
)

select
  tenant_id,
  candidate_id,
  requirement_id,
  match_score,
  case
    when match_score >= 85 then 'excellent'
    when match_score >= 70 then 'good'
    when match_score >= 50 then 'fair'
    else 'poor'
  end as match_quality,
  status,
  datetime(matched_at, '{{ var("reporting_timezone") }}') as matched_at_ist,
  datetime(submitted_at, '{{ var("reporting_timezone") }}') as submitted_at_ist,
  timestamp_diff(submitted_at, matched_at, hour) as hours_to_submit,
  changed_at as _last_updated
from matches
where rn = 1 and op != 'D'
