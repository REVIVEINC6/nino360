-- HRMS Onboarding Schema
-- Comprehensive onboarding workflow management with AI automation

-- Onboarding Templates
CREATE TABLE IF NOT EXISTS hrms_onboarding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(100),
  job_level VARCHAR(50),
  duration_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Checklists
CREATE TABLE IF NOT EXISTS hrms_onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID REFERENCES hrms_onboarding_templates(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- HR, IT, Manager, Employee
  sequence_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  due_days_offset INTEGER DEFAULT 0, -- Days from start date
  assigned_role VARCHAR(100), -- Who completes this task
  automation_enabled BOOLEAN DEFAULT false,
  automation_type VARCHAR(50), -- email, provision, approval
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Instances
CREATE TABLE IF NOT EXISTS hrms_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  template_id UUID REFERENCES hrms_onboarding_templates(id),
  start_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  progress INTEGER DEFAULT 0, -- 0-100
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- AI Insights
  ai_risk_score DECIMAL(5,2), -- Risk of incomplete onboarding
  ai_predicted_completion_date DATE,
  ai_recommendations JSONB,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Tasks
CREATE TABLE IF NOT EXISTS hrms_onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES hrms_onboarding(id) ON DELETE CASCADE,
  checklist_id UUID REFERENCES hrms_onboarding_checklists(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, SKIPPED
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  notes TEXT,
  
  -- Automation
  auto_completed BOOLEAN DEFAULT false,
  automation_log JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Documents
CREATE TABLE IF NOT EXISTS hrms_onboarding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES hrms_onboarding(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- I9, W4, Direct_Deposit, etc.
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, UPLOADED, VERIFIED, REJECTED
  uploaded_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  
  -- AI Extraction
  ai_extracted_data JSONB,
  ai_confidence_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Provisioning
CREATE TABLE IF NOT EXISTS hrms_onboarding_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES hrms_onboarding(id) ON DELETE CASCADE,
  equipment_type VARCHAR(100) NOT NULL, -- Laptop, Monitor, Phone, etc.
  equipment_name VARCHAR(255),
  serial_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'REQUESTED', -- REQUESTED, ORDERED, SHIPPED, DELIVERED, SETUP
  requested_date DATE,
  delivered_date DATE,
  assigned_by UUID REFERENCES users(id),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Feedback
CREATE TABLE IF NOT EXISTS hrms_onboarding_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES hrms_onboarding(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50), -- Day1, Week1, Month1, Exit
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  
  -- AI Sentiment Analysis
  ai_sentiment VARCHAR(50), -- positive, neutral, negative
  ai_sentiment_score DECIMAL(5,2),
  ai_key_themes JSONB,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_onboarding_templates_tenant ON hrms_onboarding_templates(tenant_id);
CREATE INDEX idx_onboarding_checklists_tenant ON hrms_onboarding_checklists(tenant_id);
CREATE INDEX idx_onboarding_checklists_template ON hrms_onboarding_checklists(template_id);
CREATE INDEX idx_onboarding_tenant ON hrms_onboarding(tenant_id);
CREATE INDEX idx_onboarding_employee ON hrms_onboarding(employee_id);
CREATE INDEX idx_onboarding_status ON hrms_onboarding(status);
CREATE INDEX idx_onboarding_tasks_tenant ON hrms_onboarding_tasks(tenant_id);
CREATE INDEX idx_onboarding_tasks_onboarding ON hrms_onboarding_tasks(onboarding_id);
CREATE INDEX idx_onboarding_tasks_assigned ON hrms_onboarding_tasks(assigned_to);
CREATE INDEX idx_onboarding_documents_tenant ON hrms_onboarding_documents(tenant_id);
CREATE INDEX idx_onboarding_documents_onboarding ON hrms_onboarding_documents(onboarding_id);
CREATE INDEX idx_onboarding_equipment_tenant ON hrms_onboarding_equipment(tenant_id);
CREATE INDEX idx_onboarding_equipment_onboarding ON hrms_onboarding_equipment(onboarding_id);
CREATE INDEX idx_onboarding_feedback_tenant ON hrms_onboarding_feedback(tenant_id);
CREATE INDEX idx_onboarding_feedback_onboarding ON hrms_onboarding_feedback(onboarding_id);

-- Enable RLS
ALTER TABLE hrms_onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_onboarding_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_onboarding_templates ON hrms_onboarding_templates
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding_checklists ON hrms_onboarding_checklists
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding ON hrms_onboarding
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding_tasks ON hrms_onboarding_tasks
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding_documents ON hrms_onboarding_documents
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding_equipment ON hrms_onboarding_equipment
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_isolation_onboarding_feedback ON hrms_onboarding_feedback
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_onboarding_templates_updated_at BEFORE UPDATE ON hrms_onboarding_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_checklists_updated_at BEFORE UPDATE ON hrms_onboarding_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_updated_at BEFORE UPDATE ON hrms_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_tasks_updated_at BEFORE UPDATE ON hrms_onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_documents_updated_at BEFORE UPDATE ON hrms_onboarding_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_equipment_updated_at BEFORE UPDATE ON hrms_onboarding_equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data
INSERT INTO hrms_onboarding_templates (tenant_id, name, description, department, job_level, duration_days) VALUES
((SELECT id FROM tenants LIMIT 1), 'Software Engineer Onboarding', 'Standard onboarding for software engineers', 'Engineering', 'IC', 30),
((SELECT id FROM tenants LIMIT 1), 'Manager Onboarding', 'Onboarding for people managers', 'All', 'Manager', 45),
((SELECT id FROM tenants LIMIT 1), 'Sales Representative Onboarding', 'Onboarding for sales team members', 'Sales', 'IC', 60);

INSERT INTO hrms_onboarding_checklists (tenant_id, template_id, title, description, category, sequence_order, due_days_offset, assigned_role) VALUES
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM hrms_onboarding_templates WHERE name = 'Software Engineer Onboarding'), 'Complete I-9 Form', 'Verify employment eligibility', 'HR', 1, -5, 'HR'),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM hrms_onboarding_templates WHERE name = 'Software Engineer Onboarding'), 'Setup Laptop', 'Provision and configure laptop', 'IT', 2, 0, 'IT'),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM hrms_onboarding_templates WHERE name = 'Software Engineer Onboarding'), 'Team Introduction', 'Meet the team', 'Manager', 3, 1, 'Manager'),
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM hrms_onboarding_templates WHERE name = 'Software Engineer Onboarding'), 'Complete Training Modules', 'Finish required training', 'Employee', 4, 7, 'Employee');
