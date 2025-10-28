-- Nino360 — CRM Contacts Extended Schema
-- Adds missing fields and tables for comprehensive contact management

-- Extend crm.contacts table with missing fields
alter table crm.contacts add column if not exists health_score int2 default 50 check (health_score between 0 and 100);
alter table crm.contacts add column if not exists enrichment jsonb default '{}'::jsonb;
alter table crm.contacts add column if not exists dedupe_key text;
alter table crm.contacts add column if not exists last_engaged_at timestamptz;
alter table crm.contacts add column if not exists marketing_opt_in boolean default false;
alter table crm.contacts add column if not exists do_not_call boolean default false;
alter table crm.contacts add column if not exists do_not_email boolean default false;
alter table crm.contacts add column if not exists mobile text;
alter table crm.contacts add column if not exists linkedin_url text;
alter table crm.contacts add column if not exists twitter_url text;
alter table crm.contacts add column if not exists website text;
alter table crm.contacts add column if not exists address jsonb default '{}'::jsonb;
alter table crm.contacts add column if not exists tags text[] default '{}';
alter table crm.contacts add column if not exists notes text;

-- Add indexes for new fields
create index if not exists idx_crm_contacts_dedupe on crm.contacts(dedupe_key) where dedupe_key is not null;
create index if not exists idx_crm_contacts_health on crm.contacts(health_score);
create index if not exists idx_crm_contacts_engaged on crm.contacts(last_engaged_at);

-- Contact Lists & Segments
create table if not exists crm.contact_lists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  kind text not null default 'static' check (kind in ('static','segment')),
  definition jsonb default '{}'::jsonb,
  created_by uuid references core.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists crm.contact_list_members (
  list_id uuid references crm.contact_lists(id) on delete cascade,
  contact_id uuid references crm.contacts(id) on delete cascade,
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (list_id, contact_id)
);

-- Contact Files
create table if not exists crm.contact_files (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  contact_id uuid references crm.contacts(id) on delete cascade,
  storage_path text not null,
  name text not null,
  size_bytes int,
  mime text,
  created_by uuid references core.users(id),
  created_at timestamptz default now()
);

-- Contact Tasks (if not exists from activities)
create table if not exists crm.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  contact_id uuid references crm.contacts(id) on delete cascade,
  account_id uuid references crm.accounts(id) on delete cascade,
  opportunity_id uuid references crm.opportunities(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status text default 'open' check (status in ('open','done','cancelled')),
  priority text default 'medium' check (priority in ('low','medium','high','urgent')),
  owner_id uuid references core.users(id),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on new tables
alter table crm.contact_lists enable row level security;
alter table crm.contact_list_members enable row level security;
alter table crm.contact_files enable row level security;
alter table crm.tasks enable row level security;

-- RLS Policies
create policy contact_lists_rls on crm.contact_lists for all 
  using (tenant_id = sec.current_tenant_id()) 
  with check (tenant_id = sec.current_tenant_id());

create policy contact_list_members_rls on crm.contact_list_members for all 
  using (tenant_id = sec.current_tenant_id()) 
  with check (tenant_id = sec.current_tenant_id());

create policy contact_files_rls on crm.contact_files for all 
  using (tenant_id = sec.current_tenant_id()) 
  with check (tenant_id = sec.current_tenant_id());

create policy tasks_rls on crm.tasks for all 
  using (tenant_id = sec.current_tenant_id()) 
  with check (tenant_id = sec.current_tenant_id());

-- Indexes
create index if not exists idx_contact_lists_tenant on crm.contact_lists(tenant_id);
create index if not exists idx_contact_list_members_contact on crm.contact_list_members(contact_id);
create index if not exists idx_contact_files_contact on crm.contact_files(contact_id);
create index if not exists idx_tasks_contact on crm.tasks(contact_id);
create index if not exists idx_tasks_owner on crm.tasks(owner_id);
create index if not exists idx_tasks_due on crm.tasks(due_date) where status = 'open';

-- Helper functions
create or replace function crm.normalize_email(email text) returns text language sql immutable as $$
  select lower(trim(email));
$$;

create or replace function crm.normalize_phone(phone text) returns text language sql immutable as $$
  select regexp_replace(phone, '[^0-9+]', '', 'g');
$$;

create or replace function crm.make_dedupe_key(email text, first_name text, last_name text, company text) returns text language sql immutable as $$
  select case
    when email is not null and email != '' then crm.normalize_email(email)
    when first_name is not null and last_name is not null and company is not null 
      then lower(trim(first_name) || '|' || trim(last_name) || '|' || trim(company))
    else null
  end;
$$;

-- Trigger to auto-generate dedupe_key
create or replace function crm.trg_contact_dedupe_key()
returns trigger language plpgsql as $$
begin
  new.dedupe_key := crm.make_dedupe_key(new.email, new.first_name, new.last_name, 
    (select name from crm.accounts where id = new.account_id));
  return new;
end;
$$;

create trigger trg_contact_dedupe_key
before insert or update on crm.contacts
for each row execute function crm.trg_contact_dedupe_key();

-- Trigger to update last_engaged_at when activity is added
create or replace function crm.trg_update_contact_engagement()
returns trigger language plpgsql as $$
begin
  if new.entity_type = 'contact' and new.contact_id is not null then
    update crm.contacts 
    set last_engaged_at = new.when_at 
    where id = new.contact_id 
      and (last_engaged_at is null or last_engaged_at < new.when_at);
  end if;
  return new;
end;
$$;

create trigger trg_update_contact_engagement
after insert on crm.activities
for each row execute function crm.trg_update_contact_engagement();

-- Update existing contacts to generate dedupe_key
update crm.contacts set updated_at = now() where dedupe_key is null;
