"use client"

import { useState } from "react"
import { getSettings, saveSettings } from "../actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function Configuration() {
  const [tenantId, setTenantId] = useState("")
  const [settings, setSettings] = useState({
    legal_name: "",
    website: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    timezone: "UTC",
    locale: "en-US",
    currency: "USD",
    fiscal_year_start: 4,
  })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await getSettings(tenantId)
      if (data) setSettings(data)
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      await saveSettings({ tenant_id: tenantId, ...settings })
      alert("Settings saved successfully!")
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
            <h3 className="text-lg font-semibold">Organization Settings</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Legal Name</Label>
                <Input
                  value={settings.legal_name}
                  onChange={(e) => setSettings((v) => ({ ...v, legal_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={settings.website}
                  onChange={(e) => setSettings((v) => ({ ...v, website: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Address Line 1</Label>
              <Input
                value={settings.address_line1}
                onChange={(e) => setSettings((v) => ({ ...v, address_line1: e.target.value }))}
              />
            </div>

            <div>
              <Label>Address Line 2</Label>
              <Input
                value={settings.address_line2}
                onChange={(e) => setSettings((v) => ({ ...v, address_line2: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>City</Label>
                <Input value={settings.city} onChange={(e) => setSettings((v) => ({ ...v, city: e.target.value }))} />
              </div>
              <div>
                <Label>State</Label>
                <Input value={settings.state} onChange={(e) => setSettings((v) => ({ ...v, state: e.target.value }))} />
              </div>
              <div>
                <Label>Zipcode</Label>
                <Input
                  value={settings.zipcode}
                  onChange={(e) => setSettings((v) => ({ ...v, zipcode: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Country</Label>
              <Input
                value={settings.country}
                onChange={(e) => setSettings((v) => ({ ...v, country: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Timezone</Label>
                <Input
                  value={settings.timezone}
                  onChange={(e) => setSettings((v) => ({ ...v, timezone: e.target.value }))}
                />
              </div>
              <div>
                <Label>Locale</Label>
                <Input
                  value={settings.locale}
                  onChange={(e) => setSettings((v) => ({ ...v, locale: e.target.value }))}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  value={settings.currency}
                  onChange={(e) => setSettings((v) => ({ ...v, currency: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Fiscal Year Start</Label>
              <Select
                value={String(settings.fiscal_year_start)}
                onValueChange={(v) =>
                  setSettings((prev) => ({
                    ...prev,
                    fiscal_year_start: Number.parseInt(v),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={save} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
