"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Save, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveNotificationPrefs } from "@/app/(app)/profile/actions"
import type { NotificationPrefsInput } from "@/lib/profile/validators"

interface NotificationTogglesProps {
  initialPrefs: NotificationPrefsInput
}

export function NotificationToggles({ initialPrefs }: NotificationTogglesProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [prefs, setPrefs] = useState<NotificationPrefsInput>(initialPrefs)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveNotificationPrefs(prefs)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: result.message,
      })
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-[#8B5CF6]" />
          <h3 className="font-medium">Email Notifications</h3>
        </div>
        <div className="space-y-3 pl-8">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-daily" className="text-sm">
              Daily Digest
            </Label>
            <Switch
              id="email-daily"
              checked={prefs.email?.digestDaily || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  email: { ...prefs.email, digestDaily: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-weekly" className="text-sm">
              Weekly Summary
            </Label>
            <Switch
              id="email-weekly"
              checked={prefs.email?.digestWeekly || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  email: { ...prefs.email, digestWeekly: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-[#8B5CF6]" />
          <h3 className="font-medium">In-App Notifications</h3>
        </div>
        <div className="space-y-3 pl-8">
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-enabled" className="text-sm">
              Enable Notifications
            </Label>
            <Switch
              id="inapp-enabled"
              checked={prefs.inapp?.enabled || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  inapp: { ...prefs.inapp, enabled: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-sound" className="text-sm">
              Sound
            </Label>
            <Switch
              id="inapp-sound"
              checked={prefs.inapp?.sound || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  inapp: { ...prefs.inapp, sound: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-[#8B5CF6]" />
          <h3 className="font-medium">SMS Notifications</h3>
        </div>
        <div className="space-y-3 pl-8">
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-enabled" className="text-sm">
              Enable SMS
            </Label>
            <Switch
              id="sms-enabled"
              checked={prefs.sms?.enabled || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  sms: { ...prefs.sms, enabled: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-urgent" className="text-sm">
              Urgent Only
            </Label>
            <Switch
              id="sms-urgent"
              checked={prefs.sms?.urgentOnly || false}
              onCheckedChange={(checked) =>
                setPrefs({
                  ...prefs,
                  sms: { ...prefs.sms, urgentOnly: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </>
        )}
      </Button>
    </div>
  )
}
