-- Phase 10: HRMS Attendance Enhanced Schema
-- Creates comprehensive attendance tracking with check-ins, leave management, and exception handling

BEGIN;

-- ============================================================================
-- ATTENDANCE CHECK-INS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_attendance_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kind VARCHAR(10) NOT NULL CHECK (kind IN ('IN', 'OUT')),
  source VARCHAR(20) NOT NULL CHECK (source IN ('web', 'mobile', 'kiosk', 'api')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  timezone VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Added IF NOT EXISTS to all index creation statements
CREATE INDEX IF NOT EXISTS idx_hrms_checkins_tenant ON hrms_attendance_checkins(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_checkins_employee ON hrms_attendance_checkins(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_checkins_ts ON hrms_attendance_checkins(ts);
CREATE INDEX IF NOT EXISTS idx_hrms_checkins_kind ON hrms_attendance_checkins(kind);

-- ============================================================================
-- ATTENDANCE DAYS TABLE (Daily Rollup)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_attendance_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY', 'WFH', 'REMOTE')),
  hours_worked DECIMAL(5, 2) DEFAULT 0,
  exception JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_hrms_days_tenant ON hrms_attendance_days(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_days_employee ON hrms_attendance_days(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_days_date ON hrms_attendance_days(date);
CREATE INDEX IF NOT EXISTS idx_hrms_days_status ON hrms_attendance_days(status);

-- ============================================================================
-- LEAVE POLICIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_leave_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  kind VARCHAR(50) NOT NULL, -- 'Annual', 'Sick', 'PTO', 'Maternity', etc.
  accrual_rule JSONB NOT NULL, -- { "type": "monthly", "days_per_period": 1.5, "max_balance": 30 }
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_hrms_leave_policies_tenant ON hrms_leave_policies(tenant_id);

-- ============================================================================
-- LEAVE BALANCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  kind VARCHAR(50) NOT NULL,
  balance_days DECIMAL(5, 2) NOT NULL DEFAULT 0,
  as_of DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_hrms_balances_tenant ON hrms_leave_balances(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_balances_employee ON hrms_leave_balances(employee_id);

-- ============================================================================
-- HOLIDAYS CALENDAR TABLE
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS calendars;

CREATE TABLE IF NOT EXISTS calendars.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region VARCHAR(50) NOT NULL, -- 'US', 'IN', 'UK', etc.
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region, date)
);

CREATE INDEX IF NOT EXISTS idx_holidays_region ON calendars.holidays(region);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON calendars.holidays(date);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE hrms_attendance_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_attendance_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars.holidays ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating to prevent duplicate errors
DROP POLICY IF EXISTS tenant_isolation_checkins ON hrms_attendance_checkins;
DROP POLICY IF EXISTS tenant_isolation_days ON hrms_attendance_days;
DROP POLICY IF EXISTS tenant_isolation_leave_policies ON hrms_leave_policies;
DROP POLICY IF EXISTS tenant_isolation_balances ON hrms_leave_balances;
DROP POLICY IF EXISTS holidays_read_all ON calendars.holidays;

-- Tenant isolation policies
CREATE POLICY tenant_isolation_checkins ON hrms_attendance_checkins
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_days ON hrms_attendance_days
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_leave_policies ON hrms_leave_policies
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_balances ON hrms_leave_balances
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY holidays_read_all ON calendars.holidays
  FOR SELECT USING (true);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================
CREATE OR REPLACE VIEW vw_attendance_day_rollup AS
SELECT
  tenant_id,
  date,
  COUNT(*) FILTER (WHERE status = 'PRESENT') AS present,
  COUNT(*) FILTER (WHERE status = 'ABSENT') AS absent,
  COUNT(*) FILTER (WHERE status = 'LEAVE') AS leave,
  COUNT(*) FILTER (WHERE status = 'WFH' OR status = 'REMOTE') AS wfh,
  COUNT(*) FILTER (WHERE exception IS NOT NULL) AS exceptions
FROM hrms_attendance_days
GROUP BY tenant_id, date;

CREATE OR REPLACE VIEW vw_leave_balances_by_kind AS
SELECT
  tenant_id,
  employee_id,
  kind,
  balance_days
FROM hrms_leave_balances;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to validate leave overlap
CREATE OR REPLACE FUNCTION fn_validate_leave_overlap(
  p_tenant_id UUID,
  p_employee_id UUID,
  p_from_date DATE,
  p_to_date DATE,
  p_exclude_request_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  overlap_count INT;
BEGIN
  SELECT COUNT(*) INTO overlap_count
  FROM hrms_leave_requests
  WHERE tenant_id = p_tenant_id
    AND employee_id = p_employee_id
    AND status IN ('PENDING', 'APPROVED')
    AND (p_exclude_request_id IS NULL OR id != p_exclude_request_id)
    AND (
      (start_date <= p_to_date AND end_date >= p_from_date)
    );
  
  RETURN overlap_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect missing check-outs
CREATE OR REPLACE FUNCTION fn_detect_missing_checkouts(
  p_tenant_id UUID,
  p_date DATE
) RETURNS TABLE (
  employee_id UUID,
  last_checkin_ts TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH last_checkins AS (
    SELECT DISTINCT ON (c.employee_id)
      c.employee_id,
      c.ts,
      c.kind
    FROM hrms_attendance_checkins c
    WHERE c.tenant_id = p_tenant_id
      AND c.ts::date = p_date
    ORDER BY c.employee_id, c.ts DESC
  )
  SELECT
    lc.employee_id,
    lc.ts
  FROM last_checkins lc
  WHERE lc.kind = 'IN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers before creating to prevent duplicate errors
DROP TRIGGER IF EXISTS update_hrms_checkins_updated_at ON hrms_attendance_checkins;
CREATE TRIGGER update_hrms_checkins_updated_at
  BEFORE UPDATE ON hrms_attendance_checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hrms_days_updated_at ON hrms_attendance_days;
CREATE TRIGGER update_hrms_days_updated_at
  BEFORE UPDATE ON hrms_attendance_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hrms_leave_policies_updated_at ON hrms_leave_policies;
CREATE TRIGGER update_hrms_leave_policies_updated_at
  BEFORE UPDATE ON hrms_leave_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hrms_balances_updated_at ON hrms_leave_balances;
CREATE TRIGGER update_hrms_balances_updated_at
  BEFORE UPDATE ON hrms_leave_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Phase 10: HRMS Attendance Enhanced Schema Created Successfully!';
  RAISE NOTICE '   - Created hrms_attendance_checkins table';
  RAISE NOTICE '   - Created hrms_attendance_days table';
  RAISE NOTICE '   - Created hrms_leave_policies table';
  RAISE NOTICE '   - Created hrms_leave_balances table';
  RAISE NOTICE '   - Created calendars.holidays table';
  RAISE NOTICE '   - Added RLS policies for tenant isolation';
  RAISE NOTICE '   - Created analytics views and utility functions';
END $$;
