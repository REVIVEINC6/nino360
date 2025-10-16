import { OffboardingManagement } from "@/components/hrms/offboarding-management"

export default async function OffboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Offboarding</h1>
        <p className="text-muted-foreground">Exit checklist and deprovisioning workflows</p>
      </div>

      <OffboardingManagement />
    </div>
  )
}
