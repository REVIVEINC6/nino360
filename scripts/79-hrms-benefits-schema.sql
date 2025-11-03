-- ============================================================================
-- HRMS Benefits Management Schema
-- Comprehensive benefits administration with AI-powered enrollment
-- ============================================================================

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MEDICAL', 'DENTAL', 'VISION', 'LIFE', 'DISABILITY', 'FSA', 'HSA', 'COMMUTER', 'OTHER')),
  carrier_id UUID REFERENCES public.carriers(id),
  region TEXT,
  currency TEXT DEFAULT 'USD',
  waiting_period_days INTEGER DEFAULT 0,
  calc_rule JSONB,
  effective_from DATE NOT NULL,
  effective_to DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan options table
CREATE TABLE IF NOT EXISTS public.plan_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  coverage_tier TEXT NOT NULL CHECK (coverage_tier IN ('EE_ONLY', 'EE_SPOUSE', 'EE_CHILDREN', 'FAMILY')),
  deductible NUMERIC(10,2),
  out_of_pocket_max NUMERIC(10,2),
  copay NUMERIC(10,2),
  coinsurance NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate cards table
CREATE TABLE IF NOT EXISTS public.rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.plan_options(id) ON DELETE CASCADE,
  rule JSONB NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carriers table
CREATE TABLE IF NOT EXISTS public.carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  edi_enabled BOOLEAN DEFAULT false,
  edi_sender_id TEXT,
  edi_receiver_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependents table
CREATE TABLE IF NOT EXISTS public.dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('SPOUSE', 'DOMESTIC_PARTNER', 'CHILD', 'OTHER')),
  dob DATE NOT NULL,
  gender TEXT,
  ssn_last4 TEXT,
  tobacco_user BOOLEAN DEFAULT false,
  disabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table (QLE, Open Enrollment)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('OPEN_ENROLLMENT', 'QLE')),
  qle_type TEXT CHECK (qle_type IN ('MARRIAGE', 'BIRTH', 'ADOPTION', 'DIVORCE', 'LOSS_OF_COVERAGE', 'GAIN_OF_COVERAGE', 'ADDRESS_CHANGE', 'OTHER')),
  event_date DATE,
  window_ends DATE,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'EXPIRED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.plan_options(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id),
  coverage_start DATE NOT NULL,
  coverage_end DATE,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'DECLINED', 'TERMINATED')),
  employee_cost NUMERIC(10,2),
  employer_cost NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  confirmation_pdf_url TEXT,
  blockchain_hash TEXT,
  blockchain_block INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment lines table (dependents covered)
CREATE TABLE IF NOT EXISTS public.enrollment_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  dependent_id UUID NOT NULL REFERENCES public.dependents(id) ON DELETE CASCADE,
  covered BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence table (QLE documentation)
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  document_id UUID,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deductions table (payroll integration)
CREATE TABLE IF NOT EXISTS public.deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  provider_key TEXT NOT NULL,
  code TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PRE_TAX', 'POST_TAX', 'EMPLOYER')),
  start_date DATE NOT NULL,
  end_date DATE,
  source TEXT DEFAULT 'benefits',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDI runs table
CREATE TABLE IF NOT EXISTS public.edi_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
  control_no TEXT NOT NULL,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED')),
  sha256 TEXT,
  blockchain_hash TEXT,
  blockchain_block INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plans_tenant ON public.plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_plans_active ON public.plans(active, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_plan_options_plan ON public.plan_options(plan_id);
CREATE INDEX IF NOT EXISTS idx_rate_cards_plan_option ON public.rate_cards(plan_id, option_id);
CREATE INDEX IF NOT EXISTS idx_dependents_employee ON public.dependents(employee_id);
CREATE INDEX IF NOT EXISTS idx_events_employee ON public.events(employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee ON public.enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_lines_enrollment ON public.enrollment_lines(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_deductions_employee ON public.deductions(employee_id);
CREATE INDEX IF NOT EXISTS idx_claims_employee ON public.claims(employee_id);

-- RLS Policies
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edi_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY plans_tenant_isolation ON public.plans FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY plan_options_tenant_isolation ON public.plan_options FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY rate_cards_tenant_isolation ON public.rate_cards FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY carriers_tenant_isolation ON public.carriers FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY dependents_tenant_isolation ON public.dependents FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY events_tenant_isolation ON public.events FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY enrollments_tenant_isolation ON public.enrollments FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY enrollment_lines_tenant_isolation ON public.enrollment_lines FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY evidence_tenant_isolation ON public.evidence FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY deductions_tenant_isolation ON public.deductions FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY edi_runs_tenant_isolation ON public.edi_runs FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY claims_tenant_isolation ON public.claims FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Triggers
CREATE OR REPLACE FUNCTION update_benefits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER plan_options_updated_at BEFORE UPDATE ON public.plan_options FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER rate_cards_updated_at BEFORE UPDATE ON public.rate_cards FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER carriers_updated_at BEFORE UPDATE ON public.carriers FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER dependents_updated_at BEFORE UPDATE ON public.dependents FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER evidence_updated_at BEFORE UPDATE ON public.evidence FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER deductions_updated_at BEFORE UPDATE ON public.deductions FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER edi_runs_updated_at BEFORE UPDATE ON public.edi_runs FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();
CREATE TRIGGER claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION update_benefits_updated_at();

-- View for enrollment summary
CREATE OR REPLACE VIEW v_enrollment_summary AS
SELECT 
  e.id,
  e.employee_id,
  emp.first_name || ' ' || emp.last_name AS employee_name,
  p.name AS plan_name,
  p.type AS plan_type,
  po.coverage_tier,
  e.status,
  e.employee_cost,
  e.employer_cost,
  e.currency,
  e.coverage_start,
  e.coverage_end,
  e.created_at
FROM public.enrollments e
JOIN public.employees emp ON e.employee_id = emp.id
JOIN public.plans p ON e.plan_id = p.id
JOIN public.plan_options po ON e.option_id = po.id;

-- Sample data
INSERT INTO public.carriers (id, tenant_id, name, contact_email, edi_enabled) VALUES
  (gen_random_uuid(), (SELECT id FROM public.tenants LIMIT 1), 'Blue Cross Blue Shield', 'benefits@bcbs.com', true),
  (gen_random_uuid(), (SELECT id FROM public.tenants LIMIT 1), 'Aetna', 'support@aetna.com', true),
  (gen_random_uuid(), (SELECT id FROM public.tenants LIMIT 1), 'UnitedHealthcare', 'benefits@uhc.com', true)
ON CONFLICT DO NOTHING;
