import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectReports } from "@/components/projects/project-reports"

export default function ProjectReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Reports</h1>
        <p className="text-muted-foreground">Weekly status, burn reports, and milestone tracking</p>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Weekly Status</TabsTrigger>
          <TabsTrigger value="burn">Burn Reports</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <ProjectReports view="status" />
        </TabsContent>

        <TabsContent value="burn" className="space-y-4">
          <ProjectReports view="burn" />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <ProjectReports view="milestones" />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <ProjectReports view="custom" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
