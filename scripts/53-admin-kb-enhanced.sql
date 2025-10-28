-- Knowledge Base Articles Table
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('docs', 'playbooks', 'training')),
  author_id UUID NOT NULL,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kb_articles_author ON kb_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_category ON kb_articles(category);
CREATE INDEX IF NOT EXISTS idx_kb_articles_status ON kb_articles(status);
CREATE INDEX IF NOT EXISTS idx_kb_articles_tags ON kb_articles USING GIN(tags);

-- Sample data
INSERT INTO kb_articles (title, content, category, author_id, views, helpful_count, tags, status) VALUES
('Getting Started with Nino360', E'# Getting Started\n\nWelcome to Nino360 HRMS platform...', 'docs', '00000000-0000-0000-0000-000000000000', 150, 45, ARRAY['getting-started', 'guide'], 'published'),
('Employee Onboarding Playbook', E'# Onboarding Process\n\nStep-by-step guide for onboarding new employees...', 'playbooks', '00000000-0000-0000-0000-000000000000', 89, 32, ARRAY['onboarding', 'hr'], 'published'),
('Security Best Practices', E'# Security Guidelines\n\nEssential security practices for administrators...', 'docs', '00000000-0000-0000-0000-000000000000', 67, 28, ARRAY['security', 'admin'], 'published');
