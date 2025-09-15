-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    plan VARCHAR(20) DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_ends_at TIMESTAMP WITH TIME ZONE
);

-- Create users table with RLS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'master_admin', 'super_admin', 'admin', 'recruitment_manager', 
        'hr_manager', 'business_development_manager', 'recruiter', 'bench_sales_recruiter'
    )),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('optimization', 'prediction', 'recommendation', 'alert')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    impact VARCHAR(20) CHECK (impact IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'implemented')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create system metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation rules table
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('schedule', 'event', 'condition')),
    conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '[]',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('success', 'failed', 'running')),
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    source_ip INET,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automated reports table
CREATE TABLE IF NOT EXISTS automated_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_tenant_id ON ai_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_system_metrics_tenant_id ON system_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_security_events_tenant_id ON security_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own tenant's data
CREATE POLICY tenant_isolation_users ON users
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID
        OR current_setting('app.user_role') IN ('master_admin', 'super_admin')
    );

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID
        OR current_setting('app.user_role') IN ('master_admin', 'super_admin')
    );

CREATE POLICY tenant_isolation_ai_insights ON ai_insights
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID
        OR current_setting('app.user_role') IN ('master_admin', 'super_admin')
    );

CREATE POLICY tenant_isolation_system_metrics ON system_metrics
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID
        OR current_setting('app.user_role') IN ('master_admin', 'super_admin')
    );

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_tenant_metrics(tenant_id UUID, time_range TEXT DEFAULT '30d')
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    start_date TIMESTAMP;
BEGIN
    -- Calculate start date based on time range
    CASE time_range
        WHEN '7d' THEN start_date := NOW() - INTERVAL '7 days';
        WHEN '30d' THEN start_date := NOW() - INTERVAL '30 days';
        WHEN '90d' THEN start_date := NOW() - INTERVAL '90 days';
        ELSE start_date := NOW() - INTERVAL '30 days';
    END CASE;

    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM users WHERE users.tenant_id = get_tenant_metrics.tenant_id),
        'active_users', (SELECT COUNT(*) FROM users WHERE users.tenant_id = get_tenant_metrics.tenant_id AND is_active = true),
        'revenue', COALESCE((SELECT SUM(value) FROM system_metrics WHERE system_metrics.tenant_id = get_tenant_metrics.tenant_id AND metric_type = 'revenue' AND recorded_at >= start_date), 0),
        'growth_rate', COALESCE((SELECT AVG(value) FROM system_metrics WHERE system_metrics.tenant_id = get_tenant_metrics.tenant_id AND metric_type = 'growth_rate' AND recorded_at >= start_date), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate AI insights
CREATE OR REPLACE FUNCTION generate_ai_insights(tenant_id UUID)
RETURNS SETOF ai_insights AS $$
BEGIN
    -- This would typically call external AI services
    -- For now, return existing insights
    RETURN QUERY
    SELECT * FROM ai_insights 
    WHERE ai_insights.tenant_id = generate_ai_insights.tenant_id 
    AND status = 'active'
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create tenant analytics view
CREATE OR REPLACE VIEW tenant_analytics AS
SELECT 
    t.id as tenant_id,
    t.name,
    COUNT(u.id) as total_users,
    COUNT(CASE WHEN u.is_active THEN 1 END) as active_users,
    COALESCE(SUM(CASE WHEN sm.metric_type = 'revenue' THEN sm.value END), 0) as revenue,
    COALESCE(AVG(CASE WHEN sm.metric_type = 'growth_rate' THEN sm.value END), 0) as growth_rate,
    COALESCE(AVG(CASE WHEN sm.metric_type = 'health_score' THEN sm.value END), 100) as health_score
FROM tenants t
LEFT JOIN users u ON t.id = u.tenant_id
LEFT JOIN system_metrics sm ON t.id = sm.tenant_id 
    AND sm.recorded_at >= NOW() - INTERVAL '30 days'
GROUP BY t.id, t.name;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
