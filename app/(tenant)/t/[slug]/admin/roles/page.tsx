import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { requireTenantAdmin } from "@/lib/rbac/guards"
import { Card } from "@/components/ui/card"
import { RoleBadge } from "@/components/rbac/role-badge"

export default async function RolesPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get tenant by slug
  const { data: tenant } = await supabase.from("tenants").select("id, name").eq("slug", params.slug).single()

  if (!tenant) {
    redirect("/dashboard")
  }

  // Require tenant admin
  await requireTenantAdmin(tenant.id, `/t/${params.slug}/dashboard`)

  // Get all roles for this tenant
  const { data: roles } = await supabase.from("roles").select("*").eq("tenant_id", tenant.id).order("key")

  // Get role assignments
  const { data: assignments } = await supabase
    .from("user_roles")
    .select("*, user:users(email), role:roles(key, label)")
    .eq("tenant_id", tenant.id)

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D0FF00] to-[#F81CE5] bg-clip-text text-transparent">
          Roles & Permissions
        </h1>
        <p className="text-muted-foreground mt-2">Manage role-based access control for {tenant.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Roles */}
        <Card className="glass-card border-neon p-6">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <div className="space-y-3">
            {roles?.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div>
                  <p className="font-medium">{role.label}</p>
                  <p className="text-sm text-muted-foreground">{role.key}</p>
                </div>
                <RoleBadge role={role.key} />
              </div>
            ))}
          </div>
        </Card>

        {/* Role Assignments */}
        <Card className="glass-card border-neon p-6">
          <h2 className="text-xl font-semibold mb-4">Role Assignments</h2>
          <div className="space-y-3">
            {assignments?.map((assignment: any) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div>
                  <p className="font-medium">{assignment.user.email}</p>
                  <p className="text-sm text-muted-foreground">{assignment.role.label}</p>
                </div>
                <RoleBadge role={assignment.role.key} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
