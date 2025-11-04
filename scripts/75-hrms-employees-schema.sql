-- HRMS Employees Comprehensive Schema
-- Includes employee records, lifecycle tracking, AI insights, and blockchain verification

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Employee master table (enhanced)
CREATE TABLE IF NOT EXISTS hrms_employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Basic Info
  employee_id VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  
  -- Address
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'USA',
  postal_code VARCHAR(20),
  
  -- Employment
  hire_date DATE NOT NULL,
  termination_date DATE,
  employment_type VARCHAR(50) NOT NULL, -- full_time, part_time, contract, intern
  department VARCHAR(100),
  designation VARCHAR(100),
  reporting_manager_id UUID REFERENCES hrms_employees(id),
  status VARCHAR(20) DEFAULT 'active', -- active, on_leave, terminated
  
  -- Compensation
  salary_currency VARCHAR(10) DEFAULT 'USD',
  salary_amount DECIMAL(15,2),
  pay_frequency VARCHAR(20), -- hourly, weekly, biweekly, monthly, annual
  
  -- AI Insights
  ai_performance_score DECIMAL(5,2), -- 0-100
  ai_retention_risk VARCHAR(20), -- low, medium, high
  ai_flight_risk_score DECIMAL(5,2), -- 0-100
  ai_engagement_score DECIMAL(5,2), -- 0-100
  ai_skill_match_score DECIMAL(5,2), -- 0-100
  ai_last_analyzed_at TIMESTAMPTZ,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_verified_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  UNIQUE(tenant_id, employee_id),
  UNIQUE(tenant_id, email)
);

-- Employee lifecycle events
CREATE TABLE IF NOT EXISTS hrms_employee_lifecycle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL, -- hired, promoted, transferred, terminated, rehired
  event_date DATE NOT NULL,
  effective_date DATE NOT NULL,
  
  -- Event details
  previous_department VARCHAR(100),
  new_department VARCHAR(100),
  previous_designation VARCHAR(100),
  new_designation VARCHAR(100),
  previous_manager_id UUID REFERENCES hrms_employees(id),
  new_manager_id UUID REFERENCES hrms_employees(id),
  previous_salary DECIMAL(15,2),
  new_salary DECIMAL(15,2),
  
  -- Termination specific
  termination_reason VARCHAR(50), -- voluntary, involuntary, retirement, layoff
  termination_type VARCHAR(50), -- resignation, dismissal, retirement
  rehire_eligible BOOLEAN,
  exit_interview_completed BOOLEAN DEFAULT false,
  
  -- Documentation
  reason TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  
  -- Approval
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Employee documents
CREATE TABLE IF NOT EXISTS hrms_employee_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  document_type VARCHAR(50) NOT NULL, -- resume, offer_letter, contract, id_proof, tax_form, etc.
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  -- AI Analysis
  ai_extracted_data JSONB,
  ai_verification_status VARCHAR(20), -- pending, verified, failed
  ai_confidence_score DECIMAL(5,2),
  
  -- Compliance
  is_required BOOLEAN DEFAULT false,
  expiry_date DATE,
  is_expired BOOLEAN GENERATED ALWAYS AS (expiry_date < CURRENT_DATE) STORED,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id)
);

-- Employee notes and interactions
CREATE TABLE IF NOT EXISTS hrms_employee_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  note_type VARCHAR(50) NOT NULL, -- general, performance, disciplinary, recognition
  subject VARCHAR(255),
  content TEXT NOT NULL,
  
  is_private BOOLEAN DEFAULT false,
  is_sensitive BOOLEAN DEFAULT false,
  
  -- AI Sentiment
  ai_sentiment VARCHAR(20), -- positive, neutral, negative
  ai_sentiment_score DECIMAL(5,2),
  ai_topics JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee emergency contacts
