import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsPayableManagement } from "@/components/finance/accounts-payable-management"

export default function AccountsPayablePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounts Payable</h1>
        <p className="text-muted-foreground">Manage vendor bills, payment processing, and approvals</p>
      </div>

      <Tabs defaultValue="bills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-4">
          <AccountsPayableManagement view="bills" />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <AccountsPayableManagement view="approvals" />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <AccountsPayableManagement view="payments" />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <AccountsPayableManagement view="vendors" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
