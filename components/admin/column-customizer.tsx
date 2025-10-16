"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Settings2 } from "lucide-react"

interface Column {
  key: string
  label: string
  visible: boolean
}

interface ColumnCustomizerProps {
  columns: Column[]
  onColumnsChange: (columns: Column[]) => void
}

export function ColumnCustomizer({ columns, onColumnsChange }: ColumnCustomizerProps) {
  const [open, setOpen] = useState(false)

  const toggleColumn = (key: string) => {
    const updated = columns.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    onColumnsChange(updated)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-3">Show/Hide Columns</h4>
            <div className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox id={col.key} checked={col.visible} onCheckedChange={() => toggleColumn(col.key)} />
                  <Label htmlFor={col.key} className="text-sm font-normal cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
