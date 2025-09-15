-- Companies Schema Fix - Ensure all columns exist
-- First, let's recreate the companies table with all required columns

-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS company_documents CASCADE;
DROP TABLE IF EXISTS company_engagements CASCADE;
DROP TABLE IF EXISTS company_opportunities CASCADE;
DROP TABLE IF EXISTS company_contacts CASCADE;
DROP TABLE IF EXISTS company_locations CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table with all required columns
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
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
    tenant_id UUID NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
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
    tenant_id UUID NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
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
    tenant_id UUID NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
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
    tenant_id UUID NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
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

-- Create indexes
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_company_locations_company_id ON company_locations(company_id);
CREATE INDEX idx_company_contacts_company_id ON company_contacts(company_id);
CREATE INDEX idx_company_opportunities_company_id ON company_opportunities(company_id);
CREATE INDEX idx_company_engagements_company_id ON company_engagements(company_id);
CREATE INDEX idx_company_documents_company_id ON company_documents(company_id);

-- Insert sample data
INSERT INTO companies (
    id, tenant_id, name, industry, revenue_range, employee_count, status, 
    hq_city, hq_country, website, phone, email, engagement_score, 
    total_value, deal_count, contact_count, owner_name, logo_url
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '550e8400-e29b-41d4-a716-446655440000',
    'TechCorp Inc.',
    'Technology',
    '$10M-$50M',
    '500-1000',
    'customer',
    'San Francisco',
    'USA',
    'https://techcorp.com',
    '+1-555-0123',
    'contact@techcorp.com',
    95,
    1200000.00,
    3,
    5,
    'Sarah Johnson',
    '/placeholder.svg?height=40&width=40&text=TC'
),
(
    '22222222-2222-2222-2222-222222222222',
    '550e8400-e29b-41d4-a716-446655440000',
    'DataFlow Solutions',
    'Software',
    '$5M-$10M',
    '100-500',
    'prospect',
    'Austin',
    'USA',
    'https://dataflow.com',
    '+1-555-0456',
    'hello@dataflow.com',
    73,
    680000.00,
    2,
    3,
    'Mike Chen',
    '/placeholder.svg?height=40&width=40&text=DF'
),
(
    '33333333-3333-3333-3333-333333333333',
    '550e8400-e29b-41d4-a716-446655440000',
    'CloudTech Ltd.',
    'Cloud Services',
    '$1M-$5M',
    '50-100',
    'strategic',
    'London',
    'UK',
    'https://cloudtech.co.uk',
    '+44-20-7946-0958',
    'info@cloudtech.co.uk',
    88,
    125000.00,
    1,
    2,
    'Emma Wilson',
    '/placeholder.svg?height=40&width=40&text=CT'
);

-- Insert sample locations
INSERT INTO company_locations (company_id, location_type, address, city, country, is_primary) VALUES
('11111111-1111-1111-1111-111111111111', 'headquarters', '123 Tech Street', 'San Francisco', 'USA', true),
('22222222-2222-2222-2222-222222222222', 'headquarters', '456 Data Avenue', 'Austin', 'USA', true),
('33333333-3333-3333-3333-333333333333', 'headquarters', '789 Cloud Lane', 'London', 'UK', true);

-- Insert sample contacts
INSERT INTO company_contacts (company_id, tenant_id, name, title, email, phone, decision_maker) VALUES
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'John Smith', 'CEO', 'john@techcorp.com', '+1-555-0124', true),
('22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000', 'Lisa Brown', 'CTO', 'lisa@dataflow.com', '+1-555-0457', true),
('33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440000', 'David Wilson', 'VP Sales', 'david@cloudtech.co.uk', '+44-20-7946-0959', false);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view companies in their tenant" ON companies
    FOR SELECT USING (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can insert companies in their tenant" ON companies
    FOR INSERT WITH CHECK (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can update companies in their tenant" ON companies
    FOR UPDATE USING (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can delete companies in their tenant" ON companies
    FOR DELETE USING (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

-- Similar policies for related tables
CREATE POLICY "Users can view company_locations" ON company_locations
    FOR SELECT USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = company_locations.company_id AND companies.tenant_id = '550e8400-e29b-41d4-a716-446655440000'));

CREATE POLICY "Users can insert company_locations" ON company_locations
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM companies WHERE companies.id = company_locations.company_id AND companies.tenant_id = '550e8400-e29b-41d4-a716-446655440000'));

CREATE POLICY "Users can view company_contacts" ON company_contacts
    FOR SELECT USING (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can insert company_contacts" ON company_contacts
    FOR INSERT WITH CHECK (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can view company_opportunities" ON company_opportunities
    FOR SELECT USING (tenant_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can insert company_opportunities" ON company_opportunities
    FOR INSERT WITH CHECK (tenant_id = '550e8400-e29b-41d4-a716-446655440000');
