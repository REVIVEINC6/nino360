-- ESG OS Platform - Execute Sample Data Script
-- This script runs the sample data insertion with proper error handling and logging

-- Start transaction
BEGIN;

-- Set search path
SET search_path TO public;

-- Execute the sample data script
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
    account_expense UUID;
    proposal_task UUID;
    job_app_mike UUID;
    record_count INTEGER;
BEGIN
    RAISE NOTICE 'Phase 1: Creating/Verifying Tenants...';
    
    -- Get or create tenant IDs
    SELECT id INTO tenant_techcorp FROM tenants WHERE slug = 'techcorp' LIMIT 1;
    SELECT id INTO tenant_startup FROM tenants WHERE slug = 'startupxyz' LIMIT 1;
    SELECT id INTO tenant_global FROM tenants WHERE slug = 'global-ent' LIMIT 1;

    -- Create tenants if they don't exist
    IF tenant_techcorp IS NULL THEN
        INSERT INTO tenants (name, slug, domain, status, subscription_plan, max_users, created_at, updated_at)
        VALUES ('TechCorp Solutions', 'techcorp', 'techcorp.com', 'active', 'enterprise', 100, NOW(), NOW())
        RETURNING id INTO tenant_techcorp;
        RAISE NOTICE 'Created tenant: TechCorp Solutions (ID: %)', tenant_techcorp;
    ELSE
        RAISE NOTICE 'Found existing tenant: TechCorp Solutions (ID: %)', tenant_techcorp;
    END IF;

    IF tenant_startup IS NULL THEN
        INSERT INTO tenants (name, slug, domain, status, subscription_plan, max_users, created_at, updated_at)
        VALUES ('StartupXYZ', 'startupxyz', 'startupxyz.com', 'active', 'professional', 50, NOW(), NOW())
        RETURNING id INTO tenant_startup;
        RAISE NOTICE 'Created tenant: StartupXYZ (ID: %)', tenant_startup;
    ELSE
        RAISE NOTICE 'Found existing tenant: StartupXYZ (ID: %)', tenant_startup;
    END IF;

    IF tenant_global IS NULL THEN
        INSERT INTO tenants (name, slug, domain, status, subscription_plan, max_users, created_at, updated_at)
        VALUES ('Global Enterprise', 'global-ent', 'global-ent.com', 'active', 'enterprise', 500, NOW(), NOW())
        RETURNING id INTO tenant_global;
        RAISE NOTICE 'Created tenant: Global Enterprise (ID: %)', tenant_global;
    ELSE
        RAISE NOTICE 'Found existing tenant: Global Enterprise (ID: %)', tenant_global;
    END IF;

    RAISE NOTICE 'Phase 2: Creating Users...';
    
    -- Insert users for TechCorp (check if they exist first)
    SELECT id INTO user_admin_techcorp FROM users WHERE email = 'admin@techcorp.com' LIMIT 1;
    IF user_admin_techcorp IS NULL THEN
        INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at, created_at, updated_at)
        VALUES (tenant_techcorp, 'admin@techcorp.com', 'Admin', 'User', 'tenant_admin', 'active', NOW(), NOW(), NOW())
        RETURNING id INTO user_admin_techcorp;
    END IF;

    SELECT id INTO user_manager_techcorp FROM users WHERE email = 'manager@techcorp.com' LIMIT 1;
    IF user_manager_techcorp IS NULL THEN
        INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at, created_at, updated_at)
        VALUES (tenant_techcorp, 'manager@techcorp.com', 'Jane', 'Manager', 'manager', 'active', NOW(), NOW(), NOW())
        RETURNING id INTO user_manager_techcorp;
    END IF;

    SELECT id INTO user_sales_techcorp FROM users WHERE email = 'sales@techcorp.com' LIMIT 1;
    IF user_sales_techcorp IS NULL THEN
        INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at, created_at, updated_at)
        VALUES (tenant_techcorp, 'sales@techcorp.com', 'Tom', 'Sales', 'user', 'active', NOW(), NOW(), NOW())
        RETURNING id INTO user_sales_techcorp;
    END IF;

    RAISE NOTICE 'Created TechCorp users: Admin (%), Manager (%), Sales (%)', user_admin_techcorp, user_manager_techcorp, user_sales_techcorp;

    -- Insert users for StartupXYZ
    SELECT id INTO user_admin_startup FROM users WHERE email = 'admin@startup.com' LIMIT 1;
    IF user_admin_startup IS NULL THEN
        INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at, created_at, updated_at)
        VALUES (tenant_startup, 'admin@startup.com', 'Startup', 'Admin', 'tenant_admin', 'active', NOW(), NOW(), NOW())
        RETURNING id INTO user_admin_startup;
    END IF;

    SELECT id INTO user_hr_startup FROM users WHERE email = 'hr@startup.com' LIMIT 1;
    IF user_hr_startup IS NULL THEN
        INSERT INTO users (tenant_id, email, first_name, last_name, role, status, email_verified_at, created_at, updated_at)
        VALUES (tenant_startup, 'hr@startup.com', 'Lisa', 'HR', 'manager', 'active', NOW(), NOW(), NOW())
        RETURNING id INTO user_hr_startup;
    END IF;

    RAISE NOTICE 'Created StartupXYZ users: Admin (%), HR (%)', user_admin_startup, user_hr_startup;

    RAISE NOTICE 'Phase 3: Creating Companies and Contacts...';

    -- Insert companies for TechCorp
    SELECT id INTO company_acme FROM companies WHERE name = 'Acme Corporation' AND tenant_id = tenant_techcorp LIMIT 1;
    IF company_acme IS NULL THEN
        INSERT INTO companies (tenant_id, name, website, industry, size, annual_revenue, city, country, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'Acme Corporation', 'https://acme.com', 'Technology', 'Large', 50000000.00, 'New York', 'USA', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO company_acme;
    END IF;

    SELECT id INTO company_innovate FROM companies WHERE name = 'Innovate Solutions' AND tenant_id = tenant_techcorp LIMIT 1;
    IF company_innovate IS NULL THEN
        INSERT INTO companies (tenant_id, name, website, industry, size, annual_revenue, city, country, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'Innovate Solutions', 'https://innovate.com', 'Software', 'Medium', 10000000.00, 'San Francisco', 'USA', user_manager_techcorp, NOW(), NOW())
        RETURNING id INTO company_innovate;
    END IF;

    RAISE NOTICE 'Created companies: Acme (%), Innovate (%)', company_acme, company_innovate;

    -- Insert contacts
    SELECT id INTO contact_john FROM contacts WHERE email = 'john.smith@acme.com' LIMIT 1;
    IF contact_john IS NULL THEN
        INSERT INTO contacts (tenant_id, company_id, first_name, last_name, email, phone, job_title, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, company_acme, 'John', 'Smith', 'john.smith@acme.com', '+1-555-0101', 'CTO', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO contact_john;
    END IF;

    SELECT id INTO contact_sarah FROM contacts WHERE email = 'sarah@innovate.com' LIMIT 1;
    IF contact_sarah IS NULL THEN
        INSERT INTO contacts (tenant_id, company_id, first_name, last_name, email, phone, job_title, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, company_innovate, 'Sarah', 'Johnson', 'sarah@innovate.com', '+1-555-0102', 'CEO', user_manager_techcorp, NOW(), NOW())
        RETURNING id INTO contact_sarah;
    END IF;

    RAISE NOTICE 'Created contacts: John Smith (%), Sarah Johnson (%)', contact_john, contact_sarah;

    RAISE NOTICE 'Phase 4: Creating CRM Data...';

    -- Insert leads
    SELECT id INTO lead_enterprise FROM leads WHERE title = 'Enterprise Software Solution' AND tenant_id = tenant_techcorp LIMIT 1;
    IF lead_enterprise IS NULL THEN
        INSERT INTO leads (tenant_id, company_id, contact_id, title, description, source, status, priority, estimated_value, probability, expected_close_date, assigned_to, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, company_acme, contact_john, 'Enterprise Software Solution', 'Large enterprise software implementation project for digital transformation', 'Website', 'qualified', 'high', 250000.00, 75, CURRENT_DATE + INTERVAL '30 days', user_sales_techcorp, user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO lead_enterprise;
    END IF;

    -- Insert second lead
    INSERT INTO leads (tenant_id, company_id, contact_id, title, description, source, status, priority, estimated_value, probability, expected_close_date, assigned_to, created_by, created_at, updated_at)
    SELECT tenant_techcorp, company_innovate, contact_sarah, 'Cloud Migration Project', 'Complete cloud infrastructure migration and modernization', 'Referral', 'proposal', 'medium', 150000.00, 60, CURRENT_DATE + INTERVAL '45 days', user_manager_techcorp, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM leads WHERE title = 'Cloud Migration Project' AND tenant_id = tenant_techcorp);

    RAISE NOTICE 'Created leads: Enterprise Software (%)', lead_enterprise;

    -- Insert opportunities
    SELECT id INTO opportunity_saas FROM opportunities WHERE name = 'Acme Corp - SaaS Platform' AND tenant_id = tenant_techcorp LIMIT 1;
    IF opportunity_saas IS NULL THEN
        INSERT INTO opportunities (tenant_id, lead_id, company_id, contact_id, name, description, stage, amount, probability, expected_close_date, assigned_to, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, lead_enterprise, company_acme, contact_john, 'Acme Corp - SaaS Platform', 'Custom SaaS platform development with advanced analytics and reporting capabilities', 'Negotiation', 300000.00, 80, CURRENT_DATE + INTERVAL '20 days', user_sales_techcorp, user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO opportunity_saas;
    END IF;

    RAISE NOTICE 'Created opportunity: Acme SaaS Platform (%)', opportunity_saas;

    -- Insert activities
    INSERT INTO activities (tenant_id, type, subject, description, start_time, end_time, status, related_to_type, related_to_id, assigned_to, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'meeting', 'Discovery Call with Acme Corp', 'Initial discovery call to understand technical requirements and business objectives', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 'scheduled', 'lead', lead_enterprise, user_sales_techcorp, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM activities WHERE subject = 'Discovery Call with Acme Corp' AND tenant_id = tenant_techcorp);

    INSERT INTO activities (tenant_id, type, subject, description, start_time, end_time, status, related_to_type, related_to_id, assigned_to, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'call', 'Follow-up Call', 'Follow-up discussion on proposal details and implementation timeline', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '30 minutes', 'scheduled', 'opportunity', opportunity_saas, user_manager_techcorp, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM activities WHERE subject = 'Follow-up Call' AND tenant_id = tenant_techcorp);

    RAISE NOTICE 'Phase 5: Creating HR Data...';

    -- Insert employees
    SELECT id INTO employee_alice FROM employees WHERE employee_id = 'EMP001' LIMIT 1;
    IF employee_alice IS NULL THEN
        INSERT INTO employees (tenant_id, employee_id, first_name, last_name, email, hire_date, job_title, department, employment_type, salary, status, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'EMP001', 'Alice', 'Developer', 'alice@techcorp.com', '2023-01-15', 'Senior Software Engineer', 'Engineering', 'full-time', 95000.00, 'active', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO employee_alice;
    END IF;

    SELECT id INTO employee_bob FROM employees WHERE employee_id = 'EMP002' LIMIT 1;
    IF employee_bob IS NULL THEN
        INSERT INTO employees (tenant_id, employee_id, first_name, last_name, email, hire_date, job_title, department, employment_type, salary, status, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'EMP002', 'Bob', 'Designer', 'bob@techcorp.com', '2023-03-01', 'UX Designer', 'Design', 'full-time', 75000.00, 'active', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO employee_bob;
    END IF;

    RAISE NOTICE 'Created employees: Alice (%), Bob (%)', employee_alice, employee_bob;

    -- Insert departments
    INSERT INTO departments (tenant_id, name, description, head_id, created_at, updated_at)
    SELECT tenant_techcorp, 'Engineering', 'Software development and technical operations team', employee_alice, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Engineering' AND tenant_id = tenant_techcorp);

    INSERT INTO departments (tenant_id, name, description, head_id, created_at, updated_at)
    SELECT tenant_techcorp, 'Design', 'User experience and visual design team', employee_bob, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Design' AND tenant_id = tenant_techcorp);

    INSERT INTO departments (tenant_id, name, description, head_id, created_at, updated_at)
    SELECT tenant_startup, 'Human Resources', 'Employee management and recruitment department', null, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Human Resources' AND tenant_id = tenant_startup);

    -- Insert attendance records
    INSERT INTO attendance (tenant_id, employee_id, date, check_in_time, check_out_time, total_hours, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_alice, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:30:00', 8.5, 'present', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employee_alice AND date = CURRENT_DATE - INTERVAL '1 day');

    INSERT INTO attendance (tenant_id, employee_id, date, check_in_time, check_out_time, total_hours, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_bob, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:15:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:45:00', 8.5, 'present', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employee_bob AND date = CURRENT_DATE - INTERVAL '1 day');

    INSERT INTO attendance (tenant_id, employee_id, date, check_in_time, check_out_time, total_hours, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_alice, CURRENT_DATE, CURRENT_DATE + TIME '09:00:00', null, null, 'present', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employee_alice AND date = CURRENT_DATE);

    INSERT INTO attendance (tenant_id, employee_id, date, check_in_time, check_out_time, total_hours, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_bob, CURRENT_DATE, CURRENT_DATE + TIME '09:10:00', null, null, 'present', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employee_bob AND date = CURRENT_DATE);

    -- Insert leave requests
    INSERT INTO leave_requests (tenant_id, employee_id, leave_type, start_date, end_date, days_requested, reason, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_alice, 'vacation', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days', 5, 'Family vacation to celebrate anniversary', 'approved', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = employee_alice AND start_date = CURRENT_DATE + INTERVAL '10 days');

    INSERT INTO leave_requests (tenant_id, employee_id, leave_type, start_date, end_date, days_requested, reason, status, created_at, updated_at)
    SELECT tenant_techcorp, employee_bob, 'sick', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 1, 'Medical appointment for routine checkup', 'pending', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee_id = employee_bob AND start_date = CURRENT_DATE + INTERVAL '2 days');

    RAISE NOTICE 'Phase 6: Creating Talent Management Data...';

    -- Insert job positions
    SELECT id INTO job_position_dev FROM job_positions WHERE title = 'Full Stack Developer' AND tenant_id = tenant_startup LIMIT 1;
    IF job_position_dev IS NULL THEN
        INSERT INTO job_positions (tenant_id, title, department, location, employment_type, experience_level, salary_min, salary_max, description, status, hiring_manager, created_by, created_at, updated_at)
        VALUES (tenant_startup, 'Full Stack Developer', 'Engineering', 'Remote', 'full-time', 'mid', 70000.00, 90000.00, 'We are looking for a talented Full Stack Developer to join our growing team and help build innovative web applications using modern technologies.', 'open', user_admin_startup, user_admin_startup, NOW(), NOW())
        RETURNING id INTO job_position_dev;
    END IF;

    INSERT INTO job_positions (tenant_id, title, department, location, employment_type, experience_level, salary_min, salary_max, description, status, hiring_manager, created_by, created_at, updated_at)
    SELECT tenant_startup, 'Product Manager', 'Product', 'San Francisco', 'full-time', 'senior', 100000.00, 130000.00, 'Seeking an experienced Product Manager to lead our product strategy and work closely with engineering and design teams.', 'open', user_admin_startup, user_admin_startup, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM job_positions WHERE title = 'Product Manager' AND tenant_id = tenant_startup);

    RAISE NOTICE 'Created job positions: Full Stack Developer (%)', job_position_dev;

    -- Insert candidates
    SELECT id INTO candidate_mike FROM candidates WHERE email = 'mike.wilson@email.com' LIMIT 1;
    IF candidate_mike IS NULL THEN
        INSERT INTO candidates (tenant_id, first_name, last_name, email, phone, current_position, current_company, experience_years, expected_salary, skills, status, source, created_by, created_at, updated_at)
        VALUES (tenant_startup, 'Mike', 'Wilson', 'mike.wilson@email.com', '+1-555-0201', 'Software Engineer', 'Tech Startup Inc', 4, 85000.00, ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'], 'new', 'LinkedIn', user_hr_startup, NOW(), NOW())
        RETURNING id INTO candidate_mike;
    END IF;

    INSERT INTO candidates (tenant_id, first_name, last_name, email, phone, current_position, current_company, experience_years, expected_salary, skills, status, source, created_by, created_at, updated_at)
    SELECT tenant_startup, 'Emma', 'Davis', 'emma.davis@email.com', '+1-555-0202', 'Frontend Developer', 'Digital Agency LLC', 3, 75000.00, ARRAY['React', 'Vue.js', 'CSS', 'TypeScript', 'Figma'], 'screening', 'Job Board', user_hr_startup, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM candidates WHERE email = 'emma.davis@email.com');

    RAISE NOTICE 'Created candidates: Mike Wilson (%)', candidate_mike;

    -- Insert job applications
    SELECT id INTO job_app_mike FROM job_applications WHERE job_position_id = job_position_dev AND candidate_id = candidate_mike LIMIT 1;
    IF job_app_mike IS NULL THEN
        INSERT INTO job_applications (tenant_id, job_position_id, candidate_id, status, cover_letter, rating, assigned_to, created_at, updated_at)
        VALUES (tenant_startup, job_position_dev, candidate_mike, 'interview', 'I am excited about the opportunity to join your innovative team and contribute to building cutting-edge web applications. My experience with modern JavaScript frameworks and backend technologies aligns perfectly with your requirements.', 4, user_hr_startup, NOW(), NOW())
        RETURNING id INTO job_app_mike;
    END IF;

    -- Insert interviews
    INSERT INTO interviews (tenant_id, job_application_id, type, round, scheduled_at, duration_minutes, status, interviewer_id, created_by, created_at, updated_at)
    SELECT tenant_startup, job_app_mike, 'video', 1, NOW() + INTERVAL '2 days', 60, 'scheduled', user_admin_startup, user_hr_startup, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM interviews WHERE job_application_id = job_app_mike);

    RAISE NOTICE 'Phase 7: Creating Financial Data...';

    -- Insert chart of accounts
    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description, created_at, updated_at)
    SELECT tenant_techcorp, '1000', 'Cash', 'asset', 'Cash and cash equivalents including bank accounts', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM chart_of_accounts WHERE account_code = '1000' AND tenant_id = tenant_techcorp);

    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description, created_at, updated_at)
    SELECT tenant_techcorp, '1200', 'Accounts Receivable', 'asset', 'Money owed by customers for services rendered', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM chart_of_accounts WHERE account_code = '1200' AND tenant_id = tenant_techcorp);

    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description, created_at, updated_at)
    SELECT tenant_techcorp, '2000', 'Accounts Payable', 'liability', 'Money owed to suppliers and vendors', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM chart_of_accounts WHERE account_code = '2000' AND tenant_id = tenant_techcorp);

    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description, created_at, updated_at)
    SELECT tenant_techcorp, '4000', 'Revenue', 'revenue', 'Income from sales and services', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM chart_of_accounts WHERE account_code = '4000' AND tenant_id = tenant_techcorp);

    INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, description, created_at, updated_at)
    SELECT tenant_techcorp, '5000', 'Operating Expenses', 'expense', 'Day-to-day business operating expenses', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM chart_of_accounts WHERE account_code = '5000' AND tenant_id = tenant_techcorp);

    SELECT id INTO account_expense FROM chart_of_accounts WHERE account_code = '5000' AND tenant_id = tenant_techcorp LIMIT 1;

    -- Insert customers
    SELECT id INTO customer_acme FROM customers WHERE customer_code = 'CUST001' LIMIT 1;
    IF customer_acme IS NULL THEN
        INSERT INTO customers (tenant_id, company_id, customer_code, name, email, phone, payment_terms, currency, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, company_acme, 'CUST001', 'Acme Corporation', 'billing@acme.com', '+1-555-0301', 30, 'USD', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO customer_acme;
    END IF;

    INSERT INTO customers (tenant_id, company_id, customer_code, name, email, phone, payment_terms, currency, created_by, created_at, updated_at)
    SELECT tenant_techcorp, company_innovate, 'CUST002', 'Innovate Solutions', 'accounts@innovate.com', '+1-555-0302', 15, 'USD', user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM customers WHERE customer_code = 'CUST002');

    -- Insert vendors
    SELECT id INTO vendor_office FROM vendors WHERE vendor_code = 'VEND001' LIMIT 1;
    IF vendor_office IS NULL THEN
        INSERT INTO vendors (tenant_id, vendor_code, name, email, phone, payment_terms, currency, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'VEND001', 'Office Supplies Co', 'orders@officesupplies.com', '+1-555-0401', 30, 'USD', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO vendor_office;
    END IF;

    INSERT INTO vendors (tenant_id, vendor_code, name, email, phone, payment_terms, currency, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'VEND002', 'Cloud Services Inc', 'billing@cloudservices.com', '+1-555-0402', 15, 'USD', user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM vendors WHERE vendor_code = 'VEND002');

    -- Insert invoices
    SELECT id INTO invoice_001 FROM invoices WHERE invoice_number = 'INV-001' LIMIT 1;
    IF invoice_001 IS NULL THEN
        INSERT INTO invoices (tenant_id, customer_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, customer_acme, 'INV-001', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 25000.00, 2500.00, 27500.00, 'sent', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO invoice_001;
    END IF;

    INSERT INTO invoices (tenant_id, customer_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, created_by, created_at, updated_at)
    SELECT tenant_techcorp, customer_acme, 'INV-002', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 15000.00, 1500.00, 16500.00, 'draft', user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-002');

    -- Insert invoice line items
    INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, line_total, created_at)
    SELECT invoice_001, 'Software Development Services - Phase 1', 100.00, 250.00, 25000.00, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM invoice_line_items WHERE invoice_id = invoice_001 AND description = 'Software Development Services - Phase 1');

    -- Insert payments
    INSERT INTO payments (tenant_id, invoice_id, payment_date, amount, payment_method, reference_number, status, created_by, created_at, updated_at)
    SELECT tenant_techcorp, invoice_001, CURRENT_DATE - INTERVAL '2 days', 27500.00, 'bank_transfer', 'TXN-12345', 'completed', user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM payments WHERE reference_number = 'TXN-12345');

    -- Insert expenses
    INSERT INTO expenses (tenant_id, employee_id, vendor_id, account_id, expense_date, amount, description, category, is_reimbursable, is_approved, created_by, created_at, updated_at)
    SELECT tenant_techcorp, employee_alice, vendor_office, account_expense, CURRENT_DATE - INTERVAL '3 days', 150.00, 'Office supplies for development team including notebooks and pens', 'Office Supplies', false, true, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM expenses WHERE employee_id = employee_alice AND expense_date = CURRENT_DATE - INTERVAL '3 days' AND amount = 150.00);

    INSERT INTO expenses (tenant_id, employee_id, vendor_id, account_id, expense_date, amount, description, category, is_reimbursable, is_approved, created_by, created_at, updated_at)
    SELECT tenant_techcorp, employee_bob, null, account_expense, CURRENT_DATE - INTERVAL '1 day', 75.00, 'Design software subscription for Adobe Creative Suite', 'Software', true, false, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM expenses WHERE employee_id = employee_bob AND expense_date = CURRENT_DATE - INTERVAL '1 day' AND amount = 75.00);

    RAISE NOTICE 'Phase 8: Creating Training Data...';

    -- Insert training courses
    SELECT id INTO course_leadership FROM training_courses WHERE title = 'Leadership Fundamentals' AND tenant_id = tenant_techcorp LIMIT 1;
    IF course_leadership IS NULL THEN
        INSERT INTO training_courses (tenant_id, title, description, category, level, duration_hours, learning_objectives, is_active, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'Leadership Fundamentals', 'Essential leadership skills for managers and team leads covering communication, delegation, and team building', 'Leadership', 'intermediate', 16, 'Develop core leadership competencies, improve team management skills, and enhance communication abilities', true, user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO course_leadership;
    END IF;

    INSERT INTO training_courses (tenant_id, title, description, category, level, duration_hours, learning_objectives, is_active, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'Advanced JavaScript', 'Deep dive into modern JavaScript concepts, frameworks, and best practices for senior developers', 'Technical', 'advanced', 24, 'Master advanced JavaScript patterns, understand modern frameworks, and implement best practices', true, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM training_courses WHERE title = 'Advanced JavaScript' AND tenant_id = tenant_techcorp);

    -- Insert training sessions
    SELECT id INTO session_leadership FROM training_sessions WHERE title = 'Leadership Fundamentals - Batch 1' AND tenant_id = tenant_techcorp LIMIT 1;
    IF session_leadership IS NULL THEN
        INSERT INTO training_sessions (tenant_id, course_id, title, start_date, end_date, start_time, end_time, location, max_participants, instructor_id, status, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, course_leadership, 'Leadership Fundamentals - Batch 1', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', '09:00:00', '17:00:00', 'Conference Room A', 15, user_manager_techcorp, 'scheduled', user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO session_leadership;
    END IF;

    -- Insert training enrollments
    INSERT INTO training_enrollments (tenant_id, session_id, employee_id, status, progress_percentage, created_at, updated_at)
    SELECT tenant_techcorp, session_leadership, employee_alice, 'not_started', 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM training_enrollments WHERE session_id = session_leadership AND employee_id = employee_alice);

    INSERT INTO training_enrollments (tenant_id, session_id, employee_id, status, progress_percentage, created_at, updated_at)
    SELECT tenant_techcorp, session_leadership, employee_bob, 'not_started', 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM training_enrollments WHERE session_id = session_leadership AND employee_id = employee_bob);

    RAISE NOTICE 'Phase 9: Creating Tasks and Documents...';

    -- Insert tasks
    SELECT id INTO task_followup FROM tasks WHERE title = 'Follow up with Acme Corp' AND tenant_id = tenant_techcorp LIMIT 1;
    IF task_followup IS NULL THEN
        INSERT INTO tasks (tenant_id, title, description, status, priority, due_date, estimated_hours, related_to_type, related_to_id, assigned_to, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'Follow up with Acme Corp', 'Send comprehensive follow-up email after the discovery call including technical specifications and timeline', 'pending', 'high', CURRENT_DATE + INTERVAL '2 days', 1.0, 'lead', lead_enterprise, user_sales_techcorp, user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO task_followup;
    END IF;

    SELECT id INTO proposal_task FROM tasks WHERE title = 'Prepare proposal for Innovate Solutions' AND tenant_id = tenant_techcorp LIMIT 1;
    IF proposal_task IS NULL THEN
        INSERT INTO tasks (tenant_id, title, description, status, priority, due_date, estimated_hours, related_to_type, related_to_id, assigned_to, created_by, created_at, updated_at)
        VALUES (tenant_techcorp, 'Prepare proposal for Innovate Solutions', 'Create detailed project proposal including scope, timeline, resources, and pricing structure', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '5 days', 8.0, 'opportunity', opportunity_saas, user_manager_techcorp, user_admin_techcorp, NOW(), NOW())
        RETURNING id INTO proposal_task;
    END IF;

    -- Insert task comments
    INSERT INTO task_comments (task_id, user_id, comment, created_at, updated_at)
    SELECT task_followup, user_sales_techcorp, 'Discovery call went very well. They are particularly interested in our enterprise security features and scalability options.', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM task_comments WHERE task_id = task_followup AND user_id = user_sales_techcorp);

    INSERT INTO task_comments (task_id, user_id, comment, created_at, updated_at)
    SELECT task_followup, user_admin_techcorp, 'Excellent! Make sure to highlight our SOC 2 compliance and multi-tenant architecture in the follow-up email.', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM task_comments WHERE task_id = task_followup AND user_id = user_admin_techcorp);

    -- Insert documents
    INSERT INTO documents (tenant_id, name, description, file_path, file_size, mime_type, category, related_to_type, related_to_id, uploaded_by, created_at, updated_at)
    SELECT tenant_techcorp, 'Acme Corp - Requirements Document', 'Detailed technical and business requirements gathered from discovery call and stakeholder interviews', '/documents/acme-requirements.pdf', 2048576, 'application/pdf', 'Requirements', 'lead', lead_enterprise, user_sales_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM documents WHERE name = 'Acme Corp - Requirements Document' AND tenant_id = tenant_techcorp);

    INSERT INTO documents (tenant_id, name, description, file_path, file_size, mime_type, category, related_to_type, related_to_id, uploaded_by, created_at, updated_at)
    SELECT tenant_techcorp, 'Employee Handbook 2024', 'Updated employee handbook with new policies, procedures, and company guidelines', '/documents/employee-handbook-2024.pdf', 5242880, 'application/pdf', 'HR', null, null, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM documents WHERE name = 'Employee Handbook 2024' AND tenant_id = tenant_techcorp);

    RAISE NOTICE 'Phase 10: Creating Notifications and Settings...';

    -- Insert notifications
    INSERT INTO notifications (tenant_id, user_id, title, message, type, action_url, related_to_type, related_to_id, created_at)
    SELECT tenant_techcorp, user_sales_techcorp, 'New Lead Assigned', 'You have been assigned a new high-priority lead: Enterprise Software Solution. Please review and schedule initial contact.', 'info', '/crm/leads', 'lead', lead_enterprise, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = user_sales_techcorp AND title = 'New Lead Assigned');

    INSERT INTO notifications (tenant_id, user_id, title, message, type, action_url, related_to_type, related_to_id, created_at)
    SELECT tenant_techcorp, user_manager_techcorp, 'Task Due Soon', 'Your task "Prepare proposal for Innovate Solutions" is due in 5 days. Please ensure all requirements are addressed.', 'warning', '/tasks', 'task', proposal_task, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = user_manager_techcorp AND title = 'Task Due Soon');

    INSERT INTO notifications (tenant_id, user_id, title, message, type, action_url, related_to_type, related_to_id, created_at)
    SELECT tenant_startup, user_hr_startup, 'New Job Application', 'Mike Wilson has applied for the Full Stack Developer position. Please review the application and schedule screening.', 'info', '/talent/applications', 'application', job_app_mike, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = user_hr_startup AND title = 'New Job Application');

    -- Insert system settings
    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description, created_at, updated_at)
    SELECT tenant_techcorp, 'general', 'company_name', 'TechCorp Solutions', 'string', 'Company display name used throughout the application', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE tenant_id = tenant_techcorp AND category = 'general' AND key = 'company_name');

    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description, created_at, updated_at)
    SELECT tenant_techcorp, 'general', 'timezone', 'America/New_York', 'string', 'Default timezone for the organization and all users', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE tenant_id = tenant_techcorp AND category = 'general' AND key = 'timezone');

    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description, created_at, updated_at)
    SELECT tenant_techcorp, 'crm', 'lead_auto_assignment', 'true', 'boolean', 'Automatically assign new leads to available sales team members', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE tenant_id = tenant_techcorp AND category = 'crm' AND key = 'lead_auto_assignment');

    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description, created_at, updated_at)
    SELECT tenant_startup, 'general', 'company_name', 'StartupXYZ', 'string', 'Company display name used throughout the application', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE tenant_id = tenant_startup AND category = 'general' AND key = 'company_name');

    INSERT INTO system_settings (tenant_id, category, key, value, data_type, description, created_at, updated_at)
    SELECT tenant_startup, 'general', 'timezone', 'America/Los_Angeles', 'string', 'Default timezone for the organization and all users', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE tenant_id = tenant_startup AND category = 'general' AND key = 'timezone');

    -- Insert email templates
    INSERT INTO email_templates (tenant_id, name, subject, body, template_type, is_active, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'Welcome New Employee', 'Welcome to TechCorp Solutions!', 'Dear {{first_name}},

Welcome to TechCorp Solutions! We are thrilled to have you join our innovative team.

Your first day is scheduled for {{start_date}}. Please report to the main office at 9:00 AM where you will meet with HR for orientation.

What to expect on your first day:
- Office tour and introductions
- IT setup and account creation  
- Benefits enrollment
- Team meetings

If you have any questions before your start date, please don''t hesitate to reach out.

Best regards,
HR Team
TechCorp Solutions', 'welcome', true, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Welcome New Employee' AND tenant_id = tenant_techcorp);

    INSERT INTO email_templates (tenant_id, name, subject, body, template_type, is_active, created_by, created_at, updated_at)
    SELECT tenant_techcorp, 'Lead Follow-up', 'Thank you for your interest in TechCorp Solutions', 'Dear {{contact_name}},

