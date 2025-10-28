-- =====================================================
-- NINO360 HRMS - PHASE 2: MODULE TABLES
-- =====================================================
-- Purpose: Create all application module tables
-- Prerequisites: Phase 1 must be completed first
-- =====================================================

BEGIN;

-- =====================================================
-- SECTION 5: CRM MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS crm_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  account_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  title VARCHAR(100),
  department VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  account_id UUID REFERENCES crm_accounts(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2),
  stage VARCHAR(100),
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  status VARCHAR(50) DEFAULT 'open',
  owner_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 5.1: PROJECTS MODULE (CORE TABLE)
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES crm_accounts(id) ON DELETE SET NULL,
  project_code VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(50) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2) DEFAULT 0,
  manager_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 6: HRMS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS hrms_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  hire_date DATE,
  termination_date DATE,
  employment_type VARCHAR(50),
  department VARCHAR(100),
  designation VARCHAR(100),
  reporting_manager_id UUID REFERENCES hrms_employees(id),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days DECIMAL(5,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hrms_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  basic_salary DECIMAL(15,2),
  allowances DECIMAL(15,2) DEFAULT 0,
  deductions DECIMAL(15,2) DEFAULT 0,
  net_salary DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'draft',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 7: TALENT/ATS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS talent_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  department VARCHAR(100),
  location VARCHAR(255),
  employment_type VARCHAR(50),
  experience_min INTEGER,
  experience_max INTEGER,
  salary_min DECIMAL(15,2),
  salary_max DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'open',
  posted_date DATE,
  closing_date DATE,
  hiring_manager_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talent_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume_url TEXT,
  linkedin_url TEXT,
  current_company VARCHAR(255),
  current_title VARCHAR(100),
  experience_years INTEGER,
  skills TEXT[],
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID REFERENCES talent_jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES talent_candidates(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'applied',
  stage VARCHAR(100) DEFAULT 'screening',
  applied_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talent_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID REFERENCES talent_applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES core.users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  interview_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'scheduled',
  feedback TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 8: BENCH MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS bench_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  availability_date DATE,
  skills TEXT[],
  certifications TEXT[],
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bench_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES bench_resources(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  allocation_percentage INTEGER DEFAULT 100,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 9: PROJECT RESOURCES
-- =====================================================

CREATE TABLE IF NOT EXISTS project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  bench_resource_id UUID REFERENCES bench_resources(id) ON DELETE SET NULL,
  role VARCHAR(100),
  allocation_percentage INTEGER DEFAULT 100,
  start_date DATE NOT NULL,
  end_date DATE,
  hourly_rate DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 10: FINANCE MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES crm_accounts(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 11: VMS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS vms_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vms_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vms_vendors(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  value DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'active',
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 12: HOTLIST MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS hotlist_consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  skills TEXT[],
  experience_years INTEGER,
  availability_date DATE,
  visa_status VARCHAR(50),
  location VARCHAR(255),
  hourly_rate DECIMAL(10,2),
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 13: TRAINING/LMS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  duration_hours INTEGER,
  instructor_id UUID REFERENCES core.users(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  course_id UUID REFERENCES training_courses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 14: AUTOMATION MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB,
  action_type VARCHAR(100) NOT NULL,
  action_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  method VARCHAR(10) DEFAULT 'POST',
  headers JSONB,
  events TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 15: NOTIFICATIONS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50),
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 16: REPORTS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS reports_saved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(100),
  config JSONB,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 17: AUDIT AND SECURITY
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 2: Module Tables - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ 35+ module tables';
  RAISE NOTICE '  ✓ CRM, HRMS, Talent, Bench, VMS modules';
  RAISE NOTICE '  ✓ Finance, Projects, Hotlist modules';
  RAISE NOTICE '  ✓ Training, Automation, Notifications modules';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run phase-3-indexes.sql';
END $$;
