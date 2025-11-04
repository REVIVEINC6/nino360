-- Talent Interviews Module Schema
-- Comprehensive interview scheduling, feedback, and calibration system

-- Drop existing tables if they exist
DROP TABLE IF EXISTS interview_recordings CASCADE;
DROP TABLE IF EXISTS interview_feedback CASCADE;
DROP TABLE IF EXISTS interview_panel CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS interview_scorecards CASCADE;
DROP TABLE IF EXISTS calibration_sessions CASCADE;

-- Interview Scorecards (templates for evaluation)
CREATE TABLE interview_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  dimensions JSONB NOT NULL DEFAULT '[]', -- Array of {name, description, weight, scale}
  is_default BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  application_id UUID NOT NULL,
  requisition_id UUID NOT NULL,
  round_no INTEGER DEFAULT 1,
  round_name VARCHAR(255),
  stage_name VARCHAR(255),
  scorecard_id UUID REFERENCES interview_scorecards(id),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location_type VARCHAR(50) DEFAULT 'video', -- video, in_person, phone
  location TEXT,
  meeting_link TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, no_show, cancelled
  
  -- AI Features
  agenda TEXT,
  ai_suggested_questions JSONB DEFAULT '[]',
  ai_meeting_notes TEXT,
  ai_sentiment_score DECIMAL(3,2), -- 0.00 to 5.00
  ai_key_highlights JSONB DEFAULT '[]',
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_verified_at TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Panel (many-to-many)
CREATE TABLE interview_panel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(100), -- lead, technical, behavioral, hiring_manager
  feedback_submitted BOOLEAN DEFAULT false,
  feedback_submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Feedback
CREATE TABLE interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  
  -- Scores (based on scorecard dimensions)
  dimension_scores JSONB NOT NULL DEFAULT '{}', -- {dimension_name: score}
  overall_score DECIMAL(3,2), -- Weighted average
  
  -- Recommendation
  recommendation VARCHAR(50), -- strong_yes, yes, no, strong_no
  decision VARCHAR(50), -- advance, hold, reject
  
  -- Feedback
  strengths TEXT,
  weaknesses TEXT,
  comments TEXT,
  
  -- AI Analysis
  ai_sentiment VARCHAR(50), -- positive, neutral, negative
  ai_confidence_score DECIMAL(3,2),
  ai_bias_flags JSONB DEFAULT '[]',
  
  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Recordings
CREATE TABLE interview_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Recording Details
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  recording_type VARCHAR(50) DEFAULT 'video', -- video, audio, screen_share
  
  -- AI Transcription
  transcript_url TEXT,
  transcript_text TEXT,
  ai_summary TEXT,
  ai_action_items JSONB DEFAULT '[]',
  
  -- Processing Status
  processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  processed_at TIMESTAMPTZ,
  
  -- Metadata
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calibration Sessions (for interview consistency)
CREATE TABLE calibration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Session Details
  session_date TIMESTAMPTZ NOT NULL,
  facilitator_id UUID,
  participants JSONB DEFAULT '[]', -- Array of user IDs
  
  -- Calibration Data
  sample_interviews JSONB DEFAULT '[]', -- Array of interview IDs reviewed
  consensus_scores JSONB DEFAULT '{}', -- Agreed-upon scores
  disagreement_areas JSONB DEFAULT '[]',
  
  -- Metrics
  avg_score_variance DECIMAL(5,2),
  calibration_score DECIMAL(3,2), -- How well-calibrated the team is
  
  -- AI Insights
  ai_recommendations TEXT,
  ai_bias_patterns JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_interviews_tenant ON interviews(tenant_id);
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_requisition ON interviews(requisition_id);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interview_panel_interview ON interview_panel(interview_id);
CREATE INDEX idx_interview_panel_user ON interview_panel(user_id);
CREATE INDEX idx_interview_feedback_interview ON interview_feedback(interview_id);
CREATE INDEX idx_interview_feedback_reviewer ON interview_feedback(reviewer_id);
CREATE INDEX idx_interview_recordings_interview ON interview_recordings(interview_id);
CREATE INDEX idx_calibration_sessions_tenant ON calibration_sessions(tenant_id);

-- Enable Row Level Security
ALTER TABLE interview_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_panel ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibration_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant isolation)
CREATE POLICY tenant_isolation_scorecards ON interview_scorecards
  USING (tenant_id::text = current_setting('app.current_tenant', true));

CREATE POLICY tenant_isolation_interviews ON interviews
  USING (tenant_id::text = current_setting('app.current_tenant', true));

CREATE POLICY tenant_isolation_panel ON interview_panel
  USING (interview_id IN (SELECT id FROM interviews WHERE tenant_id::text = current_setting('app.current_tenant', true)));

CREATE POLICY tenant_isolation_feedback ON interview_feedback
  USING (interview_id IN (SELECT id FROM interviews WHERE tenant_id::text = current_setting('app.current_tenant', true)));

