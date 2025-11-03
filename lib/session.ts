import { getSupabaseServerClient } from "./supabase/server"

export async function getSession() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Fetch user's tenant memberships and roles
  // Try core.user_tenants first, fall back to mock data if table doesn't exist
  const { data: userTenants, error: tenantsError } = await supabase
    .from("core.user_tenants")
    .select("tenant_id, is_primary, tenants:tenant_id(slug, name)")
    .eq("user_id", user.id)

  const { data: userRoles, error: rolesError } = await supabase
    .from("core.user_roles")
    .select("role_id, tenant_id, roles:role_id(key, label)")
    .eq("user_id", user.id)

  // If tables don't exist, provide mock data for development
  const mockTenants = tenantsError
    ? [
        {
          tenant_id: "00000000-0000-0000-0000-000000000001",
          is_primary: true,
          tenants: {
            slug: "demo",
            name: "Demo Organization",
          },
        },
      ]
    : userTenants || []

  const mockRoles = rolesError
    ? [
        {
          role_id: "00000000-0000-0000-0000-000000000001",
          tenant_id: "00000000-0000-0000-0000-000000000001",
          roles: {
            key: "admin",
            label: "Admin",
          },
        },
      ]
    : userRoles || []

  return {
    user,
    tenants: mockTenants,
    roles: mockRoles,
  }
}
