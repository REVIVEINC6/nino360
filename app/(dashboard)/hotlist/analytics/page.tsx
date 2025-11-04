import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotlistAnalytics } from "@/components/hotlist/hotlist-analytics"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TwoPane } from "@/components/layout/two-pane"
import { HotlistSidebar } from "@/components/hotlist/hotlist-sidebar"

export default function HotlistAnalyticsPage() {
  return (
    <TwoPane right={<HotlistSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotlist Analytics</h1>
          <p className="text-muted-foreground">Response rate, time-to-submit, conversion metrics</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="response">Response Rates</TabsTrigger>
              <TabsTrigger value="conversion">Conversion Metrics</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <HotlistAnalytics view="overview" />
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <HotlistAnalytics view="response" />
            </TabsContent>

            <TabsContent value="conversion" className="space-y-4">
              <HotlistAnalytics view="conversion" />
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <HotlistAnalytics view="trends" />
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    </TwoPane>
  )
}
