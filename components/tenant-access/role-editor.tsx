"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface RoleEditorProps {
  mode: "create" | "edit"
  role?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function RoleEditor({ mode, role, onSave, onCancel }: RoleEditorProps) {
  const [key, setKey] = useState(role?.key || "")
  const [name, setName] = useState(role?.name || "")
  const [description, setDescription] = useState(role?.description || "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === "create") {
      onSave({ key, name, description })
    } else {
      onSave({ id: role.id, name, description })
    }
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Role" : "Edit Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "create" && (
            <div>
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="custom_role"
                pattern="[a-z0-9_-]{3,32}"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">3-32 characters, lowercase alphanumeric with _ or -</p>
            </div>
          )}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Custom Role"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Role description..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
