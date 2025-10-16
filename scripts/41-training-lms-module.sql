-- =====================================================
-- Training/LMS Module - Learning Management System
-- =====================================================
-- Purpose: Upskill workforce, manage compliance training, certify roles
-- Tables: 9 core tables for learning management
-- =====================================================

-- 1. Courses
CREATE TABLE IF NOT EXISTS lms_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Course Info
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    
    -- Categorization
    category VARCHAR(100), -- technical, soft_skills, compliance, leadership
    subcategory VARCHAR(100),
    tags TEXT[],
    
    -- Course Details
    level VARCHAR(50), -- beginner, intermediate, advanced, expert
    duration_hours DECIMAL(6,2),
    language VARCHAR(10) DEFAULT 'en',
    
    -- Content
    thumbnail_url TEXT,
    intro_video_url TEXT,
    syllabus TEXT,
    learning_objectives TEXT[],
    prerequisites TEXT[],
    
    -- Instructor
    instructor_id UUID REFERENCES users(id),
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    
    -- Settings
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_mandatory BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    max_enrollments INTEGER,
    
    -- Certification
    provides_certificate BOOLEAN DEFAULT false,
    certificate_template_id UUID,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    
    -- Pricing (if applicable)
    is_paid BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Stats
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

CREATE INDEX idx_lms_courses_tenant ON lms_courses(tenant_id);
CREATE INDEX idx_lms_courses_code ON lms_courses(code);
CREATE INDEX idx_lms_courses_published ON lms_courses(is_published);
CREATE INDEX idx_lms_courses_category ON lms_courses(category);
CREATE INDEX idx_lms_courses_tags ON lms_courses USING GIN(tags);

-- 2. Course Modules
CREATE TABLE IF NOT EXISTS lms_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    
    -- Module Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL,
    
    -- Content
    duration_minutes INTEGER,
    
    -- Settings
    is_optional BOOLEAN DEFAULT false,
    unlock_after_module_id UUID REFERENCES lms_modules(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_modules_tenant ON lms_modules(tenant_id);
CREATE INDEX idx_lms_modules_course ON lms_modules(course_id);
CREATE INDEX idx_lms_modules_sequence ON lms_modules(course_id, sequence_order);

-- 3. Course Content (Lessons/Materials)
CREATE TABLE IF NOT EXISTS lms_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES lms_modules(id) ON DELETE CASCADE,
    
    -- Content Info
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- video, document, quiz, assignment, scorm, external_link
    sequence_order INTEGER NOT NULL,
    
    -- Content Data
    content_url TEXT,
    content_text TEXT,
    content_metadata JSONB, -- Flexible metadata for different content types
    
    -- Video specific
    video_duration_seconds INTEGER,
    video_transcript TEXT,
    
    -- Document specific
    document_pages INTEGER,
    
    -- Settings
    is_mandatory BOOLEAN DEFAULT true,
    estimated_time_minutes INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_content_tenant ON lms_content(tenant_id);
CREATE INDEX idx_lms_content_module ON lms_content(module_id);
CREATE INDEX idx_lms_content_sequence ON lms_content(module_id, sequence_order);
CREATE INDEX idx_lms_content_type ON lms_content(content_type);

-- 4. Enrollments
CREATE TABLE IF NOT EXISTS lms_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Enrollment Info
    enrollment_type VARCHAR(50) DEFAULT 'self', -- self, assigned, mandatory, recommended
    enrolled_by UUID REFERENCES users(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'enrolled', -- enrolled, in_progress, completed, dropped, failed
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Dates
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    due_date DATE,
    
    -- Completion
    completion_time_hours DECIMAL(6,2),
    final_score DECIMAL(5,2),
    passed BOOLEAN,
    
    -- Certificate
    certificate_issued BOOLEAN DEFAULT false,
    certificate_id UUID,
    certificate_issued_at TIMESTAMPTZ,
    
    -- Tracking
    last_accessed_at TIMESTAMPTZ,
    total_time_spent_minutes INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT lms_enrollments_unique UNIQUE(course_id, user_id)
);

CREATE INDEX idx_lms_enrollments_tenant ON lms_enrollments(tenant_id);
CREATE INDEX idx_lms_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX idx_lms_enrollments_user ON lms_enrollments(user_id);
CREATE INDEX idx_lms_enrollments_status ON lms_enrollments(status);
CREATE INDEX idx_lms_enrollments_due ON lms_enrollments(due_date);

-- 5. Learning Progress
CREATE TABLE IF NOT EXISTS lms_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES lms_content(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Progress
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Video Progress
    video_position_seconds INTEGER,
    video_completed BOOLEAN DEFAULT false,
    
    -- Attempts
    attempts_count INTEGER DEFAULT 0,
    
    -- Dates
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    
    -- Time Tracking
    time_spent_minutes INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT lms_progress_unique UNIQUE(enrollment_id, content_id)
);

CREATE INDEX idx_lms_progress_tenant ON lms_progress(tenant_id);
CREATE INDEX idx_lms_progress_enrollment ON lms_progress(enrollment_id);
CREATE INDEX idx_lms_progress_content ON lms_progress(content_id);
CREATE INDEX idx_lms_progress_user ON lms_progress(user_id);
CREATE INDEX idx_lms_progress_status ON lms_progress(status);

-- 6. Assessments/Quizzes
CREATE TABLE IF NOT EXISTS lms_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID REFERENCES lms_courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES lms_modules(id) ON DELETE CASCADE,
    content_id UUID REFERENCES lms_content(id) ON DELETE CASCADE,
    
    -- Assessment Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) DEFAULT 'quiz', -- quiz, exam, assignment, project
    
    -- Settings
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    max_attempts INTEGER DEFAULT 3,
    time_limit_minutes INTEGER,
    randomize_questions BOOLEAN DEFAULT false,
    show_correct_answers BOOLEAN DEFAULT true,
    show_answers_after VARCHAR(50) DEFAULT 'completion', -- never, completion, passing
    
    -- Proctoring
    requires_proctoring BOOLEAN DEFAULT false,
    proctoring_type VARCHAR(50), -- manual, ai, lockdown_browser
    
    -- Questions (stored as JSONB for flexibility)
    questions JSONB, -- Array of question objects
    total_questions INTEGER,
    total_points DECIMAL(6,2),
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_assessments_tenant ON lms_assessments(tenant_id);
CREATE INDEX idx_lms_assessments_course ON lms_assessments(course_id);
CREATE INDEX idx_lms_assessments_module ON lms_assessments(module_id);
CREATE INDEX idx_lms_assessments_content ON lms_assessments(content_id);

