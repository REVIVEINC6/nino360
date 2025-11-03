-- ============================================================================
-- NINO360 Step 30: Lead Capture, Demo Booking, Billing & Onboarding
-- Complete end-to-end journey from lead to paying tenant
-- ============================================================================

-- ============================================================================
-- PUBLIC SCHEMA: LEADS & DEMO BOOKINGS
-- ============================================================================

-- Leads table (public schema for anonymous access via API)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company TEXT NOT NULL,
  size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  industry TEXT,
  phone TEXT,
  utm JSONB DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'demo_scheduled', 'converted', 'lost')),
  assigned_to UUID REFERENCES core.users(id) ON DELETE SET NULL,
  notes TEXT,
  UNIQUE(work_email)
);

-- Demo bookings table
CREATE TABLE IF NOT EXISTS public.demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  calendar_ref TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'no_show', 'canceled')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  UNIQUE(lead_id, starts_at)
);

-- ============================================================================
-- APP SCHEMA: ENHANCED TENANT MANAGEMENT
-- ============================================================================

-- Add missing columns to core.tenants if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'region'
  ) THEN
    ALTER TABLE core.tenants ADD COLUMN region TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE core.tenants ADD COLUMN timezone TEXT DEFAULT 'America/New_York';
  END IF;
END $$;

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS core.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  title TEXT,
  locale TEXT DEFAULT 'en',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant members table (replaces user_tenants with enhanced fields)
CREATE TABLE IF NOT EXISTS core.tenant_members (
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('tenant_admin', 'manager', 'member', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tenant_id, user_id)
);

-- ============================================================================
-- BILLING SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS bill;

-- Plans table
CREATE TABLE IF NOT EXISTS bill.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK (code IN ('free', 'pro', 'enterprise')),
  name TEXT NOT NULL,
  price_month NUMERIC(10, 2) DEFAULT 0,
  price_year NUMERIC(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  features JSONB DEFAULT '{}'::JSONB,
  limits JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS bill.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL REFERENCES bill.plans(code),
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  provider TEXT CHECK (provider IN ('stripe')),
  provider_sub_id TEXT,
  provider_customer_id TEXT,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS bill.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES bill.subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  provider TEXT CHECK (provider IN ('stripe')),
  provider_invoice_id TEXT,
  hosted_url TEXT,
  pdf_url TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS bill.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('stripe')),
  provider_payment_method_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'upi')),
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, provider_payment_method_id)
);

-- ============================================================================
-- AUDIT LOG ENHANCEMENTS
-- ============================================================================

-- Add hash chain columns to audit_logs if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'sec' AND table_name = 'audit_logs' AND column_name = 'prev_hash'
  ) THEN
    ALTER TABLE sec.audit_logs ADD COLUMN prev_hash TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'sec' AND table_name = 'audit_logs' AND column_name = 'hash'
  ) THEN
    ALTER TABLE sec.audit_logs ADD COLUMN hash TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'sec' AND table_name = 'audit_logs' AND column_name = 'entity'
  ) THEN
    ALTER TABLE sec.audit_logs ADD COLUMN entity TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'sec' AND table_name = 'audit_logs' AND column_name = 'entity_id'
  ) THEN
    ALTER TABLE sec.audit_logs ADD COLUMN entity_id TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'sec' AND table_name = 'audit_logs' AND column_name = 'diff'
  ) THEN
    ALTER TABLE sec.audit_logs ADD COLUMN diff JSONB DEFAULT '{}'::JSONB;
  END IF;
END $$;

-- ============================================================================
-- FEATURE FLAGS
-- ============================================================================

-- Feature flags table (if not exists from previous scripts)
CREATE TABLE IF NOT EXISTS core.feature_flags (
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tenant_id, key)
);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed plans
INSERT INTO bill.plans (code, name, price_month, price_year, currency, features, limits) VALUES
  ('free', 'Free', 0, 0, 'USD', 
   '{"modules": ["analytics-lite"], "users": 3}'::JSONB,
   '{"users": 3, "storage_gb": 1, "api_calls_per_month": 1000}'::JSONB),
  ('pro', 'Pro', 49, 490, 'USD',
   '{"modules": ["crm", "talent", "hrms", "finance", "automation", "trust"], "users": "unlimited", "sso": false}'::JSONB,
   '{"users": -1, "storage_gb": 100, "api_calls_per_month": 100000}'::JSONB),
  ('enterprise', 'Enterprise', 0, 0, 'USD',
   '{"modules": ["all"], "users": "unlimited", "sso": true, "saml": true, "sla": "24x7", "dedicated_support": true}'::JSONB,
   '{"users": -1, "storage_gb": 1000, "api_calls_per_month": -1}'::JSONB)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_month = EXCLUDED.price_month,
  price_year = EXCLUDED.price_year,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill.payment_methods ENABLE ROW LEVEL SECURITY;

