-- ============================================================================
-- Phase 14: HRMS Immigration Enhanced
-- ============================================================================
-- Enhances immigration tracking with AI-powered document OCR, compliance
-- scoring, expiration alerts, and E-Verify integration
-- ============================================================================

-- Create hr schema if not exists
CREATE SCHEMA IF NOT EXISTS hr;

-- Create sec schema and functions if not exists
CREATE SCHEMA IF NOT EXISTS sec;

CREATE OR REPLACE FUNCTION sec.current_tenant_id() RETURNS uuid AS $$
  SELECT current_setting('app.current_tenant_id', true)::uuid;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION sec.has_feature(flag text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM feature_flags 
    WHERE key = flag 
    AND tenant_id = sec.current_tenant_id() 
    AND enabled = true
  );
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- ENHANCED IMMIGRATION CASES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.immigration_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  case_type text NOT NULL CHECK (case_type IN ('H1B', 'L1', 'L2', 'TN', 'E3', 'O1', 'H4_EAD', 'GREEN_CARD', 'CITIZENSHIP', 'OTHER')),
  case_number text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'filed', 'rfe', 'approved', 'denied', 'withdrawn', 'closed', 'expired')),
  priority_date date,
  filing_date date,
  approval_date date,
  expiry_date date,
  
  -- Attorney/Law Firm
  attorney_name text,
  attorney_firm text,
  attorney_email text,
  attorney_phone text,
  
  -- USCIS Details
  receipt_number text,
  uscis_case_status text,
  last_status_check timestamptz,
  
  -- RFE Tracking
  rfe_received_date date,
  rfe_response_due_date date,
  rfe_response_submitted_date date,
  rfe_description text,
  
  -- Compliance & Risk
  compliance_score integer CHECK (compliance_score BETWEEN 0 AND 100),
  risk_level text CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  expiration_alert_sent boolean DEFAULT false,
  days_until_expiry integer GENERATED ALWAYS AS (
    CASE 
      WHEN expiry_date IS NOT NULL THEN (expiry_date - CURRENT_DATE)
      ELSE NULL
    END
  ) STORED,
  
  -- Documents
  petition_pdf_url text,
  approval_notice_url text,
  i94_url text,
  
  -- AI Processing
  ocr_processed boolean DEFAULT false,
  ocr_confidence_score numeric(5,2),
  ocr_extracted_data jsonb DEFAULT '{}'::jsonb,
  
  -- Audit
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Add columns if table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'hr' AND table_name = 'immigration_cases' AND column_name = 'attorney_name') THEN
    ALTER TABLE hr.immigration_cases ADD COLUMN attorney_name text;
    ALTER TABLE hr.immigration_cases ADD COLUMN attorney_firm text;
    ALTER TABLE hr.immigration_cases ADD COLUMN attorney_email text;
    ALTER TABLE hr.immigration_cases ADD COLUMN attorney_phone text;
    ALTER TABLE hr.immigration_cases ADD COLUMN receipt_number text;
    ALTER TABLE hr.immigration_cases ADD COLUMN uscis_case_status text;
    ALTER TABLE hr.immigration_cases ADD COLUMN last_status_check timestamptz;
    ALTER TABLE hr.immigration_cases ADD COLUMN rfe_received_date date;
    ALTER TABLE hr.immigration_cases ADD COLUMN rfe_response_due_date date;
    ALTER TABLE hr.immigration_cases ADD COLUMN rfe_response_submitted_date date;
    ALTER TABLE hr.immigration_cases ADD COLUMN rfe_description text;
    ALTER TABLE hr.immigration_cases ADD COLUMN compliance_score integer CHECK (compliance_score BETWEEN 0 AND 100);
    ALTER TABLE hr.immigration_cases ADD COLUMN risk_level text CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));
    ALTER TABLE hr.immigration_cases ADD COLUMN expiration_alert_sent boolean DEFAULT false;
    ALTER TABLE hr.immigration_cases ADD COLUMN petition_pdf_url text;
    ALTER TABLE hr.immigration_cases ADD COLUMN approval_notice_url text;
    ALTER TABLE hr.immigration_cases ADD COLUMN i94_url text;
    ALTER TABLE hr.immigration_cases ADD COLUMN ocr_processed boolean DEFAULT false;
    ALTER TABLE hr.immigration_cases ADD COLUMN ocr_confidence_score numeric(5,2);
    ALTER TABLE hr.immigration_cases ADD COLUMN ocr_extracted_data jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE hr.immigration_cases ADD COLUMN created_by uuid;
    ALTER TABLE hr.immigration_cases ADD COLUMN updated_by uuid;
  END IF;
