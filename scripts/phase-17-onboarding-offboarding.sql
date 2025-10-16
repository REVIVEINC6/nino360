-- Phase 17: Onboarding & Offboarding System
-- Template-driven checklists, SLA tracking, provisioning, assets, AI assists

-- Create hr schema if not exists
CREATE SCHEMA IF NOT EXISTS hr;

-- ============================================================================
-- TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS hr.onboarding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key text NOT NULL, -- e.g., 'corporate', 'engineering', 'sales', 'contractor'
  name text NOT NULL,
  description text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{key, title, owner_role, due_offset_days, required, subtasks[]}]
  owners jsonb NOT NULL DEFAULT '{}'::jsonb, -- {hr: uuid[], it: uuid[], manager: bool, employee: bool}
  sla jsonb NOT NULL DEFAULT '{}'::jsonb, -- {total_days: 30, critical_steps: ['i9', 'laptop']}
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, key)
);

CREATE TABLE IF NOT EXISTS hr.offboarding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key text NOT NULL,
  name text NOT NULL,
  description text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  owners jsonb NOT NULL DEFAULT '{}'::jsonb,
  sla jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, key)
);

-- ============================================================================
-- FLOWS
-- ============================================================================

CREATE TYPE hr.flow_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE');

CREATE TABLE IF NOT EXISTS hr.onboarding_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  template_id uuid REFERENCES hr.onboarding_templates(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  due_date date NOT NULL,
  status hr.flow_status NOT NULL DEFAULT 'NOT_STARTED',
  progress numeric(5,2) NOT NULL DEFAULT 0, -- 0-100
  owners jsonb NOT NULL DEFAULT '{}'::jsonb, -- {hr: uuid[], it: uuid[], manager: uuid, employee: uuid}
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb, -- {location, department, remote, etc}
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hr.offboarding_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  template_id uuid REFERENCES hr.offboarding_templates(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  due_date date NOT NULL,
  status hr.flow_status NOT NULL DEFAULT 'NOT_STARTED',
  progress numeric(5,2) NOT NULL DEFAULT 0,
  owners jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb, -- {reason, final_pay_date, exit_interview_date, etc}
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TASKS
-- ============================================================================

CREATE TYPE hr.flow_type AS ENUM ('ONBOARD', 'OFFBOARD');
CREATE TYPE hr.task_state AS ENUM ('OPEN', 'DONE', 'BLOCKED', 'SKIPPED');

CREATE TABLE IF NOT EXISTS hr.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  flow_type hr.flow_type NOT NULL,
  flow_id uuid NOT NULL, -- references onboarding_flows or offboarding_flows
  step_key text NOT NULL,
  title text NOT NULL,
  description text,
  owner_id uuid, -- references app.users(id)
  owner_role text, -- 'hr', 'it', 'manager', 'employee'
  due_at timestamptz,
  state hr.task_state NOT NULL DEFAULT 'OPEN',
  completed_at timestamptz,
  completed_by uuid, -- references app.users(id)
  notes text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{name, url, uploaded_at}]
  escalations int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- ASSETS & ACCESS
-- ============================================================================

CREATE TYPE hr.asset_kind AS ENUM ('LAPTOP', 'BADGE', 'PHONE', 'SOFTWARE', 'OTHER');
CREATE TYPE hr.asset_status AS ENUM ('ASSIGNED', 'LOST', 'BROKEN', 'RETURNED');

CREATE TABLE IF NOT EXISTS hr.badges_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  kind hr.asset_kind NOT NULL,
  name text NOT NULL,
  serial text,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  returned_at timestamptz,
  status hr.asset_status NOT NULL DEFAULT 'ASSIGNED',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hr.access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  system_key text NOT NULL, -- 'okta', 'github', 'slack', 'jira', etc
  role text, -- 'admin', 'user', 'viewer', etc
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PROVISIONING EVENTS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS identity;

CREATE TYPE identity.provider AS ENUM ('OKTA', 'AZURE_AD', 'GOOGLE', 'CUSTOM');
CREATE TYPE identity.action AS ENUM ('CREATE', 'UPDATE', 'DISABLE');
CREATE TYPE identity.event_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TABLE IF NOT EXISTS identity.provisioning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  provider identity.provider NOT NULL,
  action identity.action NOT NULL,
  ref text, -- external reference ID
  status identity.event_status NOT NULL DEFAULT 'PENDING',
  ts timestamptz NOT NULL DEFAULT now(),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_onboarding_templates_tenant ON hr.onboarding_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_templates_tenant ON hr.offboarding_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_flows_tenant ON hr.onboarding_flows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_flows_employee ON hr.onboarding_flows(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_flows_status ON hr.onboarding_flows(status);
CREATE INDEX IF NOT EXISTS idx_offboarding_flows_tenant ON hr.offboarding_flows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_flows_employee ON hr.offboarding_flows(employee_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_flows_status ON hr.offboarding_flows(status);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant ON hr.tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_flow ON hr.tasks(flow_type, flow_id);
CREATE INDEX IF NOT EXISTS idx_tasks_owner ON hr.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_state ON hr.tasks(state);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON hr.tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_badges_assets_tenant ON hr.badges_assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_badges_assets_employee ON hr.badges_assets(employee_id);
CREATE INDEX IF NOT EXISTS idx_badges_assets_status ON hr.badges_assets(status);
CREATE INDEX IF NOT EXISTS idx_access_grants_tenant ON hr.access_grants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_access_grants_employee ON hr.access_grants(employee_id);
CREATE INDEX IF NOT EXISTS idx_provisioning_events_tenant ON identity.provisioning_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_provisioning_events_employee ON identity.provisioning_events(employee_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE hr.onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.offboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.onboarding_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.offboarding_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.badges_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.provisioning_events ENABLE ROW LEVEL SECURITY;

-- Templates: tenant-scoped
CREATE POLICY onboarding_templates_tenant ON hr.onboarding_templates
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY offboarding_templates_tenant ON hr.offboarding_templates
  USING (tenant_id = sec.current_tenant_id());

-- Flows: tenant-scoped
CREATE POLICY onboarding_flows_tenant ON hr.onboarding_flows
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY offboarding_flows_tenant ON hr.offboarding_flows
  USING (tenant_id = sec.current_tenant_id());

-- Tasks: tenant-scoped
CREATE POLICY tasks_tenant ON hr.tasks
  USING (tenant_id = sec.current_tenant_id());

-- Assets: tenant-scoped
CREATE POLICY badges_assets_tenant ON hr.badges_assets
  USING (tenant_id = sec.current_tenant_id());

-- Access: tenant-scoped
CREATE POLICY access_grants_tenant ON hr.access_grants
  USING (tenant_id = sec.current_tenant_id());

-- Provisioning: tenant-scoped
CREATE POLICY provisioning_events_tenant ON identity.provisioning_events
  USING (tenant_id = sec.current_tenant_id());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at on templates
CREATE OR REPLACE FUNCTION hr.update_template_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER onboarding_templates_updated
  BEFORE UPDATE ON hr.onboarding_templates
  FOR EACH ROW EXECUTE FUNCTION hr.update_template_timestamp();

CREATE TRIGGER offboarding_templates_updated
  BEFORE UPDATE ON hr.offboarding_templates
  FOR EACH ROW EXECUTE FUNCTION hr.update_template_timestamp();

-- Update updated_at on flows
CREATE OR REPLACE FUNCTION hr.update_flow_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER onboarding_flows_updated
  BEFORE UPDATE ON hr.onboarding_flows
  FOR EACH ROW EXECUTE FUNCTION hr.update_flow_timestamp();

CREATE TRIGGER offboarding_flows_updated
  BEFORE UPDATE ON hr.offboarding_flows
  FOR EACH ROW EXECUTE FUNCTION hr.update_flow_timestamp();

-- Update updated_at on tasks
CREATE OR REPLACE FUNCTION hr.update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated
  BEFORE UPDATE ON hr.tasks
  FOR EACH ROW EXECUTE FUNCTION hr.update_task_timestamp();

-- Update flow progress when tasks change
CREATE OR REPLACE FUNCTION hr.update_flow_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total int;
  v_done int;
  v_progress numeric;
  v_status hr.flow_status;
BEGIN
  -- Count total and done tasks for this flow
  SELECT COUNT(*), COUNT(*) FILTER (WHERE state = 'DONE')
  INTO v_total, v_done
  FROM hr.tasks
  WHERE flow_type = NEW.flow_type AND flow_id = NEW.flow_id;

  -- Calculate progress
  IF v_total > 0 THEN
    v_progress := (v_done::numeric / v_total::numeric) * 100;
  ELSE
    v_progress := 0;
  END IF;

  -- Determine status
  IF v_progress = 100 THEN
    v_status := 'DONE';
  ELSIF v_progress > 0 THEN
    v_status := 'IN_PROGRESS';
  ELSE
    v_status := 'NOT_STARTED';
  END IF;

  -- Update the flow
  IF NEW.flow_type = 'ONBOARD' THEN
    UPDATE hr.onboarding_flows
    SET progress = v_progress, status = v_status
    WHERE id = NEW.flow_id;
  ELSE
    UPDATE hr.offboarding_flows
    SET progress = v_progress, status = v_status
    WHERE id = NEW.flow_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_update_flow_progress
  AFTER INSERT OR UPDATE OF state ON hr.tasks
  FOR EACH ROW EXECUTE FUNCTION hr.update_flow_progress();

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW hr.vw_onboarding_summary AS
SELECT
  tenant_id,
  COUNT(*) FILTER (WHERE status = 'NOT_STARTED') as not_started,
  COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
  COUNT(*) FILTER (WHERE status = 'BLOCKED') as blocked,
  COUNT(*) FILTER (WHERE status = 'DONE') as done,
  COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'DONE') as overdue,
  COUNT(*) FILTER (WHERE start_date >= CURRENT_DATE - INTERVAL '30 days') as new_this_month
FROM hr.onboarding_flows
GROUP BY tenant_id;

CREATE OR REPLACE VIEW hr.vw_offboarding_summary AS
SELECT
  tenant_id,
  COUNT(*) FILTER (WHERE status = 'NOT_STARTED') as not_started,
  COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
  COUNT(*) FILTER (WHERE status = 'BLOCKED') as blocked,
  COUNT(*) FILTER (WHERE status = 'DONE') as done,
  COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'DONE') as overdue,
  COUNT(*) FILTER (WHERE due_date <= CURRENT_DATE + INTERVAL '7 days' AND status != 'DONE') as due_within_7d
FROM hr.offboarding_flows
GROUP BY tenant_id;

CREATE OR REPLACE VIEW hr.vw_task_summary AS
SELECT
  tenant_id,
  flow_type,
  COUNT(*) FILTER (WHERE state = 'OPEN') as open,
  COUNT(*) FILTER (WHERE state = 'DONE') as done,
  COUNT(*) FILTER (WHERE state = 'BLOCKED') as blocked,
  COUNT(*) FILTER (WHERE state = 'SKIPPED') as skipped,
  COUNT(*) FILTER (WHERE due_at < now() AND state = 'OPEN') as overdue,
  COUNT(*) FILTER (WHERE escalations > 0) as escalated
FROM hr.tasks
GROUP BY tenant_id, flow_type;

CREATE OR REPLACE VIEW hr.vw_assets_outstanding AS
SELECT
  tenant_id,
  COUNT(*) FILTER (WHERE status = 'ASSIGNED') as assigned,
  COUNT(*) FILTER (WHERE status = 'LOST') as lost,
  COUNT(*) FILTER (WHERE status = 'BROKEN') as broken,
  COUNT(*) FILTER (WHERE status = 'RETURNED') as returned
FROM hr.badges_assets
GROUP BY tenant_id;
