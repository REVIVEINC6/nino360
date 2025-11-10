-- =====================================================
-- NINO360 Step 3: Tenant Admin Module
-- Tenant Settings, Branding, Billing, Locales, Email Templates
-- =====================================================

-- Create billing schema if not exists
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS comm;

-- TENANT SETTINGS
CREATE TABLE IF NOT EXISTS core.tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  legal_name text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  country text,
  zipcode text,
  website text,
  timezone text NOT NULL DEFAULT 'UTC',
  locale text NOT NULL DEFAULT 'en-US',
  fiscal_year_start int2 NOT NULL DEFAULT 4, -- April
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- TENANT BRANDING
CREATE TABLE IF NOT EXISTS core.tenant_branding (
  tenant_id uuid PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#111827',
  secondary_color text DEFAULT '#2563eb',
  accent_color text DEFAULT '#10b981',
  dark_mode boolean DEFAULT true,
  login_bg_url text,
  email_brand_header text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- TENANT BILLING
CREATE TABLE IF NOT EXISTS billing.tenant_billing (
  tenant_id uuid PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  provider text DEFAULT 'stripe',
  customer_id text,
  subscription_id text,
  plan_key text DEFAULT 'pro',
  status text DEFAULT 'active',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- TENANT LOCALES
CREATE TABLE IF NOT EXISTS core.tenant_locales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  locale text NOT NULL,
  timezone text NOT NULL,
  currency text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tenant_locales_tenant ON core.tenant_locales(tenant_id);

-- EMAIL TEMPLATES (per tenant)
CREATE TABLE IF NOT EXISTS comm.email_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  key text NOT NULL, -- invite, reset_password, invoice_due
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, key)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE core.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.tenant_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm.email_templates ENABLE ROW LEVEL SECURITY;

-- Tenant Settings: Members can read, admins can write
CREATE POLICY ts_select ON core.tenant_settings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = tenant_settings.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY ts_write ON core.tenant_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_settings.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- Tenant Branding: Members can read, admins can write
CREATE POLICY tb_select ON core.tenant_branding
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = tenant_branding.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY tb_write ON core.tenant_branding
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_branding.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- Billing: Finance and admins only
CREATE POLICY bill_select ON billing.tenant_billing
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_billing.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin','finance')
  )
);

CREATE POLICY bill_write ON billing.tenant_billing
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_billing.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin','finance')
  )
);

-- Tenant Locales: Members read, admins write
CREATE POLICY tl_select ON core.tenant_locales
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = tenant_locales.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY tl_write ON core.tenant_locales
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = tenant_locales.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- Email Templates: Members read, admins write
CREATE POLICY et_select ON comm.email_templates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut 
    WHERE ut.tenant_id = email_templates.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY et_write ON comm.email_templates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = email_templates.tenant_id 
    AND ur.user_id = sec.current_user_id()
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Upsert tenant settings with audit
CREATE OR REPLACE FUNCTION public.upsert_tenant_settings(_row jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE 
  _t uuid; 
  _r jsonb; 
BEGIN
  _t := (_row->>'tenant_id')::uuid;
  
  INSERT INTO core.tenant_settings AS ts(
    tenant_id, legal_name, address_line1, address_line2, city, state, 
    country, zipcode, website, timezone, locale, fiscal_year_start, currency
  )
  VALUES (
    _t,
    _row->>'legal_name', 
    _row->>'address_line1', 
    _row->>'address_line2',
    _row->>'city', 
    _row->>'state', 
    _row->>'country', 
    _row->>'zipcode',
    _row->>'website', 
    COALESCE(_row->>'timezone','UTC'), 
    COALESCE(_row->>'locale','en-US'),
    COALESCE((_row->>'fiscal_year_start')::smallint, 4), 
    COALESCE(_row->>'currency','USD')
  )
  ON CONFLICT (tenant_id) DO UPDATE SET
    legal_name = EXCLUDED.legal_name,
    address_line1 = EXCLUDED.address_line1,
    address_line2 = EXCLUDED.address_line2,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    country = EXCLUDED.country,
    zipcode = EXCLUDED.zipcode,
    website = EXCLUDED.website,
    timezone = EXCLUDED.timezone,
    locale = EXCLUDED.locale,
    fiscal_year_start = EXCLUDED.fiscal_year_start,
    currency = EXCLUDED.currency,
    updated_at = now()
  RETURNING row_to_json(ts)::jsonb INTO _r;

  PERFORM sec.audit('upsert','tenant_settings', _r);
  RETURN _r;
END $$;

REVOKE ALL ON FUNCTION public.upsert_tenant_settings(jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.upsert_tenant_settings(jsonb) TO authenticated;
