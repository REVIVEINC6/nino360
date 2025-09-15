-- Enable realtime for user profiles and roles
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE roles;
ALTER PUBLICATION supabase_realtime ADD TABLE role_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE tenants;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON user_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_role_assignments_user_id ON role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_role_id ON role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
  user_id UUID,
  permission_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  has_permission BOOLEAN := FALSE;
BEGIN
  -- Get user role
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id AND is_active = true;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check permissions based on role
  CASE permission_name
    WHEN 'SYSTEM_ADMIN' THEN
      has_permission := user_role IN ('master_admin', 'super_admin');
    WHEN 'TENANT_ADMIN' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    WHEN 'CREATE_USERS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    WHEN 'EDIT_USERS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    WHEN 'DELETE_USERS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin');
    WHEN 'VIEW_USERS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin', 'recruitment_manager', 'hr_manager');
    WHEN 'VIEW_ANALYTICS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin', 'recruitment_manager', 'hr_manager', 'business_development_manager');
    WHEN 'EXPORT_DATA' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    WHEN 'VIEW_AI_INSIGHTS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin', 'recruitment_manager', 'hr_manager');
    WHEN 'IMPLEMENT_AI_RECOMMENDATIONS' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    WHEN 'MANAGE_BILLING' THEN
      has_permission := user_role IN ('master_admin', 'super_admin');
    WHEN 'VIEW_BILLING' THEN
      has_permission := user_role IN ('master_admin', 'super_admin', 'admin');
    ELSE
      has_permission := FALSE;
  END CASE;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check tenant access
CREATE OR REPLACE FUNCTION check_tenant_access(
  user_id UUID,
  target_tenant_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  user_tenant_id UUID;
BEGIN
  -- Get user role and tenant
  SELECT role, tenant_id INTO user_role, user_tenant_id
  FROM user_profiles
  WHERE id = user_id AND is_active = true;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Master and Super admins can access any tenant
  IF user_role IN ('master_admin', 'super_admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Other roles can only access their own tenant
  RETURN user_tenant_id = target_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user profile updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_profile_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_updated_at();

-- RLS policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing critical fields
    OLD.role = NEW.role AND
    OLD.tenant_id = NEW.tenant_id AND
    OLD.is_active = NEW.is_active
  );

-- Admins can view profiles in their tenant
CREATE POLICY "Admins can view tenant profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.is_active = true
      AND (
        up.role IN ('master_admin', 'super_admin') OR
        (up.role = 'admin' AND up.tenant_id = user_profiles.tenant_id)
      )
    )
  );

-- Admins can manage profiles in their tenant
CREATE POLICY "Admins can manage tenant profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.is_active = true
      AND (
        up.role IN ('master_admin', 'super_admin') OR
        (up.role = 'admin' AND up.tenant_id = user_profiles.tenant_id)
      )
    )
  );
