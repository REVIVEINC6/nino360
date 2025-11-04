-- ============================================================================
-- Nino360 HRMS Invoices Enhancement (Phase 12)
-- ============================================================================
-- Adds comprehensive client invoicing from timesheets with AR tracking
-- ============================================================================

BEGIN;

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS sec;

-- ============================================================================
-- CREATE BASE TABLES IF THEY DON'T EXIST
-- ============================================================================

-- Create finance.invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS finance.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  client_id uuid NOT NULL,
  invoice_no text NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  subtotal numeric(14,2) DEFAULT 0,
  tax_amount numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  paid_amount numeric(14,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  UNIQUE(tenant_id, invoice_no)
);

-- Create finance.invoice_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS finance.invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES finance.invoices(id) ON DELETE CASCADE,
  line_no integer NOT NULL,
  description text NOT NULL,
  amount numeric(14,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(invoice_id, line_no)
);

-- Create finance.clients table if it doesn't exist (referenced by invoices)
CREATE TABLE IF NOT EXISTS finance.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create finance.payments table if it doesn't exist (referenced by trigger)
CREATE TABLE IF NOT EXISTS finance.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  invoice_id uuid NOT NULL REFERENCES finance.invoices(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL,
  received_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ENHANCE INVOICES TABLE WITH ADDITIONAL COLUMNS
-- ============================================================================

DO $$
BEGIN
  -- Add project_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN project_id uuid;
  END IF;

  -- Add period_from if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'period_from'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN period_from date;
  END IF;

  -- Add period_to if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'period_to'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN period_to date;
  END IF;

  -- Add pdf_url if not exists (rename file_url if needed)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'pdf_url'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'file_url'
    ) THEN
      ALTER TABLE finance.invoices RENAME COLUMN file_url TO pdf_url;
    ELSE
      ALTER TABLE finance.invoices ADD COLUMN pdf_url text;
    END IF;
  END IF;

  -- Add discount_total if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'discount_total'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN discount_total numeric(14,2) DEFAULT 0;
  END IF;

  -- Add payment_terms if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'payment_terms'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN payment_terms integer DEFAULT 30;
  END IF;

  -- Add po_number if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'po_number'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN po_number text;
  END IF;

  -- Add sent_at if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'sent_at'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN sent_at timestamptz;
  END IF;

  -- Add approved_at if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN approved_at timestamptz;
  END IF;

  -- Add approved_by if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoices' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE finance.invoices ADD COLUMN approved_by uuid;
  END IF;

  -- Update status check constraint to include new statuses
  ALTER TABLE finance.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
  ALTER TABLE finance.invoices ADD CONSTRAINT invoices_status_check 
    CHECK (status IN ('DRAFT', 'READY', 'SENT', 'PARTIALLY_PAID', 'PAID', 'VOID'));
END $$;

-- ============================================================================
-- ENHANCE INVOICE_LINES TABLE
-- ============================================================================

DO $$
BEGIN
  -- Add assignment_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'assignment_id'
  ) THEN
    ALTER TABLE finance.invoice_lines ADD COLUMN assignment_id uuid;
  END IF;

  -- Add qty_hours if not exists (rename quantity if needed)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'qty_hours'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'quantity'
    ) THEN
      ALTER TABLE finance.invoice_lines RENAME COLUMN quantity TO qty_hours;
    ELSE
      ALTER TABLE finance.invoice_lines ADD COLUMN qty_hours numeric(12,2) DEFAULT 1;
    END IF;
  END IF;

  -- Add unit_rate if not exists (rename unit_price if needed)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'unit_rate'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'unit_price'
    ) THEN
      ALTER TABLE finance.invoice_lines RENAME COLUMN unit_price TO unit_rate;
    ELSE
      ALTER TABLE finance.invoice_lines ADD COLUMN unit_rate numeric(14,2) DEFAULT 0;
    END IF;
  END IF;

  -- Add tax_code if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'tax_code'
  ) THEN
    ALTER TABLE finance.invoice_lines ADD COLUMN tax_code text;
  END IF;

  -- Add gl_account if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'finance' AND table_name = 'invoice_lines' AND column_name = 'gl_account'
  ) THEN
    ALTER TABLE finance.invoice_lines ADD COLUMN gl_account text;
  END IF;
