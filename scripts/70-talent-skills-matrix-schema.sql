-- Talent Skills Matrix Schema
-- Comprehensive skill tracking, gap analysis, and development planning

-- Skills taxonomy table
CREATE TABLE IF NOT EXISTS public.talent_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- technical, soft, leadership, domain
    description TEXT,
    proficiency_levels JSONB DEFAULT '["Beginner", "Intermediate", "Advanced", "Expert", "Master"]'::jsonb,
    is_core BOOLEAN DEFAULT false,
    parent_skill_id UUID REFERENCES public.talent_skills(id),
    
    -- AI/ML fields
    ai_demand_score INTEGER DEFAULT 0, -- 0-100
    market_trend VARCHAR(50), -- growing, stable, declining
    avg_salary_impact DECIMAL(10,2),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    UNIQUE(tenant_id, name)
);

-- Employee skills table
CREATE TABLE IF NOT EXISTS public.talent_employee_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES public.talent_skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) NOT NULL,
    proficiency_score INTEGER CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
    
    -- Verification
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(100), -- self-reported, manager-verified, assessment, certification
    
    -- Evidence
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    assessments JSONB DEFAULT '[]'::jsonb,
    
    -- AI assessment
    ai_confidence_score INTEGER DEFAULT 0,
    ai_assessment_date TIMESTAMPTZ,
    ai_notes TEXT,
    
    -- Tracking
    years_of_experience DECIMAL(4,2),
    last_used_date DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, employee_id, skill_id)
);

-- Skill gaps table
CREATE TABLE IF NOT EXISTS public.talent_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES public.talent_skills(id) ON DELETE CASCADE,
    department VARCHAR(100),
    role VARCHAR(100),
    
    -- Gap analysis
    current_level INTEGER NOT NULL, -- 0-100
    target_level INTEGER NOT NULL, -- 0-100
    gap_percentage INTEGER GENERATED ALWAYS AS (target_level - current_level) STORED,
    priority VARCHAR(50) NOT NULL, -- critical, high, medium, low
    
    -- Impact
    business_impact TEXT,
    affected_employees INTEGER DEFAULT 0,
    estimated_cost DECIMAL(12,2),
    
    -- AI insights
    ai_recommendations JSONB DEFAULT '[]'::jsonb,
    ai_timeline_months INTEGER,
    ai_confidence INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'identified', -- identified, planned, in-progress, closed
    resolution_plan TEXT,
    target_date DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- Development plans table
CREATE TABLE IF NOT EXISTS public.talent_development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES public.talent_skills(id) ON DELETE CASCADE,
    
    -- Plan details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    current_level VARCHAR(50),
    target_level VARCHAR(50),
    duration_months INTEGER,
    
    -- Activities
    activities JSONB DEFAULT '[]'::jsonb, -- courses, projects, mentorship, etc.
    milestones JSONB DEFAULT '[]'::jsonb,
    resources JSONB DEFAULT '[]'::jsonb,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed, cancelled
    
    -- AI generation
    ai_generated BOOLEAN DEFAULT false,
    ai_personalization_score INTEGER DEFAULT 0,
    ai_success_probability INTEGER DEFAULT 0,
    
    -- Dates
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    
    -- Budget
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    
    -- Approval
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- Skill matching results table
CREATE TABLE IF NOT EXISTS public.talent_skill_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    candidate_id UUID,
    employee_id UUID,
    job_id UUID,
    
    -- Match scores
    overall_match_score INTEGER NOT NULL CHECK (overall_match_score >= 0 AND overall_match_score <= 100),
    technical_match_score INTEGER,
    soft_skills_match_score INTEGER,
    experience_match_score INTEGER,
    
    -- Detailed analysis
    matching_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    transferable_skills JSONB DEFAULT '[]'::jsonb,
    
    -- AI insights
    ai_confidence VARCHAR(50), -- high, medium, low
    ai_recommendation TEXT,
    ai_reasoning TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    
    -- ML predictions
    hire_success_probability INTEGER,
    retention_probability INTEGER,
    time_to_productivity_days INTEGER,
    
    -- Metadata
    match_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill assessments table
