-- Hotlist Module Database Schema
-- Priority Talent Market for Nino360 HRMS

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- HOTLIST CANDIDATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES bench.consultants(id) ON DELETE CASCADE,
  
  -- Priority & Status
  priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'packaged', 'sent', 'interested', 'archived')),
  
  -- Readiness & Scoring
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND readiness_score <= 100),
  
  -- Metadata
  added_by UUID REFERENCES core.users(id),
  added_reason TEXT,
  tags TEXT[],
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(tenant_id, candidate_id)
);

CREATE INDEX idx_hotlist_candidates_tenant ON bench.hotlist_candidates(tenant_id);
CREATE INDEX idx_hotlist_candidates_status ON bench.hotlist_candidates(status);
CREATE INDEX idx_hotlist_candidates_priority ON bench.hotlist_candidates(priority_level);
CREATE INDEX idx_hotlist_candidates_readiness ON bench.hotlist_candidates(readiness_score DESC);

-- =====================================================
-- HOTLIST REQUIREMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Requirement Details
  title VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES crm.accounts(id),
  client_name VARCHAR(255),
  client_contact_name VARCHAR(255),
  client_contact_email VARCHAR(255),
  client_contact_phone VARCHAR(50),
  
  -- Requirements
  skills JSONB DEFAULT '[]'::jsonb,
  required_skills TEXT[],
  preferred_skills TEXT[],
  experience_years INTEGER,
  work_authorization TEXT[],
  location VARCHAR(255),
  remote_allowed BOOLEAN DEFAULT false,
  
  -- Compensation
  pay_range_min DECIMAL(10,2),
  pay_range_max DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Urgency & Status
  urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'filled', 'on_hold', 'closed')),
  open_slots INTEGER DEFAULT 1,
  filled_slots INTEGER DEFAULT 0,
  
  -- Dates
  posted_date DATE DEFAULT CURRENT_DATE,
  target_fill_date DATE,
  actual_fill_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES core.users(id),
  owner_id UUID REFERENCES core.users(id),
  description TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (pay_range_max >= pay_range_min)
);

CREATE INDEX idx_hotlist_requirements_tenant ON bench.hotlist_requirements(tenant_id);
CREATE INDEX idx_hotlist_requirements_urgency ON bench.hotlist_requirements(urgency);
CREATE INDEX idx_hotlist_requirements_status ON bench.hotlist_requirements(status);
CREATE INDEX idx_hotlist_requirements_client ON bench.hotlist_requirements(client_id);

-- =====================================================
-- HOTLIST MATCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Match Relationship
  requirement_id UUID NOT NULL REFERENCES bench.hotlist_requirements(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES bench.consultants(id) ON DELETE CASCADE,
  hotlist_candidate_id UUID REFERENCES bench.hotlist_candidates(id) ON DELETE SET NULL,
  
  -- Scoring
  match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  skills_score INTEGER DEFAULT 0,
  availability_score INTEGER DEFAULT 0,
  history_score INTEGER DEFAULT 0,
  ai_score INTEGER,
  
  -- Explainability
  explainability JSONB DEFAULT '{}'::jsonb,
  match_reasons TEXT[],
  concerns TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'suggested' CHECK (status IN ('suggested', 'reviewed', 'submitted', 'rejected', 'accepted')),
  rank INTEGER,
  
  -- Metadata
  matched_by VARCHAR(20) DEFAULT 'auto' CHECK (matched_by IN ('auto', 'manual', 'ai')),
  reviewed_by UUID REFERENCES core.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(tenant_id, requirement_id, candidate_id)
);

CREATE INDEX idx_hotlist_matches_tenant ON bench.hotlist_matches(tenant_id);
CREATE INDEX idx_hotlist_matches_requirement ON bench.hotlist_matches(requirement_id);
CREATE INDEX idx_hotlist_matches_candidate ON bench.hotlist_matches(candidate_id);
CREATE INDEX idx_hotlist_matches_score ON bench.hotlist_matches(match_score DESC);
CREATE INDEX idx_hotlist_matches_status ON bench.hotlist_matches(status);

