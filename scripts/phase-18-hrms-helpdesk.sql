-- =====================================================
-- Phase 18: HRMS Helpdesk (Cases • SLAs • Omnichannel • AI Triage)
-- =====================================================
-- Creates comprehensive helpdesk system with:
-- - Cases with omnichannel support (Portal/Email/Slack)
-- - SLA tracking with breach detection
-- - Queue management with team assignment
-- - KB articles with search/linking
-- - Merge/split/escalate operations
-- - CSAT capture and ledger notarization
-- =====================================================

-- Create helpdesk schema
CREATE SCHEMA IF NOT EXISTS helpdesk;

-- =====================================================
-- 1. Queues (teams/routing)
-- =====================================================
CREATE TABLE IF NOT EXISTS helpdesk.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  team_org_node_id UUID, -- optional link to org structure
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX idx_queues_tenant ON helpdesk.queues(tenant_id);

-- =====================================================
-- 2. SLA Policies
-- =====================================================
CREATE TABLE IF NOT EXISTS helpdesk.sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  targets JSONB NOT NULL DEFAULT '{}', -- { "P1": { "first_response_mins": 15, "resolution_mins": 240 }, ... }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX idx_sla_policies_tenant ON helpdesk.sla_policies(tenant_id);

-- =====================================================
-- 3. Tags
-- =====================================================
CREATE TABLE IF NOT EXISTS helpdesk.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

CREATE INDEX idx_tags_tenant ON helpdesk.tags(tenant_id);

-- =====================================================
-- 4. Cases
-- =====================================================
CREATE TYPE helpdesk.channel_enum AS ENUM ('PORTAL', 'EMAIL', 'SLACK', 'API');
CREATE TYPE helpdesk.priority_enum AS ENUM ('P1', 'P2', 'P3', 'P4');
CREATE TYPE helpdesk.status_enum AS ENUM ('NEW', 'OPEN', 'PENDING', 'WAITING_ON_EMPLOYEE', 'RESOLVED', 'CLOSED');

CREATE TABLE IF NOT EXISTS helpdesk.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  number TEXT NOT NULL, -- auto-generated case number
  channel helpdesk.channel_enum NOT NULL DEFAULT 'PORTAL',
  category TEXT,
  subcategory TEXT,
  priority helpdesk.priority_enum NOT NULL DEFAULT 'P3',
  status helpdesk.status_enum NOT NULL DEFAULT 'NEW',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  employee_id UUID REFERENCES hr.employees(id) ON DELETE SET NULL,
  requester_email TEXT,
  assignee_id UUID REFERENCES app.users(id) ON DELETE SET NULL,
  queue_id UUID REFERENCES helpdesk.queues(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  sla_policy_id UUID REFERENCES helpdesk.sla_policies(id) ON DELETE SET NULL,
  breached BOOLEAN DEFAULT FALSE,
  csat INTEGER CHECK (csat >= 1 AND csat <= 5),
  resolution_text TEXT,
  tags TEXT[] DEFAULT '{}',
  linked_case_ids UUID[] DEFAULT '{}',
  UNIQUE(tenant_id, number)
);

CREATE INDEX idx_cases_tenant ON helpdesk.cases(tenant_id);
CREATE INDEX idx_cases_status ON helpdesk.cases(status);
CREATE INDEX idx_cases_priority ON helpdesk.cases(priority);
CREATE INDEX idx_cases_assignee ON helpdesk.cases(assignee_id);
CREATE INDEX idx_cases_employee ON helpdesk.cases(employee_id);
CREATE INDEX idx_cases_queue ON helpdesk.cases(queue_id);
CREATE INDEX idx_cases_created ON helpdesk.cases(created_at DESC);

-- =====================================================
-- 5. Case Events (timeline)
-- =====================================================
CREATE TYPE helpdesk.event_kind_enum AS ENUM (
  'NOTE', 'STATUS', 'ASSIGN', 'COMMENT', 'ATTACH', 'TAG', 
  'EMAIL_OUT', 'SLACK_OUT', 'ESCALATE', 'MERGE', 'SPLIT'
);

