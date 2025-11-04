"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { importFromLinkedIn } from "@/app/(dashboard)/crm/leads/actions"
import { Linkedin } from "lucide-react"

export function ImportLinkedInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onImport = async () => {
    // basic validation
    if (!isLikelyLinkedInUrl(url)) {
      setError("Please paste a valid LinkedIn profile or search URL.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await importFromLinkedIn(url)
      setLoading(false)
      if (!res?.success) {
        setError(res?.error || "Import failed")
        return
      }
      onOpenChange(false)
    } catch (err: any) {
      setLoading(false)
      setError(err?.message || String(err) || "Import failed")
    }
  }

  function isLikelyLinkedInUrl(u: string) {
    if (!u) return false
    try {
      const parsed = new URL(u)
      return parsed.hostname.includes("linkedin.com")
    } catch (e) {
      // allow bare paths like linkedin.com/in/xyz
      return /linkedin\.com/.test(u)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal" aria-labelledby="import-linkedin-title">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {/* Icon is decorative for screen readers since the title text conveys the meaning */}
              <Linkedin className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span id="import-linkedin-title">Import from LinkedIn</span>
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              onImport()
            }}
          >
            <label htmlFor="linkedin-url" className="sr-only">
              LinkedIn profile or search URL
            </label>
            <Input
              id="linkedin-url"
              placeholder="Paste LinkedIn profile or search URL"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              className="glass-card border-white/20"
              inputMode="url"
              aria-describedby="import-error"
              autoFocus
            />
          {/* Announce errors to assistive tech */}
          <p id="import-error" role="status" aria-live="polite" className="text-sm text-red-600 min-h-[1em]">
            {error || ""}
          </p>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="bg-linear-to-r from-blue-600 to-purple-600">
              {loading ? "Importing..." : "Import"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
