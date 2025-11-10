-- Minimal CRM dependencies/patches to support 15-crm.sql idempotently
-- Used when prior generic module tables used different names

create schema if not exists crm;
create schema if not exists cportal;

-- If a generic documents table exists elsewhere, ensure crm.documents exists
create table if not exists crm.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  account_id uuid,
  opportunity_id uuid,
  title text not null,
  kind text,
  file_url text not null,
  mime text,
  status text,
  expires_at date,
  created_by uuid,
  created_at timestamptz default now()
);

-- Activities table referenced by RLS policies in 15-crm
create table if not exists crm.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  account_id uuid,
  contact_id uuid,
  opportunity_id uuid,
  type text,
  subject text,
  body text,
  when_at timestamptz default now(),
  created_by uuid,
  created_at timestamptz default now()
);

-- Quotes and quote_lines minimal to satisfy FK and RLS
create table if not exists crm.quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  opportunity_id uuid,
  currency text,
  subtotal numeric(14,2) default 0,
  tax_total numeric(14,2) default 0,
  total numeric(14,2) default 0,
  status text,
  created_at timestamptz default now()
);

create table if not exists crm.quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null,
  line_no int2 not null,
  description text not null,
  qty numeric(10,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  amount numeric(14,2) not null default 0,
  unique(quote_id, line_no)
);

-- Opportunity stages/opportunities to satisfy views and triggers
create table if not exists crm.opportunity_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  name text not null,
  position int2 not null,
  win_prob int2 default 0
);

create table if not exists crm.opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  account_id uuid,
  contact_id uuid,
  title text,
  amount numeric(14,2) default 0,
  currency text,
  stage_id uuid,
  close_date date,
  owner_id uuid,
  status text default 'open',
  probability int2 default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
