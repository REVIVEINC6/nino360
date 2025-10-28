import { OnboardingManagement } from "@/components/hrms/onboarding/onboarding-management-content"

export default async function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="space-y-6 p-6">
        <div className="glass-card p-6 rounded-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Employee Onboarding
          </h1>
          <p className="text-gray-600 mt-2">New hire provisioning and onboarding workflows with AI automation</p>
        </div>

        <OnboardingManagement />
      </div>
    </div>
  )
}
