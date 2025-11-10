-- Public compatibility views for app code expecting unqualified tables
-- Map to core.* structures provisioned by phase scripts

create schema if not exists public;

-- Public users view mapping to core.users (all columns)
create or replace view public.users as
  select * from core.users;

-- Public profiles view exposing id and tenant_id from core.users
create or replace view public.profiles as
  select id, tenant_id from core.users;

grant select on public.users to anon, authenticated;
grant select on public.profiles to anon, authenticated;

-- user_tenants compatibility view (maps to public.tenant_members)
create or replace view public.user_tenants as
  select tm.tenant_id,
         tm.user_id,
         coalesce(tm.created_at, now()) as created_at,
         false as is_primary
  from public.tenant_members tm;

grant select on public.user_tenants to anon, authenticated;

-- --------------------------------------------------------------------------
-- user_roles and roles compatibility views mapping to core.*
-- --------------------------------------------------------------------------

create or replace view public.user_roles as
  select * from core.user_roles;

create or replace view public.roles as
  select * from core.roles;

grant select on public.user_roles to anon, authenticated;
grant select on public.roles to anon, authenticated;
