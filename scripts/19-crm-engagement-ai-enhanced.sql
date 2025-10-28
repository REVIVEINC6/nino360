-- CRM Engagement AI-Enhanced Schema
-- Sequences, Templates, Campaigns with AI optimization and blockchain audit

-- Email sequences with AI optimization
CREATE TABLE IF NOT EXISTS crm.email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]', -- Array of {step_number, delay_days, subject, body, ai_optimized}
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  
  -- AI optimization
  ai_optimized BOOLEAN DEFAULT false,
  ai_insights JSONB, -- {best_send_time, subject_variants, predicted_open_rate}
  ml_confidence DECIMAL(5,2),
  
  -- Performance metrics
  total_enrolled INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_replied INTEGER DEFAULT 0,
  avg_open_rate DECIMAL(5,2),
  avg_click_rate DECIMAL(5,2),
  avg_reply_rate DECIMAL(5,2),
  
  -- Blockchain audit
  blockchain_hash TEXT,
  previous_hash TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_sequence_name_per_tenant UNIQUE(tenant_id, name)
);

-- Sequence enrollments
CREATE TABLE IF NOT EXISTS crm.sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES crm.email_sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES crm.contacts(id) ON DELETE CASCADE,
  
  current_step INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed')),
  
  -- Engagement tracking
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  replied BOOLEAN DEFAULT false,
  
  -- AI predictions
  predicted_engagement_score DECIMAL(5,2),
  predicted_reply_probability DECIMAL(5,2),
  
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_contact_sequence UNIQUE(tenant_id, sequence_id, contact_id)
);

-- Email templates with AI generation
CREATE TABLE IF NOT EXISTS crm.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'outreach', 'scheduling', 'sales', 'general'
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- AI features
  ai_generated BOOLEAN DEFAULT false,
  ai_variants JSONB, -- Array of AI-generated subject/body variants
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  avg_open_rate DECIMAL(5,2),
  avg_reply_rate DECIMAL(5,2),
  
  -- Blockchain audit
  blockchain_hash TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_template_name_per_tenant UNIQUE(tenant_id, name)
);

-- Marketing campaigns with AI optimization
CREATE TABLE IF NOT EXISTS crm.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES crm.email_templates(id),
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  
  -- Targeting
  segment_criteria JSONB, -- Filter criteria for recipients
  recipient_count INTEGER DEFAULT 0,
  
  -- AI optimization
  ai_optimized BOOLEAN DEFAULT false,
  ai_send_time TIMESTAMPTZ, -- AI-predicted best send time
  ai_insights JSONB, -- {predicted_open_rate, predicted_click_rate, recommendations}
  
  -- Performance metrics
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  -- Blockchain audit
  blockchain_hash TEXT,
  previous_hash TEXT,
  
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign recipients tracking
CREATE TABLE IF NOT EXISTS crm.campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES crm.marketing_campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES crm.contacts(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- AI engagement prediction
  predicted_engagement_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_campaign_recipient UNIQUE(tenant_id, campaign_id, contact_id)
);

-- RLS Policies
ALTER TABLE crm.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequences in their tenant" ON crm.email_sequences FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
CREATE POLICY "Users can manage sequences in their tenant" ON crm.email_sequences FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view enrollments in their tenant" ON crm.sequence_enrollments FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
CREATE POLICY "Users can manage enrollments in their tenant" ON crm.sequence_enrollments FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view templates in their tenant" ON crm.email_templates FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
CREATE POLICY "Users can manage templates in their tenant" ON crm.email_templates FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view campaigns in their tenant" ON crm.marketing_campaigns FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
CREATE POLICY "Users can manage campaigns in their tenant" ON crm.marketing_campaigns FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view recipients in their tenant" ON crm.campaign_recipients FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
CREATE POLICY "Users can manage recipients in their tenant" ON crm.campaign_recipients FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Indexes
CREATE INDEX idx_sequences_tenant ON crm.email_sequences(tenant_id);
CREATE INDEX idx_sequences_status ON crm.email_sequences(status);
CREATE INDEX idx_enrollments_tenant ON crm.sequence_enrollments(tenant_id);
CREATE INDEX idx_enrollments_sequence ON crm.sequence_enrollments(sequence_id);
CREATE INDEX idx_enrollments_contact ON crm.sequence_enrollments(contact_id);
CREATE INDEX idx_enrollments_next_send ON crm.sequence_enrollments(next_send_at) WHERE status = 'active';
CREATE INDEX idx_templates_tenant ON crm.email_templates(tenant_id);
CREATE INDEX idx_templates_category ON crm.email_templates(category);
CREATE INDEX idx_campaigns_tenant ON crm.marketing_campaigns(tenant_id);
CREATE INDEX idx_campaigns_status ON crm.marketing_campaigns(status);
CREATE INDEX idx_recipients_campaign ON crm.campaign_recipients(campaign_id);
CREATE INDEX idx_recipients_contact ON crm.campaign_recipients(contact_id);

-- Triggers for updated_at
CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON crm.email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON crm.sequence_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON crm.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON crm.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipients_updated_at BEFORE UPDATE ON crm.campaign_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
