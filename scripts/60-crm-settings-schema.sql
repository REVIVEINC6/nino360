-- CRM Settings Schema
-- Comprehensive settings for pipeline stages, SLAs, dedupe rules, and general preferences

-- Create CRM schema if not exists
CREATE SCHEMA IF NOT EXISTS crm;

-- Pipeline Stages Table
CREATE TABLE IF NOT EXISTS crm.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL,
  probability INTEGER NOT NULL DEFAULT 0, -- Win probability percentage
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  is_closed_won BOOLEAN DEFAULT false,
  is_closed_lost BOOLEAN DEFAULT false,
  
  -- AI/ML fields
  avg_days_in_stage INTEGER,
  conversion_rate DECIMAL(5,2), -- Percentage
  ai_insights JSONB DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_pipeline_stages_tenant ON crm.pipeline_stages(tenant_id);
CREATE INDEX idx_pipeline_stages_order ON crm.pipeline_stages(tenant_id, display_order);

-- SLA Rules Table
CREATE TABLE IF NOT EXISTS crm.sla_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- 'lead', 'opportunity', 'contact'
  priority VARCHAR(20) NOT NULL, -- 'high', 'medium', 'low'
  target_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Conditions
  conditions JSONB DEFAULT '{}',
  
  -- Tracking
  compliance_rate DECIMAL(5,2),
  violations_count INTEGER DEFAULT 0,
  last_checked_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sla_rules_tenant ON crm.sla_rules(tenant_id);
CREATE INDEX idx_sla_rules_entity ON crm.sla_rules(tenant_id, entity_type);

-- Dedupe Rules Table
CREATE TABLE IF NOT EXISTS crm.dedupe_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- 'lead', 'contact', 'account'
  match_fields TEXT[] NOT NULL, -- Fields to match on
  fuzzy_threshold DECIMAL(3,2), -- 0.0 to 1.0 for fuzzy matching
  auto_merge BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- AI/ML fields
  ml_model_version VARCHAR(50),
  confidence_threshold DECIMAL(3,2) DEFAULT 0.85,
  
  -- Statistics
  matches_found INTEGER DEFAULT 0,
  auto_merged_count INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dedupe_rules_tenant ON crm.dedupe_rules(tenant_id);
CREATE INDEX idx_dedupe_rules_entity ON crm.dedupe_rules(tenant_id, entity_type);

-- General Settings Table
CREATE TABLE IF NOT EXISTS crm.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE UNIQUE,
  
  -- General settings
  default_currency VARCHAR(3) DEFAULT 'USD',
  fiscal_year_start INTEGER DEFAULT 1, -- Month (1-12)
  
  -- Automation settings
  auto_assign_leads BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- AI/ML settings
  ai_lead_scoring BOOLEAN DEFAULT true,
  ai_opportunity_insights BOOLEAN DEFAULT true,
  ai_email_suggestions BOOLEAN DEFAULT true,
  ml_prediction_threshold DECIMAL(3,2) DEFAULT 0.70,
  
  -- Integration settings
  integrations JSONB DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_crm_settings_tenant ON crm.settings(tenant_id);

-- Insert sample pipeline stages
INSERT INTO crm.pipeline_stages (tenant_id, name, display_order, probability, color, avg_days_in_stage, conversion_rate) VALUES
  ((SELECT id FROM app.tenants LIMIT 1), 'Prospecting', 1, 10, '#3B82F6', 7, 45.5),
  ((SELECT id FROM app.tenants LIMIT 1), 'Qualification', 2, 20, '#8B5CF6', 5, 62.3),
  ((SELECT id FROM app.tenants LIMIT 1), 'Needs Analysis', 3, 40, '#EC4899', 10, 71.8),
  ((SELECT id FROM app.tenants LIMIT 1), 'Proposal', 4, 60, '#F59E0B', 14, 58.2),
  ((SELECT id FROM app.tenants LIMIT 1), 'Negotiation', 5, 80, '#10B981', 7, 82.4),
  ((SELECT id FROM app.tenants LIMIT 1), 'Closed Won', 6, 100, '#22C55E', 0, 100.0),
  ((SELECT id FROM app.tenants LIMIT 1), 'Closed Lost', 7, 0, '#EF4444', 0, 0.0)
ON CONFLICT DO NOTHING;

-- Insert sample SLA rules
INSERT INTO crm.sla_rules (tenant_id, name, entity_type, priority, target_minutes, compliance_rate) VALUES
  ((SELECT id FROM app.tenants LIMIT 1), 'High Priority Lead Response', 'lead', 'high', 60, 87.5),
  ((SELECT id FROM app.tenants LIMIT 1), 'Medium Priority Lead Response', 'lead', 'medium', 240, 92.3),
  ((SELECT id FROM app.tenants LIMIT 1), 'Opportunity Follow-up', 'opportunity', 'high', 1440, 78.9),
  ((SELECT id FROM app.tenants LIMIT 1), 'Contact Response Time', 'contact', 'medium', 480, 85.2)
ON CONFLICT DO NOTHING;

-- Insert sample dedupe rules
INSERT INTO crm.dedupe_rules (tenant_id, name, entity_type, match_fields, fuzzy_threshold, auto_merge, matches_found) VALUES
  ((SELECT id FROM app.tenants LIMIT 1), 'Email Match', 'contact', ARRAY['email'], 1.0, true, 23),
  ((SELECT id FROM app.tenants LIMIT 1), 'Phone Match', 'contact', ARRAY['phone'], 1.0, false, 12),
  ((SELECT id FROM app.tenants LIMIT 1), 'Name + Company Match', 'lead', ARRAY['name', 'company'], 0.85, false, 45),
  ((SELECT id FROM app.tenants LIMIT 1), 'Account Domain Match', 'account', ARRAY['domain'], 1.0, true, 8)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO crm.settings (tenant_id, default_currency, fiscal_year_start, auto_assign_leads, email_notifications, ai_lead_scoring, ai_opportunity_insights, ai_email_suggestions, ml_prediction_threshold)
VALUES ((SELECT id FROM app.tenants LIMIT 1), 'USD', 1, true, true, true, true, true, 0.70)
ON CONFLICT (tenant_id) DO NOTHING;

COMMENT ON TABLE crm.pipeline_stages IS 'Sales pipeline stages with AI conversion tracking';
COMMENT ON TABLE crm.sla_rules IS 'Service level agreement rules with compliance monitoring';
COMMENT ON TABLE crm.dedupe_rules IS 'Deduplication rules with AI-powered fuzzy matching';
COMMENT ON TABLE crm.settings IS 'General CRM settings and AI preferences';
