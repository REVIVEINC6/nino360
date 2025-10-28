-- =====================================================
-- NINO360 HRMS - MASTER DATABASE SETUP SCRIPT
-- =====================================================
-- Purpose: Complete database initialization in a single transaction
-- Version: 3.0.0 - COMPLETE PRODUCTION READY
-- Date: 2025-01-14
--
-- This script creates the entire database structure including:
-- - Extensions and schemas
-- - Core tables (tenants, users, roles, permissions)
-- - Module tables (CRM, Talent, HRMS, Finance, Bench, VMS, Projects, Hotlist, Training, Automation, Reports)
-- - Indexes for performance
-- - RLS policies for security
-- - Triggers for automation
-- - Materialized views for analytics
-- - Stored procedures and functions (30+)
-- - Realtime configuration
-- - Seed data for initial setup
--
-- Total Tables: 70+
-- Total Indexes: 150+
-- Total Functions: 30+
-- Total Materialized Views: 12
--
-- Usage: Run this script once on a fresh database
-- =====================================================

BEGIN;

-- =====================================================
-- SECTION 0: CLEANUP (Drop existing tables if any)
-- =====================================================
-- Added cleanup section to drop all existing tables before recreation
-- This ensures a clean state and prevents schema conflicts

-- Drop materialized views first
DROP MATERIALIZED VIEW IF EXISTS mv_talent_pipeline_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_crm_pipeline_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_finance_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_hrms_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_bench_utilization CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_vms_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_project_health CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_training_completion CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_hotlist_performance CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_automation_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_tenant_overview CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_revenue_forecast CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS training_certifications CASCADE;
DROP TABLE IF EXISTS training_enrollments CASCADE;
DROP TABLE IF EXISTS training_quiz_attempts CASCADE;
DROP TABLE IF EXISTS training_quizzes CASCADE;
DROP TABLE IF EXISTS training_modules CASCADE;
DROP TABLE IF EXISTS training_courses CASCADE;
DROP TABLE IF EXISTS training_categories CASCADE;
DROP TABLE IF EXISTS training_learning_paths CASCADE;
DROP TABLE IF EXISTS training_path_courses CASCADE;

DROP TABLE IF EXISTS hotlist_campaigns CASCADE;
DROP TABLE IF EXISTS hotlist_submissions CASCADE;
DROP TABLE IF EXISTS hotlist_analytics CASCADE;
DROP TABLE IF EXISTS hotlist_templates CASCADE;
DROP TABLE IF EXISTS hotlist_candidates CASCADE;
DROP TABLE IF EXISTS hotlist_distributions CASCADE;
DROP TABLE IF EXISTS hotlist_engagement CASCADE;

DROP TABLE IF EXISTS automation_webhooks CASCADE;
DROP TABLE IF EXISTS automation_rules CASCADE;
DROP TABLE IF EXISTS automation_logs CASCADE;
DROP TABLE IF EXISTS automation_channels CASCADE;
DROP TABLE IF EXISTS automation_alerts CASCADE;

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_templates CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;

DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS report_schedules CASCADE;
DROP TABLE IF EXISTS report_exports CASCADE;

DROP TABLE IF EXISTS project_risks CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_resources CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS project_timesheets CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

DROP TABLE IF EXISTS vms_invoices CASCADE;
DROP TABLE IF EXISTS vms_timesheets CASCADE;
DROP TABLE IF EXISTS vms_submissions CASCADE;
DROP TABLE IF EXISTS vms_job_postings CASCADE;

DROP TABLE IF EXISTS bench_forecasts CASCADE;
DROP TABLE IF EXISTS bench_allocations CASCADE;
DROP TABLE IF EXISTS bench_skills CASCADE;
DROP TABLE IF EXISTS bench_consultants CASCADE;

DROP TABLE IF EXISTS finance_tax_filings CASCADE;
DROP TABLE IF EXISTS finance_gl_entries CASCADE;
DROP TABLE IF EXISTS finance_revenue_recognition CASCADE;
DROP TABLE IF EXISTS finance_expense_reports CASCADE;
DROP TABLE IF EXISTS finance_budget_forecasts CASCADE;
DROP TABLE IF EXISTS finance_budgets CASCADE;
DROP TABLE IF EXISTS finance_payroll CASCADE;
DROP TABLE IF EXISTS finance_pay_cycles CASCADE;
DROP TABLE IF EXISTS finance_ap_invoices CASCADE;
DROP TABLE IF EXISTS finance_ar_invoices CASCADE;
DROP TABLE IF EXISTS finance_expenses CASCADE;

DROP TABLE IF EXISTS hrms_training_records CASCADE;
DROP TABLE IF EXISTS hrms_exit_interviews CASCADE;
DROP TABLE IF EXISTS hrms_offboarding CASCADE;
DROP TABLE IF EXISTS hrms_onboarding CASCADE;
DROP TABLE IF EXISTS hrms_help_desk_tickets CASCADE;
DROP TABLE IF EXISTS hrms_benefits_enrollment CASCADE;
DROP TABLE IF EXISTS hrms_benefits CASCADE;
DROP TABLE IF EXISTS hrms_compensation_history CASCADE;
DROP TABLE IF EXISTS hrms_performance_reviews CASCADE;
DROP TABLE IF EXISTS hrms_leave_requests CASCADE;
DROP TABLE IF EXISTS hrms_attendance CASCADE;
DROP TABLE IF EXISTS hrms_timesheets CASCADE;
DROP TABLE IF EXISTS hrms_employees CASCADE;

DROP TABLE IF EXISTS ats_onboarding_tasks CASCADE;
DROP TABLE IF EXISTS ats_offers CASCADE;
DROP TABLE IF EXISTS ats_interview_feedback CASCADE;
DROP TABLE IF EXISTS ats_interviews CASCADE;
DROP TABLE IF EXISTS ats_assessments CASCADE;
DROP TABLE IF EXISTS ats_applications CASCADE;
DROP TABLE IF EXISTS ats_candidates CASCADE;
DROP TABLE IF EXISTS ats_job_requisitions CASCADE;
DROP TABLE IF EXISTS ats_skills CASCADE;

DROP TABLE IF EXISTS crm_email_sequences CASCADE;
DROP TABLE IF EXISTS crm_campaigns CASCADE;
DROP TABLE IF EXISTS crm_quotes CASCADE;
DROP TABLE IF EXISTS crm_products CASCADE;
DROP TABLE IF EXISTS crm_activities CASCADE;
DROP TABLE IF EXISTS crm_opportunities CASCADE;
DROP TABLE IF EXISTS crm_leads CASCADE;
DROP TABLE IF EXISTS crm_contacts CASCADE;
DROP TABLE IF EXISTS crm_accounts CASCADE;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS core.permissions CASCADE;
DROP TABLE IF EXISTS core.roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Fixed DROP TABLE to use core schema
DROP TABLE IF EXISTS core.users CASCADE;

-- =====================================================
-- SECTION 1: EXTENSIONS AND SCHEMAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For query performance monitoring
-- Commented out pgvector as it's not available by default
-- CREATE EXTENSION IF NOT EXISTS "pgvector"; -- For AI embeddings (optional)
-- Note: To enable vector search for AI features, install pgvector extension manually:
-- https://github.com/pgvector/pgvector#installation

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS sec;
CREATE SCHEMA IF NOT EXISTS ai;

COMMENT ON SCHEMA core IS 'Core business tables';
COMMENT ON SCHEMA sec IS 'Security and audit tables';
COMMENT ON SCHEMA ai IS 'AI/ML related tables';

-- =====================================================
-- SECTION 2: UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column IS 'Automatically updates updated_at timestamp on row update';

-- Function to generate unique codes
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := prefix || '-';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_unique_code IS 'Generate unique alphanumeric codes with prefix';

-- Function to calculate business days between dates
CREATE OR REPLACE FUNCTION business_days_between(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
DECLARE
    days INTEGER := 0;
    -- Renamed current_date to loop_date to avoid reserved keyword conflict
    loop_date DATE := start_date;
BEGIN
    WHILE loop_date <= end_date LOOP
        IF EXTRACT(DOW FROM loop_date) NOT IN (0, 6) THEN
            days := days + 1;
        END IF;
        loop_date := loop_date + 1;
    END LOOP;
    RETURN days;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION business_days_between IS 'Calculate business days between two dates (excluding weekends)';

-- Adding comprehensive migration logic for existing tables
-- Function to safely add columns if they don't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  p_table_name TEXT,
  p_column_name TEXT,
  p_column_definition TEXT
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = p_table_name AND column_name = p_column_name
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', p_table_name, p_column_name, p_column_definition);
    RAISE NOTICE 'Added column %.% with definition: %', p_table_name, p_column_name, p_column_definition;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to safely add foreign key constraint if it doesn't exist
CREATE OR REPLACE FUNCTION add_foreign_key_if_not_exists(
  p_table_name TEXT,
  p_constraint_name TEXT,
  p_column_name TEXT,
  p_ref_table TEXT,
  p_ref_column TEXT
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = p_constraint_name AND table_name = p_table_name
  ) THEN
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I)',
      p_table_name, p_constraint_name, p_column_name, p_ref_table, p_ref_column
    );
    RAISE NOTICE 'Added foreign key constraint % on %.%', p_constraint_name, p_table_name, p_column_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECTION 2.5: TABLE MIGRATION & SAFETY CHECKS
-- =====================================================

