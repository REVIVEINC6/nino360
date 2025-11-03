-- Step 6: Finance Module (AR, AP, Pay-on-Pay, Payroll, Budgeting, Forecasting, Expenses, Analytics)
-- Multi-tenant, RBAC/FBAC, GenAI, Automation, Audit

-- Create finance schema
create schema if not exists finance;

-- Add enabled_by_default column to features if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'core' and table_name = 'features' and column_name = 'enabled_by_default'
  ) then
    alter table core.features add column enabled_by_default boolean default false;
  end if;
end $$;

-- Master data: Customers
create table if not exists finance.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  code text,
  contact jsonb default '{}'::jsonb,      -- {email, phone, address}
  terms text default 'NET30',
  currency text default 'USD',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Master data: Vendors
create table if not exists finance.vendors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  code text,
  contact jsonb default '{}'::jsonb,
  currency text default 'USD',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AR: Invoices
create table if not exists finance.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  customer_id uuid references finance.customers(id) on delete restrict,
  number text,
  issue_date date not null,
  due_date date not null,
  currency text default 'USD',
  subtotal numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','partial','paid','void')),
  po_number text,
  reference text,
  pdf_url text,
  ai_parsed jsonb default '{}'::jsonb,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AR: Invoice Items
create table if not exists finance.invoice_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  invoice_id uuid not null references finance.invoices(id) on delete cascade,
  line_no int2 not null,
  description text not null,
  qty numeric(12,3) not null default 1,
  unit_price numeric(14,2) not null default 0,
  amount numeric(14,2) not null default 0,
  tax_rate numeric(5,2) default 0
);

-- AR: Receipts
create table if not exists finance.receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  customer_id uuid not null references finance.customers(id),
  invoice_id uuid references finance.invoices(id) on delete set null,
  received_date date not null,
  amount numeric(14,2) not null,
  method text check (method in ('ach','wire','check','card','cash')),
  reference text,
  created_at timestamptz default now()
);

-- AP: Bills
create table if not exists finance.bills (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  vendor_id uuid not null references finance.vendors(id) on delete restrict,
  number text,
  bill_date date not null,
  due_date date not null,
  currency text default 'USD',
  subtotal numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','partial','paid','void')),
  pdf_url text,
  ai_parsed jsonb default '{}'::jsonb,
  created_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AP: Bill Items
create table if not exists finance.bill_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  bill_id uuid not null references finance.bills(id) on delete cascade,
  line_no int2 not null,
  description text not null,
  qty numeric(12,3) not null default 1,
  unit_cost numeric(14,2) not null default 0,
  amount numeric(14,2) not null default 0,
  tax_rate numeric(5,2) default 0
);

-- AP: Payments
create table if not exists finance.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  vendor_id uuid references finance.vendors(id),
  bill_id uuid references finance.bills(id) on delete set null,
  paid_date date not null,
  amount numeric(14,2) not null,
  method text check (method in ('ach','wire','check','card','cash')),
  reference text,
  created_at timestamptz default now()
);

-- Pay-on-Pay
create table if not exists finance.pay_on_pay (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  source text not null check (source in ('employee','vendor')),
  source_ref uuid,
  payroll_amount numeric(14,2) not null,
  markup_rate numeric(6,3) not null default 0.00,
  bill_amount numeric(14,2) not null,
  invoice_id uuid references finance.invoices(id) on delete set null,
  bill_id uuid references finance.bills(id) on delete set null,
  period_start date,
  period_end date,
  status text default 'pending' check (status in ('pending','invoiced','paid')),
  created_at timestamptz default now()
);

-- Payroll
create table if not exists finance.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status text default 'draft' check (status in ('draft','approved','paid')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists finance.payroll_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  run_id uuid not null references finance.payroll_runs(id) on delete cascade,
  person_kind text check (person_kind in ('employee','contractor')) not null,
  person_id uuid,
  gross numeric(14,2) not null default 0,
  taxes numeric(14,2) not null default 0,
  deductions numeric(14,2) not null default 0,
  net numeric(14,2) not null default 0,
  notes text
);

