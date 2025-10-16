import { getTenantContext } from "./actions"
import { OnboardingWizard } from "@/components/tenant-onboarding/onboarding-wizard"

export default async function OnboardingPage() {
  const context = await getTenantContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <OnboardingWizard initialContext={context} />
    </div>
  )
}
