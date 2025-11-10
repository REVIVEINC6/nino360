-- Development-friendly user_sessions table to satisfy session service and FK references
-- Safe to run multiple times
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  tenant_id uuid,
  session_token text unique not null,
  device_fingerprint text,
  ip_address text,
  user_agent text,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  revoked boolean default false,
  revoked_at timestamptz,
  expires_at timestamptz
);

-- Optional index helpers
create index if not exists idx_user_sessions_user on public.user_sessions(user_id);
create index if not exists idx_user_sessions_token on public.user_sessions(session_token);

-- Grant basic access to authenticated role so supabase-js can read/write
grant select, insert, update on public.user_sessions to authenticated;