END $$;

-- ============================================================================
-- ENHANCED I-9 RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.i9_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  
  -- Section 1: Employee Information
  section1_completed_at timestamptz,
  section1_completed_by uuid,
  citizenship_status text CHECK (citizenship_status IN ('US_CITIZEN', 'NON_CITIZEN_NATIONAL', 'LAWFUL_PERMANENT_RESIDENT', 'ALIEN_AUTHORIZED')),
  alien_number text,
  uscis_number text,
  i94_admission_number text,
  foreign_passport_number text,
  country_of_issuance text,
  
  -- Section 2: Employer Review and Verification
  section2_completed_at timestamptz,
  section2_completed_by uuid,
  doc_list_a_type text, -- Passport, I-551, I-766, etc.
  doc_list_a_number text,
  doc_list_a_expiry date,
  doc_list_b_type text, -- Driver's License, State ID, etc.
  doc_list_b_number text,
  doc_list_b_expiry date,
  doc_list_c_type text, -- Social Security Card, Birth Certificate, etc.
  doc_list_c_number text,
  doc_list_c_expiry date,
  
  -- Section 3: Reverification
  section3_completed_at timestamptz,
  section3_completed_by uuid,
  reverification_due_date date,
  reverification_completed boolean DEFAULT false,
  
  -- E-Verify
  everify_case_number text,
  everify_status text CHECK (everify_status IN ('not_submitted', 'pending', 'employment_authorized', 'tnc', 'fnc', 'case_closed')),
  everify_submitted_at timestamptz,
  everify_result_received_at timestamptz,
  everify_tnc_date date, -- Tentative Non-Confirmation
  everify_tnc_response_due_date date,
  
  -- Documents
  form_pdf_url text,
  supporting_docs_urls jsonb DEFAULT '[]'::jsonb,
  
  -- AI Processing
  ocr_processed boolean DEFAULT false,
  ocr_confidence_score numeric(5,2),
  ocr_extracted_data jsonb DEFAULT '{}'::jsonb,
  
  -- Compliance
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'reverify_due', 'expired', 'non_compliant')),
  compliance_score integer CHECK (compliance_score BETWEEN 0 AND 100),
  audit_trail jsonb DEFAULT '[]'::jsonb,
  
  -- Audit
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Add columns if table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'hr' AND table_name = 'i9_records' AND column_name = 'citizenship_status') THEN
    ALTER TABLE hr.i9_records ADD COLUMN citizenship_status text CHECK (citizenship_status IN ('US_CITIZEN', 'NON_CITIZEN_NATIONAL', 'LAWFUL_PERMANENT_RESIDENT', 'ALIEN_AUTHORIZED'));
    ALTER TABLE hr.i9_records ADD COLUMN alien_number text;
    ALTER TABLE hr.i9_records ADD COLUMN uscis_number text;
    ALTER TABLE hr.i9_records ADD COLUMN i94_admission_number text;
    ALTER TABLE hr.i9_records ADD COLUMN foreign_passport_number text;
    ALTER TABLE hr.i9_records ADD COLUMN country_of_issuance text;
    ALTER TABLE hr.i9_records ADD COLUMN section1_completed_by uuid;
    ALTER TABLE hr.i9_records ADD COLUMN section2_completed_by uuid;
    ALTER TABLE hr.i9_records ADD COLUMN section3_completed_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN section3_completed_by uuid;
    ALTER TABLE hr.i9_records ADD COLUMN reverification_due_date date;
    ALTER TABLE hr.i9_records ADD COLUMN reverification_completed boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_a_type text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_a_number text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_a_expiry date;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_b_type text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_b_number text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_b_expiry date;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_c_type text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_c_number text;
    ALTER TABLE hr.i9_records ADD COLUMN doc_list_c_expiry date;
    ALTER TABLE hr.i9_records ADD COLUMN everify_case_number text;
    ALTER TABLE hr.i9_records ADD COLUMN everify_status text CHECK (everify_status IN ('not_submitted', 'pending', 'employment_authorized', 'tnc', 'fnc', 'case_closed'));
    ALTER TABLE hr.i9_records ADD COLUMN everify_submitted_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN everify_result_received_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN everify_tnc_date date;
    ALTER TABLE hr.i9_records ADD COLUMN everify_tnc_response_due_date date;
    ALTER TABLE hr.i9_records ADD COLUMN form_pdf_url text;
    ALTER TABLE hr.i9_records ADD COLUMN supporting_docs_urls jsonb DEFAULT '[]'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN ocr_processed boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN ocr_confidence_score numeric(5,2);
    ALTER TABLE hr.i9_records ADD COLUMN ocr_extracted_data jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN compliance_score integer CHECK (compliance_score BETWEEN 0 AND 100);
    ALTER TABLE hr.i9_records ADD COLUMN audit_trail jsonb DEFAULT '[]'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN created_by uuid;
    ALTER TABLE hr.i9_records ADD COLUMN updated_by uuid;
  END IF;