Thank you for taking the time to speak with us about your {{project_type}} needs. We appreciate your interest in TechCorp Solutions.

Based on our conversation, I understand that you are looking for:
- {{requirement_1}}
- {{requirement_2}}
- {{requirement_3}}

We will prepare a detailed proposal addressing your specific requirements and send it to you by {{proposal_date}}.

In the meantime, please feel free to reach out if you have any additional questions or requirements.

Best regards,
{{sales_rep_name}}
Sales Team
TechCorp Solutions', 'lead_followup', true, user_admin_techcorp, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Lead Follow-up' AND tenant_id = tenant_techcorp);

    -- Get final counts for verification
    SELECT COUNT(*) INTO record_count FROM users WHERE tenant_id IN (tenant_techcorp, tenant_startup, tenant_global);
    RAISE NOTICE 'Total users created: %', record_count;

    SELECT COUNT(*) INTO record_count FROM companies WHERE tenant_id IN (tenant_techcorp, tenant_startup, tenant_global);
    RAISE NOTICE 'Total companies created: %', record_count;

    SELECT COUNT(*) INTO record_count FROM leads WHERE tenant_id IN (tenant_techcorp, tenant_startup, tenant_global);
    RAISE NOTICE 'Total leads created: %', record_count;

    SELECT COUNT(*) INTO record_count FROM employees WHERE tenant_id IN (tenant_techcorp, tenant_startup, tenant_global);
    RAISE NOTICE 'Total employees created: %', record_count;

    RAISE NOTICE 'Sample data insertion completed successfully!';

