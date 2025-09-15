-- ESG OS Platform - Role Management System Schema (Fixed)
-- Create tables step by step to avoid dependency issues

-- First, create the core roles table
CREATE TABLE IF NOT EXISTS esg_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope VARCHAR(20) DEFAULT 'tenant' CHECK (scope IN ('global', 'tenant', 'module')),
    is_system_defined BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Module-level permissions
    permissions JSONB DEFAULT '{}',
    
    -- Field-level permissions (FBAC)
    field_permissions JSONB DEFAULT '{}',
    
    -- AI-powered insights and suggestions
    ai_insights JSONB DEFAULT '{}',
    ai_risk_score INTEGER DEFAULT 0 CHECK (ai_risk_score >= 0 AND ai_risk_score <= 100),
    ai_last_analyzed TIMESTAMP WITH TIME ZONE,
    
    -- Usage analytics
    user_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    usage_frequency DECIMAL(5,2) DEFAULT 0.0,
    
    -- Blockchain integration
    blockchain_hash VARCHAR(256),
    blockchain_tx_id VARCHAR(256),
    
    -- Metadata
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(tenant_id, name)
);

-- User role assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL REFERENCES esg_roles(id) ON DELETE CASCADE,
    tenant_id UUID,
    
    -- Assignment metadata
    assigned_by UUID,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- AI recommendations
    ai_recommended BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    
    -- Audit trail
    assignment_reason TEXT,
    blockchain_hash VARCHAR(256),
    
    UNIQUE(user_id, role_id, tenant_id)
);

-- Permission templates for AI suggestions
CREATE TABLE IF NOT EXISTS permission_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    permissions JSONB NOT NULL,
    field_permissions JSONB DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role audit logs
CREATE TABLE IF NOT EXISTS role_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    role_id UUID REFERENCES esg_roles(id) ON DELETE SET NULL,
    user_id UUID,
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'assign', 'revoke', 'login', 'access_denied')),
    
    -- Audit details
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    
    -- AI analysis
    ai_anomaly_score DECIMAL(3,2),
    ai_risk_flags TEXT[],
    
    -- Blockchain verification
    blockchain_hash VARCHAR(256),
    blockchain_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI role suggestions and insights
