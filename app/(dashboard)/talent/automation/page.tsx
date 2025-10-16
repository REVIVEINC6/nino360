import { TalentAutomation } from "@/components/talent/talent-automation"

export default async function AutomationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automation</h1>
        <p className="text-muted-foreground">Triggers, rules, and workflow automation</p>
      </div>

      <TalentAutomation />
    </div>
  )
}
