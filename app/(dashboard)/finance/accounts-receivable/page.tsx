import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsReceivableManagement } from "@/components/finance/accounts-receivable-management"

export default function AccountsReceivablePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounts Receivable</h1>
        <p className="text-muted-foreground">Manage client invoices, collections, and aging buckets</p>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <AccountsReceivableManagement view="invoices" />
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <AccountsReceivableManagement view="collections" />
        </TabsContent>

        <TabsContent value="aging" className="space-y-4">
          <AccountsReceivableManagement view="aging" />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <AccountsReceivableManagement view="payments" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
