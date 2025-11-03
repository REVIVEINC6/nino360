-- ============================================================================
-- NINO360 MASTER DATABASE SETUP
-- ============================================================================
-- This is the master setup file that executes all module scripts in order
-- Run this file to set up the complete database schema
--
-- Usage: psql $POSTGRES_URL -f scripts/modules/00-SETUP-MASTER.sql
-- ============================================================================

\echo '========================================='
\echo 'NINO360 Database Setup - Starting'
\echo '========================================='

-- ============================================================================
-- PHASE 1: CORE INFRASTRUCTURE
-- ============================================================================
\echo ''
\echo '>>> Phase 1: Core Infrastructure'
\i scripts/modules/01-core-infrastructure.sql

-- ============================================================================
-- PHASE 2: SECURITY & ACCESS CONTROL
-- ============================================================================
\echo ''
\echo '>>> Phase 2: Security & Access Control'
\i scripts/modules/02-security-rbac-fbac.sql

-- ============================================================================
-- PHASE 3: TENANT MANAGEMENT
-- ============================================================================
\echo ''
\echo '>>> Phase 3: Tenant Management'
\i scripts/modules/03-tenant-module.sql

-- ============================================================================
-- PHASE 4: ADMIN MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 4: Admin Module'
\i scripts/modules/04-admin-module.sql

-- ============================================================================
-- PHASE 5: CRM MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 5: CRM Module'
\i scripts/modules/05-crm-module.sql

-- ============================================================================
-- PHASE 6: TALENT/ATS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 6: Talent/ATS Module'
\i scripts/modules/06-talent-ats-module.sql

-- ============================================================================
-- PHASE 7: HRMS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 7: HRMS Module'
\i scripts/modules/07-hrms-module.sql

-- ============================================================================
-- PHASE 8: BENCH MANAGEMENT
-- ============================================================================
\echo ''
\echo '>>> Phase 8: Bench Management'
\i scripts/modules/08-bench-module.sql

-- ============================================================================
-- PHASE 9: HOTLIST MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 9: Hotlist Module'
\i scripts/modules/09-hotlist-module.sql

-- ============================================================================
-- PHASE 10: TRAINING/LMS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 10: Training/LMS Module'
\i scripts/modules/10-training-lms-module.sql

-- ============================================================================
-- PHASE 11: FINANCE MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 11: Finance Module'
\i scripts/modules/11-finance-module.sql

-- ============================================================================
-- PHASE 12: PROJECTS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 12: Projects Module'
\i scripts/modules/12-projects-module.sql

-- ============================================================================
-- PHASE 13: VMS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 13: VMS Module'
\i scripts/modules/13-vms-module.sql

-- ============================================================================
-- PHASE 14: REPORTS MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 14: Reports Module'
\i scripts/modules/14-reports-module.sql

-- ============================================================================
-- PHASE 15: AUTOMATION MODULE
-- ============================================================================
\echo ''
\echo '>>> Phase 15: Automation Module'
\i scripts/modules/15-automation-module.sql

-- ============================================================================
-- PHASE 16: AI & RAG SYSTEM
-- ============================================================================
\echo ''
\echo '>>> Phase 16: AI & RAG System'
\i scripts/modules/16-ai-rag-system.sql

-- ============================================================================
-- PHASE 17: ANALYTICS & VIEWS
-- ============================================================================
\echo ''
\echo '>>> Phase 17: Analytics & Views'
\i scripts/modules/17-analytics-views.sql

-- ============================================================================
-- PHASE 18: SEED DATA
-- ============================================================================
\echo ''
\echo '>>> Phase 18: Seed Data'
\i scripts/modules/18-seed-data.sql

-- ============================================================================
-- PHASE 19: PUBLIC RPC WRAPPERS
-- ============================================================================
\echo ''
\echo '>>> Phase 19: Public RPC Wrappers'
\i scripts/modules/19-public-rpc-wrappers.sql

\echo ''
\echo '========================================='
\echo 'NINO360 Database Setup - Complete!'
\echo '========================================='
\echo ''
\echo 'Next steps:'
\echo '1. Verify all tables created: SELECT count(*) FROM information_schema.tables WHERE table_schema = ''public'';'
\echo '2. Check RLS policies: SELECT schemaname, tablename, policyname FROM pg_policies;'
\echo '3. Test authentication and access control'
\echo ''
