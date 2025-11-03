-- Migration: Create user_sessions table in public schema
-- This table is referenced by server-side session helpers and must exist
-- Run this migration against your database (psql -f scripts/phase-99-user-sessions.sql)

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE NOT NULL,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_tenant ON public.user_sessions(tenant_id);

-- Enable Row Level Security (RLS) by default; policies should be added in production
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Example policy to allow the owning user to see their sessions (customize for your app)
-- DROP POLICY IF EXISTS user_sessions_owner ON public.user_sessions;
-- CREATE POLICY user_sessions_owner ON public.user_sessions
--   FOR ALL
--   USING (user_id = current_setting('app.current_user_id', true)::uuid)
--   WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

-- Recommended RLS policies
-- The policies below assume your application sets the current authenticated user id
-- in the Postgres setting `app.current_user_id` for the duration of a request, e.g.
-- via: set_config('app.current_user_id', '<USER_UUID>', true)
-- If your server uses a different mechanism (for example, a service role), adapt
-- the predicates accordingly. We also provide a lightweight bypass predicate that
-- checks `app.is_service = 'true'` which your server may set for trusted connections.

-- Allow the session owner (and service connections) to SELECT their sessions
DROP POLICY IF EXISTS user_sessions_select_owner ON public.user_sessions;
CREATE POLICY user_sessions_select_owner
  ON public.user_sessions
  FOR SELECT
  USING (
    (user_id IS NOT NULL AND user_id = current_setting('app.current_user_id', true)::uuid)
    OR current_setting('app.is_service', true) = 'true'
  );

-- Allow the session owner (and service connections) to INSERT a session row
DROP POLICY IF EXISTS user_sessions_insert_owner ON public.user_sessions;
CREATE POLICY user_sessions_insert_owner
  ON public.user_sessions
  FOR INSERT
  WITH CHECK (
    (user_id IS NOT NULL AND user_id = current_setting('app.current_user_id', true)::uuid)
    OR current_setting('app.is_service', true) = 'true'
  );

-- Allow the session owner (and service connections) to UPDATE their sessions
DROP POLICY IF EXISTS user_sessions_update_owner ON public.user_sessions;
CREATE POLICY user_sessions_update_owner
  ON public.user_sessions
  FOR UPDATE
  USING (
    (user_id IS NOT NULL AND user_id = current_setting('app.current_user_id', true)::uuid)
    OR current_setting('app.is_service', true) = 'true'
  )
  WITH CHECK (
    (user_id IS NOT NULL AND user_id = current_setting('app.current_user_id', true)::uuid)
    OR current_setting('app.is_service', true) = 'true'
  );

-- Allow the session owner (and service connections) to DELETE their sessions
DROP POLICY IF EXISTS user_sessions_delete_owner ON public.user_sessions;
CREATE POLICY user_sessions_delete_owner
  ON public.user_sessions
  FOR DELETE
  USING (
    (user_id IS NOT NULL AND user_id = current_setting('app.current_user_id', true)::uuid)
    OR current_setting('app.is_service', true) = 'true'
  );

-- NOTE: If your server uses a fixed Postgres role for privileged operations (for
-- example `service_role`), you can alternatively add a policy allowing that role
-- by checking `current_user = 'service_role'` or similar. The `app.is_service`
-- flag is a lightweight, tunable alternative used in many deployments.


COMMENT ON TABLE public.user_sessions IS 'Application session records for persistent session management';

-- Helper RPC: create_user_session
-- This SECURITY DEFINER function sets the `app.current_user_id` setting for the
-- duration of the transaction and inserts a session row. It returns the created
-- row. Call this from trusted server-side code or from a role that is allowed
-- to execute it. Adjust parameter list as needed.
DROP FUNCTION IF EXISTS public.create_user_session(uuid, uuid, text, text, inet, text, timestamptz, timestamptz);
CREATE FUNCTION public.create_user_session(
  p_user_id uuid,
  p_tenant_id uuid,
  p_session_token text,
  p_device_fingerprint text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_last_activity_at timestamptz DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL
) RETURNS public.user_sessions
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  _result public.user_sessions%ROWTYPE;
BEGIN
  -- set the app.current_user_id for RLS checks inside this function
  PERFORM set_config('app.current_user_id', p_user_id::text, true);

  INSERT INTO public.user_sessions(
    user_id, tenant_id, session_token, device_fingerprint, ip_address, user_agent, last_activity_at, expires_at
  ) VALUES (
    p_user_id, p_tenant_id, p_session_token, p_device_fingerprint, p_ip_address, p_user_agent, p_last_activity_at, p_expires_at
  )
  RETURNING * INTO _result;

  RETURN _result;
END;
$$;

-- Note: Grant EXECUTE to the app role you use for server-side actions. If you use
-- a single `service_role` DB role, grant EXECUTE to that role. Example:
-- GRANT EXECUTE ON FUNCTION public.create_user_session(uuid, uuid, text, text, inet, text, timestamptz, timestamptz) TO service_role;

-- Grant execute to common Supabase roles. Adjust as needed for your setup.
-- This allows the typical server-side Supabase client (anon or service role)
-- to call the RPC helper above.
GRANT EXECUTE ON FUNCTION public.create_user_session(uuid, uuid, text, text, inet, text, timestamptz, timestamptz) TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_session(uuid, uuid, text, text, inet, text, timestamptz, timestamptz) TO service_role;

-- Overloaded JSONB wrapper so PostgREST / Supabase RPC calls that send a single
-- json/jsonb parameter will resolve correctly. This accepts a JSON payload and
-- delegates to the typed SECURITY DEFINER function above.
DROP FUNCTION IF EXISTS public.create_user_session(jsonb);
CREATE FUNCTION public.create_user_session(payload jsonb) RETURNS public.user_sessions
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  _user_id uuid := (payload->>'p_user_id')::uuid;
  _tenant_id uuid := NULLIF(payload->>'p_tenant_id','')::uuid;
  _session_token text := payload->>'p_session_token';
  _device_fingerprint text := NULLIF(payload->>'p_device_fingerprint','');
  _ip_address inet := NULLIF(payload->>'p_ip_address','')::inet;
  _user_agent text := payload->>'p_user_agent';
  _last_activity timestamptz := NULLIF(payload->>'p_last_activity_at','')::timestamptz;
  _expires_at timestamptz := NULLIF(payload->>'p_expires_at','')::timestamptz;
BEGIN
  RETURN public.create_user_session(_user_id, _tenant_id, _session_token, _device_fingerprint, _ip_address, _user_agent, _last_activity, _expires_at);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_user_session(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_session(jsonb) TO service_role;

