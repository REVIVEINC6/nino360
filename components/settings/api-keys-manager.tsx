"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Copy, Trash2 } from "lucide-react"
import { listApiKeys, createApiKey, revokeApiKey } from "@/app/(dashboard)/settings/actions/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const AVAILABLE_SCOPES = [
  { id: "read:reports", label: "Read Reports" },
  { id: "write:crm", label: "Write CRM Data" },
  { id: "read:hrms", label: "Read HRMS Data" },
  { id: "write:finance", label: "Write Finance Data" },
]

export function ApiKeysManager() {
  const [loading, setLoading] = useState(true)
  const [keys, setKeys] = useState<any[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [newKey, setNewKey] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", scopes: [] as string[], expires_at: "" })
  const { toast } = useToast()

  useEffect(() => {
    loadKeys()
  }, [])

  async function loadKeys() {
    try {
      const data = await listApiKeys()
      setKeys(data)
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
      const result = await createApiKey(formData)
      setNewKey(result)
      setShowCreateDialog(false)
      setShowKeyDialog(true)
      setFormData({ name: "", scopes: [], expires_at: "" })
      await loadKeys()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleRevoke(keyId: string) {
    try {
      await revokeApiKey(keyId)
      toast({
        title: "Success",
        description: "API key revoked",
      })
      await loadKeys()
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
      description: "API key copied to clipboard",
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
        <h3 className="text-lg font-semibold">API Keys</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="neon">
              <Plus className="h-4 w-4 mr-2" />
              Create Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My API Key"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Scopes</Label>
                <div className="mt-2 space-y-2">
                  {AVAILABLE_SCOPES.map((scope) => (
                    <div key={scope.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.scopes.includes(scope.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, scopes: [...formData.scopes, scope.id] })
                          } else {
                            setFormData({ ...formData, scopes: formData.scopes.filter((s) => s !== scope.id) })
                          }
                        }}
                      />
                      <Label>{scope.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Expires At (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleCreate}
                className="w-full neon"
                disabled={!formData.name || formData.scopes.length === 0}
              >
                Create API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {keys.length === 0 ? (
        <Card className="glass p-6 text-center text-muted-foreground">No API keys created yet</Card>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <Card key={key.id} className="glass p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{key.name}</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded">{key.key_prefix}...</code>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Scopes: {key.scopes.join(", ")}</span>
                    {key.expires_at && <span>Expires: {new Date(key.expires_at).toLocaleDateString()}</span>}
                    {key.last_used_at && <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleRevoke(key.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-yellow-400">Save this key now - you won't be able to see it again!</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-black/50 rounded text-sm font-mono break-all">{newKey?.fullKey}</code>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(newKey?.fullKey || "")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
