-- Talent Engagement Schema with AI-Powered Candidate Nurturing
-- Version: 1.0
-- Description: Comprehensive candidate engagement and nurturing system

-- Engagement Campaigns Table
CREATE TABLE IF NOT EXISTS engagement_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(100), -- 'nurture', 'reactivation', 'referral', 'event'
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  
  -- Targeting
  target_audience JSONB, -- Criteria for candidate selection
  candidate_pool_size INTEGER,
  
  -- Content
  message_templates JSONB, -- Email/SMS templates
  content_strategy JSONB,
  
  -- Scheduling
  start_date DATE,
  end_date DATE,
  frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'triggered'
  
  -- AI Features
  ai_optimized BOOLEAN DEFAULT false,
  ai_personalization BOOLEAN DEFAULT true,
  ai_send_time_optimization BOOLEAN DEFAULT true,
  ai_content_suggestions JSONB,
  
  -- Performance
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_responded INTEGER DEFAULT 0,
  open_rate DECIMAL(5, 2),
  click_rate DECIMAL(5, 2),
  response_rate DECIMAL(5, 2),
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_engagement_campaigns_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Candidate Engagement Table
CREATE TABLE IF NOT EXISTS candidate_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  
  -- Engagement Metrics
  engagement_score DECIMAL(5, 2), -- 0-100 score
  engagement_level VARCHAR(50), -- 'cold', 'warm', 'hot', 'active'
  last_interaction_date TIMESTAMPTZ,
  interaction_count INTEGER DEFAULT 0,
  
  -- Communication Preferences
  preferred_channel VARCHAR(50), -- 'email', 'sms', 'phone', 'linkedin'
  communication_frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly'
  opt_in_status BOOLEAN DEFAULT true,
  
  -- AI Insights
  ai_engagement_prediction DECIMAL(3, 2), -- Likelihood to engage
  ai_best_contact_time JSONB, -- Optimal times to reach out
  ai_content_preferences JSONB, -- Topics of interest
  ai_churn_risk DECIMAL(3, 2), -- Risk of losing interest
  ai_recommendations TEXT,
  
  -- Nurture Status
  nurture_stage VARCHAR(100), -- 'awareness', 'consideration', 'decision', 'advocacy'
  nurture_score DECIMAL(5, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_candidate_engagement_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Engagement Activities Table
CREATE TABLE IF NOT EXISTS engagement_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  campaign_id UUID REFERENCES engagement_campaigns(id),
  
  -- Activity Details
  activity_type VARCHAR(100), -- 'email_sent', 'email_opened', 'link_clicked', 'form_submitted', 'event_attended'
  activity_name VARCHAR(255),
  description TEXT,
  
  -- Content
  content_type VARCHAR(100),
  content_title VARCHAR(255),
  content_url TEXT,
  
  -- Engagement Data
  duration_seconds INTEGER,
  engagement_score DECIMAL(5, 2),
  
  -- AI Analysis
  ai_sentiment VARCHAR(50), -- 'positive', 'neutral', 'negative'
  ai_intent VARCHAR(100), -- 'job_seeking', 'information_gathering', 'networking'
  ai_interest_level DECIMAL(3, 2),
  
  -- Metadata
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_engagement_activities_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Talent Pools Table
CREATE TABLE IF NOT EXISTS talent_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pool_type VARCHAR(100), -- 'passive', 'active', 'silver_medalist', 'referral', 'event'
  
  -- Criteria
  inclusion_criteria JSONB,
  exclusion_criteria JSONB,
  
  -- Size & Stats
  candidate_count INTEGER DEFAULT 0,
  average_engagement_score DECIMAL(5, 2),
  
  -- AI Features
  ai_managed BOOLEAN DEFAULT false,
  ai_refresh_frequency VARCHAR(50), -- How often AI updates the pool
  ai_optimization_goals JSONB,
  
  -- Metadata
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_talent_pools_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Talent Pool Members Table
CREATE TABLE IF NOT EXISTS talent_pool_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  pool_id UUID NOT NULL REFERENCES talent_pools(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  
  -- Membership Details
  added_date DATE DEFAULT CURRENT_DATE,
  added_by UUID REFERENCES users(id),
  added_reason TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'removed'
  priority VARCHAR(50), -- 'low', 'medium', 'high'
  
  -- AI Scoring
  ai_fit_score DECIMAL(5, 2), -- How well they fit the pool criteria
  ai_engagement_prediction DECIMAL(3, 2),
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_talent_pool_members_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(pool_id, candidate_id)
);

-- Candidate Touchpoints Table
CREATE TABLE IF NOT EXISTS candidate_touchpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  
  -- Touchpoint Details
  touchpoint_type VARCHAR(100), -- 'email', 'call', 'meeting', 'event', 'social_media'
  touchpoint_date TIMESTAMPTZ NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  
  -- Outcome
  outcome VARCHAR(100), -- 'positive', 'neutral', 'negative', 'no_response'
  next_action VARCHAR(255),
  next_action_date DATE,
  
  -- AI Analysis
  ai_sentiment VARCHAR(50),
  ai_key_topics TEXT[],
  ai_action_items JSONB,
  
  -- Metadata
  conducted_by UUID REFERENCES users(id),
  duration_minutes INTEGER,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_candidate_touchpoints_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_engagement_campaigns_tenant ON engagement_campaigns(tenant_id);
CREATE INDEX idx_engagement_campaigns_status ON engagement_campaigns(status);
CREATE INDEX idx_candidate_engagement_tenant ON candidate_engagement(tenant_id);
CREATE INDEX idx_candidate_engagement_candidate ON candidate_engagement(candidate_id);
CREATE INDEX idx_candidate_engagement_level ON candidate_engagement(engagement_level);
CREATE INDEX idx_engagement_activities_tenant ON engagement_activities(tenant_id);
CREATE INDEX idx_engagement_activities_candidate ON engagement_activities(candidate_id);
CREATE INDEX idx_engagement_activities_campaign ON engagement_activities(campaign_id);
CREATE INDEX idx_talent_pools_tenant ON talent_pools(tenant_id);
CREATE INDEX idx_talent_pool_members_pool ON talent_pool_members(pool_id);
CREATE INDEX idx_talent_pool_members_candidate ON talent_pool_members(candidate_id);
CREATE INDEX idx_candidate_touchpoints_tenant ON candidate_touchpoints(tenant_id);
CREATE INDEX idx_candidate_touchpoints_candidate ON candidate_touchpoints(candidate_id);

-- RLS Policies
ALTER TABLE engagement_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_touchpoints ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO engagement_campaigns (tenant_id, name, description, campaign_type, status) VALUES
((SELECT id FROM tenants LIMIT 1), 'Passive Candidate Nurture', 'Monthly newsletter for passive candidates', 'nurture', 'active'),
((SELECT id FROM tenants LIMIT 1), 'Silver Medalist Reactivation', 'Re-engage candidates who were close to being hired', 'reactivation', 'active');

INSERT INTO talent_pools (tenant_id, name, description, pool_type) VALUES
((SELECT id FROM tenants LIMIT 1), 'Engineering Talent Pool', 'Qualified software engineers', 'passive'),
((SELECT id FROM tenants LIMIT 1), 'Silver Medalists', 'Strong candidates from previous searches', 'silver_medalist');
