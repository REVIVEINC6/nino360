"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Globe, DollarSign, Users, Shield, Bell, Zap } from "lucide-react"

export function TenantConfigurationContent() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="glass-panel">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="regional">Regional</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Organization Details
            </CardTitle>
            <CardDescription>Basic information about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" defaultValue="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-domain">Domain</Label>
              <Input id="org-domain" defaultValue="acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea id="org-description" defaultValue="Leading technology solutions provider" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-industry">Industry</Label>
              <Select defaultValue="technology">
                <SelectTrigger id="org-industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              User Settings
            </CardTitle>
            <CardDescription>Configure user-related settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Self-Registration</Label>
                <p className="text-sm text-muted-foreground">Users can create accounts without invitation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify email before access</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-role">Default User Role</Label>
              <Select defaultValue="employee">
                <SelectTrigger id="default-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="regional" className="space-y-4">
        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Localization
            </CardTitle>
            <CardDescription>Regional and language settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="gmt">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger id="date-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Currency & Financial
            </CardTitle>
            <CardDescription>Currency and financial settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
              <Select defaultValue="january">
                <SelectTrigger id="fiscal-year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features" className="space-y-4">
        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Module Features
            </CardTitle>
            <CardDescription>Enable or disable specific features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Assistant</Label>
                <p className="text-sm text-muted-foreground">Enable AI-powered assistance across modules</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Blockchain Verification</Label>
                <p className="text-sm text-muted-foreground">Enable blockchain audit trail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>RPA Automation</Label>
                <p className="text-sm text-muted-foreground">Enable robotic process automation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>ML Predictions</Label>
                <p className="text-sm text-muted-foreground">Enable machine learning predictions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Advanced Analytics</Label>
                <p className="text-sm text-muted-foreground">Enable advanced analytics and reporting</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notification Features
            </CardTitle>
            <CardDescription>Configure notification capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send browser push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <Card className="glass-panel border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Advanced Settings
            </CardTitle>
            <CardDescription>Advanced configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Max File Upload Size (MB)</Label>
              <Input id="max-file-size" type="number" defaultValue="50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Access</Label>
                <p className="text-sm text-muted-foreground">Allow API access to tenant data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">Allow webhook integrations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put tenant in maintenance mode</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </Tabs>
  )
}
