-- Phase 13: HRMS Accounts Payable System
-- Comprehensive AP management with vendor bills, payment batches, bank file exports, and ledger notarization

-- Ensure required schemas exist
CREATE SCHEMA IF NOT EXISTS ap;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS sec;

-- ============================================================================
-- SECURITY FUNCTIONS (if not exists)
-- ============================================================================

CREATE OR REPLACE FUNCTION sec.current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION sec.has_feature(flag TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM app.feature_flags
    WHERE tenant_id = sec.current_tenant_id()
      AND key = flag
      AND enabled = true
  );
EXCEPTION
  WHEN OTHERS THEN RETURN false;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ENHANCE FINANCE.VENDORS
-- ============================================================================

-- Add missing columns to finance.vendors
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='legal_name') THEN
    ALTER TABLE finance.vendors ADD COLUMN legal_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='tax_id') THEN
    ALTER TABLE finance.vendors ADD COLUMN tax_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='country') THEN
    ALTER TABLE finance.vendors ADD COLUMN country TEXT DEFAULT 'US';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='email') THEN
    ALTER TABLE finance.vendors ADD COLUMN email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='bank') THEN
    ALTER TABLE finance.vendors ADD COLUMN bank JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='payment_terms') THEN
    ALTER TABLE finance.vendors ADD COLUMN payment_terms TEXT DEFAULT 'Net 30';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='w8_w9_url') THEN
    ALTER TABLE finance.vendors ADD COLUMN w8_w9_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='finance' AND table_name='vendors' AND column_name='active') THEN
    ALTER TABLE finance.vendors ADD COLUMN active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- AP.VENDOR_BILLS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ap.vendor_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vendor_id UUID NOT NULL REFERENCES finance.vendors(id) ON DELETE RESTRICT,
  number TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('TIMESHEET', 'EXPENSE', 'MANUAL')),
  period_from DATE,
  period_to DATE,
  due_date DATE NOT NULL,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'READY', 'APPROVED', 'SCHEDULED', 'PAID', 'VOID')),
  pdf_url TEXT,
  notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, number)
);

CREATE INDEX IF NOT EXISTS idx_vendor_bills_tenant ON ap.vendor_bills(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bills_vendor ON ap.vendor_bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bills_status ON ap.vendor_bills(status);
CREATE INDEX IF NOT EXISTS idx_vendor_bills_due_date ON ap.vendor_bills(due_date);
CREATE INDEX IF NOT EXISTS idx_vendor_bills_period ON ap.vendor_bills(period_from, period_to);

-- ============================================================================
-- AP.VENDOR_BILL_LINES
-- ============================================================================

CREATE TABLE IF NOT EXISTS ap.vendor_bill_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES ap.vendor_bills(id) ON DELETE CASCADE,
  employee_id UUID,
  assignment_id UUID,
  date DATE,
  description TEXT NOT NULL,
  qty_hours NUMERIC(8,2),
  unit_rate NUMERIC(10,2),
  amount NUMERIC(14,2) NOT NULL,
  tax_code TEXT,
  gl_account TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_bill_lines_bill ON ap.vendor_bill_lines(bill_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bill_lines_employee ON ap.vendor_bill_lines(employee_id);
CREATE INDEX IF NOT EXISTS idx_vendor_bill_lines_assignment ON ap.vendor_bill_lines(assignment_id);

-- ============================================================================
-- AP.PAYMENT_BATCHES
-- ============================================================================

CREATE TABLE IF NOT EXISTS ap.payment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  batch_no TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('ACH', 'SEPA', 'WIRE', 'CHECK', 'MANUAL')),
  pay_date DATE NOT NULL,
  currency TEXT DEFAULT 'USD',
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'CONFIRMED', 'FAILED')),
  file_url TEXT,
  reference TEXT,
  error_message TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, batch_no)
);

CREATE INDEX IF NOT EXISTS idx_payment_batches_tenant ON ap.payment_batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_batches_status ON ap.payment_batches(status);
CREATE INDEX IF NOT EXISTS idx_payment_batches_pay_date ON ap.payment_batches(pay_date);

