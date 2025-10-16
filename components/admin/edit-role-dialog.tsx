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
import { useToast } from "@/hooks/use-toast"
import { updateRole } from "@/app/(dashboard)/admin/actions/roles"

interface Role {
  id: string
  key: string
  label: string
  description?: string
}

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role
  onSuccess: (role: Role) => void
}

export function EditRoleDialog({ open, onOpenChange, role, onSuccess }: EditRoleDialogProps) {
  const [label, setLabel] = useState(role.label)
  const [description, setDescription] = useState(role.description || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateRole({
        id: role.id,
        label,
        description,
      })

      toast({
        title: "Success",
        description: "Role updated successfully",
      })

      onSuccess({ ...role, label, description })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update role details (key cannot be changed)</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Role Key</Label>
            <Input value={role.key} disabled className="bg-muted" />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
