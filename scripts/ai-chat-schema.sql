-- AI Chat and Insights Schema
-- This script creates tables for AI chat functionality, insights, and analytics

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'New Chat Session',
    module VARCHAR(50) NOT NULL DEFAULT 'general',
    context JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'system', 'image')),
    confidence DECIMAL(3,2) DEFAULT NULL,
    processing_time INTEGER DEFAULT NULL, -- in milliseconds
    sources TEXT[] DEFAULT '{}',
    suggestions TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    insight_type VARCHAR(20) NOT NULL CHECK (insight_type IN ('positive', 'negative', 'neutral', 'warning')),
    impact VARCHAR(10) NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
    category VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    value DECIMAL(15,2) DEFAULT NULL,
    change_value DECIMAL(15,2) DEFAULT NULL,
    trend VARCHAR(10) DEFAULT NULL CHECK (trend IN ('up', 'down', 'stable')),
    confidence DECIMAL(3,2) DEFAULT NULL,
    source VARCHAR(100) NOT NULL,
    is_actionable BOOLEAN DEFAULT FALSE,
    actions TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- AI Metrics Table
CREATE TABLE IF NOT EXISTS ai_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    previous_value DECIMAL(15,4) DEFAULT NULL,
    target_value DECIMAL(15,4) DEFAULT NULL,
    benchmark_value DECIMAL(15,4) DEFAULT NULL,
    unit VARCHAR(20) DEFAULT '',
    format_type VARCHAR(20) DEFAULT 'number' CHECK (format_type IN ('number', 'percentage', 'currency', 'duration')),
    trend VARCHAR(10) DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
    change_percentage DECIMAL(5,2) DEFAULT NULL,
    is_kpi BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- AI Predictions Table
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    probability DECIMAL(3,2) NOT NULL,
    impact VARCHAR(10) NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
    timeframe VARCHAR(50) NOT NULL,
    factors TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'realized', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    predicted_for TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- AI Analytics Events Table (for tracking AI usage and performance)
CREATE TABLE IF NOT EXISTS ai_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE SET NULL,
    processing_time INTEGER DEFAULT NULL,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Configurations Table
