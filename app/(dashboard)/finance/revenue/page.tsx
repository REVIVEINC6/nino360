import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueManagement } from "@/components/finance/revenue-management"

export default function RevenuePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
        <p className="text-muted-foreground">Revenue recognition rules and tracking</p>
      </div>

      <Tabs defaultValue="recognition" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="recognition" className="space-y-4">
          <RevenueManagement view="recognition" />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <RevenueManagement view="rules" />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <RevenueManagement view="schedules" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <RevenueManagement view="reports" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