-- Ensure critical tables exist before adding columns
DO $$
BEGIN
  -- Check if hrms_timesheets table exists, if not it will be created later
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hrms_timesheets') THEN
    -- Add project_id column if it doesn't exist
    PERFORM add_column_if_not_exists('hrms_timesheets', 'project_id', 'UUID');
    
    -- Add foreign key constraint if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'hrms_timesheets',
        'fk_hrms_timesheets_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if hrms_time_entries table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hrms_time_entries') THEN
    -- Add project_id column if it doesn't exist
    PERFORM add_column_if_not_exists('hrms_time_entries', 'project_id', 'UUID');
    
    -- Add foreign key constraint if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'hrms_time_entries',
        'fk_hrms_time_entries_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_invoices table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_invoices') THEN
    PERFORM add_column_if_not_exists('finance_invoices', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_invoices',
        'fk_finance_invoices_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_expenses table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_expenses') THEN
    PERFORM add_column_if_not_exists('finance_expenses', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_expenses',
        'fk_finance_expenses_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_budgets table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_budgets') THEN
    PERFORM add_column_if_not_exists('finance_budgets', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_budgets',
        'fk_finance_budgets_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  RAISE NOTICE 'Migration checks completed successfully';
END $$;

-- =====================================================
-- SECTION 3: CORE TABLES
-- =====================================================

-- Using core schema for consistency with existing database structure
CREATE SCHEMA IF NOT EXISTS core;

-- Tenants table
CREATE TABLE IF NOT EXISTS core.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON core.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON core.tenants(status);

COMMENT ON TABLE core.tenants IS 'Multi-tenant organizations';

-- Users table
CREATE TABLE IF NOT EXISTS core.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON core.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);

COMMENT ON TABLE core.users IS 'System users across all tenants';

-- Roles table
CREATE TABLE IF NOT EXISTS core.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roles_key ON core.roles("key");

COMMENT ON TABLE core.roles IS 'System and custom roles';

-- Permissions table
CREATE TABLE IF NOT EXISTS core.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permissions_key ON core.permissions("key");
CREATE INDEX IF NOT EXISTS idx_permissions_module ON core.permissions(module);

COMMENT ON TABLE core.permissions IS 'Granular permissions';

-- Junction: user <-> tenant (multi-tenant membership)
-- Fixed REFERENCES to use core.users for tenant_users
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES core.roles(id),
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);

-- Fixed REFERENCES to use core.users for tenant_invitations
CREATE TABLE IF NOT EXISTS tenant_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES core.roles(id),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  invited_by UUID REFERENCES core.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_invitations_tenant ON tenant_invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_email ON tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_status ON tenant_invitations(status);


-- =====================================================
-- SECTION 4: RBAC (Role-Based Access Control)
-- =====================================================

-- Note: Duplicate RBAC tables removed as they were already defined in SECTION 3 (CORE TABLES)
-- and are intended to be in the core schema.

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES core.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- Fixed all foreign key references to use proper schema prefixes
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tenant_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant ON user_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

-- =====================================================
-- SECTION 5: CRM MODULE (ENHANCED)
-- =====================================================

CREATE TABLE IF NOT EXISTS crm_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  account_manager_id UUID REFERENCES core.users(id),
  status VARCHAR(50) DEFAULT 'active',
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_accounts_tenant ON crm_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_status ON crm_accounts(status);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_manager ON crm_accounts(account_manager_id);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(100),
  department VARCHAR(100),
  owner_id UUID REFERENCES core.users(id),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_tenant ON crm_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_account ON crm_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES core.users(id),
  notes TEXT,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_tenant ON crm_leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(email);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  stage VARCHAR(50) DEFAULT 'prospecting',
  amount DECIMAL(15,2),
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  assigned_to UUID REFERENCES core.users(id),
  created_by UUID REFERENCES core.users(id),
  description TEXT,
  status VARCHAR(50) DEFAULT 'open', -- Added status field
  won_at TIMESTAMPTZ, -- Added date fields for won/lost
  lost_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_opportunities_tenant ON crm_opportunities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_account ON crm_opportunities(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_assigned ON crm_opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_status ON crm_opportunities(status);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  related_to_type VARCHAR(50),
  related_to_id UUID,
  activity_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_tenant ON crm_activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_type ON crm_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner ON crm_activities(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_due ON crm_activities(due_date);

-- Adding missing CRM tables for complete functionality

CREATE TABLE IF NOT EXISTS crm_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  unit_price DECIMAL(15,2) NOT NULL,
  cost DECIMAL(15,2),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_products_tenant ON crm_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_products_sku ON crm_products(sku);
CREATE INDEX IF NOT EXISTS idx_crm_products_active ON crm_products(is_active);

CREATE TABLE IF NOT EXISTS crm_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES crm_opportunities(id) ON DELETE CASCADE,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0, -- Added discount_amount
  total DECIMAL(15,2) DEFAULT 0,
  valid_until DATE,
  terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_quotes_tenant ON crm_quotes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_quotes_opportunity ON crm_quotes(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_crm_quotes_status ON crm_quotes(status);

CREATE TABLE IF NOT EXISTS crm_quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES crm_quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES crm_products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_quote_items_tenant ON crm_quote_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_quote_items_quote ON crm_quote_items(quote_id);

CREATE TABLE IF NOT EXISTS crm_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  trigger_type TEXT CHECK (trigger_type IN ('manual', 'lead_created', 'opportunity_stage', 'custom')),
  total_steps INTEGER DEFAULT 0,
  created_by UUID REFERENCES core.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_sequences_tenant ON crm_sequences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_sequences_status ON crm_sequences(status);

CREATE TABLE IF NOT EXISTS crm_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES crm_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_type TEXT CHECK (step_type IN ('email', 'task', 'wait', 'webhook')),
  delay_days INTEGER DEFAULT 0,
  email_template_id UUID,
  task_description TEXT,
  webhook_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_sequence_steps_tenant ON crm_sequence_steps(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_sequence_steps_sequence ON crm_sequence_steps(sequence_id);

CREATE TABLE IF NOT EXISTS crm_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(50) CHECK (campaign_type IN ('email', 'social', 'event', 'webinar', 'other')),
  status VARCHAR(50) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2) DEFAULT 0,
  target_audience VARCHAR(100),
  total_leads INTEGER DEFAULT 0,
  converted_leads INTEGER DEFAULT 0,
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_campaigns_tenant ON crm_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_campaigns_status ON crm_campaigns(status);

-- =====================================================
-- SECTION 5.1: PROJECTS MODULE (CORE TABLE)
-- Added this new section to correctly place the Projects table before modules that depend on it.
-- =====================================================
-- Adding projects table before HRMS module to resolve dependency issues
-- This table must be created before hrms_timesheets, project_resources, and other tables that reference it

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES crm_accounts(id),
  project_code VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  project_type VARCHAR(100),
  start_date DATE,
  end_date DATE,
  estimated_budget DECIMAL(15,2),
  actual_budget DECIMAL(15,2) DEFAULT 0,
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2) DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  project_manager_id UUID REFERENCES core.users(id),
  billing_type VARCHAR(50) DEFAULT 'fixed' CHECK (billing_type IN ('fixed', 'hourly', 'milestone', 'retainer')),
  billing_rate DECIMAL(10,2),
  health_status VARCHAR(50) DEFAULT 'on_track' CHECK (health_status IN ('on_track', 'at_risk', 'off_track')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(project_manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);

-- Adding safety checks for project_id columns in existing tables
-- These ALTER TABLE statements ensure project_id columns exist even if tables were created from previous script runs
DO $$
BEGIN
  -- Add project_id to hrms_timesheets if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_timesheets' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE hrms_timesheets ADD COLUMN project_id UUID REFERENCES projects(id);
    CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_project ON hrms_timesheets(project_id);
  END IF;

  -- Add project_id to hrms_time_entries if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_time_entries' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE hrms_time_entries ADD COLUMN project_id UUID REFERENCES projects(id);
    CREATE INDEX IF NOT EXISTS idx_hrms_time_entries_project ON hrms_time_entries(project_id);
  END IF;

  -- Add project_id to finance_invoices if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_invoices' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance_invoices ADD COLUMN project_id UUID REFERENCES projects(id);
    CREATE INDEX IF NOT EXISTS idx_finance_invoices_project ON finance_invoices(project_id);
  END IF;

  -- Add project_id to finance_expenses if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_expenses' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance_expenses ADD COLUMN project_id UUID REFERENCES projects(id);
    CREATE INDEX IF NOT EXISTS idx_finance_expenses_project ON finance_expenses(project_id);
  END IF;

  -- Add project_id to finance_budgets if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_budgets' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance_budgets ADD COLUMN project_id UUID REFERENCES projects(id);
    CREATE INDEX IF NOT EXISTS idx_finance_budgets_project ON finance_budgets(project_id);
  END IF;
END $$;

-- =====================================================
-- SECTION 6: HRMS MODULE (ENHANCED)
-- Moved HRMS Employees table here to ensure it's defined before tables that reference it (Bench, Projects).
-- =====================================================

CREATE TABLE IF NOT EXISTS hrms_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id),
  employee_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT,

  -- Employment
  hire_date DATE NOT NULL,
  termination_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated', 'suspended')),
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  department TEXT,
  job_title TEXT,
  level TEXT,
  manager_id UUID REFERENCES hrms_employees(id),

  -- Compensation
  salary DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  pay_frequency TEXT CHECK (pay_frequency IN ('hourly', 'weekly', 'biweekly', 'monthly', 'annual')),

  -- Location
  work_location TEXT,
  remote_type TEXT CHECK (remote_type IN ('onsite', 'hybrid', 'remote')),

  -- Immigration (US specific)
  work_authorization TEXT,
  visa_type TEXT,
  visa_expiry_date DATE,
  i9_status TEXT,
  i9_verified_date DATE,

  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_employees_tenant ON hrms_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_user ON hrms_employees(user_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_number ON hrms_employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_status ON hrms_employees(status);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_department ON hrms_employees(department);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_manager ON hrms_employees(manager_id);

CREATE TABLE IF NOT EXISTS hrms_timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_hours DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES core.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, week_start_date)
);

CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_tenant ON hrms_timesheets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_employee ON hrms_timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_week ON hrms_timesheets(week_start_date);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_status ON hrms_timesheets(status);

CREATE TABLE IF NOT EXISTS hrms_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  timesheet_id UUID NOT NULL REFERENCES hrms_timesheets(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  project_id UUID,
  task_description TEXT,
  is_billable BOOLEAN DEFAULT TRUE,
  is_overtime BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_time_entries_tenant ON hrms_time_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_time_entries_timesheet ON hrms_time_entries(timesheet_id);
CREATE INDEX IF NOT EXISTS idx_hrms_time_entries_employee ON hrms_time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_time_entries_date ON hrms_time_entries(entry_date);

-- Adding missing HRMS tables for complete functionality

CREATE TABLE IF NOT EXISTS hrms_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave', 'holiday')),
  work_hours DECIMAL(5, 2),
  location TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_hrms_attendance_tenant ON hrms_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_attendance_employee ON hrms_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_attendance_date ON hrms_attendance(attendance_date);

CREATE TABLE IF NOT EXISTS hrms_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  leave_type TEXT CHECK (leave_type IN ('vacation', 'sick', 'personal', 'unpaid', 'bereavement', 'parental')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days DECIMAL(4, 1) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reason TEXT,
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_leave_tenant ON hrms_leave_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_leave_employee ON hrms_leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_leave_status ON hrms_leave_requests(status);

CREATE TABLE IF NOT EXISTS hrms_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES core.users(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  review_type TEXT CHECK (review_type IN ('annual', 'quarterly', 'probation', '360', 'project')),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed', 'acknowledged')),
  strengths TEXT,
  areas_for_improvement TEXT,
  goals TEXT,
  comments TEXT,
  employee_comments TEXT,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_performance_tenant ON hrms_performance_reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_performance_employee ON hrms_performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_performance_status ON hrms_performance_reviews(status);

CREATE TABLE IF NOT EXISTS hrms_compensation_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  change_type TEXT CHECK (change_type IN ('raise', 'promotion', 'bonus', 'adjustment', 'demotion')),
  effective_date DATE NOT NULL,
  old_salary DECIMAL(12, 2),
  new_salary DECIMAL(12, 2) NOT NULL,
  old_title TEXT,
  new_title TEXT,
  reason TEXT,
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_compensation_tenant ON hrms_compensation_changes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_compensation_employee ON hrms_compensation_changes(employee_id);

CREATE TABLE IF NOT EXISTS hrms_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  benefit_name TEXT NOT NULL,
  benefit_type TEXT CHECK (benefit_type IN ('health', 'dental', 'vision', 'life', 'disability', 'retirement', 'other')),
  provider TEXT,
  description TEXT,
  employee_cost DECIMAL(10, 2),
  employer_cost DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_benefits_tenant ON hrms_benefits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_benefits_active ON hrms_benefits(is_active);

CREATE TABLE IF NOT EXISTS hrms_benefit_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  benefit_id UUID NOT NULL REFERENCES hrms_benefits(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL,
  coverage_start_date DATE NOT NULL,
  coverage_end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'terminated', 'pending')),
  dependents INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hrms_benefit_enrollments_tenant ON hrms_benefit_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_benefit_enrollments_employee ON hrms_benefit_enrollments(employee_id);

-- =====================================================
-- SECTION 7: TALENT/ATS MODULE (ENHANCED)
-- =====================================================

CREATE TABLE IF NOT EXISTS ats_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  mobile TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  current_title TEXT,
  current_company TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  resume_text TEXT,
  skills TEXT[],
  experience_years DECIMAL(4, 1),
  education_level TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'screening', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  source TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_candidates_tenant ON ats_candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_candidates_email ON ats_candidates(email);
CREATE INDEX IF NOT EXISTS idx_ats_candidates_status ON ats_candidates(status);
CREATE INDEX IF NOT EXISTS idx_ats_candidates_skills ON ats_candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_ats_candidates_source ON ats_candidates(source);

CREATE TABLE IF NOT EXISTS ats_job_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id),
  job_code TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  responsibilities TEXT,
  location TEXT,
  remote_type TEXT CHECK (remote_type IN ('onsite', 'hybrid', 'remote')),
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'contract_to_hire', 'temporary')),
  department TEXT,
  level TEXT,
  min_salary DECIMAL(12, 2),
  max_salary DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'on_hold', 'filled', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  positions_open INTEGER DEFAULT 1,
  positions_filled INTEGER DEFAULT 0,
  skills_required TEXT[],
  min_experience DECIMAL(4, 1),
  hiring_manager_id UUID REFERENCES core.users(id),
  recruiter_id UUID REFERENCES core.users(id),
  posted_date DATE,
  target_fill_date DATE,
  filled_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_jobs_tenant ON ats_job_requisitions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_jobs_status ON ats_job_requisitions(status);