-- 7. Assessment Attempts
CREATE TABLE IF NOT EXISTS lms_assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES lms_assessments(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attempt Info
    attempt_number INTEGER NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, submitted, graded, abandoned
    
    -- Responses
    responses JSONB, -- User's answers
    
    -- Scoring
    score DECIMAL(5,2),
    points_earned DECIMAL(6,2),
    points_possible DECIMAL(6,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    time_taken_minutes INTEGER,
    
    -- Proctoring
    proctoring_data JSONB,
    flagged_for_review BOOLEAN DEFAULT false,
    review_notes TEXT,
    
    -- Feedback
    feedback TEXT,
    graded_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_attempts_tenant ON lms_assessment_attempts(tenant_id);
CREATE INDEX idx_lms_attempts_assessment ON lms_assessment_attempts(assessment_id);
CREATE INDEX idx_lms_attempts_enrollment ON lms_assessment_attempts(enrollment_id);
CREATE INDEX idx_lms_attempts_user ON lms_assessment_attempts(user_id);
CREATE INDEX idx_lms_attempts_status ON lms_assessment_attempts(status);

-- 8. Certificates
CREATE TABLE IF NOT EXISTS lms_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Certificate Info
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    
    -- Details
    issued_date DATE NOT NULL,
    expiry_date DATE,
    is_lifetime BOOLEAN DEFAULT true,
    
    -- Content
    certificate_url TEXT,
    certificate_pdf_url TEXT,
    badge_url TEXT,
    
    -- Verification
    verification_code VARCHAR(50) UNIQUE,
    is_verified BOOLEAN DEFAULT true,
    
    -- Metadata
    metadata JSONB, -- Course details, scores, etc.
    
    -- Revocation
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES users(id),
    revocation_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_certificates_tenant ON lms_certificates(tenant_id);
CREATE INDEX idx_lms_certificates_course ON lms_certificates(course_id);
CREATE INDEX idx_lms_certificates_user ON lms_certificates(user_id);
CREATE INDEX idx_lms_certificates_number ON lms_certificates(certificate_number);
CREATE INDEX idx_lms_certificates_verification ON lms_certificates(verification_code);
CREATE INDEX idx_lms_certificates_expiry ON lms_certificates(expiry_date);

-- 9. Learning Paths (Personalized Learning)
CREATE TABLE IF NOT EXISTS lms_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Path Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    path_type VARCHAR(50) DEFAULT 'custom', -- role_based, skill_based, compliance, custom
    
    -- Target
    target_role VARCHAR(100),
    target_skill VARCHAR(100),
    target_level VARCHAR(50), -- beginner, intermediate, advanced
    
    -- Courses (ordered list)
    course_ids UUID[] NOT NULL,
    total_duration_hours DECIMAL(6,2),
    
    -- Settings
    is_published BOOLEAN DEFAULT false,
    is_mandatory BOOLEAN DEFAULT false,
    
    -- Stats
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_paths_tenant ON lms_learning_paths(tenant_id);
CREATE INDEX idx_lms_paths_type ON lms_learning_paths(path_type);
CREATE INDEX idx_lms_paths_role ON lms_learning_paths(target_role);

-- Enable RLS
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_learning_paths ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant isolation)
CREATE POLICY lms_courses_tenant_isolation ON lms_courses
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_modules_tenant_isolation ON lms_modules
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_content_tenant_isolation ON lms_content
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_enrollments_tenant_isolation ON lms_enrollments
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_progress_tenant_isolation ON lms_progress
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_assessments_tenant_isolation ON lms_assessments
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_assessment_attempts_tenant_isolation ON lms_assessment_attempts
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_certificates_tenant_isolation ON lms_certificates
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY lms_learning_paths_tenant_isolation ON lms_learning_paths
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Updated_at triggers
CREATE TRIGGER update_lms_courses_updated_at BEFORE UPDATE ON lms_courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_modules_updated_at BEFORE UPDATE ON lms_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_content_updated_at BEFORE UPDATE ON lms_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_enrollments_updated_at BEFORE UPDATE ON lms_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_progress_updated_at BEFORE UPDATE ON lms_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_assessments_updated_at BEFORE UPDATE ON lms_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_attempts_updated_at BEFORE UPDATE ON lms_assessment_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_certificates_updated_at BEFORE UPDATE ON lms_certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_paths_updated_at BEFORE UPDATE ON lms_learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
