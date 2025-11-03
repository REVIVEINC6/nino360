-- ============================================================================
-- HRMS Immigration & I-9 Compliance Schema
-- ============================================================================

-- Immigration Cases Table
CREATE TABLE IF NOT EXISTS hr.immigration_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  -- Case Details
  case_type VARCHAR(50) NOT NULL, -- H1B, L1, TN, Green Card, etc.
  case_number VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, filed, pending, approved, denied, withdrawn
  priority_date DATE,
  filing_date DATE,
  approval_date DATE,
  expiry_date DATE,
  
  -- Attorney Information
  attorney_name VARCHAR(255),
  attorney_firm VARCHAR(255),
  attorney_email VARCHAR(255),
  attorney_phone VARCHAR(50),
  
  -- USCIS Details
  receipt_number VARCHAR(100),
  uscis_case_status VARCHAR(100),
  uscis_office VARCHAR(100),
  
  -- RFE (Request for Evidence)
  rfe_received_date DATE,
  rfe_response_due_date DATE,
  rfe_description TEXT,
  rfe_response_submitted_date DATE,
  
  -- AI & Compliance
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  risk_level VARCHAR(20), -- low, medium, high, critical
  
  -- Documents
  petition_pdf_url TEXT,
  approval_notice_url TEXT,
  i94_url TEXT,
  
  -- AI OCR Processing
  ocr_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence_score INTEGER CHECK (ocr_confidence_score >= 0 AND ocr_confidence_score <= 100),
  ocr_extracted_data JSONB DEFAULT '{}'::jsonb,
  
  -- Blockchain Verification
  blockchain_hash VARCHAR(255),
  blockchain_verified_at TIMESTAMPTZ,
  
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- I-9 Records Table
CREATE TABLE IF NOT EXISTS hr.i9_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  -- Citizenship Status
  citizenship_status VARCHAR(50), -- US Citizen, Permanent Resident, Alien Authorized to Work
  
  -- Section 1 (Employee)
  section1_completed_at TIMESTAMPTZ,
  section1_completed_by UUID REFERENCES auth.users(id),
  section1_signature_url TEXT,
  
  -- Section 2 (Employer)
  section2_completed_at TIMESTAMPTZ,
  section2_completed_by UUID REFERENCES auth.users(id),
  section2_signature_url TEXT,
  
  -- Section 3 (Reverification)
  section3_completed_at TIMESTAMPTZ,
  section3_completed_by UUID REFERENCES auth.users(id),
  section3_signature_url TEXT,
  
  -- Document List A (Identity + Work Authorization)
  doc_list_a_type VARCHAR(100),
  doc_list_a_number VARCHAR(100),
  doc_list_a_expiry DATE,
  doc_list_a_url TEXT,
  
  -- Document List B (Identity)
  doc_list_b_type VARCHAR(100),
  doc_list_b_number VARCHAR(100),
  doc_list_b_expiry DATE,
  doc_list_b_url TEXT,
  
  -- Document List C (Work Authorization)
  doc_list_c_type VARCHAR(100),
  doc_list_c_number VARCHAR(100),
  doc_list_c_expiry DATE,
  doc_list_c_url TEXT,
  
  -- E-Verify
  everify_case_number VARCHAR(100),
  everify_status VARCHAR(50), -- not_submitted, submitted, employment_authorized, tentative_nonconfirmation, final_nonconfirmation
  everify_submitted_at TIMESTAMPTZ,
  everify_result_date TIMESTAMPTZ,
  
  -- Reverification
  reverification_due_date DATE,
  reverification_completed_date DATE,
  
  -- Status & Compliance
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, complete, expired, reverification_required
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  
  -- Form PDF
  form_pdf_url TEXT,
  
  -- AI OCR Processing
  ocr_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence_score INTEGER CHECK (ocr_confidence_score >= 0 AND ocr_confidence_score <= 100),
  ocr_extracted_data JSONB DEFAULT '{}'::jsonb,
  
  -- Blockchain Verification
  blockchain_hash VARCHAR(255),
  blockchain_verified_at TIMESTAMPTZ,
  
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Immigration Alerts Table
CREATE TABLE IF NOT EXISTS hr.immigration_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  case_id UUID REFERENCES hr.immigration_cases(id) ON DELETE CASCADE,
  i9_id UUID REFERENCES hr.i9_records(id) ON DELETE CASCADE,
  
  alert_type VARCHAR(100) NOT NULL, -- expiring_visa, rfe_due, i9_reverification, everify_action, compliance_issue
  severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
  message TEXT NOT NULL,
  action_required TEXT,
  due_date DATE,
  
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immigration Documents Table
CREATE TABLE IF NOT EXISTS hr.immigration_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  case_id UUID REFERENCES hr.immigration_cases(id) ON DELETE CASCADE,
  i9_id UUID REFERENCES hr.i9_records(id) ON DELETE CASCADE,
  
  document_type VARCHAR(100) NOT NULL, -- petition, approval_notice, i94, passport, visa, i9_form, supporting_doc
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type VARCHAR(100),
  
  -- AI OCR
  ocr_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence_score INTEGER,
  ocr_extracted_data JSONB DEFAULT '{}'::jsonb,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified_at TIMESTAMPTZ,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Immigration Case Events Table (Audit Trail)