CREATE POLICY tenant_isolation_recordings ON interview_recordings
  USING (tenant_id::text = current_setting('app.current_tenant', true));

CREATE POLICY tenant_isolation_calibration ON calibration_sessions
  USING (tenant_id::text = current_setting('app.current_tenant', true));

-- Triggers for updated_at
CREATE TRIGGER update_interview_scorecards_updated_at BEFORE UPDATE ON interview_scorecards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_feedback_updated_at BEFORE UPDATE ON interview_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calibration_sessions_updated_at BEFORE UPDATE ON calibration_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data
INSERT INTO interview_scorecards (tenant_id, name, description, dimensions, is_default) VALUES
('00000000-0000-0000-0000-000000000000', 'Technical Interview', 'Standard technical assessment scorecard', 
'[
  {"name": "Technical Skills", "description": "Coding ability and problem-solving", "weight": 0.4, "scale": 5},
  {"name": "System Design", "description": "Architecture and scalability thinking", "weight": 0.3, "scale": 5},
  {"name": "Communication", "description": "Ability to explain technical concepts", "weight": 0.2, "scale": 5},
  {"name": "Culture Fit", "description": "Alignment with team values", "weight": 0.1, "scale": 5}
]'::jsonb, true),
('00000000-0000-0000-0000-000000000000', 'Behavioral Interview', 'Leadership and soft skills assessment', 
'[
  {"name": "Leadership", "description": "Ability to lead and influence", "weight": 0.3, "scale": 5},
  {"name": "Problem Solving", "description": "Approach to challenges", "weight": 0.25, "scale": 5},
  {"name": "Communication", "description": "Clarity and effectiveness", "weight": 0.25, "scale": 5},
  {"name": "Adaptability", "description": "Flexibility and learning agility", "weight": 0.2, "scale": 5}
]'::jsonb, false);

INSERT INTO interviews (tenant_id, application_id, requisition_id, round_no, round_name, stage_name, scorecard_id, scheduled_at, duration_minutes, location_type, meeting_link, status, agenda, ai_sentiment_score) VALUES
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 'Phone Screen', 'Initial Screening', (SELECT id FROM interview_scorecards LIMIT 1), NOW() + INTERVAL '2 days', 30, 'phone', NULL, 'scheduled', 'Quick introduction and role overview', NULL),
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 2, 'Technical Round', 'Technical Assessment', (SELECT id FROM interview_scorecards LIMIT 1), NOW() + INTERVAL '5 days', 90, 'video', 'https://meet.google.com/abc-defg-hij', 'scheduled', 'Coding challenge and system design discussion', NULL),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 1, 'Technical Interview', 'Technical Assessment', (SELECT id FROM interview_scorecards LIMIT 1), NOW() - INTERVAL '3 days', 60, 'video', 'https://zoom.us/j/123456789', 'completed', 'Data structures and algorithms', 4.2);

INSERT INTO interview_panel (interview_id, user_id, role, feedback_submitted) VALUES
((SELECT id FROM interviews LIMIT 1 OFFSET 0), '55555555-5555-5555-5555-555555555555', 'lead', false),
((SELECT id FROM interviews LIMIT 1 OFFSET 1), '55555555-5555-5555-5555-555555555555', 'technical', false),
((SELECT id FROM interviews LIMIT 1 OFFSET 1), '66666666-6666-6666-6666-666666666666', 'technical', false),
((SELECT id FROM interviews LIMIT 1 OFFSET 2), '55555555-5555-5555-5555-555555555555', 'lead', true);

INSERT INTO interview_feedback (interview_id, reviewer_id, dimension_scores, overall_score, recommendation, decision, strengths, weaknesses, comments, ai_sentiment) VALUES
((SELECT id FROM interviews WHERE status = 'completed' LIMIT 1), '55555555-5555-5555-5555-555555555555', 
'{"Technical Skills": 4.5, "System Design": 4.0, "Communication": 4.5, "Culture Fit": 4.0}'::jsonb, 
4.25, 'yes', 'advance', 
'Strong problem-solving skills, excellent communication, good grasp of algorithms', 
'Could improve on system design scalability considerations', 
'Overall strong candidate with solid technical foundation', 
'positive');

INSERT INTO calibration_sessions (tenant_id, name, description, session_date, facilitator_id, avg_score_variance, calibration_score) VALUES
('00000000-0000-0000-0000-000000000000', 'Q1 2025 Technical Calibration', 'Quarterly calibration for technical interviewers', NOW() - INTERVAL '15 days', '55555555-5555-5555-5555-555555555555', 0.45, 4.1),
('00000000-0000-0000-0000-000000000000', 'Behavioral Interview Calibration', 'Aligning on behavioral assessment criteria', NOW() - INTERVAL '30 days', '66666666-6666-6666-6666-666666666666', 0.62, 3.8);
