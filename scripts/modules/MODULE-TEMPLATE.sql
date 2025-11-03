-- ============================================================================
-- MODULE: [MODULE NAME]
-- ============================================================================
-- Description: [Brief description of what this module does]
-- Dependencies: 01-core-infrastructure.sql, 02-security-rbac-fbac.sql
-- Tables: [List main tables]
-- ============================================================================

\echo 'Setting up [Module Name]...'

-- ============================================================================
-- TABLES
-- ============================================================================

-- [Table 1]
CREATE TABLE IF NOT EXISTS [table_name] (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    -- Add your columns here
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

COMMENT ON TABLE [table_name] IS '[Table description]';

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_[table]_tenant_id ON [table_name](tenant_id);
CREATE INDEX IF NOT EXISTS idx_[table]_created_at ON [table_name](created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- [Add module-specific functions here]

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trigger_[table]_updated_at
    BEFORE UPDATE ON [table_name]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

\echo '[Module Name] setup complete!'
