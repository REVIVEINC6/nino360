import { Suspense } from "react"
import { CRMSettingsHeader } from "@/components/crm-settings/settings-header"
import { CRMSettingsContent } from "@/components/crm-settings/settings-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"

export default async function CRMSettingsPage() {
  return (
    <div className="min-h-screen ai-gradient-bg">
      <div className="container mx-auto p-6 space-y-6">
        <CRMSettingsHeader />

        <Suspense fallback={<AILoadingState message="Loading CRM settings..." />}>
          <CRMSettingsContent />
        </Suspense>
      </div>
    </div>
  )
}
