-- ============================================================================
-- NINO360 Step 2: Admin Module
-- Invitations, Admin KPIs, Audit Functions
-- ============================================================================
-- IMPORTANT: Run scripts/01-create-tables.sql first to create schemas!
-- ============================================================================

-- Verify schemas exist (will error if not, which is intentional)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'core') THEN
    RAISE EXCEPTION 'Schema "core" does not exist. Please run scripts/01-create-tables.sql first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'sec') THEN
    RAISE EXCEPTION 'Schema "sec" does not exist. Please run scripts/01-create-tables.sql first.';
  END IF;
END $$;

-- Add status column to users table for user lifecycle management
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' 
  CHECK (status IN ('active','inactive','suspended','pending'));

CREATE INDEX IF NOT EXISTS idx_users_status ON core.users(status);

-- Invitations table for user invite flow
CREATE TABLE IF NOT EXISTS core.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE RESTRICT,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
  invited_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE core.invitations ENABLE ROW LEVEL SECURITY;

-- RLS: Invitations readable by tenant members
CREATE POLICY inv_select ON core.invitations FOR SELECT USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.invitations.tenant_id 
      AND ut.user_id = sec.current_user_id()
  )
);

-- RLS: Invitations writable by tenant admins only
CREATE POLICY inv_write ON core.invitations FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = core.invitations.tenant_id 
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- Add permissions table for granular permission management
CREATE TABLE IF NOT EXISTS core.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('read','create','update','delete')),
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, module, action)
);

ALTER TABLE core.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS: Permissions readable by authenticated users
CREATE POLICY role_permissions_select ON core.role_permissions FOR SELECT 
  USING (authenticated.role() = 'authenticated');

-- RLS: Permissions writable by admins only
CREATE POLICY role_permissions_write ON core.role_permissions FOR ALL 
  USING (sec.is_admin());

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON core.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_module ON core.role_permissions(module, action);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_tenant ON core.invitations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON core.invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON core.user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON core.user_roles(user_id);

-- Admin KPIs view for dashboard
CREATE OR REPLACE VIEW core.admin_kpis AS
SELECT
  t.id AS tenant_id,
  t.name AS tenant_name,
  (SELECT COUNT(*) FROM core.user_tenants ut WHERE ut.tenant_id = t.id) AS users_count,
  (SELECT COUNT(*) FROM core.user_roles ur WHERE ur.tenant_id = t.id) AS role_bindings,
  (SELECT COUNT(*) FROM sec.audit_logs al 
   WHERE al.tenant_id = t.id 
     AND al.created_at > NOW() - INTERVAL '24 hours') AS events_24h
FROM core.tenants t;

REVOKE ALL ON TABLE core.admin_kpis FROM anon, authenticated;
GRANT SELECT ON TABLE core.admin_kpis TO authenticated;

-- Audit helper function
CREATE OR REPLACE FUNCTION sec.audit(_action TEXT, _resource TEXT, _payload JSONB)
RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT sec.log_action(
    sec.current_tenant_id(), 
    sec.current_user_id(), 
    _action, 
    _resource, 
    _payload
  );
$$;

-- View for user listing with roles and status
CREATE OR REPLACE VIEW core.users_with_roles AS
SELECT 
  u.id, 
  u.email, 
  u.full_name, 
  u.avatar_url,
  u.status,
  u.created_at,
  COALESCE(
    (SELECT STRING_AGG(r.key, ',') 
     FROM core.user_roles ur 
     JOIN core.roles r ON r.id = ur.role_id 
     WHERE ur.user_id = u.id), 
    ''
  ) AS roles,
  COALESCE(
    (SELECT STRING_AGG(t.name, ',') 
     FROM core.user_tenants ut 
     JOIN core.tenants t ON t.id = ut.tenant_id 
     WHERE ut.user_id = u.id), 
    ''
  ) AS tenants
FROM core.users u;

GRANT SELECT ON TABLE core.users_with_roles TO authenticated;

