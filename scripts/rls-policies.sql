-- Enable Row-Level Security on tenants and related tables
alter table tenants enable row level security;
alter table tenant_users enable row level security;
alter table tenant_analytics enable row level security;
alter table billing enable row level security;
alter table audit_logs enable row level security;
alter table tenant_integrations enable row level security;

-- Create function to get tenant owner
create or replace function tenant_owner()
returns uuid as $$
begin
  return auth.uid();
end;
$$ language plpgsql security definer;

-- Allow access to data for users belonging to the same tenant
create policy "Allow access to own tenant data" on tenants for all
  using (auth.uid() = tenant_owner());

create policy "Allow access to own tenant's users" on tenant_users for all
  using (auth.uid() = tenant_owner());

create policy "Allow access to own tenant analytics" on tenant_analytics for all
  using (auth.uid() = tenant_owner());

create policy "Allow access to own tenant billing" on billing for all
  using (auth.uid() = tenant_owner());

create policy "Allow access to own tenant integrations" on tenant_integrations for all
  using (auth.uid() = tenant_owner());

create policy "Allow access to own tenant audit logs" on audit_logs for all
  using (auth.uid() = tenant_owner());
