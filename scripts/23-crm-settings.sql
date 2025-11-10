-- CRM Settings Schema with AI/ML Enhancement
-- Multi-tenant CRM configuration with blockchain audit

-- Pipeline stages configuration
CREATE TABLE IF NOT EXISTS crm.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
  display_order INTEGER NOT NULL,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  is_closed_won BOOLEAN DEFAULT false,
  is_closed_lost BOOLEAN DEFAULT false,
  
  -- AI/ML fields
  avg_days_in_stage INTEGER,
  conversion_rate DECIMAL(5,2),
  
  -- Blockchain audit
  hash TEXT,
  prev_hash TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- SLA configurations
CREATE TABLE IF NOT EXISTS crm.sla_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL, -- 'lead', 'opportunity', 'contact'
  priority TEXT, -- 'hot', 'warm', 'cold'
  target_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- AI/ML fields
  compliance_rate DECIMAL(5,2),
  avg_response_minutes INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dedupe rules
CREATE TABLE IF NOT EXISTS crm.dedupe_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'contact', 'lead', 'account'
  match_fields JSONB NOT NULL, -- ['email', 'phone', 'company_name']
  fuzzy_threshold DECIMAL(3,2), -- 0.80 for 80% similarity
  is_active BOOLEAN DEFAULT true,
  auto_merge BOOLEAN DEFAULT false,
  
  -- AI/ML fields
  matches_found INTEGER DEFAULT 0,
  auto_merged INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- General CRM settings
CREATE TABLE IF NOT EXISTS crm.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
  
  -- General settings
  default_currency TEXT DEFAULT 'USD',
  fiscal_year_start INTEGER DEFAULT 1, -- 1 = January
  auto_assign_leads BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- AI/ML settings
  ai_lead_scoring BOOLEAN DEFAULT true,
  ai_opportunity_insights BOOLEAN DEFAULT true,
  ai_email_suggestions BOOLEAN DEFAULT true,
  ml_prediction_threshold DECIMAL(3,2) DEFAULT 0.70,
  
  -- Integration settings
  integrations JSONB DEFAULT '{}',
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_tenant ON crm.pipeline_stages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_order ON crm.pipeline_stages(tenant_id, display_order);
CREATE INDEX IF NOT EXISTS idx_sla_rules_tenant ON crm.sla_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dedupe_rules_tenant ON crm.dedupe_rules(tenant_id);

-- RLS Policies
ALTER TABLE crm.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.sla_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.dedupe_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tenant's pipeline stages"
  ON crm.pipeline_stages FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their tenant's pipeline stages"
  ON crm.pipeline_stages FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their tenant's SLA rules"
  ON crm.sla_rules FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their tenant's SLA rules"
  ON crm.sla_rules FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their tenant's dedupe rules"
  ON crm.dedupe_rules FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their tenant's dedupe rules"
  ON crm.dedupe_rules FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their tenant's settings"
  ON crm.settings FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their tenant's settings"
  ON crm.settings FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Seed default pipeline stages
INSERT INTO crm.pipeline_stages (tenant_id, name, probability, display_order, color, is_closed_won, is_closed_lost)
SELECT 
  t.id,
  stage.name,
  stage.probability,
  stage.display_order,
  stage.color,
  stage.is_closed_won,
  stage.is_closed_lost
FROM tenants t
CROSS JOIN (
  VALUES 
    ('Qualified', 20, 1, '#3b82f6', false, false),
    ('Demo', 40, 2, '#8b5cf6', false, false),
    ('Proposal', 60, 3, '#ec4899', false, false),
    ('Negotiation', 80, 4, '#f59e0b', false, false),
    ('Closed Won', 100, 5, '#10b981', true, false),
    ('Closed Lost', 0, 6, '#ef4444', false, true)
) AS stage(name, probability, display_order, color, is_closed_won, is_closed_lost)
ON CONFLICT DO NOTHING;
