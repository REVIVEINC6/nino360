-- Companies Schema for ESG OS Multi-Tenant SaaS Platform
-- Drop existing tables if they exist
DROP TABLE IF EXISTS company_documents CASCADE;
DROP TABLE IF EXISTS company_engagements CASCADE;
DROP TABLE IF EXISTS company_opportunities CASCADE;
DROP TABLE IF EXISTS company_contacts CASCADE;
DROP TABLE IF EXISTS company_locations CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT,
    revenue_range TEXT,
    employee_count TEXT,
    ownership_type TEXT,
    hq_city TEXT,
    hq_country TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    linkedin_url TEXT,
    description TEXT,
    founded_year INTEGER,
    ticker_symbol TEXT,
    ceo_name TEXT,
    headquarters_address TEXT,
    status TEXT DEFAULT 'prospect' CHECK (status IN ('customer', 'prospect', 'strategic', 'partner')),
    is_pinned BOOLEAN DEFAULT FALSE,
    engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
    total_value DECIMAL(15,2) DEFAULT 0,
    deal_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    owner_id UUID,
    owner_name TEXT,
    last_engagement_date TIMESTAMPTZ,
    logo_url TEXT,
    ai_insights JSONB DEFAULT '{}',
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_tx_id TEXT,
    rpa_automation_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Company locations table
CREATE TABLE company_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    location_type TEXT NOT NULL CHECK (location_type IN ('headquarters', 'branch', 'office', 'warehouse', 'other')),
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    phone TEXT,
    employee_count INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company contacts table
CREATE TABLE company_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    avatar_url TEXT,
    department TEXT,
    seniority_level TEXT,
    decision_maker BOOLEAN DEFAULT FALSE,
    engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
    last_contact_date TIMESTAMPTZ,
    contact_frequency TEXT,
    preferred_communication TEXT,
    notes TEXT,
    ai_personality_insights JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company opportunities table
CREATE TABLE company_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    value DECIMAL(15,2),
    currency TEXT DEFAULT 'USD',
    stage TEXT DEFAULT 'discovery' CHECK (stage IN ('discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    owner_id UUID,
    owner_name TEXT,
    source TEXT,
    competitors TEXT[],
    next_steps TEXT,
    ai_win_probability DECIMAL(5,2),
    ai_recommendations JSONB DEFAULT '{}',
    blockchain_contract_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company engagements table
CREATE TABLE company_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES company_contacts(id) ON DELETE SET NULL,
    engagement_type TEXT NOT NULL CHECK (engagement_type IN ('meeting', 'call', 'email', 'demo', 'proposal', 'contract', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    engagement_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    participants TEXT[],
    outcome TEXT,
    next_action TEXT,
    next_action_date DATE,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    ai_summary TEXT,
    ai_sentiment_score DECIMAL(3,2),
    recording_url TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company documents table
CREATE TABLE company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_type TEXT CHECK (document_type IN ('contract', 'proposal', 'presentation', 'report', 'nda', 'other')),
    file_url TEXT,
    file_size BIGINT,
    mime_type TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'signed', 'expired')),
    version INTEGER DEFAULT 1,
    tags TEXT[],
    ai_extracted_data JSONB DEFAULT '{}',
    blockchain_hash TEXT,
    access_level TEXT DEFAULT 'internal' CHECK (access_level IN ('public', 'internal', 'confidential', 'restricted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Indexes for performance
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_owner_id ON companies(owner_id);
CREATE INDEX idx_companies_engagement_score ON companies(engagement_score);
CREATE INDEX idx_companies_last_engagement ON companies(last_engagement_date);
CREATE INDEX idx_companies_name_search ON companies USING gin(to_tsvector('english', name));
CREATE INDEX idx_companies_industry ON companies(industry);

CREATE INDEX idx_company_locations_company_id ON company_locations(company_id);
CREATE INDEX idx_company_contacts_company_id ON company_contacts(company_id);
CREATE INDEX idx_company_contacts_tenant_id ON company_contacts(tenant_id);
CREATE INDEX idx_company_opportunities_company_id ON company_opportunities(company_id);
CREATE INDEX idx_company_opportunities_stage ON company_opportunities(stage);
CREATE INDEX idx_company_engagements_company_id ON company_engagements(company_id);
CREATE INDEX idx_company_engagements_date ON company_engagements(engagement_date);
CREATE INDEX idx_company_documents_company_id ON company_documents(company_id);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view companies in their tenant" ON companies
    FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can insert companies in their tenant" ON companies
    FOR INSERT WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can update companies in their tenant" ON companies
    FOR UPDATE USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can delete companies in their tenant" ON companies
    FOR DELETE USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Similar policies for related tables
CREATE POLICY "Users can view company_locations in their tenant" ON company_locations
    FOR SELECT USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = company_locations.company_id AND companies.tenant_id = current_setting('app.current_tenant_id')::uuid));

CREATE POLICY "Users can manage company_locations in their tenant" ON company_locations
    FOR ALL USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = company_locations.company_id AND companies.tenant_id = current_setting('app.current_tenant_id')::uuid));

CREATE POLICY "Users can view company_contacts in their tenant" ON company_contacts
    FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can manage company_contacts in their tenant" ON company_contacts
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view company_opportunities in their tenant" ON company_opportunities
    FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can manage company_opportunities in their tenant" ON company_opportunities
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view company_engagements in their tenant" ON company_engagements
    FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can manage company_engagements in their tenant" ON company_engagements
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can view company_documents in their tenant" ON company_documents
    FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY "Users can manage company_documents in their tenant" ON company_documents
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Functions for automated updates
CREATE OR REPLACE FUNCTION update_company_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update contact count
    UPDATE companies 
    SET contact_count = (
        SELECT COUNT(*) 
        FROM company_contacts 
        WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.company_id, OLD.company_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_opportunity_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update deal count and total value
    UPDATE companies 
    SET 
        deal_count = (
            SELECT COUNT(*) 
            FROM company_opportunities 
            WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
            AND stage NOT IN ('closed_lost')
        ),
        total_value = (
            SELECT COALESCE(SUM(value), 0)
            FROM company_opportunities 
            WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
            AND stage NOT IN ('closed_lost')
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.company_id, OLD.company_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_company_contact_stats
    AFTER INSERT OR UPDATE OR DELETE ON company_contacts
    FOR EACH ROW EXECUTE FUNCTION update_company_stats();

CREATE TRIGGER trigger_update_company_opportunity_stats
    AFTER INSERT OR UPDATE OR DELETE ON company_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_opportunity_stats();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_locations_updated_at BEFORE UPDATE ON company_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_contacts_updated_at BEFORE UPDATE ON company_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_opportunities_updated_at BEFORE UPDATE ON company_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_engagements_updated_at BEFORE UPDATE ON company_engagements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_documents_updated_at BEFORE UPDATE ON company_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