CREATE TABLE IF NOT EXISTS role_ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    role_id UUID REFERENCES esg_roles(id) ON DELETE CASCADE,
    
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence DECIMAL(3,2) NOT NULL,
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    auto_actionable BOOLEAN DEFAULT FALSE,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Field access control definitions
CREATE TABLE IF NOT EXISTS field_access_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    sensitivity_level INTEGER DEFAULT 1 CHECK (sensitivity_level >= 1 AND sensitivity_level <= 5),
    is_pii BOOLEAN DEFAULT FALSE,
    is_financial BOOLEAN DEFAULT FALSE,
    compliance_tags TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(module, table_name, field_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_esg_roles_tenant_id ON esg_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_esg_roles_scope ON esg_roles(scope);
CREATE INDEX IF NOT EXISTS idx_esg_roles_active ON esg_roles(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_role ON role_audit_logs(role_id);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_role ON role_ai_insights(role_id);

-- Insert sample system roles
INSERT INTO esg_roles (name, description, scope, is_system_defined, permissions, field_permissions, ai_risk_score, user_count) VALUES
('Super Administrator', 'Full system access across all tenants', 'global', TRUE, 
 '{"*": ["admin"]}', 
 '{"*": {"*": {"*": "admin"}}}', 95, 2),

('Tenant Administrator', 'Full access within tenant scope', 'tenant', TRUE,
 '{"users": ["admin"], "settings": ["admin"], "crm": ["admin"], "hrms": ["admin"], "finance": ["admin"]}',
 '{"hrms": {"employees": {"salary": "read_write", "ssn": "read", "personal_info": "read_write"}}, "finance": {"invoices": {"amount": "read_write", "vendor_details": "read_write"}}}', 85, 5),

('Manager', 'Management access to assigned modules', 'tenant', TRUE,
 '{"crm": ["read", "write"], "hrms": ["read", "write"], "reports": ["read"]}',
 '{"hrms": {"employees": {"salary": "read", "ssn": "none", "personal_info": "read_write"}}, "crm": {"contacts": {"email": "read_write", "phone": "read_write"}}}', 45, 12),

('Employee', 'Basic employee access', 'tenant', TRUE,
 '{"crm": ["read"], "hrms": ["read"], "profile": ["read", "write"]}',
 '{"hrms": {"employees": {"salary": "none", "ssn": "none", "personal_info": "read"}}, "crm": {"contacts": {"email": "read", "phone": "read"}}}', 25, 150),

('Viewer', 'Read-only access to non-sensitive data', 'tenant', TRUE,
 '{"crm": ["read"], "reports": ["read"]}',
 '{"hrms": {"employees": {"salary": "none", "ssn": "none", "personal_info": "none"}}, "crm": {"contacts": {"email": "read", "phone": "none"}}}', 15, 75);

-- Insert permission templates
INSERT INTO permission_templates (name, description, category, permissions, field_permissions) VALUES
('Sales Representative', 'CRM-focused role for sales team', 'Sales',
 '{"crm": ["read", "write"], "reports": ["read"]}',
 '{"crm": {"leads": {"contact_info": "read_write", "deal_value": "read_write"}, "contacts": {"email": "read_write", "phone": "read_write"}}}'),

('HR Specialist', 'Human resources management role', 'HR',
 '{"hrms": ["read", "write"], "users": ["read"]}',
 '{"hrms": {"employees": {"salary": "read", "ssn": "read", "personal_info": "read_write", "performance": "read_write"}}}'),

('Finance Analyst', 'Financial data analysis and reporting', 'Finance',
 '{"finance": ["read", "write"], "reports": ["read", "write"]}',
 '{"finance": {"invoices": {"amount": "read_write", "vendor_details": "read_write"}, "expenses": {"amount": "read_write", "receipts": "read"}}}');

-- Insert field access definitions
INSERT INTO field_access_definitions (module, table_name, field_name, field_type, sensitivity_level, is_pii, is_financial, compliance_tags, description) VALUES
('hrms', 'employees', 'ssn', 'string', 5, TRUE, FALSE, ARRAY['PII', 'GDPR'], 'Social Security Number - highly sensitive'),
('hrms', 'employees', 'salary', 'decimal', 4, FALSE, TRUE, ARRAY['Financial'], 'Employee salary information'),
('hrms', 'employees', 'email', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Employee email address'),
('hrms', 'employees', 'phone', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Employee phone number'),
('finance', 'invoices', 'amount', 'decimal', 3, FALSE, TRUE, ARRAY['Financial'], 'Invoice amount'),
('crm', 'contacts', 'email', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Contact email address');

-- Insert sample AI insights
INSERT INTO role_ai_insights (role_id, insight_type, title, description, severity, confidence, recommendations, status) 
SELECT 
    r.id,
    'security_risk',
    'High privilege role with excessive permissions',
    'This role has admin access to multiple sensitive modules. Consider implementing principle of least privilege.',
    'high',
    0.85,
    '["Remove admin access from non-critical modules", "Implement time-based access controls", "Add additional approval workflows"]',
    'active'
FROM esg_roles r WHERE r.name = 'Super Administrator';

INSERT INTO role_ai_insights (role_id, insight_type, title, description, severity, confidence, recommendations, status)
SELECT 
    r.id,
    'usage_anomaly',
    'Role assigned to more users than recommended',
    'This role is assigned to 150+ users, which may indicate over-privileging. Consider creating more specific roles.',
    'medium',
    0.75,
    '["Create specialized roles for different user groups", "Implement role hierarchy", "Review user assignments quarterly"]',
    'active'
FROM esg_roles r WHERE r.name = 'Employee';

COMMIT;
