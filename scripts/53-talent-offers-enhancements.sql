-- ============================================================================
-- NINO360 Talent Offers — Production Schema
-- Offer templates, versioning, approvals, e-sign, analytics, audit trail
-- ============================================================================

-- Extend existing ats.offers table with additional fields
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS number TEXT;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS requisition_id UUID REFERENCES talent.requisitions(id);
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS comp JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS perks JSONB DEFAULT '{}'::JSONB;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS approvers UUID[] DEFAULT '{}';
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS approvals JSONB DEFAULT '[]'::JSONB;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS valid_until DATE;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS signer_payload JSONB DEFAULT '{}'::JSONB;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS pdf_path TEXT;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS signed_pdf_path TEXT;
ALTER TABLE ats.offers ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update status check constraint to include new statuses
ALTER TABLE ats.offers DROP CONSTRAINT IF EXISTS offers_status_check;
ALTER TABLE ats.offers ADD CONSTRAINT offers_status_check 
  CHECK (status IN ('draft','awaiting_approval','approved','sent','viewed','accepted','declined','expired','void'));

-- Create index for offer number
CREATE INDEX IF NOT EXISTS idx_offers_number ON ats.offers(number);
CREATE INDEX IF NOT EXISTS idx_offers_requisition ON ats.offers(requisition_id);
CREATE INDEX IF NOT EXISTS idx_offers_valid_until ON ats.offers(valid_until);

-- Offer templates
CREATE TABLE IF NOT EXISTS talent.offer_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  body_md TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  shared BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offer_templates_tenant ON talent.offer_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offer_templates_shared ON talent.offer_templates(shared) WHERE shared = TRUE;

-- Offer versions
CREATE TABLE IF NOT EXISTS talent.offer_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES ats.offers(id) ON DELETE CASCADE,
  version INT NOT NULL,
  diff JSONB NOT NULL DEFAULT '{}'::JSONB,
  pdf_path TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offer_versions_tenant ON talent.offer_versions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offer_versions_offer ON talent.offer_versions(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_versions_version ON talent.offer_versions(offer_id, version);

-- Offer events (tracking)
CREATE TABLE IF NOT EXISTS talent.offer_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES app.tenants(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES ats.offers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('created','versioned','requested_approval','approved','rejected','sent','viewed','signed','accepted','declined','expired','void')),
  actor UUID REFERENCES auth.users(id),
  meta JSONB DEFAULT '{}'::JSONB,
  ts TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offer_events_tenant ON talent.offer_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offer_events_offer ON talent.offer_events(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_events_type ON talent.offer_events(type);
CREATE INDEX IF NOT EXISTS idx_offer_events_ts ON talent.offer_events(ts DESC);

-- Enable RLS
ALTER TABLE talent.offer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.offer_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent.offer_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY rls_offer_templates ON talent.offer_templates 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_offer_versions ON talent.offer_versions 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

CREATE POLICY rls_offer_events ON talent.offer_events 
  FOR ALL USING (tenant_id = app.current_tenant_id()) 
  WITH CHECK (tenant_id = app.current_tenant_id());

-- Update trigger for offer_templates
CREATE OR REPLACE FUNCTION talent.update_offer_template_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offer_template_updated ON talent.offer_templates;
CREATE TRIGGER trg_offer_template_updated
  BEFORE UPDATE ON talent.offer_templates
  FOR EACH ROW
  EXECUTE FUNCTION talent.update_offer_template_timestamp();

-- Seed default offer templates
DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- Get first tenant and user
  SELECT id INTO v_tenant_id FROM app.tenants LIMIT 1;
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_tenant_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    -- Standard offer template
    INSERT INTO talent.offer_templates (tenant_id, name, description, body_md, variables, shared, created_by)
    VALUES (
      v_tenant_id,
      'Standard Full-Time Offer',
      'Standard offer letter template for full-time employees',
      E'# Offer of Employment\n\nDear {{candidate.first_name}},\n\nWe are pleased to offer you the position of **{{requisition.title}}** at {{company.name}}.\n\n## Compensation\n\n- Base Salary: {{comp.base}} {{comp.currency}} per year\n- Bonus: {{comp.bonus}} {{comp.currency}} (target)\n- Equity: {{comp.equity}} stock options\n\n## Benefits\n\n{{perks.benefits}}\n\n## Start Date\n\nYour anticipated start date is {{start_date}}.\n\n## Acceptance\n\nThis offer is valid until {{valid_until}}. Please sign and return this letter to indicate your acceptance.\n\nWe look forward to welcoming you to the team!\n\nSincerely,\n\n{{hiring_manager.name}}\n{{hiring_manager.title}}',
      ARRAY['candidate.first_name', 'candidate.last_name', 'requisition.title', 'company.name', 'comp.base', 'comp.bonus', 'comp.equity', 'comp.currency', 'perks.benefits', 'start_date', 'valid_until', 'hiring_manager.name', 'hiring_manager.title'],
      TRUE,
      v_user_id
    );

    -- Contract offer template
    INSERT INTO talent.offer_templates (tenant_id, name, description, body_md, variables, shared, created_by)
    VALUES (
      v_tenant_id,
      'Contract Offer',
      'Offer letter template for contract positions',
      E'# Contract Offer\n\nDear {{candidate.first_name}},\n\nWe are pleased to offer you a contract position as **{{requisition.title}}** at {{company.name}}.\n\n## Contract Terms\n\n- Duration: {{contract.duration}} months\n- Rate: {{comp.rate}} {{comp.currency}} per {{comp.period}}\n- Start Date: {{start_date}}\n- End Date: {{end_date}}\n\n## Scope of Work\n\n{{contract.scope}}\n\n## Acceptance\n\nThis offer is valid until {{valid_until}}. Please sign and return this letter to indicate your acceptance.\n\nBest regards,\n\n{{hiring_manager.name}}\n{{hiring_manager.title}}',
      ARRAY['candidate.first_name', 'candidate.last_name', 'requisition.title', 'company.name', 'contract.duration', 'comp.rate', 'comp.currency', 'comp.period', 'start_date', 'end_date', 'contract.scope', 'valid_until', 'hiring_manager.name', 'hiring_manager.title'],
      TRUE,
      v_user_id
    );
  END IF;
END $$;

-- Function to generate offer number
CREATE OR REPLACE FUNCTION talent.generate_offer_number(p_tenant_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INT;
  v_number TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO v_count
  FROM ats.offers
  WHERE tenant_id = p_tenant_id
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  v_number := 'OFR-' || v_year || '-' || LPAD(v_count::TEXT, 5, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check if offer is expired
CREATE OR REPLACE FUNCTION talent.check_offer_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.valid_until < CURRENT_DATE AND NEW.status IN ('sent', 'viewed') THEN
    NEW.status := 'expired';
    
    INSERT INTO talent.offer_events (tenant_id, offer_id, type, meta)
    VALUES (NEW.tenant_id, NEW.id, 'expired', '{"auto": true}'::JSONB);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offer_expiration ON ats.offers;
CREATE TRIGGER trg_offer_expiration
  BEFORE UPDATE ON ats.offers
  FOR EACH ROW
  WHEN (OLD.valid_until IS DISTINCT FROM NEW.valid_until OR OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION talent.check_offer_expiration();
