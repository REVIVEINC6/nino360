import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectResourcesManagement } from "@/components/projects/project-resources-management"

export default function ProjectResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Resources</h1>
        <p className="text-muted-foreground">Manage resource allocation and bench integration</p>
      </div>

      <Tabs defaultValue="allocation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="bench">Bench Integration</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-4">
          <ProjectResourcesManagement view="allocation" />
        </TabsContent>

        <TabsContent value="bench" className="space-y-4">
          <ProjectResourcesManagement view="bench" />
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <ProjectResourcesManagement view="utilization" />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <ProjectResourcesManagement view="forecast" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