-- =====================================================
-- HOTLIST ONE-PAGERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_onepagers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Candidate Reference
  candidate_id UUID NOT NULL REFERENCES bench.consultants(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES bench.hotlist_requirements(id) ON DELETE SET NULL,
  
  -- Content
  title VARCHAR(255),
  summary TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  highlights TEXT[],
  availability VARCHAR(255),
  
  -- Contact (masked by default)
  contact_masked BOOLEAN DEFAULT true,
  contact_email_masked VARCHAR(255),
  contact_phone_masked VARCHAR(50),
  
  -- Generation
  generated_by VARCHAR(20) DEFAULT 'ai' CHECK (generated_by IN ('ai', 'manual', 'template')),
  tone VARCHAR(20) DEFAULT 'professional',
  anonymized BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  
  -- Files
  pdf_url TEXT,
  html_content TEXT,
  
  -- Metadata
  created_by UUID REFERENCES core.users(id),
  template_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hotlist_onepagers_tenant ON bench.hotlist_onepagers(tenant_id);
CREATE INDEX idx_hotlist_onepagers_candidate ON bench.hotlist_onepagers(candidate_id);
CREATE INDEX idx_hotlist_onepagers_requirement ON bench.hotlist_onepagers(requirement_id);

-- =====================================================
-- HOTLIST CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Campaign Details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'outreach' CHECK (type IN ('outreach', 'submission', 'follow_up', 'nurture')),
  
  -- Target
  requirement_id UUID REFERENCES bench.hotlist_requirements(id) ON DELETE SET NULL,
  candidate_ids UUID[] DEFAULT ARRAY[]::UUID[],
  recipient_type VARCHAR(20) CHECK (recipient_type IN ('client', 'vendor', 'internal')),
  recipient_emails TEXT[],
  
  -- Content
  template_id UUID,
  subject VARCHAR(500),
  body TEXT,
  personalized BOOLEAN DEFAULT false,
  
  -- Sending
  channel VARCHAR(20) DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'linkedin', 'portal')),
  send_window_start TIMESTAMP WITH TIME ZONE,
  send_window_end TIMESTAMP WITH TIME ZONE,
  throttle_limit INTEGER DEFAULT 50,
  
  -- Status & Metrics
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  interested_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES core.users(id),
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_hotlist_campaigns_tenant ON bench.hotlist_campaigns(tenant_id);
CREATE INDEX idx_hotlist_campaigns_status ON bench.hotlist_campaigns(status);
CREATE INDEX idx_hotlist_campaigns_requirement ON bench.hotlist_campaigns(requirement_id);
CREATE INDEX idx_hotlist_campaigns_created ON bench.hotlist_campaigns(created_at DESC);

-- =====================================================
-- HOTLIST MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Campaign Reference
  campaign_id UUID NOT NULL REFERENCES bench.hotlist_campaigns(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES bench.consultants(id) ON DELETE SET NULL,
  
  -- Recipient
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  recipient_type VARCHAR(20),
  
  -- Content
  subject VARCHAR(500),
  body TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Delivery
  channel VARCHAR(20) DEFAULT 'email',
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'delivered', 'bounced', 'failed')),
  external_id VARCHAR(255),
  
  -- Engagement
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_hotlist_messages_tenant ON bench.hotlist_messages(tenant_id);
CREATE INDEX idx_hotlist_messages_campaign ON bench.hotlist_messages(campaign_id);
CREATE INDEX idx_hotlist_messages_status ON bench.hotlist_messages(status);
CREATE INDEX idx_hotlist_messages_recipient ON bench.hotlist_messages(recipient_email);

