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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTenant } from "@/app/(dashboard)/tenant/directory/actions"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CreateTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTenantDialog({ open, onOpenChange }: CreateTenantDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    region: "",
    timezone: "",
  })
  const router = useRouter()

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required")
      return
    }

    setLoading(true)
    try {
      const result = await createTenant(formData)
      if (result.ok) {
        toast.success("Tenant created successfully!")
        onOpenChange(false)
        if (result.redirect) {
          router.push(result.redirect)
        } else {
          router.refresh()
        }
      } else {
        toast.error(result.error || "Failed to create tenant")
      }
    } catch (error) {
      console.error("[v0] Create tenant error:", error)
      toast.error("Failed to create tenant")
    } finally {
      setLoading(false)
    }
  }

  const handleSlugify = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, name, slug })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-black/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Tenant</DialogTitle>
          <DialogDescription className="text-white/60">
            Set up a new organization. You'll be assigned as the admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Organization Name
            </Label>
            <Input
              id="name"
              placeholder="Acme Corporation"
              value={formData.name}
              onChange={(e) => handleSlugify(e.target.value)}
              className="border-white/10 bg-white/5 backdrop-blur-xl focus-visible:ring-[#8B5CF6]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-white">
              Slug
            </Label>
            <Input
              id="slug"
              placeholder="acme-corp"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="border-white/10 bg-white/5 font-mono backdrop-blur-xl focus-visible:ring-[#8B5CF6]"
            />
            <p className="text-xs text-white/40">Lowercase letters, numbers, and hyphens only. Used in URLs.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-white">
                Region
              </Label>
              <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                <SelectTrigger className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east">US East</SelectItem>
                  <SelectItem value="us-west">US West</SelectItem>
                  <SelectItem value="eu-west">EU West</SelectItem>
                  <SelectItem value="ap-south">AP South</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-white">
                Timezone
              </Label>
              <Select value={formData.timezone} onValueChange={(v) => setFormData({ ...formData, timezone: v })}>
                <SelectTrigger className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Kolkata">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/20">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !formData.name || !formData.slug}
            className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Tenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
