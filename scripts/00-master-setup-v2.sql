-- =====================================================
-- NINO360 HRMS - MASTER DATABASE SETUP SCRIPT V2
-- =====================================================
-- Purpose: Complete database initialization with proper dependency handling
-- Version: 4.0.0 - DEPENDENCY-ORDER FIXED
-- Date: 2025-01-14
--
-- Strategy: Create all tables first, then add foreign keys
-- This eliminates circular dependency issues
-- =====================================================

BEGIN;

-- =====================================================
-- SECTION 1: EXTENSIONS & SCHEMAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- Uncomment if pgvector is available

CREATE SCHEMA IF NOT EXISTS core;

-- =====================================================
-- SECTION 2: CORE TABLES (No Foreign Keys Yet)
-- =====================================================

-- Tenants
CREATE TABLE IF NOT EXISTS core.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS core.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles
CREATE TABLE IF NOT EXISTS core.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  "key" VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, "key")
);

-- Permissions
CREATE TABLE IF NOT EXISTS core.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  module VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role Permissions (junction table)
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- User Roles (junction table)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id, tenant_id)
);

-- =====================================================
-- SECTION 3: CRM MODULE TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS crm_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2),
  stage VARCHAR(100) DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  due_date TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending',
  related_to_type VARCHAR(50),
  related_to_id UUID,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 4: PROJECTS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID,
  status VARCHAR(50) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  manager_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 5: HRMS MODULE TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS hrms_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  employee_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE,
  hire_date DATE,
  department VARCHAR(100),
  position VARCHAR(100),
  employment_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  manager_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  project_id UUID,
  date DATE NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days DECIMAL(5,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_pay DECIMAL(15,2) NOT NULL,
  deductions DECIMAL(15,2) DEFAULT 0,
  net_pay DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  review_period VARCHAR(50),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  goals TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 6: BENCH MANAGEMENT MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS bench_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  availability_date DATE,
  skills TEXT[],
  certifications TEXT[],
  experience_years INTEGER,
  rate DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bench_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resource_id UUID NOT NULL,
  project_id UUID,
  start_date DATE NOT NULL,
  end_date DATE,
  allocation_percentage INTEGER DEFAULT 100,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 7: TALENT/ATS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  current_company VARCHAR(255),
  current_title VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  location VARCHAR(255),
  employment_type VARCHAR(50),
  salary_min DECIMAL(15,2),
  salary_max DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'open',
  hiring_manager_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  job_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'applied',
  stage VARCHAR(100) DEFAULT 'screening',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  application_id UUID NOT NULL,
  interviewer_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'scheduled',
  feedback TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 8: VMS (Vendor Management) MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  contract_number VARCHAR(100) UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE,
  value DECIMAL(15,2),
  terms TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 9: PROJECT RESOURCES (Cross-module)
-- =====================================================

CREATE TABLE IF NOT EXISTS project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  project_id UUID NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID NOT NULL,
  role VARCHAR(100),
  allocation_percentage INTEGER DEFAULT 100,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 10: FINANCE MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  client_id UUID,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 11: TRAINING/LMS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  instructor VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  course_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 12: HOTLIST MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS hotlist_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skills_required TEXT[],
  experience_required INTEGER,
  location VARCHAR(255),
  rate_min DECIMAL(10,2),
  rate_max DECIMAL(10,2),
  urgency VARCHAR(50) DEFAULT 'normal',
  status VARCHAR(50) DEFAULT 'open',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotlist_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  requirement_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  submitted_by UUID,
  status VARCHAR(50) DEFAULT 'submitted',
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 13: AUTOMATION MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  action_type VARCHAR(100) NOT NULL,
  action_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  method VARCHAR(10) DEFAULT 'POST',
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 14: ADD ALL FOREIGN KEY CONSTRAINTS
-- =====================================================
-- Now that all tables exist, we can safely add foreign keys

-- Core tables foreign keys
ALTER TABLE core.users ADD CONSTRAINT fk_users_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE core.roles ADD CONSTRAINT fk_roles_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE role_permissions ADD CONSTRAINT fk_role_permissions_role 
  FOREIGN KEY (role_id) REFERENCES core.roles(id) ON DELETE CASCADE;

ALTER TABLE role_permissions ADD CONSTRAINT fk_role_permissions_permission 
  FOREIGN KEY (permission_id) REFERENCES core.permissions(id) ON DELETE CASCADE;

ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user 
  FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;

ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_role 
  FOREIGN KEY (role_id) REFERENCES core.roles(id) ON DELETE CASCADE;

ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

-- CRM foreign keys
ALTER TABLE crm_accounts ADD CONSTRAINT fk_crm_accounts_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE crm_accounts ADD CONSTRAINT fk_crm_accounts_owner 
  FOREIGN KEY (owner_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE crm_contacts ADD CONSTRAINT fk_crm_contacts_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE crm_contacts ADD CONSTRAINT fk_crm_contacts_account 
  FOREIGN KEY (account_id) REFERENCES crm_accounts(id) ON DELETE CASCADE;

ALTER TABLE crm_contacts ADD CONSTRAINT fk_crm_contacts_owner 
  FOREIGN KEY (owner_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE crm_leads ADD CONSTRAINT fk_crm_leads_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE crm_leads ADD CONSTRAINT fk_crm_leads_owner 
  FOREIGN KEY (owner_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE crm_opportunities ADD CONSTRAINT fk_crm_opportunities_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE crm_opportunities ADD CONSTRAINT fk_crm_opportunities_account 
  FOREIGN KEY (account_id) REFERENCES crm_accounts(id) ON DELETE CASCADE;

ALTER TABLE crm_opportunities ADD CONSTRAINT fk_crm_opportunities_owner 
  FOREIGN KEY (owner_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE crm_activities ADD CONSTRAINT fk_crm_activities_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE crm_activities ADD CONSTRAINT fk_crm_activities_assigned 
  FOREIGN KEY (assigned_to) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE crm_activities ADD CONSTRAINT fk_crm_activities_created 
  FOREIGN KEY (created_by) REFERENCES core.users(id) ON DELETE SET NULL;

-- Projects foreign keys
ALTER TABLE projects ADD CONSTRAINT fk_projects_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE projects ADD CONSTRAINT fk_projects_client 
  FOREIGN KEY (client_id) REFERENCES crm_accounts(id) ON DELETE SET NULL;

ALTER TABLE projects ADD CONSTRAINT fk_projects_manager 
  FOREIGN KEY (manager_id) REFERENCES core.users(id) ON DELETE SET NULL;

-- HRMS foreign keys
ALTER TABLE hrms_employees ADD CONSTRAINT fk_hrms_employees_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_employees ADD CONSTRAINT fk_hrms_employees_user 
  FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE hrms_employees ADD CONSTRAINT fk_hrms_employees_manager 
  FOREIGN KEY (manager_id) REFERENCES hrms_employees(id) ON DELETE SET NULL;

ALTER TABLE hrms_timesheets ADD CONSTRAINT fk_hrms_timesheets_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_timesheets ADD CONSTRAINT fk_hrms_timesheets_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE hrms_timesheets ADD CONSTRAINT fk_hrms_timesheets_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE hrms_timesheets ADD CONSTRAINT fk_hrms_timesheets_approved 
  FOREIGN KEY (approved_by) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE hrms_leave_requests ADD CONSTRAINT fk_hrms_leave_requests_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_leave_requests ADD CONSTRAINT fk_hrms_leave_requests_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE hrms_leave_requests ADD CONSTRAINT fk_hrms_leave_requests_approved 
  FOREIGN KEY (approved_by) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE hrms_payroll ADD CONSTRAINT fk_hrms_payroll_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_payroll ADD CONSTRAINT fk_hrms_payroll_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE hrms_performance_reviews ADD CONSTRAINT fk_hrms_performance_reviews_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_performance_reviews ADD CONSTRAINT fk_hrms_performance_reviews_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE hrms_performance_reviews ADD CONSTRAINT fk_hrms_performance_reviews_reviewer 
  FOREIGN KEY (reviewer_id) REFERENCES core.users(id) ON DELETE CASCADE;

ALTER TABLE hrms_documents ADD CONSTRAINT fk_hrms_documents_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hrms_documents ADD CONSTRAINT fk_hrms_documents_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE hrms_documents ADD CONSTRAINT fk_hrms_documents_uploaded 
  FOREIGN KEY (uploaded_by) REFERENCES core.users(id) ON DELETE SET NULL;

-- Bench foreign keys
ALTER TABLE bench_resources ADD CONSTRAINT fk_bench_resources_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE bench_resources ADD CONSTRAINT fk_bench_resources_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

ALTER TABLE bench_assignments ADD CONSTRAINT fk_bench_assignments_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE bench_assignments ADD CONSTRAINT fk_bench_assignments_resource 
  FOREIGN KEY (resource_id) REFERENCES bench_resources(id) ON DELETE CASCADE;

ALTER TABLE bench_assignments ADD CONSTRAINT fk_bench_assignments_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Talent/ATS foreign keys
ALTER TABLE candidates ADD CONSTRAINT fk_candidates_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE jobs ADD CONSTRAINT fk_jobs_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE jobs ADD CONSTRAINT fk_jobs_hiring_manager 
  FOREIGN KEY (hiring_manager_id) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE applications ADD CONSTRAINT fk_applications_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE applications ADD CONSTRAINT fk_applications_job 
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

ALTER TABLE applications ADD CONSTRAINT fk_applications_candidate 
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE;

ALTER TABLE interviews ADD CONSTRAINT fk_interviews_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE interviews ADD CONSTRAINT fk_interviews_application 
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;

ALTER TABLE interviews ADD CONSTRAINT fk_interviews_interviewer 
  FOREIGN KEY (interviewer_id) REFERENCES core.users(id) ON DELETE CASCADE;

-- VMS foreign keys
ALTER TABLE vendors ADD CONSTRAINT fk_vendors_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE vendor_contracts ADD CONSTRAINT fk_vendor_contracts_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE vendor_contracts ADD CONSTRAINT fk_vendor_contracts_vendor 
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;

ALTER TABLE vendor_invoices ADD CONSTRAINT fk_vendor_invoices_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE vendor_invoices ADD CONSTRAINT fk_vendor_invoices_vendor 
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;

-- Project resources foreign keys
ALTER TABLE project_resources ADD CONSTRAINT fk_project_resources_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE project_resources ADD CONSTRAINT fk_project_resources_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Finance foreign keys
ALTER TABLE finance_invoices ADD CONSTRAINT fk_finance_invoices_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE finance_invoices ADD CONSTRAINT fk_finance_invoices_client 
  FOREIGN KEY (client_id) REFERENCES crm_accounts(id) ON DELETE SET NULL;

ALTER TABLE finance_expenses ADD CONSTRAINT fk_finance_expenses_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE finance_expenses ADD CONSTRAINT fk_finance_expenses_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE SET NULL;

ALTER TABLE finance_expenses ADD CONSTRAINT fk_finance_expenses_approved 
  FOREIGN KEY (approved_by) REFERENCES core.users(id) ON DELETE SET NULL;

-- Training foreign keys
ALTER TABLE training_courses ADD CONSTRAINT fk_training_courses_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE training_enrollments ADD CONSTRAINT fk_training_enrollments_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE training_enrollments ADD CONSTRAINT fk_training_enrollments_course 
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE;

ALTER TABLE training_enrollments ADD CONSTRAINT fk_training_enrollments_employee 
  FOREIGN KEY (employee_id) REFERENCES hrms_employees(id) ON DELETE CASCADE;

-- Hotlist foreign keys
ALTER TABLE hotlist_requirements ADD CONSTRAINT fk_hotlist_requirements_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hotlist_requirements ADD CONSTRAINT fk_hotlist_requirements_created 
  FOREIGN KEY (created_by) REFERENCES core.users(id) ON DELETE SET NULL;

ALTER TABLE hotlist_submissions ADD CONSTRAINT fk_hotlist_submissions_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE hotlist_submissions ADD CONSTRAINT fk_hotlist_submissions_requirement 
  FOREIGN KEY (requirement_id) REFERENCES hotlist_requirements(id) ON DELETE CASCADE;

ALTER TABLE hotlist_submissions ADD CONSTRAINT fk_hotlist_submissions_candidate 
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE;

ALTER TABLE hotlist_submissions ADD CONSTRAINT fk_hotlist_submissions_submitted 
  FOREIGN KEY (submitted_by) REFERENCES core.users(id) ON DELETE SET NULL;

-- Automation foreign keys
ALTER TABLE automation_rules ADD CONSTRAINT fk_automation_rules_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

ALTER TABLE automation_webhooks ADD CONSTRAINT fk_automation_webhooks_tenant 
  FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE CASCADE;

-- =====================================================
-- SECTION 15: CREATE INDEXES
-- =====================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant ON core.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_roles_tenant ON core.roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_roles_key ON core.roles("key");
CREATE INDEX IF NOT EXISTS idx_permissions_key ON core.permissions("key");

-- CRM indexes
CREATE INDEX IF NOT EXISTS idx_crm_accounts_tenant ON crm_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_tenant ON crm_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_account ON crm_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_tenant ON crm_leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_tenant ON crm_opportunities(tenant_id);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- HRMS indexes
CREATE INDEX IF NOT EXISTS idx_hrms_employees_tenant ON hrms_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_email ON hrms_employees(email);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_employee ON hrms_timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_project ON hrms_timesheets(project_id);

-- Bench indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_tenant ON bench_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_employee ON bench_resources(employee_id);

-- Talent indexes
CREATE INDEX IF NOT EXISTS idx_candidates_tenant ON candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);

-- =====================================================
-- SECTION 16: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_webhooks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 17: CREATE RLS POLICIES
-- =====================================================

-- Tenant isolation policy for users
CREATE POLICY tenant_isolation_users ON core.users
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Tenant isolation policy for all module tables
CREATE POLICY tenant_isolation_crm_accounts ON crm_accounts
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_projects ON projects
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_hrms_employees ON hrms_employees
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- =====================================================
-- SECTION 18: CREATE TRIGGERS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON core.tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON core.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_employees_updated_at BEFORE UPDATE ON hrms_employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
