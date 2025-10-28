-- Nino360 — Step 5B: Vendor Management System (VMS)
-- Multi-Tenant Vendor Portal with full RLS isolation

-- Create VMS schemas
CREATE SCHEMA IF NOT EXISTS vms;
CREATE SCHEMA IF NOT EXISTS vend;

-- VENDOR ORGANIZATIONS (global to platform)
CREATE TABLE vms.vendor_orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VENDOR USERS (auth users also exist in core.users)
CREATE TABLE vms.vendor_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member','billing')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vendor_id)
);

-- MAP VENDOR ORGS to Nino360 CLIENT TENANTS
CREATE TABLE vms.tenant_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  onboarding_status TEXT DEFAULT 'invited' CHECK (onboarding_status IN ('invited','accepted','in_review','approved','blocked')),
  terms JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, vendor_id)
);
CREATE INDEX ON vms.tenant_vendors(tenant_id);
CREATE INDEX ON vms.tenant_vendors(vendor_id);

-- COMPLIANCE ARTIFACTS (per vendor per tenant)
CREATE TABLE vms.compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  title TEXT,
  file_url TEXT,
  mime TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired')),
  expires_at DATE,
  notes TEXT,
  uploaded_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, vendor_id, key)
);
CREATE INDEX ON vms.compliance_items(tenant_id, vendor_id);

-- RATE CARDS (per tenant-vendor)
CREATE TABLE vms.rate_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  location_region TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  min_bill NUMERIC(14,2) NOT NULL,
  max_bill NUMERIC(14,2) NOT NULL,
  pay_on_pay_pct NUMERIC(5,2) DEFAULT 0.0,
  notes TEXT,
  UNIQUE(tenant_id, vendor_id, role_title, location_region, currency)
);
CREATE INDEX ON vms.rate_cards(tenant_id, vendor_id);

-- JOB SYNC (mirror external VMS / client jobs)
CREATE TABLE vms.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vms.vendor_orgs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  location TEXT,
  employment_type TEXT,
  description TEXT,
  external_ref TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','on_hold','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON vms.jobs(tenant_id);

-- SUBMISSIONS (vendor → tenant for a job)
CREATE TABLE vms.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  job_id UUID REFERENCES vms.jobs(id) ON DELETE SET NULL,
  candidate JSONB NOT NULL,
  resume_url TEXT,
  bill_rate NUMERIC(14,2),
  pay_rate NUMERIC(14,2),
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','shortlisted','interview','rejected','offered','hired','withdrawn')),
  meta JSONB DEFAULT '{}'::JSONB,
  submitted_by UUID,
  owner_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON vms.submissions(tenant_id);
CREATE INDEX ON vms.submissions(vendor_id);

-- INVOICES (vendor → tenant)
CREATE TABLE vms.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vms.vendor_orgs(id) ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected','paid','void')),
  file_url TEXT,
  meta JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, vendor_id, invoice_no)
);
CREATE INDEX ON vms.invoices(tenant_id, vendor_id);

-- Enable RLS
ALTER TABLE vms.vendor_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.vendor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.tenant_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vms.invoices ENABLE ROW LEVEL SECURITY;

-- Helper function for vendor context
CREATE OR REPLACE FUNCTION vms.current_vendor_id() 
RETURNS UUID 
LANGUAGE SQL 
STABLE 
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::JSONB->>'vendor_id','')::UUID;
$$;

-- RLS POLICIES - Internal Tenant View/Write
CREATE POLICY orgs_internal_select ON vms.vendor_orgs FOR SELECT USING (
  EXISTS (SELECT 1 FROM core.user_tenants ut WHERE ut.user_id = sec.current_user_id())
);

CREATE POLICY orgs_internal_write ON vms.vendor_orgs FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id 
    WHERE ur.user_id = sec.current_user_id() 
    AND r.key IN ('master_admin','super_admin','admin')
  )
);

CREATE POLICY tv_select ON vms.tenant_vendors FOR SELECT USING (
  tenant_id = sec.current_tenant_id() OR vendor_id = vms.current_vendor_id()
);

CREATE POLICY tv_write_internal ON vms.tenant_vendors FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = sec.current_tenant_id() 
    AND ur.user_id = sec.current_user_id() 
    AND r.key IN ('master_admin','super_admin','admin','manager')
  )
);

-- Vendor Portal View/Write
CREATE POLICY vu_select ON vms.vendor_users FOR SELECT USING (
  vendor_id = vms.current_vendor_id() OR 
  EXISTS (SELECT 1 FROM core.user_tenants ut WHERE ut.user_id = sec.current_user_id())
);

CREATE POLICY vu_write ON vms.vendor_users FOR ALL USING (
  vendor_id = vms.current_vendor_id()
);

CREATE POLICY comp_select ON vms.compliance_items FOR SELECT USING (
  tenant_id = sec.current_tenant_id() OR vendor_id = vms.current_vendor_id()
);

CREATE POLICY comp_write_vendor ON vms.compliance_items FOR INSERT WITH CHECK (
  vendor_id = vms.current_vendor_id()
);

CREATE POLICY comp_write_internal ON vms.compliance_items FOR UPDATE USING (
  tenant_id = sec.current_tenant_id()
);

CREATE POLICY rc_select ON vms.rate_cards FOR SELECT USING (
  tenant_id = sec.current_tenant_id() OR vendor_id = vms.current_vendor_id()
);

CREATE POLICY rc_write_internal ON vms.rate_cards FOR ALL USING (
  tenant_id = sec.current_tenant_id()
);

CREATE POLICY jobs_select ON vms.jobs FOR SELECT USING (
  tenant_id = sec.current_tenant_id()
);

CREATE POLICY jobs_write_internal ON vms.jobs FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND EXISTS (
    SELECT 1 FROM core.user_roles ur 
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = sec.current_tenant_id() 
    AND ur.user_id = sec.current_user_id() 
    AND r.key IN ('master_admin','super_admin','admin','manager','recruiter')
  )
);

CREATE POLICY sub_select ON vms.submissions FOR SELECT USING (
  tenant_id = sec.current_tenant_id() OR vendor_id = vms.current_vendor_id()
);

CREATE POLICY sub_insert_vendor ON vms.submissions FOR INSERT WITH CHECK (
  vendor_id = vms.current_vendor_id()
);

CREATE POLICY sub_update_internal ON vms.submissions FOR UPDATE USING (
  tenant_id = sec.current_tenant_id()
);

CREATE POLICY inv_select ON vms.invoices FOR SELECT USING (
  tenant_id = sec.current_tenant_id() OR vendor_id = vms.current_vendor_id()
);

CREATE POLICY inv_write_vendor ON vms.invoices FOR INSERT WITH CHECK (
  vendor_id = vms.current_vendor_id()
);

CREATE POLICY inv_write_internal ON vms.invoices FOR UPDATE USING (
  tenant_id = sec.current_tenant_id()
);

-- Audit helper
CREATE OR REPLACE FUNCTION vms.audit(_action TEXT, _resource TEXT, _payload JSONB)
RETURNS VOID 
LANGUAGE SQL 
SECURITY DEFINER 
AS $$ 
  SELECT sec.log_action(
    COALESCE(sec.current_tenant_id(), '00000000-0000-0000-0000-000000000000'::UUID), 
    sec.current_user_id(), 
    _action, 
    _resource, 
    _payload
  ); 
$$;
