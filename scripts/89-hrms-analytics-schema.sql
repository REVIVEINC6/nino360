-- HRMS Analytics Schema
-- Comprehensive analytics and reporting for workforce insights

-- Fact table for headcount metrics
CREATE TABLE IF NOT EXISTS public.fact_headcount (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  org_id UUID REFERENCES public.organizations(id),
  location_id UUID REFERENCES public.locations(id),
  department_id UUID REFERENCES public.departments(id),
  
  -- Headcount metrics
  active_count INTEGER DEFAULT 0,
  joiners INTEGER DEFAULT 0,
  leavers INTEGER DEFAULT 0,
  contractors INTEGER DEFAULT 0,
  full_time INTEGER DEFAULT 0,
  part_time INTEGER DEFAULT 0,
  
  -- Demographics
  female_count INTEGER DEFAULT 0,
  male_count INTEGER DEFAULT 0,
  non_binary_count INTEGER DEFAULT 0,
  diverse_count INTEGER DEFAULT 0,
  
  -- Tenure metrics
  avg_tenure_months DECIMAL(10,2),
  median_tenure_months DECIMAL(10,2),
  
  -- AI predictions
  predicted_attrition_next_quarter DECIMAL(5,2),
  retention_risk_score DECIMAL(5,2),
  
  -- Blockchain verification
  blockchain_hash TEXT,
  blockchain_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact table for attrition analysis
CREATE TABLE IF NOT EXISTS public.fact_attrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  
  -- Attrition details
  termination_type TEXT CHECK (termination_type IN ('voluntary', 'involuntary', 'retirement', 'end_of_contract')),
  termination_reason TEXT,
  department_id UUID REFERENCES public.departments(id),
  job_title TEXT,
  tenure_months INTEGER,
  
  -- Exit interview data
  exit_interview_completed BOOLEAN DEFAULT FALSE,
  exit_interview_score DECIMAL(3,2),
  exit_interview_sentiment TEXT,
  would_rehire BOOLEAN,
  
  -- AI analysis
  ai_sentiment_score DECIMAL(5,2),
  ai_risk_factors JSONB,
  ai_recommendations TEXT,
  
  -- Financial impact
  replacement_cost DECIMAL(12,2),
  knowledge_loss_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact table for performance metrics
CREATE TABLE IF NOT EXISTS public.fact_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  review_cycle_id UUID,
  
  -- Performance scores
  overall_score DECIMAL(3,2),
  goal_completion_rate DECIMAL(5,2),
  competency_score DECIMAL(3,2),
  manager_rating DECIMAL(3,2),
  peer_rating DECIMAL(3,2),
  self_rating DECIMAL(3,2),
  
  -- Performance category
  performance_tier TEXT CHECK (performance_tier IN ('top_performer', 'high_performer', 'meets_expectations', 'needs_improvement', 'underperforming')),
  
  -- AI insights
  ai_performance_trend TEXT,
  ai_development_areas JSONB,
  ai_promotion_readiness DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact table for compensation analytics
CREATE TABLE IF NOT EXISTS public.fact_compensation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  
  -- Compensation details
  base_salary DECIMAL(12,2),
  bonus DECIMAL(12,2),
  equity_value DECIMAL(12,2),
  total_compensation DECIMAL(12,2),
  
  -- Market comparison
  market_percentile DECIMAL(5,2),
  compa_ratio DECIMAL(5,2),
  pay_equity_score DECIMAL(5,2),
  
  -- AI analysis
  ai_flight_risk DECIMAL(5,2),
  ai_market_adjustment_needed DECIMAL(12,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact table for diversity metrics
CREATE TABLE IF NOT EXISTS public.fact_diversity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  
  -- Gender metrics
  female_percentage DECIMAL(5,2),
  male_percentage DECIMAL(5,2),
  non_binary_percentage DECIMAL(5,2),
  
  -- Leadership diversity
  female_leadership_percentage DECIMAL(5,2),
  diverse_leadership_percentage DECIMAL(5,2),
  
  -- Hiring diversity
  diverse_hiring_rate DECIMAL(5,2),
  diverse_promotion_rate DECIMAL(5,2),
  
  -- Pay equity
  gender_pay_gap DECIMAL(5,2),
  diversity_pay_gap DECIMAL(5,2),
  
  -- AI insights
  ai_diversity_score DECIMAL(5,2),
  ai_inclusion_score DECIMAL(5,2),
  ai_recommendations JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fact table for engagement metrics
CREATE TABLE IF NOT EXISTS public.fact_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  
  -- Survey metrics
  survey_response_rate DECIMAL(5,2),
  avg_engagement_score DECIMAL(3,2),
  enps_score INTEGER,
  
  -- Engagement categories
  highly_engaged_percentage DECIMAL(5,2),
  moderately_engaged_percentage DECIMAL(5,2),
  disengaged_percentage DECIMAL(5,2),
  
  -- AI predictions
  ai_engagement_trend TEXT,
  ai_risk_departments JSONB,
  ai_improvement_actions JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics dashboard configurations
CREATE TABLE IF NOT EXISTS public.analytics_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  dashboard_type TEXT CHECK (dashboard_type IN ('executive', 'hr_ops', 'manager', 'custom')),
  
  -- Configuration
  widgets JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  refresh_interval INTEGER DEFAULT 3600,
  
  -- Access control
  is_public BOOLEAN DEFAULT FALSE,
  allowed_roles TEXT[] DEFAULT ARRAY['admin', 'hr_manager'],
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS public.analytics_scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  dashboard_id UUID REFERENCES public.analytics_dashboards(id) ON DELETE CASCADE,
  
  -- Schedule configuration
  report_name TEXT NOT NULL,
  schedule_cron TEXT NOT NULL,
  recipients TEXT[] NOT NULL,
  format TEXT CHECK (format IN ('pdf', 'excel', 'csv')) DEFAULT 'pdf',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_fact_headcount_tenant_date ON public.fact_headcount(tenant_id, date_key);
CREATE INDEX idx_fact_headcount_org ON public.fact_headcount(org_id);
CREATE INDEX idx_fact_attrition_tenant_date ON public.fact_attrition(tenant_id, date_key);
CREATE INDEX idx_fact_attrition_employee ON public.fact_attrition(employee_id);
CREATE INDEX idx_fact_performance_tenant_date ON public.fact_performance(tenant_id, date_key);
CREATE INDEX idx_fact_performance_employee ON public.fact_performance(employee_id);
CREATE INDEX idx_fact_compensation_tenant_date ON public.fact_compensation(tenant_id, date_key);
CREATE INDEX idx_fact_diversity_tenant_date ON public.fact_diversity(tenant_id, date_key);
CREATE INDEX idx_fact_engagement_tenant_date ON public.fact_engagement(tenant_id, date_key);
CREATE INDEX idx_analytics_dashboards_tenant ON public.analytics_dashboards(tenant_id);

-- Enable RLS
ALTER TABLE public.fact_headcount ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_attrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_compensation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_diversity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_scheduled_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view analytics for their tenant"
  ON public.fact_headcount FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view attrition for their tenant"
  ON public.fact_attrition FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view performance for their tenant"
  ON public.fact_performance FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view compensation for their tenant"
  ON public.fact_compensation FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view diversity for their tenant"
  ON public.fact_diversity FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view engagement for their tenant"
  ON public.fact_engagement FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view dashboards for their tenant"
  ON public.analytics_dashboards FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage dashboards for their tenant"
  ON public.analytics_dashboards FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_analytics_dashboards_updated_at
  BEFORE UPDATE ON public.analytics_dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data
INSERT INTO public.fact_headcount (tenant_id, date_key, active_count, joiners, leavers, female_count, male_count, avg_tenure_months)
SELECT 
  (SELECT id FROM public.tenants LIMIT 1),
  CURRENT_DATE - (n || ' days')::INTERVAL,
  200 + (n * 2),
  FLOOR(RANDOM() * 10 + 5)::INTEGER,
  FLOOR(RANDOM() * 5 + 2)::INTEGER,
  FLOOR((200 + (n * 2)) * 0.42)::INTEGER,
  FLOOR((200 + (n * 2)) * 0.56)::INTEGER,
  36.5 + (n * 0.1)
FROM generate_series(0, 180, 30) AS n;
