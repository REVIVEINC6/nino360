"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, GitBranch, Clock, Shield, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function CRMSettings() {
  return (
    <Tabs defaultValue="stages" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="stages">
          <GitBranch className="mr-2 h-4 w-4" />
          Stages
        </TabsTrigger>
        <TabsTrigger value="sla">
          <Clock className="mr-2 h-4 w-4" />
          SLAs
        </TabsTrigger>
        <TabsTrigger value="dedupe">
          <Shield className="mr-2 h-4 w-4" />
          Dedupe Rules
        </TabsTrigger>
        <TabsTrigger value="general">
          <Settings className="mr-2 h-4 w-4" />
          General
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stages" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Pipeline Stages</h3>
              <p className="text-sm text-muted-foreground">Configure sales pipeline stages</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Qualified", probability: 20, order: 1 },
              { name: "Demo", probability: 40, order: 2 },
              { name: "Proposal", probability: 60, order: 3 },
              { name: "Negotiation", probability: 80, order: 4 },
              { name: "Closed Won", probability: 100, order: 5 },
            ].map((stage) => (
              <div key={stage.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{stage.order}</Badge>
                  <div>
                    <p className="font-medium">{stage.name}</p>
                    <p className="text-sm text-muted-foreground">{stage.probability}% probability</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="sla" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Service Level Agreements</h3>
            <p className="text-sm text-muted-foreground">Set response time targets for different lead types</p>
          </div>

          <div className="space-y-4">
            {[
              { type: "Hot Lead", target: "15 minutes", enabled: true },
              { type: "Warm Lead", target: "2 hours", enabled: true },
              { type: "Cold Lead", target: "24 hours", enabled: true },
              { type: "Inbound Request", target: "30 minutes", enabled: true },
            ].map((sla) => (
              <div key={sla.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{sla.type}</p>
                  <p className="text-sm text-muted-foreground">Target: {sla.target}</p>
                </div>
                <Switch checked={sla.enabled} />
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="dedupe" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Deduplication Rules</h3>
            <p className="text-sm text-muted-foreground">Prevent duplicate records in your CRM</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email-based deduplication</p>
                <p className="text-sm text-muted-foreground">Match contacts by email address</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Phone-based deduplication</p>
                <p className="text-sm text-muted-foreground">Match contacts by phone number</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Company name matching</p>
                <p className="text-sm text-muted-foreground">Fuzzy match on company names</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="general" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <p className="text-sm text-muted-foreground">Configure general CRM preferences</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Default Currency</Label>
              <Input defaultValue="USD" />
            </div>
            <div>
              <Label>Fiscal Year Start</Label>
              <Input defaultValue="January" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Auto-assign leads</p>
                <p className="text-sm text-muted-foreground">Automatically assign new leads to sales reps</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
