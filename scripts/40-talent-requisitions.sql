-- ============================================================================
-- NINO360 Talent Requisitions — Production Schema
-- Job intake, approvals, publishing, interview plans, scorecards
-- ============================================================================

-- Create talent schema if not exists
CREATE SCHEMA IF NOT EXISTS talent;

-- Extend requisitions table with full production fields
CREATE TABLE IF NOT EXISTS talent.requisitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  
  -- Basic info
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 120),
  department TEXT,
  location TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time','contract','intern','part_time')),
  seniority TEXT CHECK (seniority IN ('junior','mid','senior','lead','principal','executive')),
  
  -- Team
  hiring_manager UUID REFERENCES auth.users(id),
  recruiter_id UUID REFERENCES auth.users(id),
  
  -- Headcount & compensation
  openings INT NOT NULL DEFAULT 1 CHECK (openings BETWEEN 1 AND 999),
  band TEXT,
  salary_range JSONB DEFAULT '{}'::JSONB, -- {min, max, currency}
  
  -- Job details
  skills TEXT[] DEFAULT '{}' CHECK (array_length(skills, 1) IS NULL OR array_length(skills, 1) <= 40),
  description_md TEXT,
  remote_policy TEXT CHECK (remote_policy IN ('onsite','hybrid','remote')),
  
  -- Workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','on_hold','closed','canceled')),
  approvals JSONB DEFAULT '[]'::JSONB, -- Snapshot for quick access
  publish_meta JSONB DEFAULT '{}'::JSONB, -- {boards:[], vendors:[], career_url}
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requisitions_tenant ON talent.requisitions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_status ON talent.requisitions(status);
CREATE INDEX IF NOT EXISTS idx_requisitions_hm ON talent.requisitions(hiring_manager);
CREATE INDEX IF NOT EXISTS idx_requisitions_recruiter ON talent.requisitions(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_skills ON talent.requisitions USING GIN(skills);

-- Hiring team members
CREATE TABLE IF NOT EXISTS talent.requisition_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  requisition_id UUID NOT NULL REFERENCES talent.requisitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('hm','recruiter','coord','interviewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, requisition_id, user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_reqmembers_req ON talent.requisition_members(requisition_id);
CREATE INDEX IF NOT EXISTS idx_reqmembers_user ON talent.requisition_members(user_id);

-- Approval workflow
CREATE TABLE IF NOT EXISTS talent.requisition_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  requisition_id UUID NOT NULL REFERENCES talent.requisitions(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  step INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','skipped')),
  comment TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reqapprovals_req ON talent.requisition_approvals(requisition_id);
CREATE INDEX IF NOT EXISTS idx_reqapprovals_approver ON talent.requisition_approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_reqapprovals_status ON talent.requisition_approvals(status);

-- Publishing targets catalog
CREATE TABLE IF NOT EXISTS talent.publish_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('career','job_board','vendor','internal')),
  key TEXT NOT NULL, -- 'careers', 'indeed', 'linkedin', 'vendor:acme'
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  meta JSONB DEFAULT '{}'::JSONB, -- Credentials or mapping placeholders
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_pubtargets_tenant ON talent.publish_targets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pubtargets_enabled ON talent.publish_targets(enabled) WHERE enabled = TRUE;

-- Scorecards for evaluation
CREATE TABLE IF NOT EXISTS talent.scorecards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  requisition_id UUID REFERENCES talent.requisitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dimensions JSONB NOT NULL, -- [{key, label, scale:1..5, anchors:[...]}]
  pos INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scorecards_req ON talent.scorecards(requisition_id);

-- Interview plan
CREATE TABLE IF NOT EXISTS talent.interview_plan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  requisition_id UUID REFERENCES talent.requisitions(id) ON DELETE CASCADE,
  steps JSONB NOT NULL, -- [{name, duration, panel:[], scorecard_id}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, requisition_id)
);

CREATE INDEX IF NOT EXISTS idx_intplan_req ON talent.interview_plan(requisition_id);

-- Enable RLS
ALTER TABLE talent.requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.requisition_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.requisition_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.publish_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.interview_plan ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant-scoped)
CREATE POLICY rls_req ON talent.requisitions 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_reqm ON talent.requisition_members 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_reqap ON talent.requisition_approvals 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_pubt ON talent.publish_targets 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_sc ON talent.scorecards 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_plan ON talent.interview_plan 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

-- Seed default publish targets
INSERT INTO talent.publish_targets (tenant_id, kind, key, name, enabled, meta)
SELECT 
  t.id,
  'career',
  'careers',
  'Company Careers Page',
  TRUE,
  '{}'::JSONB
FROM app.tenants t
ON CONFLICT (tenant_id, key) DO NOTHING;

INSERT INTO talent.publish_targets (tenant_id, kind, key, name, enabled, meta)
SELECT 
  t.id,
  'job_board',
  'indeed',
  'Indeed',
  FALSE,
  '{"api_key": null}'::JSONB
FROM app.tenants t
ON CONFLICT (tenant_id, key) DO NOTHING;

INSERT INTO talent.publish_targets (tenant_id, kind, key, name, enabled, meta)
SELECT 
  t.id,
  'job_board',
  'linkedin',
  'LinkedIn Jobs',
  FALSE,
  '{"api_key": null}'::JSONB
FROM app.tenants t
ON CONFLICT (tenant_id, key) DO NOTHING;

INSERT INTO talent.publish_targets (tenant_id, kind, key, name, enabled, meta)
SELECT 
  t.id,
  'internal',
  'internal_mobility',
  'Internal Mobility',
  TRUE,
  '{}'::JSONB
FROM app.tenants t
ON CONFLICT (tenant_id, key) DO NOTHING;

-- Update trigger for requisitions
CREATE OR REPLACE FUNCTION talent.update_requisition_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_requisition_updated ON talent.requisitions;
CREATE TRIGGER trg_requisition_updated
  BEFORE UPDATE ON talent.requisitions
  FOR EACH ROW
  EXECUTE FUNCTION talent.update_requisition_timestamp();
