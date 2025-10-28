-- CRM AI Assistant Schema
-- Multi-tenant AI chatbot with conversation history, context awareness, and blockchain audit

-- Chat conversations table
CREATE TABLE IF NOT EXISTS crm.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context JSONB DEFAULT '{}', -- CRM context (contact_id, opportunity_id, etc.)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS crm.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES crm.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- AI model, tokens, confidence, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI actions/tools executed
CREATE TABLE IF NOT EXISTS crm.ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES crm.ai_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES crm.ai_messages(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'draft_email', 'score_lead', 'create_task', etc.
  input JSONB NOT NULL,
  output JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Blockchain audit for AI interactions
CREATE TABLE IF NOT EXISTS crm.ai_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES crm.ai_conversations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  previous_hash TEXT,
  blockchain_hash TEXT NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_tenant ON crm.ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON crm.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON crm.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_conversation ON crm.ai_actions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_tenant ON crm.ai_audit_trail(tenant_id);

-- RLS Policies
ALTER TABLE crm.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.ai_audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_conversations_tenant_isolation ON crm.ai_conversations
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY ai_messages_tenant_isolation ON crm.ai_messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM crm.ai_conversations 
      WHERE tenant_id = current_setting('app.current_tenant_id')::UUID
    )
  );

CREATE POLICY ai_actions_tenant_isolation ON crm.ai_actions
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM crm.ai_conversations 
      WHERE tenant_id = current_setting('app.current_tenant_id')::UUID
    )
  );

CREATE POLICY ai_audit_tenant_isolation ON crm.ai_audit_trail
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Auto-update timestamp
CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON crm.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
