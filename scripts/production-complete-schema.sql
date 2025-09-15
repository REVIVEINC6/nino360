-- ESG OS Platform - Complete Production Database Schema
-- This script creates all tables, indexes, policies, and functions needed for production

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- CORE SYSTEM TABLES
-- =============================================

-- Tenants table (already exists, ensuring completeness)
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

-- Users table (enhanced)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget line items
CREATE TABLE IF NOT EXISTS budget_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  account_id UUID REFERENCES chart_of_accounts(id),
  category TEXT,
  budgeted_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0,
  variance DECIMAL(15,2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Vendor jobs/requirements
CREATE TABLE IF NOT EXISTS vendor_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT CHECK (job_type IN ('contract', 'permanent', 'temporary', 'project')),
  location TEXT,
  remote_allowed BOOLEAN DEFAULT false,
  required_skills JSONB DEFAULT '[]',
  experience_level TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'filled', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor performance tracking
CREATE TABLE IF NOT EXISTS vendor_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  evaluation_period_start DATE NOT NULL,
  evaluation_period_end DATE NOT NULL,
  quality_score DECIMAL(3,2) CHECK (quality_score BETWEEN 0 AND 5),
  delivery_score DECIMAL(3,2) CHECK (delivery_score BETWEEN 0 AND 5),
  communication_score DECIMAL(3,2) CHECK (communication_score BETWEEN 0 AND 5),
  cost_effectiveness_score DECIMAL(3,2) CHECK (cost_effectiveness_score BETWEEN 0 AND 5),
  overall_score DECIMAL(3,2) CHECK (overall_score BETWEEN 0 AND 5),
  feedback TEXT,
  improvement_areas JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  evaluated_by UUID REFERENCES users(id),
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

-- Hotlist requirements
CREATE TABLE IF NOT EXISTS hotlist_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  location TEXT,
  remote_allowed BOOLEAN DEFAULT false,
  job_type TEXT CHECK (job_type IN ('contract', 'permanent', 'contract_to_hire')),
  required_skills JSONB DEFAULT '[]',
  preferred_skills JSONB DEFAULT '[]',
  experience_min INTEGER,
  experience_max INTEGER,
  education_requirements JSONB DEFAULT '[]',
  certifications_required JSONB DEFAULT '[]',
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  visa_requirements TEXT,
  start_date DATE,
  duration_months INTEGER,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'filled', 'on_hold', 'cancelled')),
  assigned_recruiter UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidate requirement matching
