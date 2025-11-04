import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinanceReports } from "@/components/finance/finance-reports"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export default function FinanceReportsPage() {
  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">P&L, balance sheet, and financial statements</p>
      </div>

      <Tabs defaultValue="pl" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pl">P&L</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pl" className="space-y-4">
          <FinanceReports view="pl" />
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <FinanceReports view="balance" />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <FinanceReports view="cashflow" />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <FinanceReports view="custom" />
        </TabsContent>
      </Tabs>
      </div>
    </TwoPane>
  )
}
