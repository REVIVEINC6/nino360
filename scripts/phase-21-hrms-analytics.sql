-- Nino360 — Phase 21: HR Analytics (People • Operations • Compliance • Finance-adjacent)
-- Complete star/snowflake schema with dimensions, facts, materialized views, and AI-powered insights

-- ============================================================================
-- 1. Create Analytics Schema
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS analytics;

-- ============================================================================
-- 2. Dimension Tables
-- ============================================================================

-- Date dimension for time-series analysis
CREATE TABLE IF NOT EXISTS analytics.dim_date (
  d DATE PRIMARY KEY,
  y INT NOT NULL,
  q INT NOT NULL,
  m INT NOT NULL,
  w INT NOT NULL,
  dow INT NOT NULL,
  month_label TEXT NOT NULL,
  week_label TEXT NOT NULL,
  iso_week_start DATE NOT NULL
);

-- Employee dimension
CREATE TABLE IF NOT EXISTS analytics.dim_employee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_no TEXT,
  legal_name TEXT NOT NULL,
  preferred_name TEXT,
  type TEXT NOT NULL, -- 'FTE', 'CONTRACTOR', 'INTERN'
  band TEXT,
  grade TEXT,
  level TEXT,
  manager_id UUID,
  org_node_id UUID,
  location TEXT,
  hire_date DATE,
  termination_date DATE,
  contractor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization dimension
