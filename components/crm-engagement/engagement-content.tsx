"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Mail, Users } from "lucide-react"
import { SequencesTab } from "./sequences-tab"
import { TemplatesTab } from "./templates-tab"
import { CampaignsTab } from "./campaigns-tab"

export function EngagementContent() {
  return (
    <Tabs defaultValue="sequences" className="space-y-6">
      <TabsList className="glass-panel grid w-full grid-cols-3">
        <TabsTrigger value="sequences">
          <Send className="mr-2 h-4 w-4" />
          Sequences
        </TabsTrigger>
        <TabsTrigger value="templates">
          <Mail className="mr-2 h-4 w-4" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="campaigns">
          <Users className="mr-2 h-4 w-4" />
          Campaigns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sequences">
        <SequencesTab />
      </TabsContent>

      <TabsContent value="templates">
        <TemplatesTab />
      </TabsContent>

      <TabsContent value="campaigns">
        <CampaignsTab />
      </TabsContent>
    </Tabs>
  )
}
