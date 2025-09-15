-- ESG OS Platform - Complete Row Level Security Policies
-- This script creates comprehensive RLS policies for multi-tenant data isolation

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role >= required_role
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'super_admin'
        FROM users 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CORE SYSTEM POLICIES
-- =============================================

-- Tenants policies
CREATE POLICY "Super admins can view all tenants" ON tenants FOR SELECT USING (is_super_admin());
CREATE POLICY "Users can view their own tenant" ON tenants FOR SELECT USING (id = get_current_tenant_id());
CREATE POLICY "Super admins can manage all tenants" ON tenants FOR ALL USING (is_super_admin());

-- Users policies
CREATE POLICY "Super admins can view all users" ON users FOR SELECT USING (is_super_admin());
CREATE POLICY "Users can view users in their tenant" ON users FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Tenant admins can manage users in their tenant" ON users FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
);
CREATE POLICY "Super admins can manage all users" ON users FOR ALL USING (is_super_admin());

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own sessions" ON user_sessions FOR ALL USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Super admins can view all audit logs" ON audit_logs FOR SELECT USING (is_super_admin());
CREATE POLICY "Users can view audit logs for their tenant" ON audit_logs FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- =============================================
-- CRM MODULE POLICIES
-- =============================================

-- Companies policies
CREATE POLICY "Users can view companies in their tenant" ON companies FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage companies in their tenant" ON companies FOR ALL USING (tenant_id = get_current_tenant_id());

-- Contacts policies
CREATE POLICY "Users can view contacts in their tenant" ON contacts FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage contacts in their tenant" ON contacts FOR ALL USING (tenant_id = get_current_tenant_id());

-- Leads policies
CREATE POLICY "Users can view leads in their tenant" ON leads FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage leads in their tenant" ON leads FOR ALL USING (tenant_id = get_current_tenant_id());

-- Opportunities policies
CREATE POLICY "Users can view opportunities in their tenant" ON opportunities FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage opportunities in their tenant" ON opportunities FOR ALL USING (tenant_id = get_current_tenant_id());

-- Activities policies
CREATE POLICY "Users can view activities in their tenant" ON activities FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage activities in their tenant" ON activities FOR ALL USING (tenant_id = get_current_tenant_id());

-- Activity participants policies
CREATE POLICY "Users can view activity participants for their tenant activities" ON activity_participants FOR SELECT USING (
    activity_id IN (SELECT id FROM activities WHERE tenant_id = get_current_tenant_id())
);
CREATE POLICY "Users can manage activity participants for their tenant activities" ON activity_participants FOR ALL USING (
    activity_id IN (SELECT id FROM activities WHERE tenant_id = get_current_tenant_id())
);

-- =============================================
-- TALENT MANAGEMENT POLICIES
-- =============================================

-- Job positions policies
CREATE POLICY "Users can view job positions in their tenant" ON job_positions FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage job positions in their tenant" ON job_positions FOR ALL USING (tenant_id = get_current_tenant_id());

-- Candidates policies
CREATE POLICY "Users can view candidates in their tenant" ON candidates FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage candidates in their tenant" ON candidates FOR ALL USING (tenant_id = get_current_tenant_id());

-- Job applications policies
CREATE POLICY "Users can view job applications in their tenant" ON job_applications FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage job applications in their tenant" ON job_applications FOR ALL USING (tenant_id = get_current_tenant_id());

-- Interviews policies
CREATE POLICY "Users can view interviews in their tenant" ON interviews FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage interviews in their tenant" ON interviews FOR ALL USING (tenant_id = get_current_tenant_id());

-- =============================================
-- HRMS MODULE POLICIES
-- =============================================

-- Employees policies
CREATE POLICY "Users can view employees in their tenant" ON employees FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage employees in their tenant" ON employees FOR ALL USING (tenant_id = get_current_tenant_id());

-- Departments policies
CREATE POLICY "Users can view departments in their tenant" ON departments FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage departments in their tenant" ON departments FOR ALL USING (tenant_id = get_current_tenant_id());

-- Attendance policies
CREATE POLICY "Users can view attendance in their tenant" ON attendance FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage attendance in their tenant" ON attendance FOR ALL USING (tenant_id = get_current_tenant_id());

-- Leave requests policies
CREATE POLICY "Users can view leave requests in their tenant" ON leave_requests FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage leave requests in their tenant" ON leave_requests FOR ALL USING (tenant_id = get_current_tenant_id());

