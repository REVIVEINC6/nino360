import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForecastingManagement } from "@/components/finance/forecasting-management"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export default function ForecastingPage() {
  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forecasting</h1>
        <p className="text-muted-foreground">Cashflow forecasting and revenue projections</p>
      </div>

      <Tabs defaultValue="cashflow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="space-y-4">
          <ForecastingManagement view="cashflow" />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <ForecastingManagement view="revenue" />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <ForecastingManagement view="scenarios" />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <ForecastingManagement view="ai-insights" />
        </TabsContent>
      </Tabs>
      </div>
    </TwoPane>
  )
}