CREATE TABLE IF NOT EXISTS public.talent_skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES public.talent_skills(id) ON DELETE CASCADE,
    
    -- Assessment details
    assessment_type VARCHAR(100) NOT NULL, -- test, project, interview, peer-review
    assessment_name VARCHAR(255),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    proficiency_level VARCHAR(50),
    
    -- Results
    passed BOOLEAN,
    feedback TEXT,
    strengths TEXT,
    areas_for_improvement TEXT,
    
    -- AI evaluation
    ai_evaluated BOOLEAN DEFAULT false,
    ai_score INTEGER,
    ai_feedback TEXT,
    
    -- Assessor
    assessed_by UUID,
    assessment_date DATE NOT NULL,
    
    -- Evidence
    evidence_url TEXT,
    certificate_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_talent_skills_tenant ON public.talent_skills(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_skills_category ON public.talent_skills(category);
CREATE INDEX IF NOT EXISTS idx_talent_employee_skills_tenant ON public.talent_employee_skills(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_employee_skills_employee ON public.talent_employee_skills(employee_id);
CREATE INDEX IF NOT EXISTS idx_talent_employee_skills_skill ON public.talent_employee_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_talent_skill_gaps_tenant ON public.talent_skill_gaps(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_skill_gaps_priority ON public.talent_skill_gaps(priority);
CREATE INDEX IF NOT EXISTS idx_talent_development_plans_tenant ON public.talent_development_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_development_plans_employee ON public.talent_development_plans(employee_id);
CREATE INDEX IF NOT EXISTS idx_talent_development_plans_status ON public.talent_development_plans(status);
CREATE INDEX IF NOT EXISTS idx_talent_skill_matches_tenant ON public.talent_skill_matches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_talent_skill_matches_candidate ON public.talent_skill_matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_talent_skill_matches_job ON public.talent_skill_matches(job_id);

-- Enable RLS
ALTER TABLE public.talent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_skill_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_skill_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view skills in their tenant" ON public.talent_skills
    FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view employee skills in their tenant" ON public.talent_employee_skills
    FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view skill gaps in their tenant" ON public.talent_skill_gaps
    FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view development plans in their tenant" ON public.talent_development_plans
    FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

CREATE POLICY "Users can view skill matches in their tenant" ON public.talent_skill_matches
    FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_talent_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER talent_skills_updated_at BEFORE UPDATE ON public.talent_skills
    FOR EACH ROW EXECUTE FUNCTION update_talent_skills_updated_at();

CREATE TRIGGER talent_employee_skills_updated_at BEFORE UPDATE ON public.talent_employee_skills
    FOR EACH ROW EXECUTE FUNCTION update_talent_skills_updated_at();

CREATE TRIGGER talent_skill_gaps_updated_at BEFORE UPDATE ON public.talent_skill_gaps
    FOR EACH ROW EXECUTE FUNCTION update_talent_skills_updated_at();

CREATE TRIGGER talent_development_plans_updated_at BEFORE UPDATE ON public.talent_development_plans
    FOR EACH ROW EXECUTE FUNCTION update_talent_skills_updated_at();

-- Insert sample data
INSERT INTO public.talent_skills (tenant_id, name, category, description, is_core, ai_demand_score, market_trend) VALUES
('00000000-0000-0000-0000-000000000000', 'React', 'technical', 'JavaScript library for building user interfaces', true, 95, 'growing'),
('00000000-0000-0000-0000-000000000000', 'Node.js', 'technical', 'JavaScript runtime for server-side development', true, 92, 'stable'),
('00000000-0000-0000-0000-000000000000', 'AWS', 'technical', 'Amazon Web Services cloud platform', true, 98, 'growing'),
('00000000-0000-0000-0000-000000000000', 'TypeScript', 'technical', 'Typed superset of JavaScript', true, 90, 'growing'),
('00000000-0000-0000-0000-000000000000', 'Leadership', 'soft', 'Ability to lead and inspire teams', true, 85, 'stable'),
('00000000-0000-0000-0000-000000000000', 'Communication', 'soft', 'Effective verbal and written communication', true, 88, 'stable'),
('00000000-0000-0000-0000-000000000000', 'Kubernetes', 'technical', 'Container orchestration platform', true, 94, 'growing'),
('00000000-0000-0000-0000-000000000000', 'Machine Learning', 'technical', 'AI and ML algorithms and frameworks', true, 97, 'growing');
