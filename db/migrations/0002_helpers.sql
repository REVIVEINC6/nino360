-- 0002_helpers.sql
-- Helpers: extensions, functions, and helper data

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to enqueue rpa job safely
CREATE OR REPLACE FUNCTION enqueue_rpa_job(p_tenant uuid, p_type text, p_payload jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  job_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO rpa_jobs(id, tenant_id, type, payload, status)
  VALUES (job_id, p_tenant, p_type, p_payload, 'queued');
  PERFORM pg_notify('rpa_jobs', job_id::text);
  RETURN job_id;
END;
$$;

-- Notify trigger for contacts changes (realtime hook)
CREATE OR REPLACE FUNCTION notify_contacts_change() RETURNS trigger AS $$
DECLARE
  payload json;
BEGIN
  payload := json_build_object('id', NEW.id, 'tenant_id', NEW.tenant_id, 'action', TG_OP);
  PERFORM pg_notify('contacts_changes', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_notify_trigger
AFTER INSERT OR UPDATE OR DELETE ON contacts
FOR EACH ROW EXECUTE FUNCTION notify_contacts_change();

-- Sample field permissions seed (optional)
-- INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'admin');
-- INSERT INTO field_permissions (role_id, resource, field_name, permission) VALUES (...)
