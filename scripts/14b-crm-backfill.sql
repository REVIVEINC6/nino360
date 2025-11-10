-- Backfill/patch for CRM and Client Portal tables to satisfy 15-crm.sql
-- Ensures expected columns and unique indexes exist when tables were partially created earlier

create schema if not exists cportal;
create schema if not exists crm;

-- Ensure cportal.shares has required columns
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='cportal' and table_name='shares') then
    alter table cportal.shares add column if not exists portal_account_id uuid;
    alter table cportal.shares add column if not exists tenant_id uuid;
    alter table cportal.shares add column if not exists opportunity_id uuid;
    alter table cportal.shares add column if not exists document_id uuid;
    alter table cportal.shares add column if not exists ticket_id uuid;
    alter table cportal.shares add column if not exists can_comment boolean default true;
    alter table cportal.shares add column if not exists created_at timestamptz default now();
  end if;
end $$;

-- Ensure cportal.accounts shape if table already exists
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='cportal' and table_name='accounts') then
    alter table cportal.accounts add column if not exists tenant_id uuid;
    alter table cportal.accounts add column if not exists crm_account_id uuid;
    alter table cportal.accounts add column if not exists name text;
    alter table cportal.accounts add column if not exists status text;
    alter table cportal.accounts add column if not exists branding jsonb default '{}'::jsonb;
    alter table cportal.accounts add column if not exists created_at timestamptz default now();
  end if;
end $$;

-- Ensure cportal.users shape if table already exists
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='cportal' and table_name='users') then
    alter table cportal.users add column if not exists user_id uuid;
    alter table cportal.users add column if not exists portal_account_id uuid;
    alter table cportal.users add column if not exists role text;
    alter table cportal.users add column if not exists is_active boolean default true;
    alter table cportal.users add column if not exists created_at timestamptz default now();
  end if;
end $$;

-- Ensure crm.opportunity_stages unique index expected by ON CONFLICT (tenant_id, position)
create unique index if not exists ux_crm_stages_tenant_position on crm.opportunity_stages(tenant_id, position);
