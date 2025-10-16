"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { RoleEditor } from "./role-editor"
import { ConfirmDialog } from "./confirm-dialog"
import { createRole, updateRole, deleteRole } from "@/app/(app)/tenant/access/actions"
import { toast } from "sonner"

interface RolesPanelProps {
  context: any
  onUpdate: () => void
}

export function RolesPanel({ context }: RolesPanelProps) {
  const [editingRole, setEditingRole] = useState<any>(null)
  const [deletingRole, setDeletingRole] = useState<any>(null)
  const [creating, setCreating] = useState(false)

  const canWrite = context.can.rolesWrite

  async function handleCreate(data: any) {
    const result = await createRole(data)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Role created successfully")
      setCreating(false)
      window.location.reload()
    }
  }

  async function handleUpdate(data: any) {
    const result = await updateRole(data)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Role updated successfully")
      setEditingRole(null)
      window.location.reload()
    }
  }

  async function handleDelete() {
    if (!deletingRole) return
    const result = await deleteRole(deletingRole.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Role deleted successfully")
      setDeletingRole(null)
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Roles</h2>
        {canWrite && (
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {context.roles.map((role: any) => (
          <Card key={role.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{role.name}</h3>
                  {role.is_system && <Badge variant="secondary">System</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{role.key}</p>
                {role.description && <p className="mt-2 text-sm">{role.description}</p>}
                <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {role.memberCount} members
                </div>
              </div>
              {canWrite && !role.is_system && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditingRole(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeletingRole(role)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {creating && <RoleEditor mode="create" onSave={handleCreate} onCancel={() => setCreating(false)} />}

      {editingRole && (
        <RoleEditor mode="edit" role={editingRole} onSave={handleUpdate} onCancel={() => setEditingRole(null)} />
      )}

      {deletingRole && (
        <ConfirmDialog
          title="Delete Role"
          description={`Are you sure you want to delete the role "${deletingRole.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRole(null)}
        />
      )}
    </div>
  )
}
