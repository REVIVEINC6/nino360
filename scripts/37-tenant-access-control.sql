CREATE TABLE IF NOT EXISTS core.role_scopes (
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  rule JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tenant_id, role_id, resource)
);

ALTER TABLE core.role_scopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY role_scopes_rls ON core.role_scopes
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM core.user_tenants WHERE user_id = auth.uid() LIMIT 1))
  WITH CHECK (tenant_id = (SELECT tenant_id FROM core.user_tenants WHERE user_id = auth.uid() LIMIT 1));

-- Add metadata columns to roles if missing
ALTER TABLE core.roles
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Mark built-in roles as system roles
UPDATE core.roles SET is_system = TRUE WHERE key IN ('master_admin', 'super_admin', 'admin', 'manager', 'recruiter', 'finance', 'viewer');

-- Seed additional permissions for access control
INSERT INTO core.permissions(key, description) VALUES
  ('access.roles.write', 'Create and manage custom roles'),
  ('access.perms.write', 'Assign permissions to roles'),
  ('access.flags.write', 'Manage feature flags'),
  ('access.scopes.write', 'Define record and field-level access rules')
ON CONFLICT (key) DO NOTHING;

-- Grant access control permissions to admin roles
INSERT INTO core.role_permissions(role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM core.roles r
CROSS JOIN core.permissions p
WHERE r.key IN ('master_admin', 'super_admin', 'admin')
  AND p.key LIKE 'access.%'
ON CONFLICT DO NOTHING;

GRANT ALL ON core.role_scopes TO authenticated;
