"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { importCandidatesFromCsv } from "@/app/(dashboard)/talent/candidates/actions"
import { toast } from "sonner"

interface ImportCsvDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ImportCsvDialog({ open, onOpenChange, onSuccess }: ImportCsvDialogProps) {
  const [csvUrl, setCsvUrl] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Candidates-gjf9X75LGBOHpMtz9M4rycrBxw7Ild.csv",
  )
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors?: any[] } | null>(null)

  const handleImport = async () => {
    if (!csvUrl) {
      toast.error("Please enter a CSV URL")
      return
    }

    setImporting(true)
    setResult(null)

    try {
      const response = await importCandidatesFromCsv(csvUrl)

      if (response.success) {
        setResult({ imported: response.imported || 0, errors: response.errors })
        toast.success(`Successfully imported ${response.imported} candidates`)
        onSuccess?.()
      } else {
        toast.error(response.error || "Failed to import candidates")
      }
    } catch (error) {
      console.error("[v0] Import error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Candidates from CSV</DialogTitle>
          <DialogDescription>
            Import candidate data from a CSV file. The file should match the expected format with headers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="csv-url">CSV File URL</Label>
            <Input
              id="csv-url"
              placeholder="https://example.com/candidates.csv"
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              disabled={importing}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your CSV file. The file should be publicly accessible.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Expected CSV Format</p>
                <p className="text-muted-foreground">
                  Your CSV should include headers like: Candidate ID, First Name, Last Name, Email, Phone, Mobile, Job
                  Title, Work Authorization, Years of Experience, City, State, Skills, LinkedIn Url, etc.
                </p>
              </div>
            </div>
          </div>

          {result && (
            <div className="rounded-lg border bg-green-500/10 border-green-500/20 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-green-600">Import Successful</p>
                  <p className="text-muted-foreground">
                    Successfully imported {result.imported} candidates into your talent pool.
                  </p>
                  {result.errors && result.errors.length > 0 && (
                    <p className="text-yellow-600 text-xs mt-2">
                      {result.errors.length} rows had warnings or were skipped.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={importing || !csvUrl}>
            {importing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
