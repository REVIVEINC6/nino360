"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plug, CheckCircle2, RefreshCw } from "lucide-react"
import { getIntegrations, connectIntegration, disconnectIntegration } from "@/app/(app)/tenant/integrations/actions"

export function TenantIntegrationsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [integrations, setIntegrations] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setLoading(true)
    const data = await getIntegrations()
    setIntegrations(data)
    setLoading(false)
  }

  const handleConnect = async (id: string) => {
    await connectIntegration(id)
    loadIntegrations()
  }

  const handleDisconnect = async (id: string) => {
    await disconnectIntegration(id)
    loadIntegrations()
  }

  if (loading || !integrations) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-muted-foreground mt-2">Connect third-party services to enhance your workspace</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connected">Connected ({integrations.connected.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({integrations.available.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {integrations.connected.map((integration: any) => (
            <Card key={integration.id} className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Plug className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last synced: {new Date(integration.lastSync).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDisconnect(integration.id)}>
                    Disconnect
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {integrations.available.map((integration: any) => (
            <Card key={integration.id} className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <Plug className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.category}</p>
                    <p className="text-sm text-muted-foreground mt-2">{integration.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleConnect(integration.id)}
                >
                  Connect
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
