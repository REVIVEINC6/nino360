-- Talent Offers Schema with AI, Blockchain, and E-Signature Integration
-- Version: 1.0
-- Description: Comprehensive offer management with AI generation, approval workflows, and e-signatures

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Offer Templates Table
CREATE TABLE IF NOT EXISTS offer_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) NOT NULL, -- 'full_time', 'contract', 'intern', 'executive'
  content JSONB NOT NULL, -- Template structure with placeholders
  variables JSONB, -- Available variables for template
  ai_optimized BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_offer_templates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Offers Table (Enhanced)
CREATE TABLE IF NOT EXISTS talent_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  offer_number VARCHAR(50) UNIQUE NOT NULL,
  application_id UUID REFERENCES applications(id),
  candidate_id UUID REFERENCES candidates(id),
  job_id UUID REFERENCES jobs(id),
  template_id UUID REFERENCES offer_templates(id),
  
  -- Compensation Details
  job_title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  employment_type VARCHAR(50), -- 'full_time', 'part_time', 'contract'
  start_date DATE,
  base_salary DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  bonus_target DECIMAL(12, 2),
  equity_shares INTEGER,
  equity_percentage DECIMAL(5, 2),
  benefits JSONB, -- Health, dental, 401k, etc.
  
  -- Offer Content
  content JSONB NOT NULL, -- Full offer letter content
  ai_generated BOOLEAN DEFAULT false,
  ai_optimization_score DECIMAL(3, 2), -- 0-1 score
  ai_suggestions JSONB, -- AI recommendations for improvement
  
  -- Status & Workflow
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_approval', 'approved', 'sent', 'accepted', 'declined', 'expired', 'withdrawn'
  approval_status VARCHAR(50), -- 'pending', 'approved', 'rejected'
  approval_required BOOLEAN DEFAULT true,
  
  -- E-Signature
  esign_provider VARCHAR(50), -- 'docusign', 'hellosign', 'adobe_sign'
  esign_envelope_id VARCHAR(255),
  esign_status VARCHAR(50), -- 'pending', 'sent', 'viewed', 'signed', 'completed'
  esign_sent_at TIMESTAMPTZ,
  esign_viewed_at TIMESTAMPTZ,
  esign_signed_at TIMESTAMPTZ,
  esign_document_url TEXT,
  
  -- Expiration
  valid_until DATE,
  expires_at TIMESTAMPTZ,
  
  -- Blockchain Verification
  blockchain_hash VARCHAR(255),
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_timestamp TIMESTAMPTZ,
  
  -- Metadata
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES talent_offers(id),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_talent_offers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Offer Approvals Table
CREATE TABLE IF NOT EXISTS offer_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  offer_id UUID NOT NULL REFERENCES talent_offers(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id),
  approver_role VARCHAR(100),
  sequence_order INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'skipped'
  decision_date TIMESTAMPTZ,
  comments TEXT,
  ai_risk_assessment JSONB, -- AI-detected risks or concerns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_offer_approvals_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Offer Versions Table
CREATE TABLE IF NOT EXISTS offer_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  offer_id UUID NOT NULL REFERENCES talent_offers(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  changes JSONB, -- What changed from previous version
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_offer_versions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Offer Activities Table
CREATE TABLE IF NOT EXISTS offer_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  offer_id UUID NOT NULL REFERENCES talent_offers(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- 'created', 'sent', 'viewed', 'signed', 'approved', 'rejected', 'expired'
  description TEXT,
  metadata JSONB,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_offer_activities_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Offer Negotiations Table
CREATE TABLE IF NOT EXISTS offer_negotiations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  offer_id UUID NOT NULL REFERENCES talent_offers(id) ON DELETE CASCADE,
  negotiation_round INTEGER DEFAULT 1,
  field_name VARCHAR(100) NOT NULL, -- 'base_salary', 'bonus', 'start_date', etc.
  original_value TEXT,
  requested_value TEXT,
  final_value TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'countered'
  candidate_notes TEXT,
  company_notes TEXT,
  ai_recommendation JSONB, -- AI suggestions for negotiation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_offer_negotiations_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_offer_templates_tenant ON offer_templates(tenant_id);
CREATE INDEX idx_offer_templates_type ON offer_templates(template_type);
CREATE INDEX idx_talent_offers_tenant ON talent_offers(tenant_id);
CREATE INDEX idx_talent_offers_candidate ON talent_offers(candidate_id);
CREATE INDEX idx_talent_offers_job ON talent_offers(job_id);
CREATE INDEX idx_talent_offers_status ON talent_offers(status);
CREATE INDEX idx_talent_offers_esign_status ON talent_offers(esign_status);
CREATE INDEX idx_offer_approvals_offer ON offer_approvals(offer_id);
CREATE INDEX idx_offer_approvals_approver ON offer_approvals(approver_id);
CREATE INDEX idx_offer_versions_offer ON offer_versions(offer_id);
CREATE INDEX idx_offer_activities_offer ON offer_activities(offer_id);
CREATE INDEX idx_offer_negotiations_offer ON offer_negotiations(offer_id);

-- Create Triggers
CREATE OR REPLACE FUNCTION update_talent_offers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_talent_offers_timestamp
  BEFORE UPDATE ON talent_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_offers_timestamp();

-- RLS Policies
ALTER TABLE offer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_negotiations ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO offer_templates (tenant_id, name, description, template_type, content, variables) VALUES
((SELECT id FROM tenants LIMIT 1), 'Standard Full-Time Offer', 'Standard offer letter for full-time employees', 'full_time', 
'{"sections": [{"title": "Position Details", "content": "We are pleased to offer you the position of {{job_title}} at {{company_name}}."}, {"title": "Compensation", "content": "Your annual salary will be {{base_salary}} paid {{pay_frequency}}."}]}',
'{"job_title": "string", "company_name": "string", "base_salary": "number", "pay_frequency": "string"}'),
((SELECT id FROM tenants LIMIT 1), 'Executive Offer', 'Comprehensive offer for executive positions', 'executive',
'{"sections": [{"title": "Executive Position", "content": "We are delighted to offer you the executive position of {{job_title}}."}, {"title": "Compensation Package", "content": "Base: {{base_salary}}, Bonus: {{bonus_target}}, Equity: {{equity_percentage}}%"}]}',
'{"job_title": "string", "base_salary": "number", "bonus_target": "number", "equity_percentage": "number"}');

INSERT INTO talent_offers (tenant_id, offer_number, candidate_id, job_id, job_title, employment_type, base_salary, status, content) VALUES
((SELECT id FROM tenants LIMIT 1), 'OFF-2025-001', (SELECT id FROM candidates LIMIT 1), (SELECT id FROM jobs LIMIT 1), 
'Senior Software Engineer', 'full_time', 150000.00, 'sent',
'{"sections": [{"title": "Position", "content": "Senior Software Engineer"}, {"title": "Salary", "content": "$150,000/year"}]}');
