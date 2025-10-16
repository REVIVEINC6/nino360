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
import { type TenantListItem, switchTenant } from "@/app/(dashboard)/tenant/directory/actions"
import { ExternalLink, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SwitchTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantListItem
}

export function SwitchTenantDialog({ open, onOpenChange, tenant }: SwitchTenantDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSwitch = async () => {
    setLoading(true)
    try {
      const result = await switchTenant(tenant.id)
      if (result.ok) {
        toast.success(`Switched to ${tenant.name}`)
        onOpenChange(false)
        if (result.redirect) {
          router.push(result.redirect)
          router.refresh()
        }
      } else {
        toast.error(result.error || "Failed to switch tenant")
      }
    } catch (error) {
      console.error("[v0] Switch tenant error:", error)
      toast.error("Failed to switch tenant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-black/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Switch to {tenant.name}?</DialogTitle>
          <DialogDescription className="text-white/60">
            You'll be redirected to the dashboard for this tenant. Your current session will be updated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Tenant:</span>
                <span className="font-medium text-white">{tenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Slug:</span>
                <code className="rounded bg-black/30 px-2 py-1 font-mono text-xs text-[#D0FF00]">{tenant.slug}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Your Role:</span>
                <span className="font-medium text-white">{tenant.role}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">Quick Links:</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/dashboard" className="flex items-center gap-2 text-[#8B5CF6] hover:text-[#A855F7]">
                <ExternalLink className="h-3 w-3" />
                Dashboard
              </a>
              <a href="/tenant/dashboard" className="flex items-center gap-2 text-[#8B5CF6] hover:text-[#A855F7]">
                <ExternalLink className="h-3 w-3" />
                Tenant Dashboard
              </a>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/20">
            Cancel
          </Button>
          <Button
            onClick={handleSwitch}
            disabled={loading}
            className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Switch Tenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
