-- CRM Calendar Schema with AI Scheduling Assistant
-- Events, Tasks, and AI-powered scheduling suggestions

-- Events table
CREATE TABLE IF NOT EXISTS crm.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'call', 'demo', 'presentation', 'follow_up', 'other')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  
  -- Relationships
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE SET NULL,
  account_id UUID REFERENCES crm.accounts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES crm.opportunities(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Attendees (JSON array of user IDs and external emails)
  attendees JSONB DEFAULT '[]'::jsonb,
  
  -- AI insights
  ai_meeting_notes TEXT,
  ai_action_items JSONB DEFAULT '[]'::jsonb,
  ai_sentiment_score DECIMAL(3,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS crm.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('call', 'email', 'follow_up', 'research', 'proposal', 'contract', 'other')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Relationships
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE SET NULL,
  account_id UUID REFERENCES crm.accounts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES crm.opportunities(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- AI prioritization
  ai_priority_score DECIMAL(3,2),
  ai_reasoning TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- AI Scheduling Suggestions table
CREATE TABLE IF NOT EXISTS crm.scheduling_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE CASCADE,
  
  -- Suggestion details
  suggested_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  confidence DECIMAL(3,2) NOT NULL,
  reasoning TEXT,
  
  -- AI model info
  model_version TEXT,
  factors JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  accepted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_owner_start ON crm.events(owner_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_contact ON crm.events(contact_id);
CREATE INDEX IF NOT EXISTS idx_events_account ON crm.events(account_id);
CREATE INDEX IF NOT EXISTS idx_events_opportunity ON crm.events(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON crm.events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON crm.events(event_type);

CREATE INDEX IF NOT EXISTS idx_tasks_owner_due ON crm.tasks(owner_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_contact ON crm.tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_account ON crm.tasks(account_id);
CREATE INDEX IF NOT EXISTS idx_tasks_opportunity ON crm.tasks(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON crm.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON crm.tasks(priority);

CREATE INDEX IF NOT EXISTS idx_scheduling_user_time ON crm.scheduling_suggestions(user_id, suggested_time);
CREATE INDEX IF NOT EXISTS idx_scheduling_status ON crm.scheduling_suggestions(status);

-- Sample data for events
INSERT INTO crm.events (title, description, event_type, start_time, end_time, status, owner_id, ai_sentiment_score)
SELECT 
  'Discovery Call with ' || c.first_name || ' ' || c.last_name,
  'Initial discovery call to understand requirements',
  'call',
  NOW() + (random() * interval '30 days'),
  NOW() + (random() * interval '30 days') + interval '1 hour',
  CASE WHEN random() < 0.7 THEN 'scheduled' ELSE 'completed' END,
  u.id,
  0.5 + (random() * 0.5)
FROM crm.contacts c
CROSS JOIN auth.users u
WHERE c.id IN (SELECT id FROM crm.contacts LIMIT 5)
  AND u.id IN (SELECT id FROM auth.users LIMIT 1)
LIMIT 10
ON CONFLICT DO NOTHING;

-- Sample data for tasks
INSERT INTO crm.tasks (title, description, task_type, status, priority, due_date, owner_id, ai_priority_score, ai_reasoning)
SELECT 
  'Follow up with ' || c.first_name || ' ' || c.last_name,
  'Send follow-up email after discovery call',
  'follow_up',
  CASE 
    WHEN random() < 0.3 THEN 'completed'
    WHEN random() < 0.6 THEN 'in_progress'
    ELSE 'todo'
  END,
  CASE 
    WHEN random() < 0.2 THEN 'urgent'
    WHEN random() < 0.5 THEN 'high'
    WHEN random() < 0.8 THEN 'medium'
    ELSE 'low'
  END,
  NOW() + (random() * interval '14 days'),
  u.id,
  random(),
  'High-value contact with strong engagement history'
FROM crm.contacts c
CROSS JOIN auth.users u
WHERE c.id IN (SELECT id FROM crm.contacts LIMIT 5)
  AND u.id IN (SELECT id FROM auth.users LIMIT 1)
LIMIT 15
ON CONFLICT DO NOTHING;

-- Sample scheduling suggestions
INSERT INTO crm.scheduling_suggestions (user_id, suggested_time, duration_minutes, confidence, reasoning, model_version, status)
SELECT 
  u.id,
  NOW() + (interval '1 day' * (n + 1)) + (interval '1 hour' * (9 + (n % 8))),
  60,
  0.7 + (random() * 0.3),
  'Optimal time based on past meeting patterns and availability',
  'gpt-4o',
  'pending'
FROM auth.users u
CROSS JOIN generate_series(1, 5) AS n
WHERE u.id IN (SELECT id FROM auth.users LIMIT 1)
LIMIT 5
ON CONFLICT DO NOTHING;