-- Budgeting
create table if not exists finance.budgets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  year int2 not null,
  month int2 not null check (month between 1 and 12),
  category text not null,
  account text not null,
  amount numeric(14,2) not null default 0
);

-- Forecasting
create table if not exists finance.forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  as_of date not null,
  horizon_months int2 default 6,
  cash_in jsonb default '[]'::jsonb,
  cash_out jsonb default '[]'::jsonb,
  runway_months numeric(6,2),
  ai_explanation text,
  created_at timestamptz default now()
);

-- Expenses
create table if not exists finance.expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  spender_id uuid references core.users(id) on delete set null,
  spend_date date not null,
  category text not null,
  amount numeric(14,2) not null,
  currency text default 'USD',
  merchant text,
  description text,
  receipt_url text,
  status text default 'submitted' check (status in ('submitted','approved','reimbursed','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comprehensive migration block to handle all schema changes
do $$
begin
  -- Migrate invoices: add customer_id
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'invoices' and column_name = 'customer_id'
  ) then
    alter table finance.invoices add column customer_id uuid references finance.customers(id) on delete restrict;
    if exists (
      select 1 from information_schema.columns 
      where table_schema = 'finance' and table_name = 'invoices' and column_name = 'client_id'
    ) then
      execute 'update finance.invoices set customer_id = client_id where customer_id is null';
    end if;
  end if;

  -- Migrate invoices: add number column with default to avoid NULL issues
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'invoices' and column_name = 'number'
  ) then
    alter table finance.invoices add column number text default 'MIGRATED';
    if exists (
      select 1 from information_schema.columns 
      where table_schema = 'finance' and table_name = 'invoices' and column_name = 'invoice_no'
    ) then
      execute 'update finance.invoices set number = invoice_no';
    else
      -- Use CTE to generate sequential numbers with window function
      execute '
        with numbered as (
          select id, ''INV-'' || lpad(row_number() over (partition by tenant_id order by created_at)::text, 6, ''0'') as new_number
          from finance.invoices
          where number = ''MIGRATED''
        )
        update finance.invoices
        set number = numbered.new_number
        from numbered
        where finance.invoices.id = numbered.id
      ';
    end if;
    -- Remove default after migration
    alter table finance.invoices alter column number drop default;
  end if;

  -- Migrate invoices: add balance
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'invoices' and column_name = 'balance'
  ) then
    alter table finance.invoices add column balance numeric(14,2) default 0;
    execute 'update finance.invoices set balance = total where balance = 0';
  end if;

  -- Migrate bills: add balance
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'bills' and column_name = 'balance'
  ) then
    alter table finance.bills add column balance numeric(14,2) default 0;
    execute 'update finance.bills set balance = total where balance = 0';
  end if;
  
  -- Migrate bills: add number column with default
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'bills' and column_name = 'number'
  ) then
    alter table finance.bills add column number text default 'MIGRATED';
    
    -- Generate sequential numbers using a subquery approach
    update finance.bills b
    set number = 'BILL-' || lpad(sub.rn::text, 6, '0')
    from (
      select id, row_number() over (partition by tenant_id order by created_at) as rn
      from finance.bills
      where number = 'MIGRATED'
    ) sub
    where b.id = sub.id;
    
    alter table finance.bills alter column number drop default;
  end if;

  -- Migrate payments: add paid_date column
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'payments' and column_name = 'paid_date'
  ) then
    alter table finance.payments add column paid_date date default current_date;
    -- Update existing records to use created_at date if available
    execute 'update finance.payments set paid_date = created_at::date where paid_date = current_date';
    -- Make it not null after migration
    alter table finance.payments alter column paid_date set not null;
    alter table finance.payments alter column paid_date drop default;
  end if;

  -- Add migrations for invoice_items and bill_items foreign key columns
  -- Migrate invoice_items: add invoice_id column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'invoice_items' and column_name = 'invoice_id'
  ) then
    -- Add as nullable first since we can't guarantee all rows have valid invoice references
    alter table finance.invoice_items add column invoice_id uuid references finance.invoices(id) on delete cascade;
  end if;

  -- Migrate bill_items: add bill_id column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'bill_items' and column_name = 'bill_id'
  ) then
    -- Add as nullable first since we can't guarantee all rows have valid bill references
    alter table finance.bill_items add column bill_id uuid references finance.bills(id) on delete cascade;
  end if;

  -- Migrate payments: add bill_id column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'payments' and column_name = 'bill_id'
  ) then
    alter table finance.payments add column bill_id uuid references finance.bills(id) on delete set null;
  end if;

  -- Migrate expenses: add spend_date column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'expenses' and column_name = 'spend_date'
  ) then
    alter table finance.expenses add column spend_date date default current_date;
    -- Update existing records to use created_at date if available
    execute 'update finance.expenses set spend_date = created_at::date where spend_date = current_date';
    -- Make it not null after migration
    alter table finance.expenses alter column spend_date set not null;
    alter table finance.expenses alter column spend_date drop default;
  end if;

  -- Add spender_id column to expenses table if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'finance' and table_name = 'expenses' and column_name = 'spender_id'
  ) then
    alter table finance.expenses add column spender_id uuid references core.users(id) on delete set null;
  end if;
