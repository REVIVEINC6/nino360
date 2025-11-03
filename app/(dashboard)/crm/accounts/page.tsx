import { Suspense } from "react"
import { AccountsHeader } from "@/components/crm-accounts/accounts-header"
import { AccountsContent } from "@/components/crm-accounts/accounts-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"

export default async function AccountsPage() {
  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AccountsHeader />
        <Suspense fallback={<AILoadingState message="Loading accounts intelligence..." />}>
          <AccountsContent />
        </Suspense>
      </div>
    </div>
  )
}
