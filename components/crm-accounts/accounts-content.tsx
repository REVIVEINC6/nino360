import { AccountsStats } from "./accounts-stats"
import { AccountsTable } from "./accounts-table"
import { AccountsAIPanel } from "./accounts-ai-panel"
import { getAccounts } from "@/app/(dashboard)/crm/actions/accounts"

export async function AccountsContent() {
  const accounts = await getAccounts()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <AccountsStats accounts={accounts} />
        <AccountsTable accounts={accounts} />
      </div>
      <div className="lg:col-span-1">
        <AccountsAIPanel accounts={accounts} />
      </div>
    </div>
  )
}
