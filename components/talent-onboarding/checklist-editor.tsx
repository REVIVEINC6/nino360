"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ChecklistItem {
  key: string
  label: string
  description?: string
  kind: string
  owner_role: string
  due_days: number
  sla_hours: number
  meta?: Record<string, any>
}

interface ChecklistEditorProps {
  initialData?: {
    name: string
    description?: string
    items: ChecklistItem[]
  }
  onSave?: (data: any) => void
  onCancel?: () => void
}

export function ChecklistEditor({ initialData, onSave, onCancel }: ChecklistEditorProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [items, setItems] = useState<ChecklistItem[]>(initialData?.items || [])

  const addItem = () => {
    setItems([
      ...items,
      {
        key: "",
        label: "",
        kind: "task",
        owner_role: "hr",
        due_days: 0,
        sla_hours: 24,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSave = () => {
    onSave?.({ name, description, items })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Checklist Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Checklist Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Engineering New Hire"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this checklist..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist Items</CardTitle>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />

                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Key</Label>
                        <Input
                          value={item.key}
                          onChange={(e) => updateItem(index, "key", e.target.value)}
                          placeholder="e.g., welcome_email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateItem(index, "label", e.target.value)}
                          placeholder="e.g., Send Welcome Email"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Kind</Label>
                        <Select value={item.kind} onValueChange={(value) => updateItem(index, "kind", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="task">Task</SelectItem>
                            <SelectItem value="form">Form</SelectItem>
                            <SelectItem value="approval">Approval</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="provision">Provision</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Owner Role</Label>
                        <Select
                          value={item.owner_role}
                          onValueChange={(value) => updateItem(index, "owner_role", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="candidate">Candidate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Due Days</Label>
                        <Input
                          type="number"
                          value={item.due_days}
                          onChange={(e) => updateItem(index, "due_days", Number.parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No items yet. Click "Add Item" to get started.</div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500">
          Save Checklist
        </Button>
      </div>
    </div>
  )
}