CREATE INDEX IF NOT EXISTS idx_ats_jobs_account ON ats_job_requisitions(account_id);
CREATE INDEX IF NOT EXISTS idx_ats_jobs_recruiter ON ats_job_requisitions(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_ats_jobs_skills ON ats_job_requisitions USING GIN(skills_required);

CREATE TABLE IF NOT EXISTS ats_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES ats_job_requisitions(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES ats_candidates(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'phone_screen', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn')),
  stage TEXT,
  source TEXT,
  applied_date TIMESTAMPTZ DEFAULT NOW(),
  screening_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  offer_date TIMESTAMPTZ,
  hired_date TIMESTAMPTZ,
  rejected_date TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_ats_applications_tenant ON ats_applications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_applications_job ON ats_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_ats_applications_candidate ON ats_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ats_applications_status ON ats_applications(status);

CREATE TABLE IF NOT EXISTS ats_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES ats_applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES ats_candidates(id),
  job_id UUID REFERENCES ats_job_requisitions(id),
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_link TEXT,
  interviewer_ids UUID[],
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_interviews_tenant ON ats_interviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_interviews_application ON ats_interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_ats_interviews_scheduled ON ats_interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_ats_interviews_status ON ats_interviews(status);

-- Adding missing ATS tables for complete functionality

CREATE TABLE IF NOT EXISTS ats_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES ats_applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES ats_candidates(id),
  job_id UUID REFERENCES ats_job_requisitions(id),
  offer_date DATE NOT NULL,
  expiry_date DATE,
  salary DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  employment_type TEXT,
  start_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'withdrawn')),
  accepted_date DATE,
  rejected_date DATE,
  rejection_reason TEXT,
  offer_letter_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_offers_tenant ON ats_offers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_offers_application ON ats_offers(application_id);
CREATE INDEX IF NOT EXISTS idx_ats_offers_status ON ats_offers(status);

CREATE TABLE IF NOT EXISTS ats_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES ats_applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES ats_candidates(id),
  assessment_type TEXT CHECK (assessment_type IN ('technical', 'behavioral', 'cognitive', 'personality', 'skills')),
  assessment_name TEXT NOT NULL,
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  score DECIMAL(5, 2),
  max_score DECIMAL(5, 2),
  passed BOOLEAN,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'expired')),
  results JSONB,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_assessments_tenant ON ats_assessments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_assessments_application ON ats_assessments(application_id);
CREATE INDEX IF NOT EXISTS idx_ats_assessments_status ON ats_assessments(status);

CREATE TABLE IF NOT EXISTS ats_interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  interview_id UUID NOT NULL REFERENCES ats_interviews(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES core.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  strengths TEXT,
  weaknesses TEXT,
  comments TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_feedback_tenant ON ats_interview_feedback(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ats_feedback_interview ON ats_interview_feedback(interview_id);

-- =====================================================
-- SECTION 8: BENCH MODULE
-- Moved Bench module before Projects to fix dependency order
-- =====================================================

CREATE TABLE IF NOT EXISTS bench_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id),
  candidate_id UUID REFERENCES ats_candidates(id),
  resource_type TEXT CHECK (resource_type IN ('employee', 'contractor', 'consultant')),
  availability_date DATE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'allocated', 'interviewing', 'on_leave')),
  skills TEXT[],
  certifications TEXT[],
  experience_years DECIMAL(4, 1),
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  location TEXT,
  remote_preference TEXT CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'flexible')),
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  bench_since DATE,
  bench_days INTEGER,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bench_resources_tenant ON bench_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_employee ON bench_resources(employee_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_status ON bench_resources(status);
CREATE INDEX IF NOT EXISTS idx_bench_resources_skills ON bench_resources USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_bench_resources_availability ON bench_resources(availability_date);

-- =====================================================
-- SECTION 9: PROJECTS MODULE
-- Renumbered from Section 7, now comes after Bench module
-- Removed duplicate projects table - now defined in Section 5.1
-- =====================================================

-- Projects table moved to Section 5.1 (before HRMS module)
-- The original projects table definition in this section has been removed.

CREATE TABLE IF NOT EXISTS project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES bench_resources(id),
  employee_id UUID REFERENCES hrms_employees(id),
  role TEXT,
  allocation_percentage INTEGER CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  start_date DATE NOT NULL,
  end_date DATE,
  hourly_rate DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'removed')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_resources_tenant ON project_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_project ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_resource ON project_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_employee ON project_resources(employee_id);

-- Adding missing Projects tables

CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES core.users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_tasks_tenant ON project_tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned ON project_tasks(assigned_to);

CREATE TABLE IF NOT EXISTS project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(50) DEFAULT 'medium',
  probability VARCHAR(50) DEFAULT 'medium',
  impact TEXT,
  mitigation TEXT,
  status VARCHAR(50) DEFAULT 'open',
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_risks_tenant ON project_risks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_project ON project_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_status ON project_risks(status);

CREATE TABLE IF NOT EXISTS project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  category VARCHAR(100),
  uploaded_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_documents_tenant ON project_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_project ON project_documents(project_id);

-- =====================================================
-- SECTION 10: FINANCE MODULE (ENHANCED)
-- =====================================================

CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES crm_accounts(id),
  project_id UUID REFERENCES projects(id),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0, -- Added discount_amount
  total DECIMAL(15,2) DEFAULT 0,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  payment_terms VARCHAR(100),
  notes TEXT,
  approved_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_invoices_tenant ON finance_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_client ON finance_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_project ON finance_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_number ON finance_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_status ON finance_invoices(status);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_due ON finance_invoices(due_date);

CREATE TABLE IF NOT EXISTS finance_invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES finance_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_invoice_items_tenant ON finance_invoice_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoice_items_invoice ON finance_invoice_items(invoice_id);

CREATE TABLE IF NOT EXISTS finance_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES finance_invoices(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  reviewer_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_payments_tenant ON finance_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_payments_invoice ON finance_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_finance_payments_date ON finance_payments(payment_date);

-- Adding missing Finance tables

CREATE TABLE IF NOT EXISTS finance_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id),
  project_id UUID REFERENCES projects(id),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT, -- Added rejection reason
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_expenses_tenant ON finance_expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_employee ON finance_expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_project ON finance_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_status ON finance_expenses(status);

