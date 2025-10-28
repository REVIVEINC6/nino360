-- Phase 22: HRMS Compliance Management
-- Comprehensive compliance hub with frameworks, controls, evidence, exceptions, and packs

-- ============================================================================
-- SCHEMA: compliance
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS compliance;

-- ============================================================================
-- TABLE: compliance.frameworks
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key text NOT NULL, -- e.g., 'SOC2_PEOPLE', 'ISO27001_A7'
  name text NOT NULL,
  version text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_frameworks_tenant ON compliance.frameworks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_frameworks_key ON compliance.frameworks(key);

-- ============================================================================
-- TABLE: compliance.controls
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  framework_id uuid NOT NULL REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
  key text NOT NULL, -- e.g., 'CC2.2', 'A.7.1.1'
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES app.users(id) ON DELETE SET NULL,
  evidence_required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, framework_id, key)
);

CREATE INDEX IF NOT EXISTS idx_controls_tenant ON compliance.controls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_controls_framework ON compliance.controls(framework_id);
CREATE INDEX IF NOT EXISTS idx_controls_owner ON compliance.controls(owner_id);

-- ============================================================================
-- TABLE: compliance.control_mappings
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.control_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  control_id uuid NOT NULL REFERENCES compliance.controls(id) ON DELETE CASCADE,
  artifact_type text NOT NULL CHECK (artifact_type IN ('POLICY', 'TRAINING', 'I9', 'IMMIGRATION', 'RETENTION', 'DOC', 'BACKGROUND')),
  artifact_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'PASS' CHECK (status IN ('PASS', 'FAIL', 'PARTIAL', 'NA')),
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_control_mappings_tenant ON compliance.control_mappings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_control_mappings_control ON compliance.control_mappings(control_id);
CREATE INDEX IF NOT EXISTS idx_control_mappings_artifact ON compliance.control_mappings(artifact_type, artifact_id);

