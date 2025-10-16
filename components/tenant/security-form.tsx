"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Globe, Save } from "lucide-react"
import { updateSecuritySettings } from "@/app/(dashboard)/tenant/actions/security"
import { useToast } from "@/hooks/use-toast"

interface SecurityFormProps {
  initialSettings: {
    mfa_required: boolean
    ip_allowlist: string[]
    session_timeout: number
  }
}

export function SecurityForm({ initialSettings }: SecurityFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSave() {
    setLoading(true)
    try {
      await updateSecuritySettings(settings)
      toast({
        title: "Settings saved",
        description: "Security settings have been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>Require all users to enable MFA for enhanced security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mfa-required">Require MFA for all users</Label>
            <Switch
              id="mfa-required"
              checked={settings.mfa_required}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, mfa_required: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            IP Allowlist
          </CardTitle>
          <CardDescription>Restrict access to specific IP addresses or ranges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ip-allowlist">Allowed IP Addresses</Label>
            <Input
              id="ip-allowlist"
              placeholder="192.168.1.0/24, 10.0.0.1"
              value={settings.ip_allowlist.join(", ")}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  ip_allowlist: e.target.value.split(",").map((ip) => ip.trim()),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of IP addresses or CIDR ranges</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>Configure session timeout and security policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              min={5}
              max={1440}
              value={settings.session_timeout}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  session_timeout: Number.parseInt(e.target.value),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Automatically log out users after this period of inactivity</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>
        <Save className="mr-2 h-4 w-4" />
        {loading ? "Saving..." : "Save Security Settings"}
      </Button>
    </>
  )
}
