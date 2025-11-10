-- ============================================================================
-- HRMS Timesheets Schema
-- Comprehensive timesheet management with AI insights and compliance tracking
-- ============================================================================

-- Timesheet Policies
CREATE TABLE IF NOT EXISTS hr.timesheet_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  
  -- Policy Rules
  min_hours_per_day DECIMAL(4,2) DEFAULT 0,
  max_hours_per_day DECIMAL(4,2) DEFAULT 24,
  min_hours_per_week DECIMAL(5,2) DEFAULT 0,
  max_hours_per_week DECIMAL(5,2) DEFAULT 168,
  require_assignment BOOLEAN DEFAULT true,
  require_task_code BOOLEAN DEFAULT false,
  allow_future_entries BOOLEAN DEFAULT false,
  submission_deadline_days INTEGER DEFAULT 7,
  
  -- Overtime Rules
  overtime_threshold_daily DECIMAL(4,2) DEFAULT 8,
  overtime_threshold_weekly DECIMAL(5,2) DEFAULT 40,
  overtime_multiplier DECIMAL(3,2) DEFAULT 1.5,
  
  -- AI Configuration
  ai_anomaly_detection BOOLEAN DEFAULT true,
  ai_fraud_detection BOOLEAN DEFAULT true,
  ai_compliance_check BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(tenant_id, name)
);

-- Timesheets
CREATE TABLE IF NOT EXISTS hr.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  -- Period
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'LOCKED')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approver_id UUID REFERENCES hr.employees(id),
  
  -- Totals
  total_hours DECIMAL(6,2) DEFAULT 0,
  billable_hours DECIMAL(6,2) DEFAULT 0,
  overtime_hours DECIMAL(6,2) DEFAULT 0,
  
  -- AI Insights
  ai_anomaly_score DECIMAL(5,2),
  ai_fraud_risk VARCHAR(20) CHECK (ai_fraud_risk IN ('low', 'medium', 'high')),
  ai_compliance_status VARCHAR(20) CHECK (ai_compliance_status IN ('compliant', 'warning', 'violation')),
  ai_insights JSONB,
  
  -- Blockchain
  blockchain_hash VARCHAR(66),
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_verified_at TIMESTAMPTZ,
  
  -- Notes
  notes TEXT,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(employee_id, week_start)
);

-- Timesheet Entries
CREATE TABLE IF NOT EXISTS hr.timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID NOT NULL REFERENCES hr.timesheets(id) ON DELETE CASCADE,
  
  -- Entry Details
  date DATE NOT NULL,
  assignment_id UUID REFERENCES hr.assignments(id),
  task_code VARCHAR(50),
  hours DECIMAL(4,2) NOT NULL CHECK (hours >= 0 AND hours <= 24),
  billable BOOLEAN DEFAULT true,
  
  -- Classification
  entry_type VARCHAR(20) DEFAULT 'regular' CHECK (entry_type IN ('regular', 'overtime', 'pto', 'holiday', 'sick')),
  
  -- AI Analysis
  ai_category VARCHAR(50),
  ai_confidence DECIMAL(5,2),
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet Approvals
CREATE TABLE IF NOT EXISTS hr.timesheet_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID NOT NULL REFERENCES hr.timesheets(id) ON DELETE CASCADE,
  
  -- Approval Details
  approver_id UUID NOT NULL REFERENCES hr.employees(id),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  approved_at TIMESTAMPTZ,
  
  -- Comments
  comment TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet Anomalies (AI Detection)
