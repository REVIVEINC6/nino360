"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, Key, FileText, Plus, X } from "lucide-react"

export function TenantSecurityContent() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [ssoEnabled, setSsoEnabled] = useState(false)
  const [ipWhitelist, setIpWhitelist] = useState(["192.168.1.0/24", "10.0.0.0/8"])
  const [newIp, setNewIp] = useState("")

  const addIpAddress = () => {
    if (newIp && !ipWhitelist.includes(newIp)) {
      setIpWhitelist([...ipWhitelist, newIp])
      setNewIp("")
    }
  }

  const removeIpAddress = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter((item) => item !== ip))
  }

  return (
    <Tabs defaultValue="authentication" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="authentication">
          <Shield className="h-4 w-4 mr-2" />
          Authentication
        </TabsTrigger>
        <TabsTrigger value="access">
          <Lock className="h-4 w-4 mr-2" />
          Access Control
        </TabsTrigger>
        <TabsTrigger value="password">
          <Key className="h-4 w-4 mr-2" />
          Password Policy
        </TabsTrigger>
        <TabsTrigger value="audit">
          <FileText className="h-4 w-4 mr-2" />
          Audit Log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="authentication" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Authentication Settings</h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Single Sign-On (SSO)</Label>
                <p className="text-sm text-muted-foreground">Enable SSO authentication</p>
              </div>
              <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
            </div>

            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue={30} className="max-w-xs" />
            </div>

            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Authentication Settings
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="access" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">IP Whitelist</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter IP address or CIDR (e.g., 192.168.1.0/24)"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIpAddress()}
              />
              <Button onClick={addIpAddress} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {ipWhitelist.map((ip) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <span className="font-mono text-sm">{ip}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeIpAddress(ip)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save IP Whitelist
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="password" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Password Policy</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Minimum Length</Label>
              <Input type="number" defaultValue={12} className="max-w-xs" />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Uppercase Letters</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Lowercase Letters</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Numbers</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Special Characters</Label>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Input type="number" defaultValue={90} className="max-w-xs" />
            </div>

            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Password Policy
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="audit" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Audit Log Settings</h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Track all security-related events</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label>Log Retention Period (days)</Label>
              <Input type="number" defaultValue={365} className="max-w-xs" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Blockchain Verification</Label>
                <p className="text-sm text-muted-foreground">Enable blockchain audit trail</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Audit Settings
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
