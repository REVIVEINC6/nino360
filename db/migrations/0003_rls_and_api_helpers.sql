-- 0003_rls_and_api_helpers.sql
-- Adds RLS helper functions, explicit RLS policies, and example seed roles/permissions

-- Helper: set search vector for contacts (if not already present)
CREATE OR REPLACE FUNCTION contacts_set_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.display_name,'') || ' ' || coalesce(NEW.first_name,'') || ' ' || coalesce(NEW.last_name,'') || ' ' || coalesce(NEW.email,'') || ' ' || coalesce(NEW.phone,'') || ' ' || coalesce(NEW.organization_name,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'contacts_search_vector_trigger'
  ) THEN
    CREATE TRIGGER contacts_search_vector_trigger
    BEFORE INSERT OR UPDATE ON crm.contacts
    FOR EACH ROW EXECUTE FUNCTION contacts_set_search_vector();
  END IF;
END$$;

-- RLS: make sure contacts are tenant-isolated using JWT claim tenant_id
ALTER TABLE IF EXISTS crm.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_tenant_isolation ON crm.contacts;
CREATE POLICY contacts_tenant_isolation ON crm.contacts
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

-- Example minimal roles and role_permissions seed (idempotent)
INSERT INTO app.roles (id, tenant_id, key, name, description, created_at)
SELECT gen_random_uuid(), t.id, 'crm_user', 'CRM User', 'Default CRM user role', now()
FROM app.tenants t
ON CONFLICT DO NOTHING;

-- role_permissions: give crm_user read access to contacts and view analytics example
INSERT INTO app.role_permissions (id, tenant_id, role_id, resource, permission, created_at)
SELECT gen_random_uuid(), t.id, r.id, 'contacts', 'read', now()
FROM app.tenants t
JOIN app.roles r ON r.tenant_id = t.id AND r.key = 'crm_user'
ON CONFLICT DO NOTHING;

-- Field-level permission example for contacts.email (mask for crm_user)
INSERT INTO app.field_permissions (id, tenant_id, resource, field, permission, created_at)
SELECT gen_random_uuid(), t.id, 'contacts', 'email', 'masked', now()
FROM app.tenants t
ON CONFLICT DO NOTHING;

-- Notify trigger for contacts (if not present)
CREATE OR REPLACE FUNCTION notify_contacts_change() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('contacts_changes', json_build_object('op', TG_OP, 'id', NEW.id)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'contacts_notify_trigger') THEN
      CREATE TRIGGER contacts_notify_trigger
      AFTER INSERT OR UPDATE OR DELETE ON crm.contacts
      FOR EACH ROW EXECUTE FUNCTION notify_contacts_change();
  END IF;
END$$;
