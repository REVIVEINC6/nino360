-- Application Settings Table
CREATE TABLE IF NOT EXISTS application_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value JSONB,
  data_type VARCHAR(20) NOT NULL DEFAULT 'string',
  description TEXT,
  default_value JSONB,
  validation_rules JSONB,
  is_sensitive BOOLEAN DEFAULT FALSE,
  is_system_setting BOOLEAN DEFAULT FALSE,
  is_required BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  deleted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, category, key)
);

-- User Permissions Table
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  resource VARCHAR(50) NOT NULL,
  actions TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table (if not exists)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_application_settings_tenant_category ON application_settings(tenant_id, category);
CREATE INDEX IF NOT EXISTS idx_application_settings_tenant_key ON application_settings(tenant_id, key);
CREATE INDEX IF NOT EXISTS idx_application_settings_active ON application_settings(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_resource ON user_permissions(user_id, resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_action ON audit_logs(tenant_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Row Level Security
ALTER TABLE application_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access their tenant's settings" ON application_settings
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can access their own permissions" ON user_permissions
  FOR ALL USING (user_id = auth.uid());

-- Insert sample permissions for settings management
INSERT INTO user_permissions (user_id, resource, actions) VALUES
  -- Admin user with full permissions (replace with actual admin user ID)
  ('00000000-0000-0000-0000-000000000000', 'settings', ARRAY['*']),
  -- Regular user with read permissions
  ('00000000-0000-0000-0000-000000000001', 'settings', ARRAY['read']),
  -- Manager with read/write permissions
  ('00000000-0000-0000-0000-000000000002', 'settings', ARRAY['read', 'write', 'export'])
ON CONFLICT (user_id, resource) DO NOTHING;

-- Insert sample settings
INSERT INTO application_settings (tenant_id, category, key, value, data_type, description, is_sensitive, is_system_setting) VALUES
  -- System settings
  ('00000000-0000-0000-0000-000000000000', 'system', 'app_name', '"Nino360 Platform"', 'string', 'Application name', false, true),
  ('00000000-0000-0000-0000-000000000000', 'system', 'app_version', '"1.0.0"', 'string', 'Application version', false, true),
  ('00000000-0000-0000-0000-000000000000', 'system', 'maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false, true),
  
  -- Security settings
  ('00000000-0000-0000-0000-000000000000', 'security', 'session_timeout', '3600', 'number', 'Session timeout in seconds', false, false),
  ('00000000-0000-0000-0000-000000000000', 'security', 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', false, false),
  ('00000000-0000-0000-0000-000000000000', 'security', 'password_min_length', '8', 'number', 'Minimum password length', false, false),
  ('00000000-0000-0000-0000-000000000000', 'security', 'api_key', '"sk-1234567890abcdef"', 'string', 'API key for external services', true, false),
  
  -- Email settings
  ('00000000-0000-0000-0000-000000000000', 'email', 'smtp_host', '"smtp.example.com"', 'string', 'SMTP server host', false, false),
  ('00000000-0000-0000-0000-000000000000', 'email', 'smtp_port', '587', 'number', 'SMTP server port', false, false),
  ('00000000-0000-0000-0000-000000000000', 'email', 'smtp_username', '"noreply@example.com"', 'string', 'SMTP username', true, false),
  ('00000000-0000-0000-0000-000000000000', 'email', 'smtp_password', '"password123"', 'string', 'SMTP password', true, false),
  
  -- Feature flags
  ('00000000-0000-0000-0000-000000000000', 'features', 'enable_ai_chat', 'true', 'boolean', 'Enable AI chat functionality', false, false),
  ('00000000-0000-0000-0000-000000000000', 'features', 'enable_analytics', 'true', 'boolean', 'Enable analytics tracking', false, false),
  ('00000000-0000-0000-0000-000000000000', 'features', 'enable_notifications', 'true', 'boolean', 'Enable push notifications', false, false),
  
  -- UI settings
  ('00000000-0000-0000-0000-000000000000', 'ui', 'theme', '"light"', 'string', 'Default theme', false, false),
  ('00000000-0000-0000-0000-000000000000', 'ui', 'items_per_page', '25', 'number', 'Default items per page', false, false),
  ('00000000-0000-0000-0000-000000000000', 'ui', 'sidebar_collapsed', 'false', 'boolean', 'Default sidebar state', false, false)
ON CONFLICT (tenant_id, category, key) DO NOTHING;

-- Create function to validate setting values
CREATE OR REPLACE FUNCTION validate_setting_value()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate data type matches value
  CASE NEW.data_type
    WHEN 'string' THEN
      IF jsonb_typeof(NEW.value) != 'string' THEN
        RAISE EXCEPTION 'Value must be a string for data_type string';
      END IF;
    WHEN 'number' THEN
      IF jsonb_typeof(NEW.value) != 'number' THEN
        RAISE EXCEPTION 'Value must be a number for data_type number';
      END IF;
    WHEN 'boolean' THEN
      IF jsonb_typeof(NEW.value) != 'boolean' THEN
        RAISE EXCEPTION 'Value must be a boolean for data_type boolean';
      END IF;
    WHEN 'object' THEN
      IF jsonb_typeof(NEW.value) != 'object' THEN
        RAISE EXCEPTION 'Value must be an object for data_type object';
      END IF;
    WHEN 'array' THEN
      IF jsonb_typeof(NEW.value) != 'array' THEN
        RAISE EXCEPTION 'Value must be an array for data_type array';
      END IF;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_setting_value_trigger
  BEFORE INSERT OR UPDATE ON application_settings
  FOR EACH ROW
  EXECUTE FUNCTION validate_setting_value();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_application_settings_updated_at
  BEFORE UPDATE ON application_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