CREATE TABLE IF NOT EXISTS hrms_employee_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  
  contact_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  is_primary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hrms_employees_tenant ON hrms_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_status ON hrms_employees(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_department ON hrms_employees(tenant_id, department);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_manager ON hrms_employees(reporting_manager_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_email ON hrms_employees(email);
CREATE INDEX IF NOT EXISTS idx_hrms_employee_lifecycle_employee ON hrms_employee_lifecycle(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employee_lifecycle_type ON hrms_employee_lifecycle(tenant_id, event_type);
CREATE INDEX IF NOT EXISTS idx_hrms_employee_documents_employee ON hrms_employee_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employee_documents_type ON hrms_employee_documents(tenant_id, document_type);
CREATE INDEX IF NOT EXISTS idx_hrms_employee_notes_employee ON hrms_employee_notes(employee_id);

-- RLS Policies
ALTER TABLE hrms_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_employee_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_employee_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_employee_emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Employees policies
CREATE POLICY "Users can view employees in their tenant"
  ON hrms_employees FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "HR can manage employees"
  ON hrms_employees FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'hr_manager')
  ));

-- Lifecycle policies
CREATE POLICY "Users can view lifecycle events in their tenant"
  ON hrms_employee_lifecycle FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "HR can manage lifecycle events"
  ON hrms_employee_lifecycle FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'hr_manager')
  ));

-- Documents policies
CREATE POLICY "Users can view documents in their tenant"
  ON hrms_employee_documents FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "HR can manage documents"
  ON hrms_employee_documents FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'hr_manager')
  ));

-- Notes policies
CREATE POLICY "Users can view non-private notes"
  ON hrms_employee_notes FOR SELECT
  USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
    AND (is_private = false OR created_by = auth.uid())
  );

CREATE POLICY "Users can create notes"
  ON hrms_employee_notes FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Emergency contacts policies
CREATE POLICY "Users can view emergency contacts in their tenant"
  ON hrms_employee_emergency_contacts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "HR can manage emergency contacts"
  ON hrms_employee_emergency_contacts FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'hr_manager')
  ));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_hrms_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hrms_employees_updated_at
  BEFORE UPDATE ON hrms_employees
  FOR EACH ROW
  EXECUTE FUNCTION update_hrms_employees_updated_at();

-- Function to calculate AI retention risk
CREATE OR REPLACE FUNCTION calculate_retention_risk(emp_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  risk_score DECIMAL;
  tenure_months INTEGER;
  performance_score DECIMAL;
BEGIN
  SELECT 
    EXTRACT(MONTH FROM AGE(CURRENT_DATE, hire_date)),
    ai_performance_score
  INTO tenure_months, performance_score
  FROM hrms_employees
  WHERE id = emp_id;
  
  -- Simple risk calculation (can be enhanced with ML)
  risk_score := 0;
  
  -- Low tenure = higher risk
  IF tenure_months < 6 THEN risk_score := risk_score + 30;
  ELSIF tenure_months < 12 THEN risk_score := risk_score + 20;
  ELSIF tenure_months < 24 THEN risk_score := risk_score + 10;
  END IF;
  
  -- Low performance = higher risk
  IF performance_score < 50 THEN risk_score := risk_score + 40;
  ELSIF performance_score < 70 THEN risk_score := risk_score + 20;
  END IF;
  
  IF risk_score >= 50 THEN RETURN 'high';
  ELSIF risk_score >= 30 THEN RETURN 'medium';
  ELSE RETURN 'low';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Sample data
INSERT INTO hrms_employees (
  tenant_id, employee_id, first_name, last_name, email, phone,
  hire_date, employment_type, department, designation, status,
  salary_amount, salary_currency, pay_frequency,
  ai_performance_score, ai_retention_risk, ai_engagement_score
) VALUES
  (
    (SELECT id FROM tenants LIMIT 1),
    'EMP001', 'John', 'Doe', 'john.doe@company.com', '+1-555-0101',
    '2022-01-15', 'full_time', 'Engineering', 'Senior Software Engineer', 'active',
    120000, 'USD', 'annual',
    85.5, 'low', 92.3
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    'EMP002', 'Jane', 'Smith', 'jane.smith@company.com', '+1-555-0102',
    '2021-06-01', 'full_time', 'Product', 'Product Manager', 'active',
    135000, 'USD', 'annual',
    91.2, 'low', 88.7
  ),
  (
    (SELECT id FROM tenants LIMIT 1),
    'EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', '+1-555-0103',
    '2023-03-20', 'full_time', 'Sales', 'Account Executive', 'active',
    95000, 'USD', 'annual',
    78.4, 'medium', 75.6
  )
ON CONFLICT (tenant_id, employee_id) DO NOTHING;
