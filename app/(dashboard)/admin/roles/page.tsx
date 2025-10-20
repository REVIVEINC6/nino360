import { cookies } from "next/headers"
import { listRoles, listPermissions } from "../actions/roles"
import { RolesManagement } from "@/components/admin/roles-management"

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  await cookies()

  const [roles, permissions] = await Promise.all([listRoles(), listPermissions()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="space-y-6 p-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage role assignments and permissions across modules with AI-powered insights
          </p>
        </div>

        <RolesManagement initialRoles={roles} initialPermissions={permissions} />
      </div>
    </div>
  )
}
