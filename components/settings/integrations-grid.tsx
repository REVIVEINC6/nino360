"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check } from "lucide-react"
import {
  listProviders,
  listConnectedIntegrations,
  connectProvider,
  disconnectProvider,
} from "@/app/(dashboard)/settings/actions/integrations"

export function IntegrationsGrid() {
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<any[]>([])
  const [connected, setConnected] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const [providersData, connectedData] = await Promise.all([listProviders(), listConnectedIntegrations()])
        setProviders(providersData)
        setConnected(connectedData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toast])

  async function handleConnect(providerId: string) {
    try {
      // In production, this would initiate OAuth flow
      // For now, we'll use a mock token
      await connectProvider(providerId, `mock_token_${providerId}`)

      toast({
        title: "Success",
        description: "Integration connected successfully",
      })

      // Refresh connected list
      const connectedData = await listConnectedIntegrations()
      setConnected(connectedData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleDisconnect(providerId: string) {
    try {
      await disconnectProvider(providerId)

      toast({
        title: "Success",
        description: "Integration disconnected successfully",
      })

      // Refresh connected list
      const connectedData = await listConnectedIntegrations()
      setConnected(connectedData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {providers.map((provider) => {
        const isConnected = connected.some((c) => c.provider === provider.id)
        const integration = connected.find((c) => c.provider === provider.id)

        return (
          <Card key={provider.id} className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{provider.icon}</div>
                <div>
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              </div>
              {isConnected && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="h-4 w-4" />
                  Connected
                </div>
              )}
            </div>

            {isConnected && integration && (
              <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground">
                  Connected on {new Date(integration.created_at).toLocaleDateString()}
                </p>
                {integration.token_expires_at && (
                  <p className="text-xs text-muted-foreground">
                    Token expires: {new Date(integration.token_expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {isConnected ? (
              <Button variant="outline" onClick={() => handleDisconnect(provider.id)} className="w-full">
                Disconnect
              </Button>
            ) : (
              <Button onClick={() => handleConnect(provider.id)} className="w-full neon">
                Connect
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}
