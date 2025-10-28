-- ============================================================================
-- NINO360 Step 9: Enhanced RBAC & FBAC
-- Comprehensive Role-Based and Field-Based Access Control
-- ============================================================================

-- Verify schemas exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'core') THEN
    RAISE EXCEPTION 'Schema "core" does not exist. Please run scripts/01-create-tables.sql first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'sec') THEN
    RAISE EXCEPTION 'Schema "sec" does not exist. Please run scripts/01-create-tables.sql first.';
  END IF;
END $$;

-- ============================================================================
-- ENHANCED PERMISSIONS
-- ============================================================================

-- Add comprehensive permissions for all modules
INSERT INTO core.permissions(key, description) VALUES
  -- Admin Module
  ('admin.dashboard.view', 'View admin dashboard'),
  ('admin.users.read', 'View users'),
  ('admin.users.create', 'Create users'),
  ('admin.users.update', 'Update users'),
  ('admin.users.delete', 'Delete users'),
  ('admin.users.invite', 'Invite users'),
  ('admin.tenants.read', 'View tenants'),
  ('admin.tenants.create', 'Create tenants'),
  ('admin.tenants.update', 'Update tenants'),
  ('admin.tenants.delete', 'Delete tenants'),
  ('admin.roles.read', 'View roles'),
  ('admin.roles.create', 'Create roles'),
  ('admin.roles.update', 'Update roles'),
  ('admin.roles.delete', 'Delete roles'),
  ('admin.permissions.read', 'View permissions'),
  ('admin.permissions.assign', 'Assign permissions to roles'),
  ('admin.audit.read', 'View audit logs'),
  
  -- Tenant Module
  ('tenant.dashboard.view', 'View tenant dashboard'),
  ('tenant.settings.read', 'View tenant settings'),
  ('tenant.settings.update', 'Update tenant settings'),
  ('tenant.branding.read', 'View tenant branding'),
  ('tenant.branding.update', 'Update tenant branding'),
  ('tenant.billing.read', 'View billing information'),
  ('tenant.billing.update', 'Update billing information'),
  ('tenant.directory.read', 'View directory'),
  ('tenant.directory.update', 'Update directory'),
  
  -- CRM Module
  ('crm.dashboard.view', 'View CRM dashboard'),
  ('crm.clients.read', 'View clients'),
  ('crm.clients.create', 'Create clients'),
  ('crm.clients.update', 'Update clients'),
  ('crm.clients.delete', 'Delete clients'),
  ('crm.clients.export', 'Export clients'),
  ('crm.contacts.read', 'View contacts'),
  ('crm.contacts.create', 'Create contacts'),
  ('crm.contacts.update', 'Update contacts'),
  ('crm.contacts.delete', 'Delete contacts'),
  
  -- Talent/ATS Module
  ('talent.dashboard.view', 'View talent dashboard'),
  ('talent.candidates.read', 'View candidates'),
  ('talent.candidates.create', 'Create candidates'),
  ('talent.candidates.update', 'Update candidates'),
  ('talent.candidates.delete', 'Delete candidates'),
  ('talent.candidates.export', 'Export candidates'),
  ('talent.jobs.read', 'View jobs'),
  ('talent.jobs.create', 'Create jobs'),
  ('talent.jobs.update', 'Update jobs'),
  ('talent.jobs.delete', 'Delete jobs'),
  ('talent.pipelines.read', 'View pipelines'),
  ('talent.pipelines.update', 'Update pipelines'),
  ('talent.interviews.read', 'View interviews'),
  ('talent.interviews.create', 'Schedule interviews'),
  ('talent.interviews.update', 'Update interviews'),
  ('talent.interviews.delete', 'Cancel interviews'),
  
  -- Bench Module
  ('bench.dashboard.view', 'View bench dashboard'),
  ('bench.consultants.read', 'View bench consultants'),
  ('bench.consultants.create', 'Add consultants to bench'),
  ('bench.consultants.update', 'Update bench consultants'),
  ('bench.consultants.delete', 'Remove consultants from bench'),
  ('bench.marketing.read', 'View marketing activities'),
  ('bench.marketing.create', 'Create marketing activities'),
  ('bench.marketing.update', 'Update marketing activities'),
  ('bench.submissions.read', 'View submissions'),
  ('bench.submissions.create', 'Create submissions'),
  ('bench.submissions.update', 'Update submissions'),
  ('bench.placements.read', 'View placements'),
  ('bench.placements.create', 'Create placements'),
  ('bench.placements.update', 'Update placements'),
  
  -- VMS Module
  ('vms.dashboard.view', 'View VMS dashboard'),
  ('vms.vendors.read', 'View vendors'),
  ('vms.vendors.create', 'Create vendors'),
  ('vms.vendors.update', 'Update vendors'),
  ('vms.vendors.delete', 'Delete vendors'),
  ('vms.compliance.read', 'View compliance'),
  ('vms.compliance.update', 'Update compliance'),
  ('vms.invoices.read', 'View vendor invoices'),
  ('vms.invoices.create', 'Create vendor invoices'),
  ('vms.invoices.update', 'Update vendor invoices'),
  ('vms.ratecards.read', 'View rate cards'),
  ('vms.ratecards.update', 'Update rate cards'),
  
  -- Finance Module
  ('finance.dashboard.view', 'View finance dashboard'),
  ('finance.invoices.read', 'View invoices'),
  ('finance.invoices.create', 'Create invoices'),
  ('finance.invoices.update', 'Update invoices'),
  ('finance.invoices.delete', 'Delete invoices'),
  ('finance.invoices.approve', 'Approve invoices'),
  ('finance.expenses.read', 'View expenses'),
  ('finance.expenses.create', 'Create expenses'),
  ('finance.expenses.update', 'Update expenses'),
  ('finance.expenses.delete', 'Delete expenses'),
  ('finance.expenses.approve', 'Approve expenses'),
  ('finance.reports.read', 'View financial reports'),
  
  -- Projects Module
  ('projects.dashboard.view', 'View projects dashboard'),
  ('projects.read', 'View projects'),
  ('projects.create', 'Create projects'),
  ('projects.update', 'Update projects'),
  ('projects.delete', 'Delete projects'),
  ('projects.assignments.read', 'View project assignments'),
  ('projects.assignments.create', 'Create project assignments'),
  ('projects.assignments.update', 'Update project assignments'),
  ('projects.assignments.delete', 'Delete project assignments'),
  
  -- Reports Module
  ('reports.view', 'View reports'),
  ('reports.export', 'Export reports'),
  ('reports.analytics.view', 'View analytics'),
  
  -- Settings Module
  ('settings.profile.read', 'View profile'),
  ('settings.profile.update', 'Update profile'),
  ('settings.security.read', 'View security settings'),
  ('settings.security.update', 'Update security settings'),
  ('settings.notifications.read', 'View notification settings'),
  ('settings.notifications.update', 'Update notification settings')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ROLE PERMISSION ASSIGNMENTS
