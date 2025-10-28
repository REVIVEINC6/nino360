-- ============================================================================
-- HRMS Compliance Schema
-- ============================================================================
-- Comprehensive compliance management with obligations, tasks, evidence,
-- controls, frameworks, exceptions, and audit packs with blockchain verification

-- Drop existing tables if they exist
DROP TABLE IF EXISTS compliance_packs CASCADE;
DROP TABLE IF EXISTS compliance_exceptions CASCADE;
DROP TABLE IF EXISTS compliance_control_mappings CASCADE;
DROP TABLE IF EXISTS compliance_evidence CASCADE;
DROP TABLE IF EXISTS compliance_controls CASCADE;
DROP TABLE IF EXISTS compliance_frameworks CASCADE;
DROP TABLE IF EXISTS compliance_tasks CASCADE;
DROP TABLE IF EXISTS compliance_obligations CASCADE;

-- ============================================================================
-- Compliance Frameworks
-- ============================================================================
CREATE TABLE compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,
  effective_date DATE,
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

-- ============================================================================
-- Compliance Controls
-- ============================================================================
CREATE TABLE compliance_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  owner_id UUID,
  evidence_required BOOLEAN DEFAULT true,
  testing_frequency TEXT, -- ANNUAL, QUARTERLY, MONTHLY
  last_tested_at TIMESTAMPTZ,
  next_test_due TIMESTAMPTZ,
  status TEXT DEFAULT 'PENDING', -- PENDING, PASS, FAIL, NOT_APPLICABLE
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, framework_id, key)
);

-- ============================================================================
-- Compliance Evidence
-- ============================================================================
CREATE TABLE compliance_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  control_id UUID REFERENCES compliance_controls(id) ON DELETE CASCADE,
  document_id UUID,
  title TEXT NOT NULL,
  url TEXT,
  sha256 TEXT,
  gathered_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  notarized_hash TEXT,
  blockchain_tx TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Compliance Control Mappings
-- ============================================================================
CREATE TABLE compliance_control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  control_id UUID REFERENCES compliance_controls(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL, -- POLICY, TRAINING, I9, IMMIGRATION, RETENTION, DOC, BACKGROUND
  artifact_id UUID NOT NULL,
  status TEXT DEFAULT 'PASS', -- PASS, FAIL, PENDING
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, control_id, artifact_type, artifact_id)
);

-- ============================================================================
-- Compliance Obligations
-- ============================================================================
CREATE TABLE compliance_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  kind TEXT NOT NULL, -- POLICY_ACK, TRAINING, I9, IMMIGRATION, RETENTION, DOC_REVIEW, BACKGROUND
  subject_employee_id UUID,
  assignee_id UUID,
  due_at TIMESTAMPTZ,
  state TEXT DEFAULT 'OPEN', -- OPEN, DONE, BLOCKED
  completed_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Compliance Tasks
