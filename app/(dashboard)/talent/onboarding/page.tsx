import { TalentOnboarding } from "@/components/talent/talent-onboarding"

export default async function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <p className="text-muted-foreground">Handoff new hires to HRMS onboarding process</p>
      </div>

      <TalentOnboarding />
    </div>
  )
}
