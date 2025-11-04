-- =====================================================
-- Nino360 Dashboard AI-Enhanced Schema
-- Multi-tenant dashboard with AI, ML, Blockchain, RPA
-- =====================================================

-- Dashboard user preferences and personalization
CREATE TABLE IF NOT EXISTS dashboard.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Layout preferences
  layout_config JSONB DEFAULT '{"widgets": [], "grid": "default"}',
  theme VARCHAR(20) DEFAULT 'light',
  density VARCHAR(20) DEFAULT 'comfortable',
  
  -- AI personalization (Theory of Mind)
  ai_personality_profile JSONB DEFAULT '{}',
  interaction_patterns JSONB DEFAULT '{}',
  learning_preferences JSONB DEFAULT '{}',
  
  -- Widget visibility and order
  visible_widgets TEXT[] DEFAULT ARRAY['kpis', 'forecasts', 'workboard', 'insights'],
  widget_order JSONB DEFAULT '{}',
  
  -- Notification preferences
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, user_id)
);

-- AI-powered insights and predictions
CREATE TABLE IF NOT EXISTS dashboard.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Insight metadata
  insight_type VARCHAR(50) NOT NULL, -- 'prediction', 'anomaly', 'recommendation', 'trend'
  category VARCHAR(50) NOT NULL, -- 'finance', 'talent', 'bench', 'operations'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  
  -- Insight content
  title TEXT NOT NULL,
  description TEXT,
  insight_data JSONB NOT NULL,
  
  -- ML model information
  model_name VARCHAR(100),
  model_version VARCHAR(50),
  confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
  
  -- Actionability
  is_actionable BOOLEAN DEFAULT false,
  suggested_actions JSONB DEFAULT '[]',
  action_taken BOOLEAN DEFAULT false,
  action_taken_at TIMESTAMPTZ,
  action_taken_by UUID REFERENCES auth.users(id),
  
  -- Validity and feedback
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  user_feedback JSONB DEFAULT '{}',
  
  -- Blockchain verification
  blockchain_hash VARCHAR(64),
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML model training data and performance
CREATE TABLE IF NOT EXISTS dashboard.ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Model metadata
  model_name VARCHAR(100) NOT NULL,
  model_type VARCHAR(50) NOT NULL, -- 'regression', 'classification', 'clustering', 'forecasting'
  model_version VARCHAR(50) NOT NULL,
  
  -- Training information
  training_data_size INTEGER,
  training_started_at TIMESTAMPTZ,
  training_completed_at TIMESTAMPTZ,
  training_duration_seconds INTEGER,
  
  -- Performance metrics
  accuracy DECIMAL(5,4),
  precision_score DECIMAL(5,4),
  recall_score DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  mae DECIMAL(10,2), -- Mean Absolute Error
  rmse DECIMAL(10,2), -- Root Mean Square Error
  
  -- Model configuration
  hyperparameters JSONB DEFAULT '{}',
  feature_importance JSONB DEFAULT '{}',
  
  -- Deployment status
  status VARCHAR(20) DEFAULT 'training', -- 'training', 'testing', 'deployed', 'retired'
  deployed_at TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  
  -- Self-aware AI: learning and adaptation
  adaptation_log JSONB DEFAULT '[]',
  performance_history JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, model_name, model_version)
);

-- RPA automation workflows for dashboard
CREATE TABLE IF NOT EXISTS dashboard.rpa_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Workflow metadata
  workflow_name VARCHAR(100) NOT NULL,
  workflow_type VARCHAR(50) NOT NULL, -- 'data_sync', 'report_generation', 'alert_processing', 'cleanup'
  description TEXT,
  
  -- Execution configuration
  trigger_type VARCHAR(50) NOT NULL, -- 'scheduled', 'event', 'manual', 'ai_triggered'
  schedule_cron VARCHAR(100), -- For scheduled workflows
  event_pattern JSONB, -- For event-driven workflows
  
  -- Workflow definition
  workflow_steps JSONB NOT NULL,
  input_schema JSONB,
  output_schema JSONB,
  
  -- Execution status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'disabled', 'error'
  last_execution_at TIMESTAMPTZ,
  last_execution_status VARCHAR(20),
  last_execution_duration_ms INTEGER,
  
  -- Performance metrics
  total_executions INTEGER DEFAULT 0,
  successful_executions INTEGER DEFAULT 0,
  failed_executions INTEGER DEFAULT 0,
  avg_execution_time_ms INTEGER,
  
  -- Error handling
  retry_policy JSONB DEFAULT '{"max_retries": 3, "backoff": "exponential"}',
  error_log JSONB DEFAULT '[]',
  
  -- Blockchain audit
  blockchain_hash VARCHAR(64),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(tenant_id, workflow_name)
);

