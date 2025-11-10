-- =====================================================
-- NINO360 HRMS - PHASE 4: RLS & SECURITY
-- =====================================================
-- Purpose: Enable RLS and create security policies
-- Prerequisites: Phases 1, 2, and 3 must be completed
-- =====================================================

BEGIN;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE crm_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

ALTER TABLE hrms_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_payroll ENABLE ROW LEVEL SECURITY;

ALTER TABLE talent_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_interviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE bench_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench_allocations ENABLE ROW LEVEL SECURITY;

ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE vms_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms_contracts ENABLE ROW LEVEL SECURITY;

ALTER TABLE hotlist_consultants ENABLE ROW LEVEL SECURITY;

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_webhooks ENABLE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports_saved ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES (Tenant Isolation)
-- =====================================================

-- Core Tables Policies
CREATE POLICY tenant_isolation_policy ON core.tenants
  FOR ALL USING (id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON core.users
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON core.roles
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- CRM Policies
CREATE POLICY tenant_isolation_policy ON crm_accounts
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON crm_contacts
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON crm_leads
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON crm_opportunities
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Projects Policies
CREATE POLICY tenant_isolation_policy ON projects
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON project_resources
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- HRMS Policies
CREATE POLICY tenant_isolation_policy ON hrms_employees
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON hrms_timesheets
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON hrms_leave_requests
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON hrms_payroll
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Talent Policies
CREATE POLICY tenant_isolation_policy ON talent_jobs
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON talent_candidates
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON talent_applications
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON talent_interviews
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Bench Policies
CREATE POLICY tenant_isolation_policy ON bench_resources
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON bench_allocations
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Finance Policies
CREATE POLICY tenant_isolation_policy ON finance_invoices
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON finance_expenses
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- VMS Policies
CREATE POLICY tenant_isolation_policy ON vms_vendors
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON vms_contracts
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Hotlist Policies
CREATE POLICY tenant_isolation_policy ON hotlist_consultants
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Training Policies
CREATE POLICY tenant_isolation_policy ON training_courses
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON training_enrollments
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Automation Policies
CREATE POLICY tenant_isolation_policy ON automation_rules
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON automation_webhooks
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Notifications Policies
CREATE POLICY tenant_isolation_policy ON notifications
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Reports Policies
CREATE POLICY tenant_isolation_policy ON reports_saved
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Audit Policies
CREATE POLICY tenant_isolation_policy ON audit_logs
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 4: RLS & Security - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Configured:';
  RAISE NOTICE '  ✓ RLS enabled on 30+ tables';
  RAISE NOTICE '  ✓ Tenant isolation policies';
  RAISE NOTICE '  ✓ Row-level security active';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run phase-5-functions-triggers.sql';
END $$;
