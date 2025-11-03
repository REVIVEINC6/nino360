"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Mail, Bell, MessageSquare, Smartphone, Edit, Trash2, Send, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import {
  getNotificationTemplates,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  testNotificationTemplate,
  type NotificationTemplate,
} from "@/app/(dashboard)/admin/notifications/actions"
import { useToast } from "@/hooks/use-toast"

export function NotificationsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isTestOpen, setIsTestOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [testRecipient, setTestRecipient] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    type: "email" as "email" | "push" | "sms" | "in_app",
    subject: "",
    body: "",
    rate_limit: "10/hour",
    status: "active" as "active" | "inactive",
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    const data = await getNotificationTemplates()
    setTemplates(data)
  }

  async function handleCreate() {
    setIsLoading(true)
    try {
      await createNotificationTemplate(formData)
      toast({ title: "Template created successfully" })
      setIsCreateOpen(false)
      resetForm()
      loadTemplates()
    } catch (error) {
      toast({ title: "Failed to create template", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate() {
    if (!selectedTemplate) return
    setIsLoading(true)
    try {
      await updateNotificationTemplate(selectedTemplate.id, formData)
      toast({ title: "Template updated successfully" })
      setIsEditOpen(false)
      resetForm()
      loadTemplates()
    } catch (error) {
      toast({ title: "Failed to update template", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return
    try {
      await deleteNotificationTemplate(id)
      toast({ title: "Template deleted successfully" })
      loadTemplates()
    } catch (error) {
      toast({ title: "Failed to delete template", variant: "destructive" })
    }
  }

  async function handleTest() {
    if (!selectedTemplate || !testRecipient) return
    setIsLoading(true)
    try {
      await testNotificationTemplate(selectedTemplate.id, testRecipient)
      toast({ title: "Test notification sent successfully" })
      setIsTestOpen(false)
      setTestRecipient("")
    } catch (error) {
      toast({ title: "Failed to send test notification", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      type: "email",
      subject: "",
      body: "",
      rate_limit: "10/hour",
      status: "active",
    })
    setSelectedTemplate(null)
  }

  function openEdit(template: NotificationTemplate) {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      rate_limit: template.rate_limit,
      status: template.status,
    })
    setIsEditOpen(true)
  }

  function openTest(template: NotificationTemplate) {
    setSelectedTemplate(template)
    setIsTestOpen(true)
  }

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === "active").length,
    email: templates.filter((t) => t.type === "email").length,
    push: templates.filter((t) => t.type === "push").length,
  }

  const typeIcons = {
    email: Mail,
    push: Bell,
    sms: MessageSquare,
    in_app: Smartphone,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Templates", value: stats.total, icon: Bell, color: "from-blue-500 to-cyan-500" },
          { label: "Active", value: stats.active, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
          { label: "Email", value: stats.email, icon: Mail, color: "from-purple-500 to-pink-500" },
          { label: "Push", value: stats.push, icon: Bell, color: "from-orange-500 to-red-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/70 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="backdrop-blur-xl bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Notification Templates
            </CardTitle>
            <CardDescription>Manage email templates, push notifications, and rate limiting rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 backdrop-blur-xl bg-white/50 border-white/20"
                />
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-xl bg-white/90 border-white/20">
                  <DialogHeader>
                    <DialogTitle>Create Notification Template</DialogTitle>
                    <DialogDescription>Add a new notification template with rate limits</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Welcome Email"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="in_app">In-App</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Welcome to Nino360"
                      />
                    </div>
                    <div>
                      <Label>Body</Label>
                      <Textarea
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Template body with {{variables}}"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Rate Limit</Label>
                      <Input
                        value={formData.rate_limit}
                        onChange={(e) => setFormData({ ...formData, rate_limit: e.target.value })}
                        placeholder="10/hour"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isLoading}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border border-white/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/50">
                    <TableHead>Template</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => {
                    const Icon = typeIcons[template.type]
                    return (
                      <TableRow key={template.id} className="hover:bg-white/50">
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="backdrop-blur-xl bg-white/50">
                            <Icon className="h-3 w-3 mr-1" />
                            {template.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{template.subject}</TableCell>
                        <TableCell className="text-sm">{template.rate_limit}</TableCell>
                        <TableCell>
                          <Badge variant={template.status === "active" ? "default" : "secondary"}>
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openTest(template)}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEdit(template)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/90 border-white/20">
          <DialogHeader>
            <DialogTitle>Edit Notification Template</DialogTitle>
            <DialogDescription>Update template settings and content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Welcome Email"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in_app">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Welcome to Nino360"
              />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Template body with {{variables}}"
                rows={4}
              />
            </div>
            <div>
              <Label>Rate Limit</Label>
              <Input
                value={formData.rate_limit}
                onChange={(e) => setFormData({ ...formData, rate_limit: e.target.value })}
                placeholder="10/hour"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/90 border-white/20">
          <DialogHeader>
            <DialogTitle>Test Notification</DialogTitle>
            <DialogDescription>Send a test notification to verify the template</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Recipient</Label>
            <Input
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder="email@example.com or phone number"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTest} disabled={isLoading || !testRecipient}>
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
