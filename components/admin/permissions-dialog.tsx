"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getRoleDetails, assignPermissions } from "@/app/(dashboard)/admin/actions/roles"

interface Role {
  id: string
  key: string
  label: string
}

interface Permission {
  id: string
  key: string
  description?: string
}

interface PermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role
  permissions: Permission[]
  onSuccess: () => void
}

export function PermissionsDialog({ open, onOpenChange, role, permissions, onSuccess }: PermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadRolePermissions()
    }
  }, [open, role.id])

  const loadRolePermissions = async () => {
    setFetching(true)
    try {
      const details = await getRoleDetails(role.id)
      const permIds = details.permissions.map((p: any) => p.permission_id)
      setSelectedPermissions(permIds)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await assignPermissions({
        roleId: role.id,
        permissionIds: selectedPermissions,
      })

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      })

      onSuccess()
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

  // Group permissions by module
  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      const module = perm.key.split(".")[0]
      if (!acc[module]) acc[module] = []
      acc[module].push(perm)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Permissions: {role.label}</DialogTitle>
          <DialogDescription>Select permissions to grant to this role</DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="py-8 text-center text-muted-foreground">Loading permissions...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {module}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const modulePermIds = perms.map((p) => p.id)
                          const allSelected = modulePermIds.every((id) => selectedPermissions.includes(id))
                          if (allSelected) {
                            setSelectedPermissions(selectedPermissions.filter((id) => !modulePermIds.includes(id)))
                          } else {
                            setSelectedPermissions([...new Set([...selectedPermissions, ...modulePermIds])])
                          }
                        }}
                      >
                        {perms.every((p) => selectedPermissions.includes(p.id)) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <div className="space-y-2 pl-4">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={perm.id}
                            checked={selectedPermissions.includes(perm.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPermissions([...selectedPermissions, perm.id])
                              } else {
                                setSelectedPermissions(selectedPermissions.filter((id) => id !== perm.id))
                              }
                            }}
                          />
                          <div className="grid gap-1">
                            <Label htmlFor={perm.id} className="text-sm font-medium cursor-pointer">
                              {perm.key}
                            </Label>
                            {perm.description && <p className="text-xs text-muted-foreground">{perm.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {selectedPermissions.length} of {permissions.length} permissions selected
              </span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Permissions"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
