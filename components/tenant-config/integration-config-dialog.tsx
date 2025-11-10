"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Key, Webhook, Activity, AlertCircle, Copy, Eye, EyeOff } from "lucide-react"
import { updateIntegrationConfig, testIntegration } from "@/app/(dashboard)/tenant/integrations/actions"
import { useToast } from "@/hooks/use-toast"

interface IntegrationConfigDialogProps {
  integration: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function IntegrationConfigDialog({ integration, open, onOpenChange, onSave }: IntegrationConfigDialogProps) {
  const [config, setConfig] = useState(integration.config || {})
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const { toast } = useToast()

  const handleTest = async () => {
    setTesting(true)
    const result = await testIntegration(integration.id)
    setTesting(false)

    if (result.success) {
      toast({ title: "Test Successful", description: "Integration is working correctly" })
    } else {
      toast({ title: "Test Failed", description: result.message || 'Test failed', variant: "destructive" })
    }
  }

  const handleSave = async () => {
    await updateIntegrationConfig(integration.id, config)
    toast({ title: "Configuration Saved", description: "Integration settings updated successfully" })
    onSave()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            {integration.name} Configuration
          </DialogTitle>
          <DialogDescription>Manage API keys, webhooks, and integration settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={config.api_key || ""}
                  onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                  placeholder="Enter API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>API Secret</Label>
              <Input
                type="password"
                value={config.api_secret || ""}
                onChange={(e) => setConfig({ ...config, api_secret: e.target.value })}
                placeholder="Enter API secret"
              />
            </div>

            <div className="space-y-2">
              <Label>Base URL</Label>
              <Input
                value={config.base_url || ""}
                onChange={(e) => setConfig({ ...config, base_url: e.target.value })}
                placeholder="https://api.example.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync data</p>
              </div>
              <Switch
                checked={config.sync_enabled || false}
                onCheckedChange={(checked) => setConfig({ ...config, sync_enabled: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTest} disabled={testing} variant="outline" className="flex-1 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                {testing ? "Testing..." : "Test Connection"}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save Configuration
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4 mt-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <Webhook className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Webhook Endpoint</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure webhook URL to receive real-time events
                  </p>
                  <Input
                    value={config.webhook_url || ""}
                    onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
                    placeholder="https://your-domain.com/webhooks"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Secret
                    </Button>
                    <Button variant="outline" size="sm">
                      Test Webhook
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              {["user.created", "user.updated", "data.synced", "error.occurred"].map((event) => (
                <div key={event} className="flex items-center justify-between py-2">
                  <span className="text-sm">{event}</span>
                  <Switch
                    checked={config.webhook_events?.includes(event) || false}
                    onCheckedChange={(checked) => {
                      const events = config.webhook_events || []
                      setConfig({
                        ...config,
                        webhook_events: checked ? [...events, event] : events.filter((e: string) => e !== event),
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4 mt-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Health Status</h4>
                <Badge variant={integration.status === "active" ? "default" : "secondary"}>{integration.status}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <span className="font-medium">{integration.health_score}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="font-medium">
                    {integration.last_sync_at ? new Date(integration.last_sync_at).toLocaleString() : "Never"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Calls (30d)</span>
                  <span className="font-medium">{integration.usage_metrics?.api_calls || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                  <span className="font-medium">{integration.usage_metrics?.error_rate || 0}%</span>
                </div>
              </div>

              {integration.usage_metrics?.error_rate > 5 && (
                <div className="mt-4 flex items-start gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">High Error Rate Detected</p>
                    <p className="text-muted-foreground">Consider reviewing your API credentials and configuration</p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
