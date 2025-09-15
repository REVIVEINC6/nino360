-- ESG OS Platform - Role Management System Schema
-- Comprehensive RBAC + FBAC implementation with AI and blockchain integration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for role management
CREATE TYPE role_scope AS ENUM ('global', 'tenant', 'module');
CREATE TYPE permission_level AS ENUM ('none', 'read', 'write', 'admin', 'owner');
CREATE TYPE field_access_level AS ENUM ('none', 'read', 'read_write', 'admin');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'assign', 'revoke', 'login', 'access_denied');

-- =============================================
-- CORE ROLE MANAGEMENT TABLES
-- =============================================

-- Roles table with AI insights and field permissions
CREATE TABLE IF NOT EXISTS esg_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope role_scope DEFAULT 'tenant',
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
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(tenant_id, name),
    CHECK (scope = 'global' OR tenant_id IS NOT NULL)
);

-- User role assignments with temporal tracking
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES esg_roles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Assignment metadata
    assigned_by UUID REFERENCES users(id),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Role audit logs with blockchain integration
CREATE TABLE IF NOT EXISTS role_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID REFERENCES esg_roles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID REFERENCES esg_roles(id) ON DELETE CASCADE,
    
    insight_type VARCHAR(50) NOT NULL, -- 'drift_detection', 'optimization', 'security_risk', 'usage_pattern'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    confidence DECIMAL(3,2) NOT NULL,
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    auto_actionable BOOLEAN DEFAULT FALSE,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'dismissed'
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Field access control definitions
CREATE TABLE IF NOT EXISTS field_access_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_esg_roles_tenant_id ON esg_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_esg_roles_scope ON esg_roles(scope);
CREATE INDEX IF NOT EXISTS idx_esg_roles_active ON esg_roles(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_esg_roles_system ON esg_roles(is_system_defined);
CREATE INDEX IF NOT EXISTS idx_esg_roles_ai_risk ON esg_roles(ai_risk_score DESC);

-- Assignment indexes
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_tenant ON user_role_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_active ON user_role_assignments(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_expires ON user_role_assignments(expires_at) WHERE expires_at IS NOT NULL;

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_tenant ON role_audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_role ON role_audit_logs(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_user ON role_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_action ON role_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_created_at ON role_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_anomaly ON role_audit_logs(ai_anomaly_score DESC) WHERE ai_anomaly_score > 0.7;

-- AI insights indexes
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_tenant ON role_ai_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_role ON role_ai_insights(role_id);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_type ON role_ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_severity ON role_ai_insights(severity);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_status ON role_ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_confidence ON role_ai_insights(confidence DESC);

-- Field access indexes
CREATE INDEX IF NOT EXISTS idx_field_access_module ON field_access_definitions(module);
CREATE INDEX IF NOT EXISTS idx_field_access_sensitivity ON field_access_definitions(sensitivity_level DESC);
CREATE INDEX IF NOT EXISTS idx_field_access_pii ON field_access_definitions(is_pii) WHERE is_pii = TRUE;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_esg_roles_search ON esg_roles USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_permission_templates_search ON permission_templates USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- =============================================
-- TRIGGERS AND FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_esg_roles_updated_at BEFORE UPDATE ON esg_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permission_templates_updated_at BEFORE UPDATE ON permission_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update role user count
CREATE OR REPLACE FUNCTION update_role_user_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_active = TRUE THEN
        UPDATE esg_roles 
        SET user_count = user_count + 1, last_used = NOW()
        WHERE id = NEW.role_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.is_active = FALSE AND NEW.is_active = TRUE THEN
            UPDATE esg_roles 
            SET user_count = user_count + 1, last_used = NOW()
            WHERE id = NEW.role_id;
        ELSIF OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
            UPDATE esg_roles 
            SET user_count = GREATEST(user_count - 1, 0)
            WHERE id = NEW.role_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.is_active = TRUE THEN
        UPDATE esg_roles 
        SET user_count = GREATEST(user_count - 1, 0)
        WHERE id = OLD.role_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply user count trigger
CREATE TRIGGER update_role_user_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_role_assignments
    FOR EACH ROW EXECUTE FUNCTION update_role_user_count();

-- Function to log role changes
CREATE OR REPLACE FUNCTION log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO role_audit_logs (
        tenant_id, role_id, user_id, action, resource_type, resource_id, 
        old_values, new_values, ip_address
    ) VALUES (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.updated_by, NEW.created_by),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'create'
            WHEN TG_OP = 'UPDATE' THEN 'update'
            WHEN TG_OP = 'DELETE' THEN 'delete'
        END,
        'role',
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
        inet_client_addr()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply audit trigger
CREATE TRIGGER log_role_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON esg_roles
    FOR EACH ROW EXECUTE FUNCTION log_role_changes();

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE esg_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_access_definitions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(current_setting('app.user_role', true), 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.tenant_id', true)::UUID, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for esg_roles
CREATE POLICY "Super admins can manage all roles" ON esg_roles
    FOR ALL USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Tenant admins can manage tenant roles" ON esg_roles
    FOR ALL USING (
        get_current_user_role() IN ('tenant_admin', 'admin') 
        AND (tenant_id = get_current_tenant_id() OR scope = 'global')
    );

CREATE POLICY "Users can view their accessible roles" ON esg_roles
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() 
        OR scope = 'global'
        OR id IN (
            SELECT role_id FROM user_role_assignments 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- RLS Policies for user_role_assignments
CREATE POLICY "Super admins can manage all assignments" ON user_role_assignments
    FOR ALL USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Tenant admins can manage tenant assignments" ON user_role_assignments
    FOR ALL USING (
        get_current_user_role() IN ('tenant_admin', 'admin') 
        AND tenant_id = get_current_tenant_id()
    );

CREATE POLICY "Users can view their own assignments" ON user_role_assignments
    FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for role_audit_logs
CREATE POLICY "Super admins can view all audit logs" ON role_audit_logs
    FOR SELECT USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Tenant admins can view tenant audit logs" ON role_audit_logs
    FOR SELECT USING (
        get_current_user_role() IN ('tenant_admin', 'admin') 
        AND tenant_id = get_current_tenant_id()
    );

-- RLS Policies for role_ai_insights
CREATE POLICY "Admins can manage AI insights" ON role_ai_insights
    FOR ALL USING (
        get_current_user_role() IN ('super_admin', 'tenant_admin', 'admin')
        AND (get_current_user_role() = 'super_admin' OR tenant_id = get_current_tenant_id())
    );

-- RLS Policies for field_access_definitions
CREATE POLICY "Admins can manage field definitions" ON field_access_definitions
    FOR ALL USING (get_current_user_role() IN ('super_admin', 'tenant_admin', 'admin'));

CREATE POLICY "Users can view field definitions" ON field_access_definitions
    FOR SELECT USING (TRUE);

-- =============================================
-- SAMPLE DATA AND TEMPLATES
-- =============================================

-- Insert system-defined roles
INSERT INTO esg_roles (name, description, scope, is_system_defined, permissions, field_permissions) VALUES
('Super Administrator', 'Full system access across all tenants', 'global', TRUE, 
 '{"*": ["admin"]}', 
 '{"*": {"*": {"*": "admin"}}}'),

('Tenant Administrator', 'Full access within tenant scope', 'tenant', TRUE,
 '{"users": ["admin"], "settings": ["admin"], "crm": ["admin"], "hrms": ["admin"], "finance": ["admin"]}',
 '{"hrms": {"employees": {"salary": "read_write", "ssn": "read", "personal_info": "read_write"}}, "finance": {"invoices": {"amount": "read_write", "vendor_details": "read_write"}}}'),

('Manager', 'Management access to assigned modules', 'tenant', TRUE,
 '{"crm": ["read", "write"], "hrms": ["read", "write"], "reports": ["read"]}',
 '{"hrms": {"employees": {"salary": "read", "ssn": "none", "personal_info": "read_write"}}, "crm": {"contacts": {"email": "read_write", "phone": "read_write"}}}'),

('Employee', 'Basic employee access', 'tenant', TRUE,
 '{"crm": ["read"], "hrms": ["read"], "profile": ["read", "write"]}',
 '{"hrms": {"employees": {"salary": "none", "ssn": "none", "personal_info": "read"}}, "crm": {"contacts": {"email": "read", "phone": "read"}}}'),

('Viewer', 'Read-only access to non-sensitive data', 'tenant', TRUE,
 '{"crm": ["read"], "reports": ["read"]}',
 '{"hrms": {"employees": {"salary": "none", "ssn": "none", "personal_info": "none"}}, "crm": {"contacts": {"email": "read", "phone": "none"}}}'
);

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
 '{"finance": {"invoices": {"amount": "read_write", "vendor_details": "read_write"}, "expenses": {"amount": "read_write", "receipts": "read"}}}'),

('Customer Support', 'Customer service and support role', 'Support',
 '{"crm": ["read"], "tickets": ["read", "write"]}',
 '{"crm": {"contacts": {"email": "read", "phone": "read", "support_history": "read_write"}}}');

-- Insert field access definitions
INSERT INTO field_access_definitions (module, table_name, field_name, field_type, sensitivity_level, is_pii, is_financial, compliance_tags, description) VALUES
('hrms', 'employees', 'ssn', 'string', 5, TRUE, FALSE, ARRAY['PII', 'GDPR'], 'Social Security Number - highly sensitive'),
('hrms', 'employees', 'salary', 'decimal', 4, FALSE, TRUE, ARRAY['Financial'], 'Employee salary information'),
('hrms', 'employees', 'email', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Employee email address'),
('hrms', 'employees', 'phone', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Employee phone number'),
('hrms', 'employees', 'date_of_birth', 'date', 3, TRUE, FALSE, ARRAY['PII', 'GDPR'], 'Employee date of birth'),
('finance', 'invoices', 'amount', 'decimal', 3, FALSE, TRUE, ARRAY['Financial'], 'Invoice amount'),
('finance', 'invoices', 'vendor_tax_id', 'string', 4, FALSE, TRUE, ARRAY['Financial', 'Tax'], 'Vendor tax identification'),
('crm', 'contacts', 'email', 'string', 2, TRUE, FALSE, ARRAY['PII'], 'Contact email address'),
('crm', 'contacts', 'credit_score', 'integer', 4, FALSE, TRUE, ARRAY['Financial'], 'Contact credit score');

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_module VARCHAR,
    p_action VARCHAR,
    p_tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN := FALSE;
    role_permissions JSONB;
BEGIN
    -- Check if user has the required permission through any active role
    SELECT EXISTS(
        SELECT 1
        FROM user_role_assignments ura
        JOIN esg_roles r ON ura.role_id = r.id
        WHERE ura.user_id = p_user_id
        AND ura.is_active = TRUE
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (p_tenant_id IS NULL OR ura.tenant_id = p_tenant_id OR r.scope = 'global')
        AND (
            r.permissions ? '*' 
            OR (r.permissions ? p_module AND r.permissions->p_module ? p_action)
            OR (r.permissions ? p_module AND 'admin' = ANY(SELECT jsonb_array_elements_text(r.permissions->p_module)))
        )
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user field access level
CREATE OR REPLACE FUNCTION get_field_access_level(
    p_user_id UUID,
    p_module VARCHAR,
    p_table_name VARCHAR,
    p_field_name VARCHAR,
    p_tenant_id UUID DEFAULT NULL
)
RETURNS field_access_level AS $$
DECLARE
    max_access field_access_level := 'none';
    role_access field_access_level;
BEGIN
    -- Get the highest access level from all user's active roles
    FOR role_access IN
        SELECT COALESCE(
            (r.field_permissions->p_module->p_table_name->>p_field_name)::field_access_level,
            'none'
        )
        FROM user_role_assignments ura
        JOIN esg_roles r ON ura.role_id = r.id
        WHERE ura.user_id = p_user_id
        AND ura.is_active = TRUE
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
        AND (p_tenant_id IS NULL OR ura.tenant_id = p_tenant_id OR r.scope = 'global')
        AND r.field_permissions ? p_module
    LOOP
        -- Determine the highest access level
        IF role_access = 'admin' THEN
            max_access := 'admin';
            EXIT;
        ELSIF role_access = 'read_write' AND max_access != 'admin' THEN
            max_access := 'read_write';
        ELSIF role_access = 'read' AND max_access NOT IN ('admin', 'read_write') THEN
            max_access := 'read';
        END IF;
    END LOOP;
    
    RETURN max_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate AI insights for roles
CREATE OR REPLACE FUNCTION generate_role_ai_insights()
RETURNS VOID AS $$
DECLARE
    role_record RECORD;
    insight_count INTEGER;
BEGIN
    -- Analyze each role for potential issues
    FOR role_record IN 
        SELECT r.*, COUNT(ura.id) as active_assignments
        FROM esg_roles r
        LEFT JOIN user_role_assignments ura ON r.id = ura.role_id AND ura.is_active = TRUE
        WHERE r.is_active = TRUE
        GROUP BY r.id
    LOOP
        -- Check for unused roles
        IF role_record.active_assignments = 0 AND role_record.created_at < NOW() - INTERVAL '30 days' THEN
            INSERT INTO role_ai_insights (tenant_id, role_id, insight_type, title, description, severity, confidence, recommendations)
            VALUES (
                role_record.tenant_id,
                role_record.id,
                'usage_pattern',
                'Unused Role Detected',
                'Role "' || role_record.name || '" has no active assignments for 30+ days',
                'medium',
                0.85,
                '["Consider archiving this role", "Review if role is still needed", "Merge with similar roles"]'::jsonb
            );
        END IF;
        
        -- Check for overprivileged roles
        IF jsonb_path_exists(role_record.permissions, '$.* ? (@ == "admin")') THEN
            INSERT INTO role_ai_insights (tenant_id, role_id, insight_type, title, description, severity, confidence, recommendations)
            VALUES (
                role_record.tenant_id,
                role_record.id,
                'security_risk',
                'Overprivileged Role',
                'Role "' || role_record.name || '" has admin access to all modules',
                'high',
                0.90,
                '["Apply principle of least privilege", "Split into more specific roles", "Regular access review"]'::jsonb
            );
        END IF;
    END LOOP;
    
    -- Update AI analysis timestamp
    UPDATE esg_roles SET ai_last_analyzed = NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create indexes for better performance on JSONB columns
CREATE INDEX IF NOT EXISTS idx_esg_roles_permissions_gin ON esg_roles USING gin(permissions);
CREATE INDEX IF NOT EXISTS idx_esg_roles_field_permissions_gin ON esg_roles USING gin(field_permissions);
CREATE INDEX IF NOT EXISTS idx_role_ai_insights_recommendations_gin ON role_ai_insights USING gin(recommendations);

COMMIT;
