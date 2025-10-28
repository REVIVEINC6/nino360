-- Talent Pipelines Schema with AI-Powered Kanban Management
-- Version: 1.0
-- Description: Comprehensive pipeline management with AI insights and automation

-- Pipeline Stages Table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  job_id UUID REFERENCES jobs(id),
  
  -- Stage Details
  stage_name VARCHAR(255) NOT NULL,
  stage_order INTEGER NOT NULL,
  stage_type VARCHAR(100), -- 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'
  
  -- Configuration
  is_required BOOLEAN DEFAULT true,
  auto_advance BOOLEAN DEFAULT false,
  auto_advance_criteria JSONB,
  
  -- SLA
  sla_days INTEGER,
  sla_hours INTEGER,
  
  -- AI Features
  ai_auto_screening BOOLEAN DEFAULT false,
  ai_scoring_enabled BOOLEAN DEFAULT true,
  ai_recommendations_enabled BOOLEAN DEFAULT true,
  
  -- Metadata
  description TEXT,
  color VARCHAR(50),
  icon VARCHAR(50),
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_pipeline_stages_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Pipeline Candidates Table
CREATE TABLE IF NOT EXISTS pipeline_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES jobs(id),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  application_id UUID REFERENCES applications(id),
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  
  -- Position in Stage
  stage_order INTEGER,
  
  -- Timing
  entered_stage_at TIMESTAMPTZ DEFAULT NOW(),
  time_in_stage_hours INTEGER,
  sla_breach BOOLEAN DEFAULT false,
  sla_breach_hours INTEGER,
  
  -- Scoring
  stage_score DECIMAL(5, 2),
  overall_score DECIMAL(5, 2),
  
  -- AI Insights
  ai_fit_score DECIMAL(5, 2),
  ai_hire_probability DECIMAL(3, 2),
  ai_time_to_hire_prediction INTEGER, -- Days
  ai_risk_factors JSONB,
  ai_strengths JSONB,
  ai_recommendations TEXT,
  ai_next_best_action VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'on_hold', 'moved', 'withdrawn'
  on_hold_reason TEXT,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  priority VARCHAR(50), -- 'low', 'medium', 'high', 'urgent'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_pipeline_candidates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(job_id, candidate_id)
);

-- Pipeline Movements Table
CREATE TABLE IF NOT EXISTS pipeline_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  pipeline_candidate_id UUID NOT NULL REFERENCES pipeline_candidates(id) ON DELETE CASCADE,
  
  -- Movement Details
  from_stage_id UUID REFERENCES pipeline_stages(id),
  to_stage_id UUID REFERENCES pipeline_stages(id),
  movement_type VARCHAR(50), -- 'forward', 'backward', 'rejected', 'withdrawn'
  
  -- Reason
  reason TEXT,
  automated BOOLEAN DEFAULT false,
  ai_triggered BOOLEAN DEFAULT false,
  
  -- Timing
  time_in_previous_stage_hours INTEGER,
  moved_at TIMESTAMPTZ DEFAULT NOW(),
  moved_by UUID REFERENCES users(id),
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_pipeline_movements_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Pipeline Analytics Table
CREATE TABLE IF NOT EXISTS pipeline_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  job_id UUID REFERENCES jobs(id),
  stage_id UUID REFERENCES pipeline_stages(id),
  
  -- Time Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  candidates_entered INTEGER DEFAULT 0,
  candidates_exited INTEGER DEFAULT 0,
  candidates_current INTEGER DEFAULT 0,
  average_time_in_stage_hours DECIMAL(10, 2),
  conversion_rate DECIMAL(5, 2),
  
  -- AI Insights
  ai_bottleneck_detected BOOLEAN DEFAULT false,
  ai_bottleneck_severity VARCHAR(50), -- 'low', 'medium', 'high'
  ai_recommendations JSONB,
  ai_predicted_throughput INTEGER,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_pipeline_analytics_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Pipeline Automation Rules Table
CREATE TABLE IF NOT EXISTS pipeline_automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type VARCHAR(100), -- 'stage_entry', 'time_based', 'score_threshold', 'manual'
  trigger_conditions JSONB,
  
  -- Action
  action_type VARCHAR(100), -- 'move_stage', 'send_email', 'assign_recruiter', 'schedule_interview'
  action_config JSONB,
  
  -- Scope
  applies_to_jobs UUID[], -- Array of job IDs, null = all jobs
  applies_to_stages UUID[], -- Array of stage IDs
  
  -- AI Features
  ai_enabled BOOLEAN DEFAULT false,
  ai_confidence_threshold DECIMAL(3, 2), -- Minimum confidence to trigger
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_pipeline_automation_rules_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_pipeline_stages_tenant ON pipeline_stages(tenant_id);
CREATE INDEX idx_pipeline_stages_job ON pipeline_stages(job_id);
CREATE INDEX idx_pipeline_candidates_tenant ON pipeline_candidates(tenant_id);
CREATE INDEX idx_pipeline_candidates_job ON pipeline_candidates(job_id);
CREATE INDEX idx_pipeline_candidates_candidate ON pipeline_candidates(candidate_id);
CREATE INDEX idx_pipeline_candidates_stage ON pipeline_candidates(stage_id);
CREATE INDEX idx_pipeline_candidates_assigned ON pipeline_candidates(assigned_to);
CREATE INDEX idx_pipeline_movements_pipeline_candidate ON pipeline_movements(pipeline_candidate_id);
CREATE INDEX idx_pipeline_analytics_job ON pipeline_analytics(job_id);
CREATE INDEX idx_pipeline_analytics_stage ON pipeline_analytics(stage_id);
CREATE INDEX idx_pipeline_automation_rules_tenant ON pipeline_automation_rules(tenant_id);

-- RLS Policies
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_automation_rules ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO pipeline_stages (tenant_id, job_id, stage_name, stage_order, stage_type, sla_days) VALUES
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Applied', 1, 'screening', 2),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Phone Screen', 2, 'screening', 3),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Technical Interview', 3, 'interview', 5),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Final Interview', 4, 'interview', 5),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Offer', 5, 'offer', 3),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM jobs LIMIT 1), 'Hired', 6, 'hired', NULL);
