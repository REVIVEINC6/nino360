import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinanceAnalytics } from "@/components/finance/finance-analytics"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function FinanceAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Analytics</h1>
        <p className="text-muted-foreground">Budget vs actuals, margin analysis, and trends</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="margins">Margins</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="budget">Budget vs Actuals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <FinanceAnalytics view="overview" />
          </TabsContent>

          <TabsContent value="margins" className="space-y-4">
            <FinanceAnalytics view="margins" />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <FinanceAnalytics view="trends" />
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <FinanceAnalytics view="budget" />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