CREATE TABLE IF NOT EXISTS hr.immigration_case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES hr.immigration_cases(id) ON DELETE CASCADE,
  
  event_type VARCHAR(100) NOT NULL, -- filed, rfe_received, rfe_responded, approved, denied, expired
  event_date DATE NOT NULL,
  description TEXT,
  
  -- Blockchain
  blockchain_hash VARCHAR(255),
  blockchain_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_immigration_cases_tenant ON hr.immigration_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_employee ON hr.immigration_cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_status ON hr.immigration_cases(status);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_expiry ON hr.immigration_cases(expiry_date);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_rfe_due ON hr.immigration_cases(rfe_response_due_date);

CREATE INDEX IF NOT EXISTS idx_i9_records_tenant ON hr.i9_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_i9_records_employee ON hr.i9_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_i9_records_status ON hr.i9_records(status);
CREATE INDEX IF NOT EXISTS idx_i9_records_reverify ON hr.i9_records(reverification_due_date);

CREATE INDEX IF NOT EXISTS idx_immigration_alerts_tenant ON hr.immigration_alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_immigration_alerts_employee ON hr.immigration_alerts(employee_id);
CREATE INDEX IF NOT EXISTS idx_immigration_alerts_resolved ON hr.immigration_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_immigration_alerts_severity ON hr.immigration_alerts(severity);

CREATE INDEX IF NOT EXISTS idx_immigration_documents_case ON hr.immigration_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_immigration_documents_i9 ON hr.immigration_documents(i9_id);

