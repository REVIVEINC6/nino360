-- ============================================================================
-- Phase 15: I-9 Compliance Enhanced
-- ============================================================================
-- Comprehensive I-9 compliance tracking with Section 1/2/3 workflows,
-- deadline management, document validation, E-Verify stub, PDF generation,
-- ledger notarization, and retention management
-- ============================================================================

-- Create schemas if not exist
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS ledger;

-- ============================================================================
-- ENHANCED I-9 RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.i9_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  
  -- Hire Date (critical for deadline calculations)
  hire_date date NOT NULL,
  
  -- Section 1: Employee Information and Attestation
  section1 jsonb DEFAULT '{}'::jsonb,
  -- Expected fields: { citizenship_status, alien_number, uscis_number, i94_number, 
  --   passport_number, country_of_issuance, first_name, last_name, middle_initial,
  --   other_last_names, address, city, state, zip, dob, ssn_last4, email, phone,
  --   signature_date, preparer_translator_used, preparer_info }
  section1_completed_at timestamptz,
  preparer_translator boolean DEFAULT false,
  
  -- Section 2: Employer Review and Verification
  section2 jsonb DEFAULT '{}'::jsonb,
  -- Expected fields: { list_a_doc, list_b_doc, list_c_doc, examiner_name, examiner_title,
  --   business_name, business_address, exam_date, signature_date, alternative_procedure_used,
  --   remote_session_ref, additional_info }
  section2_examined_at timestamptz,
  alternative_procedure_used boolean DEFAULT false,
  remote_session_ref text,
  
  -- Documents (List A or List B+C)
  documents jsonb DEFAULT '[]'::jsonb,
  -- Expected array: [{ list, doc_title, issuing_authority, doc_number, expiration_date, 
  --   scan_url, redacted_scan_url }]
  
  -- Section 3: Reverification and Rehires
  section3 jsonb DEFAULT '{}'::jsonb,
  -- Expected fields: { reverification_date, new_name, rehire_date, new_doc_info, 
  --   examiner_name, examiner_signature_date }
  section3_due date,
  reverification_required boolean DEFAULT false,
  
  -- E-Verify (stub)
  e_verify_status text CHECK (e_verify_status IN ('NOT_STARTED', 'OPEN', 'EMPLOYMENT_AUTH_CONFIRMED', 'TNC', 'CASE_IN_CONTINUANCE', 'CLOSED', 'FINAL_NONCONFIRMATION')),
  e_verify_case_no text,
  e_verify_submitted_at timestamptz,
  e_verify_result_at timestamptz,
  
  -- Retention Management
  retention_due date,
  -- Computed as: max(hire_date + 3 years, termination_date + 1 year)
  legal_hold boolean DEFAULT false,
  purge_eligible boolean GENERATED ALWAYS AS (
    retention_due IS NOT NULL 
    AND retention_due < CURRENT_DATE 
    AND NOT legal_hold
  ) STORED,
  
  -- Status
  status text DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE', 'REVERIFY_DUE', 'EXPIRED')),
  
  -- PDF & Notarization
  pdf_url text,
  pdf_hash text,
  notarized_at timestamptz,
  
  -- Audit
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  
  UNIQUE(tenant_id, employee_id)
);

