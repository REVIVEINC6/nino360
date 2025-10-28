import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VMSJobDistribution } from "@/components/vms/vms-job-distribution"

export default function VMSJobsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Distribution</h1>
        <p className="text-muted-foreground">Create jobs and distribute to vendors</p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <VMSJobDistribution view="jobs" />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <VMSJobDistribution view="distribution" />
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <VMSJobDistribution view="responses" />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <VMSJobDistribution view="templates" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
