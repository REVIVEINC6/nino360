-- Fix billing_accounts table to add missing columns and proper relationships

-- First, let's add the missing columns to billing_accounts
ALTER TABLE billing_accounts 
ADD COLUMN IF NOT EXISTS tenant_name TEXT,
ADD COLUMN IF NOT EXISTS usage_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_limit INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS credit_balance DECIMAL(10,2) DEFAULT 0.00;

-- Ensure the foreign key relationship exists
ALTER TABLE billing_accounts 
DROP CONSTRAINT IF EXISTS billing_accounts_subscription_plan_id_fkey;

ALTER TABLE billing_accounts 
ADD CONSTRAINT billing_accounts_subscription_plan_id_fkey 
FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id);

-- Update existing records with tenant names from tenants table
UPDATE billing_accounts 
SET tenant_name = tenants.name 
FROM tenants 
WHERE billing_accounts.tenant_id = tenants.id 
AND billing_accounts.tenant_name IS NULL;

-- Insert sample subscription plans if they don't exist
INSERT INTO subscription_plans (id, name, description, price_monthly, price_quarterly, price_annual, currency, features, modules, user_limit, storage_limit, api_limit, support_level, trial_days, is_active)
VALUES 
  ('plan_starter', 'Starter Plan', 'Perfect for small teams getting started', 99, 267, 950, 'USD', 
   ARRAY['Basic CRM', 'Task Management', 'Email Support'], 
   ARRAY['crm', 'tasks'], 10, 5, 1000, 'basic', 14, true),
  ('plan_professional', 'Professional Plan', 'Advanced features for growing businesses', 299, 807, 2870, 'USD', 
   ARRAY['Advanced CRM', 'HRMS', 'Analytics', 'Priority Support'], 
   ARRAY['crm', 'hrms', 'analytics'], 50, 25, 5000, 'premium', 14, true),
  ('plan_enterprise', 'Enterprise Plan', 'Full-featured solution for large organizations', 999, 2697, 9590, 'USD', 
   ARRAY['All Modules', 'Custom Integrations', 'Dedicated Support', 'SLA'], 
   ARRAY['crm', 'hrms', 'finance', 'talent', 'admin'], 500, 100, 50000, 'enterprise', 30, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tenants if they don't exist
INSERT INTO tenants (id, name, domain, status, subscription_plan_id, created_at, updated_at)
VALUES 
  ('tenant_techcorp', 'TechCorp Solutions', 'techcorp.com', 'active', 'plan_professional', NOW(), NOW()),
  ('tenant_startup', 'StartupXYZ', 'startupxyz.com', 'trial', 'plan_starter', NOW(), NOW()),
  ('tenant_dataflow', 'DataFlow Inc', 'dataflow.com', 'active', 'plan_enterprise', NOW(), NOW()),
  ('tenant_innovate', 'Innovate Labs', 'innovatelabs.com', 'trial', 'plan_professional', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample billing accounts with realistic churn risk scenarios
INSERT INTO billing_accounts (
  id, tenant_id, tenant_name, subscription_plan_id, status, billing_cycle, 
  current_period_start, current_period_end, trial_end, mrr, arr, 
  usage_limit, usage_current, credit_balance, last_payment_date, 
  next_billing_date, payment_method, gateway, created_at, updated_at
)
VALUES 
  -- High churn risk: Low usage, trial expiring soon
  ('billing_startup', 'tenant_startup', 'StartupXYZ', 'plan_starter', 'trial', 'monthly',
   NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', NOW() + INTERVAL '2 days',
   0, 0, 1000, 50, 0, NULL, NOW() + INTERVAL '2 days', NULL, 'stripe', NOW(), NOW()),
   
  -- Medium churn risk: Low usage, overdue payment
  ('billing_techcorp', 'tenant_techcorp', 'TechCorp Solutions', 'plan_professional', 'active', 'monthly',
   NOW() - INTERVAL '30 days', NOW(), NULL, 299, 3588, 5000, 800, -150, 
   NOW() - INTERVAL '50 days', NOW() + INTERVAL '30 days', 'credit_card', 'stripe', NOW(), NOW()),
   
  -- Low churn risk: Good usage, recent payment
  ('billing_dataflow', 'tenant_dataflow', 'DataFlow Inc', 'plan_enterprise', 'active', 'annual',
   NOW() - INTERVAL '60 days', NOW() + INTERVAL '305 days', NULL, 999, 11988, 50000, 25000, 500,
   NOW() - INTERVAL '5 days', NOW() + INTERVAL '305 days', 'bank_transfer', 'stripe', NOW(), NOW()),
   
  -- Critical churn risk: Trial expiring today, no usage
  ('billing_innovate', 'tenant_innovate', 'Innovate Labs', 'plan_professional', 'trial', 'monthly',
   NOW() - INTERVAL '14 days', NOW() + INTERVAL '16 days', NOW(), 0, 0, 5000, 0, 0,
   NULL, NOW(), NULL, 'stripe', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update tenant names in billing_accounts for consistency
UPDATE billing_accounts 
SET tenant_name = CASE 
  WHEN tenant_id = 'tenant_techcorp' THEN 'TechCorp Solutions'
  WHEN tenant_id = 'tenant_startup' THEN 'StartupXYZ'
  WHEN tenant_id = 'tenant_dataflow' THEN 'DataFlow Inc'
  WHEN tenant_id = 'tenant_innovate' THEN 'Innovate Labs'
  ELSE tenant_name
END;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_billing_accounts_tenant_id ON billing_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_accounts_status ON billing_accounts(status);
CREATE INDEX IF NOT EXISTS idx_billing_accounts_subscription_plan_id ON billing_accounts(subscription_plan_id);
