-- Phase 11: Enhanced HRMS Timesheets System
-- Comprehensive timesheet management with policies, approvals, compliance, and anomaly detection

-- Ensure required schemas exist
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS calendars;

-- ============================================================================
-- TIMESHEET POLICIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS hr.timesheet_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('WEEKLY', 'BIWEEKLY', 'MONTHLY')),
  cutoff_dow INTEGER NOT NULL CHECK (cutoff_dow BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  cutoff_time TIME DEFAULT '23:59:59',
  min_hours NUMERIC(5,2) DEFAULT 0,
  max_hours NUMERIC(5,2) DEFAULT 168, -- 24*7
  overtime_rule JSONB DEFAULT '{"threshold": 40, "multiplier": 1.5}'::jsonb,
  require_assignment BOOLEAN DEFAULT true,
  allow_future_entries BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timesheet_policies_tenant ON hr.timesheet_policies(tenant_id);

-- ============================================================================
-- TIMESHEETS (Enhanced from script 14)
-- ============================================================================

-- Drop and recreate table to ensure correct schema
DROP TABLE IF EXISTS hr.timesheet_entries CASCADE;
DROP TABLE IF EXISTS hr.timesheets CASCADE;

-- Create base table with correct column names
CREATE TABLE hr.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  period_week TEXT, -- e.g., "2025-W03"
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'MISSING', 'LOCKED')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approver_id UUID,
  notes TEXT,
  total_hours NUMERIC(6,2) DEFAULT 0,
  billable_hours NUMERIC(6,2) DEFAULT 0,
  policy_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_timesheets_tenant ON hr.timesheets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_employee ON hr.timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_week ON hr.timesheets(week_start);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON hr.timesheets(status);

-- ============================================================================
-- TIMESHEET ENTRIES (Enhanced from script 14)
-- ============================================================================

