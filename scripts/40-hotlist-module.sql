-- =====================================================
-- Hotlist Module - Priority Talent Market
-- =====================================================
-- Purpose: Promote bench/prioritized candidates to open reqs quickly
-- Tables: 7 core tables for hotlist management
-- =====================================================

-- 1. Hotlist Campaigns
CREATE TABLE IF NOT EXISTS hotlist_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
    campaign_type VARCHAR(50) DEFAULT 'manual', -- manual, automated, scheduled
    target_audience VARCHAR(100), -- clients, vendors, internal
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Metrics
    total_candidates INTEGER DEFAULT 0,
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    total_interviews INTEGER DEFAULT 0,
    total_placements INTEGER DEFAULT 0,
    
    -- Settings
    auto_send BOOLEAN DEFAULT false,
    send_frequency VARCHAR(50), -- immediate, daily, weekly
    personalization_enabled BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT hotlist_campaigns_tenant_name_key UNIQUE(tenant_id, name)
);

CREATE INDEX idx_hotlist_campaigns_tenant ON hotlist_campaigns(tenant_id);
CREATE INDEX idx_hotlist_campaigns_status ON hotlist_campaigns(status);
CREATE INDEX idx_hotlist_campaigns_dates ON hotlist_campaigns(start_date, end_date);

-- 2. Hotlist Candidates (Priority Profiles)
CREATE TABLE IF NOT EXISTS hotlist_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES hotlist_campaigns(id) ON DELETE CASCADE,
    candidate_id UUID, -- Reference to talent candidates or employees
    
    -- Profile Info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(255),
    location VARCHAR(255),
    
    -- Priority Info
    priority_level VARCHAR(50) DEFAULT 'medium', -- high, medium, low
    priority_reason TEXT,
    bench_status VARCHAR(50), -- benched, rolling_off, available
    bench_since DATE,
    available_from DATE,
    
    -- Skills & Experience
    primary_skills TEXT[], -- Array of skills
    years_of_experience DECIMAL(4,1),
    certifications TEXT[],
    
    -- Rates & Availability
    hourly_rate DECIMAL(10,2),
    daily_rate DECIMAL(10,2),
    availability_type VARCHAR(50), -- full_time, contract, both
    willing_to_relocate BOOLEAN DEFAULT false,
    remote_preference VARCHAR(50), -- remote, hybrid, onsite, flexible
    
    -- Marketing Materials
    one_pager_url TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    video_intro_url TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, placed, withdrawn, expired
    
    -- Metrics
    times_sent INTEGER DEFAULT 0,
    times_viewed INTEGER DEFAULT 0,
    responses_received INTEGER DEFAULT 0,
    interviews_scheduled INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotlist_candidates_tenant ON hotlist_candidates(tenant_id);
CREATE INDEX idx_hotlist_candidates_campaign ON hotlist_candidates(campaign_id);
CREATE INDEX idx_hotlist_candidates_status ON hotlist_candidates(status);
CREATE INDEX idx_hotlist_candidates_priority ON hotlist_candidates(priority_level);
CREATE INDEX idx_hotlist_candidates_skills ON hotlist_candidates USING GIN(primary_skills);

-- 3. Hotlist Requirements (Urgent Jobs)
CREATE TABLE IF NOT EXISTS hotlist_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES hotlist_campaigns(id) ON DELETE CASCADE,
    job_id UUID, -- Reference to job requisitions
    
    -- Job Info
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    location VARCHAR(255),
    job_type VARCHAR(50), -- full_time, contract, contract_to_hire
    
    -- Urgency
    urgency_level VARCHAR(50) DEFAULT 'high', -- critical, high, medium
    required_by DATE,
    reason_for_urgency TEXT,
    
    -- Requirements
    required_skills TEXT[] NOT NULL,
    min_experience DECIMAL(4,1),
    max_rate DECIMAL(10,2),
    remote_allowed BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- open, filled, cancelled, on_hold
    positions_open INTEGER DEFAULT 1,
    positions_filled INTEGER DEFAULT 0,
    
    -- Metrics
    candidates_matched INTEGER DEFAULT 0,
    submissions_received INTEGER DEFAULT 0,
    interviews_scheduled INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotlist_requirements_tenant ON hotlist_requirements(tenant_id);
CREATE INDEX idx_hotlist_requirements_campaign ON hotlist_requirements(campaign_id);
CREATE INDEX idx_hotlist_requirements_status ON hotlist_requirements(status);
CREATE INDEX idx_hotlist_requirements_urgency ON hotlist_requirements(urgency_level);
CREATE INDEX idx_hotlist_requirements_skills ON hotlist_requirements USING GIN(required_skills);

