{{
  config(
    materialized='table',
    tags=['marts', 'finance', 'hourly'],
    partition_by={
      "field": "invoice_date_ist",
      "data_type": "date",
      "granularity": "month"
    },
    cluster_by=['tenant_id', 'status']
  )
}}

with invoices as (
  select * from {{ ref('stg_finance_invoices') }}
  where status in ('sent', 'overdue', 'partial')
),

aging as (
  select
    *,
    date_diff(current_date(), date(due_date_ist), day) as days_overdue,
    case
      when date_diff(current_date(), date(due_date_ist), day) <= 0 then 'current'
      when date_diff(current_date(), date(due_date_ist), day) <= 30 then '1-30'
      when date_diff(current_date(), date(due_date_ist), day) <= 60 then '31-60'
      when date_diff(current_date(), date(due_date_ist), day) <= 90 then '61-90'
      else '90+'
    end as aging_bucket
  from invoices
)

select
  tenant_id,
  invoice_number,
  client_id,
  total as amount_due,
  currency,
  status,
  invoice_date_ist,
  due_date_ist,
  days_overdue,
  aging_bucket,
  _last_updated
from aging
