-- Talent Automation Rules Schema
-- AI-powered RPA for recruitment workflows

-- Automation Rules
CREATE TABLE IF NOT EXISTS talent_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger VARCHAR(100) NOT NULL, -- application_received, interview_scheduled, etc.
  conditions JSONB DEFAULT '[]', -- Array of conditions to check
  actions JSONB NOT NULL, -- Array of actions to execute
  category VARCHAR(50) NOT NULL, -- screening, communication, scheduling, documentation, ai
  enabled BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  executions INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  last_executed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Execution Logs
CREATE TABLE IF NOT EXISTS talent_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES talent_automation_rules(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  trigger_data JSONB,
  status VARCHAR(50) NOT NULL, -- success, failed, partial
  actions_executed JSONB,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Processing Queue
CREATE TABLE IF NOT EXISTS talent_ai_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  task_type VARCHAR(100) NOT NULL, -- resume_parsing, skill_matching, sentiment_analysis
  entity_type VARCHAR(50) NOT NULL, -- candidate, application, interview
  entity_id UUID NOT NULL,
  input_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  result JSONB,
  ai_model VARCHAR(100),
  processing_time_ms INTEGER,
  error_message TEXT,
  priority INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Templates
CREATE TABLE IF NOT EXISTS talent_workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  steps JSONB NOT NULL, -- Array of workflow steps
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Instances
CREATE TABLE IF NOT EXISTS talent_workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES talent_workflow_templates(id),
  tenant_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  current_step INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  steps_data JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_automation_rules_tenant ON talent_automation_rules(tenant_id);
CREATE INDEX idx_automation_rules_trigger ON talent_automation_rules(trigger);
CREATE INDEX idx_automation_rules_enabled ON talent_automation_rules(enabled);
CREATE INDEX idx_automation_logs_rule ON talent_automation_logs(rule_id);
CREATE INDEX idx_automation_logs_tenant ON talent_automation_logs(tenant_id);
CREATE INDEX idx_ai_queue_status ON talent_ai_processing_queue(status);
CREATE INDEX idx_ai_queue_tenant ON talent_ai_processing_queue(tenant_id);
CREATE INDEX idx_workflow_templates_tenant ON talent_workflow_templates(tenant_id);
CREATE INDEX idx_workflow_instances_template ON talent_workflow_instances(template_id);
CREATE INDEX idx_workflow_instances_entity ON talent_workflow_instances(entity_type, entity_id);

-- RLS Policies
ALTER TABLE talent_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_ai_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_workflow_instances ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO talent_automation_rules (tenant_id, name, description, trigger, category, actions, executions, success_rate) VALUES
('00000000-0000-0000-0000-000000000000', 'Auto-screen Candidates', 'Automatically screen candidates based on minimum requirements', 'application_received', 'screening', '["check_requirements", "calculate_score", "update_status"]', 1247, 94.5),
('00000000-0000-0000-0000-000000000000', 'Send Interview Reminders', 'Send automated reminders 24 hours before interviews', 'interview_scheduled', 'communication', '["schedule_reminder", "send_email", "send_sms"]', 856, 98.2),
('00000000-0000-0000-0000-000000000000', 'Request Interview Feedback', 'Automatically request feedback after interview completion', 'interview_completed', 'communication', '["send_feedback_request", "set_reminder"]', 623, 87.3),
('00000000-0000-0000-0000-000000000000', 'Parse Resume with AI', 'Extract structured data from resumes using AI', 'application_received', 'ai', '["extract_text", "parse_with_ai", "update_profile"]', 2134, 96.8),
('00000000-0000-0000-0000-000000000000', 'Schedule Follow-up Tasks', 'Create follow-up tasks for recruiters', 'candidate_status_change', 'scheduling', '["create_task", "assign_recruiter", "set_due_date"]', 445, 92.1);
