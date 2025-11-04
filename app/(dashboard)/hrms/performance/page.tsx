import { PerformanceManagementContent } from "@/components/hrms/performance/performance-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function PerformancePage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Management
          </h1>
          <p className="text-slate-600 mt-2">Goals, reviews, 360 feedback, and performance tracking with AI insights</p>
        </div>

        <PerformanceManagementContent />
      </div>
    </TwoPane>
  )
}
