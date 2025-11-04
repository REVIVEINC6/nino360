import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VMSAnalytics } from "@/components/vms/vms-analytics"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function VMSAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">VMS Analytics</h1>
        <p className="text-muted-foreground">Vendor performance and SLA metrics</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sla">SLA Metrics</TabsTrigger>
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <VMSAnalytics view="performance" />
          </TabsContent>

          <TabsContent value="sla" className="space-y-4">
            <VMSAnalytics view="sla" />
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            <VMSAnalytics view="cost" />
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <VMSAnalytics view="quality" />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
