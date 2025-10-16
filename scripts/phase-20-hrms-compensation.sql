-- =====================================================================
-- Phase 20: HRMS Compensation Management
-- =====================================================================
-- Comprehensive compensation management with bands, cycles, worksheets,
-- proposals, approvals, budgets, pay equity, and letters
-- =====================================================================

-- Create comp schema
CREATE SCHEMA IF NOT EXISTS comp;

-- =====================================================================
-- 1. Compensation Bands & Ranges
-- =====================================================================

CREATE TABLE IF NOT EXISTS comp.bands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  
  -- Band definition
  job_family text NOT NULL,
  grade text NOT NULL,
  level text NOT NULL,
  region text NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  
  -- Range
  min_amount numeric(15,2) NOT NULL CHECK (min_amount >= 0),
  mid_amount numeric(15,2) NOT NULL CHECK (mid_amount >= min_amount),
  max_amount numeric(15,2) NOT NULL CHECK (max_amount >= mid_amount),
  
  -- Effective dating
  effective_date date NOT NULL,
  expires_date date,
  
  -- Metadata
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_band_version UNIQUE (tenant_id, job_family, grade, level, region, effective_date)
);

CREATE INDEX idx_bands_tenant ON comp.bands(tenant_id);
CREATE INDEX idx_bands_effective ON comp.bands(tenant_id, effective_date) WHERE expires_date IS NULL;

-- Location-based overrides (geo differentials)
CREATE TABLE IF NOT EXISTS comp.band_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  band_id uuid NOT NULL REFERENCES comp.bands(id) ON DELETE CASCADE,
  
  location text NOT NULL,
  coefficient numeric(5,4) NOT NULL DEFAULT 1.0000 CHECK (coefficient > 0),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_band_location UNIQUE (band_id, location)
);

CREATE INDEX idx_band_overrides_band ON comp.band_overrides(band_id);

-- =====================================================================
-- 2. Compensation Cycles
-- =====================================================================

CREATE TYPE comp.cycle_kind AS ENUM ('ANNUAL', 'MIDYEAR', 'OFFCYCLE');
CREATE TYPE comp.cycle_status AS ENUM ('DRAFT', 'PUBLISHED', 'OPEN', 'LOCKED', 'FINALIZED', 'ARCHIVED');

CREATE TABLE IF NOT EXISTS comp.cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  
  -- Cycle definition
  key text NOT NULL,
  name text NOT NULL,
  kind comp.cycle_kind NOT NULL DEFAULT 'ANNUAL',
  status comp.cycle_status NOT NULL DEFAULT 'DRAFT',
  
  -- Period
  period_from date NOT NULL,
  period_to date NOT NULL CHECK (period_to >= period_from),
  
  -- Budget
  budget_total numeric(15,2),
  budget_currency text DEFAULT 'USD',
  
  -- Guidelines (merit matrix, caps, proration rules)
  guidelines jsonb DEFAULT '{}'::jsonb,
  
  -- Eligibility rules (tenure cutoffs, leave exclusions, performance min)
  eligibility_rule jsonb DEFAULT '{}'::jsonb,
  
  -- FX lock date
  exchange_rate_date date,
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_key UNIQUE (tenant_id, key)
);

CREATE INDEX idx_cycles_tenant ON comp.cycles(tenant_id);
CREATE INDEX idx_cycles_status ON comp.cycles(tenant_id, status);

-- =====================================================================
-- 3. Eligibility
-- =====================================================================

CREATE TABLE IF NOT EXISTS comp.eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES comp.cycles(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  eligible boolean NOT NULL DEFAULT true,
  prorate_pct numeric(5,2) DEFAULT 100.00 CHECK (prorate_pct >= 0 AND prorate_pct <= 100),
  reason text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_employee UNIQUE (cycle_id, employee_id)
);

CREATE INDEX idx_eligibility_cycle ON comp.eligibility(cycle_id);
CREATE INDEX idx_eligibility_employee ON comp.eligibility(employee_id);

-- =====================================================================
-- 4. Worksheets (Manager view)
-- =====================================================================

CREATE TYPE comp.worksheet_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'LOCKED');

CREATE TABLE IF NOT EXISTS comp.worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES comp.cycles(id) ON DELETE CASCADE,
  
  manager_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  org_node_id uuid, -- optional org unit
  
  status comp.worksheet_status NOT NULL DEFAULT 'DRAFT',
  
  submitted_at timestamptz,
  approved_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_manager UNIQUE (cycle_id, manager_id)
);

CREATE INDEX idx_worksheets_cycle ON comp.worksheets(cycle_id);
CREATE INDEX idx_worksheets_manager ON comp.worksheets(manager_id);
CREATE INDEX idx_worksheets_status ON comp.worksheets(cycle_id, status);

