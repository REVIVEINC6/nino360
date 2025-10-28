import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralLedgerManagement } from "@/components/finance/general-ledger-management"

export default function GeneralLedgerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">General Ledger</h1>
        <p className="text-muted-foreground">GL entries, chart of accounts, and journal entries</p>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journals">Journal Entries</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <GeneralLedgerManagement view="entries" />
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <GeneralLedgerManagement view="accounts" />
        </TabsContent>

        <TabsContent value="journals" className="space-y-4">
          <GeneralLedgerManagement view="journals" />
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <GeneralLedgerManagement view="reconciliation" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
