-- Marketplace Items Table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('ai', 'integration', 'analytics', 'automation', 'crm', 'hrms', 'finance')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('module', 'ai-pack', 'add-on', 'integration')),
    version VARCHAR(20) DEFAULT '1.0.0',
    status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'deprecated', 'coming-soon')),
    visibility VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'tenant-specific')),
    
    -- Pricing Information
    pricing_model VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (pricing_model IN ('free', 'one-time', 'subscription', 'usage-based')),
    pricing_amount DECIMAL(10,2),
    pricing_currency VARCHAR(3) DEFAULT 'USD',
    pricing_billing_cycle VARCHAR(10) CHECK (pricing_billing_cycle IN ('monthly', 'yearly')),
    pricing_free_trial_days INTEGER,
    
    -- Features and Requirements
    features JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    compatibility JSONB DEFAULT '[]',
    
    -- Developer Information
    developer_name VARCHAR(255),
    developer_email VARCHAR(255),
    developer_website VARCHAR(500),
    
    -- Media
    media_icon VARCHAR(50) DEFAULT 'Package',
    media_screenshots JSONB DEFAULT '[]',
    media_video VARCHAR(500),
    
    -- Statistics (updated by triggers/functions)
    stats_total_installs INTEGER DEFAULT 0,
    stats_active_installs INTEGER DEFAULT 0,
    stats_avg_rating DECIMAL(3,2) DEFAULT 0,
    stats_total_reviews INTEGER DEFAULT 0,
    stats_monthly_usage INTEGER DEFAULT 0,
    stats_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Metadata
    metadata_tags JSONB DEFAULT '[]',
    metadata_support_url VARCHAR(500),
    metadata_documentation_url VARCHAR(500),
    metadata_changelog_url VARCHAR(500),
    
    -- Tenant Restrictions
    tenant_restrictions_plan_tiers JSONB DEFAULT '[]',
    tenant_restrictions_excluded_tenants JSONB DEFAULT '[]',
    tenant_restrictions_included_tenants JSONB DEFAULT '[]',
    
    -- Audit Fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || COALESCE(description, ''))
    ) STORED
);

-- Marketplace Promotions Table
CREATE TABLE IF NOT EXISTS marketplace_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('discount', 'free-trial', 'bundle', 'upgrade')),
    value DECIMAL(10,2) NOT NULL,
    value_type VARCHAR(20) NOT NULL CHECK (value_type IN ('percentage', 'fixed', 'days')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    target_tenants JSONB DEFAULT '[]',
    conditions JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Marketplace Analytics Table
CREATE TABLE IF NOT EXISTS marketplace_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    period VARCHAR(10) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
    date DATE NOT NULL,
    installs INTEGER DEFAULT 0,
    uninstalls INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    churn_rate DECIMAL(5,4) DEFAULT 0,
    support_tickets INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(item_id, period, date)
);

-- AI Marketplace Insights Table
CREATE TABLE IF NOT EXISTS ai_marketplace_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('forecast', 'pricing', 'bundling', 'promotion', 'lifecycle')),
    item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    impact VARCHAR(10) NOT NULL CHECK (impact IN ('low', 'medium', 'high')),
    category VARCHAR(50) NOT NULL,
    data JSONB DEFAULT '{}',
    actionable BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Item Installs (Track tenant installations)
CREATE TABLE IF NOT EXISTS marketplace_item_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    uninstalled_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'uninstalled')),
    config_overrides JSONB DEFAULT '{}',
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    
    UNIQUE(item_id, tenant_id)
);

-- Marketplace Item Reviews
CREATE TABLE IF NOT EXISTS marketplace_item_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(item_id, tenant_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_visibility ON marketplace_items(visibility);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_search ON marketplace_items USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_promotions_item_id ON marketplace_promotions(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_promotions_active ON marketplace_promotions(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_marketplace_promotions_dates ON marketplace_promotions(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_item_period ON marketplace_analytics(item_id, period, date);
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_date ON marketplace_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_installs_tenant ON marketplace_item_installs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_installs_status ON marketplace_item_installs(status);

-- Functions for updating statistics
CREATE OR REPLACE FUNCTION update_marketplace_item_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update item statistics when installs change
    UPDATE marketplace_items 
    SET 
        stats_total_installs = (
            SELECT COUNT(*) 
            FROM marketplace_item_installs 
            WHERE item_id = NEW.item_id
        ),
        stats_active_installs = (
            SELECT COUNT(*) 
            FROM marketplace_item_installs 
            WHERE item_id = NEW.item_id AND status = 'active'
        ),
        updated_at = NOW()
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating stats
CREATE TRIGGER trigger_update_marketplace_stats
    AFTER INSERT OR UPDATE OR DELETE ON marketplace_item_installs
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_item_stats();

-- Function to update item ratings
CREATE OR REPLACE FUNCTION update_marketplace_item_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE marketplace_items 
    SET 
        stats_avg_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM marketplace_item_reviews 
            WHERE item_id = NEW.item_id
        ),
        stats_total_reviews = (
            SELECT COUNT(*)
            FROM marketplace_item_reviews 
            WHERE item_id = NEW.item_id
        ),
        updated_at = NOW()
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating ratings
CREATE TRIGGER trigger_update_marketplace_ratings
    AFTER INSERT OR UPDATE OR DELETE ON marketplace_item_reviews
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_item_ratings();

-- RLS Policies
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_marketplace_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_item_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_item_reviews ENABLE ROW LEVEL SECURITY;

-- Admin access to all marketplace data
CREATE POLICY "Admins can manage all marketplace items" ON marketplace_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'marketplace_manager')
        )
    );

-- Tenants can view public items
CREATE POLICY "Tenants can view public marketplace items" ON marketplace_items
    FOR SELECT USING (
        visibility = 'public' AND status = 'active'
    );

-- Similar policies for other tables...
CREATE POLICY "Admins can manage promotions" ON marketplace_promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'marketplace_manager')
        )
    );

CREATE POLICY "Admins can view analytics" ON marketplace_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'marketplace_manager')
        )
    );

-- Grant permissions
GRANT ALL ON marketplace_items TO authenticated;
GRANT ALL ON marketplace_promotions TO authenticated;
GRANT ALL ON marketplace_analytics TO authenticated;
GRANT ALL ON ai_marketplace_insights TO authenticated;
GRANT ALL ON marketplace_item_installs TO authenticated;
GRANT ALL ON marketplace_item_reviews TO authenticated;
