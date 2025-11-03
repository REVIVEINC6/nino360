-- Phase 16: HRMS Documents Management System
-- Comprehensive document management with folders, policies, e-sign, retention, and ledger notarization

-- Create hrms schema if not exists
CREATE SCHEMA IF NOT EXISTS hrms;

-- ============================================================================
-- FOLDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms.folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  parent_id uuid REFERENCES hrms.folders(id) ON DELETE CASCADE,
  path text NOT NULL, -- materialized path for efficient queries
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  UNIQUE(tenant_id, path)
);

CREATE INDEX IF NOT EXISTS idx_folders_tenant ON hrms.folders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent ON hrms.folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_path ON hrms.folders(path);

-- ============================================================================
-- DOCUMENTS
-- ============================================================================
CREATE TYPE hrms.document_kind AS ENUM (
  'CONTRACT', 'POLICY', 'OFFER', 'ID', 'I9', 'VISA', 'BENEFIT', 'OTHER'
);

CREATE TYPE hrms.esign_status AS ENUM (
  'DRAFT', 'OUT_FOR_SIGNATURE', 'SIGNED', 'VOID'
);

CREATE TABLE IF NOT EXISTS hrms.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  folder_id uuid REFERENCES hrms.folders(id) ON DELETE SET NULL,
  employee_id uuid, -- optional: link to employee
  object_type text, -- optional: link to other objects (e.g., 'assignment', 'policy')
  object_id uuid, -- optional: link to other objects
  name text NOT NULL,
  kind hrms.document_kind NOT NULL DEFAULT 'OTHER',
  version int NOT NULL DEFAULT 1,
  url text, -- storage URL
  storage_key text, -- storage path
  size_bytes bigint,
  mime text,
  sha256 text, -- file hash for duplicate detection
  tags text[] DEFAULT '{}',
  retention_category text, -- e.g., 'EMPLOYMENT_RECORDS', 'TAX_DOCS'
  retention_until date, -- computed from category + hire/term dates
  legal_hold boolean DEFAULT false,
  signer_roles text[] DEFAULT '{}', -- for e-sign: ['EMPLOYEE', 'MANAGER', 'HR']
  e_sign_status hrms.esign_status DEFAULT 'DRAFT',
  uploaded_at timestamptz DEFAULT now(),
  created_by uuid,
  notarized_hash text, -- ledger proof hash
  metadata jsonb DEFAULT '{}'::jsonb, -- AI classification results, DLP tags, etc.
  UNIQUE(tenant_id, sha256, name) -- prevent exact duplicates
);

CREATE INDEX IF NOT EXISTS idx_documents_tenant ON hrms.documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_folder ON hrms.documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_employee ON hrms.documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_kind ON hrms.documents(kind);
CREATE INDEX IF NOT EXISTS idx_documents_sha256 ON hrms.documents(sha256);
CREATE INDEX IF NOT EXISTS idx_documents_retention ON hrms.documents(retention_until) WHERE retention_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_legal_hold ON hrms.documents(legal_hold) WHERE legal_hold = true;
CREATE INDEX IF NOT EXISTS idx_documents_tags ON hrms.documents USING gin(tags);

-- ============================================================================
-- DOCUMENT EVENTS
-- ============================================================================
CREATE TYPE hrms.document_event_kind AS ENUM (
  'UPLOADED', 'VIEWED', 'DOWNLOADED', 'E_SIGN_SENT', 'E_SIGN_SIGNED',
  'ACK_ASSIGNED', 'ACKED', 'NOTARIZED', 'DELETED'
);

CREATE TABLE IF NOT EXISTS hrms.document_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  document_id uuid NOT NULL REFERENCES hrms.documents(id) ON DELETE CASCADE,
  ts timestamptz DEFAULT now(),
  kind hrms.document_event_kind NOT NULL,
  actor_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_document_events_tenant ON hrms.document_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_events_document ON hrms.document_events(document_id);
CREATE INDEX IF NOT EXISTS idx_document_events_ts ON hrms.document_events(ts DESC);