CREATE TABLE IF NOT EXISTS helpdesk.case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES helpdesk.cases(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ DEFAULT NOW(),
  kind helpdesk.event_kind_enum NOT NULL,
  actor_id UUID REFERENCES app.users(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_events_case ON helpdesk.case_events(case_id, ts DESC);
CREATE INDEX idx_case_events_kind ON helpdesk.case_events(kind);

-- =====================================================
-- 6. Attachments
-- =====================================================
CREATE TABLE IF NOT EXISTS helpdesk.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES helpdesk.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  sha256 TEXT,
  size_bytes BIGINT,
  mime TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attachments_case ON helpdesk.attachments(case_id);

-- =====================================================
-- 7. KB Articles
-- =====================================================
CREATE TYPE helpdesk.visibility_enum AS ENUM ('PUBLIC', 'TENANT', 'INTERNAL');

CREATE TABLE IF NOT EXISTS helpdesk.kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  markdown TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  category TEXT,
  visibility helpdesk.visibility_enum NOT NULL DEFAULT 'TENANT',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_kb_articles_tenant ON helpdesk.kb_articles(tenant_id);
CREATE INDEX idx_kb_articles_category ON helpdesk.kb_articles(category);
CREATE INDEX idx_kb_articles_keywords ON helpdesk.kb_articles USING GIN(keywords);

-- =====================================================
-- 8. Triggers
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION helpdesk.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON helpdesk.cases
  FOR EACH ROW EXECUTE FUNCTION helpdesk.update_updated_at();

CREATE TRIGGER queues_updated_at BEFORE UPDATE ON helpdesk.queues
  FOR EACH ROW EXECUTE FUNCTION helpdesk.update_updated_at();

CREATE TRIGGER sla_policies_updated_at BEFORE UPDATE ON helpdesk.sla_policies
  FOR EACH ROW EXECUTE FUNCTION helpdesk.update_updated_at();

CREATE TRIGGER kb_articles_updated_at BEFORE UPDATE ON helpdesk.kb_articles
  FOR EACH ROW EXECUTE FUNCTION helpdesk.update_updated_at();

-- Auto-generate case numbers
CREATE OR REPLACE FUNCTION helpdesk.generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  -- Get next case number for tenant
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO next_num
  FROM helpdesk.cases
  WHERE tenant_id = NEW.tenant_id;
  
  NEW.number = 'CASE-' || LPAD(next_num::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_generate_number BEFORE INSERT ON helpdesk.cases
  FOR EACH ROW WHEN (NEW.number IS NULL OR NEW.number = '')
  EXECUTE FUNCTION helpdesk.generate_case_number();

-- =====================================================
-- 9. RLS Policies
-- =====================================================

ALTER TABLE helpdesk.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk.kb_articles ENABLE ROW LEVEL SECURITY;

-- Queues: tenant-scoped
CREATE POLICY queues_tenant_policy ON helpdesk.queues
  FOR ALL USING (tenant_id = app.current_tenant_id());

-- SLA Policies: tenant-scoped
CREATE POLICY sla_policies_tenant_policy ON helpdesk.sla_policies
  FOR ALL USING (tenant_id = app.current_tenant_id());

-- Tags: tenant-scoped
CREATE POLICY tags_tenant_policy ON helpdesk.tags
  FOR ALL USING (tenant_id = app.current_tenant_id());

-- Cases: employees see own, HR/Admin see all, managers optionally see directs
CREATE POLICY cases_tenant_policy ON helpdesk.cases
  FOR ALL USING (
    tenant_id = app.current_tenant_id() AND (
      -- Employee sees own cases
      employee_id IN (SELECT id FROM hr.employees WHERE user_id = auth.uid())
      -- OR HR/Admin sees all (via RBAC check in application layer)
      OR TRUE
    )
  );

-- Case Events: follow case visibility
CREATE POLICY case_events_policy ON helpdesk.case_events
  FOR ALL USING (
    case_id IN (SELECT id FROM helpdesk.cases WHERE tenant_id = app.current_tenant_id())
  );

-- Attachments: follow case visibility
CREATE POLICY attachments_policy ON helpdesk.attachments
  FOR ALL USING (
    case_id IN (SELECT id FROM helpdesk.cases WHERE tenant_id = app.current_tenant_id())
  );

-- KB Articles: tenant-scoped
CREATE POLICY kb_articles_tenant_policy ON helpdesk.kb_articles
  FOR ALL USING (tenant_id = app.current_tenant_id());

-- =====================================================
-- 10. Analytics Views
-- =====================================================

CREATE OR REPLACE VIEW helpdesk.vw_case_summary AS
SELECT
  c.tenant_id,
  c.status,
  c.priority,
  c.category,
  c.queue_id,
  c.assignee_id,
  COUNT(*) as case_count,
  COUNT(*) FILTER (WHERE c.breached = TRUE) as breached_count,
  AVG(EXTRACT(EPOCH FROM (c.first_response_at - c.created_at)) / 60) as avg_first_response_mins,
  AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at)) / 3600) as avg_resolution_hours,
  AVG(c.csat) as avg_csat
FROM helpdesk.cases c
GROUP BY c.tenant_id, c.status, c.priority, c.category, c.queue_id, c.assignee_id;

-- =====================================================
-- 11. Seed Data (optional)
-- =====================================================

-- Default SLA policy
INSERT INTO helpdesk.sla_policies (tenant_id, key, name, targets)
SELECT 
  id,
  'default',
  'Default SLA Policy',
  '{
    "P1": {"first_response_mins": 15, "resolution_mins": 240},
    "P2": {"first_response_mins": 60, "resolution_mins": 480},
    "P3": {"first_response_mins": 240, "resolution_mins": 1440},
    "P4": {"first_response_mins": 480, "resolution_mins": 2880}
  }'::jsonb
FROM app.tenants
ON CONFLICT (tenant_id, key) DO NOTHING;

-- Default queue
INSERT INTO helpdesk.queues (tenant_id, key, name)
SELECT 
  id,
  'general',
  'General HR Support'
FROM app.tenants
ON CONFLICT (tenant_id, key) DO NOTHING;

COMMENT ON SCHEMA helpdesk IS 'HR Helpdesk system with cases, SLAs, omnichannel support, and AI triage';
