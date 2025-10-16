import { BenefitsManagementClient } from "@/components/hrms/benefits/benefits-management-client"

export default async function BenefitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Benefits Management</h1>
        <p className="text-muted-foreground">Plans, enrollment, and claims management</p>
      </div>

      <BenefitsManagementClient />
    </div>
  )
}
