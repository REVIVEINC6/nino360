-- =====================================================
-- Module Enhancements - Additional Tables
-- =====================================================
-- Purpose: Enhancement tables for CRM, Talent, Admin modules
-- Tables: 10 enhancement tables
-- =====================================================

-- 1. CRM Email Sequences
CREATE TABLE IF NOT EXISTS crm_email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_type VARCHAR(50) DEFAULT 'nurture', -- nurture, follow_up, onboarding, re_engagement
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    total_steps INTEGER DEFAULT 0,
    
    -- Stats
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    average_open_rate DECIMAL(5,2),
    average_click_rate DECIMAL(5,2),
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_sequences_tenant ON crm_email_sequences(tenant_id);

-- 2. CRM Email Sequence Steps
CREATE TABLE IF NOT EXISTS crm_email_sequence_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sequence_id UUID NOT NULL REFERENCES crm_email_sequences(id) ON DELETE CASCADE,
    
    step_number INTEGER NOT NULL,
    delay_days INTEGER DEFAULT 0,
    delay_hours INTEGER DEFAULT 0,
    
    subject_line TEXT NOT NULL,
    email_body TEXT NOT NULL,
    
    -- Tracking
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_sequence_steps_sequence ON crm_email_sequence_steps(sequence_id);

-- 3. CRM Activities (Calls, Meetings, Tasks)
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(50) NOT NULL, -- call, meeting, task, email, note
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Related Records
    related_to_type VARCHAR(50), -- lead, contact, opportunity, account
    related_to_id UUID,
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ,
    due_date DATE,
    duration_minutes INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    priority VARCHAR(50) DEFAULT 'medium',
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Completion
    completed_at TIMESTAMPTZ,
    outcome TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_activities_tenant ON crm_activities(tenant_id);
CREATE INDEX idx_crm_activities_type ON crm_activities(activity_type);
CREATE INDEX idx_crm_activities_related ON crm_activities(related_to_type, related_to_id);
CREATE INDEX idx_crm_activities_assigned ON crm_activities(assigned_to);
CREATE INDEX idx_crm_activities_scheduled ON crm_activities(scheduled_at);

-- 4. Talent Interview Feedback
CREATE TABLE IF NOT EXISTS talent_interview_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL,
    candidate_id UUID NOT NULL,
    
    -- Interviewer
    interviewer_id UUID REFERENCES users(id),
    interviewer_name VARCHAR(255),
    
    -- Ratings (1-5 scale)
    technical_skills_rating INTEGER,
    communication_rating INTEGER,
    problem_solving_rating INTEGER,
    cultural_fit_rating INTEGER,
    overall_rating INTEGER,
    
    -- Feedback
    strengths TEXT,
    weaknesses TEXT,
    detailed_feedback TEXT,
    
    -- Recommendation
    recommendation VARCHAR(50), -- strong_yes, yes, maybe, no, strong_no
    
    -- Status
    is_submitted BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_talent_feedback_tenant ON talent_interview_feedback(tenant_id);
CREATE INDEX idx_talent_feedback_interview ON talent_interview_feedback(interview_id);
CREATE INDEX idx_talent_feedback_candidate ON talent_interview_feedback(candidate_id);

-- 5. Talent Candidate Notes
CREATE TABLE IF NOT EXISTS talent_candidate_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL,
    
    note_type VARCHAR(50) DEFAULT 'general', -- general, screening, interview, reference
    note_text TEXT NOT NULL,
    
    is_private BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_talent_notes_tenant ON talent_candidate_notes(tenant_id);
CREATE INDEX idx_talent_notes_candidate ON talent_candidate_notes(candidate_id);
CREATE INDEX idx_talent_notes_type ON talent_candidate_notes(note_type);

-- 6. HRMS Performance Reviews
CREATE TABLE IF NOT EXISTS hrms_performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL,
    
    -- Review Info
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    review_type VARCHAR(50) DEFAULT 'annual', -- annual, mid_year, quarterly, probation
    
    -- Reviewer
    reviewer_id UUID REFERENCES users(id),
    reviewer_name VARCHAR(255),
    
    -- Ratings
    overall_rating DECIMAL(3,2),
    performance_rating DECIMAL(3,2),
    potential_rating DECIMAL(3,2),
    
    -- Feedback
    achievements TEXT,
    areas_for_improvement TEXT,
    goals_for_next_period TEXT,
    manager_comments TEXT,
    employee_comments TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, acknowledged, completed
    
    -- Dates
    submitted_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hrms_reviews_tenant ON hrms_performance_reviews(tenant_id);
