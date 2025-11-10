import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetingManagement } from "@/components/finance/budgeting-management"

export default function BudgetingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgeting</h1>
        <p className="text-muted-foreground">Budget creation, tracking, and variance analysis</p>
      </div>

      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <BudgetingManagement view="budgets" />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <BudgetingManagement view="tracking" />
        </TabsContent>

        <TabsContent value="variance" className="space-y-4">
          <BudgetingManagement view="variance" />
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <BudgetingManagement view="forecasts" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
