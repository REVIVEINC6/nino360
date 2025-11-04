-- =====================================================
-- HRMS Performance Management Schema
-- =====================================================

-- Performance Cycles
CREATE TABLE IF NOT EXISTS perf_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('ANNUAL', 'MIDYEAR', 'QUARTERLY', 'PROBATION')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'LOCKED', 'FINALIZED')),
  rating_scale JSONB NOT NULL DEFAULT '{"min": 1, "max": 5, "labels": {"1": "Needs Improvement", "2": "Meets Expectations", "3": "Exceeds Expectations", "4": "Outstanding", "5": "Exceptional"}}',
  competencies JSONB NOT NULL DEFAULT '[]',
  weights JSONB NOT NULL DEFAULT '{"goals": 60, "competencies": 40}',
  due_dates JSONB,
  visibility JSONB NOT NULL DEFAULT '{"self_sees_mgr": false, "mgr_sees_peer": true}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_perf_cycles_tenant ON perf_cycles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_cycles_status ON perf_cycles(status);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS perf_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES perf_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES hrms_employees(id),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'SELF_DRAFT', 'SELF_SUBMITTED', 'MGR_DRAFT', 'MGR_SUBMITTED', 'CALIBRATED', 'SIGNED_OFF')),
  self_rating JSONB,
  mgr_rating JSONB,
  final_rating JSONB,
  self_submitted_at TIMESTAMPTZ,
  mgr_submitted_at TIMESTAMPTZ,
  calibrated_at TIMESTAMPTZ,
  signed_off_at TIMESTAMPTZ,
  ai_insights JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, cycle_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_perf_reviews_tenant ON perf_reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_cycle ON perf_reviews(cycle_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_employee ON perf_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_status ON perf_reviews(status);

-- Performance Goals
CREATE TABLE IF NOT EXISTS perf_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES perf_cycles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  alignment_id UUID REFERENCES perf_goals(id),
  start_date DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'AT_RISK', 'BLOCKED', 'DONE', 'CANCELLED')),
  weight NUMERIC(5,2) NOT NULL DEFAULT 0,
  progress NUMERIC(5,2) NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'MANAGER' CHECK (visibility IN ('PRIVATE', 'MANAGER', 'ORG', 'TENANT')),
  ai_suggestions JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_goals_tenant ON perf_goals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_goals_employee ON perf_goals(employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_goals_cycle ON perf_goals(cycle_id);
CREATE INDEX IF NOT EXISTS idx_perf_goals_status ON perf_goals(status);

-- 360 Feedback
CREATE TABLE IF NOT EXISTS perf_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES hrms_employees(id),
  subject_employee_id UUID NOT NULL REFERENCES hrms_employees(id),
  review_id UUID REFERENCES perf_reviews(id),
  relationship TEXT NOT NULL CHECK (relationship IN ('PEER', 'DIRECT_REPORT', 'OTHER')),
  form JSONB NOT NULL,
  response JSONB,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'DECLINED')),
  due_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  ai_sentiment JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_feedback_tenant ON perf_feedback(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_feedback_subject ON perf_feedback(subject_employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_feedback_status ON perf_feedback(status);

-- Calibration Pools
CREATE TABLE IF NOT EXISTS perf_calibration_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES perf_cycles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  org_node_id UUID,
  owner_id UUID REFERENCES hrms_employees(id),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'COMPLETED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, cycle_id, key)
);

CREATE INDEX IF NOT EXISTS idx_perf_calibration_pools_tenant ON perf_calibration_pools(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_calibration_pools_cycle ON perf_calibration_pools(cycle_id);

-- Calibration Items (Nine-Box)
CREATE TABLE IF NOT EXISTS perf_calibration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pool_id UUID NOT NULL REFERENCES perf_calibration_pools(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES perf_reviews(id),
  employee_id UUID NOT NULL REFERENCES hrms_employees(id),
  performance NUMERIC(3,2),
  potential NUMERIC(3,2),
  coordinates JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pool_id, review_id)
);

CREATE INDEX IF NOT EXISTS idx_perf_calibration_items_tenant ON perf_calibration_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_calibration_items_pool ON perf_calibration_items(pool_id);

-- Performance Signoffs
CREATE TABLE IF NOT EXISTS perf_signoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES perf_reviews(id) ON DELETE CASCADE,
  signer_id UUID NOT NULL REFERENCES hrms_employees(id),
  statement TEXT,
  signature_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_signoffs_tenant ON perf_signoffs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_signoffs_review ON perf_signoffs(review_id);

-- Performance Templates
CREATE TABLE IF NOT EXISTS perf_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('REVIEW', 'FEEDBACK', 'GOAL')),
  schema JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_perf_templates_tenant ON perf_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_templates_kind ON perf_templates(kind);

-- Triggers
CREATE OR REPLACE FUNCTION update_perf_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER perf_cycles_updated_at BEFORE UPDATE ON perf_cycles FOR EACH ROW EXECUTE FUNCTION update_perf_updated_at();
CREATE TRIGGER perf_reviews_updated_at BEFORE UPDATE ON perf_reviews FOR EACH ROW EXECUTE FUNCTION update_perf_updated_at();
CREATE TRIGGER perf_goals_updated_at BEFORE UPDATE ON perf_goals FOR EACH ROW EXECUTE FUNCTION update_perf_updated_at();
CREATE TRIGGER perf_feedback_updated_at BEFORE UPDATE ON perf_feedback FOR EACH ROW EXECUTE FUNCTION update_perf_updated_at();

-- RLS Policies
ALTER TABLE perf_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_calibration_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_calibration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_signoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE perf_templates ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO perf_cycles (tenant_id, key, name, period_from, period_to, kind, status) VALUES
((SELECT id FROM tenants LIMIT 1), 'FY2025-ANNUAL', '2025 Annual Review', '2025-01-01', '2025-12-31', 'ANNUAL', 'PUBLISHED'),
((SELECT id FROM tenants LIMIT 1), 'Q1-2025', 'Q1 2025 Review', '2025-01-01', '2025-03-31', 'QUARTERLY', 'PUBLISHED')
ON CONFLICT DO NOTHING;