end $$;

-- Create indexes after migrations
create unique index if not exists idx_customers_tenant_name on finance.customers(tenant_id, name);
create unique index if not exists idx_vendors_tenant_name on finance.vendors(tenant_id, name);
create unique index if not exists idx_invoices_tenant_number on finance.invoices(tenant_id, number);
create index if not exists idx_invoices_due_status on finance.invoices(tenant_id, due_date, status);
create index if not exists idx_invoices_customer on finance.invoices(customer_id);
create index if not exists idx_invoice_items_invoice on finance.invoice_items(invoice_id);
create index if not exists idx_receipts_date on finance.receipts(tenant_id, received_date);
create index if not exists idx_receipts_invoice on finance.receipts(invoice_id);
create unique index if not exists idx_bills_tenant_number on finance.bills(tenant_id, number);
create index if not exists idx_bills_due_status on finance.bills(tenant_id, due_date, status);
create index if not exists idx_bills_vendor on finance.bills(vendor_id);
create index if not exists idx_bill_items_bill on finance.bill_items(bill_id);
create index if not exists idx_payments_date on finance.payments(tenant_id, paid_date);
create index if not exists idx_payments_bill on finance.payments(bill_id);
create index if not exists idx_pay_on_pay_tenant on finance.pay_on_pay(tenant_id);
create index if not exists idx_payroll_runs_tenant on finance.payroll_runs(tenant_id);
create index if not exists idx_payroll_lines_run on finance.payroll_lines(run_id);
create unique index if not exists idx_budgets_unique on finance.budgets(tenant_id, year, month, category, account);
create index if not exists idx_budgets_period on finance.budgets(tenant_id, year, month);
create index if not exists idx_forecasts_tenant on finance.forecasts(tenant_id, as_of desc);
create index if not exists idx_expenses_date on finance.expenses(tenant_id, spend_date);
create index if not exists idx_expenses_spender on finance.expenses(spender_id);

-- Enable RLS
alter table finance.customers enable row level security;
alter table finance.vendors enable row level security;
alter table finance.invoices enable row level security;
alter table finance.invoice_items enable row level security;
alter table finance.receipts enable row level security;
alter table finance.bills enable row level security;
alter table finance.bill_items enable row level security;
alter table finance.payments enable row level security;
alter table finance.pay_on_pay enable row level security;
alter table finance.payroll_runs enable row level security;
alter table finance.payroll_lines enable row level security;
alter table finance.budgets enable row level security;
alter table finance.forecasts enable row level security;
alter table finance.expenses enable row level security;

-- RLS Policies: Customers (finance.ar)
drop policy if exists customers_select on finance.customers;
create policy customers_select on finance.customers for select using (tenant_id = sec.current_tenant_id());

drop policy if exists customers_all on finance.customers;
create policy customers_all on finance.customers for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ar'));

-- RLS Policies: Vendors (finance.ap)
drop policy if exists vendors_select on finance.vendors;
create policy vendors_select on finance.vendors for select using (tenant_id = sec.current_tenant_id());