-- RPA workflow execution history
CREATE TABLE IF NOT EXISTS dashboard.rpa_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES dashboard.rpa_workflows(id) ON DELETE CASCADE,
  
  -- Execution details
  execution_status VARCHAR(20) NOT NULL, -- 'running', 'completed', 'failed', 'cancelled'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- Input/Output
  input_data JSONB,
  output_data JSONB,
  
  -- Error information
  error_message TEXT,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Resource usage
  cpu_usage_percent DECIMAL(5,2),
  memory_usage_mb INTEGER,
  
  -- Blockchain verification
  blockchain_hash VARCHAR(64),
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard widgets configuration
CREATE TABLE IF NOT EXISTS dashboard.widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Widget metadata
  widget_key VARCHAR(50) NOT NULL,
  widget_name VARCHAR(100) NOT NULL,
  widget_type VARCHAR(50) NOT NULL, -- 'kpi', 'chart', 'table', 'ai_insight', 'action'
  category VARCHAR(50) NOT NULL,
  
  -- Configuration
  default_config JSONB DEFAULT '{}',
  data_source VARCHAR(100),
  refresh_interval_seconds INTEGER DEFAULT 300,
  
  -- Access control
  required_permissions TEXT[] DEFAULT '{}',
  required_features TEXT[] DEFAULT '{}',
  
  -- AI enhancement
  ai_enabled BOOLEAN DEFAULT false,
  ai_model_name VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, widget_key)
);

