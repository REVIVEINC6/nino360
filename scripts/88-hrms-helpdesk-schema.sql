-- =====================================================
-- HRMS Helpdesk Schema
-- Employee support tickets, SLA management, AI triage
-- =====================================================

-- Helpdesk Queues
CREATE TABLE IF NOT EXISTS helpdesk_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app_tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  email TEXT,
  slack_channel TEXT,
  auto_assign BOOLEAN DEFAULT false,
  assignee_pool UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

-- SLA Policies
CREATE TABLE IF NOT EXISTS helpdesk_sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app_tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  targets JSONB NOT NULL, -- { first_response_minutes, resolution_minutes }
  business_hours_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, key)
);

-- Helpdesk Cases
CREATE TABLE IF NOT EXISTS helpdesk_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app_tenants(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('PORTAL', 'EMAIL', 'SLACK', 'API')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  employee_id UUID REFERENCES hr_employees(id) ON DELETE SET NULL,
  requester_email TEXT,
  category TEXT,
  subcategory TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('P1', 'P2', 'P3', 'P4')),
  status TEXT NOT NULL CHECK (status IN ('NEW', 'OPEN', 'PENDING', 'WAITING_ON_EMPLOYEE', 'RESOLVED', 'CLOSED')),
  queue_id UUID REFERENCES helpdesk_queues(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  sla_policy_id UUID REFERENCES helpdesk_sla_policies(id) ON DELETE SET NULL,
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  resolution_text TEXT,
  csat INTEGER CHECK (csat BETWEEN 1 AND 5),
  tags TEXT[],
  ai_triage JSONB, -- { category, priority, confidence, similar_cases }
  blockchain_hash TEXT,
  blockchain_proof JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, number)
);

-- Case Events (comments, status changes, assignments)
CREATE TABLE IF NOT EXISTS helpdesk_case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES helpdesk_cases(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('COMMENT', 'STATUS', 'ASSIGN', 'TAG', 'ATTACHMENT')),
  actor_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Case Attachments
CREATE TABLE IF NOT EXISTS helpdesk_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES helpdesk_cases(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base Articles
CREATE TABLE IF NOT EXISTS helpdesk_kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES app_tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SLA Breach Tracking
CREATE TABLE IF NOT EXISTS helpdesk_sla_breaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES helpdesk_cases(id) ON DELETE CASCADE,
  breach_type TEXT NOT NULL CHECK (breach_type IN ('FIRST_RESPONSE', 'RESOLUTION')),
  target_minutes INTEGER NOT NULL,
  actual_minutes INTEGER NOT NULL,
  breach_minutes INTEGER NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_helpdesk_cases_tenant ON helpdesk_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_helpdesk_cases_status ON helpdesk_cases(status);
CREATE INDEX IF NOT EXISTS idx_helpdesk_cases_assignee ON helpdesk_cases(assignee_id);
CREATE INDEX IF NOT EXISTS idx_helpdesk_cases_employee ON helpdesk_cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_helpdesk_cases_created ON helpdesk_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_helpdesk_case_events_case ON helpdesk_case_events(case_id);
CREATE INDEX IF NOT EXISTS idx_helpdesk_attachments_case ON helpdesk_attachments(case_id);

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE helpdesk_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_sla_breaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_helpdesk_queues ON helpdesk_queues
  USING (tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_helpdesk_sla_policies ON helpdesk_sla_policies
  USING (tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_helpdesk_cases ON helpdesk_cases
  USING (tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_helpdesk_case_events ON helpdesk_case_events
  USING (case_id IN (SELECT id FROM helpdesk_cases WHERE tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid())));

CREATE POLICY tenant_isolation_helpdesk_attachments ON helpdesk_attachments
  USING (case_id IN (SELECT id FROM helpdesk_cases WHERE tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid())));

CREATE POLICY tenant_isolation_helpdesk_kb_articles ON helpdesk_kb_articles
  USING (tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_helpdesk_sla_breaches ON helpdesk_sla_breaches
  USING (case_id IN (SELECT id FROM helpdesk_cases WHERE tenant_id IN (SELECT tenant_id FROM app_tenant_members WHERE user_id = auth.uid())));

-- =====================================================
-- Triggers
-- =====================================================

CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.number := 'HD-' || LPAD(nextval('helpdesk_case_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS helpdesk_case_number_seq START 1000;

CREATE TRIGGER set_case_number
  BEFORE INSERT ON helpdesk_cases
  FOR EACH ROW
  EXECUTE FUNCTION generate_case_number();

CREATE TRIGGER update_helpdesk_cases_updated_at
  BEFORE UPDATE ON helpdesk_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert default queue
INSERT INTO helpdesk_queues (tenant_id, key, name, description, email)
SELECT id, 'general', 'General Support', 'General employee support requests', 'support@company.com'
FROM app_tenants
ON CONFLICT (tenant_id, key) DO NOTHING;

-- Insert default SLA policy
INSERT INTO helpdesk_sla_policies (tenant_id, key, name, targets)
SELECT id, 'default', 'Standard SLA', '{"first_response_minutes": 240, "resolution_minutes": 1440}'::jsonb
FROM app_tenants
ON CONFLICT (tenant_id, key) DO NOTHING;

-- Insert sample KB articles
INSERT INTO helpdesk_kb_articles (tenant_id, title, content, category, tags, published)
SELECT 
  t.id,
  'How to Request Time Off',
  'To request time off, navigate to the Time Off section in your employee portal...',
  'Time Off',
  ARRAY['pto', 'vacation', 'time-off'],
  true
FROM app_tenants t
ON CONFLICT DO NOTHING;
