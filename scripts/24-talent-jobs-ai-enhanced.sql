-- Talent Jobs/Requisitions AI-Enhanced Schema
-- Extends existing talent.requisitions table with AI/ML capabilities

-- Add AI/ML columns to requisitions if not exists
ALTER TABLE IF EXISTS talent.requisitions
ADD COLUMN IF NOT EXISTS ai_score DECIMAL(3,2) DEFAULT 0.85,
ADD COLUMN IF NOT EXISTS ml_fill_probability DECIMAL(3,2) DEFAULT 0.75,
ADD COLUMN IF NOT EXISTS ai_insights JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS blockchain_hash VARCHAR(64),
ADD COLUMN IF NOT EXISTS last_ai_analysis TIMESTAMP WITH TIME ZONE;

-- Create index for AI queries
CREATE INDEX IF NOT EXISTS idx_requisitions_ai_score ON talent.requisitions(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_requisitions_ml_probability ON talent.requisitions(ml_fill_probability DESC);

-- Add AI insights to requisition_members
ALTER TABLE IF EXISTS talent.requisition_members
ADD COLUMN IF NOT EXISTS ai_match_score DECIMAL(3,2) DEFAULT 0.80;

-- Sample data for testing (if tables are empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM talent.requisitions LIMIT 1) THEN
    -- Insert sample requisitions
    INSERT INTO talent.requisitions (
      tenant_id, title, department, location, employment_type, seniority,
      openings, status, description_md, skills, ai_score, ml_fill_probability,
      ai_insights, blockchain_hash
    )
    SELECT
      (SELECT id FROM tenants LIMIT 1),
      'Senior Software Engineer',
      'Engineering',
      'San Francisco, CA',
      'full_time',
      'senior',
      2,
      'open',
      '## About the Role\n\nWe are seeking a Senior Software Engineer...',
      ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      0.92,
      0.85,
      '{"top_skills": ["React", "TypeScript"], "market_demand": "high", "avg_time_to_fill": 45}'::jsonb,
      encode(sha256('req_001'::bytea), 'hex')
    WHERE EXISTS (SELECT 1 FROM tenants LIMIT 1);
  END IF;
END $$;