-- =====================================================================
-- 5. Proposals (Individual compensation changes)
-- =====================================================================

CREATE TYPE comp.proposal_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

CREATE TABLE IF NOT EXISTS comp.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES comp.cycles(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  -- Current state
  current_base numeric(15,2),
  current_variable numeric(15,2),
  current_currency text DEFAULT 'USD',
  current_band text,
  
  -- Metrics
  compa_ratio numeric(5,2), -- current_base / band_mid
  range_penetration numeric(5,2), -- (current_base - min) / (max - min) * 100
  
  -- Proposed changes
  proposed_merit_pct numeric(5,2) DEFAULT 0.00,
  proposed_merit_amount numeric(15,2) DEFAULT 0.00,
  market_adjustment numeric(15,2) DEFAULT 0.00,
  promotion_pct numeric(5,2) DEFAULT 0.00,
  promotion_new_band text,
  lump_sum numeric(15,2) DEFAULT 0.00,
  
  -- Bonus & equity
  bonus_target_pct numeric(5,2),
  bonus_amount numeric(15,2),
  stock_units numeric(10,2),
  stock_type text, -- RSU, ISO, NSO
  vesting jsonb, -- vesting schedule
  
  -- Effective date
  effective_date date,
  
  -- Justification
  reason text,
  exception_reason text,
  
  -- Status
  status comp.proposal_status NOT NULL DEFAULT 'DRAFT',
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_employee_proposal UNIQUE (cycle_id, employee_id)
);

CREATE INDEX idx_proposals_cycle ON comp.proposals(cycle_id);
CREATE INDEX idx_proposals_employee ON comp.proposals(employee_id);
CREATE INDEX idx_proposals_status ON comp.proposals(cycle_id, status);

-- =====================================================================
-- 6. Approvals (Multi-level approval chain)
-- =====================================================================

CREATE TYPE comp.approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE IF NOT EXISTS comp.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL REFERENCES comp.proposals(id) ON DELETE CASCADE,
  
  approver_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  status comp.approval_status NOT NULL DEFAULT 'PENDING',
  comment text,
  
  approved_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_approvals_proposal ON comp.approvals(proposal_id);
CREATE INDEX idx_approvals_approver ON comp.approvals(approver_id);
CREATE INDEX idx_approvals_status ON comp.approvals(proposal_id, status);

-- =====================================================================
-- 7. Budgets (By org/manager)
-- =====================================================================

CREATE TABLE IF NOT EXISTS comp.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES comp.cycles(id) ON DELETE CASCADE,
  
  org_node_id uuid,
  owner_id uuid REFERENCES hr.employees(id),
  
  amount numeric(15,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  used numeric(15,2) NOT NULL DEFAULT 0.00 CHECK (used >= 0),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_org_budget UNIQUE (cycle_id, org_node_id)
);

CREATE INDEX idx_budgets_cycle ON comp.budgets(cycle_id);
CREATE INDEX idx_budgets_owner ON comp.budgets(owner_id);

-- =====================================================================
-- 8. Letters (Compensation letters)
-- =====================================================================

CREATE TYPE comp.letter_status AS ENUM ('DRAFT', 'READY', 'SENT');

CREATE TABLE IF NOT EXISTS comp.letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES comp.cycles(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
  
  document_id uuid, -- reference to generated PDF
  status comp.letter_status NOT NULL DEFAULT 'DRAFT',
  
  sent_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_cycle_employee_letter UNIQUE (cycle_id, employee_id)
);

CREATE INDEX idx_letters_cycle ON comp.letters(cycle_id);
CREATE INDEX idx_letters_employee ON comp.letters(employee_id);
CREATE INDEX idx_letters_status ON comp.letters(cycle_id, status);

-- =====================================================================
-- 9. Analytics Views
-- =====================================================================

-- Cycle summary
CREATE OR REPLACE VIEW comp.v_cycle_summary AS
SELECT
  c.id AS cycle_id,
  c.tenant_id,
  c.key,
  c.name,
  c.kind,
  c.status,
  c.period_from,
  c.period_to,
  c.budget_total,
  c.budget_currency,
  COUNT(DISTINCT p.id) AS total_proposals,
  COUNT(DISTINCT CASE WHEN p.status = 'SUBMITTED' THEN p.id END) AS submitted_proposals,
  COUNT(DISTINCT CASE WHEN p.status = 'APPROVED' THEN p.id END) AS approved_proposals,
  SUM(CASE WHEN p.status = 'APPROVED' THEN p.proposed_merit_amount + COALESCE(p.market_adjustment, 0) + COALESCE(p.lump_sum, 0) ELSE 0 END) AS total_approved_amount,
  AVG(CASE WHEN p.status = 'APPROVED' THEN p.proposed_merit_pct END) AS avg_merit_pct,
  COUNT(DISTINCT l.id) AS letters_generated,
  COUNT(DISTINCT CASE WHEN l.status = 'SENT' THEN l.id END) AS letters_sent
