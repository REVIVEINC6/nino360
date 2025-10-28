import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VMSSubmissions } from "@/components/vms/vms-submissions"

export default function VMSSubmissionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Submissions</h1>
        <p className="text-muted-foreground">Receive and manage vendor submissions</p>
      </div>

      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicate Detection</TabsTrigger>
          <TabsTrigger value="shortlist">Shortlist</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          <VMSSubmissions view="submissions" />
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-4">
          <VMSSubmissions view="duplicates" />
        </TabsContent>

        <TabsContent value="shortlist" className="space-y-4">
          <VMSSubmissions view="shortlist" />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <VMSSubmissions view="interviews" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
