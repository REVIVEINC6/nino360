-- Admin Support Tickets Schema
CREATE TABLE IF NOT EXISTS admin_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  tenant_id UUID,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  category TEXT NOT NULL,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  tags TEXT[],
  ai_sentiment TEXT,
  ai_category TEXT,
  ai_priority_score NUMERIC(3,2)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_status ON admin_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON admin_support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON admin_support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON admin_support_tickets(assigned_to);

-- Sample data
INSERT INTO admin_support_tickets (ticket_number, subject, description, customer_name, customer_email, priority, status, category, ai_sentiment, ai_category, ai_priority_score)
VALUES
  ('TKT-0001', 'Login issues', 'Unable to login to the platform', 'Acme Corp', 'support@acme.com', 'high', 'open', 'Technical', 'negative', 'authentication', 0.85),
  ('TKT-0002', 'Feature request', 'Would like to see dark mode', 'TechStart Inc', 'hello@techstart.com', 'low', 'resolved', 'Feature', 'positive', 'enhancement', 0.25),
  ('TKT-0003', 'Billing question', 'Question about invoice', 'Global Systems', 'billing@global.com', 'medium', 'in_progress', 'Billing', 'neutral', 'billing', 0.55),
  ('TKT-0004', 'Data export not working', 'CSV export fails with error', 'DataCo', 'admin@dataco.com', 'urgent', 'open', 'Technical', 'negative', 'data', 0.95)
ON CONFLICT (ticket_number) DO NOTHING;
