"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plug,
  Brain,
  Search,
  Settings,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  TestTube,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  getTenantIntegrations,
  disconnectIntegration,
  testIntegration,
  getIntegrationStats,
  type TenantIntegration,
} from "@/app/(dashboard)/tenant/integrations/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export function IntegrationsHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [integrations, setIntegrations] = useState<TenantIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, connected: 0, disconnected: 0, healthy: 0 })
  const [testing, setTesting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [integrationsData, statsData] = await Promise.all([getTenantIntegrations(), getIntegrationStats()])
      setIntegrations(integrationsData)
      setStats(statsData)
    } catch (error) {
      console.error("[v0] Failed to load integrations:", error)
      toast({
        title: "Error",
        description: "Failed to load integrations data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleTest(id: string) {
    setTesting(id)
    try {
      const result = await testIntegration(id)
      toast({
        title: result.success ? "Test Successful" : "Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test integration",
        variant: "destructive",
      })
    } finally {
      setTesting(null)
    }
  }

  async function handleDisconnect(id: string) {
    try {
      await disconnectIntegration(id)
      toast({
        title: "Integration Disconnected",
        description: "Integration has been disconnected successfully",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect integration",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />
  }

  const filteredIntegrations = integrations.filter((integration) =>
    integration.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Configured services</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connected}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disconnected</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.disconnected}</div>
            <p className="text-xs text-muted-foreground">Inactive services</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.healthy / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall health</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connectors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card">
          <TabsTrigger value="connectors">
            <Plug className="mr-2 h-4 w-4" />
            Connectors
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="mr-2 h-4 w-4" />
            AI Providers
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="mr-2 h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Integration Connectors
              </CardTitle>
              <CardDescription>Connect external services and applications with blockchain verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="glass-card border-white/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium capitalize">{integration.provider.replace(/_/g, " ")}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                              {integration.status}
                            </Badge>
                            {integration.health_status && (
                              <Badge
                                variant={
                                  integration.health_status === "healthy"
                                    ? "default"
                                    : integration.health_status === "degraded"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {integration.health_status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {integration.status === "connected" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : integration.status === "error" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      {integration.usage_count !== undefined && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <TrendingUp className="h-3 w-3" />
                          <span>{integration.usage_count.toLocaleString()} API calls (30d)</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 glass-button bg-transparent"
                              onClick={() => handleTest(integration.id)}
                              disabled={testing === integration.id}
                            >
                              <TestTube className="mr-2 h-3 w-3" />
                              {testing === integration.id ? "Testing..." : "Test"}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration.id)}>
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="w-full glass-button">
                            Reconnect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredIntegrations.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No integrations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Provider Configuration
              </CardTitle>
              <CardDescription>Configure AI models and providers for intelligent features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations
                  .filter(
                    (i) =>
                      i.provider.includes("openai") ||
                      i.provider.includes("anthropic") ||
                      i.provider.includes("google") ||
                      i.provider.includes("ai"),
                  )
                  .map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between p-4 border rounded-lg glass-card"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium capitalize">{provider.provider.replace(/_/g, " ")}</p>
                          <Badge variant={provider.status === "connected" ? "default" : "secondary"}>
                            {provider.status}
                          </Badge>
                        </div>
                        {provider.last_tested_at && (
                          <p className="text-sm text-muted-foreground">
                            Last tested: {new Date(provider.last_tested_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch checked={provider.status === "connected"} />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                {integrations.filter(
                  (i) =>
                    i.provider.includes("openai") ||
                    i.provider.includes("anthropic") ||
                    i.provider.includes("google") ||
                    i.provider.includes("ai"),
                ).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No AI providers configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Blockchain Audit Trail
                </div>
              </CardTitle>
              <CardDescription>All integration actions are logged with cryptographic hash verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Audit trail feature</p>
                <p className="text-sm text-muted-foreground">
                  Select an integration to view its complete audit history
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