drop policy if exists vendors_all on finance.vendors;
create policy vendors_all on finance.vendors for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ap'));

-- RLS Policies: Invoices (finance.ar)
drop policy if exists invoices_select on finance.invoices;
create policy invoices_select on finance.invoices for select using (tenant_id = sec.current_tenant_id());

drop policy if exists invoices_all on finance.invoices;
create policy invoices_all on finance.invoices for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ar'));

-- RLS Policies: Invoice Items (finance.ar)
drop policy if exists invoice_items_select on finance.invoice_items;
create policy invoice_items_select on finance.invoice_items for select using (tenant_id = sec.current_tenant_id());

drop policy if exists invoice_items_all on finance.invoice_items;
create policy invoice_items_all on finance.invoice_items for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ar'));

-- RLS Policies: Receipts (finance.ar)
drop policy if exists receipts_select on finance.receipts;
create policy receipts_select on finance.receipts for select using (tenant_id = sec.current_tenant_id());

drop policy if exists receipts_all on finance.receipts;
create policy receipts_all on finance.receipts for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ar'));

-- RLS Policies: Bills (finance.ap)
drop policy if exists bills_select on finance.bills;
create policy bills_select on finance.bills for select using (tenant_id = sec.current_tenant_id());

drop policy if exists bills_all on finance.bills;
create policy bills_all on finance.bills for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ap'));

-- RLS Policies: Bill Items (finance.ap)
drop policy if exists bill_items_select on finance.bill_items;
create policy bill_items_select on finance.bill_items for select using (tenant_id = sec.current_tenant_id());

drop policy if exists bill_items_all on finance.bill_items;
create policy bill_items_all on finance.bill_items for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ap'));

-- RLS Policies: Payments (finance.ap)
drop policy if exists payments_select on finance.payments;
create policy payments_select on finance.payments for select using (tenant_id = sec.current_tenant_id());

drop policy if exists payments_all on finance.payments;
create policy payments_all on finance.payments for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.ap'));

-- RLS Policies: Pay-on-Pay (finance.pay_on_pay)
drop policy if exists pay_on_pay_select on finance.pay_on_pay;
create policy pay_on_pay_select on finance.pay_on_pay for select using (tenant_id = sec.current_tenant_id());

drop policy if exists pay_on_pay_all on finance.pay_on_pay;
create policy pay_on_pay_all on finance.pay_on_pay for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.pay_on_pay'));

-- RLS Policies: Payroll (finance.payroll)
drop policy if exists payroll_runs_select on finance.payroll_runs;
create policy payroll_runs_select on finance.payroll_runs for select using (tenant_id = sec.current_tenant_id());

drop policy if exists payroll_runs_all on finance.payroll_runs;
create policy payroll_runs_all on finance.payroll_runs for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.payroll'));

drop policy if exists payroll_lines_select on finance.payroll_lines;
create policy payroll_lines_select on finance.payroll_lines for select using (tenant_id = sec.current_tenant_id());

drop policy if exists payroll_lines_all on finance.payroll_lines;
create policy payroll_lines_all on finance.payroll_lines for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.payroll'));

-- RLS Policies: Budgets (finance.budgeting)
drop policy if exists budgets_select on finance.budgets;
create policy budgets_select on finance.budgets for select using (tenant_id = sec.current_tenant_id());

drop policy if exists budgets_all on finance.budgets;
create policy budgets_all on finance.budgets for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.budgeting'));

-- RLS Policies: Forecasts (finance.forecasting_ai)
drop policy if exists forecasts_select on finance.forecasts;
create policy forecasts_select on finance.forecasts for select using (tenant_id = sec.current_tenant_id());

drop policy if exists forecasts_all on finance.forecasts;
create policy forecasts_all on finance.forecasts for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.forecasting_ai'));

-- RLS Policies: Expenses (finance.expenses)
drop policy if exists expenses_select on finance.expenses;
create policy expenses_select on finance.expenses for select using (tenant_id = sec.current_tenant_id());

