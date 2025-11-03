-- I-9 Compliance Management Schema
-- Comprehensive I-9 form management with E-Verify integration and blockchain verification

-- I-9 Forms table
CREATE TABLE IF NOT EXISTS hrms_i9_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  form_version TEXT NOT NULL DEFAULT 'current', -- Form version (e.g., '08/01/23')
  
  -- Section 1: Employee Information and Attestation
  section1_completed_at TIMESTAMPTZ,
  section1_completed_by UUID REFERENCES auth.users(id),
  last_name TEXT,
  first_name TEXT,
  middle_initial TEXT,
  other_last_names TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  date_of_birth DATE,
  ssn_last_4 TEXT, -- Only store last 4 digits
  email TEXT,
  phone TEXT,
  citizenship_status TEXT, -- 'citizen', 'noncitizen_national', 'lawful_permanent_resident', 'alien_authorized'
  uscis_number TEXT,
  alien_registration_number TEXT,
  i94_admission_number TEXT,
  foreign_passport_number TEXT,
  country_of_issuance TEXT,
  signature_data TEXT, -- Base64 encoded signature
  
  -- Section 2: Employer Review and Verification
  section2_completed_at TIMESTAMPTZ,
  section2_completed_by UUID REFERENCES auth.users(id),
  first_day_of_employment DATE,
  document_title_list_a TEXT,
  issuing_authority_list_a TEXT,
  document_number_list_a TEXT,
  expiration_date_list_a DATE,
  document_title_list_b TEXT,
  issuing_authority_list_b TEXT,
  document_number_list_b TEXT,
  expiration_date_list_b DATE,
  document_title_list_c TEXT,
  issuing_authority_list_c TEXT,
  document_number_list_c TEXT,
  expiration_date_list_c DATE,
  additional_info TEXT,
  employer_signature_data TEXT,
  employer_name TEXT,
  employer_title TEXT,
  
  -- Section 3: Reverification and Rehires
  section3_completed_at TIMESTAMPTZ,
  section3_completed_by UUID REFERENCES auth.users(id),
  rehire_date DATE,
  reverification_date DATE,
  reverification_document_title TEXT,
  reverification_document_number TEXT,
  reverification_expiration_date DATE,
  
  -- E-Verify Integration
  everify_case_number TEXT,
  everify_status TEXT, -- 'not_submitted', 'pending', 'employment_authorized', 'tentative_nonconfirmation', 'final_nonconfirmation'
  everify_submitted_at TIMESTAMPTZ,
  everify_result_received_at TIMESTAMPTZ,
  everify_result_data JSONB,
  
  -- AI & Blockchain
  ai_ocr_extracted_data JSONB, -- AI-extracted data from uploaded documents
  ai_validation_score DECIMAL(3,2), -- 0.00 to 1.00
  ai_anomaly_flags JSONB, -- Detected anomalies or inconsistencies
  blockchain_hash TEXT, -- Blockchain verification hash
  blockchain_verified_at TIMESTAMPTZ,
  
  -- Status & Compliance
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'section1_complete', 'section2_complete', 'complete', 'reverify_required', 'expired'
  compliance_status TEXT DEFAULT 'compliant', -- 'compliant', 'non_compliant', 'pending_reverification'
  next_reverification_date DATE,
  audit_ready BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- I-9 Documents table (scanned copies)