-- Predictive analytics cache
CREATE TABLE IF NOT EXISTS dashboard.predictions_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Prediction metadata
  prediction_type VARCHAR(50) NOT NULL, -- 'sales_forecast', 'cashflow', 'churn', 'demand'
  prediction_horizon VARCHAR(20) NOT NULL, -- '7d', '30d', '90d', '1y'
  
  -- Prediction data
  predictions JSONB NOT NULL,
  confidence_intervals JSONB,
  
  -- Model information
  model_id UUID REFERENCES dashboard.ml_models(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Accuracy tracking
  actual_values JSONB DEFAULT '{}',
  accuracy_score DECIMAL(5,4),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interaction tracking for Theory of Mind AI
CREATE TABLE IF NOT EXISTS dashboard.user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Interaction details
  interaction_type VARCHAR(50) NOT NULL, -- 'click', 'view', 'search', 'filter', 'export'
  widget_key VARCHAR(50),
  action VARCHAR(100),
  
  -- Context
  page_url TEXT,
  session_id UUID,
  device_type VARCHAR(20),
  
  -- Interaction data
  interaction_data JSONB DEFAULT '{}',
  duration_ms INTEGER,
  
  -- AI learning
  sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
  engagement_score DECIMAL(3,2), -- 0.00 to 1.00
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blockchain audit trail for dashboard actions
CREATE TABLE IF NOT EXISTS dashboard.blockchain_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Action details
  action_type VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  
  -- Actor information
  actor_id UUID REFERENCES auth.users(id),
  actor_email VARCHAR(255),
  actor_role VARCHAR(50),
  
  -- Blockchain data
  blockchain_hash VARCHAR(64) NOT NULL,
  previous_hash VARCHAR(64),
  block_number BIGINT,
  
  -- Action payload
  action_payload JSONB NOT NULL,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_signature TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(blockchain_hash)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_tenant_user ON dashboard.user_preferences(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_tenant_type ON dashboard.ai_insights(tenant_id, insight_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON dashboard.ai_insights(priority, created_at DESC) WHERE action_taken = false;
CREATE INDEX IF NOT EXISTS idx_ml_models_tenant_status ON dashboard.ml_models(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_rpa_workflows_tenant_status ON dashboard.rpa_workflows(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_rpa_executions_workflow ON dashboard.rpa_executions(workflow_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_cache_tenant_type ON dashboard.predictions_cache(tenant_id, prediction_type, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_time ON dashboard.user_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blockchain_audit_tenant_time ON dashboard.blockchain_audit(tenant_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE dashboard.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.rpa_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.rpa_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.predictions_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard.blockchain_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY user_preferences_tenant_isolation ON dashboard.user_preferences
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY ai_insights_tenant_isolation ON dashboard.ai_insights
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY ml_models_tenant_isolation ON dashboard.ml_models
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY rpa_workflows_tenant_isolation ON dashboard.rpa_workflows
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY rpa_executions_tenant_isolation ON dashboard.rpa_executions
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY widgets_tenant_isolation ON dashboard.widgets
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY predictions_cache_tenant_isolation ON dashboard.predictions_cache
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY user_interactions_tenant_isolation ON dashboard.user_interactions
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY blockchain_audit_tenant_isolation ON dashboard.blockchain_audit
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Helper functions
CREATE OR REPLACE FUNCTION dashboard.generate_blockchain_hash(
  p_action_type VARCHAR,
  p_resource_type VARCHAR,
  p_payload JSONB,
  p_previous_hash VARCHAR DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
  v_data TEXT;
  v_hash VARCHAR;
BEGIN
  v_data := p_action_type || p_resource_type || p_payload::TEXT || COALESCE(p_previous_hash, '') || NOW()::TEXT;
  v_hash := encode(digest(v_data, 'sha256'), 'hex');
  RETURN v_hash;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dashboard.calculate_engagement_score(
  p_user_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS DECIMAL AS $$
DECLARE
  v_interaction_count INTEGER;
  v_avg_duration_ms INTEGER;
  v_unique_widgets INTEGER;
  v_score DECIMAL;
BEGIN
  SELECT 
    COUNT(*),
    AVG(duration_ms),
    COUNT(DISTINCT widget_key)
  INTO v_interaction_count, v_avg_duration_ms, v_unique_widgets
  FROM dashboard.user_interactions
  WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
  
  -- Calculate engagement score (0.00 to 1.00)
  v_score := LEAST(1.0, (
    (v_interaction_count::DECIMAL / 100) * 0.4 +
    (LEAST(v_avg_duration_ms, 60000)::DECIMAL / 60000) * 0.3 +
    (v_unique_widgets::DECIMAL / 10) * 0.3
  ));
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user preferences timestamp
CREATE OR REPLACE FUNCTION dashboard.update_user_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_preferences_updated
  BEFORE UPDATE ON dashboard.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION dashboard.update_user_preferences_timestamp();

-- Seed default widgets
INSERT INTO dashboard.widgets (tenant_id, widget_key, widget_name, widget_type, category, default_config, required_permissions, ai_enabled)
SELECT 
  t.id,
  'kpi_revenue',
  'Revenue KPI',
  'kpi',
  'finance',
  '{"icon": "dollar-sign", "trend": true}'::JSONB,
  ARRAY['finance.view'],
  true
FROM tenants t
ON CONFLICT (tenant_id, widget_key) DO NOTHING;

INSERT INTO dashboard.widgets (tenant_id, widget_key, widget_name, widget_type, category, default_config, required_permissions, ai_enabled)
SELECT 
  t.id,
  'ai_insights',
  'AI Insights Panel',
  'ai_insight',
  'analytics',
  '{"max_insights": 5, "auto_refresh": true}'::JSONB,
  ARRAY['analytics.view'],
  true
FROM tenants t
ON CONFLICT (tenant_id, widget_key) DO NOTHING;

INSERT INTO dashboard.widgets (tenant_id, widget_key, widget_name, widget_type, category, default_config, required_permissions, ai_enabled)
SELECT 
  t.id,
  'sales_forecast',
  'Sales Forecast',
  'chart',
  'analytics',
  '{"horizon": "90d", "confidence_interval": true}'::JSONB,
  ARRAY['analytics.view'],
  true
FROM tenants t
ON CONFLICT (tenant_id, widget_key) DO NOTHING;

COMMENT ON TABLE dashboard.user_preferences IS 'User-specific dashboard preferences and AI personalization (Theory of Mind)';
COMMENT ON TABLE dashboard.ai_insights IS 'AI-generated insights, predictions, and recommendations with ML confidence scores';
COMMENT ON TABLE dashboard.ml_models IS 'Machine Learning models with self-aware adaptation and performance tracking';
COMMENT ON TABLE dashboard.rpa_workflows IS 'Robotic Process Automation workflows for dashboard automation';
COMMENT ON TABLE dashboard.blockchain_audit IS 'Blockchain-verified audit trail for secure data management';
