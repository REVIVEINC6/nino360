"use client"

import { useState } from "react"
import { getBranding, saveBranding } from "../actions/branding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Palette } from "lucide-react"

export default function Branding() {
  const [tenantId, setTenantId] = useState("")
  const [branding, setBranding] = useState({
    logo_url: "",
    favicon_url: "",
    primary_color: "#111827",
    secondary_color: "#2563eb",
    accent_color: "#10b981",
    dark_mode: true,
    login_bg_url: "",
    email_brand_header: "",
  })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await getBranding(tenantId)
      if (data) setBranding(data)
    } catch (error) {
      console.error("[v0] Error loading branding:", error)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      await saveBranding({ tenant_id: tenantId, ...branding })
      alert("Branding saved successfully!")
    } catch (error) {
      alert("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label>Tenant ID</Label>
        <div className="flex gap-2">
          <Input placeholder="Enter tenant UUID" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
          <Button onClick={load} disabled={!tenantId || loading}>
            Load
          </Button>
        </div>
      </Card>

      {tenantId && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Brand Settings</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Logo URL</Label>
                <Input
                  value={branding.logo_url}
                  onChange={(e) => setBranding((v) => ({ ...v, logo_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Favicon URL</Label>
                <Input
                  value={branding.favicon_url}
                  onChange={(e) => setBranding((v) => ({ ...v, favicon_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={branding.primary_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        primary_color: e.target.value,
                      }))
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={branding.primary_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        primary_color: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={branding.secondary_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        secondary_color: e.target.value,
                      }))
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={branding.secondary_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        secondary_color: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={branding.accent_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        accent_color: e.target.value,
                      }))
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={branding.accent_color}
                    onChange={(e) =>
                      setBranding((v) => ({
                        ...v,
                        accent_color: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Dark Mode</Label>
              <Select
                value={String(branding.dark_mode)}
                onValueChange={(v) => setBranding((prev) => ({ ...prev, dark_mode: v === "true" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Login Background URL</Label>
              <Input
                value={branding.login_bg_url}
                onChange={(e) => setBranding((v) => ({ ...v, login_bg_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Email Brand Header</Label>
              <Input
                value={branding.email_brand_header}
                onChange={(e) =>
                  setBranding((v) => ({
                    ...v,
                    email_brand_header: e.target.value,
                  }))
                }
                placeholder="Header text for emails"
              />
            </div>

            <Button onClick={save} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
