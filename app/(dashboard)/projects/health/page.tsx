import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHealthManagement } from "@/components/projects/project-health-management"

export default function ProjectHealthPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Health</h1>
        <p className="text-muted-foreground">Monitor project health and status indicators</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status Tracking</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProjectHealthManagement view="overview" />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <ProjectHealthManagement view="status" />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <ProjectHealthManagement view="alerts" />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <ProjectHealthManagement view="history" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
