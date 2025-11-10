"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { updateIntegration, testIntegration } from "@/app/(dashboard)/admin/integrations/actions"
import { toast } from "sonner"
import { TestTube, Settings } from "lucide-react"

interface Integration {
  id: string
  name: string
  provider: string
  enabled: boolean
  status: string
  last_sync?: string
}

interface IntegrationsTableProps {
  integrations: Integration[]
}

export function IntegrationsTable({ integrations }: IntegrationsTableProps) {
  const [testing, setTesting] = useState<string | null>(null)

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await updateIntegration(id, { enabled })
      toast.success(enabled ? "Integration enabled" : "Integration disabled")
    } catch (error) {
      toast.error("Failed to update integration")
      console.error(error)
    }
  }

  const handleTest = async (id: string) => {
    setTesting(id)
    try {
      const result = await testIntegration(id)
      toast.success(result.message)
    } catch (error) {
      toast.error("Integration test failed")
      console.error(error)
    } finally {
      setTesting(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium">{integration.name}</TableCell>
              <TableCell>{integration.provider}</TableCell>
              <TableCell>
                <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                  {integration.status}
                </Badge>
              </TableCell>
              <TableCell>
                {integration.last_sync ? new Date(integration.last_sync).toLocaleDateString() : "Never"}
              </TableCell>
              <TableCell>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(integration.id)}
                    disabled={testing === integration.id}
                  >
                    <TestTube className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
