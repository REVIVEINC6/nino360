-- ============================================================================
-- NINO360 Step 36: Enhanced Tenant Security Management
-- Adds MFA, session policies, password rules, SSO, and secrets management
-- ============================================================================

-- Extend tenant_security table with additional security features
DO $$
BEGIN
  -- MFA settings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'mfa_required') THEN
    ALTER TABLE core.tenant_security ADD COLUMN mfa_required BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Session settings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'session_max_minutes') THEN
    ALTER TABLE core.tenant_security ADD COLUMN session_max_minutes INTEGER DEFAULT 720; -- 12 hours
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'session_idle_minutes') THEN
    ALTER TABLE core.tenant_security ADD COLUMN session_idle_minutes INTEGER DEFAULT 60; -- 1 hour
  END IF;
  
  -- Password policy
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'password_min_length') THEN
    ALTER TABLE core.tenant_security ADD COLUMN password_min_length INTEGER DEFAULT 12;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'password_require_symbols') THEN
    ALTER TABLE core.tenant_security ADD COLUMN password_require_symbols BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'password_require_numbers') THEN
    ALTER TABLE core.tenant_security ADD COLUMN password_require_numbers BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'password_require_cases') THEN
    ALTER TABLE core.tenant_security ADD COLUMN password_require_cases BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- DLP custom patterns (rename dlp_config to dlp_custom for consistency)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'dlp_config') THEN
    ALTER TABLE core.tenant_security RENAME COLUMN dlp_config TO dlp_custom;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'dlp_custom') THEN
    ALTER TABLE core.tenant_security ADD COLUMN dlp_custom JSONB DEFAULT '[]'::JSONB;
  END IF;
  
  -- SSO settings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'sso_enabled') THEN
    ALTER TABLE core.tenant_security ADD COLUMN sso_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'sso_provider') THEN
    ALTER TABLE core.tenant_security ADD COLUMN sso_provider TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'sso_metadata_url') THEN
    ALTER TABLE core.tenant_security ADD COLUMN sso_metadata_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'jit_provisioning') THEN
    ALTER TABLE core.tenant_security ADD COLUMN jit_provisioning BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Secrets scan results
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'tenant_security' AND column_name = 'secrets_scan') THEN
    ALTER TABLE core.tenant_security ADD COLUMN secrets_scan JSONB DEFAULT '[]'::JSONB;
  END IF;
END $$;

-- Create tenant_session_policies table for per-role session overrides
CREATE TABLE IF NOT EXISTS core.tenant_session_policies (
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('tenant_admin', 'manager', 'member')),
  max_minutes INTEGER,
  idle_minutes INTEGER,
  PRIMARY KEY (tenant_id, role)
);

ALTER TABLE core.tenant_session_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY tsp_select ON core.tenant_session_policies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_session_policies.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role IN ('tenant_admin', 'manager')
  )
);

CREATE POLICY tsp_write ON core.tenant_session_policies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_session_policies.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role = 'tenant_admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_session_policies.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role = 'tenant_admin'
  )
);

CREATE INDEX IF NOT EXISTS idx_tenant_session_policies_tenant ON core.tenant_session_policies(tenant_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON core.tenant_session_policies TO authenticated;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate session minutes (5-1440)
CREATE OR REPLACE FUNCTION core.validate_session_minutes(minutes INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql AS $$
BEGIN
  RETURN minutes >= 5 AND minutes <= 1440;
END $$;

GRANT EXECUTE ON FUNCTION core.validate_session_minutes(INTEGER) TO authenticated;

-- Function to validate password length (8-128)
CREATE OR REPLACE FUNCTION core.validate_password_length(length INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql AS $$
BEGIN
  RETURN length >= 8 AND length <= 128;
END $$;

GRANT EXECUTE ON FUNCTION core.validate_password_length(INTEGER) TO authenticated;
