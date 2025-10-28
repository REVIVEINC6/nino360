-- Talent Marketplace Schema
-- Job board integrations, vendor management, and talent networks

-- Job Board Integrations
CREATE TABLE IF NOT EXISTS talent_job_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'job_board', 'social_media', 'niche_board'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
  
  -- Connection Details
  api_key_encrypted TEXT,
  api_endpoint TEXT,
  credentials JSONB, -- Encrypted credentials
  
  -- Configuration
  auto_post BOOLEAN DEFAULT false,
  post_template JSONB,
  refresh_interval INTEGER DEFAULT 3600, -- seconds
  
  -- Performance Metrics
  total_posts INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  total_cost DECIMAL(12,2) DEFAULT 0,
  quality_score DECIMAL(3,2), -- 0-5.0
  
  -- AI Insights
  ai_recommendations JSONB,
  optimization_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  CONSTRAINT valid_quality_score CHECK (quality_score >= 0 AND quality_score <= 5)
);

-- Job Postings on External Boards
CREATE TABLE IF NOT EXISTS talent_external_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requisition_id UUID REFERENCES requisitions(id) ON DELETE CASCADE,
  job_board_id UUID REFERENCES talent_job_boards(id) ON DELETE CASCADE,
  
  -- Posting Details
  external_id VARCHAR(255), -- ID on the external platform
  posted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'removed'
  
  -- Performance
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  
  -- AI Analytics
  engagement_score DECIMAL(5,2),
  quality_score DECIMAL(5,2),
  ai_insights JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staffing Vendors
CREATE TABLE IF NOT EXISTS talent_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Vendor Details
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'it_staffing', 'executive_search', 'contract_staffing'
  status VARCHAR(20) DEFAULT 'active',
  
  -- Contact Information
  contact_name VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website TEXT,
  
  -- Performance Metrics
  total_placements INTEGER DEFAULT 0,
  avg_time_to_fill INTEGER, -- days
  rating DECIMAL(3,2), -- 0-5.0
  success_rate DECIMAL(5,2), -- percentage
  
  -- Financial
  total_fees DECIMAL(12,2) DEFAULT 0,
  avg_fee_percentage DECIMAL(5,2),
  
  -- Contract Terms
  contract_start_date DATE,
  contract_end_date DATE,
  terms JSONB,
  
  -- AI Insights
  ai_performance_analysis JSONB,
  recommendation_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Vendor Submissions
CREATE TABLE IF NOT EXISTS talent_vendor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES talent_vendors(id) ON DELETE CASCADE,
  requisition_id UUID REFERENCES requisitions(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  
  -- Submission Details
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'submitted', -- 'submitted', 'reviewing', 'interviewing', 'hired', 'rejected'
  
  -- Candidate Info (before creating candidate record)
  candidate_name VARCHAR(200),
  candidate_email VARCHAR(255),
  resume_url TEXT,
  
  -- Evaluation
  screening_score DECIMAL(5,2),
  interview_score DECIMAL(5,2),
  final_decision VARCHAR(50),
  decision_reason TEXT,
  
  -- Financial
  proposed_rate DECIMAL(10,2),
  placement_fee DECIMAL(10,2),
  
  -- AI Analysis
  ai_match_score DECIMAL(5,2),
  ai_insights JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Talent Networks (Alumni, Referrals, Communities)
CREATE TABLE IF NOT EXISTS talent_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Network Details
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'alumni', 'referral', 'community', 'partnership'
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  
  -- Membership
  total_members INTEGER DEFAULT 0,
  engaged_members INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  
  -- Performance
  total_referrals INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  
  -- Configuration
  auto_invite BOOLEAN DEFAULT false,
  invite_criteria JSONB,
  engagement_rules JSONB,
  
  -- AI Insights
  ai_engagement_recommendations JSONB,
  network_health_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Network Members
CREATE TABLE IF NOT EXISTS talent_network_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES talent_networks(id) ON DELETE CASCADE,
  
  -- Member Details
  email VARCHAR(255) NOT NULL,
  name VARCHAR(200),
  candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  
  -- Membership
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'opted_out'
  
  -- Engagement
  last_active_at TIMESTAMPTZ,
  referrals_made INTEGER DEFAULT 0,
  applications_submitted INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2),
  
  -- AI Insights
  ai_engagement_prediction JSONB,
  recommended_actions JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Analytics
