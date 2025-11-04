-- Nino360 Step 6: Finance Module (AR/AP, Timesheets, Payroll, Revenue)
-- Complete financial management system with multi-currency, tax management, and approval workflows

-- Create finance schema
create schema if not exists finance;

-- Finance Clients (AR)
create table if not exists finance.clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  legal_name text,
  tax_id text,
  billing_email text,
  billing_address jsonb default '{}'::jsonb,
  currency text not null default 'USD',
  payment_terms text default 'NET30',
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, name)
);
create index on finance.clients(tenant_id);
create index on finance.clients(status);

-- AR Invoices
create table if not exists finance.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  client_id uuid not null references finance.clients(id) on delete restrict,
  invoice_no text not null,
  issue_date date not null default current_date,
  due_date date not null,
  currency text not null default 'USD',
  subtotal numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  paid_amount numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','sent','partially_paid','paid','void','overdue')),
  file_url text,
  notes text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, invoice_no)
);
create index on finance.invoices(tenant_id, client_id);
create index on finance.invoices(status);
create index on finance.invoices(due_date);

-- Invoice Line Items
create table if not exists finance.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references finance.invoices(id) on delete cascade,
  line_no int not null,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  tax_rate numeric(6,3) not null default 0,
  amount numeric(14,2) not null default 0,
  created_at timestamptz default now(),
  unique(invoice_id, line_no)
);
create index on finance.invoice_lines(invoice_id);

-- AP Bills (Vendor)
create table if not exists finance.bills (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  vendor_id uuid not null references vms.vendor_orgs(id) on delete restrict,
  bill_no text not null,
  bill_date date not null default current_date,
  due_date date not null,
  currency text not null default 'USD',
  subtotal numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  paid_amount numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','scheduled','paid','void')),
  file_url text,
  notes text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, bill_no)
);
create index on finance.bills(tenant_id, vendor_id);
create index on finance.bills(status);
create index on finance.bills(due_date);

-- Bill Line Items
create table if not exists finance.bill_lines (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references finance.bills(id) on delete cascade,
  line_no int not null,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_cost numeric(14,2) not null default 0,
  tax_rate numeric(6,3) not null default 0,
  amount numeric(14,2) not null default 0,
  created_at timestamptz default now(),
  unique(bill_id, line_no)
);
create index on finance.bill_lines(bill_id);

-- Timesheets
create table if not exists finance.timesheets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  person_id uuid not null, -- bench.consultants.id or core.users.id
  person_name text not null,
  placement_id uuid references bench.placements(id) on delete set null,
  week_start date not null,
  week_end date not null,
  total_hours numeric(6,2) not null default 0,
  status text not null default 'open' check (status in ('open','submitted','approved','rejected','locked','invoiced')),
  approver_id uuid references core.users(id) on delete set null,
  approved_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, person_id, week_start)
);
create index on finance.timesheets(tenant_id, person_id);
create index on finance.timesheets(status);
create index on finance.timesheets(week_start);

-- Timesheet Entries
create table if not exists finance.timesheet_entries (
  id uuid primary key default gen_random_uuid(),
  timesheet_id uuid not null references finance.timesheets(id) on delete cascade,
  work_date date not null,
  hours numeric(5,2) not null default 0,
  project text,
  task text,
  notes text,
  bill_rate numeric(14,2),
  pay_rate numeric(14,2),
  created_at timestamptz default now()
);
create index on finance.timesheet_entries(timesheet_id);
create index on finance.timesheet_entries(work_date);

-- Expenses
create table if not exists finance.expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  person_id uuid not null,
  person_name text not null,
  expense_date date not null,
  category text not null,
  description text,
  amount numeric(14,2) not null,
  currency text not null default 'USD',
  receipt_url text,
  status text not null default 'submitted' check (status in ('submitted','approved','rejected','reimbursed')),
  approver_id uuid references core.users(id) on delete set null,
  approved_at timestamptz,
  reimbursed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on finance.expenses(tenant_id, person_id);
create index on finance.expenses(status);
create index on finance.expenses(expense_date);