CREATE TABLE IF NOT EXISTS ai_model_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'latest',
    configuration JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_tenant_user ON ai_chat_sessions(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_module ON ai_chat_sessions(module);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_updated_at ON ai_chat_sessions(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_created_at ON ai_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_role ON ai_chat_messages(role);

CREATE INDEX IF NOT EXISTS idx_ai_insights_tenant_module ON ai_insights(tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type_impact ON ai_insights(insight_type, impact);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON ai_insights(priority DESC);

CREATE INDEX IF NOT EXISTS idx_ai_metrics_tenant_module ON ai_metrics(tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_category ON ai_metrics(category);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_kpi ON ai_metrics(is_kpi) WHERE is_kpi = TRUE;
CREATE INDEX IF NOT EXISTS idx_ai_metrics_updated_at ON ai_metrics(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_predictions_tenant_module ON ai_predictions(tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_confidence ON ai_predictions(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_predicted_for ON ai_predictions(predicted_for);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_status ON ai_predictions(status);

CREATE INDEX IF NOT EXISTS idx_ai_analytics_events_tenant ON ai_analytics_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_events_type ON ai_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_events_created_at ON ai_analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_model_configs_tenant_module ON ai_model_configs(tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_ai_model_configs_active ON ai_model_configs(is_active) WHERE is_active = TRUE;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_content_fts ON ai_chat_messages USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_ai_insights_title_desc_fts ON ai_insights USING gin(to_tsvector('english', title || ' ' || description));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON ai_chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_chat_messages_updated_at BEFORE UPDATE ON ai_chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_metrics_updated_at BEFORE UPDATE ON ai_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_predictions_updated_at BEFORE UPDATE ON ai_predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_model_configs_updated_at BEFORE UPDATE ON ai_model_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update session message count and last_message_at
CREATE OR REPLACE FUNCTION update_chat_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE ai_chat_sessions 
        SET 
            message_count = message_count + 1,
            last_message_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ai_chat_sessions 
        SET 
            message_count = GREATEST(message_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_session_stats_trigger
    AFTER INSERT OR DELETE ON ai_chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_session_stats();

-- Insert sample AI insights
INSERT INTO ai_insights (tenant_id, title, description, insight_type, impact, category, module, value, change_value, trend, confidence, source, is_actionable, actions, priority) VALUES
-- Get the first tenant ID for sample data
((SELECT id FROM tenants LIMIT 1), 'Employee Productivity Surge', 'Team productivity has increased by 23% this quarter, primarily driven by improved remote work policies and new collaboration tools.', 'positive', 'high', 'performance', 'hrms', 23.0, 5.2, 'up', 0.92, 'HRMS Analytics', TRUE, ARRAY['Scale successful practices', 'Document best practices', 'Share insights with other teams'], 1),

((SELECT id FROM tenants LIMIT 1), 'Recruitment Cost Optimization', 'AI-powered candidate screening has reduced time-to-hire by 40% and decreased recruitment costs by $50K this quarter.', 'positive', 'high', 'cost', 'talent', 50000.0, -15.3, 'down', 0.88, 'Talent Management', TRUE, ARRAY['Expand AI screening', 'Train recruiters', 'Optimize job postings'], 1),

((SELECT id FROM tenants LIMIT 1), 'Customer Satisfaction Decline', 'Customer satisfaction scores have dropped by 8% in the past month, with response time being the primary concern.', 'negative', 'medium', 'quality', 'crm', -8.0, -2.1, 'down', 0.85, 'CRM Analytics', TRUE, ARRAY['Improve response times', 'Additional training', 'Process optimization'], 2),

((SELECT id FROM tenants LIMIT 1), 'Compliance Risk Alert', 'Several processes are approaching compliance deadlines. Immediate action required to avoid potential penalties.', 'warning', 'high', 'compliance', 'general', NULL, NULL, NULL, 0.95, 'Compliance Monitor', TRUE, ARRAY['Review pending items', 'Assign responsible parties', 'Set up automated reminders'], 1);

-- Insert sample AI metrics
INSERT INTO ai_metrics (tenant_id, name, category, module, current_value, previous_value, target_value, benchmark_value, unit, format_type, trend, change_percentage, is_kpi, display_order) VALUES
((SELECT id FROM tenants LIMIT 1), 'Employee Satisfaction', 'HR', 'hrms', 87.0, 82.0, 90.0, 85.0, '%', 'percentage', 'up', 6.10, TRUE, 1),
((SELECT id FROM tenants LIMIT 1), 'Revenue Growth', 'Finance', 'finance', 125000.0, 118000.0, 130000.0, 120000.0, '$', 'currency', 'up', 5.93, TRUE, 2),
((SELECT id FROM tenants LIMIT 1), 'Customer Retention', 'Sales', 'crm', 94.2, 96.1, 95.0, 92.0, '%', 'percentage', 'down', -1.98, TRUE, 3),
((SELECT id FROM tenants LIMIT 1), 'Average Response Time', 'Support', 'crm', 2.3, 3.1, 2.0, 4.0, 'hours', 'duration', 'down', -25.81, TRUE, 4);

-- Insert sample AI predictions
INSERT INTO ai_predictions (tenant_id, title, description, category, module, confidence, probability, impact, timeframe, factors, recommendations, predicted_for) VALUES
((SELECT id FROM tenants LIMIT 1), 'Q4 Revenue Forecast', 'Based on current trends, Q4 revenue is projected to exceed targets by 12%', 'Revenue', 'finance', 0.87, 0.87, 'high', 'Next Quarter', ARRAY['Seasonal trends', 'New product launches', 'Market expansion'], ARRAY['Increase inventory', 'Scale marketing', 'Prepare for demand'], NOW() + INTERVAL '3 months'),

((SELECT id FROM tenants LIMIT 1), 'Talent Shortage Risk', 'High probability of talent shortage in engineering roles within 6 months', 'HR', 'talent', 0.73, 0.73, 'medium', '6 months', ARRAY['Market competition', 'Skill requirements', 'Compensation trends'], ARRAY['Start early recruitment', 'Upskill current team', 'Review compensation'], NOW() + INTERVAL '6 months');

-- Insert sample AI model configurations
INSERT INTO ai_model_configs (tenant_id, module, model_name, model_version, configuration, is_active) VALUES
((SELECT id FROM tenants LIMIT 1), 'general', 'gpt-4o-mini', 'latest', '{"temperature": 0.7, "max_tokens": 1000, "top_p": 1.0}', TRUE),
((SELECT id FROM tenants LIMIT 1), 'crm', 'gpt-4o-mini', 'latest', '{"temperature": 0.5, "max_tokens": 1200, "top_p": 0.9, "system_prompt": "CRM specialist"}', TRUE),
((SELECT id FROM tenants LIMIT 1), 'hrms', 'gpt-4o-mini', 'latest', '{"temperature": 0.6, "max_tokens": 1000, "top_p": 0.95, "system_prompt": "HR specialist"}', TRUE),
((SELECT id FROM tenants LIMIT 1), 'talent', 'gpt-4o-mini', 'latest', '{"temperature": 0.6, "max_tokens": 1100, "top_p": 0.9, "system_prompt": "Talent management specialist"}', TRUE);

-- Create RLS policies for AI tables
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON ai_chat_sessions
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        ) AND user_id = auth.uid()
    );

CREATE POLICY "Users can create their own chat sessions" ON ai_chat_sessions
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        ) AND user_id = auth.uid()
    );

CREATE POLICY "Users can update their own chat sessions" ON ai_chat_sessions
    FOR UPDATE USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        ) AND user_id = auth.uid()
    );

-- RLS Policies for ai_chat_messages
CREATE POLICY "Users can view messages from their sessions" ON ai_chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM ai_chat_sessions 
            WHERE user_id = auth.uid() AND tenant_id IN (
                SELECT tenant_id FROM user_tenants 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create messages in their sessions" ON ai_chat_messages
    FOR INSERT WITH CHECK (
        session_id IN (
            SELECT id FROM ai_chat_sessions 
            WHERE user_id = auth.uid() AND tenant_id IN (
                SELECT tenant_id FROM user_tenants 
                WHERE user_id = auth.uid()
            )
        )
    );

-- RLS Policies for ai_insights
CREATE POLICY "Users can view insights from their tenant" ON ai_insights
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage insights" ON ai_insights
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- RLS Policies for ai_metrics
CREATE POLICY "Users can view metrics from their tenant" ON ai_metrics
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage metrics" ON ai_metrics
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- RLS Policies for ai_predictions
CREATE POLICY "Users can view predictions from their tenant" ON ai_predictions
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage predictions" ON ai_predictions
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- RLS Policies for ai_analytics_events
CREATE POLICY "Users can view their own analytics events" ON ai_analytics_events
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        ) AND (user_id = auth.uid() OR user_id IS NULL)
    );

CREATE POLICY "System can create analytics events" ON ai_analytics_events
    FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for ai_model_configs
CREATE POLICY "Admins can manage model configs" ON ai_model_configs
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

CREATE POLICY "Users can view active model configs" ON ai_model_configs
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        ) AND is_active = TRUE
    );

