-- Talent Assessments Schema with AI Evaluation and Skills Testing
-- Version: 1.0
-- Description: Comprehensive assessment management with AI-powered evaluation

-- Assessment Templates Table
CREATE TABLE IF NOT EXISTS assessment_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assessment_type VARCHAR(100), -- 'technical', 'behavioral', 'cognitive', 'personality', 'skills'
  category VARCHAR(100),
  duration_minutes INTEGER,
  passing_score DECIMAL(5, 2),
  
  -- Content
  questions JSONB NOT NULL, -- Array of questions with answers
  scoring_rubric JSONB,
  
  -- AI Features
  ai_generated BOOLEAN DEFAULT false,
  ai_adaptive BOOLEAN DEFAULT false, -- Adaptive difficulty
  ai_proctored BOOLEAN DEFAULT false,
  
  -- Metadata
  difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2),
  
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_assessment_templates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Candidate Assessments Table
CREATE TABLE IF NOT EXISTS candidate_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  application_id UUID REFERENCES applications(id),
  template_id UUID REFERENCES assessment_templates(id),
  
  -- Assessment Details
  assessment_name VARCHAR(255) NOT NULL,
  assessment_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'expired', 'cancelled'
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  time_limit_minutes INTEGER,
  time_spent_minutes INTEGER,
  
  -- Scoring
  total_questions INTEGER,
  questions_answered INTEGER,
  correct_answers INTEGER,
  score DECIMAL(5, 2),
  percentage_score DECIMAL(5, 2),
  passed BOOLEAN,
  
  -- Responses
  responses JSONB, -- Candidate's answers
  
  -- AI Evaluation
  ai_evaluated BOOLEAN DEFAULT false,
  ai_score DECIMAL(5, 2),
  ai_feedback JSONB, -- Detailed AI feedback per question
  ai_strengths TEXT[],
  ai_weaknesses TEXT[],
  ai_recommendations TEXT,
  ai_confidence_score DECIMAL(3, 2),
  
  -- Proctoring
  proctoring_enabled BOOLEAN DEFAULT false,
  proctoring_data JSONB, -- Screenshots, webcam captures, behavior analysis
  ai_cheating_detected BOOLEAN DEFAULT false,
  ai_cheating_confidence DECIMAL(3, 2),
  proctoring_flags JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  browser_info JSONB,
  notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_candidate_assessments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  template_id UUID REFERENCES assessment_templates(id),
  
  -- Question Details
  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- 'multiple_choice', 'true_false', 'short_answer', 'essay', 'coding', 'video'
  difficulty VARCHAR(50),
  category VARCHAR(100),
  tags TEXT[],
  
  -- Options (for multiple choice)
  options JSONB,
  correct_answer TEXT,
  
  -- Scoring
  points DECIMAL(5, 2) DEFAULT 1.0,
  
  -- AI Features
  ai_generated BOOLEAN DEFAULT false,
  ai_evaluation_criteria JSONB,
  
  -- Metadata
  usage_count INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2),
  
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_assessment_questions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Skills Matrix Table
CREATE TABLE IF NOT EXISTS skills_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID REFERENCES candidates(id),
  employee_id UUID REFERENCES employees(id),
  
  -- Skill Details
  skill_name VARCHAR(255) NOT NULL,
  skill_category VARCHAR(100), -- 'technical', 'soft', 'language', 'certification'
  proficiency_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
  proficiency_score DECIMAL(3, 2), -- 0-1 score
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_by VARCHAR(100), -- 'self_reported', 'assessment', 'manager', 'certification'
  verification_date DATE,
  
  -- Assessment Link
  assessment_id UUID REFERENCES candidate_assessments(id),
  
  -- AI Analysis
  ai_verified BOOLEAN DEFAULT false,
  ai_confidence_score DECIMAL(3, 2),
  ai_skill_gap_analysis JSONB,
  
  -- Metadata
  years_experience DECIMAL(3, 1),
  last_used_date DATE,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_skills_matrix_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Assessment Analytics Table
CREATE TABLE IF NOT EXISTS assessment_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  template_id UUID REFERENCES assessment_templates(id),
  
  -- Analytics Data
  total_attempts INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2),
  average_time_minutes INTEGER,
  pass_rate DECIMAL(5, 2),
  
  -- Question Analytics
  question_analytics JSONB, -- Per-question statistics
  
  -- AI Insights
  ai_difficulty_rating DECIMAL(3, 2),
  ai_discrimination_index DECIMAL(3, 2), -- How well it differentiates candidates
  ai_recommendations JSONB,
  
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_assessment_analytics_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_assessment_templates_tenant ON assessment_templates(tenant_id);
CREATE INDEX idx_assessment_templates_type ON assessment_templates(assessment_type);
CREATE INDEX idx_candidate_assessments_tenant ON candidate_assessments(tenant_id);
CREATE INDEX idx_candidate_assessments_candidate ON candidate_assessments(candidate_id);
CREATE INDEX idx_candidate_assessments_status ON candidate_assessments(status);
CREATE INDEX idx_assessment_questions_template ON assessment_questions(template_id);
CREATE INDEX idx_skills_matrix_tenant ON skills_matrix(tenant_id);
CREATE INDEX idx_skills_matrix_candidate ON skills_matrix(candidate_id);
CREATE INDEX idx_assessment_analytics_template ON assessment_analytics(template_id);

-- RLS Policies
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_analytics ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO assessment_templates (tenant_id, name, description, assessment_type, duration_minutes, passing_score, questions) VALUES
((SELECT id FROM tenants LIMIT 1), 'JavaScript Technical Assessment', 'Comprehensive JavaScript skills test', 'technical', 60, 70.0,
'{"questions": [{"id": 1, "text": "What is a closure in JavaScript?", "type": "multiple_choice", "options": ["A", "B", "C", "D"], "correct": "A", "points": 5}]}'),
((SELECT id FROM tenants LIMIT 1), 'Behavioral Interview Assessment', 'Standard behavioral questions', 'behavioral', 45, 60.0,
'{"questions": [{"id": 1, "text": "Tell me about a time you faced a challenge", "type": "essay", "points": 10}]}');