CREATE INDEX IF NOT EXISTS idx_immigration_case_events_case ON hr.immigration_case_events(case_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE hr.immigration_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.i9_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.immigration_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.immigration_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.immigration_case_events ENABLE ROW LEVEL SECURITY;

-- Immigration Cases Policies
CREATE POLICY immigration_cases_tenant_isolation ON hr.immigration_cases
  USING (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY immigration_cases_insert ON hr.immigration_cases
  FOR INSERT WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- I-9 Records Policies
CREATE POLICY i9_records_tenant_isolation ON hr.i9_records
  USING (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY i9_records_insert ON hr.i9_records
  FOR INSERT WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- Immigration Alerts Policies
CREATE POLICY immigration_alerts_tenant_isolation ON hr.immigration_alerts
  USING (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- Immigration Documents Policies
CREATE POLICY immigration_documents_tenant_isolation ON hr.immigration_documents
  USING (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- Immigration Case Events Policies
CREATE POLICY immigration_case_events_tenant_isolation ON hr.immigration_case_events
  USING (tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE TRIGGER immigration_cases_updated_at
  BEFORE UPDATE ON hr.immigration_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER i9_records_updated_at
  BEFORE UPDATE ON hr.i9_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create alerts for expiring visas
CREATE OR REPLACE FUNCTION create_expiring_visa_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Create alert if visa expires in 90 days
  IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURRENT_DATE + INTERVAL '90 days' AND NEW.expiry_date >= CURRENT_DATE THEN
    INSERT INTO hr.immigration_alerts (tenant_id, employee_id, case_id, alert_type, severity, message, due_date)
    VALUES (
      NEW.tenant_id,
      NEW.employee_id,
      NEW.id,
      'expiring_visa',
      CASE 
        WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'critical'
        WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '60 days' THEN 'high'
        ELSE 'medium'
      END,
      'Visa expires on ' || NEW.expiry_date || '. Start renewal process immediately.',
      NEW.expiry_date
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER immigration_cases_expiry_alert
  AFTER INSERT OR UPDATE OF expiry_date ON hr.immigration_cases
  FOR EACH ROW EXECUTE FUNCTION create_expiring_visa_alerts();

-- Auto-create alerts for RFE due dates
CREATE OR REPLACE FUNCTION create_rfe_due_alerts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rfe_response_due_date IS NOT NULL AND NEW.rfe_response_due_date >= CURRENT_DATE THEN
    INSERT INTO hr.immigration_alerts (tenant_id, employee_id, case_id, alert_type, severity, message, due_date)
    VALUES (
      NEW.tenant_id,
      NEW.employee_id,
      NEW.id,
      'rfe_due',
      CASE 
        WHEN NEW.rfe_response_due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
        WHEN NEW.rfe_response_due_date <= CURRENT_DATE + INTERVAL '14 days' THEN 'high'
        ELSE 'medium'
      END,
      'RFE response due on ' || NEW.rfe_response_due_date || '. Prepare response immediately.',
      NEW.rfe_response_due_date
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER immigration_cases_rfe_alert
  AFTER INSERT OR UPDATE OF rfe_response_due_date ON hr.immigration_cases
  FOR EACH ROW EXECUTE FUNCTION create_rfe_due_alerts();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Immigration Summary View
CREATE OR REPLACE VIEW hr.vw_immigration_summary AS
SELECT
  tenant_id,
  COUNT(*) as total_cases,
  COUNT(*) FILTER (WHERE status = 'filed') as filed_cases,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_cases,
  COUNT(*) FILTER (WHERE status = 'denied') as denied_cases,
  COUNT(*) FILTER (WHERE expiry_date <= CURRENT_DATE + INTERVAL '90 days' AND expiry_date >= CURRENT_DATE) as expiring_soon,
  COUNT(*) FILTER (WHERE rfe_response_due_date IS NOT NULL AND rfe_response_due_date >= CURRENT_DATE) as rfe_pending,
  AVG(compliance_score) as avg_compliance_score
FROM hr.immigration_cases
GROUP BY tenant_id;

-- I-9 Compliance Summary View
CREATE OR REPLACE VIEW hr.vw_i9_compliance_summary AS
SELECT
  tenant_id,
  COUNT(*) as total_i9s,
  COUNT(*) FILTER (WHERE status = 'complete') as complete_i9s,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_i9s,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_i9s,
  COUNT(*) FILTER (WHERE reverification_due_date <= CURRENT_DATE + INTERVAL '30 days' AND reverification_due_date >= CURRENT_DATE) as reverification_due,
  AVG(compliance_score) as avg_compliance_score
FROM hr.i9_records
GROUP BY tenant_id;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Sample Immigration Cases
INSERT INTO hr.immigration_cases (tenant_id, employee_id, case_type, case_number, status, filing_date, expiry_date, attorney_name, attorney_firm, compliance_score, risk_level)
SELECT 
  t.id,
  e.id,
  CASE (random() * 4)::int
    WHEN 0 THEN 'H1B'
    WHEN 1 THEN 'L1'
    WHEN 2 THEN 'Green Card'
    WHEN 3 THEN 'TN'
    ELSE 'H4 EAD'
  END,
  'WAC' || (2100000000 + (random() * 10000000)::bigint)::text,
  CASE (random() * 4)::int
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'filed'
    WHEN 2 THEN 'approved'
    ELSE 'pending'
  END,
  CURRENT_DATE - (random() * 365)::int,
  CURRENT_DATE + (random() * 1095)::int,
  CASE (random() * 2)::int
    WHEN 0 THEN 'John Smith'
    ELSE 'Sarah Johnson'
  END,
  CASE (random() * 2)::int
    WHEN 0 THEN 'Smith & Associates'
    ELSE 'Johnson Law Firm'
  END,
  (random() * 30 + 70)::int,
  CASE (random() * 3)::int
    WHEN 0 THEN 'low'
    WHEN 1 THEN 'medium'
    ELSE 'high'
  END
FROM tenants t
CROSS JOIN LATERAL (
  SELECT id FROM hr.employees WHERE tenant_id = t.id ORDER BY random() LIMIT 5
) e
ON CONFLICT DO NOTHING;

-- Sample I-9 Records
INSERT INTO hr.i9_records (tenant_id, employee_id, citizenship_status, section1_completed_at, section2_completed_at, status, compliance_score)
SELECT 
  t.id,
  e.id,
  CASE (random() * 2)::int
    WHEN 0 THEN 'US Citizen'
    WHEN 1 THEN 'Permanent Resident'
    ELSE 'Alien Authorized to Work'
  END,
  CURRENT_TIMESTAMP - (random() * 365)::int * INTERVAL '1 day',
  CURRENT_TIMESTAMP - (random() * 365)::int * INTERVAL '1 day',
  CASE (random() * 2)::int
    WHEN 0 THEN 'complete'
    WHEN 1 THEN 'pending'
    ELSE 'reverification_required'
  END,
  (random() * 20 + 80)::int
FROM tenants t
CROSS JOIN LATERAL (
  SELECT id FROM hr.employees WHERE tenant_id = t.id ORDER BY random() LIMIT 10
) e
ON CONFLICT DO NOTHING;
