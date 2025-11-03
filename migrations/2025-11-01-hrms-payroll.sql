-- SQL migration for HRMS payroll feature

-- Create payroll schema
create schema if not exists hrms;

-- payroll_runs
create table if not exists hrms.payroll_runs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  run_key text not null,
  period_start date,
  period_end date,
  kind text not null,
  status text default 'preview',
  created_by uuid,
  approved_by uuid,
  executed_at timestamptz,
  summary jsonb default '{}',
  provider text,
  provider_payload_location text,
  provider_response jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists hrms.payroll_lines (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  run_id uuid not null,
  employee_id uuid not null,
  gross numeric(14,2) not null,
  taxes jsonb default '{}'::jsonb,
  deductions jsonb default '{}'::jsonb,
  benefits jsonb default '{}'::jsonb,
  net numeric(14,2) not null,
  currency text not null,
  status text default 'ready',
  provider_payment_id text,
  payslip_path text,
  created_at timestamptz default now()
);

create table if not exists hrms.tax_liabilities (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  period_start date,
  period_end date,
  jurisdiction text,
  employer_amount numeric(14,2),
  employee_amount numeric(14,2),
  paid boolean default false,
  paid_at timestamptz,
  provider_ref text,
  created_at timestamptz default now()
);

create table if not exists hrms.payroll_reconciliations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  run_id uuid,
  provider_ref text,
  statement_location text,
  matched jsonb default '[]'::jsonb,
  unmatched jsonb default '[]'::jsonb,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists hrms.payslip_access (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  employee_id uuid not null,
  run_id uuid not null,
  payslip_path text not null,
  token text not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);
