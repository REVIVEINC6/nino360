-- AI-Enhanced Talent Sourcing Schema
-- Extends existing talent sourcing with ML predictions, auto-outreach, blockchain audit, RPA

-- Create necessary schemas and base tables
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS talent;

-- Create base tenants table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create a function to get current tenant ID (placeholder for RLS)
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT '00000000-0000-0000-0000-000000000000'::uuid;
$$;

-- Create base candidates table if it doesn't exist
CREATE TABLE IF NOT EXISTS talent.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create base pools table if it doesn't exist
CREATE TABLE IF NOT EXISTS talent.pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Extend candidates table with AI/ML fields
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS ai_enrichment jsonb DEFAULT '{}'::jsonb;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS ml_match_score numeric(5,2) DEFAULT 0;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS engagement_score int DEFAULT 0;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS last_engaged_at timestamptz;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS outreach_status text DEFAULT 'not_contacted' CHECK (outreach_status IN ('not_contacted','contacted','responded','interested','not_interested','bounced'));
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS blockchain_hash text;
ALTER TABLE talent.candidates ADD COLUMN IF NOT EXISTS previous_hash text;

CREATE INDEX IF NOT EXISTS idx_candidates_ml_score ON talent.candidates(ml_match_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_engagement ON talent.candidates(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_outreach ON talent.candidates(outreach_status);

-- AI Sourcing Insights (Theory of Mind personalization)
CREATE TABLE IF NOT EXISTS talent.sourcing_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id uuid,
  insight_type text NOT NULL CHECK (insight_type IN ('recommendation','prediction','anomaly','trend')),
  title text NOT NULL,
  description text,
  confidence numeric(5,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  action_taken boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_sourcing_insights_tenant ON talent.sourcing_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_insights_user ON talent.sourcing_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_insights_type ON talent.sourcing_insights(insight_type);

-- Auto-Outreach Campaigns
CREATE TABLE IF NOT EXISTS talent.outreach_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  template_subject text NOT NULL,
  template_body text NOT NULL,
  target_pool_id uuid REFERENCES talent.pools(id) ON DELETE SET NULL,
  target_filters jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','active','paused','completed','cancelled')),
  scheduled_at timestamptz,
  sent_count int DEFAULT 0,
  opened_count int DEFAULT 0,
  replied_count int DEFAULT 0,
  interested_count int DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_tenant ON talent.outreach_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_status ON talent.outreach_campaigns(status);

-- Campaign Messages (tracking individual outreach)
CREATE TABLE IF NOT EXISTS talent.campaign_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES talent.outreach_campaigns(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES talent.candidates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','opened','replied','bounced','failed')),
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  reply_text text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_messages_tenant ON talent.campaign_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign ON talent.campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_status ON talent.campaign_messages(status);

-- ML Model Performance Tracking (Self-aware AI)
CREATE TABLE IF NOT EXISTS talent.ml_sourcing_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  model_type text NOT NULL CHECK (model_type IN ('match_scoring','engagement_prediction','response_prediction','skill_extraction')),
  model_version text NOT NULL,
  accuracy numeric(5,2) DEFAULT 0,
  precision_score numeric(5,2) DEFAULT 0,
  recall_score numeric(5,2) DEFAULT 0,
  f1_score numeric(5,2) DEFAULT 0,
  training_samples int DEFAULT 0,
  last_trained_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('training','active','deprecated')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ml_sourcing_models_tenant ON talent.ml_sourcing_models(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ml_sourcing_models_type ON talent.ml_sourcing_models(model_type);

-- RPA Sourcing Workflows
CREATE TABLE IF NOT EXISTS talent.rpa_sourcing_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('candidate_imported','match_found','response_received','engagement_threshold','schedule')),
  trigger_config jsonb DEFAULT '{}'::jsonb,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean DEFAULT true,
  execution_count int DEFAULT 0,
  last_executed_at timestamptz,
  avg_execution_time_ms int,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rpa_sourcing_workflows_tenant ON talent.rpa_sourcing_workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rpa_sourcing_workflows_trigger ON talent.rpa_sourcing_workflows(trigger_type);

-- RPA Execution Logs
CREATE TABLE IF NOT EXISTS talent.rpa_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  workflow_id uuid NOT NULL REFERENCES talent.rpa_sourcing_workflows(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('success','failed','partial')),
  execution_time_ms int,
  actions_completed int DEFAULT 0,
  actions_failed int DEFAULT 0,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rpa_execution_logs_tenant ON talent.rpa_execution_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rpa_execution_logs_workflow ON talent.rpa_execution_logs(workflow_id);

-- Blockchain Audit Trail for Sourcing
CREATE TABLE IF NOT EXISTS talent.sourcing_audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('candidate','import','campaign','match','consent')),
  entity_id uuid NOT NULL,
  action_type text NOT NULL,
  actor_user_id uuid,
  data_hash text NOT NULL,
  previous_hash text,
  blockchain_tx_hash text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_audit_tenant ON talent.sourcing_audit_trail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_audit_entity ON talent.sourcing_audit_trail(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_audit_verification ON talent.sourcing_audit_trail(verification_status);

-- User Interaction Tracking (for adaptive learning)
CREATE TABLE IF NOT EXISTS talent.sourcing_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('search','filter','view_candidate','add_to_pool','start_campaign','match_review')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_interactions_tenant ON talent.sourcing_interactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_interactions_user ON talent.sourcing_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_interactions_type ON talent.sourcing_interactions(interaction_type);

-- Enable RLS
ALTER TABLE talent.sourcing_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.ml_sourcing_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.rpa_sourcing_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.rpa_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.sourcing_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.sourcing_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY rls_sourcing_insights ON talent.sourcing_insights FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_outreach_campaigns ON talent.outreach_campaigns FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_campaign_messages ON talent.campaign_messages FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_ml_sourcing_models ON talent.ml_sourcing_models FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_rpa_sourcing_workflows ON talent.rpa_sourcing_workflows FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_rpa_execution_logs ON talent.rpa_execution_logs FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_sourcing_audit_trail ON talent.sourcing_audit_trail FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());
CREATE POLICY rls_sourcing_interactions ON talent.sourcing_interactions FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());

-- Helper Functions

-- Compute engagement score based on interactions
CREATE OR REPLACE FUNCTION talent.compute_engagement_score(candidate_id uuid)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  score int := 0;
  days_since_contact int;
BEGIN
  -- Get candidate data
  SELECT 
    CASE 
      WHEN outreach_status = 'responded' THEN 50
      WHEN outreach_status = 'interested' THEN 100
      WHEN outreach_status = 'contacted' THEN 25
      ELSE 0
    END +
    CASE 
      WHEN last_engaged_at IS NOT NULL THEN 
        GREATEST(0, 50 - EXTRACT(DAY FROM now() - last_engaged_at)::int)
      ELSE 0
    END
  INTO score
  FROM talent.candidates
  WHERE id = candidate_id;
  
  RETURN COALESCE(score, 0);
END;
$$;

-- Generate blockchain hash for audit trail
CREATE OR REPLACE FUNCTION talent.generate_audit_hash(
  p_entity_type text,
  p_entity_id uuid,
  p_action_type text,
  p_metadata jsonb,
  p_previous_hash text
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  data_string text;
  hash_result text;
BEGIN
  -- Concatenate data for hashing
  data_string := p_entity_type || '|' || p_entity_id::text || '|' || 
                 p_action_type || '|' || p_metadata::text || '|' || 
                 COALESCE(p_previous_hash, '0') || '|' || now()::text;
  
  -- Generate SHA-256 hash
  hash_result := encode(digest(data_string, 'sha256'), 'hex');
  
  RETURN hash_result;
END;
$$;

-- Auto-update engagement score trigger
CREATE OR REPLACE FUNCTION talent.update_engagement_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.engagement_score := talent.compute_engagement_score(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_engagement_score ON talent.candidates;
CREATE TRIGGER trg_update_engagement_score
BEFORE UPDATE OF outreach_status, last_engaged_at ON talent.candidates
FOR EACH ROW
EXECUTE FUNCTION talent.update_engagement_score();

-- Auto-generate blockchain hash trigger
CREATE OR REPLACE FUNCTION talent.auto_generate_blockchain_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  prev_hash text;
BEGIN
  -- Get previous hash from last audit entry
  SELECT data_hash INTO prev_hash
  FROM talent.sourcing_audit_trail
  WHERE tenant_id = NEW.tenant_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Generate new hash
  NEW.data_hash := talent.generate_audit_hash(
    NEW.entity_type,
    NEW.entity_id,
    NEW.action_type,
    NEW.metadata,
    prev_hash
  );
  
  NEW.previous_hash := prev_hash;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_generate_blockchain_hash ON talent.sourcing_audit_trail;
CREATE TRIGGER trg_auto_generate_blockchain_hash
BEFORE INSERT ON talent.sourcing_audit_trail
FOR EACH ROW
EXECUTE FUNCTION talent.auto_generate_blockchain_hash();

-- Seed Data

-- Insert a default tenant if none exists
INSERT INTO app.tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Tenant', 'default', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample RPA Workflows
INSERT INTO talent.rpa_sourcing_workflows (tenant_id, name, description, trigger_type, trigger_config, actions, enabled)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Auto-Add High Match Candidates to Pool', 'Automatically add candidates with match score > 80 to "Hot Prospects" pool', 'match_found', '{"min_score": 80}'::jsonb, '[{"type": "add_to_pool", "pool_name": "Hot Prospects"}, {"type": "send_notification", "message": "New high-match candidate added"}]'::jsonb, true)
ON CONFLICT DO NOTHING;

INSERT INTO talent.rpa_sourcing_workflows (tenant_id, name, description, trigger_type, trigger_config, actions, enabled)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Follow-up on Unresponsive Candidates', 'Send follow-up email to candidates who haven''t responded in 7 days', 'schedule', '{"schedule": "0 9 * * *", "days_since_contact": 7}'::jsonb, '[{"type": "send_email", "template": "follow_up"}, {"type": "update_status", "status": "follow_up_sent"}]'::jsonb, true)
ON CONFLICT DO NOTHING;

-- Sample ML Models
INSERT INTO talent.ml_sourcing_models (tenant_id, model_type, model_version, accuracy, precision_score, recall_score, f1_score, training_samples, status)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'match_scoring', 'v1.2.0', 87.5, 89.2, 85.8, 87.5, 5000, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO talent.ml_sourcing_models (tenant_id, model_type, model_version, accuracy, precision_score, recall_score, f1_score, training_samples, status)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'engagement_prediction', 'v1.0.0', 82.3, 84.1, 80.5, 82.3, 3000, 'active')
ON CONFLICT DO NOTHING;

-- Analytics View
CREATE OR REPLACE VIEW talent.sourcing_analytics AS
SELECT 
  c.tenant_id,
  COUNT(DISTINCT c.id) as total_candidates,
  COUNT(DISTINCT CASE WHEN c.created_at >= now() - interval '7 days' THEN c.id END) as new_this_week,
  COUNT(DISTINCT CASE WHEN c.outreach_status = 'interested' THEN c.id END) as interested_candidates,
  COUNT(DISTINCT CASE WHEN c.ml_match_score >= 80 THEN c.id END) as high_match_candidates,
  AVG(c.ml_match_score) as avg_match_score,
  AVG(c.engagement_score) as avg_engagement_score,
  COUNT(DISTINCT p.id) as total_pools,
  COUNT(DISTINCT oc.id) as total_campaigns,
  COUNT(DISTINCT CASE WHEN oc.status = 'active' THEN oc.id END) as active_campaigns,
  SUM(oc.sent_count) as total_outreach_sent,
  SUM(oc.replied_count) as total_outreach_replied,
  CASE 
    WHEN SUM(oc.sent_count) > 0 THEN 
      ROUND((SUM(oc.replied_count)::numeric / SUM(oc.sent_count)::numeric * 100), 2)
    ELSE 0
  END as response_rate
FROM talent.candidates c
LEFT JOIN talent.pools p ON p.tenant_id = c.tenant_id
LEFT JOIN talent.outreach_campaigns oc ON oc.tenant_id = c.tenant_id
GROUP BY c.tenant_id;
