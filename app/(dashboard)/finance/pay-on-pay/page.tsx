import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayOnPayManagement } from "@/components/finance/pay-on-pay-management"

export default function PayOnPayPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pay-on-Pay</h1>
        <p className="text-muted-foreground">Client→vendor linkage and reconciliation</p>
      </div>

      <Tabs defaultValue="linkage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="linkage">Linkage</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="linkage" className="space-y-4">
          <PayOnPayManagement view="linkage" />
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <PayOnPayManagement view="reconciliation" />
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <PayOnPayManagement view="disputes" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <PayOnPayManagement view="reports" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
