-- Talent AI Assistant Schema
-- Comprehensive AI chatbot and prompt management

-- AI Conversations Table
CREATE TABLE IF NOT EXISTS talent_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  model VARCHAR(100) DEFAULT 'gpt-4',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- AI Prompt Templates Table
CREATE TABLE IF NOT EXISTS talent_ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- AI Redaction Rules Table
CREATE TABLE IF NOT EXISTS talent_ai_redaction_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL,
  pattern TEXT NOT NULL,
  replacement VARCHAR(100) DEFAULT '[REDACTED]',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Action Logs Table
CREATE TABLE IF NOT EXISTS talent_ai_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conversation_id UUID,
  action_type VARCHAR(100) NOT NULL,
  action_data JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  execution_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_talent_ai_conversations_tenant ON talent_ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_ai_conversations_conversation ON talent_ai_conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_talent_ai_conversations_created ON talent_ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_ai_prompts_tenant ON talent_ai_prompts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_ai_prompts_category ON talent_ai_prompts(category);
CREATE INDEX IF NOT EXISTS idx_talent_ai_redaction_tenant ON talent_ai_redaction_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_ai_action_logs_tenant ON talent_ai_action_logs(tenant_id);

-- RLS Policies
ALTER TABLE talent_ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_ai_redaction_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_ai_action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON talent_ai_conversations
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create conversations" ON talent_ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view prompts" ON talent_ai_prompts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage prompts" ON talent_ai_prompts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Triggers
CREATE OR REPLACE FUNCTION update_prompt_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE talent_ai_prompts
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = NEW.metadata->>'prompt_id';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prompt_usage
  AFTER INSERT ON talent_ai_conversations
  FOR EACH ROW
  WHEN (NEW.role = 'assistant' AND NEW.metadata->>'prompt_id' IS NOT NULL)
  EXECUTE FUNCTION update_prompt_usage();

-- Sample Data
INSERT INTO talent_ai_prompts (tenant_id, name, description, category, prompt_template, variables) VALUES
('00000000-0000-0000-0000-000000000000', 'Resume Parsing', 'Extract structured data from resumes', 'parsing', 'Parse the following resume and extract: name, email, phone, skills, experience, education. Resume: {{resume_text}}', '["resume_text"]'),
('00000000-0000-0000-0000-000000000000', 'JD Optimization', 'Optimize job descriptions for better candidate attraction', 'optimization', 'Optimize this job description to be more attractive and inclusive: {{job_description}}', '["job_description"]'),
('00000000-0000-0000-0000-000000000000', 'Interview Questions', 'Generate relevant interview questions', 'interviews', 'Generate 10 interview questions for a {{job_title}} position focusing on {{skills}}', '["job_title", "skills"]'),
('00000000-0000-0000-0000-000000000000', 'Candidate Scoring', 'Score candidates based on requirements', 'scoring', 'Score this candidate profile against job requirements. Candidate: {{candidate_profile}}, Requirements: {{job_requirements}}', '["candidate_profile", "job_requirements"]');

INSERT INTO talent_ai_redaction_rules (tenant_id, name, description, rule_type, pattern, replacement) VALUES
('00000000-0000-0000-0000-000000000000', 'Email Redaction', 'Redact email addresses', 'email', '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]'),
('00000000-0000-0000-0000-000000000000', 'Phone Redaction', 'Redact phone numbers', 'phone', '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]'),
('00000000-0000-0000-0000-000000000000', 'SSN Redaction', 'Redact social security numbers', 'ssn', '\b\d{3}-\d{2}-\d{4}\b', '[SSN]'),
('00000000-0000-0000-0000-000000000000', 'Address Redaction', 'Redact street addresses', 'address', '\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)', '[ADDRESS]');