END $$;

-- ============================================================================
-- IMMIGRATION ALERTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.immigration_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  case_id uuid REFERENCES hr.immigration_cases(id) ON DELETE CASCADE,
  i9_id uuid REFERENCES hr.i9_records(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('expiration_90_days', 'expiration_60_days', 'expiration_30_days', 'rfe_due', 'everify_tnc', 'reverification_due', 'compliance_issue')),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message text NOT NULL,
  action_required text,
  due_date date,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_immigration_cases_tenant ON hr.immigration_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_employee ON hr.immigration_cases(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_expiry ON hr.immigration_cases(tenant_id, expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_immigration_cases_status ON hr.immigration_cases(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_immigration_cases_rfe ON hr.immigration_cases(tenant_id, rfe_response_due_date) WHERE rfe_response_due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_i9_records_tenant ON hr.i9_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_i9_records_employee ON hr.i9_records(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_i9_records_reverify ON hr.i9_records(tenant_id, reverification_due_date) WHERE reverification_due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_i9_records_everify ON hr.i9_records(tenant_id, everify_status);

CREATE INDEX IF NOT EXISTS idx_immigration_alerts_tenant ON hr.immigration_alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_immigration_alerts_employee ON hr.immigration_alerts(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_immigration_alerts_unresolved ON hr.immigration_alerts(tenant_id, resolved) WHERE resolved = false;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE hr.immigration_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.i9_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.immigration_alerts ENABLE ROW LEVEL SECURITY;

-- Immigration Cases Policies
DROP POLICY IF EXISTS immigration_cases_read ON hr.immigration_cases;
CREATE POLICY immigration_cases_read ON hr.immigration_cases
  FOR SELECT USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS immigration_cases_write ON hr.immigration_cases;
CREATE POLICY immigration_cases_write ON hr.immigration_cases
  FOR ALL USING (tenant_id = sec.current_tenant_id() AND sec.has_feature('hrms.immigration'));

-- I-9 Records Policies
DROP POLICY IF EXISTS i9_records_read ON hr.i9_records;
CREATE POLICY i9_records_read ON hr.i9_records
  FOR SELECT USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS i9_records_write ON hr.i9_records;
CREATE POLICY i9_records_write ON hr.i9_records
  FOR ALL USING (tenant_id = sec.current_tenant_id() AND sec.has_feature('hrms.i9'));

-- Immigration Alerts Policies
DROP POLICY IF EXISTS immigration_alerts_read ON hr.immigration_alerts;
CREATE POLICY immigration_alerts_read ON hr.immigration_alerts
  FOR SELECT USING (tenant_id = sec.current_tenant_id());

DROP POLICY IF EXISTS immigration_alerts_write ON hr.immigration_alerts;
CREATE POLICY immigration_alerts_write ON hr.immigration_alerts
  FOR ALL USING (tenant_id = sec.current_tenant_id() AND sec.has_feature('hrms.immigration'));

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Immigration Cases Summary
CREATE OR REPLACE VIEW hr.vw_immigration_summary AS
SELECT
  tenant_id,
  COUNT(*) as total_cases,
  COUNT(*) FILTER (WHERE status = 'filed') as filed_cases,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_cases,
  COUNT(*) FILTER (WHERE status = 'rfe') as rfe_cases,
  COUNT(*) FILTER (WHERE days_until_expiry <= 90 AND days_until_expiry > 0) as expiring_soon,
  COUNT(*) FILTER (WHERE days_until_expiry <= 30 AND days_until_expiry > 0) as expiring_critical,
  COUNT(*) FILTER (WHERE rfe_response_due_date IS NOT NULL AND rfe_response_due_date >= CURRENT_DATE) as pending_rfe_responses,
  AVG(compliance_score) as avg_compliance_score
FROM hr.immigration_cases
WHERE status NOT IN ('closed', 'withdrawn', 'denied')
GROUP BY tenant_id;

-- I-9 Compliance Summary
CREATE OR REPLACE VIEW hr.vw_i9_compliance_summary AS
SELECT
  tenant_id,
  COUNT(*) as total_i9_records,
  COUNT(*) FILTER (WHERE status = 'complete') as complete_records,
  COUNT(*) FILTER (WHERE status = 'reverify_due') as reverify_due,
  COUNT(*) FILTER (WHERE everify_status = 'employment_authorized') as everify_authorized,
  COUNT(*) FILTER (WHERE everify_status = 'tnc') as everify_tnc,
  COUNT(*) FILTER (WHERE reverification_due_date <= CURRENT_DATE + INTERVAL '30 days' AND reverification_due_date > CURRENT_DATE) as reverify_due_30_days,
  AVG(compliance_score) as avg_compliance_score
FROM hr.i9_records
WHERE status NOT IN ('expired', 'non_compliant')
GROUP BY tenant_id;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION hr.update_immigration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS immigration_cases_updated_at ON hr.immigration_cases;
CREATE TRIGGER immigration_cases_updated_at
  BEFORE UPDATE ON hr.immigration_cases
  FOR EACH ROW
  EXECUTE FUNCTION hr.update_immigration_updated_at();

DROP TRIGGER IF EXISTS i9_records_updated_at ON hr.i9_records;
CREATE TRIGGER i9_records_updated_at
  BEFORE UPDATE ON hr.i9_records
  FOR EACH ROW
  EXECUTE FUNCTION hr.update_immigration_updated_at();

-- Auto-generate alerts for expiring cases
CREATE OR REPLACE FUNCTION hr.generate_expiration_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- 90 days alert
  IF NEW.expiry_date IS NOT NULL AND (NEW.expiry_date - CURRENT_DATE) = 90 THEN
    INSERT INTO hr.immigration_alerts (tenant_id, employee_id, case_id, alert_type, severity, message, due_date)
    VALUES (NEW.tenant_id, NEW.employee_id, NEW.id, 'expiration_90_days', 'warning', 
            'Immigration case expires in 90 days', NEW.expiry_date);
  END IF;
  
  -- 60 days alert
  IF NEW.expiry_date IS NOT NULL AND (NEW.expiry_date - CURRENT_DATE) = 60 THEN
    INSERT INTO hr.immigration_alerts (tenant_id, employee_id, case_id, alert_type, severity, message, due_date)
    VALUES (NEW.tenant_id, NEW.employee_id, NEW.id, 'expiration_60_days', 'warning', 
            'Immigration case expires in 60 days', NEW.expiry_date);
  END IF;
  
  -- 30 days alert
  IF NEW.expiry_date IS NOT NULL AND (NEW.expiry_date - CURRENT_DATE) = 30 THEN
    INSERT INTO hr.immigration_alerts (tenant_id, employee_id, case_id, alert_type, severity, message, due_date)
    VALUES (NEW.tenant_id, NEW.employee_id, NEW.id, 'expiration_30_days', 'critical', 
            'Immigration case expires in 30 days - URGENT', NEW.expiry_date);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS immigration_expiration_alerts ON hr.immigration_cases;
CREATE TRIGGER immigration_expiration_alerts
  AFTER INSERT OR UPDATE OF expiry_date ON hr.immigration_cases
  FOR EACH ROW
  EXECUTE FUNCTION hr.generate_expiration_alerts();
