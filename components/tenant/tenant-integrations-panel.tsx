"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plug, Settings, CheckCircle, XCircle, Plus, ExternalLink, Key, Zap } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "error"
  category: string
  lastSync: string
  apiCalls: number
}

export function TenantIntegrationsPanel() {
  const [integrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Salesforce CRM",
      description: "Sync customer data and opportunities",
      status: "active",
      category: "CRM",
      lastSync: "2 minutes ago",
      apiCalls: 1247,
    },
    {
      id: "2",
      name: "Slack Notifications",
      description: "Send alerts and notifications to Slack channels",
      status: "active",
      category: "Communication",
      lastSync: "5 minutes ago",
      apiCalls: 89,
    },
    {
      id: "3",
      name: "QuickBooks",
      description: "Financial data synchronization",
      status: "error",
      category: "Finance",
      lastSync: "2 hours ago",
      apiCalls: 0,
    },
    {
      id: "4",
      name: "Microsoft Teams",
      description: "Team collaboration and notifications",
      status: "inactive",
      category: "Communication",
      lastSync: "Never",
      apiCalls: 0,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Inactive</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              {integrations.filter((i) => i.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.apiCalls, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(integration.status)}
                      <Switch checked={integration.status === "active"} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="font-medium">{integration.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Sync</Label>
                      <p className="font-medium">{integration.lastSync}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">API Calls</Label>
                      <p className="font-medium">{integration.apiCalls.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "HubSpot", category: "CRM", description: "Customer relationship management" },
              { name: "Zapier", category: "Automation", description: "Workflow automation" },
              { name: "Google Workspace", category: "Productivity", description: "Email and document sync" },
              { name: "Jira", category: "Project Management", description: "Issue tracking and project management" },
              { name: "GitHub", category: "Development", description: "Code repository integration" },
              { name: "Stripe", category: "Payments", description: "Payment processing" },
            ].map((integration, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{integration.category}</Badge>
                    <Button size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage your API keys and integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Master API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" type="password" value="sk-1234567890abcdef" readOnly />
                  <Button variant="outline">
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" value="https://api.esgos.com/webhooks/tenant-123" readOnly />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-sync" />
                <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="notifications" defaultChecked />
                <Label htmlFor="notifications">Send integration notifications</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
