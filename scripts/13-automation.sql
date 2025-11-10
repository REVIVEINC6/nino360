-- Nino360 — Step 9: Notifications & Automation
-- Complete rules engine with alerting & workflow automation

-- Create all required schemas before using them
CREATE SCHEMA IF NOT EXISTS auto;
CREATE SCHEMA IF NOT EXISTS ats;
CREATE SCHEMA IF NOT EXISTS bench;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS vms;
CREATE SCHEMA IF NOT EXISTS proj;
-- Added sec schema creation
CREATE SCHEMA IF NOT EXISTS sec;

-- Added security helper functions that are used later in the script
CREATE OR REPLACE FUNCTION sec.current_tenant_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb->>'tenant_id')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

CREATE OR REPLACE FUNCTION sec.current_user_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

-- The function is defined in other scripts (21-rbac-fbac-enhanced.sql) and is used by RLS policies

-- Added log_action function stub if it doesn't exist
CREATE OR REPLACE FUNCTION sec.log_action(
  _tenant_id UUID,
  _user_id UUID,
  _action TEXT,
  _resource TEXT,
  _payload JSONB
)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  -- This is a stub that will be replaced by the full audit logging system
  -- For now, it just prevents errors when called
  RAISE NOTICE 'Audit: % % by user % on tenant %', _action, _resource, _user_id, _tenant_id;
END;
$$;

-- =====================
-- Channels & Settings
-- =====================
CREATE TABLE IF NOT EXISTS auto.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('email','slack','teams','sms','webhook')),
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_channels_tenant ON auto.channels(tenant_id);

-- =====================
-- Rules
-- =====================
CREATE TABLE IF NOT EXISTS auto.rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- Trigger configuration
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('event','schedule')),
  event_key TEXT, -- e.g., 'ats.application.moved' or 'finance.invoice.due'
  schedule_rrule TEXT, -- e.g., 'RRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0;BYSECOND=0'
  
  -- Condition & templating
  condition_sql TEXT, -- SELECT rows to alert on; must include tenant_id filter
  template_title TEXT NOT NULL,
  template_body_md TEXT NOT NULL,
  
  -- Delivery configuration
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  channel_ids UUID[] DEFAULT '{}',
  throttle_seconds INT DEFAULT 900,
  digest_window_seconds INT DEFAULT 0,
  escalation_after_seconds INT DEFAULT 0,
  dedup_key_template TEXT DEFAULT '{{event_key}}:{{entity_id}}',
  
  created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rules_tenant ON auto.rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rules_enabled ON auto.rules(tenant_id, is_enabled) WHERE is_enabled = true;

-- =====================
-- Executions & Alerts
-- =====================
CREATE TABLE IF NOT EXISTS auto.executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  rule_id UUID NOT NULL REFERENCES auto.rules(id) ON DELETE CASCADE,
  trigger_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started','rendered','delivered','failed','skipped')),
  took_ms INT DEFAULT 0,
  result JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_executions_tenant_rule ON auto.executions(tenant_id, rule_id, created_at);

