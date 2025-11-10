"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Copy, Trash2, RefreshCw } from "lucide-react"
import { listWebhooks, createWebhook, revokeWebhook, rotateWebhookSecret } from "@/app/(dashboard)/settings/actions/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const AVAILABLE_EVENTS = [
  { id: "lead.created", label: "Lead Created" },
  { id: "invoice.paid", label: "Invoice Paid" },
  { id: "employee.onboarded", label: "Employee Onboarded" },
  { id: "project.completed", label: "Project Completed" },
]

export function WebhooksManager() {
  const [loading, setLoading] = useState(true)
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSecretDialog, setShowSecretDialog] = useState(false)
  const [newSecret, setNewSecret] = useState("")
  const [formData, setFormData] = useState({ url: "", events: [] as string[] })
  const { toast } = useToast()

  useEffect(() => {
    loadWebhooks()
  }, [])

  async function loadWebhooks() {
    try {
      const data = await listWebhooks()
      setWebhooks(data)
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

  async function handleCreate() {
    try {
      const result = await createWebhook(formData)
      setNewSecret(result.secret)
      setShowCreateDialog(false)
      setShowSecretDialog(true)
      setFormData({ url: "", events: [] })
      await loadWebhooks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleRevoke(webhookId: string) {
    try {
      await revokeWebhook(webhookId)
      toast({
        title: "Success",
        description: "Webhook revoked",
      })
      await loadWebhooks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleRotate(webhookId: string) {
    try {
      const result = await rotateWebhookSecret(webhookId)
      setNewSecret(result.secret)
      setShowSecretDialog(true)
      toast({
        title: "Success",
        description: "Webhook secret rotated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Secret copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Webhooks</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="neon">
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Webhook URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/webhook"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Events</Label>
                <div className="mt-2 space-y-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.events.includes(event.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, events: [...formData.events, event.id] })
                          } else {
                            setFormData({ ...formData, events: formData.events.filter((e) => e !== event.id) })
                          }
                        }}
                      />
                      <Label>{event.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full neon"
                disabled={!formData.url || formData.events.length === 0}
              >
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <Card className="glass p-6 text-center text-muted-foreground">No webhooks created yet</Card>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="glass p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{webhook.url}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Events: {webhook.events.join(", ")}</span>
                    {webhook.last_triggered_at && (
                      <span>Last triggered: {new Date(webhook.last_triggered_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleRotate(webhook.id)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleRevoke(webhook.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Webhook Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-yellow-400">Save this secret - use it to verify webhook signatures!</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-black/50 rounded text-sm font-mono break-all">{newSecret}</code>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(newSecret)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
