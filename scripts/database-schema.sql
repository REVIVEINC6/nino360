-- Tenant Table
create table if not exists tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_email text,
  contact_phone text,
  industry text,
  region text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Table (for Tenant User Management)
create table if not exists tenant_users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) on delete cascade,
  user_name text not null,
  email text,
  role text, -- Example: Admin, User, Manager
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tenant Analytics Table
create table if not exists tenant_analytics (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  total_users integer default 0,
  active_users integer default 0,
  revenue numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Billing & Subscription Table
create table if not exists billing (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  subscription_plan text,
  billing_cycle text, -- Example: Monthly, Yearly
  amount_due numeric,
  amount_paid numeric,
  next_payment_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audit Logs
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  action_type text,
  action_details jsonb,
  created_at timestamptz default now()
);

-- Tenant Integrations Table (e.g., API Integrations, External Apps)
create table if not exists tenant_integrations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  integration_name text,
  integration_key text,
  integration_status text, -- Example: Active, Inactive
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
