-- CRM Calendar & Tasks AI-Enhanced Schema
-- Multi-tenant calendar with AI scheduling assistant, smart reminders, and blockchain audit

-- Events/Meetings table with AI scheduling
CREATE TABLE IF NOT EXISTS crm.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'call', 'demo', 'follow_up', 'internal')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_url TEXT,
  
  -- Relationships
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE SET NULL,
  account_id UUID REFERENCES crm.accounts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES crm.opportunities(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- AI scheduling fields
  ai_suggested BOOLEAN DEFAULT false,
  ai_optimal_time TIMESTAMPTZ,
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  ai_reasoning TEXT,
  
  -- Status and tracking
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  attendees JSONB DEFAULT '[]'::jsonb,
  reminders JSONB DEFAULT '[]'::jsonb,
  
  -- Blockchain audit
  blockchain_hash TEXT,
  previous_hash TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Tasks table with AI prioritization
CREATE TABLE IF NOT EXISTS crm.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('follow_up', 'email', 'call', 'research', 'proposal', 'other')),
  
  -- Relationships
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE SET NULL,
  account_id UUID REFERENCES crm.accounts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES crm.opportunities(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Scheduling
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- AI prioritization
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  ai_priority_score DECIMAL(3,2) CHECK (ai_priority_score >= 0 AND ai_priority_score <= 1),
  ai_suggested_due_date TIMESTAMPTZ,
  ai_reasoning TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- Blockchain audit
  blockchain_hash TEXT,
  previous_hash TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- AI scheduling suggestions
CREATE TABLE IF NOT EXISTS crm.scheduling_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Suggestion details
  suggested_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  
  -- Context
  contact_id UUID REFERENCES crm.contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES crm.opportunities(id) ON DELETE CASCADE,
  
  -- ML model info
  model_version TEXT,
  factors JSONB, -- Factors considered: timezone, past meeting patterns, availability, etc.
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  accepted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_tenant_owner ON crm.events(tenant_id, owner_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON crm.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_contact ON crm.events(contact_id);
CREATE INDEX IF NOT EXISTS idx_events_account ON crm.events(account_id);
CREATE INDEX IF NOT EXISTS idx_events_opportunity ON crm.events(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON crm.events(status);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_owner ON crm.tasks(tenant_id, owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON crm.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON crm.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON crm.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_contact ON crm.tasks(contact_id);

CREATE INDEX IF NOT EXISTS idx_scheduling_suggestions_user ON crm.scheduling_suggestions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduling_suggestions_time ON crm.scheduling_suggestions(suggested_time);

-- RLS Policies
ALTER TABLE crm.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.scheduling_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_tenant_isolation ON crm.events
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tasks_tenant_isolation ON crm.tasks
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY scheduling_suggestions_tenant_isolation ON crm.scheduling_suggestions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Auto-update timestamps
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON crm.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON crm.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blockchain hash generation
CREATE OR REPLACE FUNCTION generate_event_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.previous_hash := (
    SELECT blockchain_hash FROM crm.events 
    WHERE tenant_id = NEW.tenant_id 
    ORDER BY created_at DESC 
    LIMIT 1
  );
  NEW.blockchain_hash := encode(
    digest(
      NEW.id::text || 
      NEW.title || 
      NEW.start_time::text || 
      COALESCE(NEW.previous_hash, ''),
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_blockchain_hash BEFORE INSERT ON crm.events
  FOR EACH ROW EXECUTE FUNCTION generate_event_hash();

CREATE OR REPLACE FUNCTION generate_task_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.previous_hash := (
    SELECT blockchain_hash FROM crm.tasks 
    WHERE tenant_id = NEW.tenant_id 
    ORDER BY created_at DESC 
    LIMIT 1
  );
  NEW.blockchain_hash := encode(
    digest(
      NEW.id::text || 
      NEW.title || 
      COALESCE(NEW.due_date::text, '') || 
      COALESCE(NEW.previous_hash, ''),
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_blockchain_hash BEFORE INSERT ON crm.tasks
  FOR EACH ROW EXECUTE FUNCTION generate_task_hash();
