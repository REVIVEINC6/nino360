import { OnboardingManagement } from "@/components/hrms/onboarding/onboarding-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function OnboardingPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-xl">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Employee Onboarding
          </h1>
          <p className="text-gray-600 mt-2">New hire provisioning and onboarding workflows with AI automation</p>
        </div>

        <OnboardingManagement />
      </div>
    </TwoPane>
  )
}
