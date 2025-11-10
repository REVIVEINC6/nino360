-- CRM AI Assistant Schema
-- Stores conversation history and AI interactions

-- AI Conversations table
CREATE TABLE IF NOT EXISTS crm_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  actions JSONB DEFAULT '[]'::jsonb,
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_ai_conversations_user ON crm_ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_ai_conversations_conversation ON crm_ai_conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_crm_ai_conversations_created ON crm_ai_conversations(created_at DESC);

-- AI Actions Log table
CREATE TABLE IF NOT EXISTS crm_ai_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_ai_actions_user ON crm_ai_actions_log(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_ai_actions_type ON crm_ai_actions_log(action_type);
CREATE INDEX IF NOT EXISTS idx_crm_ai_actions_status ON crm_ai_actions_log(status);

-- Sample data
INSERT INTO crm_ai_conversations (conversation_id, user_id, user_message, assistant_message, actions) VALUES
('conv-001', '00000000-0000-0000-0000-000000000000', 'Draft a follow-up email for Acme Corp', 'I''ve drafted a personalized follow-up email for Acme Corp. The email includes a recap of your last meeting, addresses their key concerns about scalability, and proposes next steps. Would you like me to open the draft for review?', '[{"type": "draft_email", "label": "Open Email Draft", "data": {"template": "follow_up"}}]'::jsonb),
('conv-002', '00000000-0000-0000-0000-000000000000', 'Show me deals at risk this quarter', 'I''ve analyzed your pipeline and identified 3 deals at risk this quarter: TechStart Inc ($50K) - no activity in 14 days, Global Systems ($75K) - stuck in negotiation for 30 days, and DataCorp ($100K) - decision maker changed. I recommend immediate follow-up actions for each.', '[]'::jsonb),
('conv-003', '00000000-0000-0000-0000-000000000000', 'Schedule a meeting with my team next week', 'I''ve analyzed everyone''s calendars and found the best time slots: Tuesday 2-3 PM (all available), Wednesday 10-11 AM (all available), or Thursday 3-4 PM (all available). Which time works best for you?', '[{"type": "schedule_meeting", "label": "Schedule Meeting", "data": {"type": "calendar"}}]'::jsonb);

COMMENT ON TABLE crm_ai_conversations IS 'Stores AI assistant conversation history';
COMMENT ON TABLE crm_ai_actions_log IS 'Logs AI-triggered actions and their results';
