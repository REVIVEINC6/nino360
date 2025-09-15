-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view tenant memberships" ON tenant_memberships;
DROP POLICY IF EXISTS "Users can view their tenant" ON tenants;

-- Create simplified RLS policies
CREATE POLICY "Enable read access for users based on user_id" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tenant policies
CREATE POLICY "Enable read access for tenant members" ON tenants
    FOR SELECT USING (
        id IN (
            SELECT tenant_id FROM tenant_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for service role" ON tenants
    FOR INSERT WITH CHECK (true);

-- Tenant membership policies
CREATE POLICY "Enable read access for own memberships" ON tenant_memberships
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable insert for service role" ON tenant_memberships
    FOR INSERT WITH CHECK (true);

-- Settings policies
CREATE POLICY "Enable read access for tenant members" ON settings
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for service role" ON settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON settings
    FOR UPDATE USING (true);
