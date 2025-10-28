-- ============================================================================
-- HRMS Assignments Schema
-- Manages employee project/client assignments with rates and utilization
-- ============================================================================

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  role_title TEXT NOT NULL,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  allocation_percent INTEGER NOT NULL CHECK (allocation_percent BETWEEN 1 AND 100),
  schedule JSONB DEFAULT '{}',
  rate JSONB DEFAULT '{}',
  rate_type TEXT CHECK (rate_type IN ('hourly', 'daily', 'monthly', 'fixed')),
  currency TEXT DEFAULT 'USD',
  billable BOOLEAN DEFAULT false,
  timesheet_policy JSONB DEFAULT '{}',
  cost_center TEXT,
  billing_code TEXT,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'planned', 'ended')),
  ai_utilization_score DECIMAL(5,2),
  ai_revenue_forecast DECIMAL(12,2),
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Assignment rate history
CREATE TABLE IF NOT EXISTS assignment_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  effective_date DATE NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('hourly', 'daily', 'monthly', 'fixed')),
  value DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  overtime_rule JSONB DEFAULT '{}',
  notes TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Assignment documents
CREATE TABLE IF NOT EXISTS assignment_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  ai_extracted_data JSONB DEFAULT '{}',
  blockchain_hash TEXT
);

-- Assignment utilization tracking
CREATE TABLE IF NOT EXISTS assignment_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  planned_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2),
  billable_hours DECIMAL(8,2),
  utilization_percent DECIMAL(5,2),
  revenue_generated DECIMAL(12,2),
  cost DECIMAL(12,2),
  margin_percent DECIMAL(5,2),
  ai_efficiency_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment conflicts/overlaps
CREATE TABLE IF NOT EXISTS assignment_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  conflicting_assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('overlap', 'over_allocation', 'availability')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  ai_suggested_resolution TEXT
);

-- Assignment milestones
CREATE TABLE IF NOT EXISTS assignment_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  deliverables JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_tenant ON assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_assignments_employee ON assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_assignments_client ON assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_assignments_project ON assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_dates ON assignments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_assignment_rates_assignment ON assignment_rates(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_rates_effective ON assignment_rates(effective_date);
CREATE INDEX IF NOT EXISTS idx_assignment_docs_assignment ON assignment_docs(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_utilization_assignment ON assignment_utilization(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_utilization_period ON assignment_utilization(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_assignment_conflicts_assignment ON assignment_conflicts(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_milestones_assignment ON assignment_milestones(assignment_id);

-- RLS Policies
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY assignments_tenant_isolation ON assignments FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY assignment_rates_tenant_isolation ON assignment_rates FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY assignment_docs_tenant_isolation ON assignment_docs FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY assignment_utilization_tenant_isolation ON assignment_utilization FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY assignment_conflicts_tenant_isolation ON assignment_conflicts FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY assignment_milestones_tenant_isolation ON assignment_milestones FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Triggers
CREATE OR REPLACE FUNCTION update_assignment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignments_updated_at BEFORE UPDATE ON assignments
FOR EACH ROW EXECUTE FUNCTION update_assignment_updated_at();

-- Function to detect assignment overlaps
CREATE OR REPLACE FUNCTION fn_detect_overlap(
  p_tenant_id UUID,
  p_employee_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  v_overlap_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_overlap_count
  FROM assignments
  WHERE tenant_id = p_tenant_id
    AND employee_id = p_employee_id
    AND status = 'active'
    AND (
      (p_start_date BETWEEN start_date AND COALESCE(end_date, '9999-12-31'))
      OR (COALESCE(p_end_date, '9999-12-31') BETWEEN start_date AND COALESCE(end_date, '9999-12-31'))
      OR (start_date BETWEEN p_start_date AND COALESCE(p_end_date, '9999-12-31'))
    );
  
  RETURN v_overlap_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Sample data
INSERT INTO assignments (tenant_id, employee_id, role_title, start_date, allocation_percent, rate_type, billable, status, ai_utilization_score, ai_revenue_forecast)
SELECT 
  t.id,
  e.id,
  'Senior Developer',
  CURRENT_DATE - INTERVAL '6 months',
  80,
  'hourly',
  true,
  'active',
  85.5,
  125000.00
FROM tenants t
CROSS JOIN LATERAL (
  SELECT id FROM employees WHERE tenant_id = t.id LIMIT 1
) e
LIMIT 5;

COMMENT ON TABLE assignments IS 'Employee project and client assignments with rates and utilization tracking';
COMMENT ON TABLE assignment_rates IS 'Historical rate changes for assignments with blockchain verification';
COMMENT ON TABLE assignment_docs IS 'Documents related to assignments (SOWs, contracts, etc.)';
COMMENT ON TABLE assignment_utilization IS 'Utilization and revenue tracking per assignment period';
COMMENT ON TABLE assignment_conflicts IS 'Detected conflicts and overlaps between assignments';
COMMENT ON TABLE assignment_milestones IS 'Project milestones and deliverables for assignments';
