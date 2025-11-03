-- =====================================================
-- NINO360 HRMS - PHASE 1: CORE INFRASTRUCTURE
-- =====================================================
-- Purpose: Set up extensions, schemas, and core tables
-- Execute this FIRST before any other phase
-- =====================================================

BEGIN;

-- =====================================================
-- SECTION 1: EXTENSIONS AND SCHEMAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create core schema for system tables
CREATE SCHEMA IF NOT EXISTS core;

-- =====================================================
-- SECTION 2: UTILITY FUNCTIONS
-- =====================================================

-- Function to safely add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name TEXT,
  column_name TEXT,
  column_type TEXT
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = table_name 
    AND column_name = column_name
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', table_name, column_name, column_type);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to safely add a foreign key if it doesn't exist
CREATE OR REPLACE FUNCTION add_foreign_key_if_not_exists(
  table_name TEXT,
  constraint_name TEXT,
  column_name TEXT,
  ref_table TEXT,
  ref_column TEXT
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = constraint_name
  ) THEN
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I)',
      table_name, constraint_name, column_name, ref_table, ref_column
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECTION 3: CORE TABLES
-- =====================================================

-- Tenants table (multi-tenancy support)
CREATE TABLE IF NOT EXISTS core.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS core.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  title VARCHAR(100),
  department VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 4: RBAC (Role-Based Access Control)
-- =====================================================

-- Roles table
CREATE TABLE IF NOT EXISTS core.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  "key" VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, "key")
);

-- Permissions table
CREATE TABLE IF NOT EXISTS core.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  module VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES core.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id, tenant_id)
);

-- =====================================================
-- INDEXES FOR CORE TABLES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON core.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON core.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON core.roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_roles_key ON core.roles("key");
CREATE INDEX IF NOT EXISTS idx_permissions_key ON core.permissions("key");
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 1: Core Infrastructure - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ 4 extensions';
  RAISE NOTICE '  ✓ Core schema';
  RAISE NOTICE '  ✓ 2 utility functions';
  RAISE NOTICE '  ✓ 7 core tables (tenants, users, roles, permissions)';
  RAISE NOTICE '  ✓ 8 indexes';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run phase-2-module-tables.sql';
END $$;
