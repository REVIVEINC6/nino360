-- Create automation_rules table
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- schedule, event, webhook, manual
  trigger_config JSONB DEFAULT '{}',
  action_type TEXT NOT NULL, -- email, notification, webhook, update, create
  action_config JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create automation_executions table
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- success, failure, pending
  result JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger ON automation_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_executions(status);
CREATE INDEX IF NOT EXISTS idx_automation_executions_created ON automation_executions(created_at);

-- Insert sample automation rules
INSERT INTO automation_rules (name, description, trigger_type, trigger_config, action_type, action_config, is_active) VALUES
('Welcome Email', 'Send welcome email to new users', 'event', '{"event": "user.created"}', 'email', '{"template": "welcome", "to": "{{user.email}}"}', true),
('Daily Report', 'Generate and send daily analytics report', 'schedule', '{"cron": "0 9 * * *"}', 'email', '{"template": "daily_report", "to": "admin@example.com"}', true),
('Inactive User Reminder', 'Remind users who haven''t logged in for 30 days', 'schedule', '{"cron": "0 10 * * 1"}', 'email', '{"template": "inactive_reminder"}', true),
('Lead Assignment', 'Auto-assign new leads to sales reps', 'event', '{"event": "lead.created"}', 'update', '{"field": "assigned_to", "value": "{{next_available_rep}}"}', true),
('Invoice Reminder', 'Send reminder for unpaid invoices', 'schedule', '{"cron": "0 8 * * *"}', 'email', '{"template": "invoice_reminder"}', true);

-- Insert sample executions
INSERT INTO automation_executions (rule_id, status, result, execution_time_ms) 
SELECT 
  id,
  CASE WHEN random() > 0.1 THEN 'success' ELSE 'failure' END,
  '{"message": "Execution completed"}',
  (random() * 1000)::INTEGER
FROM automation_rules
CROSS JOIN generate_series(1, 10);
