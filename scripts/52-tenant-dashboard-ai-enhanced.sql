-- Tenant Dashboard AI-Enhanced Schema
-- Multi-tenant SaaS with RBAC, FBAC, AI, ML, Blockchain, and RPA

-- Create schemas
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS ml;
CREATE SCHEMA IF NOT EXISTS blockchain;
CREATE SCHEMA IF NOT EXISTS rpa;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core tenant tables
CREATE TABLE IF NOT EXISTS app.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'professional', 'enterprise')),
  timezone TEXT DEFAULT 'UTC',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key)
);

-- Blockchain audit log with hash chain
CREATE TABLE IF NOT EXISTS app.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  hash TEXT NOT NULL,
  prev_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Copilot interactions
CREATE TABLE IF NOT EXISTS ai.copilot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  session_type TEXT DEFAULT 'chat' CHECK (session_type IN ('chat', 'analysis', 'prediction', 'recommendation')),
  context JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 6) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ai.copilot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai.copilot_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Machine Learning models and predictions
CREATE TABLE IF NOT EXISTS ml.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('classification', 'regression', 'clustering', 'forecasting', 'anomaly_detection')),
  algorithm TEXT NOT NULL,
  version TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  status TEXT DEFAULT 'training' CHECK (status IN ('training', 'active', 'deprecated', 'failed')),
  trained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES ml.models(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  prediction JSONB NOT NULL,
  confidence DECIMAL(5, 4),
  actual_outcome JSONB,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theory of Mind - User behavior and preferences
CREATE TABLE IF NOT EXISTS ai.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  preferences JSONB DEFAULT '{}',
  behavior_patterns JSONB DEFAULT '{}',
  interaction_style TEXT,
  learning_pace TEXT,
  goals JSONB DEFAULT '[]',
  last_analyzed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Self-aware AI - System learning and adaptation
CREATE TABLE IF NOT EXISTS ai.system_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('performance', 'usage_pattern', 'optimization', 'anomaly', 'recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  confidence DECIMAL(5, 4),
  impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 10),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'applied', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPA automation workflows
CREATE TABLE IF NOT EXISTS rpa.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('schedule', 'event', 'manual', 'condition')),
  trigger_config JSONB DEFAULT '{}',
  steps JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rpa.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES rpa.workflows(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  steps_completed INTEGER DEFAULT 0,
  steps_total INTEGER,
  error_message TEXT,
  logs JSONB DEFAULT '[]'
);

-- Reactive Machines - Real-time event processing
CREATE TABLE IF NOT EXISTS ai.reactive_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  response JSONB,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Limited Memory - Optimized resource usage
CREATE TABLE IF NOT EXISTS ai.memory_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  cache_value JSONB NOT NULL,
  ttl_seconds INTEGER DEFAULT 3600,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, cache_key)
);

-- Blockchain verification
CREATE TABLE IF NOT EXISTS blockchain.verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  record_id UUID NOT NULL,
  hash TEXT NOT NULL,
  prev_hash TEXT,
  block_number BIGINT,
  verified BOOLEAN DEFAULT false,
  verification_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_created ON app.audit_log(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_hash ON app.audit_log(hash);
CREATE INDEX IF NOT EXISTS idx_feature_flags_tenant ON app.feature_flags(tenant_id, enabled);
CREATE INDEX IF NOT EXISTS idx_copilot_sessions_tenant ON ai.copilot_sessions(tenant_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_tenant ON ml.predictions(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_tenant ON rpa.workflows(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_reactive_events_processed ON ai.reactive_events(tenant_id, processed, created_at);
CREATE INDEX IF NOT EXISTS idx_memory_cache_expires ON ai.memory_cache(expires_at);

-- RLS policies
ALTER TABLE app.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rpa.workflows ENABLE ROW LEVEL SECURITY;

-- Helper function for current tenant
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed data
INSERT INTO app.tenants (id, slug, name, tier, timezone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo', 'Demo Tenant', 'enterprise', 'America/New_York')
ON CONFLICT (id) DO NOTHING;

INSERT INTO app.feature_flags (tenant_id, feature_key, enabled) VALUES
  ('00000000-0000-0000-0000-000000000001', 'copilot', true),
  ('00000000-0000-0000-0000-000000000001', 'audit_chain', true),
  ('00000000-0000-0000-0000-000000000001', 'analytics', true),
  ('00000000-0000-0000-0000-000000000001', 'crm', true),
  ('00000000-0000-0000-0000-000000000001', 'talent', true),
  ('00000000-0000-0000-0000-000000000001', 'hrms', true),
  ('00000000-0000-0000-0000-000000000001', 'finance', true),
  ('00000000-0000-0000-0000-000000000001', 'bench', true),
  ('00000000-0000-0000-0000-000000000001', 'vms', true),
  ('00000000-0000-0000-0000-000000000001', 'projects', true)
ON CONFLICT (tenant_id, feature_key) DO UPDATE SET enabled = EXCLUDED.enabled;

-- Seed ML models
INSERT INTO ml.models (tenant_id, name, type, algorithm, version, status, metrics) VALUES
  ('00000000-0000-0000-0000-000000000001', 'User Churn Prediction', 'classification', 'Random Forest', '1.0.0', 'active', '{"accuracy": 0.92, "precision": 0.89, "recall": 0.94}'),
  ('00000000-0000-0000-0000-000000000001', 'Activity Forecasting', 'forecasting', 'LSTM', '1.0.0', 'active', '{"mae": 12.5, "rmse": 18.3}'),
  ('00000000-0000-0000-0000-000000000001', 'Anomaly Detection', 'anomaly_detection', 'Isolation Forest', '1.0.0', 'active', '{"f1_score": 0.87}')
ON CONFLICT DO NOTHING;

-- Seed RPA workflows
INSERT INTO rpa.workflows (tenant_id, name, description, trigger_type, trigger_config, steps, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Daily Digest Email', 'Send daily activity digest to admins', 'schedule', '{"cron": "0 9 * * *"}', '[{"type": "fetch_data", "config": {}}, {"type": "generate_report", "config": {}}, {"type": "send_email", "config": {}}]', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'Auto-Archive Old Records', 'Archive records older than 90 days', 'schedule', '{"cron": "0 2 * * 0"}', '[{"type": "query_old_records", "config": {}}, {"type": "archive", "config": {}}, {"type": "notify", "config": {}}]', 'active')
ON CONFLICT DO NOTHING;