CREATE TABLE IF NOT EXISTS hr.timesheet_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  timesheet_id UUID REFERENCES hr.timesheets(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  -- Anomaly Details
  anomaly_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  
  -- AI Analysis
  ai_confidence DECIMAL(5,2),
  ai_reasoning TEXT,
  
  -- Resolution
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet Compliance Tracking
CREATE TABLE IF NOT EXISTS hr.timesheet_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Period
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Compliance Metrics
  total_employees INTEGER DEFAULT 0,
  submitted_on_time INTEGER DEFAULT 0,
  submitted_late INTEGER DEFAULT 0,
  not_submitted INTEGER DEFAULT 0,
  compliance_rate DECIMAL(5,2),
  
  -- AI Insights
  ai_risk_score DECIMAL(5,2),
  ai_recommendations JSONB,
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, week_start)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_timesheets_tenant ON hr.timesheets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_employee ON hr.timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON hr.timesheets(status);
CREATE INDEX IF NOT EXISTS idx_timesheets_week ON hr.timesheets(week_start, week_end);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_timesheet ON hr.timesheet_entries(timesheet_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_date ON hr.timesheet_entries(date);
CREATE INDEX IF NOT EXISTS idx_timesheet_anomalies_tenant ON hr.timesheet_anomalies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_anomalies_status ON hr.timesheet_anomalies(status);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE hr.timesheet_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheet_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheet_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheet_compliance ENABLE ROW LEVEL SECURITY;

-- Policies for timesheet_policies
CREATE POLICY "Users can view their tenant's policies" ON hr.timesheet_policies
  FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for timesheets
CREATE POLICY "Users can view their tenant's timesheets" ON hr.timesheets
  FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own timesheets" ON hr.timesheets
  FOR INSERT WITH CHECK (employee_id IN (SELECT id FROM hr.employees WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own timesheets" ON hr.timesheets
  FOR UPDATE USING (employee_id IN (SELECT id FROM hr.employees WHERE user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timesheet totals when entries change
CREATE OR REPLACE FUNCTION hr.fn_update_timesheet_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hr.timesheets
  SET 
    total_hours = (
      SELECT COALESCE(SUM(hours), 0)
      FROM hr.timesheet_entries
      WHERE timesheet_id = COALESCE(NEW.timesheet_id, OLD.timesheet_id)
    ),
    billable_hours = (
      SELECT COALESCE(SUM(hours), 0)
      FROM hr.timesheet_entries
      WHERE timesheet_id = COALESCE(NEW.timesheet_id, OLD.timesheet_id)
        AND billable = true
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.timesheet_id, OLD.timesheet_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timesheet_totals
AFTER INSERT OR UPDATE OR DELETE ON hr.timesheet_entries
FOR EACH ROW
EXECUTE FUNCTION hr.fn_update_timesheet_totals();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert default timesheet policy
INSERT INTO hr.timesheet_policies (tenant_id, name, description, is_default)
SELECT 
  id,
  'Default Policy',
  'Standard timesheet policy with 40-hour work week',
  true
FROM tenants
LIMIT 1
ON CONFLICT (tenant_id, name) DO NOTHING;

-- Insert sample timesheets
INSERT INTO hr.timesheets (tenant_id, employee_id, week_start, week_end, status, total_hours, billable_hours, ai_anomaly_score, ai_fraud_risk, ai_compliance_status)
SELECT 
  e.tenant_id,
  e.id,
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE - INTERVAL '1 day',
  'APPROVED',
  40.0,
  38.5,
  15.2,
  'low',
  'compliant'
FROM hr.employees e
LIMIT 5
ON CONFLICT (employee_id, week_start) DO NOTHING;

-- Insert sample timesheet entries
INSERT INTO hr.timesheet_entries (timesheet_id, date, hours, billable, entry_type, ai_category, ai_confidence)
SELECT 
  ts.id,
  ts.week_start + (n || ' days')::INTERVAL,
  8.0,
  true,
  'regular',
  'Development',
  95.5
FROM hr.timesheets ts
CROSS JOIN generate_series(0, 4) AS n
LIMIT 25
ON CONFLICT DO NOTHING;

COMMENT ON TABLE hr.timesheet_policies IS 'Timesheet policies and rules for validation';
COMMENT ON TABLE hr.timesheets IS 'Employee timesheets with AI insights and blockchain verification';
COMMENT ON TABLE hr.timesheet_entries IS 'Individual timesheet entries with AI categorization';
COMMENT ON TABLE hr.timesheet_anomalies IS 'AI-detected timesheet anomalies and fraud risks';
COMMENT ON TABLE hr.timesheet_compliance IS 'Weekly timesheet compliance tracking and metrics';