-- 4. Hotlist Distributions (Who received what)
CREATE TABLE IF NOT EXISTS hotlist_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES hotlist_campaigns(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES hotlist_candidates(id) ON DELETE CASCADE,
    
    -- Recipient Info
    recipient_type VARCHAR(50) NOT NULL, -- client, vendor, internal
    recipient_id UUID, -- Reference to client/vendor/user
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255) NOT NULL,
    
    -- Distribution Details
    distribution_method VARCHAR(50) DEFAULT 'email', -- email, portal, api
    subject_line TEXT,
    message_body TEXT,
    personalized_message TEXT,
    
    -- Tracking
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    
    -- Response
    response_status VARCHAR(50), -- interested, not_interested, maybe, no_response
    response_notes TEXT,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotlist_distributions_tenant ON hotlist_distributions(tenant_id);
CREATE INDEX idx_hotlist_distributions_campaign ON hotlist_distributions(campaign_id);
CREATE INDEX idx_hotlist_distributions_candidate ON hotlist_distributions(candidate_id);
CREATE INDEX idx_hotlist_distributions_recipient ON hotlist_distributions(recipient_email);
CREATE INDEX idx_hotlist_distributions_status ON hotlist_distributions(response_status);

-- 5. Hotlist Matches (Candidate-Requirement Matching)
CREATE TABLE IF NOT EXISTS hotlist_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES hotlist_candidates(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES hotlist_requirements(id) ON DELETE CASCADE,
    
    -- Match Score
    match_score DECIMAL(5,2), -- 0-100
    skill_match_score DECIMAL(5,2),
    rate_match_score DECIMAL(5,2),
    location_match_score DECIMAL(5,2),
    availability_match_score DECIMAL(5,2),
    
    -- AI Analysis
    match_reasoning TEXT,
    strengths TEXT[],
    gaps TEXT[],
    recommendations TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'suggested', -- suggested, submitted, interviewing, rejected, placed
    submitted_at TIMESTAMPTZ,
    
    -- Notes
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT hotlist_matches_unique UNIQUE(candidate_id, requirement_id)
);

CREATE INDEX idx_hotlist_matches_tenant ON hotlist_matches(tenant_id);
CREATE INDEX idx_hotlist_matches_candidate ON hotlist_matches(candidate_id);
CREATE INDEX idx_hotlist_matches_requirement ON hotlist_matches(requirement_id);
CREATE INDEX idx_hotlist_matches_score ON hotlist_matches(match_score DESC);
CREATE INDEX idx_hotlist_matches_status ON hotlist_matches(status);

-- 6. Hotlist Automation Rules
CREATE TABLE IF NOT EXISTS hotlist_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Rule Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- auto_add_candidate, auto_distribute, auto_match, auto_follow_up
    
    -- Trigger Conditions
    trigger_event VARCHAR(100), -- candidate_benched, job_urgent, no_response_7days
    trigger_conditions JSONB, -- Flexible conditions
    
    -- Actions
    action_type VARCHAR(50), -- add_to_campaign, send_email, create_match, notify
    action_config JSONB, -- Action configuration
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    
    -- Execution Stats
    times_triggered INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotlist_automation_tenant ON hotlist_automation_rules(tenant_id);
CREATE INDEX idx_hotlist_automation_active ON hotlist_automation_rules(is_active);
CREATE INDEX idx_hotlist_automation_type ON hotlist_automation_rules(rule_type);

-- 7. Hotlist Analytics Events
CREATE TABLE IF NOT EXISTS hotlist_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES hotlist_campaigns(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES hotlist_candidates(id) ON DELETE CASCADE,
    distribution_id UUID REFERENCES hotlist_distributions(id) ON DELETE CASCADE,
    
    -- Event Info
    event_type VARCHAR(100) NOT NULL, -- email_sent, email_opened, link_clicked, response_received, interview_scheduled
    event_data JSONB,
    
    -- Context
    user_agent TEXT,
    ip_address INET,
    location VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotlist_analytics_tenant ON hotlist_analytics_events(tenant_id);
CREATE INDEX idx_hotlist_analytics_campaign ON hotlist_analytics_events(campaign_id);
CREATE INDEX idx_hotlist_analytics_type ON hotlist_analytics_events(event_type);
CREATE INDEX idx_hotlist_analytics_created ON hotlist_analytics_events(created_at DESC);

-- Enable RLS
ALTER TABLE hotlist_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant isolation)
CREATE POLICY hotlist_campaigns_tenant_isolation ON hotlist_campaigns
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_candidates_tenant_isolation ON hotlist_candidates
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_requirements_tenant_isolation ON hotlist_requirements
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_distributions_tenant_isolation ON hotlist_distributions
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_matches_tenant_isolation ON hotlist_matches
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_automation_rules_tenant_isolation ON hotlist_automation_rules
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hotlist_analytics_events_tenant_isolation ON hotlist_analytics_events
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Updated_at triggers
CREATE TRIGGER update_hotlist_campaigns_updated_at BEFORE UPDATE ON hotlist_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_candidates_updated_at BEFORE UPDATE ON hotlist_candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_requirements_updated_at BEFORE UPDATE ON hotlist_requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_distributions_updated_at BEFORE UPDATE ON hotlist_distributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_matches_updated_at BEFORE UPDATE ON hotlist_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotlist_automation_rules_updated_at BEFORE UPDATE ON hotlist_automation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