CREATE TABLE IF NOT EXISTS hrms_i9_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  i9_form_id UUID NOT NULL REFERENCES hrms_i9_forms(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'list_a', 'list_b', 'list_c', 'reverification'
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- AI Processing
  ai_ocr_text TEXT, -- Extracted text from document
  ai_extracted_fields JSONB, -- Structured data extracted by AI
  ai_confidence_score DECIMAL(3,2),
  ai_fraud_risk_score DECIMAL(3,2), -- 0.00 to 1.00
  
  -- Blockchain
  blockchain_hash TEXT,
  blockchain_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- I-9 Audit Log
CREATE TABLE IF NOT EXISTS hrms_i9_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  i9_form_id UUID NOT NULL REFERENCES hrms_i9_forms(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'section1_completed', 'section2_completed', 'section3_completed', 'everify_submitted', 'reverification_required', 'viewed', 'exported'
  performed_by UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  changes JSONB, -- Before/after values for updates
  
  -- Blockchain
  blockchain_hash TEXT,
  blockchain_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I-9 Reverification Alerts
CREATE TABLE IF NOT EXISTS hrms_i9_reverification_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  i9_form_id UUID NOT NULL REFERENCES hrms_i9_forms(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hrms_employees(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'document_expiring', 'reverification_due', 'overdue'
  alert_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'acknowledged', 'completed', 'dismissed'
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I-9 Compliance Reports
CREATE TABLE IF NOT EXISTS hrms_i9_compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'audit', 'compliance_check', 'everify_summary', 'reverification_queue'
  report_period_start DATE,
  report_period_end DATE,
  generated_by UUID REFERENCES auth.users(id),
  report_data JSONB NOT NULL, -- Report contents
  file_url TEXT, -- PDF export
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_i9_forms_tenant ON hrms_i9_forms(tenant_id);
CREATE INDEX idx_i9_forms_employee ON hrms_i9_forms(employee_id);
CREATE INDEX idx_i9_forms_status ON hrms_i9_forms(status);
CREATE INDEX idx_i9_forms_everify_status ON hrms_i9_forms(everify_status);
CREATE INDEX idx_i9_forms_next_reverification ON hrms_i9_forms(next_reverification_date);
CREATE INDEX idx_i9_documents_form ON hrms_i9_documents(i9_form_id);
CREATE INDEX idx_i9_audit_log_form ON hrms_i9_audit_log(i9_form_id);
CREATE INDEX idx_i9_alerts_tenant ON hrms_i9_reverification_alerts(tenant_id);
CREATE INDEX idx_i9_alerts_employee ON hrms_i9_reverification_alerts(employee_id);
CREATE INDEX idx_i9_alerts_status ON hrms_i9_reverification_alerts(status);
CREATE INDEX idx_i9_reports_tenant ON hrms_i9_compliance_reports(tenant_id);

-- Enable RLS
ALTER TABLE hrms_i9_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_i9_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_i9_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_i9_reverification_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrms_i9_compliance_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view I-9 forms in their tenant"
  ON hrms_i9_forms FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage I-9 forms in their tenant"
  ON hrms_i9_forms FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view I-9 documents in their tenant"
  ON hrms_i9_documents FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage I-9 documents in their tenant"
  ON hrms_i9_documents FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view I-9 audit log in their tenant"
  ON hrms_i9_audit_log FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view I-9 alerts in their tenant"
  ON hrms_i9_reverification_alerts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage I-9 alerts in their tenant"
  ON hrms_i9_reverification_alerts FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view I-9 reports in their tenant"
  ON hrms_i9_compliance_reports FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_i9_forms_updated_at
  BEFORE UPDATE ON hrms_i9_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check for upcoming reverifications
CREATE OR REPLACE FUNCTION check_i9_reverifications()
RETURNS void AS $$
BEGIN
  -- Create alerts for documents expiring in 30 days
  INSERT INTO hrms_i9_reverification_alerts (tenant_id, i9_form_id, employee_id, alert_type, alert_date, due_date)
  SELECT 
    tenant_id,
    id,
    employee_id,
    'document_expiring',
    CURRENT_DATE,
    next_reverification_date
  FROM hrms_i9_forms
  WHERE next_reverification_date IS NOT NULL
    AND next_reverification_date <= CURRENT_DATE + INTERVAL '30 days'
    AND next_reverification_date > CURRENT_DATE
    AND NOT EXISTS (
      SELECT 1 FROM hrms_i9_reverification_alerts
      WHERE i9_form_id = hrms_i9_forms.id
        AND alert_type = 'document_expiring'
        AND status = 'pending'
    );
    
  -- Create alerts for overdue reverifications
  INSERT INTO hrms_i9_reverification_alerts (tenant_id, i9_form_id, employee_id, alert_type, alert_date, due_date)
  SELECT 
    tenant_id,
    id,
    employee_id,
    'overdue',
    CURRENT_DATE,
    next_reverification_date
  FROM hrms_i9_forms
  WHERE next_reverification_date IS NOT NULL
    AND next_reverification_date < CURRENT_DATE
    AND status != 'expired'
    AND NOT EXISTS (
      SELECT 1 FROM hrms_i9_reverification_alerts
      WHERE i9_form_id = hrms_i9_forms.id
        AND alert_type = 'overdue'
        AND status = 'pending'
    );
END;
$$ LANGUAGE plpgsql;

-- Sample data
INSERT INTO hrms_i9_forms (tenant_id, employee_id, form_version, status, compliance_status, section1_completed_at, section2_completed_at, first_name, last_name, citizenship_status, everify_status, ai_validation_score, blockchain_hash, blockchain_verified_at, created_by, updated_by)
SELECT 
  t.id,
  e.id,
  '08/01/23',
  CASE 
    WHEN random() < 0.85 THEN 'complete'
    WHEN random() < 0.95 THEN 'section2_complete'
    ELSE 'reverify_required'
  END,
  CASE 
    WHEN random() < 0.95 THEN 'compliant'
    ELSE 'pending_reverification'
  END,
  NOW() - (random() * INTERVAL '365 days'),
  NOW() - (random() * INTERVAL '360 days'),
  e.first_name,
  e.last_name,
  CASE 
    WHEN random() < 0.7 THEN 'citizen'
    WHEN random() < 0.85 THEN 'lawful_permanent_resident'
    ELSE 'alien_authorized'
  END,
  CASE 
    WHEN random() < 0.9 THEN 'employment_authorized'
    ELSE 'pending'
  END,
  0.85 + (random() * 0.15),
  md5(random()::text),
  NOW() - (random() * INTERVAL '350 days'),
  (SELECT id FROM auth.users LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1)
FROM tenants t
CROSS JOIN LATERAL (
  SELECT id, first_name, last_name
  FROM hrms_employees
  WHERE tenant_id = t.id
  LIMIT 10
) e
LIMIT 50;
