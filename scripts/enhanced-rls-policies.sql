-- Enable Row Level Security on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() ->> 'tenant_id')::UUID,
        (SELECT tenant_id FROM users WHERE id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        auth.jwt() ->> 'role',
        (SELECT role::TEXT FROM users WHERE id = auth.uid()),
        'end_user'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin or higher
CREATE OR REPLACE FUNCTION is_admin_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() IN ('admin', 'super_admin', 'master_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is super admin or higher
CREATE OR REPLACE FUNCTION is_super_admin_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() IN ('super_admin', 'master_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is master admin
CREATE OR REPLACE FUNCTION is_master_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() = 'master_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenants policies
CREATE POLICY "Users can view their own tenant" ON tenants
    FOR SELECT USING (
        id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Super admins can manage tenants" ON tenants
    FOR ALL USING (is_super_admin_or_higher());

CREATE POLICY "Admins can update their tenant" ON tenants
    FOR UPDATE USING (
        id = get_current_tenant_id() AND 
        is_admin_or_higher()
    );

-- Users policies
CREATE POLICY "Users can view users in their tenant" ON users
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their tenant" ON users
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "Super admins can create users" ON users
    FOR INSERT WITH CHECK (is_super_admin_or_higher());

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions" ON user_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view sessions in their tenant" ON user_sessions
    FOR SELECT USING (
        is_admin_or_higher() AND 
        user_id IN (SELECT id FROM users WHERE tenant_id = get_current_tenant_id())
    );

-- Tenant analytics policies
CREATE POLICY "Users can view analytics for their tenant" ON tenant_analytics
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "System can insert analytics" ON tenant_analytics
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Admins can manage analytics for their tenant" ON tenant_analytics
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- Billing accounts policies
CREATE POLICY "Admins can view billing for their tenant" ON billing_accounts
    FOR SELECT USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "Admins can manage billing for their tenant" ON billing_accounts
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- Payments policies
CREATE POLICY "Admins can view payments for their tenant" ON payments
    FOR SELECT USING (
        (billing_account_id IN (
            SELECT id FROM billing_accounts 
            WHERE tenant_id = get_current_tenant_id()
        ) AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "System can insert payments" ON payments
    FOR INSERT WITH CHECK (
        billing_account_id IN (
            SELECT id FROM billing_accounts 
            WHERE tenant_id = get_current_tenant_id()
        ) OR is_super_admin_or_higher()
    );

-- Tenant integrations policies
CREATE POLICY "Users can view integrations for their tenant" ON tenant_integrations
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Admins can manage integrations for their tenant" ON tenant_integrations
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- API usage policies
CREATE POLICY "Admins can view API usage for their tenant" ON api_usage
    FOR SELECT USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "System can log API usage" ON api_usage
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

-- Workflows policies
CREATE POLICY "Users can view workflows for their tenant" ON workflows
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Admins can manage workflows for their tenant" ON workflows
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- Workflow runs policies
CREATE POLICY "Users can view workflow runs for their tenant" ON workflow_runs
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Users can create workflow runs for their tenant" ON workflow_runs
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "System can update workflow runs" ON workflow_runs
    FOR UPDATE USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        user_id = auth.uid() OR
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs for their tenant" ON audit_logs
    FOR SELECT USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

CREATE POLICY "System can create audit logs" ON audit_logs
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

-- System settings policies
CREATE POLICY "Users can view settings for their tenant" ON system_settings
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Admins can manage settings for their tenant" ON system_settings
    FOR ALL USING (
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- File uploads policies
CREATE POLICY "Users can view files for their tenant" ON file_uploads
    FOR SELECT USING (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher() OR
        is_public = true
    );

CREATE POLICY "Users can upload files to their tenant" ON file_uploads
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id() OR 
        is_super_admin_or_higher()
    );

CREATE POLICY "Users can manage their own uploads" ON file_uploads
    FOR ALL USING (
        uploaded_by = auth.uid() OR
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- Realtime subscriptions policies
CREATE POLICY "Users can manage their own subscriptions" ON realtime_subscriptions
    FOR ALL USING (
        user_id = auth.uid() OR
        (tenant_id = get_current_tenant_id() AND is_admin_or_higher()) OR
        is_super_admin_or_higher()
    );

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role for system operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
