-- ============================================================================
-- Public Schema RPC Wrappers
-- PostgREST looks for RPC functions in the public schema by default
-- These wrappers call the actual functions in the sec schema
-- ============================================================================

-- Wrapper for has_feature
CREATE OR REPLACE FUNCTION public.has_feature(_feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.has_feature(_feature_key);
$$;

-- Wrapper for feature_limits
CREATE OR REPLACE FUNCTION public.feature_limits(_feature_key TEXT)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.feature_limits(_feature_key);
$$;

-- Wrapper for has_permission (if it exists in sec schema)
CREATE OR REPLACE FUNCTION public.has_permission(_perm_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.has_perm(_perm_key);
$$;

-- Wrapper for has_role
CREATE OR REPLACE FUNCTION public.has_role(_role_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.has_role(_role_key);
$$;

-- Wrapper for current_user_id
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.current_user_id();
$$;

-- Wrapper for current_tenant_id
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.current_tenant_id();
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.has_feature(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.feature_limits(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_tenant_id() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.has_feature IS 'Public wrapper for sec.has_feature - checks if user has access to a feature';
COMMENT ON FUNCTION public.feature_limits IS 'Public wrapper for sec.feature_limits - gets feature limits for current user';
COMMENT ON FUNCTION public.has_permission IS 'Public wrapper for sec.has_perm - checks if user has a specific permission';
COMMENT ON FUNCTION public.has_role IS 'Public wrapper for sec.has_role - checks if user has a specific role';
COMMENT ON FUNCTION public.current_user_id IS 'Public wrapper for sec.current_user_id - gets current user ID from JWT';
COMMENT ON FUNCTION public.current_tenant_id IS 'Public wrapper for sec.current_tenant_id - gets current tenant ID from JWT';
