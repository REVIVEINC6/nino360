-- ============================================================================
-- Nino360 Talent Applicants Module - Production Schema
-- ============================================================================
-- Purpose: Comprehensive applicant tracking with AI parsing, blockchain audit,
--          and RPA automation workflows
-- Features: Resume parsing, AI screening, blockchain verification, automation
-- ============================================================================

-- ============================================================================
-- 1. APPLICANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  
  -- Basic Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  
  -- Application Details
  job_id UUID REFERENCES talent_jobs(id) ON DELETE SET NULL,
  job_title VARCHAR(255),
  source VARCHAR(100), -- 'career_site', 'referral', 'linkedin', 'indeed', etc.
  source_details JSONB, -- Additional source metadata
  
  -- Status & Stage
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'screening', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn'
  stage VARCHAR(100), -- Current pipeline stage
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Resume & Documents
  resume_url TEXT,
  resume_filename VARCHAR(255),
  resume_parsed_at TIMESTAMPTZ,
  cover_letter_url TEXT,
  portfolio_url TEXT,
  additional_documents JSONB[], -- Array of {url, filename, type}
  
  -- AI Parsed Data
  parsed_data JSONB, -- Full parsed resume data
  skills TEXT[], -- Extracted skills
  experience_years DECIMAL(4,2),
  education JSONB[], -- Array of education records
  work_history JSONB[], -- Array of work experience
  certifications TEXT[],
  languages JSONB[], -- [{language, proficiency}]
  
  -- AI Screening
  ai_score DECIMAL(5,2), -- 0-100 AI match score
  ai_screening_result JSONB, -- {score, strengths, concerns, recommendation}
  ai_screening_at TIMESTAMPTZ,
  screening_status VARCHAR(50), -- 'pending', 'passed', 'failed', 'manual_review'
  
  -- Blockchain Verification
  blockchain_hash VARCHAR(66), -- Keccak256 hash of applicant data
  blockchain_tx_hash VARCHAR(66), -- Transaction hash on blockchain
  blockchain_verified_at TIMESTAMPTZ,
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
  
  -- RPA Automation
  automation_flags JSONB, -- {auto_screen: true, auto_reject: false, auto_schedule: true}
  automation_history JSONB[], -- Array of automation actions
  last_automation_at TIMESTAMPTZ,
  
  -- Communication
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  communication_preferences JSONB,
  
  -- Metadata
  tags TEXT[],
  notes TEXT,
  rating DECIMAL(3,2), -- 1-5 star rating
  
  -- GDPR & Compliance
  consent_given BOOLEAN DEFAULT false,
  consent_at TIMESTAMPTZ,
  data_retention_until TIMESTAMPTZ,
  anonymized BOOLEAN DEFAULT false,
  
  -- Audit
  created_by UUID REFERENCES app.users(id),
  updated_by UUID REFERENCES app.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('new', 'screening', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_ai_score CHECK (ai_score IS NULL OR (ai_score >= 0 AND ai_score <= 100)),
  CONSTRAINT valid_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

-- Indexes
CREATE INDEX idx_applicants_tenant ON talent_applicants(tenant_id);
CREATE INDEX idx_applicants_job ON talent_applicants(job_id);
CREATE INDEX idx_applicants_status ON talent_applicants(status);
CREATE INDEX idx_applicants_email ON talent_applicants(email);
CREATE INDEX idx_applicants_ai_score ON talent_applicants(ai_score DESC);
CREATE INDEX idx_applicants_created ON talent_applicants(created_at DESC);
CREATE INDEX idx_applicants_blockchain ON talent_applicants(blockchain_hash) WHERE blockchain_hash IS NOT NULL;
CREATE INDEX idx_applicants_skills ON talent_applicants USING GIN(skills);

-- RLS
ALTER TABLE talent_applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_applicants ON talent_applicants
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- 2. APPLICANT ACTIVITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_applicant_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES talent_applicants(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type VARCHAR(100) NOT NULL, -- 'status_change', 'email_sent', 'interview_scheduled', 'note_added', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB,
  
  -- Actor
  actor_type VARCHAR(50), -- 'user', 'system', 'automation'
  actor_id UUID REFERENCES app.users(id),
  actor_name VARCHAR(255),
  
  -- Blockchain Audit
  blockchain_hash VARCHAR(66),
  prev_hash VARCHAR(66), -- Previous activity hash for chain verification
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applicant_activities_applicant ON talent_applicant_activities(applicant_id, created_at DESC);
CREATE INDEX idx_applicant_activities_tenant ON talent_applicant_activities(tenant_id);
CREATE INDEX idx_applicant_activities_type ON talent_applicant_activities(activity_type);

-- RLS
ALTER TABLE talent_applicant_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_applicant_activities ON talent_applicant_activities
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- 3. AUTOMATION WORKFLOWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Workflow Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  workflow_type VARCHAR(100) NOT NULL, -- 'auto_screen', 'auto_reject', 'auto_schedule', 'auto_email', etc.
  
  -- Trigger Conditions
  trigger_event VARCHAR(100) NOT NULL, -- 'application_received', 'resume_parsed', 'screening_complete', etc.
  trigger_conditions JSONB, -- Conditions that must be met
  
  -- Actions
  actions JSONB NOT NULL, -- Array of actions to perform
  
  -- Configuration
  enabled BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  
  -- Execution Stats
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  
  -- Audit
  created_by UUID REFERENCES app.users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_automation_workflows_tenant ON talent_automation_workflows(tenant_id);
CREATE INDEX idx_automation_workflows_type ON talent_automation_workflows(workflow_type);
CREATE INDEX idx_automation_workflows_enabled ON talent_automation_workflows(enabled) WHERE enabled = true;

-- RLS
ALTER TABLE talent_automation_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_automation_workflows ON talent_automation_workflows
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- 4. AUTOMATION EXECUTION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES talent_automation_workflows(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES talent_applicants(id) ON DELETE SET NULL,
  
  -- Execution Details
  status VARCHAR(50) NOT NULL, -- 'success', 'failure', 'partial'
  trigger_event VARCHAR(100),
  actions_executed JSONB,
  
  -- Results
  result JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_automation_logs_workflow ON talent_automation_logs(workflow_id, executed_at DESC);
CREATE INDEX idx_automation_logs_applicant ON talent_automation_logs(applicant_id);
CREATE INDEX idx_automation_logs_status ON talent_automation_logs(status);

-- RLS
ALTER TABLE talent_automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_automation_logs ON talent_automation_logs
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- 5. AI SCREENING TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_screening_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Template Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  job_id UUID REFERENCES talent_jobs(id) ON DELETE SET NULL,
  
  -- Screening Criteria
  required_skills TEXT[],
  preferred_skills TEXT[],
  min_experience_years DECIMAL(4,2),
  required_education VARCHAR(100),
  required_certifications TEXT[],
  
  -- AI Configuration
  ai_model VARCHAR(100) DEFAULT 'gpt-4',
  ai_prompt TEXT,
  scoring_weights JSONB, -- {skills: 0.4, experience: 0.3, education: 0.2, fit: 0.1}
  pass_threshold DECIMAL(5,2) DEFAULT 70.0,
  
  -- Automation
  auto_reject_below DECIMAL(5,2),
  auto_advance_above DECIMAL(5,2),
  
  -- Usage Stats
  usage_count INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2),
  
  -- Audit
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_screening_templates_tenant ON talent_screening_templates(tenant_id);
CREATE INDEX idx_screening_templates_job ON talent_screening_templates(job_id);

-- RLS
ALTER TABLE talent_screening_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_screening_templates ON talent_screening_templates
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- 6. BLOCKCHAIN AUDIT TRAIL TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_blockchain_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Entity Reference
  entity_type VARCHAR(50) NOT NULL, -- 'applicant', 'activity', 'screening'
  entity_id UUID NOT NULL,
  
  -- Blockchain Data
  data_hash VARCHAR(66) NOT NULL, -- Keccak256 hash of the data
  prev_hash VARCHAR(66), -- Previous hash in chain
  merkle_root VARCHAR(66), -- Merkle root if batched
  
  -- Transaction Details
  tx_hash VARCHAR(66), -- Blockchain transaction hash
  block_number BIGINT,
  chain_id INTEGER, -- 1 = Ethereum, 137 = Polygon, etc.
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_proof JSONB,
  
  -- Metadata
  data_snapshot JSONB, -- Snapshot of data at time of hashing
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blockchain_audits_entity ON talent_blockchain_audits(entity_type, entity_id);
CREATE INDEX idx_blockchain_audits_hash ON talent_blockchain_audits(data_hash);
CREATE INDEX idx_blockchain_audits_tx ON talent_blockchain_audits(tx_hash) WHERE tx_hash IS NOT NULL;

-- RLS
ALTER TABLE talent_blockchain_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_blockchain_audits ON talent_blockchain_audits
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to calculate AI match score
CREATE OR REPLACE FUNCTION calculate_applicant_match_score(
  p_applicant_id UUID,
  p_template_id UUID
) RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_score DECIMAL(5,2) := 0;
BEGIN
  -- This is a placeholder - actual implementation would use AI
  -- For now, return a random score between 60-95
  v_score := 60 + (RANDOM() * 35);
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Function to generate blockchain hash
CREATE OR REPLACE FUNCTION generate_blockchain_hash(
  p_data JSONB
) RETURNS VARCHAR(66) AS $$
BEGIN
  -- Generate a deterministic hash from the data
  -- In production, this would use Keccak256
  RETURN '0x' || encode(digest(p_data::TEXT, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_applicant_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applicants_updated_at
  BEFORE UPDATE ON talent_applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_applicant_timestamp();

CREATE TRIGGER automation_workflows_updated_at
  BEFORE UPDATE ON talent_automation_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_applicant_timestamp();

CREATE TRIGGER screening_templates_updated_at
  BEFORE UPDATE ON talent_screening_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_applicant_timestamp();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default automation workflows
INSERT INTO talent_automation_workflows (
  tenant_id,
  name,
  description,
  workflow_type,
  trigger_event,
  trigger_conditions,
  actions,
  enabled
) VALUES
(
  (SELECT id FROM tenants LIMIT 1),
  'Auto-Screen New Applicants',
  'Automatically screen new applicants using AI when resume is parsed',
  'auto_screen',
  'resume_parsed',
  '{"min_experience": 0}'::JSONB,
  '[{"type": "ai_screen", "template_id": null}, {"type": "send_email", "template": "screening_complete"}]'::JSONB,
  true
),
(
  (SELECT id FROM tenants LIMIT 1),
  'Auto-Reject Low Scores',
  'Automatically reject applicants with AI score below 40',
  'auto_reject',
  'screening_complete',
  '{"max_score": 40}'::JSONB,
  '[{"type": "update_status", "status": "rejected"}, {"type": "send_email", "template": "rejection"}]'::JSONB,
  false
),
(
  (SELECT id FROM tenants LIMIT 1),
  'Auto-Advance High Scores',
  'Automatically advance applicants with AI score above 85 to interview stage',
  'auto_advance',
  'screening_complete',
  '{"min_score": 85}'::JSONB,
  '[{"type": "update_status", "status": "interviewing"}, {"type": "send_email", "template": "interview_invitation"}]'::JSONB,
  false
);

-- Insert default screening template
INSERT INTO talent_screening_templates (
  tenant_id,
  name,
  description,
  required_skills,
  min_experience_years,
  ai_prompt,
  scoring_weights,
  pass_threshold
) VALUES
(
  (SELECT id FROM tenants LIMIT 1),
  'General Technical Screening',
  'Default screening template for technical positions',
  ARRAY['Problem Solving', 'Communication', 'Technical Skills'],
  2.0,
  'Evaluate this candidate based on their technical skills, experience, and cultural fit. Provide a score from 0-100 and detailed feedback.',
  '{"skills": 0.4, "experience": 0.3, "education": 0.2, "fit": 0.1}'::JSONB,
  70.0
);

COMMENT ON TABLE talent_applicants IS 'Stores applicant information with AI parsing, blockchain verification, and automation support';
COMMENT ON TABLE talent_applicant_activities IS 'Tracks all activities and interactions with applicants with blockchain audit trail';
COMMENT ON TABLE talent_automation_workflows IS 'Defines RPA automation workflows for applicant processing';
COMMENT ON TABLE talent_automation_logs IS 'Logs execution of automation workflows';
COMMENT ON TABLE talent_screening_templates IS 'AI screening templates with configurable criteria and scoring';
COMMENT ON TABLE talent_blockchain_audits IS 'Blockchain audit trail for tamper-proof verification';
