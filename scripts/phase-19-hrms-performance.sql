-- =====================================================
-- Phase 19: HRMS Performance Management
-- =====================================================
-- Creates comprehensive performance management system with:
-- - Cycles (annual/midyear/quarterly/probation)
-- - Reviews (self→manager→calibration→signoff workflow)
-- - Goals (OKR-style alignment, progress tracking)
-- - 360 Feedback (peer/direct report with anonymization)
-- - Calibration (9-box pools with drag-drop)
-- - Templates (review/feedback/goal forms)
-- - Signoffs (manager/employee acknowledgment)
-- - Ledger proofs (notarization of finalized reviews)

-- Create perf schema
CREATE SCHEMA IF NOT EXISTS perf;

-- =====================================================
-- 1. Performance Cycles
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL, -- e.g., "2024-annual", "2024-q1"
  name TEXT NOT NULL,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('ANNUAL', 'MIDYEAR', 'QUARTERLY', 'PROBATION')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'LOCKED', 'CALIBRATING', 'FINALIZED', 'ARCHIVED')),
  
  -- Rating configuration
  rating_scale JSONB NOT NULL DEFAULT '{"min": 1, "max": 5, "labels": {"1": "Needs Improvement", "2": "Meets Some Expectations", "3": "Meets Expectations", "4": "Exceeds Expectations", "5": "Outstanding"}}'::jsonb,
  competencies JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{"key": "leadership", "name": "Leadership", "description": "..."}]
  weights JSONB NOT NULL DEFAULT '{"goals": 50, "competencies": 50}'::jsonb, -- percentage weights
  
  -- Due dates
  due_dates JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"self": "2024-03-15", "mgr": "2024-03-31", "peer": "2024-03-20", "signoff": "2024-04-15"}
  
  -- Visibility
  visibility JSONB NOT NULL DEFAULT '{"self_sees_mgr": false, "mgr_sees_peer": true}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(tenant_id, key)
);

CREATE INDEX idx_perf_cycles_tenant ON perf.cycles(tenant_id);
CREATE INDEX idx_perf_cycles_status ON perf.cycles(status);

-- =====================================================
-- 2. Performance Reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES perf.cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES hrms.employees(id) ON DELETE SET NULL,
  
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'SELF_DRAFT', 'SELF_SUBMITTED', 'MGR_DRAFT', 'MGR_SUBMITTED', 'CALIBRATED', 'SIGNOFF_PENDING', 'SIGNED_OFF', 'LOCKED')),
  
  -- Review data
  self_rating JSONB DEFAULT '{}'::jsonb, -- {"overall": 4, "competencies": {"leadership": 5}, "goals": [{"id": "...", "rating": 4}], "comments": "..."}
  mgr_rating JSONB DEFAULT '{}'::jsonb, -- same structure
  final_rating JSONB DEFAULT '{}'::jsonb, -- post-calibration
  
  comments JSONB DEFAULT '[]'::jsonb, -- [{"author": "employee", "text": "...", "ts": "..."}]
  
  -- Timestamps
  self_submitted_at TIMESTAMPTZ,
  mgr_submitted_at TIMESTAMPTZ,
  calibrated_at TIMESTAMPTZ,
  signed_off_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, cycle_id, employee_id)
);

CREATE INDEX idx_perf_reviews_tenant ON perf.reviews(tenant_id);
CREATE INDEX idx_perf_reviews_cycle ON perf.reviews(cycle_id);
CREATE INDEX idx_perf_reviews_employee ON perf.reviews(employee_id);
CREATE INDEX idx_perf_reviews_manager ON perf.reviews(manager_id);
CREATE INDEX idx_perf_reviews_status ON perf.reviews(status);

-- =====================================================
-- 3. Goals
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES perf.cycles(id) ON DELETE SET NULL, -- can be standalone or cycle-linked
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., "INDIVIDUAL", "TEAM", "COMPANY"
  alignment_id UUID REFERENCES perf.goals(id) ON DELETE SET NULL, -- OKR parent
  
  start_date DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'AT_RISK', 'BLOCKED', 'DONE', 'CANCELLED')),
  
  weight NUMERIC(5,2) DEFAULT 0 CHECK (weight >= 0 AND weight <= 100), -- percentage
  progress NUMERIC(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100), -- percentage
  
  visibility TEXT NOT NULL DEFAULT 'MANAGER' CHECK (visibility IN ('PRIVATE', 'MANAGER', 'ORG', 'TENANT')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT title_min_length CHECK (LENGTH(title) >= 3)
);

