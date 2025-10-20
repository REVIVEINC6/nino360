-- NINO360 Production Foundation — Step 1
-- Multi-tenant HRMS/ATS/VMS/Finance with RBAC + RLS

-- SCHEMAS
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS sec;
CREATE SCHEMA IF NOT EXISTS ai;

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- CORE TABLES
-- ============================================

-- Tenants (Organizations)
CREATE TABLE core.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]{3,}$'),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  logo_url TEXT,
  subscription_tier TEXT DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE core.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction: user <-> tenant (multi-tenant membership)
CREATE TABLE core.user_tenants (
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tenant_id)
);

-- ============================================
-- RBAC (Role-Based Access Control)
-- ============================================

CREATE TABLE core.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE core.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE core.role_permissions (
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES core.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE core.user_roles (
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  role_id UUID REFERENCES core.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, tenant_id, role_id)
);

-- ============================================
-- CRM MODULE
-- ============================================

CREATE TABLE core.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  address TEXT,
  status TEXT DEFAULT 'active',
  tier TEXT,
  account_manager_id UUID REFERENCES core.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.client_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES core.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TALENT (ATS) MODULE
-- ============================================

CREATE TABLE core.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  current_title TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  status TEXT DEFAULT 'new',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.job_requisitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES core.clients(id),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  employment_type TEXT,
  min_salary DECIMAL(12, 2),
  max_salary DECIMAL(12, 2),
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  skills_required TEXT[],
  recruiter_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  job_id UUID REFERENCES core.job_requisitions(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES core.candidates(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied',
  stage TEXT,
  applied_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

CREATE TABLE core.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  application_id UUID REFERENCES core.job_applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES core.candidates(id),
  job_id UUID REFERENCES core.job_requisitions(id),
  interview_type TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  interviewer_name TEXT,
  status TEXT DEFAULT 'scheduled',
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BENCH MODULE
-- ============================================

CREATE TABLE core.bench_consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES core.candidates(id),
  availability_date DATE NOT NULL,
  status TEXT DEFAULT 'available',
  skills TEXT[],
  hourly_rate DECIMAL(10, 2),
  location TEXT,
  remote_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VMS (VENDOR MANAGEMENT) MODULE
-- ============================================

CREATE TABLE core.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.vendor_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES core.vendors(id) ON DELETE CASCADE,
  contract_number TEXT UNIQUE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  contract_value DECIMAL(15, 2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS MODULE
-- ============================================

CREATE TABLE core.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES core.clients(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  project_manager_id UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.project_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES core.projects(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES core.bench_consultants(id),
  role TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  hourly_rate DECIMAL(10, 2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FINANCE MODULE
-- ============================================

CREATE TABLE core.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES core.clients(id),
  project_id UUID REFERENCES core.projects(id),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE core.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES core.projects(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES core.vendors(id) ON DELETE CASCADE,
  category TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  expense_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI / INSIGHTS
-- ============================================

CREATE TABLE ai.insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT / SECURITY
-- ============================================

CREATE TABLE sec.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SEED ROLES & PERMISSIONS
-- ============================================

INSERT INTO core.roles(key, label) VALUES
  ('master_admin', 'Master Admin'),
  ('super_admin', 'Super Admin'),
  ('admin', 'Admin'),
  ('manager', 'Manager'),
  ('recruiter', 'Recruiter'),
  ('finance', 'Finance'),
  ('viewer', 'Viewer')
ON CONFLICT (key) DO NOTHING;

INSERT INTO core.permissions(key, description) VALUES
  ('users.read', 'Read users'),
  ('users.write', 'Create/Update users'),
  ('tenants.write', 'Manage tenant settings'),
  ('finance.invoice.create', 'Create invoices'),
  ('finance.invoice.read', 'Read invoices'),
  ('crm.clients.read', 'Read clients'),
  ('crm.clients.write', 'Create/Update clients'),
  ('talent.candidates.read', 'Read candidates'),
  ('talent.candidates.write', 'Create/Update candidates')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_tenants_user ON core.user_tenants(user_id);
CREATE INDEX idx_user_tenants_tenant ON core.user_tenants(tenant_id);
CREATE INDEX idx_user_roles_user ON core.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant ON core.user_roles(tenant_id);
CREATE INDEX idx_clients_tenant ON core.clients(tenant_id);
CREATE INDEX idx_candidates_tenant ON core.candidates(tenant_id);
CREATE INDEX idx_candidates_skills ON core.candidates USING GIN(skills);
CREATE INDEX idx_jobs_tenant ON core.job_requisitions(tenant_id);
CREATE INDEX idx_projects_tenant ON core.projects(tenant_id);
CREATE INDEX idx_invoices_tenant ON core.invoices(tenant_id);
CREATE INDEX idx_audit_tenant ON sec.audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON sec.audit_logs(user_id);
CREATE INDEX idx_audit_resource ON sec.audit_logs(resource_type, resource_id);
