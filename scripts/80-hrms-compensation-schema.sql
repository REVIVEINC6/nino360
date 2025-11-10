-- =====================================================
-- HRMS Compensation Schema
-- =====================================================

-- Salary Bands
CREATE TABLE IF NOT EXISTS comp_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  job_family TEXT NOT NULL,
  grade TEXT NOT NULL,
  level TEXT NOT NULL,
  region TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  min_amount DECIMAL(15,2) NOT NULL,
  mid_amount DECIMAL(15,2) NOT NULL,
  max_amount DECIMAL(15,2) NOT NULL,
  effective_date DATE NOT NULL,
  expires_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review Cycles
CREATE TABLE IF NOT EXISTS comp_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('ANNUAL', 'MIDYEAR', 'OFFCYCLE')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'OPEN', 'LOCKED', 'FINALIZED')),
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  budget_total DECIMAL(15,2),
  budget_currency TEXT DEFAULT 'USD',
  guidelines JSONB DEFAULT '{}',
  eligibility_rule JSONB DEFAULT '{}',
  exchange_rate_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compensation Proposals
CREATE TABLE IF NOT EXISTS comp_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES comp_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,
  current_base DECIMAL(15,2),
  current_variable DECIMAL(15,2),
  proposed_merit_pct DECIMAL(5,2),
  proposed_merit_amount DECIMAL(15,2),
  market_adjustment DECIMAL(15,2) DEFAULT 0,
  promotion_pct DECIMAL(5,2) DEFAULT 0,
  promotion_new_band TEXT,
  lump_sum DECIMAL(15,2) DEFAULT 0,
  bonus_target_pct DECIMAL(5,2),
  bonus_amount DECIMAL(15,2),
  stock_units INTEGER,
  stock_type TEXT,
  vesting JSONB,
  effective_date DATE,
  reason TEXT,
  exception_reason TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
  -- AI Fields
  ai_recommendation TEXT CHECK (ai_recommendation IN ('APPROVE', 'REVIEW', 'REJECT')),
  equity_score INTEGER CHECK (equity_score BETWEEN 0 AND 100),
  market_percentile INTEGER CHECK (market_percentile BETWEEN 0 AND 100),
  compression_risk BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worksheets (Manager View)
CREATE TABLE IF NOT EXISTS comp_worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES comp_cycles(id) ON DELETE CASCADE,
  manager_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE IF NOT EXISTS comp_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES comp_proposals(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('APPROVED', 'REJECTED')),
  comment TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compensation Letters
CREATE TABLE IF NOT EXISTS comp_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES comp_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  -- Blockchain
  hash TEXT,
  blockchain_tx TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pay Equity Analysis
CREATE TABLE IF NOT EXISTS comp_equity_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES comp_cycles(id),
  analysis_date DATE NOT NULL,
  gender_pay_gap DECIMAL(5,2),
  ethnicity_pay_gap JSONB,
  compa_ratio_avg DECIMAL(5,2),
  compression_cases INTEGER,
  ai_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comp_bands_tenant ON comp_bands(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comp_bands_job_family ON comp_bands(job_family, grade, level);
CREATE INDEX IF NOT EXISTS idx_comp_cycles_tenant ON comp_cycles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comp_proposals_cycle ON comp_proposals(cycle_id);
CREATE INDEX IF NOT EXISTS idx_comp_proposals_employee ON comp_proposals(employee_id);
CREATE INDEX IF NOT EXISTS idx_comp_proposals_status ON comp_proposals(status);
CREATE INDEX IF NOT EXISTS idx_comp_worksheets_cycle ON comp_worksheets(cycle_id);
CREATE INDEX IF NOT EXISTS idx_comp_worksheets_manager ON comp_worksheets(manager_id);
CREATE INDEX IF NOT EXISTS idx_comp_approvals_proposal ON comp_approvals(proposal_id);
CREATE INDEX IF NOT EXISTS idx_comp_letters_cycle ON comp_letters(cycle_id);
CREATE INDEX IF NOT EXISTS idx_comp_letters_employee ON comp_letters(employee_id);

-- RLS Policies
ALTER TABLE comp_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE comp_equity_analysis ENABLE ROW LEVEL SECURITY;

-- Triggers
CREATE TRIGGER update_comp_bands_updated_at BEFORE UPDATE ON comp_bands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comp_cycles_updated_at BEFORE UPDATE ON comp_cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comp_proposals_updated_at BEFORE UPDATE ON comp_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data
INSERT INTO comp_bands (tenant_id, job_family, grade, level, region, currency, min_amount, mid_amount, max_amount, effective_date) VALUES
((SELECT id FROM tenants LIMIT 1), 'Engineering', 'E5', 'Senior', 'US', 'USD', 120000, 150000, 180000, '2025-01-01'),
((SELECT id FROM tenants LIMIT 1), 'Product', 'P4', 'Lead', 'US', 'USD', 130000, 160000, 190000, '2025-01-01'),
((SELECT id FROM tenants LIMIT 1), 'Sales', 'S3', 'Manager', 'US', 'USD', 100000, 125000, 150000, '2025-01-01');

INSERT INTO comp_cycles (tenant_id, key, name, kind, status, period_from, period_to, budget_total, budget_currency) VALUES
((SELECT id FROM tenants LIMIT 1), '2025-annual', '2025 Annual Review', 'ANNUAL', 'OPEN', '2025-01-01', '2025-12-31', 2500000, 'USD'),
((SELECT id FROM tenants LIMIT 1), '2025-midyear', '2025 Mid-Year Adjustment', 'MIDYEAR', 'DRAFT', '2025-07-01', '2025-12-31', 500000, 'USD');
