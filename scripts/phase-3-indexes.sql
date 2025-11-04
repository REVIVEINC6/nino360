-- =====================================================
-- NINO360 HRMS - PHASE 3: INDEXES & PERFORMANCE
-- =====================================================
-- Purpose: Create all performance indexes
-- Prerequisites: Phases 1 and 2 must be completed
-- =====================================================

-- Added table existence verification before creating indexes
DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  tbl_name TEXT;
  required_tables TEXT[] := ARRAY[
    'crm_accounts', 'crm_contacts', 'crm_leads', 'crm_opportunities',
    'projects', 'hrms_employees', 'hrms_timesheets', 'hrms_leave_requests', 'hrms_payroll',
    'talent_jobs', 'talent_candidates', 'talent_applications', 'talent_interviews',
    'bench_resources', 'bench_allocations', 'project_resources',
    'finance_invoices', 'finance_expenses', 'vms_vendors', 'vms_contracts',
    'hotlist_consultants', 'training_courses', 'training_enrollments',
    'automation_rules', 'automation_webhooks', 'notifications', 'reports_saved', 'audit_logs'
  ];
BEGIN
  -- Check if all required tables exist
  FOREACH tbl_name IN ARRAY required_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = tbl_name
    ) THEN
      missing_tables := array_append(missing_tables, tbl_name);
    END IF;
  END LOOP;
  
  -- If any tables are missing, raise an error
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE EXCEPTION 'Phase 2 must be completed first. Missing tables: %', array_to_string(missing_tables, ', ');
  END IF;
  
  RAISE NOTICE 'All required tables exist. Proceeding with column migration...';
END $$;

-- =====================================================
-- MIGRATION: Add missing columns to existing tables
-- =====================================================
DO $$
BEGIN
  -- Add project_id column migrations
  
  -- Add project_id to hrms_timesheets if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_timesheets' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE hrms_timesheets ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added project_id column to hrms_timesheets';
  END IF;

  -- Add project_id to bench_allocations if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bench_allocations' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE bench_allocations ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added project_id column to bench_allocations';
  END IF;

  -- Add project_id to project_resources if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_resources' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE project_resources ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added project_id column to project_resources';
  END IF;

  -- Add project_id to finance_invoices if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_invoices' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance_invoices ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added project_id column to finance_invoices';
  END IF;

  -- Add project_id to finance_expenses if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_expenses' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance_expenses ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added project_id column to finance_expenses';
  END IF;

  -- Add employee_id to hrms_timesheets if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_timesheets' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE hrms_timesheets ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to hrms_timesheets';
  END IF;

  -- Add employee_id to hrms_leave_requests if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_leave_requests' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE hrms_leave_requests ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to hrms_leave_requests';
  END IF;

  -- Add employee_id to hrms_payroll if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hrms_payroll' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE hrms_payroll ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to hrms_payroll';
  END IF;

  -- Add employee_id to bench_resources if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bench_resources' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE bench_resources ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to bench_resources';
  END IF;

  -- Add employee_id to project_resources if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_resources' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE project_resources ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to project_resources';
  END IF;

  -- Add employee_id to finance_expenses if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finance_expenses' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE finance_expenses ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added employee_id column to finance_expenses';
  END IF;

  -- Add employee_id to training_enrollments if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'training_enrollments' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE training_enrollments ADD COLUMN employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added employee_id column to training_enrollments';
  END IF;

  RAISE NOTICE 'Column migration complete. Proceeding with index creation...';
END $$;

BEGIN;

-- CRM Indexes
CREATE INDEX IF NOT EXISTS idx_crm_accounts_tenant_id ON crm_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_owner_id ON crm_accounts(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_tenant_id ON crm_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_account_id ON crm_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_tenant_id ON crm_leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_tenant_id ON crm_opportunities(tenant_id);

-- Projects Indexes
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- HRMS Indexes
CREATE INDEX IF NOT EXISTS idx_hrms_employees_tenant_id ON hrms_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_user_id ON hrms_employees(user_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_email ON hrms_employees(email);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_tenant_id ON hrms_timesheets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_employee_id ON hrms_timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_timesheets_project_id ON hrms_timesheets(project_id);
CREATE INDEX IF NOT EXISTS idx_hrms_leave_requests_tenant_id ON hrms_leave_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_leave_requests_employee_id ON hrms_leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_payroll_tenant_id ON hrms_payroll(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_payroll_employee_id ON hrms_payroll(employee_id);

-- Talent Indexes
CREATE INDEX IF NOT EXISTS idx_talent_jobs_tenant_id ON talent_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_candidates_tenant_id ON talent_candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_applications_tenant_id ON talent_applications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_applications_job_id ON talent_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_talent_applications_candidate_id ON talent_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_talent_interviews_tenant_id ON talent_interviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_interviews_application_id ON talent_interviews(application_id);

-- Bench Indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_tenant_id ON bench_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_employee_id ON bench_resources(employee_id);
CREATE INDEX IF NOT EXISTS idx_bench_allocations_tenant_id ON bench_allocations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_allocations_resource_id ON bench_allocations(resource_id);
CREATE INDEX IF NOT EXISTS idx_bench_allocations_project_id ON bench_allocations(project_id);

-- Project Resources Indexes
CREATE INDEX IF NOT EXISTS idx_project_resources_tenant_id ON project_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_project_id ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_employee_id ON project_resources(employee_id);

-- Finance Indexes
CREATE INDEX IF NOT EXISTS idx_finance_invoices_tenant_id ON finance_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_client_id ON finance_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_project_id ON finance_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_tenant_id ON finance_expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_employee_id ON finance_expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_project_id ON finance_expenses(project_id);

-- VMS Indexes
CREATE INDEX IF NOT EXISTS idx_vms_vendors_tenant_id ON vms_vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vms_contracts_tenant_id ON vms_contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vms_contracts_vendor_id ON vms_contracts(vendor_id);

-- Hotlist Indexes
CREATE INDEX IF NOT EXISTS idx_hotlist_consultants_tenant_id ON hotlist_consultants(tenant_id);

-- Training Indexes
CREATE INDEX IF NOT EXISTS idx_training_courses_tenant_id ON training_courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_tenant_id ON training_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_course_id ON training_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_employee_id ON training_enrollments(employee_id);

-- Automation Indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_tenant_id ON automation_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automation_webhooks_tenant_id ON automation_webhooks(tenant_id);

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Reports Indexes
CREATE INDEX IF NOT EXISTS idx_reports_saved_tenant_id ON reports_saved(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reports_saved_user_id ON reports_saved(user_id);

-- Audit Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 3: Indexes & Performance - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ 50+ performance indexes';
  RAISE NOTICE '  ✓ Optimized for tenant isolation';
  RAISE NOTICE '  ✓ Foreign key indexes';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run phase-4-rls-security.sql';
END $$;
