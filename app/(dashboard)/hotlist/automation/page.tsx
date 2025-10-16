import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotlistAutomation } from "@/components/hotlist/hotlist-automation"

export default function HotlistAutomationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
        <p className="text-muted-foreground">Campaign rules, auto-create one-pagers, message personalization</p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ai">AI Personalization</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <HotlistAutomation view="campaigns" />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <HotlistAutomation view="templates" />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <HotlistAutomation view="ai" />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <HotlistAutomation view="rules" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
