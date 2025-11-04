-- ============================================================================
-- NINO360 Step 4: ATS / Talent Module (Production)
-- ============================================================================

-- Create ATS schema
CREATE SCHEMA IF NOT EXISTS ats;

-- Reference tables
CREATE TABLE IF NOT EXISTS ats.sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS ats.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, tag)
);

-- Candidates
CREATE TABLE IF NOT EXISTS ats.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  location TEXT,
  experience_years NUMERIC(4,1) DEFAULT 0,
  current_company TEXT,
  current_title TEXT,
  ctc_current NUMERIC(14,2),
  ctc_expected NUMERIC(14,2),
  notice_period_days INT2,
  source_id UUID REFERENCES ats.sources(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  summary TEXT,
  skills TEXT[],
  resume_url TEXT,
  resume_mime TEXT,
  search_tsv TSVECTOR,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived','blacklisted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_tenant ON ats.candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON ats.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON ats.candidates USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_candidates_search ON ats.candidates USING GIN (search_tsv);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON ats.candidates(status);

-- Candidate Tags (M2M)
CREATE TABLE IF NOT EXISTS ats.candidate_tags (
  candidate_id UUID REFERENCES ats.candidates(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES ats.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (candidate_id, tag_id)
);

-- Jobs & Stages
CREATE TABLE IF NOT EXISTS ats.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time','contract','intern','part_time')),
  openings INT2 DEFAULT 1,
  jd TEXT,
  min_exp NUMERIC(4,1),
  max_exp NUMERIC(4,1),
  budget_min NUMERIC(14,2),
  budget_max NUMERIC(14,2),
  hiring_manager UUID REFERENCES core.users(id) ON DELETE SET NULL,
  recruiter_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','on_hold','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON ats.jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON ats.jobs(status);

CREATE TABLE IF NOT EXISTS ats.job_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES ats.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT2 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, position)
);

CREATE INDEX IF NOT EXISTS idx_job_stages_job ON ats.job_stages(job_id);

-- Applications & Events
CREATE TABLE IF NOT EXISTS ats.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES ats.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES ats.candidates(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES ats.job_stages(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'in_process' CHECK (status IN ('in_process','offered','hired','rejected','withdrawn')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  score NUMERIC(4,1),
  match_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_tenant ON ats.applications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON ats.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON ats.applications(candidate_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_job_candidate ON ats.applications(job_id, candidate_id);

CREATE TABLE IF NOT EXISTS ats.application_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES ats.applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- moved, note, email, sms, reject, offer
  from_stage UUID,
  to_stage UUID,
  note TEXT,
  payload JSONB DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_application_events_app ON ats.application_events(application_id);
CREATE INDEX IF NOT EXISTS idx_application_events_created ON ats.application_events(created_at DESC);

-- Interviews & Feedback
CREATE TABLE IF NOT EXISTS ats.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES ats.applications(id) ON DELETE CASCADE,
  round_name TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('onsite','remote','phone','video')),
  interviewer_ids UUID[] DEFAULT '{}',
  location TEXT,
  meet_url TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','rescheduled','completed','canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interviews_tenant ON ats.interviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_app ON ats.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_start ON ats.interviews(scheduled_start);

CREATE TABLE IF NOT EXISTS ats.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  interview_id UUID NOT NULL REFERENCES ats.interviews(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  rating INT2 CHECK (rating BETWEEN 1 AND 5),
  strengths TEXT,
  concerns TEXT,
  recommendation TEXT CHECK (recommendation IN ('hire','no_hire','hold')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_interview ON ats.feedback(interview_id);

-- Full text search trigger for candidates
CREATE OR REPLACE FUNCTION ats.candidate_tsv_update() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('simple', coalesce(NEW.first_name,'')||' '||coalesce(NEW.last_name,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.current_title,'')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(NEW.skills, ' ')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.summary,'')), 'C');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_candidate_tsv ON ats.candidates;
CREATE TRIGGER trg_candidate_tsv 
BEFORE INSERT OR UPDATE ON ats.candidates
FOR EACH ROW EXECUTE FUNCTION ats.candidate_tsv_update();

-- Enable RLS
ALTER TABLE ats.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.candidate_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.job_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant membership read; recruiter/manager/admin write)
CREATE POLICY sources_read ON ats.sources FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY sources_write ON ats.sources FOR ALL USING (tenant_id = sec.current_tenant_id());

CREATE POLICY tags_read ON ats.tags FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY tags_write ON ats.tags FOR ALL USING (tenant_id = sec.current_tenant_id());

CREATE POLICY candidates_read ON ats.candidates FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY candidates_write ON ats.candidates FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = ats.candidates.tenant_id 
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin','manager','recruiter')
  )
);