CREATE TABLE IF NOT EXISTS candidate_requirement_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES hotlist_candidates(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES hotlist_requirements(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) CHECK (match_score BETWEEN 0 AND 100),
  skills_match_percentage DECIMAL(5,2),
  experience_match BOOLEAN DEFAULT false,
  location_match BOOLEAN DEFAULT false,
  salary_match BOOLEAN DEFAULT false,
  availability_match BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'potential' CHECK (status IN ('potential', 'submitted', 'interviewing', 'selected', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(candidate_id, requirement_id)
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
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Bench management indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_tenant_id ON bench_resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bench_resources_status ON bench_resources(availability_status);
CREATE INDEX IF NOT EXISTS idx_bench_resources_skills ON bench_resources USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_resource_skills_resource_id ON resource_skills(resource_id);
CREATE INDEX IF NOT EXISTS idx_project_allocations_resource_id ON project_allocations(resource_id);
CREATE INDEX IF NOT EXISTS idx_project_allocations_dates ON project_allocations(start_date, end_date);

-- Finance indexes
CREATE INDEX IF NOT EXISTS idx_financial_transactions_tenant_id ON financial_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transaction_line_items_transaction_id ON transaction_line_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_budgets_tenant_id ON budgets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget_id ON budget_line_items(budget_id);

-- VMS indexes
CREATE INDEX IF NOT EXISTS idx_vendors_tenant_id ON vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendor_jobs_vendor_id ON vendor_jobs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_jobs_status ON vendor_jobs(status);
CREATE INDEX IF NOT EXISTS idx_vendor_performance_vendor_id ON vendor_performance(vendor_id);

-- Training indexes
CREATE INDEX IF NOT EXISTS idx_training_programs_tenant_id ON training_programs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_program_id ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_session_id ON training_enrollments(session_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_user_id ON training_enrollments(user_id);

-- Hotlist indexes
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_tenant_id ON hotlist_candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_status ON hotlist_candidates(status);
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_skills ON hotlist_candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_hotlist_requirements_tenant_id ON hotlist_requirements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hotlist_requirements_status ON hotlist_requirements(status);
CREATE INDEX IF NOT EXISTS idx_candidate_matches_candidate_id ON candidate_requirement_matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_matches_requirement_id ON candidate_requirement_matches(requirement_id);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_tenant_id ON system_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_bench_resources_search ON bench_resources USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(designation, '')));
CREATE INDEX IF NOT EXISTS idx_vendors_search ON vendors USING GIN(to_tsvector('english', name || ' ' || COALESCE(legal_name, '')));
CREATE INDEX IF NOT EXISTS idx_hotlist_candidates_search ON hotlist_candidates USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(current_title, '')));

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotlist_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_requirement_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_users ON users FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_bench_resources ON bench_resources FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_skills_matrix ON skills_matrix FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_resource_skills ON resource_skills FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_project_allocations ON project_allocations FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_chart_of_accounts ON chart_of_accounts FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_financial_transactions ON financial_transactions FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_transaction_line_items ON transaction_line_items FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_budgets ON budgets FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_budget_line_items ON budget_line_items FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_vendors ON vendors FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_vendor_jobs ON vendor_jobs FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_vendor_performance ON vendor_performance FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_training_programs ON training_programs FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_training_sessions ON training_sessions FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_training_enrollments ON training_enrollments FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_hotlist_candidates ON hotlist_candidates FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_hotlist_requirements ON hotlist_requirements FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_candidate_requirement_matches ON candidate_requirement_matches FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_system_settings ON system_settings FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_audit_logs ON audit_logs FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_notifications ON notifications FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

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
CREATE TRIGGER update_resource_skills_updated_at BEFORE UPDATE ON resource_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_allocations_updated_at BEFORE UPDATE ON project_allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_line_items_updated_at BEFORE UPDATE ON budget_line_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_jobs_updated_at BEFORE UPDATE ON vendor_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_performance_updated_at BEFORE UPDATE ON vendor_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_enrollments_updated_at BEFORE UPDATE ON training_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotlist_candidates_updated_at BEFORE UPDATE ON hotlist_candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotlist_requirements_updated_at BEFORE UPDATE ON hotlist_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_requirement_matches_updated_at BEFORE UPDATE ON candidate_requirement_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
        current_setting('app.current_user_id', true)::UUID,
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
CREATE TRIGGER audit_project_allocations AFTER INSERT OR UPDATE OR DELETE ON project_allocations FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_financial_transactions AFTER INSERT OR UPDATE OR DELETE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_vendors AFTER INSERT OR UPDATE OR DELETE ON vendors FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_hotlist_candidates AFTER INSERT OR UPDATE OR DELETE ON hotlist_candidates FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_hotlist_requirements AFTER INSERT OR UPDATE OR DELETE ON hotlist_requirements FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- Function to calculate match scores
CREATE OR REPLACE FUNCTION calculate_candidate_match_score(
    candidate_skills JSONB,
    required_skills JSONB,
    candidate_experience INTEGER,
    required_experience_min INTEGER,
    required_experience_max INTEGER
) RETURNS DECIMAL AS $$
DECLARE
    skills_score DECIMAL := 0;
    experience_score DECIMAL := 0;
    total_score DECIMAL := 0;
BEGIN
    -- Calculate skills match (70% weight)
    IF jsonb_array_length(required_skills) > 0 THEN
        SELECT COUNT(*) * 100.0 / jsonb_array_length(required_skills)
        INTO skills_score
        FROM jsonb_array_elements_text(candidate_skills) cs
        WHERE cs = ANY(SELECT jsonb_array_elements_text(required_skills));
    ELSE
        skills_score := 100;
    END IF;
    
    -- Calculate experience match (30% weight)
    IF candidate_experience >= required_experience_min AND candidate_experience <= required_experience_max THEN
        experience_score := 100;
    ELSIF candidate_experience < required_experience_min THEN
        experience_score := GREATEST(0, 100 - (required_experience_min - candidate_experience) * 10);
    ELSE
        experience_score := GREATEST(0, 100 - (candidate_experience - required_experience_max) * 5);
    END IF;
    
    -- Calculate weighted total
    total_score := (skills_score * 0.7) + (experience_score * 0.3);
    
    RETURN LEAST(100, total_score);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default tenant if not exists
INSERT INTO tenants (id, name, slug, status, plan)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Tenant',
    'default',
    'active',
    'enterprise'
) ON CONFLICT (id) DO NOTHING;

-- Insert default admin user if not exists
INSERT INTO users (id, tenant_id, email, first_name, last_name, role, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@esgos.com',
    'System',
    'Administrator',
    'admin',
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

COMMIT;
