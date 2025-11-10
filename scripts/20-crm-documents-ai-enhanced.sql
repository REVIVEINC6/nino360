-- AI-Enhanced CRM Documents Schema
-- Adds AI document analysis, blockchain verification, and smart insights

-- Extend crm.documents table with AI fields
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS ai_key_terms JSONB DEFAULT '[]'::jsonb;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS ai_sentiment JSONB DEFAULT '{}'::jsonb;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS ai_risk_score INTEGER DEFAULT 0;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(5,2) DEFAULT 0;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS blockchain_hash TEXT;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
ALTER TABLE crm.documents ADD COLUMN IF NOT EXISTS signed_by TEXT;

-- Document versions for tracking changes
CREATE TABLE IF NOT EXISTS crm.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES crm.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  changes_summary TEXT,
  ai_diff_analysis JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(document_id, version_number)
);

-- Document analytics for tracking engagement
CREATE TABLE IF NOT EXISTS crm.document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES crm.documents(id) ON DELETE CASCADE,
  viewer_email TEXT,
  viewer_ip TEXT,
  page_views INTEGER DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  device_type TEXT,
  location JSONB DEFAULT '{}'::jsonb,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI document insights
CREATE TABLE IF NOT EXISTS crm.document_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES crm.documents(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'risk', 'opportunity', 'recommendation'
  title TEXT NOT NULL,
  description TEXT,
  confidence DECIMAL(5,2) DEFAULT 0,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE crm.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.document_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.document_ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their tenant's document versions"
  ON crm.document_versions FOR SELECT
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "Users can create document versions"
  ON crm.document_versions FOR INSERT
  WITH CHECK (tenant_id = sec.current_tenant_id());

CREATE POLICY "Users can view their tenant's document analytics"
  ON crm.document_analytics FOR SELECT
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "Users can create document analytics"
  ON crm.document_analytics FOR INSERT
  WITH CHECK (tenant_id = sec.current_tenant_id());

CREATE POLICY "Users can view their tenant's document AI insights"
  ON crm.document_ai_insights FOR SELECT
  USING (tenant_id = sec.current_tenant_id());

CREATE POLICY "Users can create document AI insights"
  ON crm.document_ai_insights FOR INSERT
  WITH CHECK (tenant_id = sec.current_tenant_id());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON crm.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analytics_document_id ON crm.document_analytics(document_id);
CREATE INDEX IF NOT EXISTS idx_document_ai_insights_document_id ON crm.document_ai_insights(document_id);
CREATE INDEX IF NOT EXISTS idx_documents_blockchain_hash ON crm.documents(blockchain_hash);

-- Function to generate blockchain hash for documents
CREATE OR REPLACE FUNCTION crm.generate_document_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.blockchain_hash := encode(
    digest(
      NEW.id::text || 
      NEW.title || 
      NEW.file_url || 
      COALESCE(NEW.status, '') || 
      now()::text,
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate blockchain hash
DROP TRIGGER IF EXISTS trigger_generate_document_hash ON crm.documents;
CREATE TRIGGER trigger_generate_document_hash
  BEFORE INSERT ON crm.documents
  FOR EACH ROW
  EXECUTE FUNCTION crm.generate_document_hash();

-- Analytics view
CREATE OR REPLACE VIEW crm.document_analytics_summary AS
SELECT 
  d.id,
  d.tenant_id,
  d.title,
  d.kind,
  d.status,
  d.view_count,
  d.ai_risk_score,
  d.ai_confidence,
  COUNT(DISTINCT da.viewer_email) as unique_viewers,
  SUM(da.time_spent_seconds) as total_time_spent,
  AVG(da.time_spent_seconds) as avg_time_spent,
  MAX(da.viewed_at) as last_viewed_at,
  COUNT(dv.id) as version_count,
  COUNT(dai.id) as insight_count
FROM crm.documents d
LEFT JOIN crm.document_analytics da ON d.id = da.document_id
LEFT JOIN crm.document_versions dv ON d.id = dv.document_id
LEFT JOIN crm.document_ai_insights dai ON d.id = dai.document_id
GROUP BY d.id, d.tenant_id, d.title, d.kind, d.status, d.view_count, d.ai_risk_score, d.ai_confidence;
