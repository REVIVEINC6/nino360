-- Talent Onboarding Schema with AI Workflows and Document Management
-- Version: 1.0
-- Description: Comprehensive onboarding workflows with AI automation and document collection

-- Onboarding Templates Table
CREATE TABLE IF NOT EXISTS onboarding_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(100),
  role_type VARCHAR(100),
  duration_days INTEGER DEFAULT 90,
  workflow_steps JSONB NOT NULL, -- Structured workflow definition
  ai_optimized BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_onboarding_templates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Onboarding Workflows Table
CREATE TABLE IF NOT EXISTS onboarding_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  candidate_id UUID REFERENCES candidates(id),
  employee_id UUID REFERENCES employees(id),
  template_id UUID REFERENCES onboarding_templates(id),
  
  -- Workflow Details
  workflow_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'on_hold', 'cancelled'
  completion_percentage INTEGER DEFAULT 0,
  
  -- AI Features
  ai_personalized BOOLEAN DEFAULT false,
  ai_recommendations JSONB, -- AI suggestions for workflow optimization
  ai_risk_score DECIMAL(3, 2), -- Risk of incomplete onboarding
  
  -- Assignments
  buddy_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  hr_contact_id UUID REFERENCES users(id),
  
  -- Metadata
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_onboarding_workflows_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Onboarding Tasks Table
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
  
  -- Task Details
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(100), -- 'document', 'training', 'meeting', 'system_access', 'equipment'
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  
  -- Scheduling
  sequence_order INTEGER,
  due_date DATE,
  due_days_from_start INTEGER, -- Days from onboarding start
  estimated_duration_minutes INTEGER,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id),
  assigned_role VARCHAR(100), -- 'employee', 'manager', 'hr', 'it', 'buddy'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped', 'blocked'
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  
  -- Dependencies
  depends_on_task_id UUID REFERENCES onboarding_tasks(id),
  blocking_reason TEXT,
  
  -- AI Features
  ai_generated BOOLEAN DEFAULT false,
  ai_priority_score DECIMAL(3, 2),
  ai_completion_prediction JSONB, -- Predicted completion likelihood
  
  -- Metadata
  notes TEXT,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_onboarding_tasks_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Onboarding Documents Table
CREATE TABLE IF NOT EXISTS onboarding_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
  task_id UUID REFERENCES onboarding_tasks(id),
  
  -- Document Details
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100), -- 'i9', 'w4', 'direct_deposit', 'handbook', 'nda', 'policy'
  description TEXT,
  required BOOLEAN DEFAULT true,
  
  -- File Information
  file_url TEXT,
  file_size INTEGER,
  file_type VARCHAR(50),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'uploaded', 'under_review', 'approved', 'rejected'
  uploaded_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  
  -- AI Analysis
  ai_extracted_data JSONB, -- AI-extracted information from document
  ai_verification_status VARCHAR(50), -- 'verified', 'needs_review', 'failed'
  ai_confidence_score DECIMAL(3, 2),
  
  -- E-Signature
  requires_signature BOOLEAN DEFAULT false,
  esign_status VARCHAR(50),
  signed_at TIMESTAMPTZ,
  
  -- Blockchain Verification
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_onboarding_documents_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Onboarding Checklists Table
CREATE TABLE IF NOT EXISTS onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
  
  -- Checklist Details
  checklist_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'day_1', 'week_1', 'month_1', 'equipment', 'access'
  items JSONB NOT NULL, -- Array of checklist items
  completion_percentage INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_onboarding_checklists_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Onboarding Feedback Table
CREATE TABLE IF NOT EXISTS onboarding_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
  
  -- Feedback Details
  feedback_type VARCHAR(100), -- 'day_1', 'week_1', 'month_1', 'exit_survey'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  suggestions TEXT,
  
  -- AI Analysis
  ai_sentiment VARCHAR(50), -- 'positive', 'neutral', 'negative'
  ai_sentiment_score DECIMAL(3, 2),
  ai_key_themes JSONB, -- AI-extracted themes from feedback
  ai_action_items JSONB, -- AI-suggested improvements
  
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_onboarding_feedback_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_onboarding_templates_tenant ON onboarding_templates(tenant_id);
CREATE INDEX idx_onboarding_workflows_tenant ON onboarding_workflows(tenant_id);
CREATE INDEX idx_onboarding_workflows_candidate ON onboarding_workflows(candidate_id);
CREATE INDEX idx_onboarding_workflows_status ON onboarding_workflows(status);
CREATE INDEX idx_onboarding_tasks_workflow ON onboarding_tasks(workflow_id);
CREATE INDEX idx_onboarding_tasks_assigned ON onboarding_tasks(assigned_to);
CREATE INDEX idx_onboarding_tasks_status ON onboarding_tasks(status);
CREATE INDEX idx_onboarding_documents_workflow ON onboarding_documents(workflow_id);
CREATE INDEX idx_onboarding_documents_status ON onboarding_documents(status);
CREATE INDEX idx_onboarding_checklists_workflow ON onboarding_checklists(workflow_id);
CREATE INDEX idx_onboarding_feedback_workflow ON onboarding_feedback(workflow_id);

-- RLS Policies
ALTER TABLE onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_feedback ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO onboarding_templates (tenant_id, name, description, duration_days, workflow_steps) VALUES
((SELECT id FROM tenants LIMIT 1), 'Standard Employee Onboarding', 'Standard 90-day onboarding for new employees', 90,
'{"steps": [{"name": "Pre-boarding", "duration": 7, "tasks": ["Send welcome email", "Prepare equipment"]}, {"name": "Day 1", "duration": 1, "tasks": ["Office tour", "Meet team", "Setup accounts"]}, {"name": "Week 1", "duration": 5, "tasks": ["Complete paperwork", "Training sessions"]}, {"name": "Month 1-3", "duration": 77, "tasks": ["Regular check-ins", "Performance reviews"]}]}');

INSERT INTO onboarding_workflows (tenant_id, candidate_id, workflow_name, start_date, status) VALUES
((SELECT id FROM tenants LIMIT 1), (SELECT id FROM candidates LIMIT 1), 'John Doe Onboarding', CURRENT_DATE, 'in_progress');
