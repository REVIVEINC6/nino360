import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriorityCandidates } from "@/components/hotlist/priority-candidates"
import { TwoPane } from "@/components/layout/two-pane"
import { HotlistSidebar } from "@/components/hotlist/hotlist-sidebar"

export default function PriorityCandidatesPage() {
  return (
    <TwoPane right={<HotlistSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Priority Candidates</h1>
          <p className="text-muted-foreground">Select and package priority profiles (skills/availability/rates)</p>
        </div>

        <Tabs defaultValue="candidates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="packaging">Packaging</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-4">
            <PriorityCandidates view="candidates" />
          </TabsContent>

          <TabsContent value="packaging" className="space-y-4">
            <PriorityCandidates view="packaging" />
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <PriorityCandidates view="distribution" />
          </TabsContent>
        </Tabs>
      </div>
    </TwoPane>
  )
}
