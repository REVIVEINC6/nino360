-- HRMS Offboarding Schema
-- Comprehensive exit management with AI automation and knowledge transfer

-- Offboarding templates
CREATE TABLE IF NOT EXISTS hrms_offboarding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  department TEXT,
  role_level TEXT, -- entry, mid, senior, executive
  notice_period_days INTEGER DEFAULT 14,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offboarding instances
CREATE TABLE IF NOT EXISTS hrms_offboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID REFERENCES hrms_offboarding_templates(id),
  employee_id UUID NOT NULL,
  initiated_by UUID NOT NULL,
  resignation_date DATE NOT NULL,
  last_day DATE NOT NULL,
  exit_type TEXT NOT NULL, -- voluntary, involuntary, retirement, end_of_contract
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  progress INTEGER DEFAULT 0, -- 0-100
  completed_at TIMESTAMPTZ,
  
  -- AI fields
  ai_risk_score DECIMAL(3,2), -- 0-1, knowledge transfer risk
  ai_automation_rate DECIMAL(3,2), -- % of tasks automated
  ai_insights JSONB, -- {knowledge_gaps: [], critical_handovers: []}
  
  -- Blockchain
  blockchain_hash TEXT,
  blockchain_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offboarding checklist tasks
CREATE TABLE IF NOT EXISTS hrms_offboarding_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offboarding_id UUID NOT NULL REFERENCES hrms_offboarding(id) ON DELETE CASCADE,
  template_id UUID REFERENCES hrms_offboarding_templates(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- documentation, access, equipment, knowledge_transfer, admin
  assigned_to UUID,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, SKIPPED
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  notes TEXT,
  
  -- RPA automation
  is_automated BOOLEAN DEFAULT false,
  automation_status TEXT, -- not_automated, queued, processing, completed, failed
  automation_result JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment return tracking
CREATE TABLE IF NOT EXISTS hrms_offboarding_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offboarding_id UUID NOT NULL REFERENCES hrms_offboarding(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL, -- laptop, phone, badge, keys, etc
  serial_number TEXT,
  description TEXT,
  assigned_date DATE,
  expected_return_date DATE,
  actual_return_date DATE,
  condition TEXT, -- excellent, good, fair, poor, damaged
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, RETURNED, LOST, DAMAGED
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge transfer sessions
CREATE TABLE IF NOT EXISTS hrms_offboarding_knowledge_transfer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offboarding_id UUID NOT NULL REFERENCES hrms_offboarding(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  transferee_id UUID, -- person receiving knowledge
  session_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
  documentation_url TEXT,
  recording_url TEXT,
  
  -- AI analysis
  ai_completeness_score DECIMAL(3,2), -- 0-1
  ai_critical_gaps JSONB, -- [{topic, severity, recommendation}]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exit interviews
CREATE TABLE IF NOT EXISTS hrms_offboarding_exit_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offboarding_id UUID NOT NULL REFERENCES hrms_offboarding(id) ON DELETE CASCADE,
  interviewer_id UUID,
  interview_date TIMESTAMPTZ,
  format TEXT, -- in_person, video, phone, survey
  status TEXT NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, DECLINED
  
  -- Responses
  would_recommend BOOLEAN,
  would_return BOOLEAN,
  satisfaction_score INTEGER, -- 1-10
  feedback TEXT,
  improvement_suggestions TEXT,
  
  -- AI analysis
  ai_sentiment TEXT, -- positive, neutral, negative
  ai_themes JSONB, -- [management, culture, compensation, growth]
  ai_risk_indicators JSONB, -- potential issues flagged
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offboarding documents
CREATE TABLE IF NOT EXISTS hrms_offboarding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offboarding_id UUID NOT NULL REFERENCES hrms_offboarding(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- separation_agreement, nda, non_compete, final_paycheck, cobra
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, SIGNED, COMPLETED
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_url TEXT,
  
  -- Blockchain verification
  blockchain_hash TEXT,
  blockchain_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_offboarding_tenant ON hrms_offboarding(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_employee ON hrms_offboarding(employee_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_status ON hrms_offboarding(status);
CREATE INDEX IF NOT EXISTS idx_offboarding_last_day ON hrms_offboarding(last_day);
CREATE INDEX IF NOT EXISTS idx_offboarding_tasks_offboarding ON hrms_offboarding_tasks(offboarding_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_tasks_status ON hrms_offboarding_tasks(status);
CREATE INDEX IF NOT EXISTS idx_offboarding_equipment_offboarding ON hrms_offboarding_equipment(offboarding_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_knowledge_offboarding ON hrms_offboarding_knowledge_transfer(offboarding_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_exit_interviews_offboarding ON hrms_offboarding_exit_interviews(offboarding_id);

-- RLS Policies
ALTER TABLE hrms_offboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding_knowledge_transfer ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding_exit_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_offboarding_documents ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER update_offboarding_templates_updated_at BEFORE UPDATE ON hrms_offboarding_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offboarding_updated_at BEFORE UPDATE ON hrms_offboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offboarding_tasks_updated_at BEFORE UPDATE ON hrms_offboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data
INSERT INTO hrms_offboarding_templates (tenant_id, name, description, department, role_level, notice_period_days) VALUES
((SELECT id FROM tenants LIMIT 1), 'Standard Exit - Engineering', 'Standard offboarding for engineering roles', 'Engineering', 'mid', 14),
((SELECT id FROM tenants LIMIT 1), 'Executive Exit', 'Comprehensive offboarding for executive roles', 'Executive', 'executive', 30),
((SELECT id FROM tenants LIMIT 1), 'Contractor End', 'Offboarding for contract workers', 'All', 'entry', 0);