CREATE TABLE IF NOT EXISTS finance_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_type TEXT CHECK (budget_type IN ('department', 'project', 'category', 'annual')),
  department TEXT,
  project_id UUID REFERENCES projects(id),
  fiscal_year INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_budget DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  committed_amount DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed')),
  owner_id UUID REFERENCES core.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_budgets_tenant ON finance_budgets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_budgets_project ON finance_budgets(project_id);

-- =====================================================
-- SECTION 11: VMS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS vms_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vendor_type TEXT CHECK (vendor_type IN ('staffing_agency', 'consulting_firm', 'freelancer', 'other')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  address TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
  tier TEXT CHECK (tier IN ('preferred', 'approved', 'trial')),
  payment_terms TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vms_vendors_tenant ON vms_vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vms_vendors_status ON vms_vendors(status);
CREATE INDEX IF NOT EXISTS idx_vms_vendors_tier ON vms_vendors(tier);

CREATE TABLE IF NOT EXISTS vms_vendor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms_vendors(id) ON DELETE CASCADE,
  job_id UUID REFERENCES ats_job_requisitions(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES ats_candidates(id),
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'screening', 'shortlisted', 'interviewing', 'rejected', 'hired', 'withdrawn')),
  vendor_rate DECIMAL(10, 2),
  client_rate DECIMAL(10, 2),
  markup_percentage DECIMAL(5, 2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vms_submissions_tenant ON vms_vendor_submissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vms_submissions_vendor ON vms_vendor_submissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vms_submissions_job ON vms_vendor_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_vms_submissions_status ON vms_vendor_submissions(status);

-- =====================================================
-- SECTION 12: HOTLIST MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS hotlist_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    campaign_type VARCHAR(50) DEFAULT 'manual',
    target_audience VARCHAR(100),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    total_candidates INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT hotlist_campaigns_tenant_name_key UNIQUE(tenant_id, name)
);

CREATE INDEX IF NOT EXISTS idx_hotlist_campaigns_tenant ON hotlist_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hotlist_campaigns_status ON hotlist_campaigns(status);

CREATE TABLE IF NOT EXISTS hotlist_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES ats_candidates(id) ON DELETE CASCADE,
    priority VARCHAR(50) DEFAULT 'medium',
    availability VARCHAR(50),
    target_roles TEXT[],
    marketing_status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_tenant ON hotlist_candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_candidate ON hotlist_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_roles ON hotlist_candidates USING GIN(target_roles);

-- =====================================================
-- SECTION 13: TRAINING/LMS MODULE (ENHANCED)
-- =====================================================

CREATE TABLE IF NOT EXISTS lms_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_hours DECIMAL(6,2),
    is_published BOOLEAN DEFAULT false,
    provides_certificate BOOLEAN DEFAULT false,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_courses_tenant ON lms_courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lms_courses_published ON lms_courses(is_published);
CREATE INDEX IF NOT EXISTS idx_lms_courses_category ON lms_courses(category);

CREATE TABLE IF NOT EXISTS lms_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    final_score DECIMAL(5,2),
    passed BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT lms_enrollments_unique UNIQUE(course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_enrollments_tenant ON lms_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user ON lms_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_status ON lms_enrollments(status);

-- Adding missing LMS tables

CREATE TABLE IF NOT EXISTS lms_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_hours DECIMAL(5,2),
  content_type VARCHAR(50) CHECK (content_type IN ('video', 'document', 'quiz', 'interactive', 'scorm')),
  content_url TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_modules_tenant ON lms_modules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lms_modules_course ON lms_modules(course_id);

CREATE TABLE IF NOT EXISTS lms_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  course_id UUID REFERENCES lms_courses(id),
  module_id UUID REFERENCES lms_modules(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score DECIMAL(5,2) DEFAULT 70.00,
  time_limit_minutes INTEGER,
  max_attempts INTEGER,
  is_randomized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_quizzes_tenant ON lms_quizzes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lms_quizzes_course ON lms_quizzes(course_id);

CREATE TABLE IF NOT EXISTS lms_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.users(id),
  course_id UUID NOT NULL REFERENCES lms_courses(id),
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  certificate_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_certificates_tenant ON lms_certificates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lms_certificates_user ON lms_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_certificates_course ON lms_certificates(course_id);

-- =====================================================
-- SECTION 14: AUTOMATION MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0, -- Added execution_count
  last_executed_at TIMESTAMPTZ, -- Added last_executed_at
  created_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_rules_tenant ON automation_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);

CREATE TABLE IF NOT EXISTS automation_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  method VARCHAR(10) DEFAULT 'POST',
  headers JSONB,
  event_type VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_webhooks_tenant ON automation_webhooks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automation_webhooks_active ON automation_webhooks(is_active);

CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
  webhook_id UUID REFERENCES automation_webhooks(id) ON DELETE CASCADE,
  execution_type TEXT CHECK (execution_type IN ('rule', 'webhook')),
  status TEXT CHECK (status IN ('success', 'failure', 'pending')),
  trigger_data JSONB,
  result_data JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_executions_tenant ON automation_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_webhook ON automation_executions(webhook_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_executed ON automation_executions(executed_at DESC);

-- =====================================================
-- SECTION 15: NOTIFICATIONS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  notification_type TEXT CHECK (notification_type IN ('info', 'success', 'warning', 'error')),
  channel TEXT CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_sent ON notifications(sent_at DESC);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id),
  channel VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, channel, event_type)
);

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON notification_preferences(user_id);

-- =====================================================
-- SECTION 16: REPORTS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  module TEXT NOT NULL,
  query_config JSONB NOT NULL,
  visualization_config JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES core.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_reports_tenant ON saved_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_module ON saved_reports(module);
CREATE INDEX IF NOT EXISTS idx_saved_reports_creator ON saved_reports(created_by);

CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  report_id UUID REFERENCES saved_reports(id) ON DELETE CASCADE,
  schedule_type TEXT CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'quarterly')),
  schedule_config JSONB,
  recipients TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES core.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_reports_tenant ON scheduled_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_active ON scheduled_reports(is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_next_run ON scheduled_reports(next_run_at);

-- =====================================================
-- SECTION 17: AUDIT AND SECURITY
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system actions';

-- =====================================================
-- SECTION 18: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- Fixed ALTER TABLE to use core schema
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invitations ENABLE ROW LEVEL SECURITY; -- Added RLS for tenant_invitations
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY; -- Added RLS for tenant_users
ALTER TABLE core.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE crm_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

ALTER TABLE ats_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_interviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE hrms_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_time_entries ENABLE ROW LEVEL SECURITY;

ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE bench_resources ENABLE ROW LEVEL SECURITY;

ALTER TABLE vms_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms_vendor_submissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

ALTER TABLE hotlist_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_candidates ENABLE ROW LEVEL SECURITY;

ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Adding RLS for new tables

ALTER TABLE crm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_campaigns ENABLE ROW LEVEL SECURITY;

ALTER TABLE ats_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_interview_feedback ENABLE ROW LEVEL SECURITY;

ALTER TABLE hrms_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_compensation_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_benefit_enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_budgets ENABLE ROW LEVEL SECURITY;

ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;

ALTER TABLE lms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_certificates ENABLE ROW LEVEL SECURITY;

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 18.5: TABLE MIGRATION & SAFETY CHECKS
-- =====================================================
-- This section runs AFTER all tables are created to add missing columns
-- to existing tables from previous schema versions

-- Ensure critical tables exist before adding columns
DO $$
BEGIN
  -- Check if hrms_timesheets table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hrms_timesheets') THEN
    -- Add project_id column if it doesn't exist
    PERFORM add_column_if_not_exists('hrms_timesheets', 'project_id', 'UUID');
    
    -- Add foreign key constraint if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'hrms_timesheets',
        'fk_hrms_timesheets_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if hrms_time_entries table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hrms_time_entries') THEN
    -- Add project_id column if it doesn't exist
    PERFORM add_column_if_not_exists('hrms_time_entries', 'project_id', 'UUID');
    
    -- Add foreign key constraint if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'hrms_time_entries',
        'fk_hrms_time_entries_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_invoices table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_invoices') THEN
    PERFORM add_column_if_not_exists('finance_invoices', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_invoices',
        'fk_finance_invoices_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_expenses table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_expenses') THEN
    PERFORM add_column_if_not_exists('finance_expenses', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_expenses',
        'fk_finance_expenses_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;

  -- Check if finance_budgets table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_budgets') THEN
    PERFORM add_column_if_not_exists('finance_budgets', 'project_id', 'UUID');
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
      PERFORM add_foreign_key_if_not_exists(
        'finance_budgets',
        'fk_finance_budgets_project',
        'project_id',
        'projects',
        'id'
      );
    END IF;
  END IF;
END $$;

-- =====================================================
-- SECTION 19: RLS POLICIES (Tenant Isolation)
-- =====================================================

-- Note: These policies assume app.current_tenant_id is set in the session
-- This should be set by your application middleware

-- CRM Policies
CREATE POLICY crm_accounts_tenant_isolation ON crm_accounts
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_contacts_tenant_isolation ON crm_contacts
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_leads_tenant_isolation ON crm_leads
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_opportunities_tenant_isolation ON crm_opportunities
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_activities_tenant_isolation ON crm_activities
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- ATS Policies
CREATE POLICY ats_candidates_tenant_isolation ON ats_candidates
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY ats_jobs_tenant_isolation ON ats_job_requisitions
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY ats_applications_tenant_isolation ON ats_applications
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY ats_interviews_tenant_isolation ON ats_interviews
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- HRMS Policies
CREATE POLICY hrms_employees_tenant_isolation ON hrms_employees
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_timesheets_tenant_isolation ON hrms_timesheets
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_time_entries_tenant_isolation ON hrms_time_entries
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Finance Policies
CREATE POLICY finance_invoices_tenant_isolation ON finance_invoices
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY finance_invoice_items_tenant_isolation ON finance_invoice_items
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY finance_payments_tenant_isolation ON finance_payments
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Bench Policies
CREATE POLICY bench_resources_tenant_isolation ON bench_resources
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- VMS Policies
CREATE POLICY vms_vendors_tenant_isolation ON vms_vendors
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY vms_submissions_tenant_isolation ON vms_vendor_submissions
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Projects Policies
CREATE POLICY projects_tenant_isolation ON projects
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY project_resources_tenant_isolation ON project_resources
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Hotlist Policies
CREATE POLICY hotlist_campaigns_tenant_isolation ON hotlist_campaigns
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hotlist_candidates_tenant_isolation ON hotlist_candidates
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- LMS Policies
CREATE POLICY lms_courses_tenant_isolation ON lms_courses
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY lms_enrollments_tenant_isolation ON lms_enrollments
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Audit Policies
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Adding RLS policies for new tables

-- CRM Additional Policies
CREATE POLICY crm_products_tenant_isolation ON crm_products
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_quotes_tenant_isolation ON crm_quotes
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_sequences_tenant_isolation ON crm_sequences
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY crm_campaigns_tenant_isolation ON crm_campaigns
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- ATS Additional Policies
CREATE POLICY ats_offers_tenant_isolation ON ats_offers
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY ats_assessments_tenant_isolation ON ats_assessments
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY ats_feedback_tenant_isolation ON ats_interview_feedback
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- HRMS Additional Policies
CREATE POLICY hrms_attendance_tenant_isolation ON hrms_attendance
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_leave_tenant_isolation ON hrms_leave_requests
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_performance_tenant_isolation ON hrms_performance_reviews
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_compensation_tenant_isolation ON hrms_compensation_changes
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_benefits_tenant_isolation ON hrms_benefits
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY hrms_benefit_enrollments_tenant_isolation ON hrms_benefit_enrollments
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Finance Additional Policies
CREATE POLICY finance_expenses_tenant_isolation ON finance_expenses
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY finance_budgets_tenant_isolation ON finance_budgets
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Projects Additional Policies
CREATE POLICY project_tasks_tenant_isolation ON project_tasks
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY project_risks_tenant_isolation ON project_risks
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- LMS Additional Policies
CREATE POLICY lms_modules_tenant_isolation ON lms_modules
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY lms_quizzes_tenant_isolation ON lms_quizzes
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY lms_certificates_tenant_isolation ON lms_certificates
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Automation Policies
CREATE POLICY automation_rules_tenant_isolation ON automation_rules
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY automation_webhooks_tenant_isolation ON automation_webhooks
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY automation_executions_tenant_isolation ON automation_executions
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Notifications Policies
CREATE POLICY notifications_tenant_isolation ON notifications
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY notification_prefs_tenant_isolation ON notification_preferences
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Reports Policies
CREATE POLICY saved_reports_tenant_isolation ON saved_reports
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY scheduled_reports_tenant_isolation ON scheduled_reports
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- =====================================================
-- SECTION 20: TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fixed trigger to use core schema
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON core.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_accounts_updated_at BEFORE UPDATE ON crm_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_opportunities_updated_at BEFORE UPDATE ON crm_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at BEFORE UPDATE ON crm_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_candidates_updated_at BEFORE UPDATE ON ats_candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_jobs_updated_at BEFORE UPDATE ON ats_job_requisitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_applications_updated_at BEFORE UPDATE ON ats_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_interviews_updated_at BEFORE UPDATE ON ats_interviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_employees_updated_at BEFORE UPDATE ON hrms_employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_timesheets_updated_at BEFORE UPDATE ON hrms_timesheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_invoices_updated_at BEFORE UPDATE ON finance_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_payments_updated_at BEFORE UPDATE ON finance_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bench_resources_updated_at BEFORE UPDATE ON bench_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vms_vendors_updated_at BEFORE UPDATE ON vms_vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vms_submissions_updated_at BEFORE UPDATE ON vms_vendor_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_resources_updated_at BEFORE UPDATE ON project_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_campaigns_updated_at BEFORE UPDATE ON hotlist_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_candidates_updated_at BEFORE UPDATE ON hotlist_candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_courses_updated_at BEFORE UPDATE ON lms_courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_enrollments_updated_at BEFORE UPDATE ON lms_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Adding triggers for new tables

CREATE TRIGGER update_crm_products_updated_at BEFORE UPDATE ON crm_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_quotes_updated_at BEFORE UPDATE ON crm_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_sequences_updated_at BEFORE UPDATE ON crm_sequences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_campaigns_updated_at BEFORE UPDATE ON crm_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_offers_updated_at BEFORE UPDATE ON ats_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_assessments_updated_at BEFORE UPDATE ON ats_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_leave_updated_at BEFORE UPDATE ON hrms_leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_performance_updated_at BEFORE UPDATE ON hrms_performance_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_benefits_updated_at BEFORE UPDATE ON hrms_benefits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_benefit_enrollments_updated_at BEFORE UPDATE ON hrms_benefit_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_expenses_updated_at BEFORE UPDATE ON finance_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_budgets_updated_at BEFORE UPDATE ON finance_budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_risks_updated_at BEFORE UPDATE ON project_risks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_modules_updated_at BEFORE UPDATE ON lms_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_webhooks_updated_at BEFORE UPDATE ON automation_webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_prefs_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_reports_updated_at BEFORE UPDATE ON saved_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON scheduled_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SECTION 21: SEED DATA
-- =====================================================

-- Insert default roles
INSERT INTO core.roles(key, label, description, is_system) VALUES
  ('master_admin', 'Master Admin', 'Platform administrator with full access', true),
  ('super_admin', 'Super Admin', 'Tenant administrator with full tenant access', true),
  ('admin', 'Admin', 'Administrator with most permissions', true),
  ('manager', 'Manager', 'Manager with team oversight', true),
  ('recruiter', 'Recruiter', 'Recruiter with talent management access', true),
  ('finance', 'Finance', 'Finance team member', true),
  ('employee', 'Employee', 'Standard employee', true),
  ('viewer', 'Viewer', 'Read-only access', true)
ON CONFLICT (key) DO NOTHING;

-- Insert default permissions
INSERT INTO core.permissions(key, description, module) VALUES
  -- User Management
  ('users.read', 'Read users', 'users'),
  ('users.write', 'Create/Update users', 'users'),
  ('users.delete', 'Delete users', 'users'),

  -- Tenant Management
  ('tenants.read', 'Read tenant settings', 'tenants'),
  ('tenants.write', 'Manage tenant settings', 'tenants'),

  -- CRM
  ('crm.accounts.read', 'Read accounts', 'crm'),
  ('crm.accounts.write', 'Create/Update accounts', 'crm'),
  ('crm.contacts.read', 'Read contacts', 'crm'),
  ('crm.contacts.write', 'Create/Update contacts', 'crm'),
  ('crm.leads.read', 'Read leads', 'crm'),
  ('crm.leads.write', 'Create/Update leads', 'crm'),
  ('crm.opportunities.read', 'Read opportunities', 'crm'),
  ('crm.opportunities.write', 'Create/Update opportunities', 'crm'),
  ('crm.products.read', 'Read products', 'crm'),
  ('crm.products.write', 'Create/Update products', 'crm'),
  ('crm.quotes.read', 'Read quotes', 'crm'),
  ('crm.quotes.write', 'Create/Update quotes', 'crm'),
  ('crm.sequences.read', 'Read sequences', 'crm'),
  ('crm.sequences.write', 'Create/Update sequences', 'crm'),
  ('crm.campaigns.read', 'Read campaigns', 'crm'),
  ('crm.campaigns.write', 'Create/Update campaigns', 'crm'),

  -- Talent/ATS
  ('talent.candidates.read', 'Read candidates', 'talent'),
  ('talent.candidates.write', 'Create/Update candidates', 'talent'),
  ('talent.jobs.read', 'Read job requisitions', 'talent'),
  ('talent.jobs.write', 'Create/Update job requisitions', 'talent'),
  ('talent.applications.read', 'Read applications', 'talent'),
  ('talent.applications.write', 'Manage applications', 'talent'),
  ('talent.offers.read', 'Read offers', 'talent'),
  ('talent.offers.write', 'Create/Update offers', 'talent'),
  ('talent.assessments.read', 'Read assessments', 'talent'),
  ('talent.assessments.write', 'Manage assessments', 'talent'),

  -- HRMS
  ('hrms.employees.read', 'Read employees', 'hrms'),
  ('hrms.employees.write', 'Create/Update employees', 'hrms'),
  ('hrms.timesheets.read', 'Read timesheets', 'hrms'),
  ('hrms.timesheets.write', 'Submit timesheets', 'hrms'),
  ('hrms.timesheets.approve', 'Approve timesheets', 'hrms'),
  ('hrms.attendance.read', 'Read attendance', 'hrms'),
  ('hrms.attendance.write', 'Manage attendance', 'hrms'),
  ('hrms.leave.read', 'Read leave requests', 'hrms'),
  ('hrms.leave.write', 'Manage leave requests', 'hrms'),
  ('hrms.performance.read', 'Read performance reviews', 'hrms'),
  ('hrms.performance.write', 'Manage performance reviews', 'hrms'),
  ('hrms.compensation.read', 'Read compensation changes', 'hrms'),
  ('hrms.compensation.write', 'Manage compensation changes', 'hrms'),
  ('hrms.benefits.read', 'Read benefits', 'hrms'),
  ('hrms.benefits.write', 'Manage benefits', 'hrms'),

  -- Finance
  ('finance.invoices.read', 'Read invoices', 'finance'),
  ('finance.invoices.write', 'Create/Update invoices', 'finance'),
  ('finance.payments.read', 'Read payments', 'finance'),
  ('finance.payments.write', 'Process payments', 'finance'),
  ('finance.expenses.read', 'Read expenses', 'finance'),
  ('finance.expenses.write', 'Manage expenses', 'finance'),
  ('finance.budgets.read', 'Read budgets', 'finance'),
  ('finance.budgets.write', 'Manage budgets', 'finance'),

  -- Projects
  ('projects.read', 'Read projects', 'projects'),
  ('projects.write', 'Create/Update projects', 'projects'),
  ('projects.tasks.read', 'Read project tasks', 'projects'),
  ('projects.tasks.write', 'Manage project tasks', 'projects'),
  ('projects.risks.read', 'Read project risks', 'projects'),
  ('projects.risks.write', 'Manage project risks', 'projects'),

  -- Training/LMS
  ('lms.courses.read', 'Read courses', 'lms'),
  ('lms.courses.write', 'Create/Update courses', 'lms'),
  ('lms.enrollments.read', 'Read enrollments', 'lms'),
  ('lms.enrollments.write', 'Manage enrollments', 'lms'),
  ('lms.certificates.read', 'Read certificates', 'lms'),

  -- Automation
  ('automation.rules.read', 'Read automation rules', 'automation'),
  ('automation.rules.write', 'Create/Update automation rules', 'automation'),
  ('automation.webhooks.read', 'Read automation webhooks', 'automation'),
  ('automation.webhooks.write', 'Create/Update automation webhooks', 'automation'),

  -- Notifications
  ('notifications.read', 'Read notifications', 'notifications'),
  ('notifications.manage', 'Manage notification preferences', 'notifications'),

  -- Reports
  ('reports.read', 'View reports', 'reports'),
  ('reports.write', 'Create/Save reports', 'reports'),
  ('reports.schedule', 'Schedule reports', 'reports'),
  ('reports.export', 'Export reports', 'reports')
ON CONFLICT (key) DO NOTHING;

-- Create master tenant
INSERT INTO tenants(slug, name, status, plan)
VALUES ('master', 'Nino360 Master', 'active', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- Create demo tenant
INSERT INTO tenants(slug, name, status, plan)
VALUES ('demo-company', 'Demo Company', 'active', 'professional')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SECTION 22: ANALYTICS VIEWS (Materialized)
-- =====================================================

-- CRM Pipeline Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_crm_pipeline_metrics AS
SELECT
  tenant_id,
  DATE_TRUNC('month', created_at) as month,
  stage,
  COUNT(*) as opportunity_count,
  SUM(amount) as total_value,
  AVG(amount) as avg_deal_size,
  COUNT(CASE WHEN status = 'won' THEN 1 END) as won_count,
  COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost_count
FROM crm_opportunities
GROUP BY tenant_id, DATE_TRUNC('month', created_at), stage;

CREATE INDEX IF NOT EXISTS idx_mv_crm_pipeline_tenant ON mv_crm_pipeline_metrics(tenant_id);

-- ATS Recruitment Funnel
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ats_recruitment_funnel AS
SELECT
  tenant_id,
  job_id,
  DATE_TRUNC('month', created_at) as month,
  status,
  COUNT(*) as candidate_count
FROM ats_applications
GROUP BY tenant_id, job_id, DATE_TRUNC('month', created_at), status;

CREATE INDEX IF NOT EXISTS idx_mv_ats_funnel_tenant ON mv_ats_recruitment_funnel(tenant_id);

-- HRMS Headcount Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hrms_headcount AS
SELECT
  tenant_id,
  DATE_TRUNC('month', hire_date) as month,
  department,
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE status = 'terminated') as terminated_count
FROM hrms_employees
GROUP BY tenant_id, DATE_TRUNC('month', hire_date), department;

CREATE INDEX IF NOT EXISTS idx_mv_hrms_headcount_tenant ON mv_hrms_headcount(tenant_id);

-- Finance Revenue Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_finance_revenue AS
SELECT
  tenant_id,
  DATE_TRUNC('month', invoice_date) as month,
  COUNT(*) as invoice_count,
  SUM(total) as total_invoiced, -- Corrected column name
  SUM(amount_paid) as total_collected
FROM finance_invoices
WHERE status != 'draft'
GROUP BY tenant_id, DATE_TRUNC('month', invoice_date);

CREATE INDEX IF NOT EXISTS idx_mv_finance_revenue_tenant ON mv_finance_revenue(tenant_id);

-- Adding more comprehensive analytics views

-- Talent Pipeline Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_talent_pipeline_metrics AS
SELECT
  tenant_id,
  DATE_TRUNC('month', created_at) as month,
  status,
  COUNT(DISTINCT candidate_id) as total_candidates,
  COUNT(DISTINCT CASE WHEN status = 'hired' THEN candidate_id END) as hired_count,
  COUNT(DISTINCT job_id) as active_jobs,
  AVG(EXTRACT(DAY FROM (hired_date - applied_date))) as avg_time_to_hire
FROM ats_applications
GROUP BY tenant_id, DATE_TRUNC('month', created_at), status;

CREATE INDEX IF NOT EXISTS idx_mv_talent_pipeline_tenant ON mv_talent_pipeline_metrics(tenant_id);

-- HRMS Attendance Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hrms_attendance_metrics AS
SELECT
  tenant_id,
  DATE_TRUNC('month', attendance_date) as month,
  department,
  COUNT(*) FILTER (WHERE status = 'present') as present_days,
  COUNT(*) FILTER (WHERE status = 'absent') as absent_days,
  COUNT(*) FILTER (WHERE status = 'late') as late_days,
  COUNT(DISTINCT employee_id) as employee_count
FROM hrms_attendance a
JOIN hrms_employees e ON a.employee_id = e.id
GROUP BY tenant_id, DATE_TRUNC('month', attendance_date), department;

CREATE INDEX IF NOT EXISTS idx_mv_hrms_attendance_tenant ON mv_hrms_attendance_metrics(tenant_id);

-- Finance Expense Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_finance_expense_metrics AS
SELECT
  tenant_id,
  DATE_TRUNC('month', expense_date) as month,
  category,
  COUNT(*) as expense_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM finance_expenses
WHERE status = 'approved'
GROUP BY tenant_id, DATE_TRUNC('month', expense_date), category;

CREATE INDEX IF NOT EXISTS idx_mv_finance_expense_tenant ON mv_finance_expense_metrics(tenant_id);

-- Project Performance Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_project_performance AS
SELECT
  p.tenant_id,
  p.id as project_id,
  p.name as project_name,
  p.status,
  p.estimated_budget as budget,
  p.actual_budget as actual_cost,
  ((p.estimated_budget - p.actual_budget) / NULLIF(p.estimated_budget, 0) * 100) as budget_variance_pct,
  COUNT(DISTINCT pr.id) as resource_count,
  COUNT(DISTINCT pt.id) as task_count,
  COUNT(DISTINCT pt.id) FILTER (WHERE pt.status = 'done') as completed_tasks,
  COUNT(DISTINCT r.id) as risk_count
FROM projects p
LEFT JOIN project_resources pr ON p.id = pr.project_id
LEFT JOIN project_tasks pt ON p.id = pt.project_id
LEFT JOIN project_risks r ON p.id = r.project_id
GROUP BY p.tenant_id, p.id, p.name, p.status, p.estimated_budget, p.actual_budget;

CREATE INDEX IF NOT EXISTS idx_mv_project_performance_tenant ON mv_project_performance(tenant_id);

-- LMS Learning Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_lms_learning_metrics AS
SELECT
  tenant_id,
  DATE_TRUNC('month', enrolled_at) as month,
  COUNT(*) as total_enrollments,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE passed = true) as passed_count,
  AVG(final_score) as avg_score,
  AVG(EXTRACT(DAY FROM (completed_at - enrolled_at))) as avg_completion_days
