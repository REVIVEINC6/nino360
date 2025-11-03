-- =====================================================
-- CRM Opportunities AI-Enhanced Schema
-- =====================================================
-- Extends crm.opportunities with AI/ML capabilities
-- Adds blockchain audit, RPA automation, and predictive analytics

-- Extend opportunities table with AI/ML fields
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ai_enrichment JSONB DEFAULT '{}'::jsonb;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ml_win_probability NUMERIC(5,2) CHECK (ml_win_probability >= 0 AND ml_win_probability <= 100);
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ml_predicted_amount NUMERIC(15,2);
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ml_predicted_close_date DATE;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ml_confidence_score NUMERIC(5,2) CHECK (ml_confidence_score >= 0 AND ml_confidence_score <= 100);
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS ai_insights TEXT;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS risk_score NUMERIC(5,2) CHECK (risk_score >= 0 AND risk_score <= 100);
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS engagement_score NUMERIC(5,2) CHECK (engagement_score >= 0 AND engagement_score <= 100);
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS last_ai_analysis_at TIMESTAMPTZ;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS blockchain_hash TEXT;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS prev_blockchain_hash TEXT;
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS source TEXT; -- lead_conversion, manual, import, api
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE crm.opportunities ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Create opportunity activities table for timeline
CREATE TABLE IF NOT EXISTS crm.opportunity_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES crm.opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- email, call, meeting, note, stage_change, task_completed
  subject TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create opportunity tasks table
