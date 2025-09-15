-- Billing Schema for ESG OS Platform
-- This schema handles subscription management, billing accounts, invoices, and usage tracking

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_quarterly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}', -- API calls, storage, users, etc.
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Accounts Table
CREATE TABLE IF NOT EXISTS billing_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial', 'overdue')),
    billing_email VARCHAR(255),
    billing_address JSONB,
    payment_method JSONB,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    mrr DECIMAL(10,2) DEFAULT 0, -- Monthly Recurring Revenue
    arr DECIMAL(10,2) DEFAULT 0, -- Annual Recurring Revenue
    credits DECIMAL(10,2) DEFAULT 0,
    usage_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tenant_name VARCHAR(255),
    usage_current INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 1000,
    last_payment_date TIMESTAMP WITH TIME ZONE,
    credit_balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    line_items JSONB DEFAULT '[]',
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    metric VARCHAR(50) NOT NULL, -- api_calls, storage_gb, users, etc.
    value DECIMAL(15,2) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Events Table (Audit Trail)
CREATE TABLE IF NOT EXISTS billing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'bank', 'paypal', 'stripe')),
    provider VARCHAR(50),
    provider_id VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discounts and Coupons Table
CREATE TABLE IF NOT EXISTS discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    applicable_plans UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applied Discounts Table
CREATE TABLE IF NOT EXISTS applied_discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE CASCADE,
    discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    discount_amount DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    UNIQUE(billing_account_id, discount_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_billing_accounts_tenant_id ON billing_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_accounts_status ON billing_accounts(status);
CREATE INDEX IF NOT EXISTS idx_billing_accounts_next_billing_date ON billing_accounts(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_invoices_billing_account_id ON invoices(billing_account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_billing_account_id ON usage_tracking(billing_account_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_billing_events_billing_account_id ON billing_events(billing_account_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_billing_account_id ON payment_methods(billing_account_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_accounts_updated_at BEFORE UPDATE ON billing_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_quarterly, price_annual, features, limits, is_popular) VALUES
('Starter', 'Perfect for small teams getting started', 29.00, 78.30, 290.00, 
 '{"modules": ["crm", "basic_hrms"], "support": "email", "integrations": 5}',
 '{"users": 5, "api_calls": 10000, "storage_gb": 10}', false),
('Professional', 'Ideal for growing businesses', 99.00, 267.30, 990.00,
 '{"modules": ["crm", "hrms", "talent", "finance"], "support": "priority", "integrations": 25}',
 '{"users": 25, "api_calls": 100000, "storage_gb": 100}', true),
('Enterprise', 'For large organizations with advanced needs', 299.00, 807.30, 2990.00,
 '{"modules": ["all"], "support": "dedicated", "integrations": "unlimited"}',
 '{"users": "unlimited", "api_calls": "unlimited", "storage_gb": 1000}', false),
('Custom', 'Tailored solutions for specific requirements', NULL, NULL, NULL,
 '{"modules": ["custom"], "support": "white_glove", "integrations": "unlimited"}',
 '{"users": "custom", "api_calls": "custom", "storage_gb": "custom"}', false)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applied_discounts ENABLE ROW LEVEL SECURITY;

-- Subscription plans are readable by all authenticated users
CREATE POLICY "Subscription plans are viewable by authenticated users" ON subscription_plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- Billing accounts are only accessible by tenant members and admins
CREATE POLICY "Billing accounts are viewable by tenant members" ON billing_accounts
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Billing accounts are manageable by tenant admins" ON billing_accounts
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() AND role IN ('admin', 'billing_admin')
        ) OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Similar policies for other tables
CREATE POLICY "Invoices are viewable by billing account members" ON invoices
    FOR SELECT USING (
        billing_account_id IN (
            SELECT ba.id FROM billing_accounts ba
            JOIN tenant_users tu ON ba.tenant_id = tu.tenant_id
            WHERE tu.user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Usage tracking is viewable by billing account members" ON usage_tracking
    FOR SELECT USING (
        billing_account_id IN (
            SELECT ba.id FROM billing_accounts ba
            JOIN tenant_users tu ON ba.tenant_id = tu.tenant_id
            WHERE tu.user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Functions for billing calculations
CREATE OR REPLACE FUNCTION calculate_mrr(account_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    plan_price DECIMAL(10,2);
    billing_cycle VARCHAR(20);
    mrr_value DECIMAL(10,2);
BEGIN
    SELECT sp.price_monthly, sp.billing_cycle
    INTO plan_price, billing_cycle
    FROM billing_accounts ba
    JOIN subscription_plans sp ON ba.subscription_plan_id = sp.id
    WHERE ba.id = account_id;
    
    CASE billing_cycle
        WHEN 'monthly' THEN mrr_value := plan_price;
        WHEN 'quarterly' THEN mrr_value := plan_price / 3;
        WHEN 'annual' THEN mrr_value := plan_price / 12;
        ELSE mrr_value := 0;
    END CASE;
    
    RETURN COALESCE(mrr_value, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_arr(account_id UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
    RETURN calculate_mrr(account_id) * 12;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update MRR/ARR when subscription changes
CREATE OR REPLACE FUNCTION update_billing_metrics()
RETURNS TRIGGER AS $$
BEGIN
    NEW.mrr := calculate_mrr(NEW.id);
    NEW.arr := calculate_arr(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_billing_account_metrics 
    BEFORE INSERT OR UPDATE ON billing_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_billing_metrics();

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM invoices
    WHERE invoice_number LIKE 'INV-%';
    
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 6, '0');
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger 
    BEFORE INSERT ON invoices 
    FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

COMMENT ON TABLE subscription_plans IS 'Defines available subscription plans with pricing and features';
COMMENT ON TABLE billing_accounts IS 'Billing information and subscription details for each tenant';
COMMENT ON TABLE invoices IS 'Generated invoices for billing accounts';
COMMENT ON TABLE usage_tracking IS 'Tracks usage metrics for billing purposes';
COMMENT ON TABLE billing_events IS 'Audit trail for all billing-related events and changes';
COMMENT ON TABLE payment_methods IS 'Stored payment methods for billing accounts';
COMMENT ON TABLE discounts IS 'Available discount codes and promotional offers';
COMMENT ON TABLE applied_discounts IS 'Tracks which discounts have been applied to billing accounts';
