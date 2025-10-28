import { AccessManagement } from "@/components/tenant/access-management"

export default async function TenantAccessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Access Management</h1>
        <p className="text-muted-foreground">Manage roles, permissions, RBAC matrix, FBAC flags, and access scopes</p>
      </div>

      <AccessManagement />
    </div>
  )
}