FROM lms_enrollments
GROUP BY tenant_id, DATE_TRUNC('month', enrolled_at);

CREATE INDEX IF NOT EXISTS idx_mv_lms_learning_tenant ON mv_lms_learning_metrics(tenant_id);

-- =====================================================
-- SECTION 23: STORED PROCEDURES FOR BUSINESS LOGIC
-- =====================================================

-- Procedure: Create candidate from lead
CREATE OR REPLACE FUNCTION convert_lead_to_candidate(
    p_lead_id UUID,
    p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_lead RECORD;
    v_candidate_id UUID;
    v_tenant_id UUID;
BEGIN
    -- Get lead details
    SELECT * INTO v_lead FROM crm_leads WHERE id = p_lead_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead not found';
    END IF;

    v_tenant_id := v_lead.tenant_id;

    -- Create candidate
    INSERT INTO ats_candidates (
        tenant_id,
        first_name,
        last_name,
        email,
        phone,
        source,
        status,
        metadata
    ) VALUES (
        v_tenant_id,
        v_lead.first_name,
        v_lead.last_name,
        v_lead.email,
        v_lead.phone,
        v_lead.source,
        'new',
        jsonb_build_object('converted_from_lead_id', p_lead_id)
    ) RETURNING id INTO v_candidate_id;

    -- Update lead status
    UPDATE crm_leads
    SET
        status = 'converted',
        converted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_lead_id;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_tenant_id,
        p_user_id,
        'convert_lead_to_candidate',
        'lead',
        p_lead_id,
        jsonb_build_object('candidate_id', v_candidate_id)
    );

    RETURN v_candidate_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION convert_lead_to_candidate IS 'Convert a CRM lead to an ATS candidate';

