-- ============================================================================
-- NINO360 Step 35: Tenant Configuration Enhancements
-- Adds tenant_security table and profile JSONB column for policies
-- ============================================================================

-- Add profile column to core.tenants for storing policies and other config
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'profile'
  ) THEN
    ALTER TABLE core.tenants ADD COLUMN profile JSONB DEFAULT '{}'::JSONB;
  END IF;
END $$;

-- Create tenant_security table for IP allowlist and DLP settings
CREATE TABLE IF NOT EXISTS core.tenant_security (
  tenant_id UUID PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  ip_allowlist CIDR[] DEFAULT '{}',
  dlp_preset TEXT NOT NULL DEFAULT 'standard' CHECK (dlp_preset IN ('standard', 'strict', 'custom')),
  dlp_config JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE core.tenant_security ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only tenant admins can read/write security settings
CREATE POLICY ts_select ON core.tenant_security FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_security.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role IN ('tenant_admin', 'manager')
  )
);

CREATE POLICY ts_write ON core.tenant_security FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_security.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role = 'tenant_admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM core.tenant_members tm
    WHERE tm.tenant_id = tenant_security.tenant_id 
    AND tm.user_id = auth.uid()
    AND tm.role = 'tenant_admin'
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenant_security_tenant ON core.tenant_security(tenant_id);

-- Grants
GRANT SELECT, INSERT, UPDATE ON core.tenant_security TO authenticated;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate CIDR notation
CREATE OR REPLACE FUNCTION core.is_valid_cidr(ip_text TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql AS $$
BEGIN
  PERFORM ip_text::CIDR;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END $$;

GRANT EXECUTE ON FUNCTION core.is_valid_cidr(TEXT) TO authenticated;
