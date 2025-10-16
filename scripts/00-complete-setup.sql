-- ============================================================================
-- NINO360 COMPLETE DATABASE SETUP
-- Run this script to set up the entire database schema
-- ============================================================================

-- This script consolidates all migration scripts in the correct order
-- Run each section sequentially in your Supabase SQL Editor

-- ============================================================================
-- STEP 1: Core Tables & Schemas
-- ============================================================================
\i scripts/01-create-tables.sql

-- ============================================================================
-- STEP 2: Enable Row Level Security
-- ============================================================================
\i scripts/02-enable-rls.sql

-- ============================================================================
-- STEP 3: Seed Initial Data
-- ============================================================================
\i scripts/03-seed-data.sql

-- ============================================================================
-- STEP 4-8: Module-Specific Tables
-- ============================================================================
\i scripts/04-admin-module.sql
\i scripts/05-tenant-admin.sql
\i scripts/06-ats.sql
\i scripts/07-bench.sql
\i scripts/08-vms.sql

-- ============================================================================
-- STEP 9: RBAC & FBAC
-- ============================================================================
\i scripts/09-rbac-fbac.sql

-- ============================================================================
-- STEP 10-15: Additional Modules
-- ============================================================================
\i scripts/10-finance.sql
\i scripts/11-projects.sql
\i scripts/12-reports.sql
\i scripts/13-automation.sql
\i scripts/14-hrms.sql
\i scripts/15-crm.sql

-- ============================================================================
-- STEP 19-28: Enhancements & Advanced Features
-- ============================================================================
\i scripts/19-admin-enhancements.sql
\i scripts/20-security-compliance.sql
\i scripts/21-rbac-fbac-enhanced.sql
\i scripts/22-rag-system.sql
\i scripts/23-admin-governance.sql
\i scripts/24-tenant-management.sql
\i scripts/25-ats-talent.sql
\i scripts/26-bench-management.sql
\i scripts/27-finance-module.sql
\i scripts/28-hrms-module.sql

-- ============================================================================
-- STEP 30-31: User Features
-- ============================================================================
\i scripts/30-lead-billing-onboarding.sql
\i scripts/31-user-settings.sql

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify schemas exist
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill');

-- Verify key tables exist
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill')
ORDER BY table_schema, table_name;

-- Verify key functions exist
SELECT routine_schema, routine_name 
FROM information_schema.routines 
WHERE routine_schema IN ('sec', 'public')
  AND routine_name IN ('has_permission', 'has_feature', 'get_user_permissions', 'get_user_roles')
ORDER BY routine_schema, routine_name;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