-- =====================================================
-- HOTLIST REPLIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Message Reference
  message_id UUID REFERENCES bench.hotlist_messages(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES bench.hotlist_campaigns(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES bench.consultants(id) ON DELETE SET NULL,
  
  -- Reply Details
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  subject VARCHAR(500),
  body TEXT,
  
  -- Intent Detection (AI)
  intent_label VARCHAR(50) CHECK (intent_label IN ('interested', 'maybe', 'not_interested', 'need_more_info', 'request_interview', 'request_rate', 'out_of_office', 'unsubscribe')),
  intent_confidence DECIMAL(3,2) CHECK (intent_confidence >= 0 AND intent_confidence <= 1),
  suggested_action VARCHAR(100),
  
  -- Processing
  processed BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES core.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  raw_email JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hotlist_replies_tenant ON bench.hotlist_replies(tenant_id);
CREATE INDEX idx_hotlist_replies_message ON bench.hotlist_replies(message_id);
CREATE INDEX idx_hotlist_replies_campaign ON bench.hotlist_replies(campaign_id);
CREATE INDEX idx_hotlist_replies_intent ON bench.hotlist_replies(intent_label);
CREATE INDEX idx_hotlist_replies_processed ON bench.hotlist_replies(processed);

-- =====================================================
-- HOTLIST CONSENT RECORDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_consent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Consent Details
  candidate_id UUID NOT NULL REFERENCES bench.consultants(id) ON DELETE CASCADE,
  share_id UUID, -- Reference to campaign, message, or export
  share_type VARCHAR(20) CHECK (share_type IN ('campaign', 'message', 'export', 'onepager')),
  
  -- Requestor
  requested_by UUID REFERENCES core.users(id),
  requested_for VARCHAR(255), -- Client/vendor name
  requested_reason TEXT,
  
  -- Approval
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES core.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- PII Fields Revealed
  fields_revealed TEXT[],
  
  -- Ledger/Blockchain Proof
  ledger_proof_id UUID,
  blockchain_hash VARCHAR(255),
  blockchain_signature TEXT,
  blockchain_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES core.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hotlist_consent_tenant ON bench.hotlist_consent(tenant_id);
CREATE INDEX idx_hotlist_consent_candidate ON bench.hotlist_consent(candidate_id);
CREATE INDEX idx_hotlist_consent_share ON bench.hotlist_consent(share_id);
CREATE INDEX idx_hotlist_consent_approved ON bench.hotlist_consent(approved);

-- =====================================================
-- HOTLIST AUTOMATION RULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Rule Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  
  -- Trigger
  trigger_type VARCHAR(50) CHECK (trigger_type IN ('requirement.urgent', 'candidate.added', 'availability_in_14_days', 'low_supply_skill', 'manual', 'scheduled')),
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  
  -- Actions
  actions JSONB DEFAULT '[]'::jsonb, -- Array of action objects
  
  -- Throttling
  throttle_limit INTEGER,
  throttle_window_minutes INTEGER,
  
  -- Execution
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_run_status VARCHAR(20),
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES core.users(id),
  priority INTEGER DEFAULT 5,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hotlist_automation_tenant ON bench.hotlist_automation_rules(tenant_id);
CREATE INDEX idx_hotlist_automation_enabled ON bench.hotlist_automation_rules(enabled);
CREATE INDEX idx_hotlist_automation_trigger ON bench.hotlist_automation_rules(trigger_type);

-- =====================================================
-- HOTLIST AUTOMATION LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bench.hotlist_automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- Rule Reference
  rule_id UUID NOT NULL REFERENCES bench.hotlist_automation_rules(id) ON DELETE CASCADE,
  
  -- Execution
  status VARCHAR(20) CHECK (status IN ('running', 'success', 'partial', 'failed')),
  trigger_data JSONB,
  actions_executed JSONB DEFAULT '[]'::jsonb,
  
  -- Results
  candidates_processed INTEGER DEFAULT 0,
  campaigns_created INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  duration_ms INTEGER,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_hotlist_automation_logs_tenant ON bench.hotlist_automation_logs(tenant_id);
CREATE INDEX idx_hotlist_automation_logs_rule ON bench.hotlist_automation_logs(rule_id);
CREATE INDEX idx_hotlist_automation_logs_status ON bench.hotlist_automation_logs(status);
CREATE INDEX idx_hotlist_automation_logs_started ON bench.hotlist_automation_logs(started_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE bench.hotlist_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_onepagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench.hotlist_automation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant isolation
-- (Policies will be created based on your existing RLS pattern)

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION bench.update_hotlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_hotlist_candidates_updated_at
  BEFORE UPDATE ON bench.hotlist_candidates
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_requirements_updated_at
  BEFORE UPDATE ON bench.hotlist_requirements
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_matches_updated_at
  BEFORE UPDATE ON bench.hotlist_matches
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_onepagers_updated_at
  BEFORE UPDATE ON bench.hotlist_onepagers
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_campaigns_updated_at
  BEFORE UPDATE ON bench.hotlist_campaigns
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_consent_updated_at
  BEFORE UPDATE ON bench.hotlist_consent
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

CREATE TRIGGER update_hotlist_automation_rules_updated_at
  BEFORE UPDATE ON bench.hotlist_automation_rules
  FOR EACH ROW EXECUTE FUNCTION bench.update_hotlist_updated_at();

-- =====================================================
-- SEED DATA (Optional - for development/testing)
-- =====================================================

-- Note: Seed data should be added via separate seed scripts
-- This schema file only defines the structure

COMMENT ON TABLE bench.hotlist_candidates IS 'Priority candidates on the hotlist for rapid placement';
COMMENT ON TABLE bench.hotlist_requirements IS 'Urgent client requirements needing immediate attention';
COMMENT ON TABLE bench.hotlist_matches IS 'AI-powered matching between candidates and requirements';
COMMENT ON TABLE bench.hotlist_onepagers IS 'Generated one-page candidate profiles for quick sharing';
COMMENT ON TABLE bench.hotlist_campaigns IS 'Outreach campaigns for hotlist candidates';
COMMENT ON TABLE bench.hotlist_messages IS 'Individual messages sent as part of campaigns';
COMMENT ON TABLE bench.hotlist_replies IS 'Replies received from campaigns with AI intent detection';
COMMENT ON TABLE bench.hotlist_consent IS 'PII reveal consent records with blockchain audit trail';
COMMENT ON TABLE bench.hotlist_automation_rules IS 'Automation rules for hotlist workflows';
COMMENT ON TABLE bench.hotlist_automation_logs IS 'Execution logs for automation rules';