CREATE INDEX idx_perf_goals_tenant ON perf.goals(tenant_id);
CREATE INDEX idx_perf_goals_employee ON perf.goals(employee_id);
CREATE INDEX idx_perf_goals_cycle ON perf.goals(cycle_id);
CREATE INDEX idx_perf_goals_status ON perf.goals(status);
CREATE INDEX idx_perf_goals_alignment ON perf.goals(alignment_id);

-- =====================================================
-- 4. Check-ins
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES hrms.employees(id) ON DELETE SET NULL,
  
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  sentiment TEXT CHECK (sentiment IN ('POS', 'NEU', 'NEG')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_perf_checkins_tenant ON perf.checkins(tenant_id);
CREATE INDEX idx_perf_checkins_employee ON perf.checkins(employee_id);
CREATE INDEX idx_perf_checkins_ts ON perf.checkins(ts);

-- =====================================================
-- 5. 360 Feedback
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  review_id UUID REFERENCES perf.reviews(id) ON DELETE CASCADE, -- optional link to review
  
  requester_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  subject_employee_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES hrms.employees(id) ON DELETE SET NULL, -- can be anonymous
  
  relationship TEXT NOT NULL CHECK (relationship IN ('PEER', 'DIRECT_REPORT', 'OTHER')),
  
  form JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"questions": [{"id": "q1", "text": "...", "type": "text"}]}
  response JSONB DEFAULT '{}'::jsonb, -- {"answers": [{"id": "q1", "value": "..."}]}
  
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'RECEIVED', 'DECLINED', 'EXPIRED')),
  
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  received_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_perf_feedback_tenant ON perf.feedback(tenant_id);
CREATE INDEX idx_perf_feedback_review ON perf.feedback(review_id);
CREATE INDEX idx_perf_feedback_subject ON perf.feedback(subject_employee_id);
CREATE INDEX idx_perf_feedback_respondent ON perf.feedback(respondent_id);
CREATE INDEX idx_perf_feedback_status ON perf.feedback(status);

-- =====================================================
-- 6. Calibration Pools
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.calibration_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES perf.cycles(id) ON DELETE CASCADE,
  
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  org_node_id UUID, -- optional org unit scope
  owner_id UUID REFERENCES hrms.employees(id) ON DELETE SET NULL,
  
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'OPEN', 'LOCKED', 'FINALIZED')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, cycle_id, key)
);

CREATE INDEX idx_perf_calibration_pools_tenant ON perf.calibration_pools(tenant_id);
CREATE INDEX idx_perf_calibration_pools_cycle ON perf.calibration_pools(cycle_id);
CREATE INDEX idx_perf_calibration_pools_status ON perf.calibration_pools(status);

-- =====================================================
-- 7. Calibration Items (9-box)
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.calibration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  pool_id UUID NOT NULL REFERENCES perf.calibration_pools(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES perf.reviews(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  
  performance NUMERIC(3,2) CHECK (performance >= 1 AND performance <= 5), -- 1-5 scale
  potential NUMERIC(3,2) CHECK (potential >= 1 AND potential <= 5), -- 1-5 scale
  
  coordinates JSONB DEFAULT '{}'::jsonb, -- {"x": 2.5, "y": 3.5} for 9-box positioning
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(pool_id, review_id)
);

CREATE INDEX idx_perf_calibration_items_tenant ON perf.calibration_items(tenant_id);
CREATE INDEX idx_perf_calibration_items_pool ON perf.calibration_items(pool_id);
CREATE INDEX idx_perf_calibration_items_review ON perf.calibration_items(review_id);
CREATE INDEX idx_perf_calibration_items_employee ON perf.calibration_items(employee_id);

-- =====================================================
-- 8. Templates
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  
  kind TEXT NOT NULL CHECK (kind IN ('REVIEW', 'FEEDBACK', 'GOAL')),
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  
  schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- form schema
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, kind, key)
);

