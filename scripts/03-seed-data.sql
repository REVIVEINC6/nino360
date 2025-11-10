-- NINO360 Production Foundation — Seed Data
-- Create master tenant and demo data

-- ============================================
-- CREATE MASTER TENANT
-- ============================================

INSERT INTO core.tenants(slug, name, status, subscription_tier) 
VALUES ('master', 'Nino360 Master', 'active', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DEMO TENANT & DATA
-- ============================================

-- Create demo tenant
INSERT INTO core.tenants(slug, name, status, subscription_tier) 
VALUES ('acme-staffing', 'Acme Staffing Solutions', 'active', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- Note: Users will be created through Supabase Auth signup
-- The auth webhook will automatically link them to the master tenant

-- Insert demo clients (for demo tenant)
INSERT INTO core.clients (tenant_id, name, industry, website, status, tier, notes)
SELECT t.id, 'TechCorp Inc', 'Technology', 'https://techcorp.example.com', 'active', 'platinum', 'Major technology client'
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.clients (tenant_id, name, industry, website, status, tier, notes)
SELECT t.id, 'FinanceHub LLC', 'Finance', 'https://financehub.example.com', 'active', 'gold', 'Financial services partner'
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.clients (tenant_id, name, industry, website, status, tier, notes)
SELECT t.id, 'HealthTech Solutions', 'Healthcare', 'https://healthtech.example.com', 'active', 'silver', 'Healthcare technology'
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

-- Insert demo candidates
INSERT INTO core.candidates (tenant_id, first_name, last_name, email, phone, location, current_title, skills, experience_years, status, rating)
SELECT t.id, 'John', 'Doe', 'john.doe@example.com', '+1-555-0101', 'San Francisco, CA', 'Senior Software Engineer', 
  ARRAY['React', 'Node.js', 'TypeScript', 'AWS'], 8, 'screening', 5
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.candidates (tenant_id, first_name, last_name, email, phone, location, current_title, skills, experience_years, status, rating)
SELECT t.id, 'Jane', 'Smith', 'jane.smith@example.com', '+1-555-0102', 'New York, NY', 'Full Stack Developer',
  ARRAY['Python', 'Django', 'PostgreSQL', 'Docker'], 6, 'interviewing', 4
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.candidates (tenant_id, first_name, last_name, email, phone, location, current_title, skills, experience_years, status, rating)
SELECT t.id, 'Michael', 'Johnson', 'michael.j@example.com', '+1-555-0103', 'Austin, TX', 'DevOps Engineer',
  ARRAY['Kubernetes', 'Terraform', 'Jenkins', 'AWS'], 7, 'new', 5
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

-- Insert demo vendors
INSERT INTO core.vendors (tenant_id, name, type, contact_email, contact_phone, status, rating)
SELECT t.id, 'Elite Tech Staffing', 'staffing_agency', 'contact@elitetech.example.com', '+1-555-0201', 'active', 5
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.vendors (tenant_id, name, type, contact_email, contact_phone, status, rating)
SELECT t.id, 'Global Consulting Partners', 'consulting_firm', 'info@globalcp.example.com', '+1-555-0202', 'active', 4
FROM core.tenants t WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

-- Insert demo projects
INSERT INTO core.projects (tenant_id, client_id, name, description, status, start_date, end_date, budget)
SELECT t.id, c.id, 'E-commerce Platform Redesign', 'Complete overhaul of the e-commerce platform', 
  'active', '2025-01-01'::DATE, '2025-06-30'::DATE, 500000
FROM core.tenants t
JOIN core.clients c ON c.tenant_id = t.id AND c.name = 'TechCorp Inc'
WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;

INSERT INTO core.projects (tenant_id, client_id, name, description, status, start_date, end_date, budget)
SELECT t.id, c.id, 'Mobile Banking App', 'Develop new mobile banking application',
  'active', '2025-02-01'::DATE, '2025-08-31'::DATE, 750000
FROM core.tenants t
JOIN core.clients c ON c.tenant_id = t.id AND c.name = 'FinanceHub LLC'
WHERE t.slug = 'acme-staffing'
ON CONFLICT DO NOTHING;
