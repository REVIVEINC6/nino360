"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface ExportCRMDialogProps {
  exportAction: (params: {
    format: string
    includeContacts: boolean
    includeLeads: boolean
    includeOpportunities: boolean
  }) => Promise<{ success: boolean; data?: string; error?: string }>
}

export function ExportCRMDialog({ exportAction }: ExportCRMDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [format, setFormat] = useState("csv")
  const [includeContacts, setIncludeContacts] = useState(true)
  const [includeLeads, setIncludeLeads] = useState(true)
  const [includeOpportunities, setIncludeOpportunities] = useState(true)

  function handleExport() {
    startTransition(async () => {
      const result = await exportAction({
        format,
        includeContacts,
        includeLeads,
        includeOpportunities,
      })

      if (result.success) {
        toast.success("Export started successfully")
        // Trigger download
        const blob = new Blob([result.data || ""], {
          type: format === "csv" ? "text/csv" : "application/json",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `crm-export-${new Date().toISOString().split("T")[0]}.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
        setOpen(false)
      } else {
        toast.error(result.error || "Failed to export data")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export CRM Data</DialogTitle>
          <DialogDescription>Choose the format and data to export from your CRM system.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="font-normal">
                  CSV (Comma Separated Values)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="font-normal">
                  JSON (JavaScript Object Notation)
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label>Include Data</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contacts"
                  checked={includeContacts}
                  onCheckedChange={(checked) => setIncludeContacts(checked as boolean)}
                />
                <Label htmlFor="contacts" className="font-normal">
                  Contacts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="leads"
                  checked={includeLeads}
                  onCheckedChange={(checked) => setIncludeLeads(checked as boolean)}
                />
                <Label htmlFor="leads" className="font-normal">
                  Leads
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="opportunities"
                  checked={includeOpportunities}
                  onCheckedChange={(checked) => setIncludeOpportunities(checked as boolean)}
                />
                <Label htmlFor="opportunities" className="font-normal">
                  Opportunities
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isPending}>
            {isPending ? "Exporting..." : "Export Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
