"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { saveBrandingSettings } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface BrandingStepProps {
  tenantId: string
  onComplete: () => void
}

export function BrandingStep({ tenantId, onComplete }: BrandingStepProps) {
  const { toast } = useToast()
  const [branding, setBranding] = useState({
    logo_url: "",
    favicon_url: "",
    primary_color: "#8B5CF6",
    secondary_color: "#D0FF00",
    accent_color: "#10b981",
    dark_mode: true,
  })

  const handleSave = async () => {
    try {
      await saveBrandingSettings({
        tenant_id: tenantId,
        ...branding,
      })
      toast({
        title: "Success",
        description: "Branding settings saved successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save branding settings",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">Logo URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/logo.png"
            value={branding.logo_url}
            onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Favicon URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/favicon.ico"
            value={branding.favicon_url}
            onChange={(e) => setBranding({ ...branding, favicon_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={branding.primary_color}
                onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={branding.primary_color}
                onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={branding.secondary_color}
                onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={branding.secondary_color}
                onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={branding.accent_color}
                onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={branding.accent_color}
                onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-white">Dark Mode</Label>
          <Switch
            checked={branding.dark_mode}
            onCheckedChange={(checked) => setBranding({ ...branding, dark_mode: checked })}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Save Branding
      </button>
    </div>
  )
}
