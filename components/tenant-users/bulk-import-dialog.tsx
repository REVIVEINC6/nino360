"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { bulkImportCsv } from "@/app/(app)/tenant/users/actions"
import { toast } from "sonner"

interface BulkImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkImportDialog({ open, onOpenChange }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState<string>("member")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    try {
      const result = await bulkImportCsv(file, role)

      if (result.success) {
        toast.success(`Imported ${result.inserted} users successfully`)
        if (result.duplicates > 0) {
          toast.info(`${result.duplicates} users were already members`)
        }
        if (result.invalid > 0) {
          toast.warning(`${result.invalid} invalid emails were skipped`)
        }
        onOpenChange(false)
        setFile(null)
      } else {
        toast.error(result.error || "Failed to import users")
      }
    } catch (error) {
      toast.error("Failed to import users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">CSV File</label>
            <div className="mt-2 border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>{file ? file.name : "Choose CSV File"}</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">One email per line</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !file}>
              {loading ? "Importing..." : "Import Users"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
