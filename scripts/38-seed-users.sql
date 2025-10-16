-- NINO360 — Seed Users for Testing
-- Create master admin and sample users for each role

-- ============================================
-- MASTER ADMIN USER
-- ============================================

-- Insert master admin user (sreekar.pratap@gmail.com)
-- Note: This user must first sign up through Supabase Auth
-- This script will link them to the master tenant with master_admin role

-- Create a placeholder user record (will be replaced by actual Supabase auth user)
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'sreekar.pratap@gmail.com',
  'Sreekar Pratap'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Link master admin to master tenant
INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT 
  u.id,
  t.id,
  TRUE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'sreekar.pratap@gmail.com'
  AND t.slug = 'master'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- Assign master_admin role
INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT 
  u.id,
  t.id,
  r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'sreekar.pratap@gmail.com'
  AND t.slug = 'master'
  AND r.key = 'master_admin'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- ============================================
-- SAMPLE USERS FOR EACH ROLE
-- ============================================

-- Super Admin User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000002'::UUID,
  'superadmin@nino360.com',
  'Super Admin User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'superadmin@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'superadmin@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'super_admin'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- Admin User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000003'::UUID,
  'admin@nino360.com',
  'Admin User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'admin@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'admin@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'admin'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- Manager User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000004'::UUID,
  'manager@nino360.com',
  'Manager User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'manager@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'manager@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'manager'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- Recruiter User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000005'::UUID,
  'recruiter@nino360.com',
  'Recruiter User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'recruiter@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'recruiter@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'recruiter'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- Finance User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000006'::UUID,
  'finance@nino360.com',
  'Finance User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'finance@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'finance@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'finance'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- Viewer User
INSERT INTO core.users (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000007'::UUID,
  'viewer@nino360.com',
  'Viewer User'
)
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
SELECT u.id, t.id, FALSE
FROM core.users u
CROSS JOIN core.tenants t
WHERE u.email = 'viewer@nino360.com' AND t.slug = 'acme-staffing'
ON CONFLICT (user_id, tenant_id) DO NOTHING;

INSERT INTO core.user_roles (user_id, tenant_id, role_id)
SELECT u.id, t.id, r.id
FROM core.users u
CROSS JOIN core.tenants t
CROSS JOIN core.roles r
WHERE u.email = 'viewer@nino360.com' 
  AND t.slug = 'acme-staffing'
  AND r.key = 'viewer'
ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify master admin setup
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM core.users u
  JOIN core.user_roles ur ON ur.user_id = u.id
  JOIN core.roles r ON r.id = ur.role_id
  WHERE u.email = 'sreekar.pratap@gmail.com'
    AND r.key = 'master_admin';
  
  IF v_count > 0 THEN
    RAISE NOTICE 'Master admin (sreekar.pratap@gmail.com) successfully configured with master_admin role';
  ELSE
    RAISE WARNING 'Master admin setup incomplete - user may need to sign up through Supabase Auth first';
  END IF;
END $$;

-- List all sample users
SELECT 
  u.email,
  u.full_name,
  t.name AS tenant,
  r.label AS role
FROM core.users u
JOIN core.user_roles ur ON ur.user_id = u.id
JOIN core.tenants t ON t.id = ur.tenant_id
JOIN core.roles r ON r.id = ur.role_id
WHERE u.email IN (
  'sreekar.pratap@gmail.com',
  'superadmin@nino360.com',
  'admin@nino360.com',
  'manager@nino360.com',
  'recruiter@nino360.com',
  'finance@nino360.com',
  'viewer@nino360.com'
)
ORDER BY r.key, u.email;
