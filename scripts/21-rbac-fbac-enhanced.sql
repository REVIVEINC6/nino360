-- ============================================================================
-- NINO360 Step 1.1: Enhanced RBAC + FBAC (Features & Entitlements)
-- Feature-based access control with plans, role grants, and user overrides
-- ============================================================================

-- ============================================================================
-- FEATURES & PLANS
-- ============================================================================

-- Features table: Define all gated features in the system
CREATE TABLE IF NOT EXISTS core.features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- e.g., 'crm.pipeline', 'hrms.i9', 'reports.ai_copilot'
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL, -- 'crm', 'hrms', 'reports', etc.
  tier TEXT DEFAULT 'all', -- 'starter', 'pro', 'enterprise', 'all'
  is_guarded BOOLEAN DEFAULT TRUE, -- If true, requires explicit grant
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans table: Subscription plans
CREATE TABLE IF NOT EXISTS core.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'starter', 'pro', 'enterprise'
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan features: Which features are included in each plan
CREATE TABLE IF NOT EXISTS core.plan_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES core.plans(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES core.features(id) ON DELETE CASCADE,
  state BOOLEAN NOT NULL DEFAULT TRUE, -- enabled/disabled
  limits JSONB DEFAULT '{}'::jsonb, -- e.g., {"max_jobs": 10, "max_users": 50}
  UNIQUE(plan_id, feature_id)
);

-- Tenant plans: Which plan is active for each tenant
CREATE TABLE IF NOT EXISTS core.tenant_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES core.plans(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'trial', 'canceled')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: Only one active plan per tenant
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_plans_active 
ON core.tenant_plans(tenant_id, plan_id) 
WHERE status = 'active';

-- Role feature grants: Grant features to specific roles within a tenant
CREATE TABLE IF NOT EXISTS core.role_feature_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES core.features(id) ON DELETE CASCADE,
  state BOOLEAN NOT NULL DEFAULT TRUE,
  limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, role_id, feature_id)
);

-- User feature overrides: Override feature access for specific users
CREATE TABLE IF NOT EXISTS core.user_feature_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  feature_id UUID NOT NULL REFERENCES core.features(id) ON DELETE CASCADE,
  state BOOLEAN NOT NULL, -- true = enable, false = disable
  limits JSONB DEFAULT '{}'::jsonb,
  note TEXT, -- Reason for override
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id, feature_id)
);

