import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrgentRequirements } from "@/components/hotlist/urgent-requirements"

export default function UrgentRequirementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Urgent Requirements</h1>
        <p className="text-muted-foreground">Open reqs needing quick fills</p>
      </div>

      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="matching">Matching</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <UrgentRequirements view="requirements" />
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <UrgentRequirements view="matching" />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <UrgentRequirements view="submissions" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
