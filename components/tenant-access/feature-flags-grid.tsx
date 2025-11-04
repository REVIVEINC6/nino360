"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import { setFlags } from "@/app/(app)/tenant/access/actions"
import { toast } from "sonner"

interface FeatureFlagsGridProps {
  context: any
  onUpdate: () => void
}

export function FeatureFlagsGrid({ context }: FeatureFlagsGridProps) {
  const [search, setSearch] = useState("")
  const [flags, setFlagsState] = useState<Record<string, boolean>>({})

  const canWrite = context.can.flagsWrite

  const filteredFlags = context.featureFlags.filter((f: any) => f.key.toLowerCase().includes(search.toLowerCase()))

  async function handleToggle(key: string, enabled: boolean) {
    const result = await setFlags({ flags: { [key]: enabled } })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Feature flag updated")
      setFlagsState((prev) => ({ ...prev, [key]: enabled }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Feature Flags</h2>
        <Input
          placeholder="Search flags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFlags.map((flag: any) => (
          <Card key={flag.key} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{flag.key}</span>
                  {flag.planLocked && (
                    <Badge variant="secondary">
                      <Lock className="mr-1 h-3 w-3" />
                      Plan Locked
                    </Badge>
                  )}
                </div>
              </div>
              <Switch
                checked={flags[flag.key] ?? flag.enabled}
                onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                disabled={!canWrite || flag.planLocked}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
