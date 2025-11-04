-- ============================================================================
-- HRMS Documents Schema
-- Comprehensive document management with AI extraction and blockchain verification
-- ============================================================================

-- Document folders for organization
CREATE TABLE IF NOT EXISTS hrms_document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES hrms_document_folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL, -- Full path for hierarchy
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hrms_document_folders_tenant ON hrms_document_folders(tenant_id);
CREATE INDEX idx_hrms_document_folders_parent ON hrms_document_folders(parent_id);
CREATE INDEX idx_hrms_document_folders_path ON hrms_document_folders USING gin(to_tsvector('english', path));

-- Main documents table
CREATE TABLE IF NOT EXISTS hrms_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES hrms_document_folders(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  -- Document metadata
  name VARCHAR(255) NOT NULL,
  kind VARCHAR(50) NOT NULL, -- CONTRACT, POLICY, OFFER, ID, I9, VISA, BENEFIT, OTHER
  tags TEXT[] DEFAULT '{}',
  version INT DEFAULT 1,
  
  -- Storage
  storage_key TEXT NOT NULL,
  url TEXT,
  size_bytes BIGINT,
  mime_type VARCHAR(100),
  
  -- Security
  sha256 TEXT,
  notarized_hash TEXT, -- Blockchain verification hash
  legal_hold BOOLEAN DEFAULT FALSE,
  
  -- Retention
  retention_category VARCHAR(50),
  retention_until DATE,
  
  -- E-signature
  e_sign_status VARCHAR(50), -- DRAFT, OUT_FOR_SIGNATURE, SIGNED, DECLINED
  signer_roles TEXT[] DEFAULT '{}',
  
  -- AI extraction
  extracted_data JSONB DEFAULT '{}',
  extraction_confidence DECIMAL(5,2),
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hrms_documents_tenant ON hrms_documents(tenant_id);
CREATE INDEX idx_hrms_documents_employee ON hrms_documents(employee_id);
CREATE INDEX idx_hrms_documents_folder ON hrms_documents(folder_id);
CREATE INDEX idx_hrms_documents_kind ON hrms_documents(kind);
CREATE INDEX idx_hrms_documents_tags ON hrms_documents USING gin(tags);
CREATE INDEX idx_hrms_documents_esign_status ON hrms_documents(e_sign_status);
CREATE INDEX idx_hrms_documents_retention ON hrms_documents(retention_until) WHERE retention_until IS NOT NULL;

-- Document events for audit trail
CREATE TABLE IF NOT EXISTS hrms_document_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES hrms_documents(id) ON DELETE CASCADE,
  
  kind VARCHAR(50) NOT NULL, -- UPLOADED, VIEWED, DOWNLOADED, UPDATED, DELETED, NOTARIZED, E_SIGN_SENT, E_SIGN_SIGNED, ACKED
  actor_id UUID REFERENCES auth.users(id),
  
  metadata JSONB DEFAULT '{}',
  ts TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hrms_document_events_tenant ON hrms_document_events(tenant_id);
CREATE INDEX idx_hrms_document_events_document ON hrms_document_events(document_id);
CREATE INDEX idx_hrms_document_events_kind ON hrms_document_events(kind);
CREATE INDEX idx_hrms_document_events_ts ON hrms_document_events(ts DESC);

-- Policy definitions
CREATE TABLE IF NOT EXISTS hrms_policy_defs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  key VARCHAR(100) NOT NULL, -- Unique key for policy type
  title VARCHAR(255) NOT NULL,
  version INT NOT NULL DEFAULT 1,
  markdown TEXT NOT NULL,
  
  active BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, key, version)
);

CREATE INDEX idx_hrms_policy_defs_tenant ON hrms_policy_defs(tenant_id);
CREATE INDEX idx_hrms_policy_defs_key ON hrms_policy_defs(key);
CREATE INDEX idx_hrms_policy_defs_active ON hrms_policy_defs(active) WHERE active = TRUE;

-- Policy assignments to employees
CREATE TABLE IF NOT EXISTS hrms_policy_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES hrms_policy_defs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED', -- ASSIGNED, ACKNOWLEDGED, DECLINED
  due_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(policy_id, employee_id)
);

