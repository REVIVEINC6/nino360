-- Nino360 Platform - Complete Production Sample Data
-- This script populates all tables with realistic sample data for testing and demonstration

BEGIN;

-- Set the default tenant context
SET LOCAL app.current_tenant_id = '00000000-0000-0000-0000-000000000001';
SET LOCAL app.current_user_id = '00000000-0000-0000-0000-000000000001';

-- =============================================
-- BENCH MANAGEMENT SAMPLE DATA
-- =============================================

-- Sample bench resources
INSERT INTO bench_resources (tenant_id, first_name, last_name, email, phone, location, department, designation, experience_years, availability_status, skills, billing_rate, cost_rate, performance_rating) VALUES
('00000000-0000-0000-0000-000000000001', 'John', 'Smith', 'john.smith@company.com', '+1-555-0101', 'New York', 'Engineering', 'Senior Software Engineer', 5.5, 'available', '["JavaScript", "React", "Node.js", "AWS"]', 120.00, 80.00, 4.2),
('00000000-0000-0000-0000-000000000001', 'Sarah', 'Johnson', 'sarah.johnson@company.com', '+1-555-0102', 'San Francisco', 'Engineering', 'Full Stack Developer', 3.0, 'allocated', '["Python", "Django", "PostgreSQL", "Docker"]', 100.00, 70.00, 4.5),
('00000000-0000-0000-0000-000000000001', 'Michael', 'Brown', 'michael.brown@company.com', '+1-555-0103', 'Chicago', 'Design', 'UI/UX Designer', 4.0, 'available', '["Figma", "Adobe XD", "Sketch", "Prototyping"]', 90.00, 60.00, 4.0),
('00000000-0000-0000-0000-000000000001', 'Emily', 'Davis', 'emily.davis@company.com', '+1-555-0104', 'Austin', 'Engineering', 'DevOps Engineer', 6.0, 'on_leave', '["AWS", "Kubernetes", "Terraform", "Jenkins"]', 130.00, 85.00, 4.3),
('00000000-0000-0000-0000-000000000001', 'David', 'Wilson', 'david.wilson@company.com', '+1-555-0105', 'Seattle', 'Analytics', 'Data Scientist', 4.5, 'available', '["Python", "R", "Machine Learning", "SQL"]', 110.00, 75.00, 4.1),
('00000000-0000-0000-0000-000000000001', 'Lisa', 'Anderson', 'lisa.anderson@company.com', '+1-555-0106', 'Boston', 'Management', 'Project Manager', 7.0, 'allocated', '["Agile", "Scrum", "JIRA", "Risk Management"]', 95.00, 65.00, 4.4),
('00000000-0000-0000-0000-000000000001', 'Robert', 'Taylor', 'robert.taylor@company.com', '+1-555-0107', 'Denver', 'Engineering', 'Backend Developer', 3.5, 'available', '["Java", "Spring Boot", "MySQL", "Redis"]', 105.00, 72.00, 3.9),
('00000000-0000-0000-0000-000000000001', 'Jennifer', 'Martinez', 'jennifer.martinez@company.com', '+1-555-0108', 'Miami', 'QA', 'QA Engineer', 2.5, 'available', '["Selenium", "TestNG", "API Testing", "Automation"]', 85.00, 58.00, 4.2);

-- Sample project allocations
INSERT INTO project_allocations (tenant_id, resource_id, project_name, client_name, allocation_percentage, start_date, end_date, billing_rate, role, status) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM bench_resources WHERE email = 'sarah.johnson@company.com'), 'E-commerce Platform', 'TechCorp Inc.', 100, '2024-01-15', '2024-06-15', 100.00, 'Full Stack Developer', 'active'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM bench_resources WHERE email = 'lisa.anderson@company.com'), 'Mobile App Development', 'StartupXYZ', 80, '2024-02-01', '2024-08-01', 95.00, 'Project Manager', 'active'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM bench_resources WHERE email = 'emily.davis@company.com'), 'Cloud Migration', 'Enterprise Corp', 100, '2024-01-01', '2024-04-01', 130.00, 'DevOps Lead', 'completed');

