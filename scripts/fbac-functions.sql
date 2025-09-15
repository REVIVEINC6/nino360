-- Field-Based Access Control (FBAC) Helper Functions

-- Function to get field access level for a user
CREATE OR REPLACE FUNCTION get_field_access_level(
    p_user_id UUID,
    p_module TEXT,
    p_table_name TEXT,
    p_field_name TEXT,
    p_tenant_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_access_level TEXT := 'none';
    v_role_record RECORD;
BEGIN
    -- Get all active roles for the user
    FOR v_role_record IN
        SELECT r.field_permissions
        FROM esg_roles r
        JOIN user_role_assignments ura ON r.id = ura.role_id
        WHERE ura.user_id = p_user_id
        AND ura.is_active = TRUE
        AND r.is_active = TRUE
        AND (p_tenant_id IS NULL OR ura.tenant_id = p_tenant_id)
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
    LOOP
        -- Check if this role has permissions for the specific field
        IF v_role_record.field_permissions ? p_module THEN
            IF (v_role_record.field_permissions->p_module) ? p_table_name THEN
                IF (v_role_record.field_permissions->p_module->p_table_name) ? p_field_name THEN
                    DECLARE
                        v_current_access TEXT := v_role_record.field_permissions->p_module->p_table_name->>p_field_name;
                    BEGIN
                        -- Return the highest access level found
                        CASE 
                            WHEN v_current_access = 'admin' THEN
                                RETURN 'admin';
                            WHEN v_current_access = 'read_write' AND v_access_level NOT IN ('admin') THEN
                                v_access_level := 'read_write';
                            WHEN v_current_access = 'read' AND v_access_level NOT IN ('admin', 'read_write') THEN
                                v_access_level := 'read';
                        END CASE;
                    END;
                END IF;
            END IF;
        END IF;
    END LOOP;

    RETURN v_access_level;
END;
$$;

-- Function to get role usage statistics
CREATE OR REPLACE FUNCTION get_role_usage_stats()
RETURNS TABLE(
    role_id UUID,
    role_name TEXT,
    active_assignments BIGINT,
    total_assignments BIGINT,
    avg_assignment_duration INTERVAL,
    last_used TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        COUNT(CASE WHEN ura.is_active = TRUE THEN 1 END) as active_assignments,
        COUNT(ura.id) as total_assignments,
        AVG(CASE 
            WHEN ura.expires_at IS NOT NULL 
            THEN ura.expires_at - ura.assigned_at 
            ELSE NOW() - ura.assigned_at 
        END) as avg_assignment_duration,
        MAX(ura.assigned_at) as last_used
    FROM esg_roles r
    LEFT JOIN user_role_assignments ura ON r.id = ura.role_id
    WHERE r.is_active = TRUE
    GROUP BY r.id, r.name
    ORDER BY active_assignments DESC;
END;
$$;

-- Function to get role audit statistics
CREATE OR REPLACE FUNCTION get_role_audit_stats(p_role_id UUID)
RETURNS TABLE(
    total_events BIGINT,
    create_events BIGINT,
    update_events BIGINT,
    delete_events BIGINT,
    assign_events BIGINT,
    revoke_events BIGINT,
    access_denied_events BIGINT,
    last_activity TIMESTAMP WITH TIME ZONE,
    most_active_user UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN action = 'create' THEN 1 END) as create_events,
        COUNT(CASE WHEN action = 'update' THEN 1 END) as update_events,
        COUNT(CASE WHEN action = 'delete' THEN 1 END) as delete_events,
        COUNT(CASE WHEN action = 'assign' THEN 1 END) as assign_events,
        COUNT(CASE WHEN action = 'revoke' THEN 1 END) as revoke_events,
        COUNT(CASE WHEN action = 'access_denied' THEN 1 END) as access_denied_events,
        MAX(created_at) as last_activity,
        (
            SELECT user_id 
            FROM role_audit_logs 
            WHERE role_id = p_role_id 
            GROUP BY user_id 
            ORDER BY COUNT(*) DESC 
            LIMIT 1
        ) as most_active_user
    FROM role_audit_logs
    WHERE role_id = p_role_id;
END;
$$;

-- Function to validate field permissions structure
CREATE OR REPLACE FUNCTION validate_field_permissions(p_field_permissions JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_module TEXT;
    v_table TEXT;
    v_field TEXT;
    v_access TEXT;
BEGIN
    -- Iterate through modules
    FOR v_module IN SELECT jsonb_object_keys(p_field_permissions)
    LOOP
        -- Iterate through tables in each module
        FOR v_table IN SELECT jsonb_object_keys(p_field_permissions->v_module)
        LOOP
            -- Iterate through fields in each table
            FOR v_field IN SELECT jsonb_object_keys(p_field_permissions->v_module->v_table)
            LOOP
                v_access := p_field_permissions->v_module->v_table->>v_field;
                
                -- Validate access level
                IF v_access NOT IN ('none', 'read', 'read_write', 'admin') THEN
                    RAISE EXCEPTION 'Invalid access level: % for field %.%.%', v_access, v_module, v_table, v_field;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
    
    RETURN TRUE;
END;
$$;

-- Trigger to validate field permissions on role updates
CREATE OR REPLACE FUNCTION validate_role_field_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.field_permissions IS NOT NULL THEN
        PERFORM validate_field_permissions(NEW.field_permissions);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_validate_field_permissions ON esg_roles;
CREATE TRIGGER trigger_validate_field_permissions
    BEFORE INSERT OR UPDATE ON esg_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_role_field_permissions();

-- Function to get field access recommendations based on role and field sensitivity
CREATE OR REPLACE FUNCTION get_field_access_recommendations(
    p_role_name TEXT,
    p_sensitivity_level INTEGER,
    p_is_pii BOOLEAN,
    p_is_financial BOOLEAN
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    -- Super Administrator gets admin access to everything
    IF p_role_name = 'Super Administrator' THEN
        RETURN 'admin';
    END IF;
    
    -- Tenant Administrator gets restricted access to high sensitivity fields
    IF p_role_name = 'Tenant Administrator' THEN
        IF p_sensitivity_level >= 4 THEN
            RETURN 'read';
        ELSE
            RETURN 'read_write';
        END IF;
    END IF;
    
    -- Manager role restrictions
    IF p_role_name = 'Manager' THEN
        IF p_sensitivity_level >= 4 THEN
            IF p_is_financial THEN
                RETURN 'read';
            ELSE
                RETURN 'none';
            END IF;
        ELSIF p_is_pii THEN
            RETURN 'read';
        ELSE
            RETURN 'read_write';
        END IF;
    END IF;
    
    -- Employee role restrictions
    IF p_role_name = 'Employee' THEN
        IF p_sensitivity_level >= 4 OR p_is_pii OR p_is_financial THEN
            RETURN 'none';
        ELSE
            RETURN 'read';
        END IF;
    END IF;
    
    -- Viewer role - very restricted
    IF p_role_name = 'Viewer' THEN
        IF p_sensitivity_level >= 3 OR p_is_pii OR p_is_financial THEN
            RETURN 'none';
        ELSE
            RETURN 'read';
        END IF;
    END IF;
    
    -- Default to no access
    RETURN 'none';
END;
$$;

COMMIT;
