"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getRolePermissions, updateRolePermission } from "@/app/(dashboard)/admin/actions/roles"

interface Role {
  id: string
  key: string
  name: string
  description?: string
}

interface Permission {
  role_id: string
  module: string
  action: string
  granted: boolean
}

const MODULES = [
  { key: "admin", name: "Admin" },
  { key: "tenant", name: "Tenant" },
  { key: "crm", name: "CRM" },
  { key: "talent", name: "Talent" },
  { key: "bench", name: "Bench" },
  { key: "finance", name: "Finance" },
  { key: "reports", name: "Reports" },
]

const ACTIONS = ["read", "create", "update", "delete"]

export function PermissionMatrix({ roles }: { roles: Role[] }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!selectedRole) return

    async function loadPermissions() {
      try {
        const data = await getRolePermissions(selectedRole!.id)
        setPermissions(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    }

    loadPermissions()
  }, [selectedRole])

  const isGranted = (module: string, action: string) => {
    const perm = permissions.find((p) => p.module === module && p.action === action)
    return perm?.granted ?? false
  }

  const togglePermission = (module: string, action: string, granted: boolean) => {
    setPermissions((prev) => {
      const existing = prev.find((p) => p.module === module && p.action === action)
      if (existing) {
        return prev.map((p) => (p.module === module && p.action === action ? { ...p, granted } : p))
      } else {
        return [...prev, { role_id: selectedRole!.id, module, action, granted }]
      }
    })
    setHasChanges(true)
  }

  const savePermissions = async () => {
    if (!selectedRole) return

    setLoading(true)
    try {
      // Save all permissions
      for (const perm of permissions) {
        await updateRolePermission({
          role_id: selectedRole.id,
          module: perm.module,
          action: perm.action,
          granted: perm.granted,
        })
      }

      toast({
        title: "Success",
        description: `Permissions saved for ${selectedRole.name}`,
      })
      setHasChanges(false)
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

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Roles List */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Select a role to edit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Role
          </Button>

          {roles.map((role) => (
            <Button
              key={role.id}
              variant={selectedRole?.id === role.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedRole(role)
                setHasChanges(false)
              }}
            >
              {role.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card className="col-span-9">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions for {selectedRole?.name || "Select a role"}</CardTitle>
              <CardDescription>Toggle permissions for each module and action</CardDescription>
            </div>
            {hasChanges && (
              <Button onClick={savePermissions} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Module</th>
                    {ACTIONS.map((action) => (
                      <th key={action} className="text-center py-2 px-4 capitalize">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((module) => (
                    <tr key={module.key} className="border-b">
                      <td className="py-3 px-4 font-medium">{module.name}</td>
                      {ACTIONS.map((action) => (
                        <td key={action} className="text-center py-3 px-4">
                          <Checkbox
                            checked={isGranted(module.key, action)}
                            onCheckedChange={(checked) => {
                              togglePermission(module.key, action, checked as boolean)
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Select a role to view and edit permissions</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
