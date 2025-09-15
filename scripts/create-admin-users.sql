-- Create admin users for ESG OS platform
-- This script creates the master admin and super admin accounts

-- First, ensure we have the proper tenant structure
INSERT INTO tenants (id, name, domain, status, created_at, updated_at)
VALUES 
  ('esg-master-tenant', 'ESG Master Organization', 'esgos.com', 'active', NOW(), NOW()),
  ('esg-it-tenant', 'ESG IT Solutions', 'esgit.com', 'active', NOW(), NOW())
ON CONFLICT (domain) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Create user profiles for the admin accounts
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  tenant_id,
  is_active,
  created_at,
  updated_at
) VALUES 
  (
    gen_random_uuid(),
    'sreekar.pratap@gmail.com',
    'Sreekar Pratap',
    'master_admin',
    'esg-master-tenant',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'sreekar.pratap@esgit.com',
    'Sreekar Pratap',
    'super_admin',
    'esg-it-tenant',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  tenant_id = EXCLUDED.tenant_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Create role assignments for the admin users
INSERT INTO user_role_assignments (
  id,
  user_id,
  role_id,
  assigned_by,
  assigned_at,
  is_active
)
SELECT 
  gen_random_uuid(),
  up.id,
  r.id,
  up.id, -- Self-assigned for initial setup
  NOW(),
  true
FROM user_profiles up
CROSS JOIN roles r
WHERE 
  (up.email = 'sreekar.pratap@gmail.com' AND r.name = 'master_admin') OR
  (up.email = 'sreekar.pratap@esgit.com' AND r.name = 'super_admin')
ON CONFLICT (user_id, role_id) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  assigned_at = NOW();

-- Grant all permissions to master admin role
INSERT INTO role_permissions (role_id, permission_id, granted_by, granted_at)
SELECT 
  r.id,
  p.id,
  (SELECT id FROM user_profiles WHERE email = 'sreekar.pratap@gmail.com'),
  NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'master_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Grant super admin permissions (all except system admin)
INSERT INTO role_permissions (role_id, permission_id, granted_by, granted_at)
SELECT 
  r.id,
  p.id,
  (SELECT id FROM user_profiles WHERE email = 'sreekar.pratap@gmail.com'),
  NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin' 
  AND p.name != 'SYSTEM_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create audit log entries for the user creation
INSERT INTO audit_logs (
  id,
  table_name,
  record_id,
  action,
  old_values,
  new_values,
  user_id,
  tenant_id,
  ip_address,
  user_agent,
  created_at
)
SELECT 
  gen_random_uuid(),
  'user_profiles',
  up.id,
  'INSERT',
  '{}',
  jsonb_build_object(
    'email', up.email,
    'full_name', up.full_name,
    'role', up.role,
    'tenant_id', up.tenant_id,
    'is_active', up.is_active
  ),
  up.id,
  up.tenant_id,
  '127.0.0.1',
  'System Setup',
  NOW()
FROM user_profiles up
WHERE up.email IN ('sreekar.pratap@gmail.com', 'sreekar.pratap@esgit.com');

-- Update tenant ownership
UPDATE tenants 
SET owner_id = (SELECT id FROM user_profiles WHERE email = 'sreekar.pratap@gmail.com')
WHERE domain = 'esgos.com';

UPDATE tenants 
SET owner_id = (SELECT id FROM user_profiles WHERE email = 'sreekar.pratap@esgit.com')
WHERE domain = 'esgit.com';

-- Create notification preferences for admin users
INSERT INTO user_preferences (
  id,
  user_id,
  category,
  key,
  value,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  up.id,
  'notifications',
  'email_notifications',
  'true',
  NOW(),
  NOW()
FROM user_profiles up
WHERE up.email IN ('sreekar.pratap@gmail.com', 'sreekar.pratap@esgit.com')
ON CONFLICT (user_id, category, key) DO NOTHING;

-- Enable realtime for admin users
SELECT pg_notify('user_profile_changes', 
  json_build_object(
    'type', 'admin_users_created',
    'users', json_agg(
      json_build_object(
        'email', email,
        'role', role,
        'tenant_id', tenant_id
      )
    )
  )::text
)
FROM user_profiles 
WHERE email IN ('sreekar.pratap@gmail.com', 'sreekar.pratap@esgit.com');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Admin users created successfully:';
  RAISE NOTICE '- Master Admin: sreekar.pratap@gmail.com';
  RAISE NOTICE '- Super Admin: sreekar.pratap@esgit.com';
  RAISE NOTICE 'Users can now sign in with their email and password.';
END $$;