-- =============================================
-- FINANCE MANAGEMENT SAMPLE DATA
-- =============================================

-- Sample budget
INSERT INTO budgets (tenant_id, name, fiscal_year, start_date, end_date, total_budget, status, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'FY 2024 Operating Budget', 2024, '2024-01-01', '2024-12-31', 2500000.00, 'active', '00000000-0000-0000-0000-000000000001');

-- Sample budget line items
INSERT INTO budget_line_items (tenant_id, budget_id, account_id, category, budgeted_amount, actual_amount) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM budgets WHERE name = 'FY 2024 Operating Budget'), (SELECT id FROM chart_of_accounts WHERE account_code = '4000'), 'Revenue', 3000000.00, 750000.00),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM budgets WHERE name = 'FY 2024 Operating Budget'), (SELECT id FROM chart_of_accounts WHERE account_code = '5000'), 'Cost of Sales', 1200000.00, 300000.00),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM budgets WHERE name = 'FY 2024 Operating Budget'), (SELECT id FROM chart_of_accounts WHERE account_code = '6000'), 'Operating Expenses', 1300000.00, 325000.00);

-- Sample financial transactions
INSERT INTO financial_transactions (tenant_id, transaction_date, reference_number, description, total_amount, status, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '2024-01-15', 'INV-2024-001', 'Client payment - TechCorp Inc.', 50000.00, 'approved', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', '2024-01-20', 'EXP-2024-001', 'Office rent payment', -8000.00, 'approved', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', '2024-01-25', 'SAL-2024-001', 'Payroll - January 2024', -120000.00, 'approved', '00000000-0000-0000-0000-000000000001');

-- =============================================
-- VMS SAMPLE DATA
-- =============================================

-- Sample vendors
INSERT INTO vendors (tenant_id, name, legal_name, vendor_code, email, phone, website, business_type, industry, status, rating, payment_terms) VALUES
('00000000-0000-0000-0000-000000000001', 'TechStaff Solutions', 'TechStaff Solutions LLC', 'VEN-001', 'contact@techstaff.com', '+1-555-1001', 'https://techstaff.com', 'LLC', 'IT Staffing', 'active', 4.5, 'Net 30'),
('00000000-0000-0000-0000-000000000001', 'Global IT Resources', 'Global IT Resources Inc.', 'VEN-002', 'info@globalit.com', '+1-555-1002', 'https://globalit.com', 'Corporation', 'IT Services', 'active', 4.2, 'Net 15'),
('00000000-0000-0000-0000-000000000001', 'Creative Design Hub', 'Creative Design Hub Ltd.', 'VEN-003', 'hello@designhub.com', '+1-555-1003', 'https://designhub.com', 'Limited', 'Design Services', 'active', 4.7, 'Net 30'),
('00000000-0000-0000-0000-000000000001', 'DataPro Consulting', 'DataPro Consulting Corp.', 'VEN-004', 'contact@datapro.com', '+1-555-1004', 'https://datapro.com', 'Corporation', 'Data Analytics', 'active', 4.3, 'Net 45');

-- Sample vendor jobs
INSERT INTO vendor_jobs (tenant_id, vendor_id, title, description, job_type, location, required_skills, experience_level, budget_min, budget_max, status, priority, created_by) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM vendors WHERE vendor_code = 'VEN-001'), 'Senior React Developer', 'Looking for an experienced React developer for a 6-month project', 'contract', 'Remote', '["React", "JavaScript", "TypeScript", "Redux"]', 'Senior', 80.00, 120.00, 'open', 'high', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM vendors WHERE vendor_code = 'VEN-002'), 'DevOps Engineer', 'DevOps engineer needed for cloud infrastructure setup', 'contract', 'New York', '["AWS", "Kubernetes", "Docker", "Terraform"]', 'Mid-level', 90.00, 130.00, 'open', 'medium', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM vendors WHERE vendor_code = 'VEN-003'), 'UI/UX Designer', 'Creative designer for mobile app redesign project', 'project', 'San Francisco', '["Figma", "Adobe Creative Suite", "Prototyping"]', 'Mid-level', 60.00, 90.00, 'filled', 'medium', '00000000-0000-0000-0000-000000000001');

