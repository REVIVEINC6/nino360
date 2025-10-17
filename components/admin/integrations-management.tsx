"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { IntegrationsTable } from "./integrations-table"
import { listIntegrations } from "@/app/(dashboard)/admin/integrations/actions"
import { Skeleton } from "@/components/ui/skeleton"

export function IntegrationsManagement() {
  const [search, setSearch] = useState("")
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listIntegrations()
        setIntegrations(data)
      } catch (error) {
        console.error("[v0] Failed to load integrations data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[600px] w-full" />
  }

  const filteredIntegrations = integrations.filter((integration: any) =>
    integration.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Provider configurations, API keys, and secrets management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Table */}
      <IntegrationsTable integrations={filteredIntegrations} />
    </div>
  )
}