-- ============================================================================
CREATE TABLE compliance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  obligation_id UUID REFERENCES compliance_obligations(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  subject_employee_id UUID,
  assignee_id UUID,
  due_at TIMESTAMPTZ,
  state TEXT DEFAULT 'OPEN', -- OPEN, DONE, BLOCKED
  completed_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Compliance Exceptions
-- ============================================================================
CREATE TABLE compliance_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  control_id UUID REFERENCES compliance_controls(id) ON DELETE SET NULL,
  context JSONB DEFAULT '{}',
  risk TEXT NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  status TEXT DEFAULT 'OPEN', -- OPEN, MITIGATED, WAIVED, CLOSED
  reason TEXT NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  approver_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Compliance Packs (Audit Evidence Packages)
-- ============================================================================
CREATE TABLE compliance_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  scope JSONB DEFAULT '{}',
  zip_url TEXT,
  sha256 TEXT,
  notarized_hash TEXT,
  blockchain_tx TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX idx_compliance_frameworks_tenant ON compliance_frameworks(tenant_id);
CREATE INDEX idx_compliance_controls_tenant ON compliance_controls(tenant_id);
CREATE INDEX idx_compliance_controls_framework ON compliance_controls(framework_id);
CREATE INDEX idx_compliance_evidence_tenant ON compliance_evidence(tenant_id);
CREATE INDEX idx_compliance_evidence_control ON compliance_evidence(control_id);
CREATE INDEX idx_compliance_control_mappings_tenant ON compliance_control_mappings(tenant_id);
CREATE INDEX idx_compliance_control_mappings_control ON compliance_control_mappings(control_id);
CREATE INDEX idx_compliance_obligations_tenant ON compliance_obligations(tenant_id);
CREATE INDEX idx_compliance_obligations_state ON compliance_obligations(state);
CREATE INDEX idx_compliance_tasks_tenant ON compliance_tasks(tenant_id);
CREATE INDEX idx_compliance_tasks_state ON compliance_tasks(state);
CREATE INDEX idx_compliance_exceptions_tenant ON compliance_exceptions(tenant_id);
CREATE INDEX idx_compliance_exceptions_status ON compliance_exceptions(status);
CREATE INDEX idx_compliance_packs_tenant ON compliance_packs(tenant_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================
ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_control_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_packs ENABLE ROW LEVEL SECURITY;

-- Frameworks policies
CREATE POLICY compliance_frameworks_tenant_isolation ON compliance_frameworks
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Controls policies
CREATE POLICY compliance_controls_tenant_isolation ON compliance_controls
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Evidence policies
CREATE POLICY compliance_evidence_tenant_isolation ON compliance_evidence
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Control mappings policies
CREATE POLICY compliance_control_mappings_tenant_isolation ON compliance_control_mappings
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Obligations policies
CREATE POLICY compliance_obligations_tenant_isolation ON compliance_obligations
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Tasks policies
CREATE POLICY compliance_tasks_tenant_isolation ON compliance_tasks
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Exceptions policies
CREATE POLICY compliance_exceptions_tenant_isolation ON compliance_exceptions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Packs policies
CREATE POLICY compliance_packs_tenant_isolation ON compliance_packs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ============================================================================
-- Triggers
-- ============================================================================
CREATE TRIGGER update_compliance_frameworks_updated_at
  BEFORE UPDATE ON compliance_frameworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_controls_updated_at
  BEFORE UPDATE ON compliance_controls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_evidence_updated_at
  BEFORE UPDATE ON compliance_evidence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_control_mappings_updated_at
  BEFORE UPDATE ON compliance_control_mappings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_obligations_updated_at
  BEFORE UPDATE ON compliance_obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_tasks_updated_at
  BEFORE UPDATE ON compliance_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_exceptions_updated_at
  BEFORE UPDATE ON compliance_exceptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_packs_updated_at
  BEFORE UPDATE ON compliance_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Sample Data
-- ============================================================================
-- Insert sample frameworks
INSERT INTO compliance_frameworks (tenant_id, key, name, description, version, effective_date) VALUES
  ('00000000-0000-0000-0000-000000000000', 'SOC2', 'SOC 2 Type II', 'Service Organization Control 2', '2023', '2023-01-01'),
  ('00000000-0000-0000-0000-000000000000', 'ISO27001', 'ISO 27001', 'Information Security Management', '2022', '2022-01-01'),
  ('00000000-0000-0000-0000-000000000000', 'GDPR', 'GDPR', 'General Data Protection Regulation', '2018', '2018-05-25');

-- Insert sample controls
INSERT INTO compliance_controls (tenant_id, framework_id, key, name, description, category, evidence_required, testing_frequency, status) VALUES
  ('00000000-0000-0000-0000-000000000000', (SELECT id FROM compliance_frameworks WHERE key = 'SOC2' LIMIT 1), 'CC1.1', 'COSO Principle 1', 'Organization demonstrates commitment to integrity and ethical values', 'Control Environment', true, 'ANNUAL', 'PASS'),
  ('00000000-0000-0000-0000-000000000000', (SELECT id FROM compliance_frameworks WHERE key = 'SOC2' LIMIT 1), 'CC6.1', 'Logical Access Controls', 'System implements logical access security measures', 'Logical Access', true, 'QUARTERLY', 'PASS'),
  ('00000000-0000-0000-0000-000000000000', (SELECT id FROM compliance_frameworks WHERE key = 'ISO27001' LIMIT 1), 'A.5.1', 'Information Security Policies', 'Policies for information security defined and approved', 'Policy', true, 'ANNUAL', 'PASS');

-- Insert sample obligations
INSERT INTO compliance_obligations (tenant_id, kind, due_at, state) VALUES
  ('00000000-0000-0000-0000-000000000000', 'POLICY_ACK', NOW() + INTERVAL '7 days', 'OPEN'),
  ('00000000-0000-0000-0000-000000000000', 'TRAINING', NOW() + INTERVAL '14 days', 'OPEN'),
  ('00000000-0000-0000-0000-000000000000', 'I9', NOW() + INTERVAL '3 days', 'OPEN');

-- Insert sample exceptions
INSERT INTO compliance_exceptions (tenant_id, risk, status, reason) VALUES
  ('00000000-0000-0000-0000-000000000000', 'MEDIUM', 'OPEN', 'Temporary access granted for contractor pending background check completion'),
  ('00000000-0000-0000-0000-000000000000', 'LOW', 'MITIGATED', 'Policy acknowledgment delayed due to system outage - compensating control in place');