CREATE TABLE hr.timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID NOT NULL,
  date DATE NOT NULL,
  assignment_id UUID,
  task_code TEXT,
  hours NUMERIC(5,2) NOT NULL CHECK (hours >= 0 AND hours <= 24),
  billable BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timesheet_entries_timesheet ON hr.timesheet_entries(timesheet_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_date ON hr.timesheet_entries(date);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_assignment ON hr.timesheet_entries(assignment_id);

-- ============================================================================
-- APPROVALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS hr.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  object_type TEXT NOT NULL, -- 'timesheet', 'leave_request', etc.
  object_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approver_id UUID,
  approved_at TIMESTAMPTZ,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_tenant ON hr.approvals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_approvals_object ON hr.approvals(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON hr.approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON hr.approvals(approver_id);

-- ============================================================================
-- OVERTIME ANOMALIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS hr.overtime_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  week_start DATE NOT NULL,
  score NUMERIC(5,2) NOT NULL, -- 0-100 severity score
  reason TEXT NOT NULL,
  total_hours NUMERIC(6,2),
  threshold_hours NUMERIC(6,2),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_overtime_anomalies_tenant ON hr.overtime_anomalies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_overtime_anomalies_employee ON hr.overtime_anomalies(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_anomalies_week ON hr.overtime_anomalies(week_start);

-- ============================================================================
-- HOLIDAYS CALENDAR
-- ============================================================================

CREATE TABLE IF NOT EXISTS calendars.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  is_working_day BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region, date)
);

CREATE INDEX IF NOT EXISTS idx_holidays_region_date ON calendars.holidays(region, date);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Compliance view: on-time, late, missing by week
CREATE OR REPLACE VIEW hr.vw_timesheet_compliance_weekly AS
SELECT
  t.tenant_id,
  t.week_start,
  COUNT(*) FILTER (WHERE t.status IN ('APPROVED', 'LOCKED')) AS on_time,
  COUNT(*) FILTER (WHERE t.status = 'PENDING' AND t.submitted_at > (t.week_end + INTERVAL '3 days')) AS late,
  COUNT(*) FILTER (WHERE t.status = 'MISSING') AS missing
FROM hr.timesheets t
GROUP BY t.tenant_id, t.week_start;

-- Timesheet totals by employee and week
CREATE OR REPLACE VIEW hr.vw_timesheet_totals AS
SELECT
  t.tenant_id,
  t.employee_id,
  t.week_start,
  SUM(e.hours) AS total_hours,
  SUM(e.hours) FILTER (WHERE e.billable = true) AS billable_hours,
  SUM(e.hours) FILTER (WHERE e.billable = false) AS nonbillable_hours
FROM hr.timesheets t
LEFT JOIN hr.timesheet_entries e ON e.timesheet_id = t.id
GROUP BY t.tenant_id, t.employee_id, t.week_start;

-- ============================================================================
-- POLICY VALIDATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION hr.fn_policy_validate(
  p_tenant_id UUID,
  p_employee_id UUID,
  p_week_start DATE
) RETURNS JSONB AS $$
DECLARE
  v_policy RECORD;
  v_timesheet RECORD;
  v_total_hours NUMERIC;
  v_errors JSONB := '[]'::jsonb;
BEGIN
  -- Get policy
  SELECT * INTO v_policy
  FROM hr.timesheet_policies
  WHERE tenant_id = p_tenant_id
    AND (is_default = true OR id = (
      SELECT policy_id FROM hr.timesheets
      WHERE tenant_id = p_tenant_id
        AND employee_id = p_employee_id
        AND week_start = p_week_start
    ))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'errors', jsonb_build_array('No policy found'));
  END IF;

  -- Get timesheet totals
  SELECT
    COALESCE(SUM(e.hours), 0) AS total_hours
  INTO v_total_hours
  FROM hr.timesheets t
  LEFT JOIN hr.timesheet_entries e ON e.timesheet_id = t.id
  WHERE t.tenant_id = p_tenant_id
    AND t.employee_id = p_employee_id
    AND t.week_start = p_week_start;

  -- Validate min hours
  IF v_total_hours < v_policy.min_hours THEN
    v_errors := v_errors || jsonb_build_object(
      'code', 'MIN_HOURS',
      'message', format('Total hours (%s) below minimum (%s)', v_total_hours, v_policy.min_hours)
    );
  END IF;

  -- Validate max hours
  IF v_total_hours > v_policy.max_hours THEN
    v_errors := v_errors || jsonb_build_object(
      'code', 'MAX_HOURS',
      'message', format('Total hours (%s) exceeds maximum (%s)', v_total_hours, v_policy.max_hours)
    );
  END IF;

  -- Check overtime threshold
  IF v_policy.overtime_rule->>'threshold' IS NOT NULL THEN
    IF v_total_hours > (v_policy.overtime_rule->>'threshold')::numeric THEN
      v_errors := v_errors || jsonb_build_object(
        'code', 'OVERTIME',
        'message', format('Total hours (%s) exceeds overtime threshold (%s)', v_total_hours, v_policy.overtime_rule->>'threshold')
      );
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'valid', jsonb_array_length(v_errors) = 0,
    'errors', v_errors,
    'total_hours', v_total_hours,
    'policy', jsonb_build_object(
      'min_hours', v_policy.min_hours,
      'max_hours', v_policy.max_hours,
      'overtime_threshold', v_policy.overtime_rule->>'threshold'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE hr.timesheet_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.overtime_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars.holidays ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating to make script idempotent
DROP POLICY IF EXISTS timesheet_policies_tenant ON hr.timesheet_policies;
DROP POLICY IF EXISTS timesheets_tenant ON hr.timesheets;
DROP POLICY IF EXISTS timesheet_entries_tenant ON hr.timesheet_entries;
DROP POLICY IF EXISTS approvals_tenant ON hr.approvals;
DROP POLICY IF EXISTS overtime_anomalies_tenant ON hr.overtime_anomalies;
DROP POLICY IF EXISTS holidays_all ON calendars.holidays;

-- Policies (tenant-scoped)
CREATE POLICY timesheet_policies_tenant ON hr.timesheet_policies FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY timesheets_tenant ON hr.timesheets FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY timesheet_entries_tenant ON hr.timesheet_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM hr.timesheets WHERE id = timesheet_entries.timesheet_id AND tenant_id = current_setting('app.current_tenant_id', true)::uuid)
);
CREATE POLICY approvals_tenant ON hr.approvals FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY overtime_anomalies_tenant ON hr.overtime_anomalies FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY holidays_all ON calendars.holidays FOR SELECT USING (true); -- Public read

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timesheet totals when entries change
CREATE OR REPLACE FUNCTION hr.trg_update_timesheet_totals()
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

DROP TRIGGER IF EXISTS trg_timesheet_entries_update_totals ON hr.timesheet_entries;
CREATE TRIGGER trg_timesheet_entries_update_totals
AFTER INSERT OR UPDATE OR DELETE ON hr.timesheet_entries
FOR EACH ROW EXECUTE FUNCTION hr.trg_update_timesheet_totals();

-- ============================================================================
-- SEED DEFAULT POLICY
-- ============================================================================

INSERT INTO hr.timesheet_policies (tenant_id, name, period, cutoff_dow, min_hours, max_hours, is_default)
SELECT
  t.id,
  'Default Weekly Policy',
  'WEEKLY',
  1, -- Monday
  40,
  60,
  true
FROM core.tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM hr.timesheet_policies WHERE tenant_id = t.id AND is_default = true
)
ON CONFLICT DO NOTHING;
