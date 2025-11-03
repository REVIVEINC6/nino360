import { cookies } from "next/headers"
import { listRoles, listPermissions } from "../actions/roles"
import { RolesManagement } from "@/components/admin/roles-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  await cookies()

  const [roles, permissions] = await Promise.all([listRoles(), listPermissions()])

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage role assignments and permissions across modules with AI-powered insights
          </p>
        </div>

        <RolesManagement initialRoles={roles} initialPermissions={permissions} />
      </div>
    </TwoPane>
  )
}
