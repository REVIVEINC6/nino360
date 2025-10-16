import { listRoles, listPermissions } from "../actions/roles"
import { RolesManagement } from "@/components/admin/roles-management"

export default async function RolesPage() {
  const [roles, permissions] = await Promise.all([listRoles(), listPermissions()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage role assignments and permissions across modules</p>
      </div>

      <RolesManagement initialRoles={roles} initialPermissions={permissions} />
    </div>
  )
}
