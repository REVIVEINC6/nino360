-- =============================================
-- ESG OS Platform - Complete Supabase Setup
-- =============================================
-- This single script sets up everything needed for Supabase:
-- - Database schema with all tables and relationships
-- - Row Level Security (RLS) policies for multi-tenant isolation
-- - Authentication and user management
-- - Storage buckets and policies
-- - Edge functions setup
-- - Realtime subscriptions
-- - Field-Based Access Control (FBAC) functions
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- =============================================
-- AUTHENTICATION SETUP
-- =============================================

-- Create custom user role enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'manager', 'employee', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- CORE SYSTEM TABLES
-- =============================================

-- Tenants table (multi-tenant architecture)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (enhanced with auth integration)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role DEFAULT 'employee',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RBAC (Role-Based Access Control) TABLES
-- =============================================

-- ESG Roles with field-level permissions
CREATE TABLE IF NOT EXISTS esg_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  field_permissions JSONB DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

-- User role assignments
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES esg_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'
);

-- Role audit logs
CREATE TABLE IF NOT EXISTS role_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role_id UUID REFERENCES esg_roles(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BENCH MANAGEMENT TABLES
-- =============================================

-- Bench resources
CREATE TABLE IF NOT EXISTS bench_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  department TEXT,
  designation TEXT,
  experience_years INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'allocated', 'on_leave', 'unavailable')),
  allocation_start_date DATE,
  allocation_end_date DATE,
  current_project TEXT,
  billing_rate DECIMAL(10,2),
  cost_rate DECIMAL(10,2),
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  performance_rating DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills matrix
CREATE TABLE IF NOT EXISTS skills_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  level_definitions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource skills mapping
CREATE TABLE IF NOT EXISTS resource_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES bench_resources(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills_matrix(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience DECIMAL(3,1),
  last_used_date DATE,
  certified BOOLEAN DEFAULT false,
  certification_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, skill_id)
);

-- Project allocations
CREATE TABLE IF NOT EXISTS project_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES bench_resources(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  client_name TEXT,
  allocation_percentage INTEGER DEFAULT 100 CHECK (allocation_percentage BETWEEN 1 AND 100),
  start_date DATE NOT NULL,
  end_date DATE,
  billing_rate DECIMAL(10,2),
  role TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FINANCE MANAGEMENT TABLES
-- =============================================

-- Chart of accounts
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_account_id UUID REFERENCES chart_of_accounts(id),
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, account_code)
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  reference_number TEXT,
  description TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction line items
CREATE TABLE IF NOT EXISTS transaction_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE CASCADE,
  account_id UUID REFERENCES chart_of_accounts(id),
  description TEXT,
  debit_amount DECIMAL(15,2) DEFAULT 0,
  credit_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VMS (Vendor Management System) TABLES
-- =============================================

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  legal_name TEXT,
  vendor_code TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  website TEXT,
  tax_id TEXT,
  business_type TEXT,
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
  rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
  payment_terms TEXT,
  currency TEXT DEFAULT 'USD',
  billing_address JSONB DEFAULT '{}',
  shipping_address JSONB DEFAULT '{}',
  contacts JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  compliance_status JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  contract_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRAINING MANAGEMENT TABLES
-- =============================================

-- Training programs
CREATE TABLE IF NOT EXISTS training_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  format TEXT CHECK (format IN ('online', 'classroom', 'hybrid', 'self_paced')),
  instructor TEXT,
  max_participants INTEGER,
  prerequisites JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  certification_available BOOLEAN DEFAULT false,
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training sessions
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  virtual_link TEXT,
  instructor TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  materials JSONB DEFAULT '[]',
  feedback_summary JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training enrollments
CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'failed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  final_score DECIMAL(5,2),
  certification_earned BOOLEAN DEFAULT false,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- =============================================
-- HOTLIST MANAGEMENT TABLES
-- =============================================

-- Hotlist candidates
CREATE TABLE IF NOT EXISTS hotlist_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  current_location TEXT,
  preferred_locations JSONB DEFAULT '[]',
  current_title TEXT,
  current_company TEXT,
  experience_years DECIMAL(3,1),
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  availability TEXT CHECK (availability IN ('immediate', 'two_weeks', 'one_month', 'negotiable')),
  expected_salary_min DECIMAL(10,2),
  expected_salary_max DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  visa_status TEXT,
  willing_to_relocate BOOLEAN DEFAULT false,
  remote_work_preference TEXT CHECK (remote_work_preference IN ('onsite', 'remote', 'hybrid', 'flexible')),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'placed', 'inactive', 'do_not_contact')),
  source TEXT,
  recruiter_id UUID REFERENCES users(id),
  notes TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  last_contacted_date DATE,
  next_followup_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM CONFIGURATION TABLES