-- Performance reviews policies
CREATE POLICY "Users can view performance reviews in their tenant" ON performance_reviews FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage performance reviews in their tenant" ON performance_reviews FOR ALL USING (tenant_id = get_current_tenant_id());

-- =============================================
-- FINANCE MODULE POLICIES
-- =============================================

-- Chart of accounts policies
CREATE POLICY "Users can view chart of accounts in their tenant" ON chart_of_accounts FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage chart of accounts in their tenant" ON chart_of_accounts FOR ALL USING (tenant_id = get_current_tenant_id());

-- Customers policies
CREATE POLICY "Users can view customers in their tenant" ON customers FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage customers in their tenant" ON customers FOR ALL USING (tenant_id = get_current_tenant_id());

-- Vendors policies
CREATE POLICY "Users can view vendors in their tenant" ON vendors FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage vendors in their tenant" ON vendors FOR ALL USING (tenant_id = get_current_tenant_id());

-- Invoices policies
CREATE POLICY "Users can view invoices in their tenant" ON invoices FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage invoices in their tenant" ON invoices FOR ALL USING (tenant_id = get_current_tenant_id());

-- Invoice line items policies
CREATE POLICY "Users can view invoice line items for their tenant invoices" ON invoice_line_items FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE tenant_id = get_current_tenant_id())
);
CREATE POLICY "Users can manage invoice line items for their tenant invoices" ON invoice_line_items FOR ALL USING (
    invoice_id IN (SELECT id FROM invoices WHERE tenant_id = get_current_tenant_id())
);

-- Payments policies
CREATE POLICY "Users can view payments in their tenant" ON payments FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage payments in their tenant" ON payments FOR ALL USING (tenant_id = get_current_tenant_id());

-- Expenses policies
CREATE POLICY "Users can view expenses in their tenant" ON expenses FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage expenses in their tenant" ON expenses FOR ALL USING (tenant_id = get_current_tenant_id());

-- =============================================
-- TRAINING MODULE POLICIES
-- =============================================

-- Training courses policies
CREATE POLICY "Users can view training courses in their tenant" ON training_courses FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage training courses in their tenant" ON training_courses FOR ALL USING (tenant_id = get_current_tenant_id());

-- Training sessions policies
CREATE POLICY "Users can view training sessions in their tenant" ON training_sessions FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage training sessions in their tenant" ON training_sessions FOR ALL USING (tenant_id = get_current_tenant_id());

-- Training enrollments policies
CREATE POLICY "Users can view training enrollments in their tenant" ON training_enrollments FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage training enrollments in their tenant" ON training_enrollments FOR ALL USING (tenant_id = get_current_tenant_id());

-- =============================================
-- TASK MANAGEMENT POLICIES
-- =============================================

-- Tasks policies
CREATE POLICY "Users can view tasks in their tenant" ON tasks FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage tasks in their tenant" ON tasks FOR ALL USING (tenant_id = get_current_tenant_id());

-- Task comments policies
CREATE POLICY "Users can view task comments for their tenant tasks" ON task_comments FOR SELECT USING (
    task_id IN (SELECT id FROM tasks WHERE tenant_id = get_current_tenant_id())
);
CREATE POLICY "Users can manage task comments for their tenant tasks" ON task_comments FOR ALL USING (
    task_id IN (SELECT id FROM tasks WHERE tenant_id = get_current_tenant_id())
);

-- =============================================
-- DOCUMENT MANAGEMENT POLICIES
-- =============================================

-- Documents policies
CREATE POLICY "Users can view documents in their tenant" ON documents FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Users can manage documents in their tenant" ON documents FOR ALL USING (tenant_id = get_current_tenant_id());

-- =============================================
-- NOTIFICATION SYSTEM POLICIES
-- =============================================

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- =============================================
-- SYSTEM CONFIGURATION POLICIES
-- =============================================

-- System settings policies
CREATE POLICY "Users can view system settings for their tenant" ON system_settings FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Tenant admins can manage system settings for their tenant" ON system_settings FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
);
CREATE POLICY "Super admins can manage all system settings" ON system_settings FOR ALL USING (is_super_admin());

-- Email templates policies
CREATE POLICY "Users can view email templates for their tenant" ON email_templates FOR SELECT USING (tenant_id = get_current_tenant_id());
CREATE POLICY "Tenant admins can manage email templates for their tenant" ON email_templates FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
);
CREATE POLICY "Super admins can manage all email templates" ON email_templates FOR ALL USING (is_super_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
SELECT 'RLS policies created successfully!' as message;
