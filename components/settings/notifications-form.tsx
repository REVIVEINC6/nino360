"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FormRow } from "@/components/settings/form-row"
import { getNotifications, saveNotifications } from "@/app/(dashboard)/settings/actions/notifications"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function NotificationsForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getNotifications()
        setConfig(data)
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
    loadData()
  }, [toast])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      await saveNotifications(config)
      toast({
        title: "Success",
        description: "Notification preferences saved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="glass p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <FormRow label="Enable Email Notifications" description="Receive notifications via email">
              <Switch
                checked={config.email.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, email: { ...config.email, enabled: checked } })}
              />
            </FormRow>

            {config.email.enabled && (
              <div className="ml-6 space-y-3 border-l-2 border-purple-500/30 pl-4">
                {["crm", "talent", "hrms", "finance", "bench"].map((module) => (
                  <div key={module} className="flex items-center justify-between">
                    <Label className="capitalize">{module}</Label>
                    <Switch
                      checked={config.email[module]}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, email: { ...config.email, [module]: checked } })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">In-App Notifications</h3>
          <div className="space-y-4">
            <FormRow label="Enable In-App Notifications" description="Show notifications in the app">
              <Switch
                checked={config.inapp.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, inapp: { ...config.inapp, enabled: checked } })}
              />
            </FormRow>

            {config.inapp.enabled && (
              <div className="ml-6 space-y-3 border-l-2 border-purple-500/30 pl-4">
                {["crm", "talent", "hrms", "finance", "bench"].map((module) => (
                  <div key={module} className="flex items-center justify-between">
                    <Label className="capitalize">{module}</Label>
                    <Switch
                      checked={config.inapp[module]}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, inapp: { ...config.inapp, [module]: checked } })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Digest</h3>
          <div className="space-y-3">
            <FormRow label="Daily Digest" description="Receive a daily summary email">
              <Switch
                checked={config.digest.daily}
                onCheckedChange={(checked) => setConfig({ ...config, digest: { ...config.digest, daily: checked } })}
              />
            </FormRow>
            <FormRow label="Weekly Digest" description="Receive a weekly summary email">
              <Switch
                checked={config.digest.weekly}
                onCheckedChange={(checked) => setConfig({ ...config, digest: { ...config.digest, weekly: checked } })}
              />
            </FormRow>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
          <div className="space-y-4">
            <FormRow label="Enable Quiet Hours" description="Pause notifications during specific hours">
              <Switch
                checked={config.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, quietHours: { ...config.quietHours, enabled: checked } })
                }
              />
            </FormRow>

            {config.quietHours.enabled && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <input
                    type="time"
                    value={config.quietHours.start}
                    onChange={(e) =>
                      setConfig({ ...config, quietHours: { ...config.quietHours, start: e.target.value } })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <input
                    type="time"
                    value={config.quietHours.end}
                    onChange={(e) =>
                      setConfig({ ...config, quietHours: { ...config.quietHours, end: e.target.value } })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="neon">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </form>
  )
}