-- ============================================================================
-- POLICY DEFINITIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS hrms.policy_defs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  key text NOT NULL, -- unique key per tenant (e.g., 'code-of-conduct')
  title text NOT NULL,
  version int NOT NULL DEFAULT 1,
  markdown text NOT NULL,
  published_at timestamptz,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  UNIQUE(tenant_id, key, version)
);

CREATE INDEX IF NOT EXISTS idx_policy_defs_tenant ON hrms.policy_defs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_policy_defs_key ON hrms.policy_defs(key);
CREATE INDEX IF NOT EXISTS idx_policy_defs_active ON hrms.policy_defs(active) WHERE active = true;

-- ============================================================================
-- POLICY ASSIGNMENTS
-- ============================================================================
CREATE TYPE hrms.policy_assignment_status AS ENUM (
  'ASSIGNED', 'ACKNOWLEDGED', 'OVERDUE'
);

CREATE TABLE IF NOT EXISTS hrms.policy_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  policy_id uuid NOT NULL REFERENCES hrms.policy_defs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL,
  due_at date,
  status hrms.policy_assignment_status DEFAULT 'ASSIGNED',
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, policy_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_policy_assignments_tenant ON hrms.policy_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_policy_assignments_policy ON hrms.policy_assignments(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_assignments_employee ON hrms.policy_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_policy_assignments_status ON hrms.policy_assignments(status);
CREATE INDEX IF NOT EXISTS idx_policy_assignments_due ON hrms.policy_assignments(due_at) WHERE status = 'ASSIGNED';

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Folders RLS
ALTER TABLE hrms.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY folders_tenant_isolation ON hrms.folders
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Documents RLS
ALTER TABLE hrms.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_tenant_isolation ON hrms.documents
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Document Events RLS
ALTER TABLE hrms.document_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY document_events_tenant_isolation ON hrms.document_events
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Policy Defs RLS
ALTER TABLE hrms.policy_defs ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_defs_tenant_isolation ON hrms.policy_defs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Policy Assignments RLS
ALTER TABLE hrms.policy_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_assignments_tenant_isolation ON hrms.policy_assignments
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Document summary by kind
CREATE OR REPLACE VIEW hrms.vw_document_summary AS
SELECT
  d.tenant_id,
  d.kind,
  COUNT(*) as total_count,
  SUM(d.size_bytes) as total_size_bytes,
  COUNT(*) FILTER (WHERE d.uploaded_at >= now() - interval '30 days') as new_30d,
  COUNT(*) FILTER (WHERE d.legal_hold = true) as legal_hold_count,
  COUNT(*) FILTER (WHERE d.notarized_hash IS NOT NULL) as notarized_count
FROM hrms.documents d
GROUP BY d.tenant_id, d.kind;

-- Policy acknowledgment completion
CREATE OR REPLACE VIEW hrms.vw_policy_ack_completion AS
SELECT
  pa.tenant_id,
  pa.policy_id,
  pd.title as policy_title,
  COUNT(*) as total_assigned,
  COUNT(*) FILTER (WHERE pa.status = 'ACKNOWLEDGED') as acknowledged_count,
  COUNT(*) FILTER (WHERE pa.status = 'OVERDUE') as overdue_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE pa.status = 'ACKNOWLEDGED') / NULLIF(COUNT(*), 0), 2) as completion_pct
FROM hrms.policy_assignments pa
JOIN hrms.policy_defs pd ON pd.id = pa.policy_id
GROUP BY pa.tenant_id, pa.policy_id, pd.title;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update policy assignment status to OVERDUE
CREATE OR REPLACE FUNCTION hrms.update_policy_assignment_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.due_at < CURRENT_DATE AND NEW.status = 'ASSIGNED' THEN
    NEW.status := 'OVERDUE';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_policy_assignment_status
  BEFORE INSERT OR UPDATE ON hrms.policy_assignments
  FOR EACH ROW
  EXECUTE FUNCTION hrms.update_policy_assignment_status();

-- ============================================================================
-- SEED DEFAULT FOLDERS
-- ============================================================================

-- Note: Folders will be created per tenant on first access
-- Default structure: All, Policies, Contracts, IDs, I-9, Immigration, Benefits, Other
