"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { setPermission } from "@/app/(app)/tenant/access/actions"
import { toast } from "sonner"

interface PermMatrixProps {
  context: any
  onUpdate: () => void
}

export function PermMatrix({ context }: PermMatrixProps) {
  const [search, setSearch] = useState("")
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({})

  const canWrite = context.can.permsWrite

  const filteredPermissions = context.permissions.filter((p: any) => p.key.toLowerCase().includes(search.toLowerCase()))

  async function handleToggle(roleId: string, permKey: string, allowed: boolean) {
    const result = await setPermission({ roleId, permissionKey: permKey, allowed })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Permission updated")
      setMatrix((prev) => ({
        ...prev,
        [roleId]: { ...prev[roleId], [permKey]: allowed },
      }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Permissions Matrix</h2>
        <Input
          placeholder="Search permissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 bg-background p-4 text-left">Permission</th>
              {context.roles.map((role: any) => (
                <th key={role.id} className="p-4 text-center">
                  <div className="text-sm font-medium">{role.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map((perm: any) => (
              <tr key={perm.key} className="border-b">
                <td className="sticky left-0 bg-background p-4">
                  <div className="text-sm font-medium">{perm.key}</div>
                  <div className="text-xs text-muted-foreground">{perm.description}</div>
                </td>
                {context.roles.map((role: any) => (
                  <td key={role.id} className="p-4 text-center">
                    <Checkbox
                      checked={matrix[role.id]?.[perm.key] ?? false}
                      onCheckedChange={(checked) => handleToggle(role.id, perm.key, checked as boolean)}
                      disabled={!canWrite || role.is_system}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
