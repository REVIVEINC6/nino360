import { BenefitsManagementContent } from "@/components/hrms/benefits/benefits-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function BenefitsPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-xl border border-white/20 shadow-xl">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Benefits Management
          </h1>
          <p className="text-gray-600 mt-2">Plans, enrollment, and claims management</p>
        </div>

        <BenefitsManagementContent />
      </div>
    </TwoPane>
  )
}