-- ============================================================================

-- Master Admin: Full access to everything
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'master_admin'),
  id
FROM core.permissions
ON CONFLICT DO NOTHING;

-- Super Admin: Full access except master admin functions
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'super_admin'),
  id
FROM core.permissions
WHERE key NOT LIKE 'admin.tenants.%'
ON CONFLICT DO NOTHING;

-- Admin: Full access to tenant-level operations
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'admin'),
  id
FROM core.permissions
WHERE key LIKE 'tenant.%'
   OR key LIKE 'crm.%'
   OR key LIKE 'talent.%'
   OR key LIKE 'bench.%'
   OR key LIKE 'vms.%'
   OR key LIKE 'finance.%'
   OR key LIKE 'projects.%'
   OR key LIKE 'reports.%'
   OR key LIKE 'settings.%'
ON CONFLICT DO NOTHING;

-- Manager: Read/write access to operational modules
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'manager'),
  id
FROM core.permissions
WHERE key IN (
  'crm.dashboard.view', 'crm.clients.read', 'crm.clients.update', 'crm.contacts.read', 'crm.contacts.update',
  'talent.dashboard.view', 'talent.candidates.read', 'talent.candidates.update', 'talent.jobs.read', 'talent.jobs.update',
  'talent.pipelines.read', 'talent.pipelines.update', 'talent.interviews.read', 'talent.interviews.create', 'talent.interviews.update',
  'bench.dashboard.view', 'bench.consultants.read', 'bench.consultants.update', 'bench.marketing.read', 'bench.marketing.update',
  'bench.submissions.read', 'bench.submissions.update', 'bench.placements.read', 'bench.placements.update',
  'projects.dashboard.view', 'projects.read', 'projects.update', 'projects.assignments.read', 'projects.assignments.update',
  'reports.view', 'settings.profile.read', 'settings.profile.update'
)
ON CONFLICT DO NOTHING;

-- Recruiter: Access to talent/ATS module
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'recruiter'),
  id
FROM core.permissions
WHERE key LIKE 'talent.%'
   OR key IN ('crm.dashboard.view', 'crm.clients.read', 'crm.contacts.read', 'settings.profile.read', 'settings.profile.update')
ON CONFLICT DO NOTHING;

-- Finance: Access to finance module
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'finance'),
  id
FROM core.permissions
WHERE key LIKE 'finance.%'
   OR key IN ('projects.read', 'vms.invoices.read', 'reports.view', 'settings.profile.read', 'settings.profile.update')
ON CONFLICT DO NOTHING;

-- Viewer: Read-only access
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  (SELECT id FROM core.roles WHERE key = 'viewer'),
  id
FROM core.permissions
WHERE key LIKE '%.read'
   OR key LIKE '%.view'
   OR key IN ('settings.profile.read', 'settings.profile.update')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIELD-BASED ACCESS CONTROL (FBAC)
-- ============================================================================

-- Table to define field-level permissions
CREATE TABLE IF NOT EXISTS sec.field_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  can_read BOOLEAN DEFAULT TRUE,
  can_write BOOLEAN DEFAULT FALSE,
  mask_type TEXT, -- 'full', 'partial', 'hash', null
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, table_name, field_name)
);

