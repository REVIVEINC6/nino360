-- CRM Documents Schema with AI Analysis
-- Comprehensive document management with AI-powered insights

-- Documents table (already exists, adding AI fields)
ALTER TABLE IF EXISTS crm.documents
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS ai_key_terms TEXT[],
ADD COLUMN IF NOT EXISTS ai_sentiment JSONB,
ADD COLUMN IF NOT EXISTS ai_risk_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS blockchain_hash TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;

-- Document AI Insights table
CREATE TABLE IF NOT EXISTS crm.document_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES crm.documents(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'risk', 'opportunity', 'compliance', 'recommendation'
  title TEXT NOT NULL,
  description TEXT,
  confidence DECIMAL(3,2) NOT NULL,
  priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Document Analytics table
CREATE TABLE IF NOT EXISTS crm.document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES crm.documents(id) ON DELETE CASCADE,
  viewer_email TEXT,
  viewer_ip TEXT,
  device_type TEXT,
  time_spent_seconds INTEGER DEFAULT 0,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Document Analytics Summary View
CREATE OR REPLACE VIEW crm.document_analytics_summary AS
SELECT 
  d.id,
  d.title,
  d.kind,
  d.status,
  d.view_count,
  d.last_viewed_at,
  COUNT(DISTINCT da.viewer_email) as unique_viewers,
  AVG(da.time_spent_seconds) as avg_time_spent,
  MAX(da.viewed_at) as last_view_date,
  COUNT(dai.id) as insight_count,
  AVG(dai.confidence) as avg_insight_confidence
FROM crm.documents d
LEFT JOIN crm.document_analytics da ON d.id = da.document_id
LEFT JOIN crm.document_ai_insights dai ON d.id = dai.document_id
GROUP BY d.id, d.title, d.kind, d.status, d.view_count, d.last_viewed_at;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_ai_insights_document_id ON crm.document_ai_insights(document_id);
CREATE INDEX IF NOT EXISTS idx_document_ai_insights_priority ON crm.document_ai_insights(priority);
CREATE INDEX IF NOT EXISTS idx_document_analytics_document_id ON crm.document_analytics(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analytics_viewer_email ON crm.document_analytics(viewer_email);
CREATE INDEX IF NOT EXISTS idx_documents_status ON crm.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_kind ON crm.documents(kind);

-- Sample AI insights
INSERT INTO crm.document_ai_insights (document_id, insight_type, title, description, confidence, priority)
SELECT 
  d.id,
  'risk',
  'Payment Terms Review',
  'Payment terms may be unfavorable. Consider negotiating 30-day terms instead of 60-day.',
  0.87,
  'high'
FROM crm.documents d
WHERE d.kind = 'proposal'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO crm.document_ai_insights (document_id, insight_type, title, description, confidence, priority)
SELECT 
  d.id,
  'opportunity',
  'Upsell Potential',
  'Document mentions additional services that could be packaged as an upsell opportunity.',
  0.92,
  'medium'
FROM crm.documents d
WHERE d.kind = 'proposal'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO crm.document_ai_insights (document_id, insight_type, title, description, confidence, priority)
SELECT 
  d.id,
  'compliance',
  'Missing Compliance Clause',
  'GDPR compliance clause is missing from this agreement. Consider adding standard data protection terms.',
  0.95,
  'critical'
FROM crm.documents d
WHERE d.kind = 'msa'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample analytics data
INSERT INTO crm.document_analytics (document_id, viewer_email, viewer_ip, device_type, time_spent_seconds)
SELECT 
  d.id,
  'client@example.com',
  '192.168.1.100',
  'desktop',
  FLOOR(RANDOM() * 600 + 60)::INTEGER
FROM crm.documents d
LIMIT 5
ON CONFLICT DO NOTHING;

-- Update existing documents with AI data
UPDATE crm.documents
SET 
  ai_summary = 'This document outlines the terms and conditions for professional services. Key highlights include project scope, deliverables, timeline, and payment terms.',
  ai_key_terms = ARRAY['scope of work', 'deliverables', 'payment terms', 'timeline', 'intellectual property', 'confidentiality', 'termination'],
  ai_sentiment = '{"score": 0.75, "label": "positive", "confidence": 0.88}'::JSONB,
  ai_risk_score = FLOOR(RANDOM() * 40 + 20)::INTEGER,
  ai_confidence = 0.85,
  view_count = FLOOR(RANDOM() * 50)::INTEGER
WHERE kind IN ('proposal', 'msa', 'sow')
AND ai_summary IS NULL;

COMMENT ON TABLE crm.document_ai_insights IS 'AI-generated insights and recommendations for documents';
COMMENT ON TABLE crm.document_analytics IS 'Tracking document views and engagement metrics';
COMMENT ON VIEW crm.document_analytics_summary IS 'Aggregated analytics for documents';