CREATE INDEX idx_hrms_reviews_employee ON hrms_performance_reviews(employee_id);
CREATE INDEX idx_hrms_reviews_period ON hrms_performance_reviews(review_period_start, review_period_end);

-- 7. HRMS Goals
CREATE TABLE IF NOT EXISTS hrms_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL,
    
    -- Goal Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) DEFAULT 'performance', -- performance, development, project
    
    -- Measurement
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    unit VARCHAR(50),
    
    -- Timeline
    start_date DATE,
    due_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'in_progress', -- not_started, in_progress, completed, cancelled
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Assignment
    assigned_by UUID REFERENCES users(id),
    
    -- Completion
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hrms_goals_tenant ON hrms_goals(tenant_id);
CREATE INDEX idx_hrms_goals_employee ON hrms_goals(employee_id);
CREATE INDEX idx_hrms_goals_status ON hrms_goals(status);
CREATE INDEX idx_hrms_goals_due ON hrms_goals(due_date);

-- 8. Admin Feature Flags
CREATE TABLE IF NOT EXISTS admin_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Flag Info
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    flag_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Status
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0, -- 0-100
    
    -- Targeting
    enabled_for_tenants UUID[],
    enabled_for_plans VARCHAR(50)[],
    
    -- Metadata
    metadata JSONB,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_flags_key ON admin_feature_flags(flag_key);
CREATE INDEX idx_feature_flags_enabled ON admin_feature_flags(is_enabled);

-- 9. Admin System Health Metrics
CREATE TABLE IF NOT EXISTS admin_system_health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metric Info
    metric_type VARCHAR(100) NOT NULL, -- api_latency, db_connections, queue_depth, error_rate
    metric_name VARCHAR(255) NOT NULL,
    
    -- Value
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    
    -- Context
    service_name VARCHAR(100),
    environment VARCHAR(50), -- production, staging, development
    
    -- Metadata
    metadata JSONB,
    
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_metrics_type ON admin_system_health_metrics(metric_type);
CREATE INDEX idx_health_metrics_recorded ON admin_system_health_metrics(recorded_at DESC);
CREATE INDEX idx_health_metrics_service ON admin_system_health_metrics(service_name);

-- 10. Admin API Keys
CREATE TABLE IF NOT EXISTS admin_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Key Info
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL, -- Hashed API key
    key_prefix VARCHAR(20), -- First few chars for identification
    
    -- Permissions
    scopes TEXT[], -- Array of permission scopes
    rate_limit_per_minute INTEGER DEFAULT 60,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Usage Stats
    total_requests INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Expiry
    expires_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_tenant ON admin_api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON admin_api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON admin_api_keys(is_active);

-- Enable RLS
ALTER TABLE crm_email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_candidate_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY crm_sequences_tenant_isolation ON crm_email_sequences
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY crm_sequence_steps_tenant_isolation ON crm_email_sequence_steps
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY crm_activities_tenant_isolation ON crm_activities
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY talent_feedback_tenant_isolation ON talent_interview_feedback
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY talent_notes_tenant_isolation ON talent_candidate_notes
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hrms_reviews_tenant_isolation ON hrms_performance_reviews
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY hrms_goals_tenant_isolation ON hrms_goals
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY api_keys_tenant_isolation ON admin_api_keys
    USING (tenant_id IS NULL OR tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Updated_at triggers
CREATE TRIGGER update_crm_sequences_updated_at BEFORE UPDATE ON crm_email_sequences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_sequence_steps_updated_at BEFORE UPDATE ON crm_email_sequence_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at BEFORE UPDATE ON crm_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talent_feedback_updated_at BEFORE UPDATE ON talent_interview_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talent_notes_updated_at BEFORE UPDATE ON talent_candidate_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_reviews_updated_at BEFORE UPDATE ON hrms_performance_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrms_goals_updated_at BEFORE UPDATE ON hrms_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON admin_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
