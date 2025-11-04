"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requestAccess } from "@/app/(dashboard)/tenant/directory/actions"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"

interface RequestAccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestAccessDialog({ open, onOpenChange }: RequestAccessDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tenantSlug: "",
    message: "",
  })

  const handleRequest = async () => {
    if (!formData.tenantSlug) {
      toast.error("Tenant slug is required")
      return
    }

    setLoading(true)
    try {
      const result = await requestAccess(formData)
      if (result.ok) {
        toast.success("Access request sent successfully!")
        onOpenChange(false)
        setFormData({ tenantSlug: "", message: "" })
      } else {
        toast.error(result.error || "Failed to request access")
      }
    } catch (error) {
      console.error("[v0] Request access error:", error)
      toast.error("Failed to request access")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-black/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5 text-[#8B5CF6]" />
            Request Access to Tenant
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Enter the tenant slug to request access. The tenant admin will review your request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tenantSlug" className="text-white">
              Tenant Slug
            </Label>
            <Input
              id="tenantSlug"
              placeholder="acme-corp"
              value={formData.tenantSlug}
              onChange={(e) => setFormData({ ...formData, tenantSlug: e.target.value })}
              className="border-white/10 bg-white/5 font-mono backdrop-blur-xl focus-visible:ring-[#8B5CF6]"
            />
            <p className="text-xs text-white/40">
              The unique identifier for the organization (e.g., acme-corp, tech-startup)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Hi, I'd like to join your organization..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border-white/10 bg-white/5 backdrop-blur-xl focus-visible:ring-[#8B5CF6]"
              rows={4}
            />
            <p className="text-xs text-white/40">Introduce yourself and explain why you want to join</p>
          </div>

          <div className="rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 p-3">
            <p className="text-xs text-white/80">
              💡 <strong>Tip:</strong> Make sure you have the correct tenant slug. You can ask the organization admin
              for this information.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setFormData({ tenantSlug: "", message: "" })
            }}
            className="border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequest}
            disabled={loading || !formData.tenantSlug}
            className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
