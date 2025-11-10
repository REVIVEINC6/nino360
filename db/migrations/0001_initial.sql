-- 0001_initial.sql
-- Initial schema for nino360 contacts service

-- tenants (place in app schema)
CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  plan TEXT,
  created_at timestamptz DEFAULT now()
);

-- users (app schema)
CREATE TABLE IF NOT EXISTS app.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at timestamptz DEFAULT now()
);

-- roles
-- NOTE: roles are defined in app schema in 0001_init.sql; keep these commented to avoid duplicate definitions
/*
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT
);

-- role_permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL
);

-- field_permissions
CREATE TABLE field_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  field_name TEXT NOT NULL,
  permission TEXT NOT NULL -- hidden|masked|read|write
);
*/

-- contacts (exact SQL block required)
-- contacts -> crm schema
CREATE SCHEMA IF NOT EXISTS crm;

CREATE TABLE IF NOT EXISTS crm.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  owner_user_id UUID REFERENCES app.users(id),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  title TEXT,
  company TEXT,
  company_domain TEXT,
  emails jsonb DEFAULT '[]'::jsonb,       -- list of {email, verified, source, confidence}
  phones jsonb DEFAULT '[]'::jsonb,       -- list of {phone, e164, verified, source}
  linkedin_url TEXT,
  source TEXT,                            -- 'manual','csv','linkedin','import'
  tags TEXT[],
  score FLOAT DEFAULT 0.0,
  data jsonb DEFAULT '{}' ,               -- flexible extra fields
  search_vector tsvector,
  created_by UUID REFERENCES app.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_tenant ON crm.contacts (tenant_id);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON crm.contacts USING gin ((emails));
CREATE INDEX IF NOT EXISTS contacts_search_idx ON crm.contacts USING gin(search_vector);

-- contact_candidates
CREATE TABLE IF NOT EXISTS crm.contact_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  raw jsonb,
  parsed_profile jsonb,
  source TEXT,
  status TEXT DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- ai_enrichments
CREATE TABLE IF NOT EXISTS crm.ai_enrichments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm.contacts(id),
  input jsonb,
  output jsonb,
  model TEXT,
  status TEXT DEFAULT 'queued',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- rpa_jobs (DB-based job queue)
CREATE TABLE IF NOT EXISTS app.rpa_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload jsonb,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  run_after timestamptz DEFAULT now(),
  status TEXT DEFAULT 'queued', -- queued, processing, failed, done
  locked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_error TEXT
);

-- blockchain_anchors
CREATE TABLE IF NOT EXISTS app.blockchain_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  resource_type TEXT,
  resource_id UUID,
  hash TEXT,
  provider TEXT,
  tx_id TEXT,
  created_at timestamptz DEFAULT now()
);

-- attachments
CREATE TABLE IF NOT EXISTS crm.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm.contacts(id),
  filename TEXT,
  mime TEXT,
  size INT,
  url TEXT,
  created_at timestamptz DEFAULT now()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS app.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  diff jsonb,
  created_at timestamptz DEFAULT now()
);

-- contact_history for merges/edits
CREATE TABLE IF NOT EXISTS crm.contact_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES app.tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm.contacts(id),
  event_type TEXT,
  payload jsonb,
  created_by UUID,
  created_at timestamptz DEFAULT now()
);

-- Search vector trigger to keep search_vector up-to-date
CREATE FUNCTION contacts_search_vector_trigger() RETURNS trigger AS $$
begin
  new.search_vector := to_tsvector('english', coalesce(new.full_name,'') || ' ' || coalesce(new.company,'') || ' ' || coalesce(new.title,''));
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_search_vector_update
BEFORE INSERT OR UPDATE ON crm.contacts
FOR EACH ROW EXECUTE FUNCTION contacts_search_vector_trigger();

-- RLS policy examples (tenant isolation)
-- Ensure jwt.claims.tenant_id is set in the DB session

-- Enable RLS on contacts
ALTER TABLE crm.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY contacts_tenant_isolation ON crm.contacts
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

-- Similar for contact_candidates
ALTER TABLE crm.contact_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY candidates_tenant_isolation ON crm.contact_candidates
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);