-- =============================================
-- TRAINING SAMPLE DATA
-- =============================================

-- Sample training programs
INSERT INTO training_programs (tenant_id, title, description, category, level, duration_hours, format, max_participants, cost, status, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Advanced React Development', 'Comprehensive training on advanced React concepts and patterns', 'Technical', 'advanced', 40, 'online', 20, 1200.00, 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Project Management Fundamentals', 'Introduction to project management methodologies and tools', 'Management', 'beginner', 24, 'hybrid', 15, 800.00, 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Data Science with Python', 'Learn data science concepts using Python and popular libraries', 'Technical', 'intermediate', 60, 'online', 25, 1500.00, 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Leadership Skills Development', 'Develop essential leadership and communication skills', 'Soft Skills', 'intermediate', 16, 'classroom', 12, 600.00, 'active', '00000000-0000-0000-0000-000000000001');

-- Sample training sessions
INSERT INTO training_sessions (tenant_id, program_id, session_name, start_date, end_date, location, instructor, max_participants, status) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM training_programs WHERE title = 'Advanced React Development'), 'React Advanced - Batch 1', '2024-03-01 09:00:00', '2024-03-08 17:00:00', 'Online', 'John Doe', 20, 'scheduled'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM training_programs WHERE title = 'Project Management Fundamentals'), 'PM Fundamentals - Q1', '2024-02-15 10:00:00', '2024-02-17 16:00:00', 'New York Office', 'Sarah Wilson', 15, 'completed'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM training_programs WHERE title = 'Data Science with Python'), 'Data Science - Spring 2024', '2024-04-01 09:00:00', '2024-04-15 17:00:00', 'Online', 'Dr. Michael Chen', 25, 'scheduled');

-- =============================================
-- HOTLIST SAMPLE DATA
-- =============================================

