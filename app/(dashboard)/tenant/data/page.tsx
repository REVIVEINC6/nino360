import { DataManagement } from "@/components/tenant/data-management"

export default async function TenantDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground">
          Manage documents, RAG, imports/exports, datasets, and data retention policies
        </p>
      </div>

      <DataManagement />
    </div>
  )
}