FROM comp.cycles c
LEFT JOIN comp.proposals p ON p.cycle_id = c.id
LEFT JOIN comp.letters l ON l.cycle_id = c.id
GROUP BY c.id, c.tenant_id, c.key, c.name, c.kind, c.status, c.period_from, c.period_to, c.budget_total, c.budget_currency;

-- Pay equity metrics
CREATE OR REPLACE VIEW comp.v_pay_equity AS
SELECT
  p.tenant_id,
  p.cycle_id,
  e.id AS employee_id,
  e.employee_no,
  p.current_band,
  p.current_base,
  p.current_currency,
  p.compa_ratio,
  p.range_penetration,
  b.min_amount AS band_min,
  b.mid_amount AS band_mid,
  b.max_amount AS band_max,
  CASE
    WHEN p.compa_ratio < 80 THEN 'Below Range'
    WHEN p.compa_ratio > 120 THEN 'Above Range'
    ELSE 'In Range'
  END AS equity_flag
FROM comp.proposals p
JOIN hr.employees e ON e.id = p.employee_id
LEFT JOIN comp.bands b ON b.tenant_id = p.tenant_id 
  AND b.job_family || '-' || b.grade || '-' || b.level = p.current_band
  AND b.effective_date <= CURRENT_DATE
  AND (b.expires_date IS NULL OR b.expires_date > CURRENT_DATE);

-- =====================================================================
-- 10. RLS Policies
-- =====================================================================

-- Bands: tenant-scoped, read for all, write for comp.admin
ALTER TABLE comp.bands ENABLE ROW LEVEL SECURITY;

CREATE POLICY bands_tenant_isolation ON comp.bands
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Band overrides: tenant-scoped
ALTER TABLE comp.band_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY band_overrides_tenant_isolation ON comp.band_overrides
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Cycles: tenant-scoped
ALTER TABLE comp.cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY cycles_tenant_isolation ON comp.cycles
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Eligibility: tenant-scoped
ALTER TABLE comp.eligibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY eligibility_tenant_isolation ON comp.eligibility
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Worksheets: tenant-scoped, managers see own
ALTER TABLE comp.worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY worksheets_tenant_isolation ON comp.worksheets
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Proposals: tenant-scoped, managers see directs
ALTER TABLE comp.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY proposals_tenant_isolation ON comp.proposals
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Approvals: tenant-scoped
ALTER TABLE comp.approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY approvals_tenant_isolation ON comp.approvals
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Budgets: tenant-scoped
ALTER TABLE comp.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY budgets_tenant_isolation ON comp.budgets
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Letters: tenant-scoped
ALTER TABLE comp.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY letters_tenant_isolation ON comp.letters
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- =====================================================================
-- 11. Triggers
-- =====================================================================

-- Update updated_at on all tables
CREATE OR REPLACE FUNCTION comp.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bands_updated_at BEFORE UPDATE ON comp.bands
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER band_overrides_updated_at BEFORE UPDATE ON comp.band_overrides
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER cycles_updated_at BEFORE UPDATE ON comp.cycles
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER eligibility_updated_at BEFORE UPDATE ON comp.eligibility
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER worksheets_updated_at BEFORE UPDATE ON comp.worksheets
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON comp.proposals
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER approvals_updated_at BEFORE UPDATE ON comp.approvals
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER budgets_updated_at BEFORE UPDATE ON comp.budgets
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

CREATE TRIGGER letters_updated_at BEFORE UPDATE ON comp.letters
  FOR EACH ROW EXECUTE FUNCTION comp.update_updated_at();

-- =====================================================================
-- 12. Utility Functions
-- =====================================================================

-- Calculate compa ratio
CREATE OR REPLACE FUNCTION comp.calculate_compa_ratio(
  p_current_base numeric,
  p_band_mid numeric
) RETURNS numeric AS $$
BEGIN
  IF p_band_mid IS NULL OR p_band_mid = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((p_current_base / p_band_mid) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate range penetration
CREATE OR REPLACE FUNCTION comp.calculate_range_penetration(
  p_current_base numeric,
  p_band_min numeric,
  p_band_max numeric
) RETURNS numeric AS $$
BEGIN
  IF p_band_min IS NULL OR p_band_max IS NULL OR p_band_max = p_band_min THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(((p_current_base - p_band_min) / (p_band_max - p_band_min)) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================================
-- End of Phase 20
-- =====================================================================
