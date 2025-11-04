import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectRisksManagement } from "@/components/projects/project-risks-management"

export default function ProjectRisksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Risks & Issues</h1>
        <p className="text-muted-foreground">Track and mitigate project risks and issues</p>
      </div>

      <Tabs defaultValue="risks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation Plans</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-4">
          <ProjectRisksManagement view="risks" />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <ProjectRisksManagement view="issues" />
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-4">
          <ProjectRisksManagement view="mitigation" />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <ProjectRisksManagement view="ai-insights" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