CREATE TABLE IF NOT EXISTS talent_marketplace_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Time Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Source Performance
  source_type VARCHAR(50) NOT NULL, -- 'job_board', 'vendor', 'network', 'direct'
  source_id UUID, -- References job_board, vendor, or network
  source_name VARCHAR(200),
  
  -- Metrics
  total_applications INTEGER DEFAULT 0,
  total_interviews INTEGER DEFAULT 0,
  total_offers INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  
  -- Financial
  total_cost DECIMAL(12,2) DEFAULT 0,
  cost_per_application DECIMAL(10,2),
  cost_per_hire DECIMAL(10,2),
  
  -- Quality
  quality_score DECIMAL(5,2),
  time_to_hire_avg INTEGER, -- days
  retention_rate DECIMAL(5,2),
  
  -- ROI
  roi_percentage DECIMAL(8,2),
  
  -- AI Insights
  ai_performance_analysis JSONB,
  optimization_recommendations JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_job_boards_tenant ON talent_job_boards(tenant_id);
CREATE INDEX idx_job_boards_status ON talent_job_boards(status);
CREATE INDEX idx_external_postings_tenant ON talent_external_postings(tenant_id);
CREATE INDEX idx_external_postings_requisition ON talent_external_postings(requisition_id);
CREATE INDEX idx_external_postings_board ON talent_external_postings(job_board_id);
CREATE INDEX idx_vendors_tenant ON talent_vendors(tenant_id);
CREATE INDEX idx_vendors_status ON talent_vendors(status);
CREATE INDEX idx_vendor_submissions_tenant ON talent_vendor_submissions(tenant_id);
CREATE INDEX idx_vendor_submissions_vendor ON talent_vendor_submissions(vendor_id);
CREATE INDEX idx_vendor_submissions_requisition ON talent_vendor_submissions(requisition_id);
CREATE INDEX idx_networks_tenant ON talent_networks(tenant_id);
CREATE INDEX idx_network_members_network ON talent_network_members(network_id);
CREATE INDEX idx_network_members_email ON talent_network_members(email);
CREATE INDEX idx_marketplace_analytics_tenant ON talent_marketplace_analytics(tenant_id);
CREATE INDEX idx_marketplace_analytics_period ON talent_marketplace_analytics(period_start, period_end);

-- RLS Policies
ALTER TABLE talent_job_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_external_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_vendor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_network_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_marketplace_analytics ENABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO talent_job_boards (tenant_id, name, type, status, total_posts, total_applications, total_cost, quality_score) VALUES
((SELECT id FROM tenants LIMIT 1), 'LinkedIn', 'job_board', 'active', 45, 892, 2450.00, 4.5),
((SELECT id FROM tenants LIMIT 1), 'Indeed', 'job_board', 'active', 67, 1245, 1890.00, 4.2),
((SELECT id FROM tenants LIMIT 1), 'Glassdoor', 'job_board', 'inactive', 0, 0, 0.00, NULL),
((SELECT id FROM tenants LIMIT 1), 'ZipRecruiter', 'job_board', 'active', 34, 567, 1234.00, 3.8);

INSERT INTO talent_vendors (tenant_id, name, type, status, total_placements, avg_time_to_fill, rating) VALUES
((SELECT id FROM tenants LIMIT 1), 'TechStaff Solutions', 'it_staffing', 'active', 12, 18, 4.7),
((SELECT id FROM tenants LIMIT 1), 'Global Talent Partners', 'executive_search', 'active', 5, 45, 4.9),
((SELECT id FROM tenants LIMIT 1), 'QuickHire Staffing', 'contract_staffing', 'inactive', 0, NULL, NULL);

INSERT INTO talent_networks (tenant_id, name, type, total_members, engaged_members, total_referrals, total_hires) VALUES
((SELECT id FROM tenants LIMIT 1), 'Alumni Network', 'alumni', 1245, 892, 156, 34),
((SELECT id FROM tenants LIMIT 1), 'Employee Referrals', 'referral', 456, 234, 89, 45),
((SELECT id FROM tenants LIMIT 1), 'Talent Community', 'community', 3456, 1234, 234, 23);