CREATE INDEX idx_hrms_policy_assignments_tenant ON hrms_policy_assignments(tenant_id);
CREATE INDEX idx_hrms_policy_assignments_policy ON hrms_policy_assignments(policy_id);
CREATE INDEX idx_hrms_policy_assignments_employee ON hrms_policy_assignments(employee_id);
CREATE INDEX idx_hrms_policy_assignments_status ON hrms_policy_assignments(status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE hrms_document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_document_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_policy_defs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_policy_assignments ENABLE ROW LEVEL SECURITY;

-- Document folders policies
CREATE POLICY hrms_document_folders_tenant_isolation ON hrms_document_folders
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Documents policies
CREATE POLICY hrms_documents_tenant_isolation ON hrms_documents
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Document events policies
CREATE POLICY hrms_document_events_tenant_isolation ON hrms_document_events
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Policy defs policies
CREATE POLICY hrms_policy_defs_tenant_isolation ON hrms_policy_defs
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Policy assignments policies
CREATE POLICY hrms_policy_assignments_tenant_isolation ON hrms_policy_assignments
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE TRIGGER update_hrms_document_folders_updated_at BEFORE UPDATE ON hrms_document_folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_documents_updated_at BEFORE UPDATE ON hrms_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_policy_defs_updated_at BEFORE UPDATE ON hrms_policy_defs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_policy_assignments_updated_at BEFORE UPDATE ON hrms_policy_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample folders
INSERT INTO hrms_document_folders (tenant_id, name, path) VALUES
  ((SELECT id FROM tenants LIMIT 1), 'Contracts', '/Contracts'),
  ((SELECT id FROM tenants LIMIT 1), 'Identification', '/Identification'),
  ((SELECT id FROM tenants LIMIT 1), 'Immigration', '/Immigration'),
  ((SELECT id FROM tenants LIMIT 1), 'Benefits', '/Benefits'),
  ((SELECT id FROM tenants LIMIT 1), 'Policies', '/Policies')
ON CONFLICT DO NOTHING;

-- Insert sample documents
INSERT INTO hrms_documents (tenant_id, folder_id, employee_id, name, kind, storage_key, sha256, notarized_hash, extraction_confidence) VALUES
  (
    (SELECT id FROM tenants LIMIT 1),
    (SELECT id FROM hrms_document_folders WHERE name = 'Contracts' LIMIT 1),
    (SELECT id FROM hrms_employees LIMIT 1),
    'Employment Agreement - John Doe.pdf',
    'CONTRACT',
    'contracts/2025/employment-agreement-john-doe.pdf',
    'abc123def456',
    'abc123def456',
    98.5
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    (SELECT id FROM hrms_document_folders WHERE name = 'Identification' LIMIT 1),
    (SELECT id FROM hrms_employees LIMIT 1 OFFSET 1),
    'Passport - Jane Smith.pdf',
    'ID',
    'identification/2024/passport-jane-smith.pdf',
    'def456ghi789',
    'def456ghi789',
    99.2
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    (SELECT id FROM hrms_document_folders WHERE name = 'Immigration' LIMIT 1),
    (SELECT id FROM hrms_employees LIMIT 1 OFFSET 2),
    'H1B Approval - Bob Wilson.pdf',
    'VISA',
    'immigration/2024/h1b-approval-bob-wilson.pdf',
    'ghi789jkl012',
    NULL,
    95.8
  )
ON CONFLICT DO NOTHING;

-- Insert sample policies
INSERT INTO hrms_policy_defs (tenant_id, key, title, version, markdown, active, published_at) VALUES
  (
    (SELECT id FROM tenants LIMIT 1),
    'code-of-conduct',
    'Code of Conduct',
    3,
    '# Code of Conduct\n\nAll employees must adhere to our code of conduct...',
    TRUE,
    NOW() - INTERVAL '30 days'
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    'remote-work',
    'Remote Work Policy',
    2,
    '# Remote Work Policy\n\nEmployees may work remotely subject to approval...',
    TRUE,
    NOW() - INTERVAL '45 days'
  )
ON CONFLICT DO NOTHING;

-- Insert sample policy assignments
INSERT INTO hrms_policy_assignments (tenant_id, policy_id, employee_id, status, acknowledged_at) VALUES
  (
    (SELECT id FROM tenants LIMIT 1),
    (SELECT id FROM hrms_policy_defs WHERE key = 'code-of-conduct' LIMIT 1),
    (SELECT id FROM hrms_employees LIMIT 1),
    'ACKNOWLEDGED',
    NOW() - INTERVAL '25 days'
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    (SELECT id FROM hrms_policy_defs WHERE key = 'remote-work' LIMIT 1),
    (SELECT id FROM hrms_employees LIMIT 1 OFFSET 1),
    'ASSIGNED',
    NULL
  )
ON CONFLICT DO NOTHING;