CREATE TABLE IF NOT EXISTS auto.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  rule_id UUID NOT NULL REFERENCES auto.rules(id) ON DELETE CASCADE,
  execution_id UUID REFERENCES auto.executions(id) ON DELETE SET NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  entity_id TEXT,
  dedup_key TEXT,
  digest_group TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','muted','snoozed')),
  sent_channels TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_rule ON auto.alerts(tenant_id, rule_id, created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_dedup ON auto.alerts(dedup_key) WHERE dedup_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_status ON auto.alerts(tenant_id, status, created_at);

-- =====================
-- Webhooks (Outgoing)
-- =====================
CREATE TABLE IF NOT EXISTS auto.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT, -- for HMAC SHA256
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_webhooks_tenant ON auto.webhooks(tenant_id);

-- Webhook deliveries (outbox pattern)
CREATE TABLE IF NOT EXISTS auto.outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  attempts INT DEFAULT 0,
  next_attempt_at TIMESTAMPTZ DEFAULT now(),
  last_error TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','delivered','failed'))
);
CREATE INDEX IF NOT EXISTS idx_outbox_tenant_topic ON auto.outbox(tenant_id, topic, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_outbox_next_attempt ON auto.outbox(next_attempt_at, status) WHERE status = 'pending';

-- =====================
-- RLS Policies
-- =====================
ALTER TABLE auto.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto.executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto.outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS channels_tenant_isolation ON auto.channels;
CREATE POLICY channels_tenant_isolation ON auto.channels
  FOR ALL USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS rules_tenant_isolation ON auto.rules;
CREATE POLICY rules_tenant_isolation ON auto.rules
  FOR ALL USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS executions_tenant_isolation ON auto.executions;
CREATE POLICY executions_tenant_isolation ON auto.executions
  FOR SELECT USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS alerts_tenant_isolation ON auto.alerts;
CREATE POLICY alerts_tenant_isolation ON auto.alerts
  FOR ALL USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS webhooks_tenant_isolation ON auto.webhooks;
CREATE POLICY webhooks_tenant_isolation ON auto.webhooks
  FOR ALL USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS outbox_tenant_isolation ON auto.outbox;
CREATE POLICY outbox_tenant_isolation ON auto.outbox
  FOR ALL USING (tenant_id = sec.current_tenant_id());

-- =====================
-- Event Capture Triggers
-- =====================

-- ATS: Application moved between stages
CREATE OR REPLACE FUNCTION auto.on_ats_application_moved()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO auto.outbox(tenant_id, topic, payload)
  VALUES (
    NEW.tenant_id,
    'ats.application.moved',
    jsonb_build_object(
      'application_id', NEW.id,
      'candidate_id', NEW.candidate_id,
      'job_id', NEW.job_id,
      'from_stage', OLD.stage_id,
      'to_stage', NEW.stage_id,
      'moved_at', now()
    )
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'ats' AND table_name = 'applications'
  ) THEN
    DROP TRIGGER IF EXISTS trg_auto_ats_application_moved ON ats.applications;
    CREATE TRIGGER trg_auto_ats_application_moved
      AFTER UPDATE OF stage_id ON ats.applications
      FOR EACH ROW
      WHEN (OLD.stage_id IS DISTINCT FROM NEW.stage_id)
      EXECUTE FUNCTION auto.on_ats_application_moved();
  END IF;
END $$;

-- Bench: Consultant status changed
CREATE OR REPLACE FUNCTION auto.on_bench_status_changed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO auto.outbox(tenant_id, topic, payload)
  VALUES (
    NEW.tenant_id,
    'bench.consultant.status_changed',
    jsonb_build_object(
      'consultant_id', NEW.id,
      'from_status', OLD.status,
      'to_status', NEW.status,
      'changed_at', now()
    )
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'bench' AND table_name = 'consultants'
  ) THEN
    DROP TRIGGER IF EXISTS trg_auto_bench_status_changed ON bench.consultants;
    CREATE TRIGGER trg_auto_bench_status_changed
      AFTER UPDATE OF status ON bench.consultants
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status)
      EXECUTE FUNCTION auto.on_bench_status_changed();
  END IF;
END $$;

-- Finance: Invoice status changed
CREATE OR REPLACE FUNCTION auto.on_finance_invoice_status_changed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO auto.outbox(tenant_id, topic, payload)
  VALUES (
    NEW.tenant_id,
    'finance.invoice.status_changed',
    jsonb_build_object(
      'invoice_id', NEW.id,
      'invoice_no', NEW.invoice_no,
      'from_status', OLD.status,
      'to_status', NEW.status,
      'total', NEW.total,
      'due_date', NEW.due_date,
      'changed_at', now()
    )
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'finance' AND table_name = 'invoices'
  ) THEN
    DROP TRIGGER IF EXISTS trg_auto_finance_invoice_status_changed ON finance.invoices;
    CREATE TRIGGER trg_auto_finance_invoice_status_changed
      AFTER UPDATE OF status ON finance.invoices
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status)
      EXECUTE FUNCTION auto.on_finance_invoice_status_changed();
  END IF;
