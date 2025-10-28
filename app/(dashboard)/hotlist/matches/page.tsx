import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotlistMatches } from "@/components/hotlist/hotlist-matches"

export default function HotlistMatchesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
        <p className="text-muted-foreground">Track responses & interest from clients/vendors</p>
      </div>

      <Tabs defaultValue="responses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="interest">Interest Tracking</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-4">
          <HotlistMatches view="responses" />
        </TabsContent>

        <TabsContent value="interest" className="space-y-4">
          <HotlistMatches view="interest" />
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <HotlistMatches view="conversions" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