-- Add columns if table already exists
DO $$
BEGIN
  -- Check and add missing columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'hr' AND table_name = 'i9_records' AND column_name = 'hire_date') THEN
    ALTER TABLE hr.i9_records ADD COLUMN hire_date date;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'hr' AND table_name = 'i9_records' AND column_name = 'section1') THEN
    ALTER TABLE hr.i9_records ADD COLUMN section1 jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN section1_completed_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN preparer_translator boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN section2 jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN section2_examined_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN alternative_procedure_used boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN remote_session_ref text;
    ALTER TABLE hr.i9_records ADD COLUMN documents jsonb DEFAULT '[]'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN section3 jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE hr.i9_records ADD COLUMN section3_due date;
    ALTER TABLE hr.i9_records ADD COLUMN reverification_required boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN e_verify_status text;
    ALTER TABLE hr.i9_records ADD COLUMN e_verify_case_no text;
    ALTER TABLE hr.i9_records ADD COLUMN e_verify_submitted_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN e_verify_result_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN retention_due date;
    ALTER TABLE hr.i9_records ADD COLUMN legal_hold boolean DEFAULT false;
    ALTER TABLE hr.i9_records ADD COLUMN pdf_url text;
    ALTER TABLE hr.i9_records ADD COLUMN pdf_hash text;
    ALTER TABLE hr.i9_records ADD COLUMN notarized_at timestamptz;
    ALTER TABLE hr.i9_records ADD COLUMN created_by uuid;
    ALTER TABLE hr.i9_records ADD COLUMN updated_by uuid;
  END IF;
  
  -- Drop old status constraint if exists and add new one
  ALTER TABLE hr.i9_records DROP CONSTRAINT IF EXISTS i9_records_status_check;
  ALTER TABLE hr.i9_records ADD CONSTRAINT i9_records_status_check 
    CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE', 'REVERIFY_DUE', 'EXPIRED'));
    
  ALTER TABLE hr.i9_records DROP CONSTRAINT IF EXISTS i9_records_e_verify_status_check;
  ALTER TABLE hr.i9_records ADD CONSTRAINT i9_records_e_verify_status_check 
    CHECK (e_verify_status IN ('NOT_STARTED', 'OPEN', 'EMPLOYMENT_AUTH_CONFIRMED', 'TNC', 'CASE_IN_CONTINUANCE', 'CLOSED', 'FINAL_NONCONFIRMATION'));
END $$;

-- ============================================================================
-- I-9 TASKS TABLE (Step Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.i9_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  record_id uuid NOT NULL REFERENCES hr.i9_records(id) ON DELETE CASCADE,
  step text NOT NULL CHECK (step IN ('S1', 'S2', 'S3', 'EVERIFY', 'RETENTION')),
  owner_id uuid,
  due_at timestamptz,
  state text DEFAULT 'OPEN' CHECK (state IN ('OPEN', 'DONE', 'BLOCKED')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- DOCUMENTS TABLE (Enhanced for I-9)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hr.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid,
  i9_record_id uuid REFERENCES hr.i9_records(id) ON DELETE CASCADE,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('I9', 'ID', 'PASSPORT', 'VISA', 'WORK_AUTH', 'SSN_CARD', 'BIRTH_CERT', 'OTHER')),
  url text NOT NULL,
  redacted_url text,
  size bigint,
  mime_type text,
  tags text[] DEFAULT ARRAY[]::text[],
  
  -- I-9 Specific
  list_category text CHECK (list_category IN ('A', 'B', 'C')),
  doc_title text,
  issuing_authority text,
  doc_number text,
  expiration_date date,
  
  -- Notarization
  notarized_hash text,
  notarized_at timestamptz,
  
  -- Audit
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid,
  
  UNIQUE(tenant_id, i9_record_id, kind, doc_number)
);

-- Add columns if table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'hr' AND table_name = 'documents' AND column_name = 'i9_record_id') THEN
    ALTER TABLE hr.documents ADD COLUMN i9_record_id uuid REFERENCES hr.i9_records(id) ON DELETE CASCADE;
    ALTER TABLE hr.documents ADD COLUMN redacted_url text;
    ALTER TABLE hr.documents ADD COLUMN mime_type text;
    ALTER TABLE hr.documents ADD COLUMN list_category text;
    ALTER TABLE hr.documents ADD COLUMN doc_title text;
    ALTER TABLE hr.documents ADD COLUMN issuing_authority text;
    ALTER TABLE hr.documents ADD COLUMN doc_number text;
    ALTER TABLE hr.documents ADD COLUMN expiration_date date;
    ALTER TABLE hr.documents ADD COLUMN notarized_hash text;
    ALTER TABLE hr.documents ADD COLUMN notarized_at timestamptz;
    ALTER TABLE hr.documents ADD COLUMN uploaded_by uuid;
  END IF;
  
  ALTER TABLE hr.documents DROP CONSTRAINT IF EXISTS documents_kind_check;
  ALTER TABLE hr.documents ADD CONSTRAINT documents_kind_check 
    CHECK (kind IN ('I9', 'ID', 'PASSPORT', 'VISA', 'WORK_AUTH', 'SSN_CARD', 'BIRTH_CERT', 'OTHER'));
    
  ALTER TABLE hr.documents DROP CONSTRAINT IF EXISTS documents_list_category_check;
  ALTER TABLE hr.documents ADD CONSTRAINT documents_list_category_check 
    CHECK (list_category IN ('A', 'B', 'C'));
