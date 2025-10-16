import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotlistSettings } from "@/components/hotlist/hotlist-settings"

export default function HotlistSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hotlist Settings</h1>
        <p className="text-muted-foreground">DLP on PII, export controls, distribution preferences</p>
      </div>

      <Tabs defaultValue="dlp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dlp">DLP & Privacy</TabsTrigger>
          <TabsTrigger value="export">Export Controls</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="dlp" className="space-y-4">
          <HotlistSettings view="dlp" />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <HotlistSettings view="export" />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <HotlistSettings view="distribution" />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <HotlistSettings view="notifications" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
