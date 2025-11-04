{{
  config(
    materialized='view',
    tags=['staging', 'finance']
  )
}}

with changes as (
  select
    json_extract_scalar(data, '$.id') as id,
    json_extract_scalar(data, '$.tenant_id') as tenant_id,
    json_extract_scalar(data, '$.invoice_number') as invoice_number,
    json_extract_scalar(data, '$.client_id') as client_id,
    cast(json_extract_scalar(data, '$.amount') as numeric) as amount,
    cast(json_extract_scalar(data, '$.tax') as numeric) as tax,
    cast(json_extract_scalar(data, '$.total') as numeric) as total,
    json_extract_scalar(data, '$.currency') as currency,
    json_extract_scalar(data, '$.status') as status,
    timestamp(json_extract_scalar(data, '$.invoice_date')) as invoice_date,
    timestamp(json_extract_scalar(data, '$.due_date')) as due_date,
    timestamp(json_extract_scalar(data, '$.paid_date')) as paid_date,
    ts as changed_at,
    op as operation
  from {{ source('raw', 'finance_invoices_changes') }}
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
  invoice_number,
  client_id,
  amount,
  tax,
  total,
  currency,
  status,
  -- Convert to IST timezone
  datetime(invoice_date, '{{ var("reporting_timezone") }}') as invoice_date_ist,
  datetime(due_date, '{{ var("reporting_timezone") }}') as due_date_ist,
  datetime(paid_date, '{{ var("reporting_timezone") }}') as paid_date_ist,
  changed_at as _last_updated
from ranked
where rn = 1 
  and operation != 'D'  -- Exclude soft deletes
