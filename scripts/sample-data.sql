-- ESG OS Platform - Sample Data
-- This script inserts realistic sample data for testing and development

-- Insert sample users for each tenant
DO $$
DECLARE
    tenant_techcorp UUID;
    tenant_startup UUID;
    tenant_global UUID;
    user_admin_techcorp UUID;
    user_manager_techcorp UUID;
    user_sales_techcorp UUID;
    user_admin_startup UUID;
    user_hr_startup UUID;
    company_acme UUID;
    company_innovate UUID;
    contact_john UUID;
    contact_sarah UUID;
    lead_enterprise UUID;
    opportunity_saas UUID;
    employee_alice UUID;
    employee_bob UUID;
    job_position_dev UUID;
    candidate_mike UUID;
    course_leadership UUID;
    session_leadership UUID;
    customer_acme UUID;
    vendor_office UUID;
    invoice_001 UUID;
    task_followup UUID;
BEGIN
    -- Get tenant IDs
    SELECT id INTO tenant_techcorp FROM tenants WHERE slug = 'techcorp';
    SELECT id INTO tenant_startup FROM tenants WHERE slug = 'startupxyz';
    SELECT id INTO tenant_global FROM tenants WHERE slug = 'global-ent';

    -- Insert users for TechCorp
    INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at) VALUES
    (tenant_techcorp, 'admin@techcorp.com', 'Admin', 'User', 'tenant_admin', 'active', NOW()),
    (tenant_techcorp, 'manager@techcorp.com', 'Jane', 'Manager', 'manager', 'active', NOW()),
    (tenant_techcorp, 'sales@techcorp.com', 'Tom', 'Sales', 'user', 'active', NOW());

    -- Get user IDs
    SELECT id INTO user_admin_techcorp FROM users WHERE email = 'admin@techcorp.com' AND tenant_id = tenant_techcorp;
    SELECT id INTO user_manager_techcorp FROM users WHERE email = 'manager@techcorp.com' AND tenant_id = tenant_techcorp;
    SELECT id INTO user_sales_techcorp FROM users WHERE email = 'sales@techcorp.com' AND tenant_id = tenant_techcorp;

    -- Insert users for StartupXYZ
    INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at) VALUES
    (tenant_startup, 'admin@startup.com', 'Startup', 'Admin', 'tenant_admin', 'active', NOW()),
    (tenant_startup, 'hr@startup.com', 'Lisa', 'HR', 'manager', 'active', NOW());

    SELECT id INTO user_admin_startup FROM users WHERE email = 'admin@startup.com' AND tenant_id = tenant_startup;
    SELECT id INTO user_hr_startup FROM users WHERE email = 'hr@startup.com' AND tenant_id = tenant_startup;

    -- Insert companies for TechCorp
    INSERT INTO companies (tenant_id, name, website, industry, size, annual_revenue, city, country, created_by) VALUES
    (tenant_techcorp, 'Acme Corporation', 'https://acme.com', 'Technology', 'Large', 50000000.00, 'New York', 'USA', user_admin_techcorp),
    (tenant_techcorp, 'Innovate Solutions', 'https://innovate.com', 'Software', 'Medium', 10000000.00, 'San Francisco', 'USA', user_manager_techcorp);

    SELECT id INTO company_acme FROM companies WHERE name = 'Acme Corporation' AND tenant_id = tenant_techcorp;
    SELECT id INTO company_innovate FROM companies WHERE name = 'Innovate Solutions' AND tenant_id = tenant_techcorp;

    -- Insert contacts
    INSERT INTO contacts (tenant_id, company_id, first_name, last_name, email, phone, job_title, created_by) VALUES
    (tenant_techcorp, company_acme, 'John', 'Smith', 'john.smith@acme.com', '+1-555-0101', 'CTO', user_admin_techcorp),
    (tenant_techcorp, company_innovate, 'Sarah', 'Johnson', 'sarah@innovate.com', '+1-555-0102', 'CEO', user_manager_techcorp);

    SELECT id INTO contact_john FROM contacts WHERE email = 'john.smith@acme.com' AND tenant_id = tenant_techcorp;
    SELECT id INTO contact_sarah FROM contacts WHERE email = 'sarah@innovate.com' AND tenant_id = tenant_techcorp;

    -- Insert leads
    INSERT INTO leads (tenant_id, company_id, contact_id, title, description, source, status, priority, estimated_value, probability, expected_close_date, assigned_to, created_by) VALUES
    (tenant_techcorp, company_acme, contact_john, 'Enterprise Software Solution', 'Large enterprise software implementation project', 'Website', 'qualified', 'high', 250000.00, 75, CURRENT_DATE + INTERVAL '30 days', user_sales_techcorp, user_admin_techcorp),
    (tenant_techcorp, company_innovate, contact_sarah, 'Cloud Migration Project', 'Complete cloud infrastructure migration', 'Referral', 'proposal', 'medium', 150000.00, 60, CURRENT_DATE + INTERVAL '45 days', user_manager_techcorp, user_admin_techcorp);

    SELECT id INTO lead_enterprise FROM leads WHERE title = 'Enterprise Software Solution' AND tenant_id = tenant_techcorp;

    -- Insert opportunities
    INSERT INTO opportunities (id, tenant_id, lead_id, company_id, contact_id, name, description, stage, amount, probability, expected_close_date, assigned_to, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, lead_enterprise, company_acme, contact_john, 'Acme Corp - SaaS Platform', 'Custom SaaS platform development', 'Negotiation', 300000.00, 80, CURRENT_DATE + INTERVAL '20 days', user_sales_techcorp, user_admin_techcorp)
    RETURNING id INTO opportunity_saas;

    -- Insert activities
    INSERT INTO activities (tenant_id, type, subject, description, start_time, end_time, status, related_to_type, related_to_id, assigned_to, created_by) VALUES
    (tenant_techcorp, 'meeting', 'Discovery Call with Acme Corp', 'Initial discovery call to understand requirements', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 'scheduled', 'lead', lead_enterprise, user_sales_techcorp, user_admin_techcorp),
    (tenant_techcorp, 'call', 'Follow-up Call', 'Follow-up on proposal discussion', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '30 minutes', 'scheduled', 'opportunity', opportunity_saas, user_manager_techcorp, user_admin_techcorp);

    -- Insert employees
    INSERT INTO employees (id, tenant_id, employee_id, first_name, last_name, email, hire_date, job_title, department, employment_type, salary, status, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, 'EMP001', 'Alice', 'Developer', 'alice@techcorp.com', '2023-01-15', 'Senior Software Engineer', 'Engineering', 'full-time', 95000.00, 'active', user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, 'EMP002', 'Bob', 'Designer', 'bob@techcorp.com', '2023-03-01', 'UX Designer', 'Design', 'full-time', 75000.00, 'active', user_admin_techcorp)
    RETURNING id INTO employee_alice;

    SELECT id INTO employee_alice FROM employees WHERE employee_id = 'EMP001' AND tenant_id = tenant_techcorp;
    SELECT id INTO employee_bob FROM employees WHERE employee_id = 'EMP002' AND tenant_id = tenant_techcorp;

    -- Insert departments
    INSERT INTO departments (tenant_id, name, description, head_id) VALUES
    (tenant_techcorp, 'Engineering', 'Software development and technical operations', employee_alice),
    (tenant_techcorp, 'Design', 'User experience and visual design', employee_bob),
    (tenant_startup, 'Human Resources', 'Employee management and recruitment', null);

    -- Insert attendance records
    INSERT INTO attendance (tenant_id, employee_id, date, check_in_time, check_out_time, total_hours, status) VALUES
    (tenant_techcorp, employee_alice, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:30:00', 8.5, 'present'),
    (tenant_techcorp, employee_bob, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:15:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:45:00', 8.5, 'present'),
    (tenant_techcorp, employee_alice, CURRENT_DATE, CURRENT_DATE + TIME '09:00:00', null, null, 'present'),
    (tenant_techcorp, employee_bob, CURRENT_DATE, CURRENT_DATE + TIME '09:10:00', null, null, 'present');

    -- Insert leave requests
    INSERT INTO leave_requests (tenant_id, employee_id, leave_type, start_date, end_date, days_requested, reason, status) VALUES
    (tenant_techcorp, employee_alice, 'vacation', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days', 5, 'Family vacation', 'approved'),
    (tenant_techcorp, employee_bob, 'sick', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 1, 'Medical appointment', 'pending');

    -- Insert job positions
    INSERT INTO job_positions (id, tenant_id, title, department, location, employment_type, experience_level, salary_min, salary_max, description, status, hiring_manager, created_by) VALUES
    (uuid_generate_v4(), tenant_startup, 'Full Stack Developer', 'Engineering', 'Remote', 'full-time', 'mid', 70000.00, 90000.00, 'We are looking for a talented Full Stack Developer to join our growing team.', 'open', user_admin_startup, user_admin_startup),
    (uuid_generate_v4(), tenant_startup, 'Product Manager', 'Product', 'San Francisco', 'full-time', 'senior', 100000.00, 130000.00, 'Seeking an experienced Product Manager to lead our product strategy.', 'open', user_admin_startup, user_admin_startup)
    RETURNING id INTO job_position_dev;

    SELECT id INTO job_position_dev FROM job_positions WHERE title = 'Full Stack Developer' AND tenant_id = tenant_startup;

    -- Insert candidates
    INSERT INTO candidates (id, tenant_id, first_name, last_name, email, phone, current_position, current_company, experience_years, expected_salary, skills, status, source, created_by) VALUES
    (uuid_generate_v4(), tenant_startup, 'Mike', 'Wilson', 'mike.wilson@email.com', '+1-555-0201', 'Software Engineer', 'Tech Startup', 4, 85000.00, ARRAY['JavaScript', 'React', 'Node.js', 'Python'], 'new', 'LinkedIn', user_hr_startup),
    (uuid_generate_v4(), tenant_startup, 'Emma', 'Davis', 'emma.davis@email.com', '+1-555-0202', 'Frontend Developer', 'Digital Agency', 3, 75000.00, ARRAY['React', 'Vue.js', 'CSS', 'TypeScript'], 'screening', 'Job Board', user_hr_startup)
    RETURNING id INTO candidate_mike;

    SELECT id INTO candidate_mike FROM candidates WHERE email = 'mike.wilson@email.com' AND tenant_id = tenant_startup;

    -- Insert job applications
    INSERT INTO job_applications (tenant_id, job_position_id, candidate_id, status, cover_letter, rating, assigned_to) VALUES
    (tenant_startup, job_position_dev, candidate_mike, 'interview', 'I am excited about the opportunity to join your team and contribute to your innovative projects.', 4, user_hr_startup);

    -- Insert interviews
    INSERT INTO interviews (tenant_id, job_application_id, type, round, scheduled_at, duration_minutes, status, interviewer_id, created_by) VALUES
    (tenant_startup, (SELECT id FROM job_applications WHERE candidate_id = candidate_mike), 'video', 1, NOW() + INTERVAL '2 days', 60, 'scheduled', user_admin_startup, user_hr_startup);

    -- Insert chart of accounts
    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description) VALUES
    (tenant_techcorp, '1000', 'Cash', 'asset', 'Cash and cash equivalents'),
    (tenant_techcorp, '1200', 'Accounts Receivable', 'asset', 'Money owed by customers'),
    (tenant_techcorp, '2000', 'Accounts Payable', 'liability', 'Money owed to suppliers'),
    (tenant_techcorp, '4000', 'Revenue', 'revenue', 'Income from sales'),
    (tenant_techcorp, '5000', 'Operating Expenses', 'expense', 'Day-to-day business expenses');

    -- Insert customers
    INSERT INTO customers (id, tenant_id, company_id, customer_code, name, email, phone, payment_terms, currency, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, company_acme, 'CUST001', 'Acme Corporation', 'billing@acme.com', '+1-555-0301', 30, 'USD', user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, company_innovate, 'CUST002', 'Innovate Solutions', 'accounts@innovate.com', '+1-555-0302', 15, 'USD', user_admin_techcorp)
    RETURNING id INTO customer_acme;

    SELECT id INTO customer_acme FROM customers WHERE customer_code = 'CUST001' AND tenant_id = tenant_techcorp;

    -- Insert vendors
    INSERT INTO vendors (id, tenant_id, vendor_code, name, email, phone, payment_terms, currency, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, 'VEND001', 'Office Supplies Co', 'orders@officesupplies.com', '+1-555-0401', 30, 'USD', user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, 'VEND002', 'Cloud Services Inc', 'billing@cloudservices.com', '+1-555-0402', 15, 'USD', user_admin_techcorp)
    RETURNING id INTO vendor_office;

    SELECT id INTO vendor_office FROM vendors WHERE vendor_code = 'VEND001' AND tenant_id = tenant_techcorp;

    -- Insert invoices
    INSERT INTO invoices (id, tenant_id, customer_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, customer_acme, 'INV-001', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 25000.00, 2500.00, 27500.00, 'sent', user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, customer_acme, 'INV-002', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 15000.00, 1500.00, 16500.00, 'draft', user_admin_techcorp)
    RETURNING id INTO invoice_001;

    SELECT id INTO invoice_001 FROM invoices WHERE invoice_number = 'INV-001' AND tenant_id = tenant_techcorp;

    -- Insert invoice line items
    INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, line_total) VALUES
    (invoice_001, 'Software Development Services', 100.00, 250.00, 25000.00);

    -- Insert payments
    INSERT INTO payments (tenant_id, invoice_id, payment_date, amount, payment_method, reference_number, status, created_by) VALUES
    (tenant_techcorp, invoice_001, CURRENT_DATE - INTERVAL '2 days', 27500.00, 'bank_transfer', 'TXN-12345', 'completed', user_admin_techcorp);

    -- Insert expenses
    INSERT INTO expenses (tenant_id, employee_id, vendor_id, account_id, expense_date, amount, description, category, is_reimbursable, is_approved, created_by) VALUES
    (tenant_techcorp, employee_alice, vendor_office, (SELECT id FROM chart_of_accounts WHERE account_code = '5000' AND tenant_id = tenant_techcorp), CURRENT_DATE - INTERVAL '3 days', 150.00, 'Office supplies for development team', 'Office Supplies', false, true, user_admin_techcorp),
    (tenant_techcorp, employee_bob, null, (SELECT id FROM chart_of_accounts WHERE account_code = '5000' AND tenant_id = tenant_techcorp), CURRENT_DATE - INTERVAL '1 day', 75.00, 'Design software subscription', 'Software', true, false, user_admin_techcorp);

    -- Insert training courses
    INSERT INTO training_courses (id, tenant_id, title, description, category, level, duration_hours, learning_objectives, is_active, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, 'Leadership Fundamentals', 'Essential leadership skills for managers and team leads', 'Leadership', 'intermediate', 16, 'Develop core leadership competencies and team management skills', true, user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, 'Advanced JavaScript', 'Deep dive into modern JavaScript concepts and frameworks', 'Technical', 'advanced', 24, 'Master advanced JavaScript patterns and best practices', true, user_admin_techcorp)
    RETURNING id INTO course_leadership;

    SELECT id INTO course_leadership FROM training_courses WHERE title = 'Leadership Fundamentals' AND tenant_id = tenant_techcorp;

    -- Insert training sessions
    INSERT INTO training_sessions (id, tenant_id, course_id, title, start_date, end_date, start_time, end_time, location, max_participants, instructor_id, status, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, course_leadership, 'Leadership Fundamentals - Batch 1', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', '09:00:00', '17:00:00', 'Conference Room A', 15, user_manager_techcorp, 'scheduled', user_admin_techcorp)
    RETURNING id INTO session_leadership;

    SELECT id INTO session_leadership FROM training_sessions WHERE title = 'Leadership Fundamentals - Batch 1' AND tenant_id = tenant_techcorp;

    -- Insert training enrollments
    INSERT INTO training_enrollments (tenant_id, session_id, employee_id, status, progress_percentage) VALUES
    (tenant_techcorp, session_leadership, employee_alice, 'not_started', 0),
    (tenant_techcorp, session_leadership, employee_bob, 'not_started', 0);

    -- Insert tasks
    INSERT INTO tasks (id, tenant_id, title, description, status, priority, due_date, estimated_hours, related_to_type, related_to_id, assigned_to, created_by) VALUES
    (uuid_generate_v4(), tenant_techcorp, 'Follow up with Acme Corp', 'Send follow-up email after the discovery call', 'pending', 'high', CURRENT_DATE + INTERVAL '2 days', 1.0, 'lead', lead_enterprise, user_sales_techcorp, user_admin_techcorp),
    (uuid_generate_v4(), tenant_techcorp, 'Prepare proposal for Innovate Solutions', 'Create detailed project proposal and timeline', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '5 days', 8.0, 'opportunity', opportunity_saas, user_manager_techcorp, user_admin_techcorp)
    RETURNING id INTO task_followup;

    SELECT id INTO task_followup FROM tasks WHERE title = 'Follow up with Acme Corp' AND tenant_id = tenant_techcorp;

    -- Insert task comments
    INSERT INTO task_comments (task_id, user_id, comment) VALUES
    (task_followup, user_sales_techcorp, 'Discovery call went well. They are interested in our enterprise solution.'),
    (task_followup, user_admin_techcorp, 'Great! Make sure to highlight our security features in the follow-up.');

    -- Insert documents
    INSERT INTO documents (tenant_id, name, description, file_path, file_size, mime_type, category, related_to_type, related_to_id, uploaded_by) VALUES
    (tenant_techcorp, 'Acme Corp - Requirements Document', 'Detailed requirements gathered from discovery call', '/documents/acme-requirements.pdf', 2048576, 'application/pdf', 'Requirements', 'lead', lead_enterprise, user_sales_techcorp),
    (tenant_techcorp, 'Employee Handbook 2024', 'Updated employee handbook with new policies', '/documents/employee-handbook-2024.pdf', 5242880, 'application/pdf', 'HR', null, null, user_admin_techcorp);

    -- Insert notifications
    INSERT INTO notifications (tenant_id, user_id, title, message, type, action_url, related_to_type, related_to_id) VALUES
    (tenant_techcorp, user_sales_techcorp, 'New Lead Assigned', 'You have been assigned a new high-priority lead: Enterprise Software Solution', 'info', '/crm/leads', 'lead', lead_enterprise),
    (tenant_techcorp, user_manager_techcorp, 'Task Due Soon', 'Your task "Prepare proposal for Innovate Solutions" is due in 5 days', 'warning', '/tasks', 'task', (SELECT id FROM tasks WHERE title = 'Prepare proposal for Innovate Solutions' AND tenant_id = tenant_techcorp)),
    (tenant_startup, user_hr_startup, 'New Job Application', 'Mike Wilson has applied for the Full Stack Developer position', 'info', '/talent/applications', 'application', (SELECT id FROM job_applications WHERE candidate_id = candidate_mike AND tenant_id = tenant_startup));

    -- Insert system settings
    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description) VALUES
    (tenant_techcorp, 'general', 'company_name', 'TechCorp Solutions', 'string', 'Company display name'),
    (tenant_techcorp, 'general', 'timezone', 'America/New_York', 'string', 'Default timezone for the organization'),
    (tenant_techcorp, 'crm', 'lead_auto_assignment', 'true', 'boolean', 'Automatically assign new leads to sales team'),
    (tenant_startup, 'general', 'company_name', 'StartupXYZ', 'string', 'Company display name'),
    (tenant_startup, 'general', 'timezone', 'America/Los_Angeles', 'string', 'Default timezone for the organization');

    -- Insert email templates
    INSERT INTO email_templates (tenant_id, name, subject, body, template_type, is_active, created_by) VALUES
    (tenant_techcorp, 'Welcome New Employee', 'Welcome to TechCorp Solutions!', 'Dear {{first_name}},\n\nWelcome to TechCorp Solutions! We are excited to have you join our team.\n\nBest regards,\nHR Team', 'welcome', true, user_admin_techcorp),
    (tenant_techcorp, 'Lead Follow-up', 'Thank you for your interest', 'Dear {{contact_name}},\n\nThank you for your interest in our services. We will be in touch soon.\n\nBest regards,\nSales Team', 'lead_followup', true, user_admin_techcorp);

END $$;

-- Success message
SELECT 'Sample data inserted successfully!' as message;
