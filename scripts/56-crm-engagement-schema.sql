-- CRM Engagement Module Schema
-- Email sequences, templates, campaigns with AI optimization

-- Email Sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  
  -- Stats
  total_enrolled INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_replied INTEGER DEFAULT 0,
  avg_open_rate DECIMAL(5,2) DEFAULT 0,
  avg_click_rate DECIMAL(5,2) DEFAULT 0,
  avg_reply_rate DECIMAL(5,2) DEFAULT 0,
  
  -- AI Optimization
  ai_optimized BOOLEAN DEFAULT FALSE,
  ai_insights JSONB,
  ml_confidence DECIMAL(3,2) DEFAULT 0,
  
  -- Blockchain
  blockchain_hash TEXT,
  blockchain_timestamp TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_created_by ON email_sequences(created_by);

-- Sequence Enrollments
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL,
  
  -- Progress
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed')),
  next_send_at TIMESTAMPTZ,
  
  -- Stats
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  
  -- Metadata
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_sequence ON sequence_enrollments(sequence_id);
CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_contact ON sequence_enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_next_send ON sequence_enrollments(next_send_at) WHERE status = 'active';

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- Usage
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- AI Enhancement
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_variants JSONB,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_usage ON email_templates(usage_count DESC);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES email_templates(id),
  
  -- Targeting
  segment_criteria JSONB,
  recipient_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Stats
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  -- AI Optimization
  ai_optimized BOOLEAN DEFAULT FALSE,
  ai_send_time TIMESTAMPTZ,
  ai_insights JSONB,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_scheduled ON marketing_campaigns(scheduled_at) WHERE status = 'scheduled';

-- Email Tracking Events
CREATE TABLE IF NOT EXISTS email_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL CHECK (email_type IN ('sequence', 'campaign', 'one_off')),
  reference_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  
  -- Event
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'unsubscribed')),
  event_data JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_tracking_reference ON email_tracking_events(reference_id, email_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_contact ON email_tracking_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_event_type ON email_tracking_events(event_type);

-- Sample Data
INSERT INTO email_sequences (name, description, steps, status, total_enrolled, avg_open_rate, ai_optimized, ml_confidence) VALUES
('Welcome Series', 'Onboarding sequence for new leads', '[
  {"step_number": 1, "delay_days": 0, "subject": "Welcome to our platform!", "body": "Thank you for signing up..."},
  {"step_number": 2, "delay_days": 2, "subject": "Getting started guide", "body": "Here are some tips..."},
  {"step_number": 3, "delay_days": 5, "subject": "Have questions?", "body": "Our team is here to help..."}
]'::jsonb, 'active', 245, 42.5, true, 0.87),
('Re-engagement Campaign', 'Win back inactive contacts', '[
  {"step_number": 1, "delay_days": 0, "subject": "We miss you!", "body": "It has been a while..."},
  {"step_number": 2, "delay_days": 3, "subject": "Special offer just for you", "body": "Come back and get 20% off..."}
]'::jsonb, 'active', 89, 28.3, true, 0.72),
('Product Demo Follow-up', 'Follow up after product demo', '[
  {"step_number": 1, "delay_days": 0, "subject": "Thanks for the demo!", "body": "It was great meeting you..."},
  {"step_number": 2, "delay_days": 1, "subject": "Questions about pricing?", "body": "Let me know if you need clarification..."},
  {"step_number": 3, "delay_days": 3, "subject": "Ready to get started?", "body": "I can help you onboard..."}
]'::jsonb, 'active', 156, 55.8, true, 0.91);

INSERT INTO email_templates (name, category, subject, body, usage_count, ai_generated) VALUES
('Cold Outreach', 'prospecting', 'Quick question about {{company}}', 'Hi {{first_name}},\n\nI noticed that {{company}} is...\n\nBest,\n{{sender_name}}', 342, true),
('Meeting Follow-up', 'follow_up', 'Great meeting you, {{first_name}}!', 'Hi {{first_name}},\n\nThank you for taking the time...\n\nBest regards,\n{{sender_name}}', 198, false),
('Proposal Sent', 'sales', 'Proposal for {{company}}', 'Hi {{first_name}},\n\nAttached is the proposal we discussed...\n\nLooking forward to your feedback!\n{{sender_name}}', 156, true),
('Check-in', 'nurture', 'Checking in', 'Hi {{first_name}},\n\nJust wanted to check in and see how things are going...\n\nBest,\n{{sender_name}}', 89, false);

INSERT INTO marketing_campaigns (name, description, status, recipient_count, sent_count, opened_count, clicked_count, ai_optimized) VALUES
('Q1 Product Launch', 'Announce new product features', 'sent', 1250, 1250, 487, 156, true),
('Customer Success Stories', 'Share case studies', 'sent', 890, 890, 312, 89, true),
('Webinar Invitation', 'Invite to upcoming webinar', 'scheduled', 2100, 0, 0, 0, true);

COMMENT ON TABLE email_sequences IS 'Automated email sequences with AI optimization';
COMMENT ON TABLE sequence_enrollments IS 'Track contacts enrolled in sequences';
COMMENT ON TABLE email_templates IS 'Reusable email templates with AI variants';
COMMENT ON TABLE marketing_campaigns IS 'Bulk email campaigns with AI send time optimization';
COMMENT ON TABLE email_tracking_events IS 'Track all email engagement events';