CREATE TABLE IF NOT EXISTS analytics.dim_org (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL, -- materialized path for hierarchy
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client dimension
CREATE TABLE IF NOT EXISTS analytics.dim_client (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project dimension
CREATE TABLE IF NOT EXISTS analytics.dim_project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES analytics.dim_client(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location dimension
CREATE TABLE IF NOT EXISTS analytics.dim_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  region TEXT,
  city TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. Fact Tables
-- ============================================================================

-- Headcount facts
CREATE TABLE IF NOT EXISTS analytics.fact_headcount (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL REFERENCES analytics.dim_date(d),
  org_id UUID REFERENCES analytics.dim_org(id) ON DELETE SET NULL,
  location_id UUID REFERENCES analytics.dim_location(id) ON DELETE SET NULL,
  active_count INT DEFAULT 0,
  joiners INT DEFAULT 0,
  leavers INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance facts
CREATE TABLE IF NOT EXISTS analytics.fact_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL REFERENCES analytics.dim_date(d),
  org_id UUID REFERENCES analytics.dim_org(id) ON DELETE SET NULL,
  present INT DEFAULT 0,
  absent INT DEFAULT 0,
  leave INT DEFAULT 0,
  wfh INT DEFAULT 0,
  exceptions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet facts
CREATE TABLE IF NOT EXISTS analytics.fact_timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  week_key DATE NOT NULL REFERENCES analytics.dim_date(d),
  org_id UUID REFERENCES analytics.dim_org(id) ON DELETE SET NULL,
  on_time INT DEFAULT 0,
  late INT DEFAULT 0,
  missing INT DEFAULT 0,
  overtime_anomalies INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice facts
CREATE TABLE IF NOT EXISTS analytics.fact_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  client_id UUID REFERENCES analytics.dim_client(id) ON DELETE SET NULL,
  project_id UUID REFERENCES analytics.dim_project(id) ON DELETE SET NULL,
  amount_total DECIMAL(15,2) DEFAULT 0,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  overdue DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AP facts
CREATE TABLE IF NOT EXISTS analytics.fact_ap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  scheduled DECIMAL(15,2) DEFAULT 0,
  paid DECIMAL(15,2) DEFAULT 0,
  overdue DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance facts
CREATE TABLE IF NOT EXISTS analytics.fact_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL REFERENCES analytics.dim_date(d),
  i9_due INT DEFAULT 0,
  i9_complete INT DEFAULT 0,
  expiries INT DEFAULT 0,
  policy_assigned INT DEFAULT 0,
  policy_acked INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance facts
CREATE TABLE IF NOT EXISTS analytics.fact_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id UUID,
  submitted_self INT DEFAULT 0,
  submitted_mgr INT DEFAULT 0,
  finalized INT DEFAULT 0,
  avg_rating DECIMAL(3,2),
  dist JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compensation facts
CREATE TABLE IF NOT EXISTS analytics.fact_comp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id UUID,
  budget DECIMAL(15,2) DEFAULT 0,
  used DECIMAL(15,2) DEFAULT 0,
  avg_increase_pct DECIMAL(5,2),
  exceptions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpdesk case facts
CREATE TABLE IF NOT EXISTS analytics.fact_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL REFERENCES analytics.dim_date(d),
  opened INT DEFAULT 0,
  first_response_mins_avg DECIMAL(10,2),
  resolved INT DEFAULT 0,
  resolution_hours_avg DECIMAL(10,2),
  breached INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_dim_employee_tenant ON analytics.dim_employee(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_org_tenant ON analytics.dim_org(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_client_tenant ON analytics.dim_client(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_project_tenant ON analytics.dim_project(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_location_tenant ON analytics.dim_location(tenant_id);

CREATE INDEX IF NOT EXISTS idx_fact_headcount_tenant_date ON analytics.fact_headcount(tenant_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_fact_attendance_tenant_date ON analytics.fact_attendance(tenant_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_fact_timesheets_tenant_week ON analytics.fact_timesheets(tenant_id, week_key DESC);
CREATE INDEX IF NOT EXISTS idx_fact_invoices_tenant_period ON analytics.fact_invoices(tenant_id, period_from DESC);
CREATE INDEX IF NOT EXISTS idx_fact_ap_tenant_period ON analytics.fact_ap(tenant_id, period_from DESC);
CREATE INDEX IF NOT EXISTS idx_fact_compliance_tenant_date ON analytics.fact_compliance(tenant_id, date_key DESC);
CREATE INDEX IF NOT EXISTS idx_fact_performance_tenant_cycle ON analytics.fact_performance(tenant_id, cycle_id);
CREATE INDEX IF NOT EXISTS idx_fact_comp_tenant_cycle ON analytics.fact_comp(tenant_id, cycle_id);
CREATE INDEX IF NOT EXISTS idx_fact_cases_tenant_date ON analytics.fact_cases(tenant_id, date_key DESC);

-- ============================================================================
-- 5. RLS Policies
-- ============================================================================

ALTER TABLE analytics.dim_employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.dim_org ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.dim_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.dim_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.dim_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_headcount ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_ap ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_comp ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_cases ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY dim_employee_tenant_isolation ON analytics.dim_employee
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY dim_org_tenant_isolation ON analytics.dim_org
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY dim_client_tenant_isolation ON analytics.dim_client
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY dim_project_tenant_isolation ON analytics.dim_project
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY dim_location_tenant_isolation ON analytics.dim_location
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_headcount_tenant_isolation ON analytics.fact_headcount
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_attendance_tenant_isolation ON analytics.fact_attendance
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_timesheets_tenant_isolation ON analytics.fact_timesheets
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_invoices_tenant_isolation ON analytics.fact_invoices
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_ap_tenant_isolation ON analytics.fact_ap
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_compliance_tenant_isolation ON analytics.fact_compliance
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_performance_tenant_isolation ON analytics.fact_performance
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_comp_tenant_isolation ON analytics.fact_comp
  FOR ALL USING (tenant_id = app.current_tenant_id());

CREATE POLICY fact_cases_tenant_isolation ON analytics.fact_cases
  FOR ALL USING (tenant_id = app.current_tenant_id());

-- ============================================================================
-- 6. Materialized Views
-- ============================================================================

-- Overview KPIs
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_overview_kpis AS
SELECT
  tenant_id,
  MAX(date_key) as as_of_date,
  SUM(active_count) as total_headcount,
  SUM(joiners) as total_joiners,
  SUM(leavers) as total_leavers,
  CASE WHEN SUM(active_count) > 0 
    THEN ROUND((SUM(leavers)::DECIMAL / SUM(active_count)) * 100, 2)
    ELSE 0 
  END as attrition_pct
FROM analytics.fact_headcount
WHERE date_key >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tenant_id;

CREATE UNIQUE INDEX ON analytics.mv_overview_kpis(tenant_id);

-- Workforce summary
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_workforce_summary AS
SELECT
  e.tenant_id,
  e.type,
  e.location,
  e.band,
  COUNT(*) as count,
  AVG(EXTRACT(YEAR FROM AGE(COALESCE(e.termination_date, CURRENT_DATE), e.hire_date))) as avg_tenure_years
FROM analytics.dim_employee e
WHERE e.termination_date IS NULL OR e.termination_date > CURRENT_DATE
GROUP BY e.tenant_id, e.type, e.location, e.band;

CREATE INDEX ON analytics.mv_workforce_summary(tenant_id);

-- Compliance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_compliance_summary AS
SELECT
  tenant_id,
  MAX(date_key) as as_of_date,
  SUM(i9_due) as i9_due,
  SUM(i9_complete) as i9_complete,
  CASE WHEN SUM(i9_due) > 0
    THEN ROUND((SUM(i9_complete)::DECIMAL / SUM(i9_due)) * 100, 2)
    ELSE 100
  END as i9_completion_pct,
  SUM(policy_assigned) as policy_assigned,
  SUM(policy_acked) as policy_acked,
  CASE WHEN SUM(policy_assigned) > 0
    THEN ROUND((SUM(policy_acked)::DECIMAL / SUM(policy_assigned)) * 100, 2)
    ELSE 100
  END as policy_ack_pct
FROM analytics.fact_compliance
WHERE date_key >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tenant_id;

CREATE UNIQUE INDEX ON analytics.mv_compliance_summary(tenant_id);

-- ============================================================================
-- 7. Refresh Function
-- ============================================================================

CREATE OR REPLACE FUNCTION analytics.refresh_all_analytics_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_overview_kpis;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_workforce_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_compliance_summary;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. Seed Date Dimension (2020-2030)
-- ============================================================================

INSERT INTO analytics.dim_date (d, y, q, m, w, dow, month_label, week_label, iso_week_start)
SELECT
  d::DATE,
  EXTRACT(YEAR FROM d)::INT,
  EXTRACT(QUARTER FROM d)::INT,
  EXTRACT(MONTH FROM d)::INT,
  EXTRACT(WEEK FROM d)::INT,
  EXTRACT(DOW FROM d)::INT,
  TO_CHAR(d, 'YYYY-MM'),
  TO_CHAR(d, 'IYYY-IW'),
  DATE_TRUNC('week', d)::DATE
FROM generate_series('2020-01-01'::DATE, '2030-12-31'::DATE, '1 day'::INTERVAL) d
ON CONFLICT (d) DO NOTHING;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Phase 21: HR Analytics schema created successfully';
  RAISE NOTICE '   - Created analytics schema with star/snowflake design';
  RAISE NOTICE '   - Created 5 dimension tables (date, employee, org, client, project, location)';
  RAISE NOTICE '   - Created 9 fact tables (headcount, attendance, timesheets, invoices, AP, compliance, performance, comp, cases)';
  RAISE NOTICE '   - Created 3 materialized views with refresh function';
  RAISE NOTICE '   - Seeded date dimension (2020-2030)';
  RAISE NOTICE '   - Applied RLS policies for tenant isolation';
END $$;
