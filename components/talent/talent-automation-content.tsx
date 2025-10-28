"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Zap,
  Play,
  Settings,
  TrendingUp,
  Mail,
  Calendar,
  FileText,
  Users,
  Brain,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  actions: string[]
  enabled: boolean
  executions: number
  success_rate: number
  category: string
}

export function TalentAutomationContent({ initialRules }: { initialRules: AutomationRule[] }) {
  const [rules, setRules] = useState(initialRules)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const toggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "screening":
        return <Users className="h-5 w-5" />
      case "communication":
        return <Mail className="h-5 w-5" />
      case "scheduling":
        return <Calendar className="h-5 w-5" />
      case "documentation":
        return <FileText className="h-5 w-5" />
      case "ai":
        return <Brain className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const stats = [
    {
      label: "Active Rules",
      value: rules.filter((r) => r.enabled).length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Total Executions",
      value: rules.reduce((sum, r) => sum + r.executions, 0).toLocaleString(),
      icon: Play,
      color: "text-blue-600",
    },
    {
      label: "Avg Success Rate",
      value: `${Math.round(rules.reduce((sum, r) => sum + r.success_rate, 0) / rules.length)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    { label: "Time Saved", value: "847h", icon: Zap, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="glass-card border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Automation Rules</h3>
              <p className="text-sm text-gray-600">Configure and manage recruitment automation</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Automation Rule</DialogTitle>
                  <DialogDescription>
                    Set up a new automation rule to streamline your recruitment process
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Rule Name</Label>
                    <Input placeholder="e.g., Auto-screen candidates" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what this rule does..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application_received">Application Received</SelectItem>
                        <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                        <SelectItem value="interview_completed">Interview Completed</SelectItem>
                        <SelectItem value="offer_sent">Offer Sent</SelectItem>
                        <SelectItem value="candidate_status_change">Status Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="scheduling">Scheduling</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="ai">AI Processing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Create Rule</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Rules</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="ai">AI Processing</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {rules.map((rule) => (
                <Card key={rule.id} className="glass-card border-white/20 p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                        {getCategoryIcon(rule.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rule.name}</h4>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {rule.executions.toLocaleString()} runs
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {rule.success_rate}% success
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {rule.trigger}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {["screening", "communication", "scheduling", "ai"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-3">
                {rules
                  .filter((r) => r.category === category)
                  .map((rule) => (
                    <Card key={rule.id} className="glass-card border-white/20 p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                            {getCategoryIcon(rule.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{rule.name}</h4>
                              <Badge variant={rule.enabled ? "default" : "secondary"}>
                                {rule.enabled ? "Active" : "Paused"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {rule.executions.toLocaleString()} runs
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {rule.success_rate}% success
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