ALTER TABLE sec.field_permissions ENABLE ROW LEVEL SECURITY;

-- RLS: Field permissions readable by authenticated users
CREATE POLICY field_perms_select ON sec.field_permissions FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Seed field permissions for sensitive data
INSERT INTO sec.field_permissions(role_id, table_name, field_name, can_read, can_write, mask_type) VALUES
  -- Viewer role: Cannot see sensitive financial data
  ((SELECT id FROM core.roles WHERE key = 'viewer'), 'invoices', 'total_amount', FALSE, FALSE, 'full'),
  ((SELECT id FROM core.roles WHERE key = 'viewer'), 'expenses', 'amount', FALSE, FALSE, 'full'),
  ((SELECT id FROM core.roles WHERE key = 'viewer'), 'bench_consultants', 'hourly_rate', FALSE, FALSE, 'full'),
  ((SELECT id FROM core.roles WHERE key = 'viewer'), 'project_assignments', 'hourly_rate', FALSE, FALSE, 'full'),
  
  -- Recruiter role: Can see rates but not modify
  ((SELECT id FROM core.roles WHERE key = 'recruiter'), 'bench_consultants', 'hourly_rate', TRUE, FALSE, NULL),
  ((SELECT id FROM core.roles WHERE key = 'recruiter'), 'project_assignments', 'hourly_rate', TRUE, FALSE, NULL),
  ((SELECT id FROM core.roles WHERE key = 'recruiter'), 'invoices', 'total_amount', FALSE, FALSE, 'partial'),
  
  -- Manager role: Full access to operational data, partial financial
  ((SELECT id FROM core.roles WHERE key = 'manager'), 'invoices', 'total_amount', TRUE, FALSE, NULL),
  ((SELECT id FROM core.roles WHERE key = 'manager'), 'expenses', 'amount', TRUE, FALSE, NULL)
ON CONFLICT (role_id, table_name, field_name) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION sec.has_permission(_user_id UUID, _tenant_id UUID, _permission_key TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM core.user_roles ur
    JOIN core.role_permissions rp ON rp.role_id = ur.role_id
    JOIN core.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND ur.tenant_id = _tenant_id
      AND p.key = _permission_key
  );
$$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION sec.get_user_permissions(_user_id UUID, _tenant_id UUID)
RETURNS TABLE(permission_key TEXT) LANGUAGE SQL STABLE AS $$
  SELECT DISTINCT p.key
  FROM core.user_roles ur
  JOIN core.role_permissions rp ON rp.role_id = ur.role_id
  JOIN core.permissions p ON p.id = rp.permission_id
  WHERE ur.user_id = _user_id
    AND ur.tenant_id = _tenant_id
  ORDER BY p.key;
$$;

-- Function to get user roles
CREATE OR REPLACE FUNCTION sec.get_user_roles(_user_id UUID, _tenant_id UUID)
RETURNS TABLE(role_key TEXT, role_label TEXT) LANGUAGE SQL STABLE AS $$
  SELECT r.key, r.label
  FROM core.user_roles ur
  JOIN core.roles r ON r.id = ur.role_id
  WHERE ur.user_id = _user_id
    AND ur.tenant_id = _tenant_id
  ORDER BY r.key;
$$;

-- Function to check field access
CREATE OR REPLACE FUNCTION sec.can_access_field(
  _user_id UUID, 
  _tenant_id UUID, 
  _table_name TEXT, 
  _field_name TEXT,
  _access_type TEXT -- 'read' or 'write'
)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(
    (
      SELECT 
        CASE 
          WHEN _access_type = 'read' THEN fp.can_read
          WHEN _access_type = 'write' THEN fp.can_write
          ELSE FALSE
        END
      FROM sec.field_permissions fp
      JOIN core.user_roles ur ON ur.role_id = fp.role_id
      WHERE ur.user_id = _user_id
        AND ur.tenant_id = _tenant_id
        AND fp.table_name = _table_name
        AND fp.field_name = _field_name
      LIMIT 1
    ),
    TRUE -- Default to allowing access if no explicit restriction
  );
$$;

-- Function to get field mask type
CREATE OR REPLACE FUNCTION sec.get_field_mask_type(
  _user_id UUID, 
  _tenant_id UUID, 
  _table_name TEXT, 
  _field_name TEXT
)
RETURNS TEXT LANGUAGE SQL STABLE AS $$
  SELECT fp.mask_type
  FROM sec.field_permissions fp
  JOIN core.user_roles ur ON ur.role_id = fp.role_id
  WHERE ur.user_id = _user_id
    AND ur.tenant_id = _tenant_id
    AND fp.table_name = _table_name
    AND fp.field_name = _field_name
  LIMIT 1;
$$;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_field_permissions_role ON sec.field_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_field_permissions_table ON sec.field_permissions(table_name, field_name);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT ON sec.field_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_permission(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.get_user_permissions(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.get_user_roles(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.can_access_field(UUID, UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.get_field_mask_type(UUID, UUID, TEXT, TEXT) TO authenticated;
