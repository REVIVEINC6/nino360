import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BenchAllocationManagement } from "@/components/bench/bench-allocation-management"

export default function BenchAllocationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource Allocation</h1>
        <p className="text-muted-foreground">Match project needs to available resources</p>
      </div>

      <Tabs defaultValue="needs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="needs">Project Needs</TabsTrigger>
          <TabsTrigger value="matching">Skill Matching</TabsTrigger>
          <TabsTrigger value="shortlist">Shortlist</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="needs" className="space-y-4">
          <BenchAllocationManagement view="needs" />
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <BenchAllocationManagement view="matching" />
        </TabsContent>

        <TabsContent value="shortlist" className="space-y-4">
          <BenchAllocationManagement view="shortlist" />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <BenchAllocationManagement view="approvals" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
