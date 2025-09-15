-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'suspended', 'inactive')),
    logo_url TEXT,
    location VARCHAR(255),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_subscriptions table
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('starter', 'professional', 'enterprise')),
    status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'cancelled', 'expired')),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    price_per_month DECIMAL(10,2),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_users table for tracking user counts
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    last_active TIMESTAMP WITH TIME ZONE
);

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    avatar_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_usage table for tracking usage metrics
CREATE TABLE IF NOT EXISTS tenant_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_tenant_id ON tenant_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_id ON tenant_usage(tenant_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_subscriptions_updated_at BEFORE UPDATE ON tenant_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for tenant summary
CREATE OR REPLACE VIEW tenant_summary AS
SELECT 
    t.id,
    t.name,
    t.domain,
    t.status,
    t.location,
    t.contact_name,
    t.contact_email,
    t.created_at,
    t.updated_at,
    ts.plan,
    ts.status as subscription_status,
    ts.trial_ends_at,
    COALESCE(user_counts.user_count, 0) as user_count,
    COALESCE(usage_stats.api_calls, 0) as monthly_api_calls,
    CASE 
        WHEN ts.plan = 'starter' THEN 29
        WHEN ts.plan = 'professional' THEN 99
        WHEN ts.plan = 'enterprise' THEN 299
        ELSE 0
    END as monthly_revenue
FROM tenants t
LEFT JOIN tenant_subscriptions ts ON t.id = ts.tenant_id
LEFT JOIN (
    SELECT tenant_id, COUNT(*) as user_count
    FROM tenant_users
    WHERE status = 'active'
    GROUP BY tenant_id
) user_counts ON t.id = user_counts.tenant_id
LEFT JOIN (
    SELECT tenant_id, SUM(metric_value) as api_calls
    FROM tenant_usage
    WHERE metric_name = 'api_calls' 
    AND recorded_at >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY tenant_id
) usage_stats ON t.id = usage_stats.tenant_id;

-- Insert sample data
INSERT INTO tenants (name, domain, status, location, contact_name, contact_email) VALUES
('Acme Corporation', 'acme.com', 'active', 'New York, USA', 'John Smith', 'john@acme.com'),
('TechStart Inc', 'techstart.io', 'active', 'San Francisco, USA', 'Sarah Johnson', 'sarah@techstart.io'),
('Global Solutions', 'globalsol.com', 'trial', 'London, UK', 'Mike Chen', 'mike@globalsol.com'),
('DataFlow Ltd', 'dataflow.co.uk', 'active', 'Manchester, UK', 'Emma Wilson', 'emma@dataflow.co.uk'),
('Innovation Hub', 'innohub.de', 'suspended', 'Berlin, Germany', 'Hans Mueller', 'hans@innohub.de')
ON CONFLICT (domain) DO NOTHING;

-- Insert sample subscriptions
INSERT INTO tenant_subscriptions (tenant_id, plan, status, price_per_month, trial_ends_at)
SELECT 
    t.id,
    CASE 
        WHEN t.name = 'Acme Corporation' THEN 'enterprise'
        WHEN t.name = 'TechStart Inc' THEN 'professional'
        WHEN t.name = 'Global Solutions' THEN 'starter'
        WHEN t.name = 'DataFlow Ltd' THEN 'professional'
        WHEN t.name = 'Innovation Hub' THEN 'starter'
    END as plan,
    CASE 
        WHEN t.status = 'trial' THEN 'trial'
        WHEN t.status = 'suspended' THEN 'cancelled'
        ELSE 'active'
    END as status,
    CASE 
        WHEN t.name = 'Acme Corporation' THEN 299.00
        WHEN t.name = 'TechStart Inc' THEN 99.00
        WHEN t.name = 'Global Solutions' THEN 29.00
        WHEN t.name = 'DataFlow Ltd' THEN 99.00
        WHEN t.name = 'Innovation Hub' THEN 29.00
    END as price_per_month,
    CASE 
        WHEN t.status = 'trial' THEN NOW() + INTERVAL '14 days'
        ELSE NULL
    END as trial_ends_at
FROM tenants t
WHERE NOT EXISTS (
    SELECT 1 FROM tenant_subscriptions ts WHERE ts.tenant_id = t.id
);

-- Insert sample users
INSERT INTO tenant_users (tenant_id, user_id, role, status)
SELECT 
    t.id,
    uuid_generate_v4(),
    'admin',
    'active'
FROM tenants t
WHERE NOT EXISTS (
    SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = t.id AND tu.role = 'admin'
);

-- Insert additional sample users with varying counts
INSERT INTO tenant_users (tenant_id, user_id, role, status)
SELECT 
    t.id,
    uuid_generate_v4(),
    'user',
    'active'
FROM tenants t
CROSS JOIN generate_series(1, 
    CASE 
        WHEN t.name = 'Acme Corporation' THEN 244  -- Total 245 with admin
        WHEN t.name = 'TechStart Inc' THEN 88      -- Total 89 with admin
        WHEN t.name = 'Global Solutions' THEN 11   -- Total 12 with admin
        WHEN t.name = 'DataFlow Ltd' THEN 155      -- Total 156 with admin
        WHEN t.name = 'Innovation Hub' THEN 33     -- Total 34 with admin
    END
) series;

-- Insert sample usage data
INSERT INTO tenant_usage (tenant_id, metric_name, metric_value, recorded_at)
SELECT 
    t.id,
    'api_calls',
    FLOOR(RANDOM() * 10000 + 1000)::DECIMAL,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM tenants t
CROSS JOIN generate_series(1, 30) -- 30 days of data
WHERE NOT EXISTS (
    SELECT 1 FROM tenant_usage tu WHERE tu.tenant_id = t.id AND tu.metric_name = 'api_calls'
);

-- Create function to get tenant stats
CREATE OR REPLACE FUNCTION get_tenant_stats()
RETURNS TABLE (
    total_tenants BIGINT,
    active_tenants BIGINT,
    trial_tenants BIGINT,
    suspended_tenants BIGINT,
    total_users BIGINT,
    total_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tenants,
        COUNT(*) FILTER (WHERE status = 'active') as active_tenants,
        COUNT(*) FILTER (WHERE status = 'trial') as trial_tenants,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_tenants,
        COALESCE(SUM(user_count), 0) as total_users,
        COALESCE(SUM(monthly_revenue), 0) as total_revenue
    FROM tenant_summary;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - customize based on your auth system)
CREATE POLICY "Tenants can view their own data" ON tenants
    FOR SELECT USING (true); -- Adjust based on your auth system

CREATE POLICY "Admins can manage all tenants" ON tenants
    FOR ALL USING (true); -- Adjust based on your auth system

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON tenants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_usage TO authenticated;
GRANT SELECT ON tenant_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_tenant_stats() TO authenticated;