-- Payments (from clients)
create table if not exists finance.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  invoice_id uuid references finance.invoices(id) on delete set null,
  amount numeric(14,2) not null,
  currency text not null default 'USD',
  method text not null default 'bank', -- bank, card, upi, ach, wire, stripe
  reference text,
  received_at timestamptz not null default now(),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index on finance.payments(tenant_id, invoice_id);
create index on finance.payments(received_at);

-- Payouts (to vendors/consultants)
create table if not exists finance.payouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  bill_id uuid references finance.bills(id) on delete set null,
  expense_id uuid references finance.expenses(id) on delete set null,
  amount numeric(14,2) not null,
  currency text not null default 'USD',
  method text not null default 'bank', -- bank, ach, wire, upi, paypal
  reference text,
  paid_at timestamptz not null default now(),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index on finance.payouts(tenant_id, bill_id);
create index on finance.payouts(tenant_id, expense_id);
create index on finance.payouts(paid_at);

-- Taxes
create table if not exists finance.taxes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  region text not null, -- e.g., IN, US-CA, EU, UK
  name text not null,  -- GST, VAT, Sales Tax, IGST, CGST, SGST
  rate numeric(6,3) not null,
  inclusive boolean default false,
  account_code text,
  active boolean default true,
  created_at timestamptz default now(),
  unique(tenant_id, region, name)
);
create index on finance.taxes(tenant_id);
create index on finance.taxes(active);

-- FX Rates
create table if not exists finance.fx_rates (
  id uuid primary key default gen_random_uuid(),
  base text not null,
  quote text not null,
  rate numeric(16,6) not null,
  as_of date not null,
  created_at timestamptz default now(),
  unique(base, quote, as_of)
);
create index on finance.fx_rates(base, quote, as_of);