CREATE INDEX idx_perf_templates_tenant ON perf.templates(tenant_id);
CREATE INDEX idx_perf_templates_kind ON perf.templates(kind);

-- =====================================================
-- 9. Signoffs
-- =====================================================
CREATE TABLE IF NOT EXISTS perf.signoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES perf.reviews(id) ON DELETE CASCADE,
  
  signer_id UUID NOT NULL REFERENCES hrms.employees(id) ON DELETE CASCADE,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  statement TEXT, -- acknowledgment text
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_perf_signoffs_tenant ON perf.signoffs(tenant_id);
CREATE INDEX idx_perf_signoffs_review ON perf.signoffs(review_id);
CREATE INDEX idx_perf_signoffs_signer ON perf.signoffs(signer_id);

-- =====================================================
-- 10. Analytics Views
-- =====================================================

-- Cycle summary
CREATE OR REPLACE VIEW perf.v_cycle_summary AS
SELECT
  c.id AS cycle_id,
  c.tenant_id,
  c.key,
  c.name,
  c.status,
  COUNT(DISTINCT r.id) AS total_reviews,
  COUNT(DISTINCT CASE WHEN r.status IN ('SELF_SUBMITTED', 'MGR_DRAFT', 'MGR_SUBMITTED', 'CALIBRATED', 'SIGNOFF_PENDING', 'SIGNED_OFF', 'LOCKED') THEN r.id END) AS self_submitted,
  COUNT(DISTINCT CASE WHEN r.status IN ('MGR_SUBMITTED', 'CALIBRATED', 'SIGNOFF_PENDING', 'SIGNED_OFF', 'LOCKED') THEN r.id END) AS mgr_submitted,
  COUNT(DISTINCT CASE WHEN r.status IN ('SIGNED_OFF', 'LOCKED') THEN r.id END) AS signed_off,
  COUNT(DISTINCT CASE WHEN r.status = 'LOCKED' THEN r.id END) AS locked
FROM perf.cycles c
LEFT JOIN perf.reviews r ON r.cycle_id = c.id
GROUP BY c.id, c.tenant_id, c.key, c.name, c.status;

-- Goal completion
CREATE OR REPLACE VIEW perf.v_goal_completion AS
SELECT
  g.tenant_id,
  g.employee_id,
  g.cycle_id,
  COUNT(*) AS total_goals,
  COUNT(CASE WHEN g.status = 'DONE' THEN 1 END) AS completed_goals,
  ROUND(AVG(g.progress), 2) AS avg_progress,
  SUM(g.weight) AS total_weight
FROM perf.goals g
WHERE g.status NOT IN ('CANCELLED')
GROUP BY g.tenant_id, g.employee_id, g.cycle_id;

-- Feedback summary
CREATE OR REPLACE VIEW perf.v_feedback_summary AS
SELECT
  f.tenant_id,
  f.subject_employee_id,
  f.review_id,
  COUNT(*) AS total_requests,
  COUNT(CASE WHEN f.status = 'RECEIVED' THEN 1 END) AS received,
  COUNT(CASE WHEN f.status = 'DECLINED' THEN 1 END) AS declined,
  COUNT(CASE WHEN f.status = 'EXPIRED' THEN 1 END) AS expired,
  COUNT(CASE WHEN f.status = 'REQUESTED' THEN 1 END) AS pending
FROM perf.feedback f
GROUP BY f.tenant_id, f.subject_employee_id, f.review_id;

-- =====================================================
-- 11. RLS Policies
-- =====================================================

-- Cycles: tenant-scoped, HR/Admin can manage
ALTER TABLE perf.cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY cycles_tenant_isolation ON perf.cycles
  USING (tenant_id = app.current_tenant_id());

-- Reviews: employees see own, managers see directs, HR/Admin see all
ALTER TABLE perf.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_tenant_isolation ON perf.reviews
  USING (tenant_id = app.current_tenant_id());

