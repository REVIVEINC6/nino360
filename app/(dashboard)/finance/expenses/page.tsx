import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesManagement } from "@/components/finance/expenses-management"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export default function ExpensesPage() {
  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">Employee and vendor expenses, reimbursements</p>
      </div>

      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <ExpensesManagement view="expenses" />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ExpensesManagement view="approvals" />
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-4">
          <ExpensesManagement view="reimbursements" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ExpensesManagement view="reports" />
        </TabsContent>
      </Tabs>
      </div>
    </TwoPane>
  )
}
