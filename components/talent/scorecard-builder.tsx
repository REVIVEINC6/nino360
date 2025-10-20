"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface ScorecardBuilderProps {
  initialData?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function ScorecardBuilder({ initialData, onSave, onCancel }: ScorecardBuilderProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [dimensions, setDimensions] = useState<any[]>(
    initialData?.dimensions || [
      {
        key: "technical_skills",
        label: "Technical Skills",
        scale: 5,
        anchors: ["Poor", "Below Average", "Average", "Above Average", "Excellent"],
      },
    ],
  )

  const handleAddDimension = () => {
    setDimensions([
      ...dimensions,
      {
        key: `dimension_${dimensions.length + 1}`,
        label: "",
        scale: 5,
        anchors: ["Poor", "Below Average", "Average", "Above Average", "Excellent"],
      },
    ])
  }

  const handleUpdateDimension = (index: number, field: string, value: any) => {
    const newDimensions = [...dimensions]
    newDimensions[index] = { ...newDimensions[index], [field]: value }
    setDimensions(newDimensions)
  }

  const handleUpdateAnchor = (dimIndex: number, anchorIndex: number, value: string) => {
    const newDimensions = [...dimensions]
    const newAnchors = [...newDimensions[dimIndex].anchors]
    newAnchors[anchorIndex] = value
    newDimensions[dimIndex] = { ...newDimensions[dimIndex], anchors: newAnchors }
    setDimensions(newDimensions)
  }

  const handleDeleteDimension = (index: number) => {
    setDimensions(dimensions.filter((_, i) => i !== index))
  }

  const handleMoveDimension = (index: number, direction: "up" | "down") => {
    const newDimensions = [...dimensions]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newDimensions.length) return
    ;[newDimensions[index], newDimensions[targetIndex]] = [newDimensions[targetIndex], newDimensions[index]]
    setDimensions(newDimensions)
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert("Scorecard name is required")
      return
    }

    if (dimensions.length === 0) {
      alert("At least one dimension is required")
      return
    }

    for (const dim of dimensions) {
      if (!dim.label.trim()) {
        alert("All dimensions must have a label")
        return
      }
    }

    onSave({ name, dimensions })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="scorecard-name">Scorecard Name *</Label>
        <Input
          id="scorecard-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Technical Interview Scorecard"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Evaluation Dimensions</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddDimension}>
            <Plus className="mr-2 h-4 w-4" />
            Add Dimension
          </Button>
        </div>

        {dimensions.map((dimension, dimIndex) => (
          <Card key={dimIndex} className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDimension(dimIndex, "up")}
                  disabled={dimIndex === 0}
                  className="h-6 w-6 p-0"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDimension(dimIndex, "down")}
                  disabled={dimIndex === dimensions.length - 1}
                  className="h-6 w-6 p-0"
                >
                  ↓
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Dimension {dimIndex + 1}</Badge>
                  <Input
                    value={dimension.label}
                    onChange={(e) => handleUpdateDimension(dimIndex, "label", e.target.value)}
                    placeholder="e.g. Problem Solving, Communication"
                    className="flex-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Rating Scale (1-5)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {dimension.anchors.map((anchor: string, anchorIndex: number) => (
                      <div key={anchorIndex} className="space-y-1">
                        <div className="text-center text-xs font-medium text-muted-foreground">{anchorIndex + 1}</div>
                        <Input
                          value={anchor}
                          onChange={(e) => handleUpdateAnchor(dimIndex, anchorIndex, e.target.value)}
                          placeholder={`Level ${anchorIndex + 1}`}
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteDimension(dimIndex)}
                className="mt-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}

        {dimensions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No dimensions added yet. Click "Add Dimension" to get started.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Scorecard
        </Button>
      </div>
    </div>
  )
}