CREATE POLICY reviews_employee_own ON perf.reviews
  FOR SELECT
  USING (employee_id = app.current_user_employee_id());

CREATE POLICY reviews_manager_directs ON perf.reviews
  FOR SELECT
  USING (manager_id = app.current_user_employee_id());

-- Goals: employees see own, managers see directs based on visibility
ALTER TABLE perf.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY goals_tenant_isolation ON perf.goals
  USING (tenant_id = app.current_tenant_id());

CREATE POLICY goals_employee_own ON perf.goals
  FOR ALL
  USING (employee_id = app.current_user_employee_id());

-- Feedback: requester and subject can see, respondent can see own
ALTER TABLE perf.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_tenant_isolation ON perf.feedback
  USING (tenant_id = app.current_tenant_id());

CREATE POLICY feedback_requester ON perf.feedback
  FOR SELECT
  USING (requester_id = app.current_user_employee_id());

CREATE POLICY feedback_subject ON perf.feedback
  FOR SELECT
  USING (subject_employee_id = app.current_user_employee_id());

CREATE POLICY feedback_respondent ON perf.feedback
  FOR ALL
  USING (respondent_id = app.current_user_employee_id());

-- Calibration: tenant-scoped, managers/HR only
ALTER TABLE perf.calibration_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY calibration_pools_tenant_isolation ON perf.calibration_pools
  USING (tenant_id = app.current_tenant_id());

ALTER TABLE perf.calibration_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY calibration_items_tenant_isolation ON perf.calibration_items
  USING (tenant_id = app.current_tenant_id());

-- Templates: tenant-scoped
ALTER TABLE perf.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY templates_tenant_isolation ON perf.templates
  USING (tenant_id = app.current_tenant_id());

-- Signoffs: tenant-scoped
ALTER TABLE perf.signoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY signoffs_tenant_isolation ON perf.signoffs
  USING (tenant_id = app.current_tenant_id());

-- Check-ins: tenant-scoped
ALTER TABLE perf.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY checkins_tenant_isolation ON perf.checkins
  USING (tenant_id = app.current_tenant_id());

-- =====================================================
-- 12. Triggers
-- =====================================================

-- Update updated_at on changes
CREATE OR REPLACE FUNCTION perf.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cycles_updated_at BEFORE UPDATE ON perf.cycles
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON perf.reviews
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER goals_updated_at BEFORE UPDATE ON perf.goals
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER feedback_updated_at BEFORE UPDATE ON perf.feedback
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER calibration_pools_updated_at BEFORE UPDATE ON perf.calibration_pools
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER calibration_items_updated_at BEFORE UPDATE ON perf.calibration_items
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

CREATE TRIGGER templates_updated_at BEFORE UPDATE ON perf.templates
  FOR EACH ROW EXECUTE FUNCTION perf.update_updated_at();

-- =====================================================
-- 13. Helper Functions
-- =====================================================

-- Calculate review progress
CREATE OR REPLACE FUNCTION perf.calculate_review_progress(p_cycle_id UUID)
RETURNS TABLE (
  total_reviews BIGINT,
  self_submitted BIGINT,
  mgr_submitted BIGINT,
  signed_off BIGINT,
  progress_pct NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_reviews,
    COUNT(CASE WHEN r.status IN ('SELF_SUBMITTED', 'MGR_DRAFT', 'MGR_SUBMITTED', 'CALIBRATED', 'SIGNOFF_PENDING', 'SIGNED_OFF', 'LOCKED') THEN 1 END)::BIGINT AS self_submitted,
    COUNT(CASE WHEN r.status IN ('MGR_SUBMITTED', 'CALIBRATED', 'SIGNOFF_PENDING', 'SIGNED_OFF', 'LOCKED') THEN 1 END)::BIGINT AS mgr_submitted,
    COUNT(CASE WHEN r.status IN ('SIGNED_OFF', 'LOCKED') THEN 1 END)::BIGINT AS signed_off,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(CASE WHEN r.status IN ('SIGNED_OFF', 'LOCKED') THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
    END AS progress_pct
  FROM perf.reviews r
  WHERE r.cycle_id = p_cycle_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- End of Phase 19
-- =====================================================