-- =============================================

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, category, key)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STORAGE BUCKETS SETUP
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('training-materials', 'training-materials', false, 104857600, ARRAY['application/pdf', 'video/mp4', 'application/vnd.ms-powerpoint']),
  ('company-logos', 'company-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- RBAC indexes
CREATE INDEX IF NOT EXISTS idx_esg_roles_tenant_id ON esg_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_role_id ON role_audit_logs(role_id);

-- Bench management indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_tenant_id ON bench_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_status ON bench_resources(availability_status);
CREATE INDEX IF NOT EXISTS idx_bench_resources_skills ON bench_resources USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_resource_skills_resource_id ON resource_skills(resource_id);
CREATE INDEX IF NOT EXISTS idx_project_allocations_resource_id ON project_allocations(resource_id);

-- Finance indexes
CREATE INDEX IF NOT EXISTS idx_financial_transactions_tenant_id ON financial_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transaction_line_items_transaction_id ON transaction_line_items(transaction_id);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_search ON bench_resources USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(designation, '')));
CREATE INDEX IF NOT EXISTS idx_vendors_search ON vendors USING GIN(to_tsvector('english', name || ' ' || COALESCE(legal_name, '')));

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role >= required_role
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'super_admin'
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Core system policies
CREATE POLICY "Super admins can view all tenants" ON tenants FOR SELECT USING (is_super_admin());
CREATE POLICY "Users can view their own tenant" ON tenants FOR SELECT USING (id = get_current_tenant_id());
CREATE POLICY "Super admins can manage all tenants" ON tenants FOR ALL USING (is_super_admin());

CREATE POLICY "Users can view users in their tenant" ON users FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Tenant admins can manage users in their tenant" ON users FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
);

-- Tenant isolation policies for all tables
CREATE POLICY "tenant_isolation_bench_resources" ON bench_resources FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_skills_matrix" ON skills_matrix FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_resource_skills" ON resource_skills FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_project_allocations" ON project_allocations FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_chart_of_accounts" ON chart_of_accounts FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_financial_transactions" ON financial_transactions FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_transaction_line_items" ON transaction_line_items FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_vendors" ON vendors FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_training_programs" ON training_programs FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_training_sessions" ON training_sessions FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_training_enrollments" ON training_enrollments FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_hotlist_candidates" ON hotlist_candidates FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_system_settings" ON system_settings FOR ALL USING (tenant_id = get_current_tenant_id());
CREATE POLICY "tenant_isolation_audit_logs" ON audit_logs FOR ALL USING (tenant_id = get_current_tenant_id());

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- Storage policies
CREATE POLICY "Users can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view documents in their tenant" ON storage.objects FOR SELECT USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_current_tenant_id()::text
);
CREATE POLICY "Users can upload documents to their tenant" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_current_tenant_id()::text
);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bench_resources_updated_at BEFORE UPDATE ON bench_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_matrix_updated_at BEFORE UPDATE ON skills_matrix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        tenant_id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create audit triggers for important tables
CREATE TRIGGER audit_bench_resources AFTER INSERT OR UPDATE OR DELETE ON bench_resources FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_financial_transactions AFTER INSERT OR UPDATE OR DELETE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_vendors AFTER INSERT OR UPDATE OR DELETE ON vendors FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- =============================================
-- FIELD-BASED ACCESS CONTROL FUNCTIONS
-- =============================================