-- ============================================================================
-- MODULE GATING (for navigation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'crm', 'hrms', 'finance', etc.
  name TEXT NOT NULL,
  path TEXT NOT NULL, -- '/crm', '/hrms', etc.
  icon TEXT, -- Icon name for UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core.module_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES core.modules(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES core.features(id) ON DELETE CASCADE,
  UNIQUE(module_id, feature_id)
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE core.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.role_feature_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_feature_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.module_features ENABLE ROW LEVEL SECURITY;

-- Features and plans are globally readable
CREATE POLICY features_select ON core.features FOR SELECT USING (TRUE);
CREATE POLICY plans_select ON core.plans FOR SELECT USING (TRUE);
CREATE POLICY plan_features_select ON core.plan_features FOR SELECT USING (TRUE);
CREATE POLICY modules_select ON core.modules FOR SELECT USING (TRUE);
CREATE POLICY module_features_select ON core.module_features FOR SELECT USING (TRUE);

-- Tenant plans: scoped by tenant
CREATE POLICY tenant_plans_select ON core.tenant_plans FOR SELECT 
USING (tenant_id = sec.current_tenant_id());

-- Role feature grants: scoped by tenant
CREATE POLICY role_grants_select ON core.role_feature_grants FOR SELECT 
USING (tenant_id = sec.current_tenant_id());

-- User feature overrides: scoped by tenant
CREATE POLICY user_overrides_select ON core.user_feature_overrides FOR SELECT 
USING (tenant_id = sec.current_tenant_id());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current user ID from JWT
CREATE OR REPLACE FUNCTION sec.current_user_id() 
RETURNS UUID STABLE LANGUAGE SQL AS $$
  SELECT auth.uid();
$$;

-- Get current tenant ID from JWT
CREATE OR REPLACE FUNCTION sec.current_tenant_id() 
RETURNS UUID STABLE LANGUAGE SQL AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::UUID;
$$;

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION sec.has_role(_role_key TEXT) 
RETURNS BOOLEAN STABLE LANGUAGE SQL AS $$
  SELECT EXISTS (
    SELECT 1
    FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.user_id = sec.current_user_id()
      AND ur.tenant_id = sec.current_tenant_id()
      AND r.key = _role_key
  );
$$;

-- Check if user has a specific permission
CREATE OR REPLACE FUNCTION sec.has_perm(_perm_key TEXT) 
RETURNS BOOLEAN STABLE LANGUAGE SQL AS $$
  SELECT EXISTS (
    SELECT 1
    FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    JOIN core.role_permissions rp ON rp.role_id = r.id
    JOIN core.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = sec.current_user_id()
      AND ur.tenant_id = sec.current_tenant_id()
      AND p.key = _perm_key
  );
$$;

-- Check if user has access to a feature (4-tier precedence)
-- Precedence: user_override → role_grant → tenant_plan → feature_default
CREATE OR REPLACE FUNCTION sec.has_feature(_feature_key TEXT) 
RETURNS BOOLEAN STABLE LANGUAGE SQL AS $$
  WITH f AS (
    SELECT id, is_guarded FROM core.features WHERE key = _feature_key
  ),
  -- Tier 1: User override (highest precedence)
  user_override AS (
    SELECT ufo.state 
    FROM core.user_feature_overrides ufo
    JOIN f ON ufo.feature_id = f.id
    WHERE ufo.tenant_id = sec.current_tenant_id()
      AND ufo.user_id = sec.current_user_id()
    LIMIT 1
  ),
  -- Tier 2: Role grant
  role_grant AS (
    SELECT rfg.state 
    FROM core.role_feature_grants rfg
    JOIN f ON rfg.feature_id = f.id
    JOIN core.user_roles ur ON ur.role_id = rfg.role_id
    WHERE rfg.tenant_id = sec.current_tenant_id()
      AND ur.user_id = sec.current_user_id()
      AND ur.tenant_id = sec.current_tenant_id()
    ORDER BY rfg.state DESC
    LIMIT 1
  ),
  -- Tier 3: Tenant plan
  tenant_plan AS (
    SELECT pf.state 
    FROM core.tenant_plans tp
    JOIN core.plan_features pf ON pf.plan_id = tp.plan_id
    JOIN f ON pf.feature_id = f.id
    WHERE tp.tenant_id = sec.current_tenant_id()
      AND tp.status = 'active'
    LIMIT 1
  )
  -- Tier 4: Feature default (if not guarded, allow by default)
  SELECT COALESCE(
    (SELECT state FROM user_override),
    (SELECT state FROM role_grant),
    (SELECT state FROM tenant_plan),
    (SELECT NOT is_guarded FROM f),
    FALSE
  );
$$;

-- Get feature limits for a user (with same precedence)
CREATE OR REPLACE FUNCTION sec.feature_limits(_feature_key TEXT) 
RETURNS JSONB STABLE LANGUAGE SQL AS $$
  WITH f AS (
    SELECT id FROM core.features WHERE key = _feature_key
  ),
  user_override AS (
    SELECT ufo.limits 
    FROM core.user_feature_overrides ufo 
    JOIN f ON ufo.feature_id = f.id
    WHERE ufo.tenant_id = sec.current_tenant_id() 
      AND ufo.user_id = sec.current_user_id() 
    LIMIT 1
  ),
  role_grant AS (
    SELECT rfg.limits 
    FROM core.role_feature_grants rfg
    JOIN f ON rfg.feature_id = f.id
    JOIN core.user_roles ur ON ur.role_id = rfg.role_id
    WHERE rfg.tenant_id = sec.current_tenant_id() 
      AND ur.user_id = sec.current_user_id()
      AND ur.tenant_id = sec.current_tenant_id()
    ORDER BY COALESCE((rfg.limits->>'priority')::int, 0) DESC 
    LIMIT 1
  ),
  tenant_plan AS (
    SELECT pf.limits 
    FROM core.tenant_plans tp
    JOIN core.plan_features pf ON pf.plan_id = tp.plan_id
    JOIN f ON pf.feature_id = f.id
    WHERE tp.tenant_id = sec.current_tenant_id() 
      AND tp.status = 'active' 
    LIMIT 1
  )
  SELECT COALESCE(
    (SELECT limits FROM user_override),
    (SELECT limits FROM role_grant),
    (SELECT limits FROM tenant_plan),
    '{}'::jsonb
  );
$$;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert plans
INSERT INTO core.plans (key, name, description) VALUES
  ('starter', 'Starter', 'Basic features for small teams'),
  ('pro', 'Professional', 'Advanced features for growing businesses'),
  ('enterprise', 'Enterprise', 'Full feature set with premium support')
ON CONFLICT (key) DO NOTHING;

-- Insert features
INSERT INTO core.features (key, name, module, tier, is_guarded, description) VALUES
  -- CRM Features
  ('crm.pipeline', 'CRM Pipeline', 'crm', 'pro', TRUE, 'Advanced pipeline management'),
  ('crm.automation', 'CRM Automation', 'crm', 'enterprise', TRUE, 'Automated workflows and triggers'),
  ('crm.analytics', 'CRM Analytics', 'crm', 'pro', TRUE, 'Advanced analytics and reporting'),
  
  -- HRMS Features
  ('hrms.i9', 'I-9 Compliance', 'hrms', 'pro', TRUE, 'I-9 verification and compliance tracking'),
  ('hrms.immigration', 'Immigration Tracking', 'hrms', 'pro', TRUE, 'Visa and immigration management'),
  ('hrms.payroll', 'Payroll Processing', 'hrms', 'enterprise', TRUE, 'Integrated payroll processing'),
  
  -- Reports Features
  ('reports.ai_copilot', 'AI Copilot', 'reports', 'enterprise', TRUE, 'AI-powered report generation'),
  ('reports.custom', 'Custom Reports', 'reports', 'pro', TRUE, 'Build custom reports'),
  ('reports.export', 'Report Export', 'reports', 'starter', FALSE, 'Export reports to CSV/PDF'),
  
  -- VMS Features
  ('vms.submissions', 'VMS Submissions', 'vms', 'pro', TRUE, 'Vendor submission management'),
  ('vms.compliance', 'VMS Compliance', 'vms', 'enterprise', TRUE, 'Vendor compliance tracking'),
  
  -- Marketplace Features
  ('marketplace.install', 'Install Apps', 'marketplace', 'enterprise', TRUE, 'Install marketplace applications'),
  
  -- Finance Features
  ('finance.ar', 'Accounts Receivable', 'finance', 'starter', FALSE, 'AR management'),
  ('finance.ap', 'Accounts Payable', 'finance', 'starter', FALSE, 'AP management'),
  ('finance.advanced', 'Advanced Finance', 'finance', 'enterprise', TRUE, 'Advanced financial features'),
  
  -- Training Features
  ('training.lms', 'Learning Management', 'training', 'pro', TRUE, 'LMS and training tracking'),
  ('training.certificates', 'Certificates', 'training', 'enterprise', TRUE, 'Certificate generation'),
  
  -- Hotlist Features
  ('hotlist.ai_matching', 'AI Matching', 'hotlist', 'enterprise', TRUE, 'AI-powered candidate matching'),
  ('hotlist.portal', 'External Portal', 'hotlist', 'pro', TRUE, 'Client/vendor portal access')
ON CONFLICT (key) DO NOTHING;

-- Map features to plans
INSERT INTO core.plan_features (plan_id, feature_id, state, limits) 
SELECT 
  p.id,
  f.id,
  TRUE,
  CASE 
    WHEN f.key = 'reports.custom' THEN '{"max_reports": 10}'::jsonb
    WHEN f.key = 'training.lms' THEN '{"max_courses": 50}'::jsonb
    ELSE '{}'::jsonb
  END
FROM core.plans p
CROSS JOIN core.features f
WHERE 
  (p.key = 'starter' AND f.tier IN ('starter', 'all'))
  OR (p.key = 'pro' AND f.tier IN ('starter', 'pro', 'all'))
  OR (p.key = 'enterprise') -- Enterprise gets everything
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- Insert modules for navigation gating
INSERT INTO core.modules (key, name, path, icon) VALUES
  ('dashboard', 'Dashboard', '/dashboard', 'LayoutDashboard'),
  ('admin', 'Admin', '/admin', 'Shield'),
  ('tenant', 'Tenant', '/tenant', 'Building'),
  ('crm', 'CRM', '/crm', 'Users'),
  ('talent', 'Talent', '/talent', 'Briefcase'),
  ('bench', 'Bench', '/bench', 'UserCheck'),
  ('vms', 'VMS', '/vms', 'Package'),
  ('finance', 'Finance', '/finance', 'DollarSign'),
  ('projects', 'Projects', '/projects', 'FolderKanban'),
  ('hrms', 'HRMS', '/hrms', 'UserCog'),
  ('training', 'Training', '/training', 'GraduationCap'),
  ('hotlist', 'Hotlist', '/hotlist', 'Zap'),
  ('reports', 'Reports', '/reports', 'BarChart'),
  ('automation', 'Automation', '/automation', 'Workflow')
ON CONFLICT (key) DO NOTHING;

-- Link modules to features (optional gating)
INSERT INTO core.module_features (module_id, feature_id)
SELECT m.id, f.id
FROM core.modules m
JOIN core.features f ON f.module = m.key
ON CONFLICT (module_id, feature_id) DO NOTHING;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_features_module ON core.features(module);
CREATE INDEX IF NOT EXISTS idx_features_tier ON core.features(tier);
CREATE INDEX IF NOT EXISTS idx_plan_features_plan ON core.plan_features(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_feature ON core.plan_features(feature_id);
CREATE INDEX IF NOT EXISTS idx_tenant_plans_tenant ON core.tenant_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_plans_status ON core.tenant_plans(status);
CREATE INDEX IF NOT EXISTS idx_role_grants_tenant_role ON core.role_feature_grants(tenant_id, role_id);
CREATE INDEX IF NOT EXISTS idx_role_grants_feature ON core.role_feature_grants(feature_id);
CREATE INDEX IF NOT EXISTS idx_user_overrides_tenant_user ON core.user_feature_overrides(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_user_overrides_feature ON core.user_feature_overrides(feature_id);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT ON core.features TO authenticated;
GRANT SELECT ON core.plans TO authenticated;
GRANT SELECT ON core.plan_features TO authenticated;
GRANT SELECT ON core.tenant_plans TO authenticated;
GRANT SELECT ON core.role_feature_grants TO authenticated;
GRANT SELECT ON core.user_feature_overrides TO authenticated;
GRANT SELECT ON core.modules TO authenticated;
GRANT SELECT ON core.module_features TO authenticated;

GRANT EXECUTE ON FUNCTION sec.current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION sec.current_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_perm(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.has_feature(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sec.feature_limits(TEXT) TO authenticated;