CREATE POLICY candidate_tags_read ON ats.candidate_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM ats.candidates c WHERE c.id = candidate_id AND c.tenant_id = sec.current_tenant_id())
);
CREATE POLICY candidate_tags_write ON ats.candidate_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM ats.candidates c WHERE c.id = candidate_id AND c.tenant_id = sec.current_tenant_id())
);

CREATE POLICY jobs_read ON ats.jobs FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY jobs_write ON ats.jobs FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = ats.jobs.tenant_id 
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin','manager','recruiter')
  )
);

CREATE POLICY job_stages_read ON ats.job_stages FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY job_stages_write ON ats.job_stages FOR ALL USING (tenant_id = sec.current_tenant_id());

CREATE POLICY applications_read ON ats.applications FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY applications_write ON ats.applications FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = ats.applications.tenant_id 
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin','manager','recruiter')
  )
);

CREATE POLICY application_events_read ON ats.application_events FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY application_events_write ON ats.application_events FOR ALL USING (tenant_id = sec.current_tenant_id());

CREATE POLICY interviews_read ON ats.interviews FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY interviews_write ON ats.interviews FOR ALL USING (tenant_id = sec.current_tenant_id());

CREATE POLICY feedback_read ON ats.feedback FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY feedback_write ON ats.feedback FOR ALL USING (tenant_id = sec.current_tenant_id());

-- Audit function
CREATE OR REPLACE FUNCTION ats.audit(_action TEXT, _resource TEXT, _payload JSONB)
RETURNS VOID 
LANGUAGE SQL 
SECURITY DEFINER 
AS $$ 
  SELECT sec.log_action(sec.current_tenant_id(), sec.current_user_id(), _action, _resource, _payload); 
$$;

-- Seed default sources and tags
INSERT INTO ats.sources (tenant_id, name) 
SELECT id, 'LinkedIn' FROM core.tenants WHERE NOT EXISTS (SELECT 1 FROM ats.sources WHERE name = 'LinkedIn')
ON CONFLICT DO NOTHING;

INSERT INTO ats.sources (tenant_id, name) 
SELECT id, 'Referral' FROM core.tenants WHERE NOT EXISTS (SELECT 1 FROM ats.sources WHERE name = 'Referral')
ON CONFLICT DO NOTHING;

INSERT INTO ats.sources (tenant_id, name) 
SELECT id, 'Job Board' FROM core.tenants WHERE NOT EXISTS (SELECT 1 FROM ats.sources WHERE name = 'Job Board')
ON CONFLICT DO NOTHING;

INSERT INTO ats.tags (tenant_id, tag, color) 
SELECT id, 'Hot', '#ef4444' FROM core.tenants WHERE NOT EXISTS (SELECT 1 FROM ats.tags WHERE tag = 'Hot')
ON CONFLICT DO NOTHING;

INSERT INTO ats.tags (tenant_id, tag, color) 
SELECT id, 'Remote', '#3b82f6' FROM core.tenants WHERE NOT EXISTS (SELECT 1 FROM ats.tags WHERE tag = 'Remote')
ON CONFLICT DO NOTHING;
