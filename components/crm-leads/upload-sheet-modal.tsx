"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function UploadSheetModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return toast.error("Please choose a file")
    const form = new FormData()
    form.set("file", file)
    form.set("source", "import")
    setLoading(true)
    try {
      const res = await fetch("/api/crm/leads/import", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || "Import failed")
      toast.success(`Imported ${json.inserted} leads`)
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Import failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Upload file</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls,.txt,.docx,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">Supported: CSV, XLSX, TXT, DOCX, PDF</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || loading}>
              {loading ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