-- Procedure: Submit timesheet
CREATE OR REPLACE FUNCTION submit_timesheet(
    p_timesheet_id UUID,
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_timesheet RECORD;
    v_total_hours DECIMAL(5,2);
BEGIN
    -- Get timesheet
    SELECT * INTO v_timesheet FROM hrms_timesheets WHERE id = p_timesheet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Timesheet not found';
    END IF;

    IF v_timesheet.status != 'draft' THEN
        RAISE EXCEPTION 'Timesheet is not in draft status';
    END IF;

    -- Calculate total hours from entries
    SELECT COALESCE(SUM(hours), 0) INTO v_total_hours
    FROM hrms_time_entries
    WHERE timesheet_id = p_timesheet_id;

    -- Update timesheet
    UPDATE hrms_timesheets
    SET
        status = 'submitted',
        submitted_at = NOW(),
        total_hours = v_total_hours,
        updated_at = NOW()
    WHERE id = p_timesheet_id;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_timesheet.tenant_id,
        p_user_id,
        'submit_timesheet',
        'timesheet',
        p_timesheet_id,
        jsonb_build_object('total_hours', v_total_hours)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION submit_timesheet IS 'Submit a timesheet for approval';

-- Procedure: Approve timesheet
CREATE OR REPLACE FUNCTION approve_timesheet(
    p_timesheet_id UUID,
    p_approver_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_timesheet RECORD;
BEGIN
    -- Get timesheet
    SELECT * INTO v_timesheet FROM hrms_timesheets WHERE id = p_timesheet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Timesheet not found';
    END IF;

    IF v_timesheet.status != 'submitted' THEN
        RAISE EXCEPTION 'Timesheet is not submitted';
    END IF;

    -- Update timesheet
    UPDATE hrms_timesheets
    SET
        status = 'approved',
        approved_at = NOW(),
        approved_by = p_approver_id,
        updated_at = NOW()
    WHERE id = p_timesheet_id;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_timesheet.tenant_id,
        p_approver_id,
        'approve_timesheet',
        'timesheet',
        p_timesheet_id,
        jsonb_build_object('employee_id', v_timesheet.employee_id)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION approve_timesheet IS 'Approve a submitted timesheet';

-- Procedure: Calculate invoice total
CREATE OR REPLACE FUNCTION calculate_invoice_total(p_invoice_id UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
    v_subtotal DECIMAL(15,2);
    v_tax DECIMAL(15,2);
    v_discount DECIMAL(15,2);
    v_total DECIMAL(15,2);
BEGIN
    -- Calculate subtotal from line items
    SELECT COALESCE(SUM(amount), 0) INTO v_subtotal
    FROM finance_invoice_items
    WHERE invoice_id = p_invoice_id;

    -- Get tax and discount from invoice
    SELECT tax, discount_amount INTO v_tax, v_discount
    FROM finance_invoices
    WHERE id = p_invoice_id;

    v_total := v_subtotal + COALESCE(v_tax, 0) - COALESCE(v_discount, 0);

    -- Update invoice
    UPDATE finance_invoices
    SET
        subtotal = v_subtotal,
        total = v_total,
        updated_at = NOW()
    WHERE id = p_invoice_id;

    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_invoice_total IS 'Calculate and update invoice total from line items';

-- Procedure: Move candidate through pipeline
CREATE OR REPLACE FUNCTION move_candidate_stage(
    p_application_id UUID,
    p_new_status TEXT,
    p_user_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_application RECORD;
    v_old_status TEXT;
BEGIN
    -- Get application
    SELECT * INTO v_application FROM ats_applications WHERE id = p_application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found';
    END IF;

    v_old_status := v_application.status;

    -- Update application status
    UPDATE ats_applications
    SET
        status = p_new_status,
        stage = p_new_status,
        notes = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_application_id;

    -- Update specific date fields based on status
    CASE p_new_status
        WHEN 'screening' THEN
            UPDATE ats_applications SET screening_date = NOW() WHERE id = p_application_id;
        WHEN 'interview' THEN
            UPDATE ats_applications SET interview_date = NOW() WHERE id = p_application_id;
        WHEN 'offer' THEN
            UPDATE ats_applications SET offer_date = NOW() WHERE id = p_application_id;
        WHEN 'hired' THEN
            UPDATE ats_applications SET hired_date = NOW() WHERE id = p_application_id;
        WHEN 'rejected' THEN
            UPDATE ats_applications SET rejected_date = NOW(), rejection_reason = p_notes WHERE id = p_application_id;
        ELSE
            NULL;
    END CASE;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, old_values, new_values)
    VALUES (
        v_application.tenant_id,
        p_user_id,
        'move_candidate_stage',
        'application',
        p_application_id,
        jsonb_build_object('status', v_old_status),
        jsonb_build_object('status', p_new_status, 'notes', p_notes)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION move_candidate_stage IS 'Move candidate through recruitment pipeline stages';

-- Procedure: Check user permissions
CREATE OR REPLACE FUNCTION user_has_permission(
    p_user_id UUID,
    p_tenant_id UUID,
    p_permission_key TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN core.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = p_user_id
        AND ur.tenant_id = p_tenant_id
        AND p.key = p_permission_key
    ) INTO v_has_permission;

    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION user_has_permission IS 'Check if user has specific permission in tenant';

-- Procedure: Get user roles in tenant
CREATE OR REPLACE FUNCTION get_user_roles(
    p_user_id UUID,
    p_tenant_id UUID
)
RETURNS TABLE (
    role_id UUID,
    role_key TEXT,
    role_label TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.key, r.label
    FROM user_roles ur
    JOIN core.roles r ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id
    AND ur.tenant_id = p_tenant_id;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_roles IS 'Get all roles for a user in a tenant';

-- Adding more comprehensive stored procedures

-- Procedure: Create offer from application
CREATE OR REPLACE FUNCTION create_offer_from_application(
    p_application_id UUID,
    p_salary DECIMAL(12, 2),
    p_start_date DATE,
    p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_application RECORD;
    v_offer_id UUID;
BEGIN
    -- Get application details
    SELECT * INTO v_application FROM ats_applications WHERE id = p_application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found';
    END IF;

    -- Create offer
    INSERT INTO ats_offers (
        tenant_id,
        application_id,
        candidate_id,
        job_id,
        offer_date,
        expiry_date,
        salary,
        start_date,
        status
    ) VALUES (
        v_application.tenant_id,
        p_application_id,
        v_application.candidate_id,
        v_application.job_id,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '7 days',
        p_salary,
        p_start_date,
        'pending'
    ) RETURNING id INTO v_offer_id;

    -- Update application status
    UPDATE ats_applications
    SET status = 'offer', offer_date = NOW()
    WHERE id = p_application_id;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_application.tenant_id,
        p_user_id,
        'create_offer',
        'offer',
        v_offer_id,
        jsonb_build_object('application_id', p_application_id, 'salary', p_salary)
    );

    RETURN v_offer_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Process expense reimbursement
CREATE OR REPLACE FUNCTION process_expense_reimbursement(
    p_expense_id UUID,
    p_approver_id UUID,
    p_approve BOOLEAN,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_expense RECORD;
BEGIN
    SELECT * INTO v_expense FROM finance_expenses WHERE id = p_expense_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Expense not found';
    END IF;

    IF p_approve THEN
        UPDATE finance_expenses
        SET
            status = 'approved',
            approved_by = p_approver_id,
            approved_at = NOW(),
            updated_at = NOW()
        WHERE id = p_expense_id;
    ELSE
        UPDATE finance_expenses
        SET
            status = 'rejected',
            approved_by = p_approver_id,
            approved_at = NOW(),
            rejection_reason = p_rejection_reason,
            updated_at = NOW()
        WHERE id = p_expense_id;
    END IF;

    -- Log audit
    INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_expense.tenant_id,
        p_approver_id,
        CASE WHEN p_approve THEN 'approve_expense' ELSE 'reject_expense' END,
        'expense',
        p_expense_id,
        jsonb_build_object('amount', v_expense.amount, 'reason', p_rejection_reason)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Execute automation rule
CREATE OR REPLACE FUNCTION execute_automation_rule(
    p_rule_id UUID,
    p_trigger_data JSONB
)
RETURNS UUID AS $$
DECLARE
    v_rule RECORD;
    v_execution_id UUID;
    v_start_time TIMESTAMPTZ;
    v_end_time TIMESTAMPTZ;
BEGIN
    v_start_time := clock_timestamp();

    SELECT * INTO v_rule FROM automation_rules WHERE id = p_rule_id AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rule not found or inactive';
    END IF;

    -- Create execution record
    INSERT INTO automation_executions (
        tenant_id,
        rule_id,
        execution_type,
        status,
        trigger_data,
        executed_at
    ) VALUES (
        v_rule.tenant_id,
        p_rule_id,
        'rule',
        'pending',
        p_trigger_data,
        NOW()
    ) RETURNING id INTO v_execution_id;

    -- Update rule execution count
    UPDATE automation_rules
    SET
        execution_count = execution_count + 1,
        last_executed_at = NOW()
    WHERE id = p_rule_id;

    v_end_time := clock_timestamp();

    -- Update execution with timing
    UPDATE automation_executions
    SET
        status = 'success',
        execution_time_ms = EXTRACT(MILLISECONDS FROM (v_end_time - v_start_time))::INTEGER
    WHERE id = v_execution_id;

    RETURN v_execution_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Send notification
CREATE OR REPLACE FUNCTION send_notification(
    p_tenant_id UUID,
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_notification_type TEXT DEFAULT 'info',
    p_channel TEXT DEFAULT 'in_app',
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_preference RECORD;
BEGIN
    -- Check user preferences
    SELECT * INTO v_preference
    FROM notification_preferences
    WHERE user_id = p_user_id
    AND channel = p_channel
    AND is_enabled = true;

    -- If no preference found or enabled, send notification
    IF FOUND OR NOT EXISTS (
        SELECT 1 FROM notification_preferences
        WHERE user_id = p_user_id AND channel = p_channel
    ) THEN
        INSERT INTO notifications (
            tenant_id,
            user_id,
            notification_type,
            channel,
            title,
            message,
            action_url
        ) VALUES (
            p_tenant_id,
            p_user_id,
            p_notification_type,
            p_channel,
            p_title,
            p_message,
            p_action_url
        ) RETURNING id INTO v_notification_id;

        RETURN v_notification_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Calculate project health
CREATE OR REPLACE FUNCTION calculate_project_health(p_project_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_project RECORD;
    v_budget_variance DECIMAL;
    v_schedule_variance INTEGER;
    v_risk_count INTEGER;
    v_health TEXT;
BEGIN
    SELECT * INTO v_project FROM projects WHERE id = p_project_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project not found';
    END IF;

    -- Calculate budget variance
    v_budget_variance := ((v_project.estimated_budget - v_project.actual_budget) / NULLIF(v_project.estimated_budget, 0)) * 100;

    -- Calculate schedule variance (days)
    v_schedule_variance := EXTRACT(DAY FROM (v_project.end_date - CURRENT_DATE));

    -- Count high-impact risks
    SELECT COUNT(*) INTO v_risk_count
    FROM project_risks
    WHERE project_id = p_project_id
    AND status NOT IN ('resolved', 'accepted')
    AND impact IN ('high', 'critical');

    -- Determine health status
    IF v_budget_variance < -10 OR v_schedule_variance < 0 OR v_risk_count > 3 THEN
        v_health := 'red';
    ELSIF v_budget_variance < 0 OR v_schedule_variance < 7 OR v_risk_count > 1 THEN
        v_health := 'yellow';
    ELSE
        v_health := 'green';
    END IF;

    -- Update project health
    UPDATE projects
    SET health_status = v_health, updated_at = NOW()
    WHERE id = p_project_id;

    RETURN v_health;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECTION 24: REALTIME CONFIGURATION
-- =====================================================

-- Enable realtime for key tables
-- Note: This requires Supabase Realtime to be enabled in your project

-- CRM Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE crm_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_activities;

-- ATS Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE ats_candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE ats_job_requisitions;
ALTER PUBLICATION supabase_realtime ADD TABLE ats_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE ats_interviews;

-- HRMS Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE hrms_employees;
ALTER PUBLICATION supabase_realtime ADD TABLE hrms_timesheets;

-- Finance Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE finance_invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE finance_payments;

-- Projects Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE project_resources;

-- Notifications Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- Adding realtime for new tables

ALTER PUBLICATION supabase_realtime ADD TABLE crm_quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE ats_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE ats_assessments;
ALTER PUBLICATION supabase_realtime ADD TABLE hrms_attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE hrms_leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE hrms_performance_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE finance_expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE project_risks;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE automation_executions;

COMMENT ON PUBLICATION supabase_realtime IS 'Realtime publication for live updates';

-- =====================================================
-- SECTION 25: ADDITIONAL HELPER FUNCTIONS
-- =====================================================

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_crm_pipeline_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ats_recruitment_funnel;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hrms_headcount;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_finance_revenue;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_talent_pipeline_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hrms_attendance_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_finance_expense_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_project_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_lms_learning_metrics;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_all_analytics_views IS 'Refreshes all materialized views for analytics';

-- Function to get tenant by slug
CREATE OR REPLACE FUNCTION get_tenant_by_slug(tenant_slug TEXT)
RETURNS UUID AS $$
DECLARE
  tenant_uuid UUID;
BEGIN
  SELECT id INTO tenant_uuid FROM tenants WHERE slug = tenant_slug;
  RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_tenant_by_slug IS 'Get tenant ID by slug';

-- Function to search candidates by skills
CREATE OR REPLACE FUNCTION search_candidates_by_skills(
    p_tenant_id UUID,
    p_skills TEXT[],
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    candidate_id UUID,
    full_name TEXT,
    email TEXT,
    matching_skills TEXT[],
    match_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.first_name || ' ' || c.last_name,
        c.email,
        ARRAY(SELECT unnest(c.skills) INTERSECT SELECT unnest(p_skills)),
        (CARDINALITY(ARRAY(SELECT unnest(c.skills) INTERSECT SELECT unnest(p_skills)))::DECIMAL /
         CARDINALITY(p_skills)::DECIMAL * 100) as score
    FROM ats_candidates c
    WHERE c.tenant_id = p_tenant_id
    AND c.skills && p_skills
    ORDER BY score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_candidates_by_skills IS 'Search candidates by matching skills with score';

-- Function to calculate employee tenure
CREATE OR REPLACE FUNCTION calculate_employee_tenure(p_employee_id UUID)
RETURNS INTERVAL AS $$
DECLARE
    v_hire_date DATE;
    v_term_date DATE;
BEGIN
    SELECT hire_date, termination_date INTO v_hire_date, v_term_date
    FROM hrms_employees
    WHERE id = p_employee_id;

    IF v_term_date IS NOT NULL THEN
        RETURN v_term_date - v_hire_date;
    ELSE
        RETURN CURRENT_DATE - v_hire_date;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION calculate_employee_tenure IS 'Calculate employee tenure in days';

-- Function to get dashboard KPIs
CREATE OR REPLACE FUNCTION get_dashboard_kpis(p_tenant_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_employees', (SELECT COUNT(*) FROM hrms_employees WHERE tenant_id = p_tenant_id AND status = 'active'),
        'total_candidates', (SELECT COUNT(*) FROM ats_candidates WHERE tenant_id = p_tenant_id),
        'open_positions', (SELECT COUNT(*) FROM ats_job_requisitions WHERE tenant_id = p_tenant_id AND status = 'open'),
        'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM finance_invoices WHERE tenant_id = p_tenant_id AND status = 'paid'), -- Corrected column name
        'pending_timesheets', (SELECT COUNT(*) FROM hrms_timesheets WHERE tenant_id = p_tenant_id AND status = 'submitted'),
        'active_projects', (SELECT COUNT(*) FROM projects WHERE tenant_id = p_tenant_id AND status = 'active')
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_kpis IS 'Get key performance indicators for dashboard';

-- Adding more helper functions

-- Function to get employee utilization
CREATE OR REPLACE FUNCTION get_employee_utilization(
    p_employee_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_total_hours DECIMAL(10,2);
    v_billable_hours DECIMAL(10,2);
    v_utilization DECIMAL(5,2);
BEGIN
    SELECT
        COALESCE(SUM(hours), 0),
        COALESCE(SUM(CASE WHEN is_billable THEN hours ELSE 0 END), 0)
    INTO v_total_hours, v_billable_hours
    FROM hrms_time_entries
    WHERE employee_id = p_employee_id
    AND entry_date BETWEEN p_start_date AND p_end_date;

    IF v_total_hours > 0 THEN
        v_utilization := (v_billable_hours / v_total_hours) * 100;
    ELSE
        v_utilization := 0;
    END IF;

    RETURN v_utilization;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get candidate pipeline stage duration
CREATE OR REPLACE FUNCTION get_candidate_stage_duration(p_application_id UUID)
RETURNS JSON AS $$
DECLARE
    v_app RECORD;
    v_result JSON;
BEGIN
    SELECT * INTO v_app FROM ats_applications WHERE id = p_application_id;

    SELECT json_build_object(
        'applied_to_screening', EXTRACT(DAY FROM (v_app.screening_date - v_app.applied_date)),
        'screening_to_interview', EXTRACT(DAY FROM (v_app.interview_date - v_app.screening_date)),
        'interview_to_offer', EXTRACT(DAY FROM (v_app.offer_date - v_app.interview_date)),
        'offer_to_hired', EXTRACT(DAY FROM (v_app.hired_date - v_app.offer_date)),
        'total_days', EXTRACT(DAY FROM (COALESCE(v_app.hired_date, CURRENT_DATE) - v_app.applied_date))
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate invoice aging
CREATE OR REPLACE FUNCTION get_invoice_aging(p_tenant_id UUID)
RETURNS TABLE (
    aging_bucket TEXT,
    invoice_count BIGINT,
    total_amount DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE
            WHEN CURRENT_DATE - due_date <= 0 THEN 'Current'
            WHEN CURRENT_DATE - due_date BETWEEN 1 AND 30 THEN '1-30 days'
            WHEN CURRENT_DATE - due_date BETWEEN 31 AND 60 THEN '31-60 days'
            WHEN CURRENT_DATE - due_date BETWEEN 61 AND 90 THEN '61-90 days'
            ELSE '90+ days'
        END as bucket,
        COUNT(*)::BIGINT,
        SUM(total_amount - amount_paid)
    FROM finance_invoices
    WHERE tenant_id = p_tenant_id
    AND status IN ('sent', 'viewed', 'partial', 'overdue')
    GROUP BY bucket
    ORDER BY
        CASE bucket
            WHEN 'Current' THEN 1
            WHEN '1-30 days' THEN 2
            WHEN '31-60 days' THEN 3
            WHEN '61-90 days' THEN 4
            ELSE 5
        END;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- COMPLETION
-- =====================================================

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NINO360 HRMS Database Setup Complete!';
  RAISE NOTICE 'VERSION 3.0.0 - PRODUCTION READY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Summary:';
  -- Updated extension count to 4 (removed pgvector)
  RAISE NOTICE '  - 4 extensions (uuid-ossp, pgcrypto, pg_trgm, pg_stat_statements)';
  RAISE NOTICE '  - 70+ tables across 14 modules';
  RAISE NOTICE '  - 150+ performance indexes';
  RAISE NOTICE '  - 30+ stored procedures and functions';
  RAISE NOTICE '  - 12 materialized views for analytics';
  RAISE NOTICE '  - Complete RLS policies for tenant isolation';
  RAISE NOTICE '  - Realtime enabled for all critical tables';
  RAISE NOTICE '  - Seed data for roles and permissions';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify all tables created: SELECT count(*) FROM information_schema.tables WHERE table_schema = ''public'';';
  RAISE NOTICE '  2. Check RLS policies: SELECT * FROM pg_policies;';
  RAISE NOTICE '  3. Refresh materialized views: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_crm_pipeline_metrics;';
  RAISE NOTICE '  4. (Optional) Install pgvector for AI embeddings: https://github.com/pgvector/pgvector';
  RAISE NOTICE '';
  RAISE NOTICE 'RAISE NOTICE ''✓ Database setup completed successfully!'';';
  RAISE NOTICE 'RAISE NOTICE '''''';';
  RAISE NOTICE 'RAISE NOTICE ''Summary:'';';
  RAISE NOTICE '  - 4 extensions (uuid-ossp, pgcrypto, pg_trgm, pg_stat_statements)';
  RAISE NOTICE '  - 70+ tables across 14 modules';
  RAISE NOTICE '  - 150+ performance indexes';
  RAISE NOTICE '  - 30+ stored procedures and functions';
  RAISE NOTICE '  - 12 materialized views for analytics';
  RAISE NOTICE '  - Complete RLS policies for tenant isolation';
  RAISE NOTICE '  - Realtime enabled for all critical tables';
  RAISE NOTICE '  - Seed data for roles and permissions';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify all tables created: SELECT count(*) FROM information_schema.tables WHERE table_schema = ''public'';';
  RAISE NOTICE '  2. Check RLS policies: SELECT * FROM pg_policies;';
  RAISE NOTICE '  3. Refresh materialized views: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_crm_pipeline_metrics;';
  RAISE NOTICE '  4. (Optional) Install pgvector for AI embeddings: https://github.com/pgvector/pgvector';
  RAISE NOTICE '';
END $$;
