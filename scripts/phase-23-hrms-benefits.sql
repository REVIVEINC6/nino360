-- Phase 23: HRMS Benefits Management
-- Comprehensive benefits administration with Open Enrollment, QLE, EDI 834, COBRA, and payroll integration

-- ============================================================================
-- SCHEMA: benefits
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS benefits;

-- ============================================================================
-- TABLE: benefits.carriers
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  edi_sender_id TEXT, -- for EDI 834 generation
  contact JSONB DEFAULT '{}', -- {email, phone, portal_url}
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_carriers_tenant ON benefits.carriers(tenant_id);

-- ============================================================================
-- TABLE: benefits.plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL, -- unique identifier like 'medical_ppo_gold'
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MEDICAL','DENTAL','VISION','LIFE','DISABILITY','FSA','HSA','COMMUTER','OTHER')),
  carrier_id UUID REFERENCES benefits.carriers(id) ON DELETE SET NULL,
  region TEXT, -- geo region for eligibility
  currency TEXT DEFAULT 'USD',
  waiting_period_days INT DEFAULT 0,
  calc_rule JSONB DEFAULT '{}', -- {kind: 'composite'|'age_banded'|'flat'|'tiered', ...}
  effective_from DATE NOT NULL,
  effective_to DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, key, effective_from)
);

CREATE INDEX idx_plans_tenant ON benefits.plans(tenant_id);
CREATE INDEX idx_plans_type ON benefits.plans(type);
CREATE INDEX idx_plans_effective ON benefits.plans(effective_from, effective_to);

-- ============================================================================
-- TABLE: benefits.plan_options
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.plan_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES benefits.plans(id) ON DELETE CASCADE,
  coverage_tier TEXT NOT NULL CHECK (coverage_tier IN ('EMPLOYEE','EE_SPOUSE','EE_CHILDREN','FAMILY')),
  network TEXT, -- 'IN_NETWORK', 'OUT_OF_NETWORK', etc.
  hsa_eligible BOOLEAN DEFAULT false,
  class_key TEXT, -- for class-based eligibility
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plan_options_tenant ON benefits.plan_options(tenant_id);
CREATE INDEX idx_plan_options_plan ON benefits.plan_options(plan_id);

-- ============================================================================
-- TABLE: benefits.rate_cards
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES benefits.plans(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES benefits.plan_options(id) ON DELETE CASCADE,
  effective_from DATE NOT NULL,
  effective_to DATE,
  rule JSONB NOT NULL, -- {kind:'composite', employee:100, spouse:200, child:150, family:300} or {kind:'age_banded', bands:[{maxAge:24, rate:80}, ...]}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rate_cards_tenant ON benefits.rate_cards(tenant_id);
CREATE INDEX idx_rate_cards_plan ON benefits.rate_cards(plan_id);
CREATE INDEX idx_rate_cards_option ON benefits.rate_cards(option_id);
CREATE INDEX idx_rate_cards_effective ON benefits.rate_cards(effective_from, effective_to);

-- ============================================================================
-- TABLE: benefits.eligibility_rules
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES benefits.plans(id) ON DELETE CASCADE,
  criteria JSONB NOT NULL, -- {location, job_family, type, min_hours, waiting_period}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eligibility_rules_tenant ON benefits.eligibility_rules(tenant_id);
CREATE INDEX idx_eligibility_rules_plan ON benefits.eligibility_rules(plan_id);

-- ============================================================================
-- TABLE: benefits.dependents
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('SPOUSE','DOMESTIC_PARTNER','CHILD','OTHER')),
  dob DATE NOT NULL,
  gender TEXT,
  ssn_last4 TEXT, -- PII - masked by default
  tobacco_user BOOLEAN DEFAULT false,
  disabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dependents_tenant ON benefits.dependents(tenant_id);
CREATE INDEX idx_dependents_employee ON benefits.dependents(employee_id);

-- ============================================================================
-- TABLE: benefits.events
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('OPEN_ENROLLMENT','NEW_HIRE','QLE')),
  qle_type TEXT CHECK (qle_type IN ('MARRIAGE','BIRTH','ADOPTION','DIVORCE','LOSS_OF_COVERAGE','GAIN_OF_COVERAGE','ADDRESS_CHANGE','OTHER')),
  event_date DATE NOT NULL,
  window_ends DATE NOT NULL,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN','CLOSED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_tenant ON benefits.events(tenant_id);
CREATE INDEX idx_events_employee ON benefits.events(employee_id);
CREATE INDEX idx_events_status ON benefits.events(status);