-- Sample hotlist candidates
INSERT INTO hotlist_candidates (tenant_id, first_name, last_name, email, phone, current_location, current_title, current_company, experience_years, skills, availability, expected_salary_min, expected_salary_max, priority_level, status, recruiter_id) VALUES
('00000000-0000-0000-0000-000000000001', 'Alex', 'Thompson', 'alex.thompson@email.com', '+1-555-2001', 'San Francisco', 'Senior Software Engineer', 'Tech Innovations Inc.', 6.5, '["JavaScript", "React", "Node.js", "AWS", "MongoDB"]', 'two_weeks', 140000, 160000, 'high', 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Maria', 'Rodriguez', 'maria.rodriguez@email.com', '+1-555-2002', 'Austin', 'Data Scientist', 'Analytics Pro', 4.0, '["Python", "Machine Learning", "TensorFlow", "SQL", "Tableau"]', 'immediate', 120000, 140000, 'high', 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'James', 'Lee', 'james.lee@email.com', '+1-555-2003', 'Seattle', 'DevOps Engineer', 'Cloud Systems Ltd.', 5.0, '["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"]', 'one_month', 130000, 150000, 'medium', 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Rachel', 'Kim', 'rachel.kim@email.com', '+1-555-2004', 'New York', 'Product Manager', 'StartupXYZ', 3.5, '["Product Strategy", "Agile", "User Research", "Analytics"]', 'negotiable', 110000, 130000, 'medium', 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Daniel', 'Chen', 'daniel.chen@email.com', '+1-555-2005', 'Boston', 'Full Stack Developer', 'WebDev Solutions', 4.5, '["React", "Python", "Django", "PostgreSQL", "Redis"]', 'immediate', 115000, 135000, 'high', 'active', '00000000-0000-0000-0000-000000000001');

-- Sample hotlist requirements
INSERT INTO hotlist_requirements (tenant_id, title, description, client_name, location, job_type, required_skills, experience_min, experience_max, salary_min, salary_max, priority, status, assigned_recruiter, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Senior React Developer', 'Looking for a senior React developer to lead frontend development', 'TechCorp Inc.', 'San Francisco', 'contract', '["React", "JavaScript", "TypeScript", "Redux"]', 5, 8, 130000, 160000, 'high', 'open', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Data Science Lead', 'Data science lead for AI/ML initiatives', 'DataFlow Solutions', 'Remote', 'permanent', '["Python", "Machine Learning", "TensorFlow", "AWS"]', 4, 7, 140000, 170000, 'urgent', 'open', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'DevOps Architect', 'Senior DevOps engineer for cloud infrastructure', 'CloudTech Ltd.', 'Seattle', 'contract_to_hire', '["AWS", "Kubernetes", "Terraform", "Jenkins"]', 6, 10, 150000, 180000, 'high', 'open', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Product Manager - Mobile', 'Product manager for mobile app development', 'MobileFirst Inc.', 'Austin', 'permanent', '["Product Strategy", "Mobile Apps", "Agile", "Analytics"]', 3, 6, 120000, 145000, 'medium', 'in_progress', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

-- Sample candidate-requirement matches
INSERT INTO candidate_requirement_matches (tenant_id, candidate_id, requirement_id, match_score, skills_match_percentage, experience_match, location_match, salary_match, status) VALUES
('00000000-0000-0000-0000-000000000001', 
 (SELECT id FROM hotlist_candidates WHERE email = 'alex.thompson@email.com'),
 (SELECT id FROM hotlist_requirements WHERE title = 'Senior React Developer'),
 92.5, 95.0, true, true, true, 'submitted'),
('00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hotlist_candidates WHERE email = 'maria.rodriguez@email.com'),
 (SELECT id FROM hotlist_requirements WHERE title = 'Data Science Lead'),
 88.0, 90.0, true, false, true, 'interviewing'),
('00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hotlist_candidates WHERE email = 'james.lee@email.com'),
 (SELECT id FROM hotlist_requirements WHERE title = 'DevOps Architect'),
 85.5, 88.0, false, true, true, 'potential');

-- =============================================
-- SYSTEM CONFIGURATION SAMPLE DATA
-- =============================================

-- Sample system settings
INSERT INTO system_settings (tenant_id, category, key, value, description) VALUES
('00000000-0000-0000-0000-000000000001', 'general', 'company_name', '"Nino360 Platform"', 'Company name'),
('00000000-0000-0000-0000-000000000001', 'general', 'timezone', '"America/New_York"', 'Default timezone'),
('00000000-0000-0000-0000-000000000001', 'general', 'currency', '"USD"', 'Default currency'),
('00000000-0000-0000-0000-000000000001', 'email', 'smtp_host', '"smtp.gmail.com"', 'SMTP server host'),
('00000000-0000-0000-0000-000000000001', 'email', 'smtp_port', '587', 'SMTP server port'),
('00000000-0000-0000-0000-000000000001', 'notifications', 'email_enabled', 'true', 'Enable email notifications'),
('00000000-0000-0000-0000-000000000001', 'notifications', 'slack_enabled', 'false', 'Enable Slack notifications'),
('00000000-0000-0000-0000-000000000001', 'security', 'password_min_length', '8', 'Minimum password length'),
('00000000-0000-0000-0000-000000000001', 'security', 'session_timeout', '3600', 'Session timeout in seconds'),
('00000000-0000-0000-0000-000000000001', 'ai', 'openai_enabled', 'true', 'Enable OpenAI integration'),
('00000000-0000-0000-0000-000000000001', 'billing', 'default_billing_rate', '100.00', 'Default hourly billing rate');

-- Sample notifications
INSERT INTO notifications (tenant_id, user_id, title, message, type, priority) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome to Nino360', 'Welcome to the Nino360 Platform! Your account has been set up successfully.', 'success', 'normal'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'New Project Allocation', 'Sarah Johnson has been allocated to the E-commerce Platform project.', 'info', 'normal'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Budget Alert', 'Operating expenses are at 85% of the allocated budget for Q1.', 'warning', 'high'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Training Reminder', 'Your Advanced React Development training session starts tomorrow at 9:00 AM.', 'info', 'normal'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Candidate Match Found', 'High-match candidate found for Senior React Developer position (92.5% match).', 'success', 'high');

COMMIT;
