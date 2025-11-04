"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plug, Brain, Search, Settings, CheckCircle2, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function IntegrationsHub() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Tabs defaultValue="connectors" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="connectors">
          <Plug className="mr-2 h-4 w-4" />
          Connectors
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Brain className="mr-2 h-4 w-4" />
          AI Providers
        </TabsTrigger>
      </TabsList>

      <TabsContent value="connectors" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Integration Connectors</h3>
            <p className="text-sm text-muted-foreground">Connect external services and applications</p>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Slack", category: "Communication", connected: true },
              { name: "Microsoft Teams", category: "Communication", connected: false },
              { name: "Gmail", category: "Email", connected: true },
              { name: "Outlook", category: "Email", connected: true },
              { name: "Zoom", category: "Video", connected: true },
              { name: "DocuSign", category: "Documents", connected: false },
              { name: "Stripe", category: "Payments", connected: true },
              { name: "QuickBooks", category: "Accounting", connected: false },
              { name: "Salesforce", category: "CRM", connected: false },
            ].map((integration) => (
              <Card key={integration.name} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.category}</p>
                  </div>
                  {integration.connected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Settings className="mr-2 h-3 w-3" />
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="w-full">
                      Connect
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="ai" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">AI Provider Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure AI models and providers for intelligent features</p>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "OpenAI GPT-4",
                provider: "OpenAI",
                usage: "Primary LLM",
                enabled: true,
              },
              {
                name: "Claude 3",
                provider: "Anthropic",
                usage: "Backup LLM",
                enabled: true,
              },
              {
                name: "Gemini Pro",
                provider: "Google",
                usage: "Analytics",
                enabled: false,
              },
              {
                name: "Llama 3",
                provider: "Meta",
                usage: "On-premise",
                enabled: false,
              },
            ].map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium">{provider.name}</p>
                    <Badge variant="secondary">{provider.provider}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.usage}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch checked={provider.enabled} />
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">API Usage This Month</p>
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <p className="text-2xl font-bold">1.2M</p>
                <p className="text-xs text-muted-foreground">Tokens used</p>
              </div>
              <div>
                <p className="text-2xl font-bold">$245</p>
                <p className="text-xs text-muted-foreground">Cost</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