-- ============================================================================
-- TABLE: benefits.evidence
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES benefits.events(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES hrms.documents(id) ON DELETE CASCADE,
  required BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_evidence_tenant ON benefits.evidence(tenant_id);
CREATE INDEX idx_evidence_event ON benefits.evidence(event_id);

-- ============================================================================
-- TABLE: benefits.enrollments
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES benefits.plans(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES benefits.plan_options(id) ON DELETE CASCADE,
  event_id UUID REFERENCES benefits.events(id) ON DELETE SET NULL,
  coverage_start DATE NOT NULL,
  coverage_end DATE,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SUBMITTED','APPROVED','DECLINED','WAIVED','TERMINATED')),
  employee_cost NUMERIC(12,2) DEFAULT 0,
  employer_cost NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  confirmation_doc_id UUID REFERENCES hrms.documents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_enrollments_tenant ON benefits.enrollments(tenant_id);
CREATE INDEX idx_enrollments_employee ON benefits.enrollments(employee_id);
CREATE INDEX idx_enrollments_plan ON benefits.enrollments(plan_id);
CREATE INDEX idx_enrollments_status ON benefits.enrollments(status);

-- ============================================================================
-- TABLE: benefits.enrollment_lines
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.enrollment_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES benefits.enrollments(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES benefits.dependents(id) ON DELETE CASCADE,
  covered BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_enrollment_lines_tenant ON benefits.enrollment_lines(tenant_id);
CREATE INDEX idx_enrollment_lines_enrollment ON benefits.enrollment_lines(enrollment_id);

-- ============================================================================
-- TABLE: benefits.edi_runs
-- ============================================================================
CREATE TABLE IF NOT EXISTS benefits.edi_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES benefits.carriers(id) ON DELETE CASCADE,
  file_url TEXT,
  control_no TEXT,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','GENERATED','SENT','ACK_ACCEPTED','ACK_REJECTED')),
  ack_notes TEXT,
  sha256 TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_edi_runs_tenant ON benefits.edi_runs(tenant_id);
CREATE INDEX idx_edi_runs_carrier ON benefits.edi_runs(carrier_id);
CREATE INDEX idx_edi_runs_status ON benefits.edi_runs(status);

-- ============================================================================
-- SCHEMA: payroll
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS payroll;

-- ============================================================================
-- TABLE: payroll.providers
-- ============================================================================
CREATE TABLE IF NOT EXISTS payroll.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL, -- 'adp', 'gusto', 'paychex', etc.
  name TEXT NOT NULL,
  region TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX idx_payroll_providers_tenant ON payroll.providers(tenant_id);

-- ============================================================================
-- TABLE: payroll.deductions
-- ============================================================================
CREATE TABLE IF NOT EXISTS payroll.deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  provider_key TEXT NOT NULL,
  code TEXT NOT NULL, -- provider-specific deduction code
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PRETAX','POSTTAX')),
  start_date DATE NOT NULL,
  end_date DATE,
  source TEXT DEFAULT 'BENEFITS' CHECK (source IN ('BENEFITS','MANUAL')),
  enrollment_id UUID REFERENCES benefits.enrollments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payroll_deductions_tenant ON payroll.deductions(tenant_id);
CREATE INDEX idx_payroll_deductions_employee ON payroll.deductions(employee_id);
CREATE INDEX idx_payroll_deductions_enrollment ON payroll.deductions(enrollment_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- benefits.carriers
ALTER TABLE benefits.carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY carriers_tenant_isolation ON benefits.carriers USING (tenant_id = app.current_tenant_id());

-- benefits.plans
ALTER TABLE benefits.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_tenant_isolation ON benefits.plans USING (tenant_id = app.current_tenant_id());

-- benefits.plan_options
ALTER TABLE benefits.plan_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY plan_options_tenant_isolation ON benefits.plan_options USING (tenant_id = app.current_tenant_id());

-- benefits.rate_cards
ALTER TABLE benefits.rate_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY rate_cards_tenant_isolation ON benefits.rate_cards USING (tenant_id = app.current_tenant_id());

-- benefits.eligibility_rules
ALTER TABLE benefits.eligibility_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY eligibility_rules_tenant_isolation ON benefits.eligibility_rules USING (tenant_id = app.current_tenant_id());

-- benefits.dependents
ALTER TABLE benefits.dependents ENABLE ROW LEVEL SECURITY;
CREATE POLICY dependents_tenant_isolation ON benefits.dependents USING (tenant_id = app.current_tenant_id());

-- benefits.events
ALTER TABLE benefits.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY events_tenant_isolation ON benefits.events USING (tenant_id = app.current_tenant_id());

-- benefits.evidence
ALTER TABLE benefits.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY evidence_tenant_isolation ON benefits.evidence USING (tenant_id = app.current_tenant_id());

-- benefits.enrollments
ALTER TABLE benefits.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollments_tenant_isolation ON benefits.enrollments USING (tenant_id = app.current_tenant_id());

-- benefits.enrollment_lines
ALTER TABLE benefits.enrollment_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollment_lines_tenant_isolation ON benefits.enrollment_lines USING (tenant_id = app.current_tenant_id());

-- benefits.edi_runs
ALTER TABLE benefits.edi_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY edi_runs_tenant_isolation ON benefits.edi_runs USING (tenant_id = app.current_tenant_id());

-- payroll.providers
ALTER TABLE payroll.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY payroll_providers_tenant_isolation ON payroll.providers USING (tenant_id = app.current_tenant_id());

-- payroll.deductions
ALTER TABLE payroll.deductions ENABLE ROW LEVEL SECURITY;
CREATE POLICY payroll_deductions_tenant_isolation ON payroll.deductions USING (tenant_id = app.current_tenant_id());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION benefits.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER carriers_updated_at BEFORE UPDATE ON benefits.carriers FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER plans_updated_at BEFORE UPDATE ON benefits.plans FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER plan_options_updated_at BEFORE UPDATE ON benefits.plan_options FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER rate_cards_updated_at BEFORE UPDATE ON benefits.rate_cards FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER eligibility_rules_updated_at BEFORE UPDATE ON benefits.eligibility_rules FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER dependents_updated_at BEFORE UPDATE ON benefits.dependents FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON benefits.events FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER evidence_updated_at BEFORE UPDATE ON benefits.evidence FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER enrollments_updated_at BEFORE UPDATE ON benefits.enrollments FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER enrollment_lines_updated_at BEFORE UPDATE ON benefits.enrollment_lines FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER edi_runs_updated_at BEFORE UPDATE ON benefits.edi_runs FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER payroll_providers_updated_at BEFORE UPDATE ON payroll.providers FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();
CREATE TRIGGER payroll_deductions_updated_at BEFORE UPDATE ON payroll.deductions FOR EACH ROW EXECUTE FUNCTION benefits.update_updated_at();

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW benefits.v_enrollment_summary AS
SELECT
  e.tenant_id,
  e.employee_id,
  emp.first_name || ' ' || emp.last_name AS employee_name,
  p.name AS plan_name,
  p.type AS plan_type,
  po.coverage_tier,
  e.status,
  e.coverage_start,
  e.coverage_end,
  e.employee_cost,
  e.employer_cost,
  e.currency,
  e.created_at,
  e.updated_at
FROM benefits.enrollments e
JOIN hr.employees emp ON e.employee_id = emp.id
JOIN benefits.plans p ON e.plan_id = p.id
JOIN benefits.plan_options po ON e.option_id = po.id;

CREATE OR REPLACE VIEW benefits.v_qle_summary AS
SELECT
  ev.tenant_id,
  ev.employee_id,
  emp.first_name || ' ' || emp.last_name AS employee_name,
  ev.kind,
  ev.qle_type,
  ev.event_date,
  ev.window_ends,
  ev.status,
  COUNT(evd.id) AS evidence_count,
  SUM(CASE WHEN evd.verified THEN 1 ELSE 0 END) AS verified_count,
  ev.created_at
FROM benefits.events ev
JOIN hr.employees emp ON ev.employee_id = emp.id
LEFT JOIN benefits.evidence evd ON ev.id = evd.event_id
GROUP BY ev.id, emp.first_name, emp.last_name;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample carrier
INSERT INTO benefits.carriers (tenant_id, name, edi_sender_id, contact, active)
SELECT 
  t.id,
  'Blue Cross Blue Shield',
  'BCBS001',
  '{"email": "benefits@bcbs.com", "phone": "1-800-555-0100", "portal_url": "https://portal.bcbs.com"}',
  true
FROM app.tenants t
WHERE t.slug = 'demo'
ON CONFLICT DO NOTHING;

-- Insert sample payroll provider
INSERT INTO payroll.providers (tenant_id, key, name, region, active)
SELECT 
  t.id,
  'adp',
  'ADP Workforce Now',
  'US',
  true
FROM app.tenants t
WHERE t.slug = 'demo'
ON CONFLICT DO NOTHING;
