-- HRMS Attendance Schema
-- Comprehensive attendance tracking with AI insights, leave management, and blockchain verification

-- ============================================================================
-- ATTENDANCE DAYS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_attendance_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY', 'WFH', 'REMOTE')),
  hours_worked DECIMAL(5,2) DEFAULT 0,
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  exception JSONB, -- {corrected_by, corrected_at, note}
  ai_insights JSONB, -- {productivity_score, engagement_level, anomaly_detected}
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, date)
);

CREATE INDEX idx_attendance_days_tenant ON hrms_attendance_days(tenant_id);
CREATE INDEX idx_attendance_days_employee ON hrms_attendance_days(employee_id);
CREATE INDEX idx_attendance_days_date ON hrms_attendance_days(date);
CREATE INDEX idx_attendance_days_status ON hrms_attendance_days(status);

-- ============================================================================
-- CHECK-INS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_attendance_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kind TEXT NOT NULL CHECK (kind IN ('IN', 'OUT')),
  source TEXT NOT NULL CHECK (source IN ('web', 'mobile', 'kiosk', 'api', 'biometric')),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  timezone TEXT,
  notes TEXT,
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkins_tenant ON hrms_attendance_checkins(tenant_id);
CREATE INDEX idx_checkins_employee ON hrms_attendance_checkins(employee_id);
CREATE INDEX idx_checkins_ts ON hrms_attendance_checkins(ts);

-- ============================================================================
-- LEAVE TYPES
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  annual_quota INTEGER,
  carry_forward_allowed BOOLEAN DEFAULT false,
  max_carry_forward INTEGER DEFAULT 0,
  requires_approval BOOLEAN DEFAULT true,
  min_notice_days INTEGER DEFAULT 0,
  max_consecutive_days INTEGER,
  is_paid BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

CREATE INDEX idx_leave_types_tenant ON hrms_leave_types(tenant_id);

-- ============================================================================
-- LEAVE BALANCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES hrms_leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  allocated_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  used_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  balance_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  carried_forward DECIMAL(5,2) DEFAULT 0,
  ai_predictions JSONB, -- {predicted_usage, optimal_planning, burnout_risk}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, leave_type_id, year)
);

CREATE INDEX idx_leave_balances_tenant ON hrms_leave_balances(tenant_id);
CREATE INDEX idx_leave_balances_employee ON hrms_leave_balances(employee_id);
CREATE INDEX idx_leave_balances_year ON hrms_leave_balances(year);

-- ============================================================================
-- LEAVE REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES hrms_leave_types(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days DECIMAL(5,2) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  ai_recommendation JSONB, -- {should_approve, confidence, reasoning, impact_analysis}
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_tenant ON hrms_leave_requests(tenant_id);
CREATE INDEX idx_leave_requests_employee ON hrms_leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON hrms_leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON hrms_leave_requests(start_date, end_date);

-- ============================================================================
-- HOLIDAYS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  is_optional BOOLEAN DEFAULT false,
  description TEXT,
  applicable_locations TEXT[], -- Array of location codes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_holidays_tenant ON hrms_holidays(tenant_id);
CREATE INDEX idx_holidays_date ON hrms_holidays(date);

-- ============================================================================
-- SHIFT SCHEDULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms_shift_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  shift_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL, -- [1,2,3,4,5] for Mon-Fri
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shift_schedules_tenant ON hrms_shift_schedules(tenant_id);
CREATE INDEX idx_shift_schedules_employee ON hrms_shift_schedules(employee_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE hrms_attendance_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_attendance_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_shift_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for attendance_days
CREATE POLICY "Users can view attendance in their tenant" ON hrms_attendance_days FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage attendance" ON hrms_attendance_days FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for checkins
CREATE POLICY "Users can view checkins in their tenant" ON hrms_attendance_checkins FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "Employees can create their own checkins" ON hrms_attendance_checkins FOR INSERT WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for leave types
CREATE POLICY "Users can view leave types in their tenant" ON hrms_leave_types FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage leave types" ON hrms_leave_types FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for leave balances
CREATE POLICY "Users can view leave balances in their tenant" ON hrms_leave_balances FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage leave balances" ON hrms_leave_balances FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for leave requests
CREATE POLICY "Users can view leave requests in their tenant" ON hrms_leave_requests FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "Employees can create leave requests" ON hrms_leave_requests FOR INSERT WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage leave requests" ON hrms_leave_requests FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for holidays
CREATE POLICY "Users can view holidays in their tenant" ON hrms_holidays FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage holidays" ON hrms_holidays FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Policies for shift schedules
CREATE POLICY "Users can view shift schedules in their tenant" ON hrms_shift_schedules FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
CREATE POLICY "HR can manage shift schedules" ON hrms_shift_schedules FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_days_updated_at BEFORE UPDATE ON hrms_attendance_days FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();
CREATE TRIGGER leave_types_updated_at BEFORE UPDATE ON hrms_leave_types FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();
CREATE TRIGGER leave_balances_updated_at BEFORE UPDATE ON hrms_leave_balances FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();
CREATE TRIGGER leave_requests_updated_at BEFORE UPDATE ON hrms_leave_requests FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();
CREATE TRIGGER holidays_updated_at BEFORE UPDATE ON hrms_holidays FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();
CREATE TRIGGER shift_schedules_updated_at BEFORE UPDATE ON hrms_shift_schedules FOR EACH ROW EXECUTE FUNCTION update_attendance_updated_at();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
-- Insert sample leave types
INSERT INTO hrms_leave_types (tenant_id, name, code, description, annual_quota, carry_forward_allowed, max_carry_forward, is_paid) VALUES
((SELECT id FROM tenants LIMIT 1), 'Annual Leave', 'AL', 'Paid annual leave', 20, true, 5, true),
((SELECT id FROM tenants LIMIT 1), 'Sick Leave', 'SL', 'Paid sick leave', 10, false, 0, true),
((SELECT id FROM tenants LIMIT 1), 'Personal Leave', 'PL', 'Personal time off', 5, false, 0, true),
((SELECT id FROM tenants LIMIT 1), 'Maternity Leave', 'ML', 'Maternity leave', 90, false, 0, true),
((SELECT id FROM tenants LIMIT 1), 'Paternity Leave', 'PTL', 'Paternity leave', 10, false, 0, true)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Insert sample holidays
INSERT INTO hrms_holidays (tenant_id, name, date, is_optional, description) VALUES
((SELECT id FROM tenants LIMIT 1), 'New Year''s Day', '2025-01-01', false, 'New Year celebration'),
((SELECT id FROM tenants LIMIT 1), 'Independence Day', '2025-07-04', false, 'National holiday'),
((SELECT id FROM tenants LIMIT 1), 'Thanksgiving', '2025-11-27', false, 'Thanksgiving Day'),
((SELECT id FROM tenants LIMIT 1), 'Christmas', '2025-12-25', false, 'Christmas Day')
ON CONFLICT DO NOTHING;