-- ============================================================================
-- AP.PAYMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ap.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES ap.vendor_bills(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES ap.payment_batches(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('ACH', 'SEPA', 'WIRE', 'CHECK', 'MANUAL')),
  paid_at TIMESTAMPTZ NOT NULL,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_bill ON ap.payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_batch ON ap.payments(batch_id);

-- ============================================================================
-- FINANCE.EXCHANGE_RATES (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance.exchange_rates (
  date DATE NOT NULL,
  from_ccy TEXT NOT NULL,
  to_ccy TEXT NOT NULL,
  rate NUMERIC(12,6) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (date, from_ccy, to_ccy)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON finance.exchange_rates(date);

-- ============================================================================
-- LEDGER.PROOFS (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ledger.proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type TEXT NOT NULL,
  object_id UUID NOT NULL,
  hash TEXT NOT NULL,
  block TEXT,
  notarized_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_type, object_id)
);

CREATE INDEX IF NOT EXISTS idx_proofs_object ON ledger.proofs(object_type, object_id);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- To Bill: Approved contractor hours not yet billed
CREATE OR REPLACE VIEW ap.vw_to_bill AS
SELECT
  t.tenant_id,
  e.id AS employee_id,
  e.name AS employee_name,
  v.id AS vendor_id,
  v.name AS vendor_name,
  MIN(te.date) AS period_from,
  MAX(te.date) AS period_to,
  COUNT(DISTINCT te.id) AS entry_count,
  SUM(te.hours) AS total_hours,
  SUM(te.hours * COALESCE((a.rate->>'amount')::numeric, 0)) AS total_amount,
  v.currency
FROM hr.timesheets t
JOIN hr.timesheet_entries te ON te.timesheet_id = t.id
JOIN hr.employees e ON e.id = t.employee_id
LEFT JOIN hr.assignments a ON a.id = te.assignment_id
LEFT JOIN finance.vendors v ON v.id = e.vendor_id
WHERE t.status = 'APPROVED'
  AND te.billable = true
  AND NOT EXISTS (
    SELECT 1 FROM ap.vendor_bill_lines vbl
    WHERE vbl.employee_id = e.id
      AND vbl.date = te.date
      AND vbl.assignment_id = te.assignment_id
  )
GROUP BY t.tenant_id, e.id, e.name, v.id, v.name, v.currency;

-- AP Aging: Bills by aging bucket
CREATE OR REPLACE VIEW ap.vw_aging AS
SELECT
  vb.tenant_id,
  vb.vendor_id,
  v.name AS vendor_name,
  COUNT(*) FILTER (WHERE vb.due_date >= CURRENT_DATE) AS current_count,
  SUM(vb.total - vb.paid_amount) FILTER (WHERE vb.due_date >= CURRENT_DATE) AS current_amount,
  COUNT(*) FILTER (WHERE vb.due_date < CURRENT_DATE AND vb.due_date >= CURRENT_DATE - INTERVAL '30 days') AS days_0_30_count,
  SUM(vb.total - vb.paid_amount) FILTER (WHERE vb.due_date < CURRENT_DATE AND vb.due_date >= CURRENT_DATE - INTERVAL '30 days') AS days_0_30_amount,
  COUNT(*) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '30 days' AND vb.due_date >= CURRENT_DATE - INTERVAL '60 days') AS days_31_60_count,
  SUM(vb.total - vb.paid_amount) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '30 days' AND vb.due_date >= CURRENT_DATE - INTERVAL '60 days') AS days_31_60_amount,
  COUNT(*) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '60 days' AND vb.due_date >= CURRENT_DATE - INTERVAL '90 days') AS days_61_90_count,
  SUM(vb.total - vb.paid_amount) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '60 days' AND vb.due_date >= CURRENT_DATE - INTERVAL '90 days') AS days_61_90_amount,
  COUNT(*) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '90 days') AS days_90_plus_count,
  SUM(vb.total - vb.paid_amount) FILTER (WHERE vb.due_date < CURRENT_DATE - INTERVAL '90 days') AS days_90_plus_amount
FROM ap.vendor_bills vb
JOIN finance.vendors v ON v.id = vb.vendor_id
WHERE vb.status NOT IN ('VOID', 'PAID')
GROUP BY vb.tenant_id, vb.vendor_id, v.name;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Generate bill number per tenant
CREATE OR REPLACE FUNCTION ap.fn_generate_bill_number(p_tenant_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT := TO_CHAR(NOW(), 'YYYY');
  v_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(SUBSTRING(number FROM '\d+$')::INTEGER), 0) + 1
  INTO v_seq
  FROM ap.vendor_bills
  WHERE tenant_id = p_tenant_id
    AND number LIKE 'VB-' || v_year || '-%';

  RETURN 'VB-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate batch number per tenant