-- Revenue Schedules (for accrual accounting)
create table if not exists finance.revenue_schedules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  invoice_id uuid references finance.invoices(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  total_amount numeric(14,2) not null,
  recognized_amount numeric(14,2) not null default 0,
  method text not null default 'straight_line', -- straight_line, milestone, completed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on finance.revenue_schedules(tenant_id, invoice_id);

-- Finance Settings (per tenant)
create table if not exists finance.settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade unique,
  invoice_prefix text default 'INV',
  bill_prefix text default 'BILL',
  next_invoice_no int default 1000,
  next_bill_no int default 1000,
  default_currency text default 'USD',
  default_payment_terms text default 'NET30',
  fiscal_year_start text default '01-01', -- MM-DD
  lock_period_before date,
  auto_approve_timesheets boolean default false,
  auto_generate_invoices boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on finance.settings(tenant_id);

-- Enable RLS
alter table finance.clients enable row level security;
alter table finance.invoices enable row level security;
alter table finance.invoice_lines enable row level security;
alter table finance.bills enable row level security;
alter table finance.bill_lines enable row level security;
alter table finance.timesheets enable row level security;
alter table finance.timesheet_entries enable row level security;
alter table finance.expenses enable row level security;
alter table finance.payments enable row level security;
alter table finance.payouts enable row level security;
alter table finance.taxes enable row level security;
alter table finance.fx_rates enable row level security;
alter table finance.revenue_schedules enable row level security;
alter table finance.settings enable row level security;

-- RLS Policies: Tenant membership read; finance/admin write

-- Clients
create policy fin_clients_read on finance.clients for select using (tenant_id = sec.current_tenant_id());
create policy fin_clients_write on finance.clients for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.clients.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Invoices
create policy fin_invoices_read on finance.invoices for select using (tenant_id = sec.current_tenant_id());
create policy fin_invoices_write on finance.invoices for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.invoices.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Invoice Lines (inherit from invoice)
create policy fin_invoice_lines_read on finance.invoice_lines for select using (
  exists (select 1 from finance.invoices where id = finance.invoice_lines.invoice_id and tenant_id = sec.current_tenant_id())
);
create policy fin_invoice_lines_write on finance.invoice_lines for all using (
  exists (
    select 1 from finance.invoices inv
    join core.user_roles ur on ur.tenant_id = inv.tenant_id
    join core.roles r on r.id = ur.role_id
    where inv.id = finance.invoice_lines.invoice_id
      and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Bills
create policy fin_bills_read on finance.bills for select using (tenant_id = sec.current_tenant_id());
create policy fin_bills_write on finance.bills for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.bills.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Bill Lines (inherit from bill)
create policy fin_bill_lines_read on finance.bill_lines for select using (
  exists (select 1 from finance.bills where id = finance.bill_lines.bill_id and tenant_id = sec.current_tenant_id())
);
create policy fin_bill_lines_write on finance.bill_lines for all using (
  exists (
    select 1 from finance.bills b
    join core.user_roles ur on ur.tenant_id = b.tenant_id
    join core.roles r on r.id = ur.role_id
    where b.id = finance.bill_lines.bill_id
      and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Timesheets (read: all members; write: finance/admin/manager)
create policy fin_timesheets_read on finance.timesheets for select using (tenant_id = sec.current_tenant_id());
create policy fin_timesheets_write on finance.timesheets for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.timesheets.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','manager','finance')
  )
);

-- Timesheet Entries (inherit from timesheet)
create policy fin_timesheet_entries_read on finance.timesheet_entries for select using (
  exists (select 1 from finance.timesheets where id = finance.timesheet_entries.timesheet_id and tenant_id = sec.current_tenant_id())
);
create policy fin_timesheet_entries_write on finance.timesheet_entries for all using (
  exists (
    select 1 from finance.timesheets ts
    join core.user_roles ur on ur.tenant_id = ts.tenant_id
    join core.roles r on r.id = ur.role_id
    where ts.id = finance.timesheet_entries.timesheet_id
      and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','manager','finance')
  )
);

-- Expenses
create policy fin_expenses_read on finance.expenses for select using (tenant_id = sec.current_tenant_id());
create policy fin_expenses_write on finance.expenses for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.expenses.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','manager','finance')
  )
);

-- Payments
create policy fin_payments_read on finance.payments for select using (tenant_id = sec.current_tenant_id());
create policy fin_payments_write on finance.payments for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.payments.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Payouts
create policy fin_payouts_read on finance.payouts for select using (tenant_id = sec.current_tenant_id());
create policy fin_payouts_write on finance.payouts for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.payouts.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Taxes
create policy fin_taxes_read on finance.taxes for select using (tenant_id = sec.current_tenant_id());
create policy fin_taxes_write on finance.taxes for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.taxes.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- FX Rates (read: all; write: finance/admin)
create policy fin_fx_rates_read on finance.fx_rates for select using (true);
create policy fin_fx_rates_write on finance.fx_rates for all using (
  exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Revenue Schedules
create policy fin_revenue_schedules_read on finance.revenue_schedules for select using (tenant_id = sec.current_tenant_id());
create policy fin_revenue_schedules_write on finance.revenue_schedules for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.revenue_schedules.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Settings
create policy fin_settings_read on finance.settings for select using (tenant_id = sec.current_tenant_id());
create policy fin_settings_write on finance.settings for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = finance.settings.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','finance')
  )
);

-- Audit helper function
create or replace function finance.audit(_action text, _resource text, _payload jsonb)
returns void language sql security definer as $$
  select sec.log_action(sec.current_tenant_id(), sec.current_user_id(), _action, _resource, _payload);
$$;

-- Trigger to update invoice paid_amount when payments are added
create or replace function finance.update_invoice_paid_amount()
returns trigger language plpgsql security definer as $$
begin
  update finance.invoices
  set paid_amount = (
    select coalesce(sum(amount), 0)
    from finance.payments
    where invoice_id = new.invoice_id
  ),
  status = case
    when (select coalesce(sum(amount), 0) from finance.payments where invoice_id = new.invoice_id) >= total then 'paid'
    when (select coalesce(sum(amount), 0) from finance.payments where invoice_id = new.invoice_id) > 0 then 'partially_paid'
    else status
  end,
  updated_at = now()
  where id = new.invoice_id;
  return new;
end;
$$;

create trigger trg_update_invoice_paid_amount
after insert or update or delete on finance.payments
for each row execute function finance.update_invoice_paid_amount();