END $$;

-- VMS: Compliance item expiring
CREATE OR REPLACE FUNCTION auto.on_vms_compliance_expiring()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= CURRENT_DATE + INTERVAL '15 days' THEN
    INSERT INTO auto.outbox(tenant_id, topic, payload)
    VALUES (
      NEW.tenant_id,
      'vms.compliance.expiring',
      jsonb_build_object(
        'compliance_id', NEW.id,
        'vendor_id', NEW.vendor_id,
        'key', NEW.key,
        'expires_at', NEW.expires_at,
        'checked_at', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'vms' AND table_name = 'compliance_items'
  ) THEN
    DROP TRIGGER IF EXISTS trg_auto_vms_compliance_expiring ON vms.compliance_items;
    CREATE TRIGGER trg_auto_vms_compliance_expiring
      AFTER INSERT OR UPDATE OF expires_at ON vms.compliance_items
      FOR EACH ROW
      EXECUTE FUNCTION auto.on_vms_compliance_expiring();
  END IF;
END $$;

-- Projects: Task status changed
CREATE OR REPLACE FUNCTION auto.on_project_task_status_changed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO auto.outbox(tenant_id, topic, payload)
  VALUES (
    NEW.tenant_id,
    'projects.task.status_changed',
    jsonb_build_object(
      'task_id', NEW.id,
      'project_id', NEW.project_id,
      'from_status', OLD.status,
      'to_status', NEW.status,
      'changed_at', now()
    )
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'proj' AND table_name = 'tasks'
  ) THEN
    DROP TRIGGER IF EXISTS trg_auto_project_task_status_changed ON proj.tasks;
    CREATE TRIGGER trg_auto_project_task_status_changed
      AFTER UPDATE OF status ON proj.tasks
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status)
      EXECUTE FUNCTION auto.on_project_task_status_changed();
  END IF;
END $$;

-- =====================
-- Audit Helper
-- =====================
CREATE OR REPLACE FUNCTION auto.audit(_action TEXT, _resource TEXT, _payload JSONB)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  SELECT sec.log_action(
    sec.current_tenant_id(),
    sec.current_user_id(),
    _action,
    _resource,
    _payload
  );
$$;

-- =====================
-- Seed Example Rules
-- =====================
-- These will be inserted per tenant during onboarding
-- Example: ATS Stalled Applications
-- INSERT INTO auto.rules (tenant_id, name, description, trigger_type, schedule_rrule, condition_sql, template_title, template_body_md, severity, throttle_seconds)
-- VALUES (
--   '<tenant_id>',
--   'ATS — Stage stalled > 5 days',
--   'Alert when applications have not moved for 5+ days',
--   'schedule',
--   'RRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0;BYSECOND=0',
--   'SELECT a.tenant_id, a.id as entity_id, j.title as job_title, now() - greatest(a.applied_at, coalesce(ev.created_at, a.applied_at)) as stalled FROM ats.applications a JOIN ats.jobs j on j.id=a.job_id LEFT JOIN (SELECT application_id, max(created_at) created_at FROM ats.application_events GROUP BY 1) ev on ev.application_id=a.id WHERE a.tenant_id = sec.current_tenant_id() AND a.status=''in_process'' AND now() - greatest(a.applied_at, coalesce(ev.created_at, a.applied_at)) > interval ''5 days''',
--   'Stalled application on {{job_title}}',
--   'Candidate stuck for **{{stalled}}** — Review pipeline.',
--   'warning',
--   3600
-- );

COMMENT ON SCHEMA auto IS 'Nino360 Automation: Rules engine, alerts, webhooks, and workflow automation';