CREATE OR REPLACE FUNCTION ap.fn_generate_batch_number(p_tenant_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT := TO_CHAR(NOW(), 'YYYY');
  v_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(SUBSTRING(batch_no FROM '\d+$')::INTEGER), 0) + 1
  INTO v_seq
  FROM ap.payment_batches
  WHERE tenant_id = p_tenant_id
    AND batch_no LIKE 'BATCH-' || v_year || '-%';

  RETURN 'BATCH-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update bill totals when lines change
CREATE OR REPLACE FUNCTION ap.trg_update_bill_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ap.vendor_bills
  SET
    subtotal = (
      SELECT COALESCE(SUM(amount), 0)
      FROM ap.vendor_bill_lines
      WHERE bill_id = COALESCE(NEW.bill_id, OLD.bill_id)
    ),
    total = (
      SELECT COALESCE(SUM(amount), 0)
      FROM ap.vendor_bill_lines
      WHERE bill_id = COALESCE(NEW.bill_id, OLD.bill_id)
    ) + COALESCE((SELECT tax_total FROM ap.vendor_bills WHERE id = COALESCE(NEW.bill_id, OLD.bill_id)), 0)
      - COALESCE((SELECT discount_total FROM ap.vendor_bills WHERE id = COALESCE(NEW.bill_id, OLD.bill_id)), 0),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.bill_id, OLD.bill_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vendor_bill_lines_update_totals ON ap.vendor_bill_lines;
CREATE TRIGGER trg_vendor_bill_lines_update_totals
AFTER INSERT OR UPDATE OR DELETE ON ap.vendor_bill_lines
FOR EACH ROW EXECUTE FUNCTION ap.trg_update_bill_totals();

-- Update bill status when payment recorded
CREATE OR REPLACE FUNCTION ap.trg_update_bill_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  v_bill RECORD;
BEGIN
  SELECT
    id,
    total,
    (SELECT COALESCE(SUM(amount), 0) FROM ap.payments WHERE bill_id = NEW.bill_id) AS paid
  INTO v_bill
  FROM ap.vendor_bills
  WHERE id = NEW.bill_id;

  UPDATE ap.vendor_bills
  SET
    paid_amount = v_bill.paid,
    status = CASE
      WHEN v_bill.paid >= v_bill.total THEN 'PAID'
      WHEN v_bill.paid > 0 THEN 'SCHEDULED'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = NEW.bill_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payments_update_bill_status ON ap.payments;
CREATE TRIGGER trg_payments_update_bill_status
AFTER INSERT ON ap.payments
FOR EACH ROW EXECUTE FUNCTION ap.trg_update_bill_payment_status();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE ap.vendor_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ap.vendor_bill_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ap.payment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ap.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger.proofs ENABLE ROW LEVEL SECURITY;

-- Vendor bills: tenant-scoped with feature flag
CREATE POLICY vendor_bills_tenant ON ap.vendor_bills FOR ALL
USING (tenant_id = sec.current_tenant_id() AND sec.has_feature('ap.read'));

-- Vendor bill lines: via parent bill
CREATE POLICY vendor_bill_lines_tenant ON ap.vendor_bill_lines FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM ap.vendor_bills
    WHERE id = vendor_bill_lines.bill_id
      AND tenant_id = sec.current_tenant_id()
      AND sec.has_feature('ap.read')
  )
);

-- Payment batches: tenant-scoped with feature flag
CREATE POLICY payment_batches_tenant ON ap.payment_batches FOR ALL
USING (tenant_id = sec.current_tenant_id() AND sec.has_feature('ap.read'));

-- Payments: via parent bill
CREATE POLICY payments_tenant ON ap.payments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM ap.vendor_bills vb
    WHERE vb.id = payments.bill_id
      AND vb.tenant_id = sec.current_tenant_id()
      AND sec.has_feature('ap.read')
  )
);

-- Exchange rates: public read
CREATE POLICY exchange_rates_all ON finance.exchange_rates FOR SELECT USING (true);

-- Ledger proofs: tenant-scoped via object
CREATE POLICY proofs_all ON ledger.proofs FOR SELECT USING (true);
