"use client"

import { useState } from "react"
import { listTemplates, saveTemplate, deleteTemplate } from "../actions/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, Trash2, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Notifications() {
  const [tenantId, setTenantId] = useState("")
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editTemplate, setEditTemplate] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await listTemplates(tenantId)
      setTemplates(data)
    } catch (error) {
      console.error("[v0] Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!editTemplate || !tenantId) return
    setLoading(true)
    try {
      await saveTemplate({ ...editTemplate, tenant_id: tenantId })
      await load()
      setDialogOpen(false)
      setEditTemplate(null)
    } catch (error) {
      alert("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this template?")) return
    setLoading(true)
    try {
      await deleteTemplate(id)
      await load()
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
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Email Templates</h3>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() =>
                    setEditTemplate({
                      key: "",
                      subject: "",
                      body_html: "",
                      body_text: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editTemplate?.id ? "Edit" : "New"} Template</DialogTitle>
                </DialogHeader>
                {editTemplate && (
                  <div className="space-y-4">
                    <div>
                      <Label>Key</Label>
                      <Input
                        value={editTemplate.key}
                        onChange={(e) =>
                          setEditTemplate((v: any) => ({
                            ...v,
                            key: e.target.value,
                          }))
                        }
                        placeholder="invite, reset_password, etc."
                      />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={editTemplate.subject}
                        onChange={(e) =>
                          setEditTemplate((v: any) => ({
                            ...v,
                            subject: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>HTML Body</Label>
                      <Textarea
                        value={editTemplate.body_html}
                        onChange={(e) =>
                          setEditTemplate((v: any) => ({
                            ...v,
                            body_html: e.target.value,
                          }))
                        }
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label>Text Body (optional)</Label>
                      <Textarea
                        value={editTemplate.body_text}
                        onChange={(e) =>
                          setEditTemplate((v: any) => ({
                            ...v,
                            body_text: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <Button onClick={save} disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? "Saving..." : "Save Template"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {templates.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{t.key}</div>
                    <div className="text-sm text-muted-foreground">{t.subject}</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Updated: {new Date(t.updated_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditTemplate(t)
                        setDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
