import { OnboardingManagement } from "@/components/hrms/onboarding-management"

export default async function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Onboarding</h1>
        <p className="text-muted-foreground">New hire provisioning and onboarding workflows</p>
      </div>

      <OnboardingManagement />
    </div>
  )
}
