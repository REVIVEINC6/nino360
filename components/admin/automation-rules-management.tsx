"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Play, Pause, Trash2, TestTube } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  createAutomationRule,
  deleteAutomationRule,
  toggleAutomationRule,
  testAutomationRule,
} from "@/app/(dashboard)/admin/automation/actions"
import { toast } from "sonner"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger_type: string
  trigger_config: any
  action_type: string
  action_config: any
  conditions: any
  is_active: boolean
  last_run_at: string | null
  created_at: string
}

export function AutomationRulesManagement({ initialRules }: { initialRules: AutomationRule[] }) {
  const [search, setSearch] = useState("")
  const [rules, setRules] = useState(initialRules)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger_type: "schedule",
    trigger_config: {},
    action_type: "email",
    action_config: {},
    conditions: {},
    is_active: true,
  })

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleCreate = async () => {
    const result = await createAutomationRule(formData)
    if (result.success) {
      toast.success("Automation rule created successfully")
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        trigger_type: "schedule",
        trigger_config: {},
        action_type: "email",
        action_config: {},
        conditions: {},
        is_active: true,
      })
      // Refresh rules
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to create automation rule")
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    const result = await toggleAutomationRule(id, !isActive)
    if (result.success) {
      toast.success(`Rule ${!isActive ? "activated" : "deactivated"}`)
      setRules(rules.map((r) => (r.id === id ? { ...r, is_active: !isActive } : r)))
    } else {
      toast.error(result.error || "Failed to toggle rule")
    }
  }

  const handleTest = async (id: string) => {
    const result = await testAutomationRule(id)
    if (result.success) {
      toast.success("Test execution successful")
    } else {
      toast.error(result.error || "Test execution failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return

    const result = await deleteAutomationRule(id)
    if (result.success) {
      toast.success("Rule deleted successfully")
      setRules(rules.filter((r) => r.id !== id))
    } else {
      toast.error(result.error || "Failed to delete rule")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white/50"
            />
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </motion.div>

      {/* Rules Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-white/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <p>No automation rules found. Create your first rule to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.trigger_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.action_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rule.last_run_at ? new Date(rule.last_run_at).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleTest(rule.id)}>
                            <TestTube className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggle(rule.id, rule.is_active)}>
                            {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Automation Rule</DialogTitle>
            <DialogDescription>Configure a new RPA automation rule</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Send welcome email to new users"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this rule does..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select
                  value={formData.trigger_type}
                  onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="action">Action Type</Label>
                <Select
                  value={formData.action_type}
                  onValueChange={(value) => setFormData({ ...formData, action_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="notification">Send Notification</SelectItem>
                    <SelectItem value="webhook">Call Webhook</SelectItem>
                    <SelectItem value="update">Update Record</SelectItem>
                    <SelectItem value="create">Create Record</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="active">Activate immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