-- Create views for easier querying
CREATE OR REPLACE VIEW ai_insights_summary AS
SELECT 
    tenant_id,
    module,
    COUNT(*) as total_insights,
    COUNT(*) FILTER (WHERE insight_type = 'positive') as positive_insights,
    COUNT(*) FILTER (WHERE insight_type = 'negative') as negative_insights,
    COUNT(*) FILTER (WHERE insight_type = 'warning') as warning_insights,
    COUNT(*) FILTER (WHERE impact = 'high') as high_impact_insights,
    COUNT(*) FILTER (WHERE is_actionable = TRUE) as actionable_insights,
    MAX(created_at) as last_insight_at
FROM ai_insights
WHERE status = 'active'
GROUP BY tenant_id, module;

CREATE OR REPLACE VIEW ai_chat_activity AS
SELECT 
    s.tenant_id,
    s.module,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(m.id) as total_messages,
    AVG(s.message_count) as avg_messages_per_session,
    MAX(s.last_message_at) as last_activity_at,
    COUNT(DISTINCT s.user_id) as active_users
FROM ai_chat_sessions s
LEFT JOIN ai_chat_messages m ON s.id = m.session_id
WHERE s.status = 'active'
GROUP BY s.tenant_id, s.module;

-- Grant necessary permissions
GRANT SELECT ON ai_insights_summary TO authenticated;
GRANT SELECT ON ai_chat_activity TO authenticated;

-- Create function to get AI insights for a tenant
CREATE OR REPLACE FUNCTION get_ai_insights_for_tenant(
    p_tenant_id UUID,
    p_module VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    insight_type VARCHAR,
    impact VARCHAR,
    category VARCHAR,
    module VARCHAR,
    value DECIMAL,
    trend VARCHAR,
    confidence DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE,
    actions TEXT[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.insight_type,
        i.impact,
        i.category,
        i.module,
        i.value,
        i.trend,
        i.confidence,
        i.created_at,
        i.actions
    FROM ai_insights i
    WHERE i.tenant_id = p_tenant_id
        AND i.status = 'active'
        AND (p_module IS NULL OR i.module = p_module)
    ORDER BY 
        CASE i.priority WHEN 1 THEN 1 WHEN 2 THEN 2 ELSE 3 END,
        i.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Create function to log AI analytics events
CREATE OR REPLACE FUNCTION log_ai_event(
    p_tenant_id UUID,
    p_user_id UUID,
    p_event_type VARCHAR,
    p_module VARCHAR,
    p_event_data JSONB DEFAULT '{}',
    p_session_id UUID DEFAULT NULL,
    p_processing_time INTEGER DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO ai_analytics_events (
        tenant_id, user_id, event_type, module, event_data, 
        session_id, processing_time, success, error_message
    ) VALUES (
        p_tenant_id, p_user_id, p_event_type, p_module, p_event_data,
        p_session_id, p_processing_time, p_success, p_error_message
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_ai_insights_for_tenant TO authenticated;
GRANT EXECUTE ON FUNCTION log_ai_event TO authenticated;

COMMIT;
