import { CompensationManagementContent } from "@/components/hrms/compensation/compensation-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function CompensationPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6 p-6">
        <div className="glass-card p-6 rounded-xl backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Compensation Management
          </h1>
          <p className="text-gray-600 mt-2">
            Salary bands, review cycles, and compensation adjustments with AI-powered equity analysis
          </p>
        </div>

        <CompensationManagementContent />
      </div>
    </TwoPane>
  )
}
