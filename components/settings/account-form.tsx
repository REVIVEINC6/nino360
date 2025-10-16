"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormRow } from "@/components/settings/form-row"
import { getAccount, updateAccount, listConnectedAccounts } from "@/app/(dashboard)/settings/actions/account"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

export function AccountForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [account, setAccount] = useState<any>(null)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const [accountData, accounts] = await Promise.all([getAccount(), listConnectedAccounts()])
        setAccount(accountData)
        setConnectedAccounts(accounts)
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateAccount(formData)

      toast({
        title: "Success",
        description: "Account updated successfully",
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass p-6 space-y-6">
          <FormRow label="Email" description="Your primary email address">
            <Input value={account?.email || ""} disabled className="bg-white/5" />
          </FormRow>

          <FormRow label="Full Name" description="Your display name across the platform">
            <Input name="full_name" defaultValue={account?.full_name || ""} placeholder="John Doe" required />
          </FormRow>

          <FormRow label="Avatar URL" description="Profile picture URL">
            <div className="flex gap-2">
              <Input
                name="avatar_url"
                type="url"
                defaultValue={account?.avatar_url || ""}
                placeholder="https://example.com/avatar.jpg"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </FormRow>

          <FormRow label="Locale" description="Your preferred language">
            <select
              name="locale"
              defaultValue={account?.locale || "en-US"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </FormRow>

          <FormRow label="Timezone" description="Your local timezone">
            <select
              name="timezone"
              defaultValue={account?.timezone || "America/New_York"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </FormRow>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="neon">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>

      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
        {connectedAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No connected accounts</p>
        ) : (
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div
                key={account.provider}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium capitalize">{account.provider}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
