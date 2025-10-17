"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
  filters: any
}

export function ExportDialog({ open, onOpenChange, selectedIds, filters }: ExportDialogProps) {
  const [exportType, setExportType] = useState<"selected" | "filtered" | "all">("selected")
  const [format, setFormat] = useState<"csv" | "xlsx">("csv")
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual export functionality
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success(`Exported ${exportType} candidates as ${format.toUpperCase()}`)
      onOpenChange(false)
    } catch (error) {
      toast.error("Export failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Candidates</DialogTitle>
          <DialogDescription>Choose what to export and in which format</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Export Scope</Label>
            <RadioGroup value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" disabled={selectedIds.length === 0} />
                <Label htmlFor="selected" className="cursor-pointer">
                  Selected candidates ({selectedIds.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="cursor-pointer">
                  Filtered results
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">
                  All candidates
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="cursor-pointer">
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx" className="cursor-pointer">
                  Excel (XLSX)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
