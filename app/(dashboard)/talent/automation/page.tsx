import { TalentAutomationContent } from "@/components/talent/talent-automation-content"
import { getAutomationRules } from "@/app/(dashboard)/talent/actions/automation"

export default async function AutomationPage() {
  const rules = await getAutomationRules()

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="glass-card p-8 border border-white/20 shadow-xl">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Automation Rules
          </h1>
          <p className="text-gray-600 mt-2">Automate recruitment workflows with AI-powered RPA</p>
        </div>

        <TalentAutomationContent initialRules={rules} />
      </div>
    </div>
  )
}
