CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants and Users (create inside `app` schema to avoid ambiguity)
CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON app.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON app.users(email);

-- RBAC & Field-Level Access Control (FLAC)
CREATE TABLE IF NOT EXISTS app.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, key)
);

CREATE TABLE IF NOT EXISTS app.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  role_id UUID REFERENCES app.roles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, role_id, resource, permission)
);

CREATE TABLE IF NOT EXISTS app.field_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  field TEXT NOT NULL,
  permission TEXT NOT NULL CHECK (permission IN ('hidden','masked','read','write')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, resource, field)
);

-- Leads and related
CREATE TABLE IF NOT EXISTS app.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  owner_user_id UUID REFERENCES app.users(id),
  stage TEXT DEFAULT 'new',
  status TEXT DEFAULT 'open',
  score FLOAT DEFAULT 0,
  data jsonb DEFAULT '{}',
  search_vector tsvector,
  created_by UUID REFERENCES app.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON app.leads (tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON app.leads ((data->>'email'));
CREATE INDEX IF NOT EXISTS leads_search_idx ON app.leads USING gin(search_vector);

CREATE OR REPLACE FUNCTION leads_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector(coalesce((NEW.data->>'name'),'')), 'A') ||
    setweight(to_tsvector(coalesce((NEW.data->>'company'),'')), 'B') ||
    setweight(to_tsvector(coalesce((NEW.data->>'email'),'')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_search_vector BEFORE INSERT OR UPDATE
ON app.leads FOR EACH ROW EXECUTE PROCEDURE leads_search_vector_update();

CREATE TABLE IF NOT EXISTS app.lead_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  source_type TEXT,
  source_url TEXT,
  linkedin_url TEXT,
  raw_profile jsonb,
  parsed_profile jsonb,
  email TEXT,
  phone TEXT,
  email_valid boolean DEFAULT false,
  phone_valid boolean DEFAULT false,
  confidence float DEFAULT 0,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_candidates_tenant ON app.lead_candidates(tenant_id);

CREATE TABLE IF NOT EXISTS app.ai_enrichments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES app.leads(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  task_type TEXT,
  model TEXT,
  input jsonb,
  output jsonb,
  status TEXT DEFAULT 'queued',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_ai_enrichments_tenant ON app.ai_enrichments(tenant_id);

CREATE TABLE IF NOT EXISTS app.rpa_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  job_type TEXT,
  payload jsonb,
  status TEXT DEFAULT 'queued',
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rpa_jobs_tenant ON app.rpa_jobs(tenant_id);

CREATE TABLE IF NOT EXISTS app.blockchain_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  resource TEXT,
  resource_id UUID,
  anchor_hash TEXT NOT NULL,
  blockchain_tx jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blockchain_anchors_tenant ON app.blockchain_anchors(tenant_id);

CREATE TABLE IF NOT EXISTS app.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES app.leads(id) ON DELETE CASCADE,
  storage_path TEXT,
  filename TEXT,
  content_type TEXT,
  size BIGINT,
  created_by UUID REFERENCES app.users(id),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attachments_tenant ON app.attachments(tenant_id);

CREATE TABLE IF NOT EXISTS app.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  event TEXT,
  detail jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON app.audit_logs(tenant_id);

-- RLS enablement and tenant scoping policies
ALTER TABLE app.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.lead_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.ai_enrichments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.rpa_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.blockchain_anchors ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_select ON app.leads
FOR SELECT USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);
CREATE POLICY tenant_insert ON app.leads
FOR INSERT WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);
CREATE POLICY tenant_update ON app.leads
FOR UPDATE USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

CREATE POLICY tenant_select_candidates ON app.lead_candidates
FOR SELECT USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);
CREATE POLICY tenant_insert_candidates ON app.lead_candidates
FOR INSERT WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);
CREATE POLICY tenant_update_candidates ON app.lead_candidates
FOR UPDATE USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

-- Additional policies can mirror the above for other tables