-- Update bulk user status function to actually update status column
CREATE OR REPLACE FUNCTION public.admin_bulk_user_status(_user_ids UUID[], _status TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Verify caller is admin
  IF NOT sec.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Update user status
  UPDATE core.users 
  SET status = _status, updated_at = NOW()
  WHERE id = ANY(_user_ids);

  -- Log the action
  PERFORM sec.audit(
    'bulk_status',
    'users', 
    jsonb_build_object('ids', _user_ids, 'status', _status)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_bulk_user_status(UUID[], TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_bulk_user_status(UUID[], TEXT) TO authenticated;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(_token TEXT, _user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _inv RECORD;
BEGIN
  -- Get invitation
  SELECT * INTO _inv FROM core.invitations 
  WHERE token = _token AND status = 'pending' AND expires_at > NOW();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invalid or expired invitation');
  END IF;
  
  -- Add user to tenant
  INSERT INTO core.user_tenants(user_id, tenant_id, is_primary)
  VALUES (_user_id, _inv.tenant_id, FALSE)
  ON CONFLICT (user_id, tenant_id) DO NOTHING;
  
  -- Assign role
  INSERT INTO core.user_roles(user_id, tenant_id, role_id)
  VALUES (_user_id, _inv.tenant_id, _inv.role_id)
  ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;
  
  -- Mark invitation as accepted
  UPDATE core.invitations SET status = 'accepted' WHERE id = _inv.id;
  
  -- Log action
  PERFORM sec.audit('accept', 'invitation', jsonb_build_object(
    'invitation_id', _inv.id,
    'user_id', _user_id,
    'tenant_id', _inv.tenant_id,
    'role_id', _inv.role_id
  ));
  
  RETURN jsonb_build_object('success', TRUE, 'tenant_id', _inv.tenant_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(TEXT, UUID) TO authenticated;

-- Adding user groups for organizing users
CREATE TABLE IF NOT EXISTS core.user_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS core.user_group_members (
  group_id UUID NOT NULL REFERENCES core.user_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

ALTER TABLE core.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_groups_select ON core.user_groups FOR SELECT 
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY user_groups_write ON core.user_groups FOR ALL 
  USING (tenant_id = sec.current_tenant_id() AND sec.is_admin());

CREATE INDEX IF NOT EXISTS idx_user_groups_tenant ON core.user_groups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_group_members_user ON core.user_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_user_group_members_group ON core.user_group_members(group_id);

-- Adding custom fields for extensible user metadata
CREATE TABLE IF NOT EXISTS core.custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user','client','candidate','project')),
  field_key TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text','number','date','boolean','select')),
  field_options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, entity_type, field_key)
);

CREATE TABLE IF NOT EXISTS core.custom_field_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID NOT NULL REFERENCES core.custom_fields(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(field_id, entity_id)
);

ALTER TABLE core.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.custom_field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY custom_fields_select ON core.custom_fields FOR SELECT 
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY custom_fields_write ON core.custom_fields FOR ALL 
  USING (tenant_id = sec.current_tenant_id() AND sec.is_admin());

CREATE INDEX IF NOT EXISTS idx_custom_fields_tenant ON core.custom_fields(tenant_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_field ON core.custom_field_values(field_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity ON core.custom_field_values(entity_id);

-- Adding saved filters for frequently used filter combinations
CREATE TABLE IF NOT EXISTS core.saved_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filter_type TEXT NOT NULL,
  filter_config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE core.saved_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY saved_filters_own ON core.saved_filters FOR ALL 
  USING (user_id = sec.current_user_id());

CREATE INDEX IF NOT EXISTS idx_saved_filters_user ON core.saved_filters(user_id, filter_type);

-- Adding user analytics table for tracking growth and activity
CREATE TABLE IF NOT EXISTS core.user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_users INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  new_users INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, date)
);

ALTER TABLE core.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_analytics_select ON core.user_analytics FOR SELECT 
  USING (tenant_id = sec.current_tenant_id());

CREATE INDEX IF NOT EXISTS idx_user_analytics_tenant_date ON core.user_analytics(tenant_id, date DESC);

-- Function for bulk role assignment
CREATE OR REPLACE FUNCTION public.bulk_assign_role(_user_ids UUID[], _tenant_id UUID, _role_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _count INTEGER := 0;
BEGIN
  -- Verify caller is admin
  IF NOT sec.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  -- Insert role assignments
  INSERT INTO core.user_roles(user_id, tenant_id, role_id)
  SELECT unnest(_user_ids), _tenant_id, _role_id
  ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

  GET DIAGNOSTICS _count = ROW_COUNT;

  -- Log the action
  PERFORM sec.audit(
    'bulk_assign_role',
    'user_roles', 
    jsonb_build_object('user_ids', _user_ids, 'tenant_id', _tenant_id, 'role_id', _role_id, 'count', _count)
  );

  RETURN _count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bulk_assign_role(UUID[], UUID, UUID) TO authenticated;

-- Function to update user analytics daily
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO core.user_analytics (tenant_id, date, total_users, active_users, new_users)
  SELECT 
    t.id AS tenant_id,
    CURRENT_DATE AS date,
    (SELECT COUNT(*) FROM core.user_tenants ut WHERE ut.tenant_id = t.id) AS total_users,
    (SELECT COUNT(*) FROM core.users u 
     JOIN core.user_tenants ut ON ut.user_id = u.id 
     WHERE ut.tenant_id = t.id AND u.status = 'active') AS active_users,
    (SELECT COUNT(*) FROM core.users u 
     JOIN core.user_tenants ut ON ut.user_id = u.id 
     WHERE ut.tenant_id = t.id AND u.created_at::DATE = CURRENT_DATE) AS new_users
  FROM core.tenants t
  ON CONFLICT (tenant_id, date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_users = EXCLUDED.active_users,
    new_users = EXCLUDED.new_users;
END;
$$;

-- Note: Schedule this function to run daily via pg_cron or external scheduler