-- Trigger to update bill paid_amount when payouts are added
create or replace function finance.update_bill_paid_amount()
returns trigger language plpgsql security definer as $$
begin
  update finance.bills
  set paid_amount = (
    select coalesce(sum(amount), 0)
    from finance.payouts
    where bill_id = new.bill_id
  ),
  status = case
    when (select coalesce(sum(amount), 0) from finance.payouts where bill_id = new.bill_id) >= total then 'paid'
    else status
  end,
  updated_at = now()
  where id = new.bill_id;
  return new;
end;
$$;

create trigger trg_update_bill_paid_amount
after insert or update or delete on finance.payouts
for each row execute function finance.update_bill_paid_amount();

-- Trigger to update timesheet total_hours
create or replace function finance.update_timesheet_total_hours()
returns trigger language plpgsql security definer as $$
begin
  update finance.timesheets
  set total_hours = (
    select coalesce(sum(hours), 0)
    from finance.timesheet_entries
    where timesheet_id = coalesce(new.timesheet_id, old.timesheet_id)
  ),
  updated_at = now()
  where id = coalesce(new.timesheet_id, old.timesheet_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_update_timesheet_total_hours
after insert or update or delete on finance.timesheet_entries
for each row execute function finance.update_timesheet_total_hours();

-- View: AR Aging Report
create or replace view finance.ar_aging as
select
  i.tenant_id,
  i.id as invoice_id,
  i.invoice_no,
  c.name as client_name,
  i.issue_date,
  i.due_date,
  i.total,
  i.paid_amount,
  i.total - i.paid_amount as balance,
  i.status,
  current_date - i.due_date as days_overdue,
  case
    when i.status = 'paid' then 'paid'
    when current_date <= i.due_date then 'current'
    when current_date - i.due_date <= 30 then '1-30'
    when current_date - i.due_date <= 60 then '31-60'
    when current_date - i.due_date <= 90 then '61-90'
    else '90+'
  end as aging_bucket
from finance.invoices i
join finance.clients c on c.id = i.client_id
where i.status not in ('void', 'paid');

-- View: AP Aging Report
create or replace view finance.ap_aging as
select
  b.tenant_id,
  b.id as bill_id,
  b.bill_no,
  v.name as vendor_name,
  b.bill_date,
  b.due_date,
  b.total,
  b.paid_amount,
  b.total - b.paid_amount as balance,
  b.status,
  current_date - b.due_date as days_overdue,
  case
    when b.status = 'paid' then 'paid'
    when current_date <= b.due_date then 'current'
    when current_date - b.due_date <= 30 then '1-30'
    when current_date - b.due_date <= 60 then '31-60'
    when current_date - b.due_date <= 90 then '61-90'
    else '90+'
  end as aging_bucket
from finance.bills b
join vms.vendor_orgs v on v.id = b.vendor_id
where b.status not in ('void', 'paid');

-- Seed default finance settings for existing tenants
insert into finance.settings (tenant_id)
select id from core.tenants
on conflict (tenant_id) do nothing;

-- Seed common tax rates
insert into finance.taxes (tenant_id, region, name, rate, inclusive) values
  ((select id from core.tenants where slug = 'master' limit 1), 'IN', 'GST 18%', 18.000, false),
  ((select id from core.tenants where slug = 'master' limit 1), 'IN', 'GST 12%', 12.000, false),
  ((select id from core.tenants where slug = 'master' limit 1), 'IN', 'GST 5%', 5.000, false),
  ((select id from core.tenants where slug = 'master' limit 1), 'US', 'Sales Tax', 8.500, false),
  ((select id from core.tenants where slug = 'master' limit 1), 'UK', 'VAT 20%', 20.000, true),
  ((select id from core.tenants where slug = 'master' limit 1), 'EU', 'VAT 21%', 21.000, true)
on conflict (tenant_id, region, name) do nothing;

-- Success message
do $$
begin
  raise notice 'Finance module schema created successfully!';
  raise notice 'Tables: clients, invoices, bills, timesheets, expenses, payments, payouts, taxes, fx_rates, revenue_schedules, settings';
  raise notice 'Views: ar_aging, ap_aging';
  raise notice 'RLS policies enabled for all tables';
end $$;