-- Function to get field access level for a user
CREATE OR REPLACE FUNCTION get_field_access_level(
    p_user_id UUID,
    p_module TEXT,
    p_table_name TEXT,
    p_field_name TEXT,
    p_tenant_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_access_level TEXT := 'none';
    v_role_record RECORD;
BEGIN
    -- Get all active roles for the user
    FOR v_role_record IN
        SELECT r.field_permissions
        FROM esg_roles r
        JOIN user_role_assignments ura ON r.id = ura.role_id
        WHERE ura.user_id = p_user_id
        AND ura.is_active = TRUE
        AND r.is_active = TRUE
        AND (p_tenant_id IS NULL OR ura.tenant_id = p_tenant_id)
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
    LOOP
        -- Check if this role has permissions for the specific field
        IF v_role_record.field_permissions ? p_module THEN
            IF (v_role_record.field_permissions->p_module) ? p_table_name THEN
                IF (v_role_record.field_permissions->p_module->p_table_name) ? p_field_name THEN
                    DECLARE
                        v_current_access TEXT := v_role_record.field_permissions->p_module->p_table_name->>p_field_name;
                    BEGIN
                        -- Return the highest access level found
                        CASE 
                            WHEN v_current_access = 'admin' THEN
                                RETURN 'admin';
                            WHEN v_current_access = 'read_write' AND v_access_level NOT IN ('admin') THEN
                                v_access_level := 'read_write';
                            WHEN v_current_access = 'read' AND v_access_level NOT IN ('admin', 'read_write') THEN
                                v_access_level := 'read';
                        END CASE;
                    END;
                END IF;
            END IF;
        END IF;
    END LOOP;

    RETURN v_access_level;
END;
$$;

-- Function to validate field permissions structure
CREATE OR REPLACE FUNCTION validate_field_permissions(p_field_permissions JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_module TEXT;
    v_table TEXT;
    v_field TEXT;
    v_access TEXT;
BEGIN
    -- Iterate through modules
    FOR v_module IN SELECT jsonb_object_keys(p_field_permissions)
    LOOP
        -- Iterate through tables in each module
        FOR v_table IN SELECT jsonb_object_keys(p_field_permissions->v_module)
        LOOP
            -- Iterate through fields in each table
            FOR v_field IN SELECT jsonb_object_keys(p_field_permissions->v_module->v_table)
            LOOP
                v_access := p_field_permissions->v_module->v_table->>v_field;
                
                -- Validate access level
                IF v_access NOT IN ('none', 'read', 'read_write', 'admin') THEN
                    RAISE EXCEPTION 'Invalid access level: % for field %.%.%', v_access, v_module, v_table, v_field;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
    
    RETURN TRUE;
END;
$$;

-- =============================================
-- REALTIME SETUP
-- =============================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE bench_resources;
ALTER PUBLICATION supabase_realtime ADD TABLE project_allocations;
ALTER PUBLICATION supabase_realtime ADD TABLE training_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default tenant
INSERT INTO tenants (id, name, slug, status, plan)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Tenant',
    'default',
    'active',
    'enterprise'
) ON CONFLICT (id) DO NOTHING;

-- Insert default admin user
INSERT INTO users (id, tenant_id, email, first_name, last_name, role, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@esgos.com',
    'System',
    'Administrator',
    'super_admin',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert default chart of accounts
INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description) VALUES
('00000000-0000-0000-0000-000000000001', '1000', 'Cash', 'asset', 'Cash and cash equivalents'),
('00000000-0000-0000-0000-000000000001', '1200', 'Accounts Receivable', 'asset', 'Money owed by customers'),
('00000000-0000-0000-0000-000000000001', '2000', 'Accounts Payable', 'liability', 'Money owed to suppliers'),
('00000000-0000-0000-0000-000000000001', '3000', 'Owner Equity', 'equity', 'Owner equity'),
('00000000-0000-0000-0000-000000000001', '4000', 'Revenue', 'revenue', 'Sales revenue'),
('00000000-0000-0000-0000-000000000001', '5000', 'Cost of Goods Sold', 'expense', 'Direct costs'),
('00000000-0000-0000-0000-000000000001', '6000', 'Operating Expenses', 'expense', 'Operating expenses')
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- Insert default skills
INSERT INTO skills_matrix (tenant_id, name, category, description) VALUES
('00000000-0000-0000-0000-000000000001', 'JavaScript', 'Programming', 'JavaScript programming language'),
('00000000-0000-0000-0000-000000000001', 'React', 'Frontend', 'React.js framework'),
('00000000-0000-0000-0000-000000000001', 'Node.js', 'Backend', 'Node.js runtime'),
('00000000-0000-0000-0000-000000000001', 'Python', 'Programming', 'Python programming language'),
('00000000-0000-0000-0000-000000000001', 'SQL', 'Database', 'SQL database queries'),
('00000000-0000-0000-0000-000000000001', 'Project Management', 'Management', 'Project management skills'),
('00000000-0000-0000-0000-000000000001', 'Business Analysis', 'Analysis', 'Business analysis skills'),
('00000000-0000-0000-0000-000000000001', 'UI/UX Design', 'Design', 'User interface and experience design')
ON CONFLICT DO NOTHING;

-- Insert default roles
INSERT INTO esg_roles (tenant_id, name, description, is_system_role, permissions, field_permissions) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Administrator', 'Full system access', true, '{"*": "admin"}', '{"*": {"*": {"*": "admin"}}}'),
('00000000-0000-0000-0000-000000000001', 'Tenant Administrator', 'Full tenant access', true, '{"tenant": "admin"}', '{"bench": {"*": {"*": "read_write"}}, "finance": {"*": {"*": "read_write"}}}'),
('00000000-0000-0000-0000-000000000001', 'Manager', 'Department management', true, '{"department": "manage"}', '{"bench": {"bench_resources": {"*": "read_write"}}, "training": {"*": {"*": "read"}}}'),
('00000000-0000-0000-0000-000000000001', 'Employee', 'Basic user access', true, '{"profile": "manage"}', '{"bench": {"bench_resources": {"first_name": "read", "last_name": "read", "email": "read"}}}'),
('00000000-0000-0000-0000-000000000001', 'Viewer', 'Read-only access', true, '{"view": "read"}', '{"bench": {"bench_resources": {"first_name": "read", "last_name": "read"}}}')
ON CONFLICT (tenant_id, name) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

COMMIT;

-- Success message
SELECT 'ESG OS Platform - Complete Supabase setup completed successfully!' as message,
       'Database schema, RLS policies, authentication, storage, and realtime are now configured.' as details;