END $$;

-- Final verification queries
SELECT 
    t.name as "Tenant Name",
    t.slug as "Slug",
    t.status as "Status",
    COUNT(DISTINCT u.id) as "Users",
    COUNT(DISTINCT c.id) as "Companies",
    COUNT(DISTINCT l.id) as "Leads",
    COUNT(DISTINCT e.id) as "Employees",
    COUNT(DISTINCT o.id) as "Opportunities"
FROM tenants t
LEFT JOIN users u ON t.id = u.tenant_id
LEFT JOIN companies c ON t.id = c.tenant_id
LEFT JOIN leads l ON t.id = l.tenant_id
LEFT JOIN employees e ON t.id = e.tenant_id
LEFT JOIN opportunities o ON t.id = o.tenant_id
WHERE t.slug IN ('techcorp', 'startupxyz', 'global-ent')
GROUP BY t.id, t.name, t.slug, t.status
ORDER BY t.name;

-- Recent activity summary
SELECT 
    'Activities' as "Type",
    COUNT(*) as "Count"
FROM activities 
WHERE created_at >= CURRENT_DATE

UNION ALL

SELECT 
    'Tasks' as "Type",
    COUNT(*) as "Count"
FROM tasks 
WHERE created_at >= CURRENT_DATE

UNION ALL

SELECT 
    'Notifications' as "Type",
    COUNT(*) as "Count"
FROM notifications 
WHERE created_at >= CURRENT_DATE

ORDER BY "Type";

-- Commit the transaction
COMMIT;