-- ============================================================================
-- TABLE: compliance.tasks
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('POLICY_ACK', 'TRAINING', 'I9', 'IMMIGRATION', 'RETENTION', 'DOC_REVIEW', 'BACKGROUND')),
  subject_employee_id uuid NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES app.users(id) ON DELETE SET NULL,
  due_at timestamptz,
  state text NOT NULL DEFAULT 'OPEN' CHECK (state IN ('OPEN', 'DONE', 'BLOCKED')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant ON compliance.tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_kind ON compliance.tasks(kind);
CREATE INDEX IF NOT EXISTS idx_tasks_subject ON compliance.tasks(subject_employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON compliance.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_state ON compliance.tasks(state);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON compliance.tasks(due_at) WHERE state = 'OPEN';

-- ============================================================================
-- TABLE: compliance.exceptions
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  control_id uuid REFERENCES compliance.controls(id) ON DELETE SET NULL,
  context jsonb NOT NULL DEFAULT '{}',
  risk text NOT NULL CHECK (risk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  opened_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MITIGATED', 'WAIVED', 'CLOSED')),
  approver_id uuid REFERENCES app.users(id) ON DELETE SET NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exceptions_tenant ON compliance.exceptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_exceptions_control ON compliance.exceptions(control_id);
CREATE INDEX IF NOT EXISTS idx_exceptions_status ON compliance.exceptions(status);
CREATE INDEX IF NOT EXISTS idx_exceptions_risk ON compliance.exceptions(risk);

-- ============================================================================
-- TABLE: compliance.evidence
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  control_id uuid NOT NULL REFERENCES compliance.controls(id) ON DELETE CASCADE,
  document_id uuid REFERENCES hrms.documents(id) ON DELETE SET NULL,
  title text NOT NULL,
  url text,
  sha256 text,
  gathered_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_tenant ON compliance.evidence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_evidence_control ON compliance.evidence(control_id);
CREATE INDEX IF NOT EXISTS idx_evidence_document ON compliance.evidence(document_id);
CREATE INDEX IF NOT EXISTS idx_evidence_expires ON compliance.evidence(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- TABLE: compliance.packs
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance.packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key text NOT NULL,
  name text NOT NULL,
  scope jsonb NOT NULL DEFAULT '{}',
  zip_url text,
  sha256 text,
  notarized_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_packs_tenant ON compliance.packs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_packs_key ON compliance.packs(key);

-- ============================================================================
-- TABLE: background.checks
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS background;

CREATE TABLE IF NOT EXISTS background.checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  provider text,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CLEAR', 'CONSIDER', 'FAILED')),
  ordered_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  report_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_background_checks_tenant ON background.checks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_background_checks_employee ON background.checks(employee_id);
CREATE INDEX IF NOT EXISTS idx_background_checks_status ON background.checks(status);

-- ============================================================================
-- TABLE: hrms.work_authorizations
-- ============================================================================

CREATE TABLE IF NOT EXISTS hrms.work_authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  class text NOT NULL, -- e.g., 'H1B', 'L1', 'TN', 'GC', 'CITIZEN'
  start_date date NOT NULL,
  end_date date,
  verified boolean NOT NULL DEFAULT false,
  document_id uuid REFERENCES hrms.documents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_authorizations_tenant ON hrms.work_authorizations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_work_authorizations_employee ON hrms.work_authorizations(employee_id);
CREATE INDEX IF NOT EXISTS idx_work_authorizations_end_date ON hrms.work_authorizations(end_date) WHERE end_date IS NOT NULL;

-- ============================================================================
-- TABLE: lms.enrollments (if not exists)
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS lms;

CREATE TABLE IF NOT EXISTS lms.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  course_key text NOT NULL,
  status text NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_tenant ON lms.enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee ON lms.enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON lms.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_due ON lms.enrollments(due_at) WHERE status IN ('ENROLLED', 'IN_PROGRESS');

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE compliance.frameworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY frameworks_tenant_isolation ON compliance.frameworks
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY controls_tenant_isolation ON compliance.controls
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.control_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY control_mappings_tenant_isolation ON compliance.control_mappings
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_tenant_isolation ON compliance.tasks
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY exceptions_tenant_isolation ON compliance.exceptions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY evidence_tenant_isolation ON compliance.evidence
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE compliance.packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY packs_tenant_isolation ON compliance.packs
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE background.checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY background_checks_tenant_isolation ON background.checks
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE hrms.work_authorizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY work_authorizations_tenant_isolation ON hrms.work_authorizations
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

ALTER TABLE lms.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollments_tenant_isolation ON lms.enrollments
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Policy acknowledgment trend
CREATE OR REPLACE VIEW compliance.vw_policy_ack_trend AS
SELECT
  pa.tenant_id,
  date_trunc('week', pa.due_at) AS week,
  COUNT(*) AS assigned,
  COUNT(*) FILTER (WHERE pa.status = 'ACKNOWLEDGED') AS acknowledged
FROM hrms.policy_assignments pa
WHERE pa.due_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY pa.tenant_id, date_trunc('week', pa.due_at);

-- Training completion trend
CREATE OR REPLACE VIEW compliance.vw_training_completion AS
SELECT
  e.tenant_id,
  date_trunc('week', e.due_at) AS week,
  COUNT(*) AS due,
  COUNT(*) FILTER (WHERE e.status = 'COMPLETED') AS completed,
  COUNT(*) FILTER (WHERE e.status = 'OVERDUE') AS overdue
FROM lms.enrollments e
WHERE e.due_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY e.tenant_id, date_trunc('week', e.due_at);

-- I-9 on-time completion
CREATE OR REPLACE VIEW compliance.vw_i9_on_time AS
SELECT
  i9.tenant_id,
  date_trunc('week', i9.hire_date) AS week,
  COUNT(*) AS due,
  COUNT(*) FILTER (WHERE i9.section1_completed_at <= i9.hire_date AND i9.section2_examined_at <= i9.hire_date + INTERVAL '3 days') AS on_time
FROM hrms.i9_records i9
WHERE i9.hire_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY i9.tenant_id, date_trunc('week', i9.hire_date);

-- Expiries within 30 days
CREATE OR REPLACE VIEW compliance.vw_expiries_30d AS
SELECT
  tenant_id,
  'WORK_AUTH' AS kind,
  COUNT(*) AS count
FROM hrms.work_authorizations
WHERE end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY tenant_id
UNION ALL
SELECT
  tenant_id,
  'EVIDENCE' AS kind,
  COUNT(*) AS count
FROM compliance.evidence
WHERE expires_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY tenant_id;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
CREATE OR REPLACE FUNCTION compliance.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_frameworks_updated_at BEFORE UPDATE ON compliance.frameworks
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_controls_updated_at BEFORE UPDATE ON compliance.controls
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_control_mappings_updated_at BEFORE UPDATE ON compliance.control_mappings
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON compliance.tasks
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_exceptions_updated_at BEFORE UPDATE ON compliance.exceptions
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_evidence_updated_at BEFORE UPDATE ON compliance.evidence
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_packs_updated_at BEFORE UPDATE ON compliance.packs
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_background_checks_updated_at BEFORE UPDATE ON background.checks
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_work_authorizations_updated_at BEFORE UPDATE ON hrms.work_authorizations
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

CREATE TRIGGER trg_enrollments_updated_at BEFORE UPDATE ON lms.enrollments
  FOR EACH ROW EXECUTE FUNCTION compliance.update_updated_at();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed common frameworks (will be inserted per tenant via app logic)
-- INSERT INTO compliance.frameworks (tenant_id, key, name, version, description) VALUES
-- ('tenant-uuid', 'SOC2_PEOPLE', 'SOC 2 Type II - People Controls', '2023', 'Trust Services Criteria for People'),
-- ('tenant-uuid', 'ISO27001_A7', 'ISO 27001:2022 - A.7 Human Resource Security', '2022', 'Information security aspects of human resource management');

COMMENT ON SCHEMA compliance IS 'Phase 22: Compliance management with frameworks, controls, evidence, exceptions, and packs';