-- Leads: Allow anonymous insert, authenticated read for assigned users
CREATE POLICY leads_insert ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY leads_select ON public.leads FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM core.user_roles WHERE user_id = auth.uid() AND role_id IN (
      SELECT id FROM core.roles WHERE key IN ('master_admin', 'super_admin', 'admin')
    ))
  )
);
CREATE POLICY leads_update ON public.leads FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM core.user_roles WHERE user_id = auth.uid() AND role_id IN (
      SELECT id FROM core.roles WHERE key IN ('master_admin', 'super_admin', 'admin')
    ))
  )
);

-- Demo bookings: Allow insert for leads, read for assigned users
CREATE POLICY demo_insert ON public.demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY demo_select ON public.demo_bookings FOR SELECT USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = demo_bookings.lead_id 
    AND (l.assigned_to = auth.uid() OR EXISTS (
      SELECT 1 FROM core.user_roles WHERE user_id = auth.uid() AND role_id IN (
        SELECT id FROM core.roles WHERE key IN ('master_admin', 'super_admin', 'admin')
      )
    ))
  )
);

-- User profiles: Users can read/update their own profile
CREATE POLICY profiles_select ON core.user_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY profiles_insert ON core.user_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY profiles_update ON core.user_profiles FOR UPDATE USING (user_id = auth.uid());

-- Tenant members: Read if member of tenant, write if admin
CREATE POLICY tm_select ON core.tenant_members FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM core.tenant_members WHERE user_id = auth.uid())
);
CREATE POLICY tm_insert ON core.tenant_members FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM core.tenant_members 
    WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'manager')
  )
);
CREATE POLICY tm_update ON core.tenant_members FOR UPDATE USING (
  tenant_id IN (
    SELECT tenant_id FROM core.tenant_members 
    WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'manager')
  )
);

-- Feature flags: Read if member, write if admin
CREATE POLICY ff_select ON core.feature_flags FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM core.tenant_members WHERE user_id = auth.uid())
);
CREATE POLICY ff_write ON core.feature_flags FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM core.tenant_members 
    WHERE user_id = auth.uid() AND role = 'tenant_admin'
  )
);

-- Plans: Public read
CREATE POLICY plans_select ON bill.plans FOR SELECT USING (true);

-- Subscriptions: Read if member of tenant
CREATE POLICY sub_select ON bill.subscriptions FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM core.tenant_members WHERE user_id = auth.uid())
);

-- Invoices: Read if member of tenant
CREATE POLICY inv_select ON bill.invoices FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM core.tenant_members WHERE user_id = auth.uid())
);

-- Payment methods: Read/write if admin of tenant
CREATE POLICY pm_select ON bill.payment_methods FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM core.tenant_members 
    WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'manager')
  )
);
CREATE POLICY pm_write ON bill.payment_methods FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM core.tenant_members 
    WHERE user_id = auth.uid() AND role = 'tenant_admin'
  )
);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get current tenant ID from JWT claims
CREATE OR REPLACE FUNCTION sec.current_tenant_id()
RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::UUID;
$$;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION sec.has_role(_role_key TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND ur.tenant_id = sec.current_tenant_id()
      AND r.key = _role_key
  );
$$;

-- Function to check if tenant has a feature enabled
CREATE OR REPLACE FUNCTION sec.has_feature(_feature_key TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(
    (SELECT enabled FROM core.feature_flags 
     WHERE tenant_id = sec.current_tenant_id() AND key = _feature_key),
    FALSE
  );
$$;

-- Function to get feature limits for tenant
CREATE OR REPLACE FUNCTION sec.feature_limits(_tenant_id UUID)
RETURNS JSONB LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(
    (SELECT limits FROM bill.plans p
     JOIN bill.subscriptions s ON s.plan_code = p.code
     WHERE s.tenant_id = _tenant_id
     LIMIT 1),
    '{}'::JSONB
  );
$$;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(work_email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_demo_lead ON public.demo_bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_demo_status ON public.demo_bookings(status);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON core.tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON core.tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON bill.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON bill.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON bill.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON bill.invoices(status);
CREATE INDEX IF NOT EXISTS idx_audit_hash ON sec.audit_logs(hash);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT ON bill.plans TO anon, authenticated;
GRANT SELECT, INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, INSERT ON public.demo_bookings TO anon, authenticated;
GRANT ALL ON core.user_profiles TO authenticated;
GRANT ALL ON core.tenant_members TO authenticated;
GRANT ALL ON core.feature_flags TO authenticated;
GRANT SELECT ON bill.subscriptions TO authenticated;
GRANT SELECT ON bill.invoices TO authenticated;
GRANT ALL ON bill.payment_methods TO authenticated;

GRANT EXECUTE ON FUNCTION sec.current_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_feature(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.feature_limits(UUID) TO authenticated;
