-- 002_crm_contacts.sql
-- Add CRM accounts, contacts, activities, lists, files and RLS policies

-- Ensure required schema and extensions exist before creating objects
CREATE SCHEMA IF NOT EXISTS crm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- accounts
CREATE TABLE IF NOT EXISTS crm.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  domain text,
  industry text,
  employees int,
  owner_id uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_accounts_tenant ON crm.accounts(tenant_id);

-- contacts
CREATE TABLE IF NOT EXISTS crm.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  account_id uuid REFERENCES crm.accounts(id) ON DELETE SET NULL,
  owner_id uuid,
  created_by uuid,
  first_name text,
  last_name text,
  title text,
  email text,
  phone text,
  mobile text,
  linkedin_url text,
  twitter_url text,
  website text,
  address jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  marketing_opt_in boolean DEFAULT false,
  do_not_call boolean DEFAULT false,
  do_not_email boolean DEFAULT false,
  last_engaged_at timestamptz,
  health_score int DEFAULT 50,
  enrichment jsonb DEFAULT '{}'::jsonb,
  dedupe_key text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_tenant ON crm.contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_account ON crm.contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_owner ON crm.contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm.contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_dedupe ON crm.contacts(dedupe_key);

-- activities
CREATE TABLE IF NOT EXISTS crm.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  type text NOT NULL,
  ts timestamptz DEFAULT now(),
  subject text,
  data jsonb DEFAULT '{}'::jsonb,
  owner_id uuid
);
CREATE INDEX IF NOT EXISTS idx_crm_activities_tenant ON crm.activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_entity ON crm.activities(entity_type, entity_id);

-- contact lists
CREATE TABLE IF NOT EXISTS crm.contact_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'static' CHECK (kind IN ('static','segment')),
  definition jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_contact_lists_tenant ON crm.contact_lists(tenant_id);

CREATE TABLE IF NOT EXISTS crm.contact_list_members (
  list_id uuid REFERENCES crm.contact_lists(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm.contacts(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  PRIMARY KEY (list_id, contact_id)
);
CREATE INDEX IF NOT EXISTS idx_crm_list_members_tenant ON crm.contact_list_members(tenant_id);

-- contact files
CREATE TABLE IF NOT EXISTS crm.contact_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm.contacts(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  name text,
  size_bytes int,
  mime text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_contact_files_tenant ON crm.contact_files(tenant_id);

-- RLS enable
ALTER TABLE crm.accounts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.contacts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.activities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.contact_lists         ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.contact_list_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.contact_files         ENABLE ROW LEVEL SECURITY;

-- Policies using app.current_tenant_id() helper; if not present, use jwt.claims
DO $$
BEGIN
  IF (SELECT to_regclass('app.current_tenant_id')) IS NOT NULL THEN
    EXECUTE 'CREATE POLICY acc_rls ON crm.accounts FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
    EXECUTE 'CREATE POLICY con_rls ON crm.contacts FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
    EXECUTE 'CREATE POLICY act_rls ON crm.activities FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
    EXECUTE 'CREATE POLICY cl_rls ON crm.contact_lists FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
    EXECUTE 'CREATE POLICY clm_rls ON crm.contact_list_members FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
    EXECUTE 'CREATE POLICY files_rls ON crm.contact_files FOR ALL USING (tenant_id = app.current_tenant_id()) WITH CHECK (tenant_id = app.current_tenant_id());';
  ELSE
    EXECUTE 'CREATE POLICY acc_rls ON crm.accounts FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
    EXECUTE 'CREATE POLICY con_rls ON crm.contacts FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
    EXECUTE 'CREATE POLICY act_rls ON crm.activities FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
    EXECUTE 'CREATE POLICY cl_rls ON crm.contact_lists FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
    EXECUTE 'CREATE POLICY clm_rls ON crm.contact_list_members FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
    EXECUTE 'CREATE POLICY files_rls ON crm.contact_files FOR ALL USING (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid) WITH CHECK (tenant_id = current_setting(''jwt.claims.tenant_id'')::uuid);';
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- policies already exist, ignore
  RAISE NOTICE 'CRM RLS policies already exist';
END
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION crm_update_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS crm_contacts_updated_at ON crm.contacts;
CREATE TRIGGER crm_contacts_updated_at BEFORE UPDATE ON crm.contacts FOR EACH ROW EXECUTE FUNCTION crm_update_updated_at();
