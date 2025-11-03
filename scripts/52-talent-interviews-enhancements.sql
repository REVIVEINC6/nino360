-- Nino360 — Talent Interviews Module Enhancements
-- Panel Scheduler • Interviewer Workspace • Feedback Center • Calibration • Recordings

-- Extend interviews table with workspace and recording fields
ALTER TABLE ats.interviews
  ADD COLUMN IF NOT EXISTS round_name TEXT,
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('video','phone','onsite','remote')) DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS meet_url TEXT,
  ADD COLUMN IF NOT EXISTS agenda_md TEXT,
  ADD COLUMN IF NOT EXISTS interviewer_instructions TEXT,
  ADD COLUMN IF NOT EXISTS recording_path TEXT,
  ADD COLUMN IF NOT EXISTS transcript_path TEXT,
  ADD COLUMN IF NOT EXISTS reschedule_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS join_url TEXT,
  ADD COLUMN IF NOT EXISTS scorecard_id UUID REFERENCES ats.scorecards(id) ON DELETE SET NULL;

-- Interviewer workload cache for smart scheduling
CREATE TABLE IF NOT EXISTS ats.interviewer_load (
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  interviews_count INT DEFAULT 0,
  feedback_pending INT DEFAULT 0,
  PRIMARY KEY (tenant_id, user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_interviewer_load_user_date ON ats.interviewer_load(user_id, date);

-- Feedback aggregates for calibration analytics
CREATE TABLE IF NOT EXISTS ats.feedback_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID REFERENCES ats.jobs(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- '2025-Q3' or '2025-10'
  avg_score NUMERIC(5,2),
  submissions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_agg_tenant_period ON ats.feedback_aggregates(tenant_id, period);
CREATE INDEX IF NOT EXISTS idx_feedback_agg_interviewer ON ats.feedback_aggregates(interviewer_id);

-- Interview events log (scheduling, reschedule, no-show, recording)
CREATE TABLE IF NOT EXISTS ats.interview_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  interview_id UUID NOT NULL REFERENCES ats.interviews(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('scheduled','rescheduled','canceled','no_show','joined','left','recording_uploaded','transcript_uploaded','feedback_submitted')),
  actor UUID REFERENCES core.users(id) ON DELETE SET NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  ts TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_events_interview ON ats.interview_events(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_events_type ON ats.interview_events(type);

-- Extend feedback table with structured ratings and consensus tracking
ALTER TABLE ats.feedback
  ADD COLUMN IF NOT EXISTS overall TEXT CHECK (overall IN ('strong_yes','yes','lean_yes','no','strong_no')),
  ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '[]'::jsonb, -- [{dimension_key, score, note}]
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS is_overdue BOOLEAN DEFAULT FALSE;

-- Scorecard dimensions (if not exists from requisitions module)
CREATE TABLE IF NOT EXISTS ats.scorecard_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  scorecard_id UUID NOT NULL REFERENCES ats.scorecards(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  scale_min INT DEFAULT 1,
  scale_max INT DEFAULT 5,
  weight NUMERIC(3,2) DEFAULT 1.0,
  anchors JSONB DEFAULT '[]'::jsonb, -- [{score, description}]
  sort_order INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_scorecard_dims_scorecard ON ats.scorecard_dimensions(scorecard_id);

-- Calendar provider integrations (stub for Google/Microsoft)
CREATE TABLE IF NOT EXISTS ats.calendar_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google','microsoft')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  calendar_id TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_calendar_providers_user ON ats.calendar_providers(user_id);

-- RLS Policies
ALTER TABLE ats.interviewer_load ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.feedback_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.interview_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.scorecard_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats.calendar_providers ENABLE ROW LEVEL SECURITY;

-- Interviewer Load RLS
DROP POLICY IF EXISTS interviewer_load_tenant_isolation ON ats.interviewer_load;
CREATE POLICY interviewer_load_tenant_isolation ON ats.interviewer_load
  USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS interviewer_load_select ON ats.interviewer_load;
CREATE POLICY interviewer_load_select ON ats.interviewer_load FOR SELECT
  USING (sec.has_feature('talent.interviews'));

DROP POLICY IF EXISTS interviewer_load_insert ON ats.interviewer_load;
CREATE POLICY interviewer_load_insert ON ats.interviewer_load FOR INSERT
  WITH CHECK (sec.has_feature('talent.interviews'));

DROP POLICY IF EXISTS interviewer_load_update ON ats.interviewer_load;
CREATE POLICY interviewer_load_update ON ats.interviewer_load FOR UPDATE
  USING (sec.has_feature('talent.interviews'));

-- Feedback Aggregates RLS
DROP POLICY IF EXISTS feedback_agg_tenant_isolation ON ats.feedback_aggregates;
CREATE POLICY feedback_agg_tenant_isolation ON ats.feedback_aggregates
  USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS feedback_agg_select ON ats.feedback_aggregates;
CREATE POLICY feedback_agg_select ON ats.feedback_aggregates FOR SELECT
  USING (sec.has_feature('talent.interviews') AND sec.has_perm('talent.interviews.read'));

DROP POLICY IF EXISTS feedback_agg_insert ON ats.feedback_aggregates;
CREATE POLICY feedback_agg_insert ON ats.feedback_aggregates FOR INSERT
  WITH CHECK (sec.has_feature('talent.interviews') AND sec.has_perm('talent.interviews.update'));

-- Interview Events RLS
DROP POLICY IF EXISTS interview_events_tenant_isolation ON ats.interview_events;
CREATE POLICY interview_events_tenant_isolation ON ats.interview_events
  USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS interview_events_select ON ats.interview_events;
CREATE POLICY interview_events_select ON ats.interview_events FOR SELECT
  USING (sec.has_feature('talent.interviews'));

DROP POLICY IF EXISTS interview_events_insert ON ats.interview_events;
CREATE POLICY interview_events_insert ON ats.interview_events FOR INSERT
  WITH CHECK (sec.has_feature('talent.interviews'));

-- Scorecard Dimensions RLS
DROP POLICY IF EXISTS scorecard_dims_tenant_isolation ON ats.scorecard_dimensions;
CREATE POLICY scorecard_dims_tenant_isolation ON ats.scorecard_dimensions
  USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS scorecard_dims_select ON ats.scorecard_dimensions;
CREATE POLICY scorecard_dims_select ON ats.scorecard_dimensions FOR SELECT
  USING (sec.has_feature('talent.assessments'));

DROP POLICY IF EXISTS scorecard_dims_insert ON ats.scorecard_dimensions;
CREATE POLICY scorecard_dims_insert ON ats.scorecard_dimensions FOR INSERT
  WITH CHECK (sec.has_feature('talent.assessments') AND sec.has_perm('talent.jobs.create'));

-- Calendar Providers RLS
DROP POLICY IF EXISTS calendar_providers_tenant_isolation ON ats.calendar_providers;
CREATE POLICY calendar_providers_tenant_isolation ON ats.calendar_providers
  USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS calendar_providers_select ON ats.calendar_providers;
CREATE POLICY calendar_providers_select ON ats.calendar_providers FOR SELECT
  USING (sec.has_feature('talent.interviews') AND (user_id = auth.uid() OR sec.has_perm('talent.interviews.update')));

DROP POLICY IF EXISTS calendar_providers_insert ON ats.calendar_providers;
CREATE POLICY calendar_providers_insert ON ats.calendar_providers FOR INSERT
  WITH CHECK (sec.has_feature('talent.interviews') AND user_id = auth.uid());

DROP POLICY IF EXISTS calendar_providers_update ON ats.calendar_providers;
CREATE POLICY calendar_providers_update ON ats.calendar_providers FOR UPDATE
  USING (sec.has_feature('talent.interviews') AND user_id = auth.uid());

-- Add new features
INSERT INTO core.features (key, name, description, module, enabled_by_default)
VALUES
  ('talent.interviews.recordings', 'Interview Recordings', 'Upload and manage interview recordings with transcripts', 'talent', false),
  ('talent.interviews.calibration', 'Feedback Calibration', 'Calibration tools for interviewer feedback normalization', 'talent', false),
  ('talent.interviews.rag', 'Transcript RAG Search', 'AI-powered search over interview transcripts', 'talent', false)
ON CONFLICT (key) DO NOTHING;

-- Sample scorecard with dimensions
DO $$
DECLARE
  v_tenant_id UUID;
  v_scorecard_id UUID;
BEGIN
  SELECT id INTO v_tenant_id FROM core.tenants LIMIT 1;
  
  IF v_tenant_id IS NOT NULL THEN
    -- Create sample scorecard
    INSERT INTO ats.scorecards (tenant_id, name, description)
    VALUES (
      v_tenant_id,
      'Technical Interview Scorecard',
      'Standard scorecard for technical interviews'
    )
    RETURNING id INTO v_scorecard_id;
    
    -- Add dimensions
    INSERT INTO ats.scorecard_dimensions (tenant_id, scorecard_id, key, label, description, scale_min, scale_max, weight, sort_order)
    VALUES
      (v_tenant_id, v_scorecard_id, 'technical_skills', 'Technical Skills', 'Depth and breadth of technical knowledge', 1, 5, 1.5, 1),
      (v_tenant_id, v_scorecard_id, 'problem_solving', 'Problem Solving', 'Ability to analyze and solve complex problems', 1, 5, 1.5, 2),
      (v_tenant_id, v_scorecard_id, 'communication', 'Communication', 'Clarity and effectiveness of communication', 1, 5, 1.0, 3),
      (v_tenant_id, v_scorecard_id, 'collaboration', 'Collaboration', 'Teamwork and collaboration skills', 1, 5, 1.0, 4),
      (v_tenant_id, v_scorecard_id, 'culture_fit', 'Culture Fit', 'Alignment with company values and culture', 1, 5, 0.8, 5);
  END IF;
END $$;
