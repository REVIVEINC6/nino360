"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { saveBranding } from "@/app/(app)/tenant/configuration/actions"
import { toast } from "sonner"

interface BrandingFormProps {
  branding: any
  onSaveStart: () => void
  onSaveComplete: () => void
}

export function BrandingForm({ branding, onSaveStart, onSaveComplete }: BrandingFormProps) {
  const [primaryColor, setPrimaryColor] = useState(branding?.primary_color || "#4F46E5")
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondary_color || "#8B5CF6")
  const [accentColor, setAccentColor] = useState(branding?.accent_color || "#D0FF00")

  const handleSave = async () => {
    try {
      onSaveStart()
      await saveBranding({
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
      })
      toast.success("Branding updated successfully")
      onSaveComplete()
    } catch (error) {
      toast.error("Failed to update branding")
      console.error(error)
    }
  }

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Branding</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your tenant's visual identity</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Preview</Label>
            <div
              className="h-64 rounded-lg p-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <div
                className="px-6 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: accentColor, color: "#000" }}
              >
                Sample Button
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset to Default</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Card>
  )
}
