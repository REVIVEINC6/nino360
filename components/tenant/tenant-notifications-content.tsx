"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, MessageSquare, Smartphone, Save } from "lucide-react"
import { updateNotificationSettings } from "@/app/(app)/tenant/notifications/actions"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettings {
  email: {
    enabled: boolean
    frequency: string
    types: string[]
  }
  push: {
    enabled: boolean
    types: string[]
  }
  sms: {
    enabled: boolean
    types: string[]
  }
  inApp: {
    enabled: boolean
    types: string[]
  }
}

export function TenantNotificationsContent({ initialSettings }: { initialSettings: NotificationSettings }) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateNotificationSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleNotificationType = (channel: keyof NotificationSettings, type: string) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        types: prev[channel].types.includes(type)
          ? prev[channel].types.filter((t) => t !== type)
          : [...prev[channel].types, type],
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Notification Preferences
        </h1>
        <p className="text-muted-foreground mt-2">Manage how you receive notifications across different channels</p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Push
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="in-app" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            In-App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled" className="text-base font-semibold">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      email: { ...prev.email, enabled: checked },
                    }))
                  }
                />
              </div>

              {settings.email.enabled && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-semibold">Notification Types</Label>

                    <div className="space-y-3">
                      {["security", "billing", "updates", "marketing"].map((type) => (
                        <div key={type} className="flex items-center justify-between">
                          <Label htmlFor={`email-${type}`} className="capitalize">
                            {type} Notifications
                          </Label>
                          <Switch
                            id={`email-${type}`}
                            checked={settings.email.types.includes(type)}
                            onCheckedChange={() => toggleNotificationType("email", type)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-semibold">Frequency</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={settings.email.frequency}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, frequency: e.target.value },
                        }))
                      }
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="push" className="space-y-4">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-enabled" className="text-base font-semibold">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                </div>
                <Switch
                  id="push-enabled"
                  checked={settings.push.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      push: { ...prev.push, enabled: checked },
                    }))
                  }
                />
              </div>

              {settings.push.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-sm font-semibold">Notification Types</Label>

                  <div className="space-y-3">
                    {["security", "billing", "updates", "marketing"].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <Label htmlFor={`push-${type}`} className="capitalize">
                          {type} Notifications
                        </Label>
                        <Switch
                          id={`push-${type}`}
                          checked={settings.push.types.includes(type)}
                          onCheckedChange={() => toggleNotificationType("push", type)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-enabled" className="text-base font-semibold">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={settings.sms.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      sms: { ...prev.sms, enabled: checked },
                    }))
                  }
                />
              </div>

              {settings.sms.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-sm font-semibold">Notification Types</Label>

                  <div className="space-y-3">
                    {["security", "billing"].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <Label htmlFor={`sms-${type}`} className="capitalize">
                          {type} Notifications
                        </Label>
                        <Switch
                          id={`sms-${type}`}
                          checked={settings.sms.types.includes(type)}
                          onCheckedChange={() => toggleNotificationType("sms", type)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="in-app" className="space-y-4">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="inApp-enabled" className="text-base font-semibold">
                    In-App Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                </div>
                <Switch
                  id="inApp-enabled"
                  checked={settings.inApp.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      inApp: { ...prev.inApp, enabled: checked },
                    }))
                  }
                />
              </div>

              {settings.inApp.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-sm font-semibold">Notification Types</Label>

                  <div className="space-y-3">
                    {["security", "billing", "updates", "marketing"].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <Label htmlFor={`inApp-${type}`} className="capitalize">
                          {type} Notifications
                        </Label>
                        <Switch
                          id={`inApp-${type}`}
                          checked={settings.inApp.types.includes(type)}
                          onCheckedChange={() => toggleNotificationType("inApp", type)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
