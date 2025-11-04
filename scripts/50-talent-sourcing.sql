-- Talent Sourcing Platform Schema
-- Multi-channel candidate ingestion, AI parsing, matching, pools, campaigns

-- Extend candidates table with sourcing fields
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS consent_status text DEFAULT 'unknown' CHECK (consent_status IN ('unknown','granted','denied','expired'));
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS retention_until date;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS diversity jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_candidates_consent ON talent.candidates(consent_status);
CREATE INDEX IF NOT EXISTS idx_candidates_retention ON talent.candidates(retention_until);

-- Candidate profiles with parsed resume data
CREATE TABLE IF NOT EXISTS talent.candidate_profiles (
  candidate_id uuid PRIMARY KEY REFERENCES talent.candidates(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  headline text,
  summary_md text,
  skills text[] DEFAULT '{}',
  years_experience int,
  education jsonb DEFAULT '[]'::jsonb,
  experience jsonb DEFAULT '[]'::jsonb,
  certifications text[] DEFAULT '{}',
  resume_path text,
  parsed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cp_tenant ON talent.candidate_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cp_skills ON talent.candidate_profiles USING GIN(skills);

-- Talent pools
CREATE TABLE IF NOT EXISTS talent.pools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pools_tenant ON talent.pools(tenant_id);

-- Pool membership
CREATE TABLE IF NOT EXISTS talent.pool_members (
  pool_id uuid REFERENCES talent.pools(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES talent.candidates(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (pool_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_members_tenant ON talent.pool_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pool_members_candidate ON talent.pool_members(candidate_id);

-- Import logs
CREATE TABLE IF NOT EXISTS talent.imports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('csv','xlsx','zip','email','vendor','job_board')),
  filename text,
  size_bytes int,
  rows int DEFAULT 0,
  inserted int DEFAULT 0,
  duplicates int DEFAULT 0,
  errors int DEFAULT 0,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','processing','completed','failed')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_imports_tenant ON talent.imports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_imports_status ON talent.imports(status);

-- Email intake aliases
CREATE TABLE IF NOT EXISTS talent.email_intake_aliases (
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (tenant_id, key)
);

-- Vendor submissions
CREATE TABLE IF NOT EXISTS talent.vendor_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  vendor_key text NOT NULL,
  candidate_id uuid REFERENCES talent.candidates(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','accepted','rejected','duplicate','expired')),
  notes text,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_submissions_tenant ON talent.vendor_submissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendor_submissions_status ON talent.vendor_submissions(status);

-- AI matching cache
CREATE TABLE IF NOT EXISTS talent.matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  requisition_id uuid REFERENCES talent.requisitions(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES talent.candidates(id) ON DELETE CASCADE,
  score int NOT NULL CHECK (score >= 0 AND score <= 100),
  explain jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, requisition_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_tenant ON talent.matches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_matches_req ON talent.matches(requisition_id);
CREATE INDEX IF NOT EXISTS idx_matches_candidate ON talent.matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON talent.matches(score DESC);

-- Consent events
CREATE TABLE IF NOT EXISTS talent.consent_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES talent.candidates(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('request','grant','deny','expire','extend')),
  channel text,
  meta jsonb DEFAULT '{}'::jsonb,
  ts timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_events_tenant ON talent.consent_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_consent_events_candidate ON talent.consent_events(candidate_id);

-- Enable RLS
ALTER TABLE talent.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.email_intake_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.vendor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.consent_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY rls_cp ON talent.candidate_profiles FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_pools ON talent.pools FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_poolm ON talent.pool_members FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_imp ON talent.imports FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_alias ON talent.email_intake_aliases FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_vendor ON talent.vendor_submissions FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_match ON talent.matches FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_consent ON talent.consent_events FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