END $$;

-- ============================================================================
-- EXCHANGE RATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance.exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  from_ccy text NOT NULL,
  to_ccy text NOT NULL,
  rate numeric(12,6) NOT NULL,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, from_ccy, to_ccy)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON finance.exchange_rates(date);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON finance.exchange_rates(from_ccy, to_ccy);

-- ============================================================================
-- LEDGER PROOFS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ledger.proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type text NOT NULL,
  object_id uuid NOT NULL,
  hash text NOT NULL,
  block integer,
  notarized_at timestamptz DEFAULT now(),
  UNIQUE(object_type, object_id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_proofs_object ON ledger.proofs(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_ledger_proofs_hash ON ledger.proofs(hash);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE finance.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger.proofs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS exchange_rates_read ON finance.exchange_rates;
CREATE POLICY exchange_rates_read ON finance.exchange_rates 
  FOR SELECT USING (true); -- Public read access

DROP POLICY IF EXISTS exchange_rates_write ON finance.exchange_rates;
CREATE POLICY exchange_rates_write ON finance.exchange_rates 
  FOR ALL USING (sec.has_feature('finance.admin'));

DROP POLICY IF EXISTS ledger_proofs_read ON ledger.proofs;
CREATE POLICY ledger_proofs_read ON ledger.proofs 
  FOR SELECT USING (true); -- Public read access

DROP POLICY IF EXISTS ledger_proofs_write ON ledger.proofs;
CREATE POLICY ledger_proofs_write ON ledger.proofs 
  FOR ALL USING (sec.has_feature('ledger.notarize'));

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- AR Aging Buckets
CREATE OR REPLACE VIEW finance.vw_ar_aging AS
SELECT 
  i.tenant_id,
  i.client_id,
  c.name as client_name,
  SUM(CASE WHEN CURRENT_DATE - i.due_date <= 0 THEN i.total - i.paid_amount ELSE 0 END) as current,
  SUM(CASE WHEN CURRENT_DATE - i.due_date BETWEEN 1 AND 30 THEN i.total - i.paid_amount ELSE 0 END) as days_1_30,
  SUM(CASE WHEN CURRENT_DATE - i.due_date BETWEEN 31 AND 60 THEN i.total - i.paid_amount ELSE 0 END) as days_31_60,
  SUM(CASE WHEN CURRENT_DATE - i.due_date BETWEEN 61 AND 90 THEN i.total - i.paid_amount ELSE 0 END) as days_61_90,
  SUM(CASE WHEN CURRENT_DATE - i.due_date > 90 THEN i.total - i.paid_amount ELSE 0 END) as days_90_plus,
  SUM(i.total - i.paid_amount) as total_outstanding
FROM finance.invoices i
JOIN finance.clients c ON c.id = i.client_id
WHERE i.status IN ('SENT', 'PARTIALLY_PAID')
GROUP BY i.tenant_id, i.client_id, c.name;

-- DSO (Days Sales Outstanding)
CREATE OR REPLACE VIEW finance.vw_dso AS
SELECT 
  i.tenant_id,
  AVG(EXTRACT(DAY FROM (COALESCE(p.received_at, CURRENT_TIMESTAMP) - i.issue_date))) as avg_days_to_payment,
  COUNT(DISTINCT i.id) as invoice_count
FROM finance.invoices i
LEFT JOIN finance.payments p ON p.invoice_id = i.id
WHERE i.status IN ('PAID', 'PARTIALLY_PAID')
  AND i.issue_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY i.tenant_id;

-- Billable Hours Not Yet Invoiced
CREATE OR REPLACE VIEW finance.vw_to_bill AS
SELECT 
  ts.tenant_id,
  a.client_id,
  a.project_id,
  c.name as client_name,
  e.first_name || ' ' || e.last_name as employee_name,
  a.role_title,
  ts.week_start,
  SUM(tsl.hours) as total_hours,
  a.rate->>'value' as rate_value,
  a.rate_type,
  a.currency,
  SUM(tsl.hours * COALESCE((a.rate->>'value')::numeric, 0)) as estimated_amount
FROM hr.timesheets ts
JOIN hr.timesheet_lines tsl ON tsl.timesheet_id = ts.id
JOIN hr.assignments a ON a.id = tsl.assignment_id
JOIN hr.employees e ON e.id = ts.employee_id
LEFT JOIN finance.clients c ON c.id = a.client_id
WHERE ts.status = 'approved'
  AND a.billable = true
  AND NOT EXISTS (
    SELECT 1 FROM finance.invoice_lines il
    WHERE il.assignment_id = a.id
      AND tsl.work_date BETWEEN (SELECT period_from FROM finance.invoices WHERE id = il.invoice_id)
      AND (SELECT period_to FROM finance.invoices WHERE id = il.invoice_id)
  )
GROUP BY ts.tenant_id, a.client_id, a.project_id, c.name, e.first_name, e.last_name, 
         a.role_title, ts.week_start, a.rate, a.rate_type, a.currency;

-- ============================================================================
-- INVOICE NUMBERING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION finance.fn_generate_invoice_number(
  p_tenant_id uuid
) RETURNS text AS $$
DECLARE
  v_tenant_slug text;
  v_year text;
  v_sequence integer;
  v_number text;
BEGIN
  -- Get tenant slug
  SELECT slug INTO v_tenant_slug FROM core.tenants WHERE id = p_tenant_id;
  
  -- Get current year
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get next sequence number for this tenant/year
  SELECT COALESCE(MAX(SUBSTRING(invoice_no FROM '\d+$')::integer), 0) + 1
  INTO v_sequence
  FROM finance.invoices
  WHERE tenant_id = p_tenant_id
    AND invoice_no LIKE v_tenant_slug || '-' || v_year || '-%';
  
  -- Format: TENANTSLUG-YYYY-####
  v_number := v_tenant_slug || '-' || v_year || '-' || LPAD(v_sequence::text, 4, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PAYMENT STATUS UPDATE TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION finance.trg_update_invoice_status() RETURNS TRIGGER AS $$
DECLARE
  v_total numeric;
  v_paid numeric;
BEGIN
  -- Get invoice total and paid amount
  SELECT total, COALESCE(SUM(p.amount), 0)
  INTO v_total, v_paid
  FROM finance.invoices i
  LEFT JOIN finance.payments p ON p.invoice_id = i.id
  WHERE i.id = COALESCE(NEW.invoice_id, OLD.invoice_id)
  GROUP BY i.total;
  
  -- Update invoice status based on payment
  UPDATE finance.invoices
  SET 
    paid_amount = v_paid,
    status = CASE
      WHEN v_paid >= v_total THEN 'PAID'
      WHEN v_paid > 0 THEN 'PARTIALLY_PAID'
      ELSE status
    END,
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_status_update ON finance.payments;
CREATE TRIGGER trg_payment_status_update
  AFTER INSERT OR UPDATE OR DELETE ON finance.payments
  FOR EACH ROW
  EXECUTE FUNCTION finance.trg_update_invoice_status();

COMMIT;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Phase 12: HRMS Invoices Enhancement Completed Successfully!';
  RAISE NOTICE '   - Enhanced finance.invoices with 10+ new columns';
  RAISE NOTICE '   - Enhanced finance.invoice_lines with assignment tracking';
  RAISE NOTICE '   - Created finance.exchange_rates for multi-currency';
  RAISE NOTICE '   - Created ledger.proofs for notarization';
  RAISE NOTICE '   - Added RLS policies for security';
  RAISE NOTICE '   - Created analytics views (AR aging, DSO, to-bill)';
  RAISE NOTICE '   - Added invoice numbering function';
  RAISE NOTICE '   - Added payment status update trigger';
END $$;
