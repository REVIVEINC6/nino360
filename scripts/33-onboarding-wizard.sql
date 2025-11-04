-- =====================================================
-- NINO360 Onboarding Wizard Support
-- Seed tables, onboarding progress tracking
-- =====================================================

-- Add profile column to tenants if not exists (for policies, etc.)
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{}'::jsonb;

-- Onboarding progress tracking
CREATE TABLE IF NOT EXISTS core.tenant_onboarding (
  tenant_id UUID PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  profile_completed BOOLEAN DEFAULT FALSE,
  branding_completed BOOLEAN DEFAULT FALSE,
  policies_completed BOOLEAN DEFAULT FALSE,
  integrations_completed BOOLEAN DEFAULT FALSE,
  import_completed BOOLEAN DEFAULT FALSE,
  roles_completed BOOLEAN DEFAULT FALSE,
  modules_completed BOOLEAN DEFAULT FALSE,
  invites_completed BOOLEAN DEFAULT FALSE,
  launched BOOLEAN DEFAULT FALSE,
  launched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed contacts table (for CSV import before CRM module is fully set up)
CREATE TABLE IF NOT EXISTS core.seed_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed candidates table (for CSV import before ATS module is fully set up)
CREATE TABLE IF NOT EXISTS core.seed_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  skills TEXT[],
  location TEXT,
  experience_years INTEGER,
  resume_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration connections (placeholder for onboarding)
CREATE TABLE IF NOT EXISTS core.tenant_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google_calendar', 'email', 'slack'
  status TEXT DEFAULT 'connected', -- 'connected', 'disconnected', 'error'
  config JSONB DEFAULT '{}'::jsonb,
  last_tested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, provider)
);

-- Enable RLS
ALTER TABLE core.tenant_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.seed_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.seed_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: tenant members can read, admins can write
CREATE POLICY onboarding_select ON core.tenant_onboarding
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = tenant_onboarding.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY onboarding_write ON core.tenant_onboarding
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_onboarding.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

CREATE POLICY seed_contacts_rls ON core.seed_contacts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = seed_contacts.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY seed_candidates_rls ON core.seed_candidates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = seed_candidates.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY integrations_select ON core.tenant_integrations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = tenant_integrations.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY integrations_write ON core.tenant_integrations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_integrations.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seed_contacts_tenant ON core.seed_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_seed_candidates_tenant ON core.seed_candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_tenant ON core.tenant_integrations(tenant_id);
