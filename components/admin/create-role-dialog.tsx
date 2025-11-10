"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { createRole } from "@/app/(dashboard)/admin/actions/roles"

interface Permission {
  id: string
  key: string
  description?: string
}

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permissions: Permission[]
  onSuccess: (role: any) => void
}

export function CreateRoleDialog({ open, onOpenChange, permissions, onSuccess }: CreateRoleDialogProps) {
  const [key, setKey] = useState("")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createRole({
        key,
        label,
        description,
        permissions: selectedPermissions,
      })

      toast({
        title: "Success",
        description: "Role created successfully",
      })

      onSuccess(result.role)
      setKey("")
      setLabel("")
      setDescription("")
      setSelectedPermissions([])
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Define a new role with specific permissions</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Role Key *</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z_]/g, ""))}
              placeholder="e.g., project_manager"
              required
            />
            <p className="text-xs text-muted-foreground">Lowercase letters and underscores only</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Role Label *</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Project Manager"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role's responsibilities..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions (Optional)</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-3">
                {permissions.map((perm) => (
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
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
