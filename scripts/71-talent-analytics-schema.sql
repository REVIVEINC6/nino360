-- Talent Analytics Schema
-- Comprehensive analytics tables for recruitment metrics and ML insights

-- Analytics aggregations table
CREATE TABLE IF NOT EXISTS talent_analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  metric_type VARCHAR(100) NOT NULL, -- 'time_to_hire', 'quality_of_hire', 'source_roi', etc.
  metric_value DECIMAL(10,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  dimensions JSONB DEFAULT '{}', -- Additional dimensions (department, location, etc.)
  ai_insights JSONB DEFAULT '{}', -- ML-generated insights
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funnel analytics
CREATE TABLE IF NOT EXISTS talent_funnel_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  job_id UUID REFERENCES requisitions(id),
  stage VARCHAR(50) NOT NULL,
  candidate_count INTEGER NOT NULL,
  conversion_rate DECIMAL(5,2),
  avg_time_in_stage INTEGER, -- days
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  ai_bottleneck_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Source effectiveness tracking
CREATE TABLE IF NOT EXISTS talent_source_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  source_name VARCHAR(100) NOT NULL,
  total_applicants INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  roi_percentage DECIMAL(10,2),
  avg_quality_score DECIMAL(3,2),
  avg_time_to_hire INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  ai_recommendations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality of hire tracking
CREATE TABLE IF NOT EXISTS talent_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  hire_id UUID, -- Reference to hired candidate
  performance_score DECIMAL(3,2), -- 1-5 scale
  retention_months INTEGER,
  manager_satisfaction DECIMAL(3,2),
  cultural_fit_score DECIMAL(3,2),
  time_to_productivity INTEGER, -- days
  overall_quality_score DECIMAL(3,2),
  ai_prediction_accuracy DECIMAL(5,2), -- How accurate was the AI prediction
  evaluation_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diversity metrics
CREATE TABLE IF NOT EXISTS talent_diversity_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  metric_category VARCHAR(50) NOT NULL, -- 'gender', 'ethnicity', 'age', etc.
  metric_value VARCHAR(100) NOT NULL,
  applicant_count INTEGER DEFAULT 0,
  hire_count INTEGER DEFAULT 0,
  percentage DECIMAL(5,2),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML model performance tracking
CREATE TABLE IF NOT EXISTS talent_ml_model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  accuracy DECIMAL(5,2),
  precision_score DECIMAL(5,2),
  recall DECIMAL(5,2),
  f1_score DECIMAL(5,2),
  predictions_made INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  evaluation_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_analytics_metrics_tenant ON talent_analytics_metrics(tenant_id, metric_type, period_start);
CREATE INDEX idx_funnel_metrics_tenant ON talent_funnel_metrics(tenant_id, job_id, period_start);
CREATE INDEX idx_source_metrics_tenant ON talent_source_metrics(tenant_id, source_name, period_start);
CREATE INDEX idx_quality_metrics_tenant ON talent_quality_metrics(tenant_id, evaluation_date);
CREATE INDEX idx_diversity_metrics_tenant ON talent_diversity_metrics(tenant_id, metric_category, period_start);
CREATE INDEX idx_ml_metrics_tenant ON talent_ml_model_metrics(tenant_id, model_name, evaluation_date);

-- Enable RLS
ALTER TABLE talent_analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_funnel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_source_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_diversity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_ml_model_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_analytics ON talent_analytics_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_funnel ON talent_funnel_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_source ON talent_source_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_quality ON talent_quality_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_diversity ON talent_diversity_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_ml ON talent_ml_model_metrics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Sample data
INSERT INTO talent_analytics_metrics (tenant_id, metric_type, metric_value, period_start, period_end, ai_insights) VALUES
  ('00000000-0000-0000-0000-000000000001', 'time_to_hire', 28, '2025-01-01', '2025-03-31', '{"trend": "improving", "recommendation": "Continue current process"}'),
  ('00000000-0000-0000-0000-000000000001', 'quality_of_hire', 4.3, '2025-01-01', '2025-03-31', '{"trend": "excellent", "top_source": "referrals"}'),
  ('00000000-0000-0000-0000-000000000001', 'acceptance_rate', 85, '2025-01-01', '2025-03-31', '{"trend": "stable", "competitive_offers": 15}');

INSERT INTO talent_source_metrics (tenant_id, source_name, total_applicants, total_hires, total_cost, roi_percentage, period_start, period_end) VALUES
  ('00000000-0000-0000-0000-000000000001', 'LinkedIn', 180, 45, 12000, 375, '2025-01-01', '2025-03-31'),
  ('00000000-0000-0000-0000-000000000001', 'Indeed', 150, 32, 8000, 400, '2025-01-01', '2025-03-31'),
  ('00000000-0000-0000-0000-000000000001', 'Referrals', 80, 28, 5600, 500, '2025-01-01', '2025-03-31');