CREATE TABLE IF NOT EXISTS crm.opportunity_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES crm.opportunities(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES core.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create opportunity competitors table
CREATE TABLE IF NOT EXISTS crm.opportunity_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES crm.opportunities(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  strengths TEXT,
  weaknesses TEXT,
  pricing_info TEXT,
  likelihood_to_win NUMERIC(5,2) CHECK (likelihood_to_win >= 0 AND likelihood_to_win <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create opportunity products table (for multi-product deals)
CREATE TABLE IF NOT EXISTS crm.opportunity_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES crm.opportunities(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(15,2),
  discount_percent NUMERIC(5,2) DEFAULT 0,
  total_price NUMERIC(15,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create RLS policies
ALTER TABLE crm.opportunity_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.opportunity_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.opportunity_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.opportunity_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_opportunity_activities" ON crm.opportunity_activities
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "tenant_isolation_opportunity_tasks" ON crm.opportunity_tasks
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "tenant_isolation_opportunity_competitors" ON crm.opportunity_competitors
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "tenant_isolation_opportunity_products" ON crm.opportunity_products
  USING (tenant_id = sec.current_tenant_id());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunities_ml_win_probability ON crm.opportunities(ml_win_probability) WHERE ml_win_probability IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_opportunities_risk_score ON crm.opportunities(risk_score) WHERE risk_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_opportunities_engagement_score ON crm.opportunities(engagement_score) WHERE engagement_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON crm.opportunities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_opportunities_ai_enrichment ON crm.opportunities USING GIN(ai_enrichment);
CREATE INDEX IF NOT EXISTS idx_opportunity_activities_opportunity_id ON crm.opportunity_activities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_activities_occurred_at ON crm.opportunity_activities(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunity_tasks_opportunity_id ON crm.opportunity_tasks(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_tasks_assigned_to ON crm.opportunity_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_opportunity_tasks_due_date ON crm.opportunity_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_opportunity_competitors_opportunity_id ON crm.opportunity_competitors(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_products_opportunity_id ON crm.opportunity_products(opportunity_id);

-- Create helper function to calculate engagement score
CREATE OR REPLACE FUNCTION crm.calculate_engagement_score(opp_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  activity_count INTEGER;
  days_since_last_activity INTEGER;
  task_completion_rate NUMERIC;
  score NUMERIC;
BEGIN
  -- Count activities in last 30 days
  SELECT COUNT(*) INTO activity_count
  FROM crm.opportunity_activities
  WHERE opportunity_id = opp_id
    AND occurred_at >= now() - INTERVAL '30 days';
  
  -- Days since last activity
  SELECT EXTRACT(DAY FROM now() - MAX(occurred_at)) INTO days_since_last_activity
  FROM crm.opportunity_activities
  WHERE opportunity_id = opp_id;
  
  -- Task completion rate
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 50
      ELSE (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100
    END INTO task_completion_rate
  FROM crm.opportunity_tasks
  WHERE opportunity_id = opp_id;
  
  -- Calculate score (0-100)
  score := LEAST(100, 
    (activity_count * 5) + -- 5 points per activity
    (CASE WHEN days_since_last_activity IS NULL THEN 0 
          WHEN days_since_last_activity < 7 THEN 30
          WHEN days_since_last_activity < 14 THEN 20
          WHEN days_since_last_activity < 30 THEN 10
          ELSE 0 END) +
    (task_completion_rate * 0.4) -- 40% weight on task completion
  );
  
  RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update engagement score
CREATE OR REPLACE FUNCTION crm.update_engagement_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE crm.opportunities
  SET engagement_score = crm.calculate_engagement_score(NEW.opportunity_id),
      updated_at = now()
  WHERE id = NEW.opportunity_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_engagement_on_activity
AFTER INSERT OR UPDATE ON crm.opportunity_activities
FOR EACH ROW
EXECUTE FUNCTION crm.update_engagement_score_trigger();

CREATE TRIGGER update_engagement_on_task
AFTER INSERT OR UPDATE ON crm.opportunity_tasks
FOR EACH ROW
EXECUTE FUNCTION crm.update_engagement_score_trigger();

-- Create function to generate blockchain hash
CREATE OR REPLACE FUNCTION crm.generate_opportunity_hash(opp_id UUID)
RETURNS TEXT AS $$
DECLARE
  opp_data TEXT;
  prev_hash TEXT;
BEGIN
  -- Get previous hash from last opportunity
  SELECT blockchain_hash INTO prev_hash
  FROM crm.opportunities
  WHERE tenant_id = sec.current_tenant_id()
    AND blockchain_hash IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no previous hash, use genesis hash
  IF prev_hash IS NULL THEN
    prev_hash := repeat('0', 64);
  END IF;
  
  -- Get opportunity data
  SELECT 
    id || title || COALESCE(amount::TEXT, '0') || COALESCE(stage_id::TEXT, '') || 
    COALESCE(close_date::TEXT, '') || created_at::TEXT || prev_hash
  INTO opp_data
  FROM crm.opportunities
  WHERE id = opp_id;
  
  -- Return SHA-256 hash (simplified - in production use proper crypto)
  RETURN encode(digest(opp_data, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate blockchain hash on insert
CREATE OR REPLACE FUNCTION crm.auto_generate_blockchain_hash()
RETURNS TRIGGER AS $$
BEGIN
  -- Get previous hash
  SELECT blockchain_hash INTO NEW.prev_blockchain_hash
  FROM crm.opportunities
  WHERE tenant_id = NEW.tenant_id
    AND blockchain_hash IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no previous hash, use genesis hash
  IF NEW.prev_blockchain_hash IS NULL THEN
    NEW.prev_blockchain_hash := repeat('0', 64);
  END IF;
  
  -- Generate hash for this opportunity
  NEW.blockchain_hash := encode(
    digest(
      NEW.id::TEXT || NEW.title || COALESCE(NEW.amount::TEXT, '0') || 
      COALESCE(NEW.stage_id::TEXT, '') || COALESCE(NEW.close_date::TEXT, '') || 
      NEW.created_at::TEXT || NEW.prev_blockchain_hash,
      'sha256'
    ),
    'hex'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_blockchain_hash_on_insert
BEFORE INSERT ON crm.opportunities
FOR EACH ROW
EXECUTE FUNCTION crm.auto_generate_blockchain_hash();

-- Seed default RPA automation rules for opportunities
INSERT INTO auto.rules (tenant_id, name, module, event, conditions, actions, active)
SELECT 
  t.id,
  'Auto-create follow-up task on opportunity creation',
  'crm_opportunities',
  'record.created',
  '[]'::jsonb,
  '[{"type": "create_task", "params": {"title": "Follow up on new opportunity", "due_days": 2, "priority": "high"}}]'::jsonb,
  true
FROM core.tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM auto.rules 
  WHERE name = 'Auto-create follow-up task on opportunity creation' 
  AND tenant_id = t.id
)
LIMIT 1;

INSERT INTO auto.rules (tenant_id, name, module, event, conditions, actions, active)
SELECT 
  t.id,
  'Notify owner when opportunity moves to negotiation',
  'crm_opportunities',
  'field.changed',
  '[{"field": "stage_id", "operator": "equals", "value": "negotiation"}]'::jsonb,
  '[{"type": "send_notification", "params": {"message": "Opportunity moved to negotiation stage", "priority": "high"}}]'::jsonb,
  true
FROM core.tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM auto.rules 
  WHERE name = 'Notify owner when opportunity moves to negotiation' 
  AND tenant_id = t.id
)
LIMIT 1;

-- Create view for opportunity analytics
CREATE OR REPLACE VIEW crm.opportunity_analytics AS
SELECT 
  o.id,
  o.tenant_id,
  o.title,
  o.amount,
  o.probability,
  o.ml_win_probability,
  o.risk_score,
  o.engagement_score,
  o.status,
  s.name as stage_name,
  s.win_prob as stage_win_prob,
  a.name as account_name,
  u.full_name as owner_name,
  (SELECT COUNT(*) FROM crm.opportunity_activities WHERE opportunity_id = o.id) as activity_count,
  (SELECT COUNT(*) FROM crm.opportunity_tasks WHERE opportunity_id = o.id AND status = 'completed') as completed_tasks,
  (SELECT COUNT(*) FROM crm.opportunity_tasks WHERE opportunity_id = o.id) as total_tasks,
  EXTRACT(DAY FROM o.close_date - CURRENT_DATE) as days_to_close,
  EXTRACT(DAY FROM CURRENT_DATE - o.created_at) as age_days
FROM crm.opportunities o
LEFT JOIN crm.opportunity_stages s ON o.stage_id = s.id
LEFT JOIN crm.accounts a ON o.account_id = a.id
LEFT JOIN core.users u ON o.owner_id = u.id;

COMMENT ON TABLE crm.opportunity_activities IS 'Timeline of activities for opportunities';
COMMENT ON TABLE crm.opportunity_tasks IS 'Tasks associated with opportunities';
COMMENT ON TABLE crm.opportunity_competitors IS 'Competitor analysis for opportunities';
COMMENT ON TABLE crm.opportunity_products IS 'Products/services in multi-product deals';
COMMENT ON VIEW crm.opportunity_analytics IS 'Analytics view for opportunity insights';
