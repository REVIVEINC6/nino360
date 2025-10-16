-- =====================================================
-- NINO360 HRMS - PHASE 5: FUNCTIONS & TRIGGERS
-- =====================================================
-- Purpose: Create stored procedures and triggers
-- Prerequisites: Phases 1-4 must be completed
-- =====================================================

BEGIN;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
DROP TRIGGER IF EXISTS update_tenants_updated_at ON core.tenants;
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON core.tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON core.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON core.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON core.roles;
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON core.roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_accounts_updated_at ON crm_accounts;
CREATE TRIGGER update_crm_accounts_updated_at BEFORE UPDATE ON crm_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_contacts_updated_at ON crm_contacts;
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hrms_employees_updated_at ON hrms_employees;
CREATE TRIGGER update_hrms_employees_updated_at BEFORE UPDATE ON hrms_employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hrms_timesheets_updated_at ON hrms_timesheets;
CREATE TRIGGER update_hrms_timesheets_updated_at BEFORE UPDATE ON hrms_timesheets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BUSINESS LOGIC FUNCTIONS
-- =====================================================

-- Function to calculate project utilization
CREATE OR REPLACE FUNCTION calculate_project_utilization(project_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_hours DECIMAL;
  allocated_hours DECIMAL;
BEGIN
  SELECT COALESCE(SUM(hours), 0) INTO total_hours
  FROM hrms_timesheets
  WHERE project_id = project_uuid;
  
  -- Assuming 8 hours per day per resource
  SELECT COALESCE(COUNT(*) * 8 * 30, 0) INTO allocated_hours
  FROM project_resources
  WHERE project_id = project_uuid AND status = 'active';
  
  IF allocated_hours > 0 THEN
    RETURN (total_hours / allocated_hours) * 100;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get employee leave balance
CREATE OR REPLACE FUNCTION get_leave_balance(employee_uuid UUID, leave_type_param VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
  total_allocated DECIMAL := 20; -- Default annual leave
  used_days DECIMAL;
BEGIN
  SELECT COALESCE(SUM(days), 0) INTO used_days
  FROM hrms_leave_requests
  WHERE employee_id = employee_uuid 
    AND leave_type = leave_type_param
    AND status = 'approved'
    AND EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN total_allocated - used_days;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate invoice total
CREATE OR REPLACE FUNCTION calculate_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount = NEW.subtotal + NEW.tax_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_invoice_total_trigger ON finance_invoices;
CREATE TRIGGER calculate_invoice_total_trigger
BEFORE INSERT OR UPDATE ON finance_invoices
FOR EACH ROW EXECUTE FUNCTION calculate_invoice_total();

COMMIT;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 5: Functions & Triggers - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ Updated_at triggers for all tables';
  RAISE NOTICE '  ✓ Business logic functions';
  RAISE NOTICE '  ✓ Calculation triggers';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run phase-6-seed-data.sql';
END $$;