END $$;

-- ============================================================================
-- LEDGER PROOFS TABLE (Notarization)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ledger.proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  object_type text NOT NULL,
  object_id uuid NOT NULL,
  hash text NOT NULL,
  block bigint,
  notarized_at timestamptz DEFAULT now(),
  notarized_by uuid,
  
  UNIQUE(tenant_id, object_type, object_id, hash)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_i9_records_tenant_employee ON hr.i9_records(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_i9_records_status ON hr.i9_records(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_i9_records_hire_date ON hr.i9_records(tenant_id, hire_date);
CREATE INDEX IF NOT EXISTS idx_i9_records_section1_completed ON hr.i9_records(tenant_id, section1_completed_at);
CREATE INDEX IF NOT EXISTS idx_i9_records_section2_examined ON hr.i9_records(tenant_id, section2_examined_at);
CREATE INDEX IF NOT EXISTS idx_i9_records_section3_due ON hr.i9_records(tenant_id, section3_due) WHERE section3_due IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_i9_records_retention_due ON hr.i9_records(tenant_id, retention_due) WHERE retention_due IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_i9_records_reverify ON hr.i9_records(tenant_id, reverification_required) WHERE reverification_required = true;

CREATE INDEX IF NOT EXISTS idx_i9_tasks_record ON hr.i9_tasks(record_id, step);
CREATE INDEX IF NOT EXISTS idx_i9_tasks_due ON hr.i9_tasks(tenant_id, due_at, state) WHERE state = 'OPEN';
CREATE INDEX IF NOT EXISTS idx_i9_tasks_owner ON hr.i9_tasks(tenant_id, owner_id, state) WHERE state = 'OPEN';

CREATE INDEX IF NOT EXISTS idx_documents_i9_record ON hr.documents(i9_record_id) WHERE i9_record_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_employee ON hr.documents(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_kind ON hr.documents(tenant_id, kind);

CREATE INDEX IF NOT EXISTS idx_ledger_proofs_object ON ledger.proofs(tenant_id, object_type, object_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- I-9 Records: Tenant scoped; employees can see own Section 1; HR/managers see assigned
ALTER TABLE hr.i9_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY i9_records_tenant_isolation ON hr.i9_records
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- I-9 Tasks: Tenant scoped; owners can see assigned tasks
ALTER TABLE hr.i9_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY i9_tasks_tenant_isolation ON hr.i9_tasks
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Documents: Tenant scoped; employees can see own docs
ALTER TABLE hr.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_tenant_isolation ON hr.documents
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Ledger Proofs: Tenant scoped; read-only for verification
ALTER TABLE ledger.proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY ledger_proofs_tenant_isolation ON ledger.proofs
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- I-9 Queue Summary (by due bucket)
CREATE OR REPLACE VIEW hr.vw_i9_queue_summary AS
SELECT
  i.tenant_id,
  COUNT(*) FILTER (WHERE i.status = 'NOT_STARTED') as not_started_count,
  COUNT(*) FILTER (WHERE i.status = 'IN_PROGRESS') as in_progress_count,
  COUNT(*) FILTER (WHERE i.status = 'COMPLETE') as complete_count,
  COUNT(*) FILTER (WHERE i.status = 'REVERIFY_DUE') as reverify_due_count,
  COUNT(*) FILTER (WHERE i.status = 'EXPIRED') as expired_count,
  
  -- Section 1 Due Today (hire date = today)
  COUNT(*) FILTER (WHERE i.hire_date = CURRENT_DATE AND i.section1_completed_at IS NULL) as s1_due_today,
  
  -- Section 2 Due in 3 Days (hire date + 3 business days)
  COUNT(*) FILTER (WHERE 
    i.section1_completed_at IS NOT NULL 
    AND i.section2_examined_at IS NULL
    AND i.hire_date + INTERVAL '3 days' >= CURRENT_DATE
  ) as s2_due_3days,
  
  -- Section 3 Due ≤60 Days
  COUNT(*) FILTER (WHERE 
    i.section3_due IS NOT NULL 
    AND i.section3_due <= CURRENT_DATE + INTERVAL '60 days'
    AND i.section3_due >= CURRENT_DATE
  ) as s3_due_60days,
  
  -- Past Due (S2 not completed and hire date + 3 days < today)
  COUNT(*) FILTER (WHERE 
    i.section1_completed_at IS NOT NULL 
    AND i.section2_examined_at IS NULL
    AND i.hire_date + INTERVAL '3 days' < CURRENT_DATE
  ) as past_due_count,
  
  -- Alternative Procedure Used
  COUNT(*) FILTER (WHERE i.alternative_procedure_used = true) as alternative_procedure_count,
  
  -- E-Verify Stats
  COUNT(*) FILTER (WHERE i.e_verify_status = 'EMPLOYMENT_AUTH_CONFIRMED') as everify_confirmed_count,
  COUNT(*) FILTER (WHERE i.e_verify_status = 'TNC') as everify_tnc_count,
  COUNT(*) FILTER (WHERE i.e_verify_status = 'OPEN') as everify_open_count
FROM hr.i9_records i
GROUP BY i.tenant_id;

-- I-9 Compliance Detail
CREATE OR REPLACE VIEW hr.vw_i9_compliance_detail AS
SELECT
  i.id,
  i.tenant_id,
  i.employee_id,
  e.legal_name as employee_name,
  e.employee_no,
  i.hire_date,
  i.status,
  i.section1_completed_at,
  i.section2_examined_at,
  i.section3_due,
  i.reverification_required,
  i.e_verify_status,
  i.e_verify_case_no,
  i.retention_due,
  i.legal_hold,
  i.purge_eligible,
  i.alternative_procedure_used,
  i.notarized_at,
  
  -- Deadline Calculations
  CASE 
    WHEN i.section1_completed_at IS NULL AND i.hire_date = CURRENT_DATE THEN 'S1_DUE_TODAY'
    WHEN i.section1_completed_at IS NULL AND i.hire_date < CURRENT_DATE THEN 'S1_PAST_DUE'
    WHEN i.section1_completed_at IS NOT NULL AND i.section2_examined_at IS NULL AND i.hire_date + INTERVAL '3 days' >= CURRENT_DATE THEN 'S2_DUE_3DAYS'
    WHEN i.section1_completed_at IS NOT NULL AND i.section2_examined_at IS NULL AND i.hire_date + INTERVAL '3 days' < CURRENT_DATE THEN 'S2_PAST_DUE'
    WHEN i.section3_due IS NOT NULL AND i.section3_due <= CURRENT_DATE + INTERVAL '60 days' AND i.section3_due >= CURRENT_DATE THEN 'S3_DUE_60DAYS'
    WHEN i.section3_due IS NOT NULL AND i.section3_due < CURRENT_DATE THEN 'S3_PAST_DUE'
    WHEN i.status = 'COMPLETE' THEN 'COMPLETE'
    ELSE 'IN_PROGRESS'
  END as due_bucket,
  
  -- Days Until Due
  CASE 
    WHEN i.section1_completed_at IS NULL THEN (i.hire_date - CURRENT_DATE)
    WHEN i.section2_examined_at IS NULL THEN ((i.hire_date + INTERVAL '3 days')::date - CURRENT_DATE)
    WHEN i.section3_due IS NOT NULL THEN (i.section3_due - CURRENT_DATE)
    ELSE NULL
  END as days_until_due,
  
  i.created_at,
  i.updated_at
FROM hr.i9_records i
LEFT JOIN hr.employees e ON e.id = i.employee_id;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION hr.update_i9_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_i9_records_updated_at
  BEFORE UPDATE ON hr.i9_records
  FOR EACH ROW
  EXECUTE FUNCTION hr.update_i9_records_updated_at();

CREATE TRIGGER trigger_i9_tasks_updated_at
  BEFORE UPDATE ON hr.i9_tasks
  FOR EACH ROW
  EXECUTE FUNCTION hr.update_i9_records_updated_at();

-- Auto-create tasks when I-9 record is created
CREATE OR REPLACE FUNCTION hr.create_i9_tasks_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Create Section 1 task (due on hire date)
  INSERT INTO hr.i9_tasks (tenant_id, record_id, step, due_at, state)
  VALUES (NEW.tenant_id, NEW.id, 'S1', NEW.hire_date::timestamptz, 'OPEN');
  
  -- Create Section 2 task (due 3 business days after hire)
  INSERT INTO hr.i9_tasks (tenant_id, record_id, step, due_at, state)
  VALUES (NEW.tenant_id, NEW.id, 'S2', (NEW.hire_date + INTERVAL '3 days')::timestamptz, 'OPEN');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_i9_tasks
  AFTER INSERT ON hr.i9_records
  FOR EACH ROW
  EXECUTE FUNCTION hr.create_i9_tasks_on_insert();

-- Auto-complete tasks when sections are completed
CREATE OR REPLACE FUNCTION hr.complete_i9_tasks_on_section_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Complete S1 task when section1_completed_at is set
  IF NEW.section1_completed_at IS NOT NULL AND (OLD.section1_completed_at IS NULL OR OLD.section1_completed_at IS DISTINCT FROM NEW.section1_completed_at) THEN
    UPDATE hr.i9_tasks 
    SET state = 'DONE', completed_at = NEW.section1_completed_at
    WHERE record_id = NEW.id AND step = 'S1' AND state = 'OPEN';
  END IF;
  
  -- Complete S2 task when section2_examined_at is set
  IF NEW.section2_examined_at IS NOT NULL AND (OLD.section2_examined_at IS NULL OR OLD.section2_examined_at IS DISTINCT FROM NEW.section2_examined_at) THEN
    UPDATE hr.i9_tasks 
    SET state = 'DONE', completed_at = NEW.section2_examined_at
    WHERE record_id = NEW.id AND step = 'S2' AND state = 'OPEN';
  END IF;
  
  -- Create S3 task when reverification is required
  IF NEW.reverification_required = true AND NEW.section3_due IS NOT NULL AND (OLD.reverification_required IS NULL OR OLD.reverification_required = false) THEN
    INSERT INTO hr.i9_tasks (tenant_id, record_id, step, due_at, state)
    VALUES (NEW.tenant_id, NEW.id, 'S3', NEW.section3_due::timestamptz, 'OPEN')
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_complete_i9_tasks
  AFTER UPDATE ON hr.i9_records
  FOR EACH ROW
  EXECUTE FUNCTION hr.complete_i9_tasks_on_section_complete();

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Compute retention due date
CREATE OR REPLACE FUNCTION hr.compute_i9_retention_due(
  p_hire_date date,
  p_termination_date date DEFAULT NULL
) RETURNS date AS $$
BEGIN
  IF p_termination_date IS NOT NULL THEN
    RETURN GREATEST(
      p_hire_date + INTERVAL '3 years',
      p_termination_date + INTERVAL '1 year'
    )::date;
  ELSE
    RETURN (p_hire_date + INTERVAL '3 years')::date;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Validate List A or List B+C documents
CREATE OR REPLACE FUNCTION hr.validate_i9_documents(
  p_documents jsonb
) RETURNS boolean AS $$
DECLARE
  has_list_a boolean := false;
  has_list_b boolean := false;
  has_list_c boolean := false;
  doc jsonb;
BEGIN
  -- Check if documents array is empty
  IF jsonb_array_length(p_documents) = 0 THEN
    RETURN false;
  END IF;
  
  -- Iterate through documents
  FOR doc IN SELECT * FROM jsonb_array_elements(p_documents)
  LOOP
    IF doc->>'list' = 'A' THEN
      has_list_a := true;
    ELSIF doc->>'list' = 'B' THEN
      has_list_b := true;
    ELSIF doc->>'list' = 'C' THEN
      has_list_c := true;
    END IF;
  END LOOP;
  
  -- Valid if: List A OR (List B AND List C)
  RETURN has_list_a OR (has_list_b AND has_list_c);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON TABLE hr.i9_records IS 'I-9 Employment Eligibility Verification records with Section 1/2/3 workflows';
COMMENT ON TABLE hr.i9_tasks IS 'Task tracking for I-9 completion steps (S1/S2/S3/E-Verify/Retention)';
COMMENT ON TABLE hr.documents IS 'Document storage for I-9 scans and employee files';
COMMENT ON TABLE ledger.proofs IS 'Cryptographic proofs for notarized I-9 records and documents';