drop policy if exists expenses_all on finance.expenses;
create policy expenses_all on finance.expenses for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('finance.expenses'));

-- Insert finance features
insert into core.features (key, name, description, module, enabled_by_default)
values
  ('finance.ar', 'Accounts Receivable', 'Manage customers, invoices, and receipts', 'finance', true),
  ('finance.ap', 'Accounts Payable', 'Manage vendors, bills, and payments', 'finance', true),
  ('finance.pay_on_pay', 'Pay-on-Pay', 'Billable markup model linking payroll to invoices', 'finance', false),
  ('finance.payroll', 'Payroll', 'Manage pay runs and payroll calculations', 'finance', false),
  ('finance.budgeting', 'Budgeting', 'Create and manage monthly budgets', 'finance', true),
  ('finance.forecasting_ai', 'AI Forecasting', 'AI-powered cash flow forecasting', 'finance', false),
  ('finance.invoice_parse_ai', 'AI Invoice Parsing', 'AI-powered invoice and bill parsing', 'finance', false),
  ('finance.collection_ai', 'AI Collections', 'AI-powered collection email drafting', 'finance', false),
  ('finance.expenses', 'Expenses', 'Employee expense submission and approval', 'finance', true),
  ('finance.reports', 'Financial Reports', 'AR/AP aging, P&L, and cashflow reports', 'finance', true)
on conflict (key) do nothing;

-- Sample data
do $$
declare
  v_tenant_id uuid;
  v_customer_id uuid;
  v_vendor_id uuid;
  v_invoice_id uuid;
  v_bill_id uuid;
begin
  -- Get first tenant
  select id into v_tenant_id from core.tenants limit 1;
  
  if v_tenant_id is not null then
    -- Create sample customer
    insert into finance.customers (tenant_id, name, code, contact, terms, currency)
    values (v_tenant_id, 'Acme Corp', 'ACME001', '{"email":"billing@acme.com","phone":"555-0100","address":"123 Main St"}'::jsonb, 'NET30', 'USD')
    on conflict (tenant_id, name) do nothing
    returning id into v_customer_id;
    
    -- Create sample vendor
    insert into finance.vendors (tenant_id, name, code, contact, currency)
    values (v_tenant_id, 'Tech Supplies Inc', 'TECH001', '{"email":"ap@techsupplies.com","phone":"555-0200","address":"456 Oak Ave"}'::jsonb, 'USD')
    on conflict (tenant_id, name) do nothing
    returning id into v_vendor_id;
    
    -- Create sample invoice
    if v_customer_id is not null then
      insert into finance.invoices (tenant_id, customer_id, number, issue_date, due_date, subtotal, tax, total, balance, status)
      values (v_tenant_id, v_customer_id, 'INV-2025-001', current_date, current_date + interval '30 days', 10000.00, 800.00, 10800.00, 10800.00, 'sent')
      on conflict (tenant_id, number) do nothing
      returning id into v_invoice_id;
      
      -- Create invoice items
      if v_invoice_id is not null then
        insert into finance.invoice_items (tenant_id, invoice_id, line_no, description, qty, unit_price, amount, tax_rate)
        values 
          (v_tenant_id, v_invoice_id, 1, 'Software Development Services', 100, 100.00, 10000.00, 8.00);
      end if;
    end if;
    
    -- Create sample bill
    if v_vendor_id is not null then
      insert into finance.bills (tenant_id, vendor_id, number, bill_date, due_date, subtotal, tax, total, balance, status)
      values (v_tenant_id, v_vendor_id, 'BILL-2025-001', current_date, current_date + interval '30 days', 5000.00, 400.00, 5400.00, 5400.00, 'approved')
      on conflict (tenant_id, number) do nothing
      returning id into v_bill_id;
      
      -- Create bill items
      if v_bill_id is not null then
        insert into finance.bill_items (tenant_id, bill_id, line_no, description, qty, unit_cost, amount, tax_rate)
        values 
          (v_tenant_id, v_bill_id, 1, 'Office Supplies', 50, 100.00, 5000.00, 8.00);
      end if;
    end if;
  end if;
end $$;
