"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useToast } from "@/hooks/use-toast"
import {
  Zap,
  Bot,
  Settings,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Target,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  Brain,
  Workflow,
} from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  status: "active" | "paused" | "draft"
  executionCount: number
  successRate: number
  lastExecuted: string
  category: "allocation" | "notification" | "reporting" | "optimization"
  conditions: string[]
  enabled: boolean
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  steps: number
  estimatedTime: string
  complexity: "simple" | "medium" | "complex"
  usageCount: number
  rating: number
}

const mockAutomationRules: AutomationRule[] = [
  {
    id: "1",
    name: "Auto-Allocate Available Resources",
    description: "Automatically allocate resources when they become available based on skill match and priority",
    trigger: "Resource status changes to available",
    action: "Find matching projects and create allocation suggestions",
    status: "active",
    executionCount: 47,
    successRate: 89,
    lastExecuted: "2024-01-20 14:30",
    category: "allocation",
    conditions: ["Skill match >= 80%", "Project priority = High", "Resource bench days > 5"],
    enabled: true,
  },
  {
    id: "2",
    name: "Bench Time Alert System",
    description: "Send notifications when resources exceed target bench time",
    trigger: "Resource bench days > threshold",
    action: "Send alert to resource managers",
    status: "active",
    executionCount: 23,
    successRate: 95,
    lastExecuted: "2024-01-20 09:15",
    category: "notification",
    conditions: ["Bench days > 10", "Resource status = available"],
    enabled: true,
  },
  {
    id: "3",
    name: "Weekly Utilization Report",
    description: "Generate and distribute weekly utilization reports to stakeholders",
    trigger: "Every Monday at 9:00 AM",
    action: "Generate report and send via email",
    status: "active",
    executionCount: 12,
    successRate: 100,
    lastExecuted: "2024-01-15 09:00",
    category: "reporting",
    conditions: ["Include all active resources", "Format as PDF"],
    enabled: true,
  },
  {
    id: "4",
    name: "Skill Gap Optimizer",
    description: "Identify skill gaps and suggest training or hiring recommendations",
    trigger: "Monthly analysis",
    action: "Analyze skill gaps and create recommendations",
    status: "paused",
    executionCount: 3,
    successRate: 67,
    lastExecuted: "2024-01-01 10:00",
    category: "optimization",
    conditions: ["Gap threshold > 20%", "Demand trend = increasing"],
    enabled: false,
  },
]

const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: "1",
    name: "Resource Onboarding",
    description: "Complete workflow for onboarding new resources to the bench",
    category: "Onboarding",
    steps: 8,
    estimatedTime: "2-3 hours",
    complexity: "medium",
    usageCount: 15,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Project Allocation",
    description: "End-to-end process for allocating resources to projects",
    category: "Allocation",
    steps: 6,
    estimatedTime: "30-45 minutes",
    complexity: "simple",
    usageCount: 32,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Bench Optimization",
    description: "Comprehensive bench analysis and optimization workflow",
    category: "Optimization",
    steps: 12,
    estimatedTime: "4-6 hours",
    complexity: "complex",
    usageCount: 8,
    rating: 4.9,
  },
]

export default function AutomationPage() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules)
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(mockWorkflowTemplates)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "allocation":
        return "bg-blue-100 text-blue-800"
      case "notification":
        return "bg-purple-100 text-purple-800"
      case "reporting":
        return "bg-green-100 text-green-800"
      case "optimization":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleToggleRule = (ruleId: string) => {
    setAutomationRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled, status: rule.enabled ? "paused" : "active" } : rule,
      ),
    )
    toast({
      title: "Rule Updated",
      description: "Automation rule status has been updated.",
    })
  }

  const handleCreateRule = () => {
    toast({
      title: "Rule Created",
      description: "New automation rule has been created successfully.",
    })
    setIsCreateRuleOpen(false)
  }

  const handleCreateWorkflow = () => {
    toast({
      title: "Workflow Created",
      description: "New workflow template has been created successfully.",
    })
    setIsCreateWorkflowOpen(false)
  }

  const handleDeleteRule = (ruleId: string) => {
    setAutomationRules((rules) => rules.filter((rule) => rule.id !== ruleId))
    toast({
      title: "Rule Deleted",
      description: "Automation rule has been deleted.",
    })
  }

  const activeRules = automationRules.filter((rule) => rule.status === "active").length
  const totalExecutions = automationRules.reduce((sum, rule) => sum + rule.executionCount, 0)
  const avgSuccessRate = Math.round(
    automationRules.reduce((sum, rule) => sum + rule.successRate, 0) / automationRules.length,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench Automation</h1>
          <p className="text-muted-foreground">Automate bench management workflows and optimize resource allocation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Workflow className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workflow Template</DialogTitle>
                <DialogDescription>Create a new automated workflow template</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflowName">Workflow Name</Label>
                  <Input id="workflowName" placeholder="Enter workflow name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflowCategory">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="allocation">Allocation</SelectItem>
                      <SelectItem value="optimization">Optimization</SelectItem>
                      <SelectItem value="reporting">Reporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflowDescription">Description</Label>
                  <Textarea id="workflowDescription" placeholder="Describe the workflow..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateWorkflowOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>Create a new automation rule for bench management</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input id="ruleName" placeholder="Enter rule name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allocation">Allocation</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="reporting">Reporting</SelectItem>
                        <SelectItem value="optimization">Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruleDescription">Description</Label>
                  <Textarea id="ruleDescription" placeholder="Describe what this rule does..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruleTrigger">Trigger Condition</Label>
                  <Input id="ruleTrigger" placeholder="When should this rule execute?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruleAction">Action</Label>
                  <Textarea id="ruleAction" placeholder="What action should be taken?" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateRuleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRule}>Create Rule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
            <p className="text-xs text-muted-foreground">{automationRules.length} total rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
            <Progress value={avgSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">Per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-builder">AI Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {automationRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <p className="text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>
                        <Badge className={getCategoryColor(rule.category)}>{rule.category}</Badge>
                        <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Trigger</p>
                        <p className="font-medium text-sm">{rule.trigger}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Executions</p>
                        <p className="font-medium">{rule.executionCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="font-medium">{rule.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Executed</p>
                        <p className="font-medium text-sm">{rule.lastExecuted}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {rule.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {rule.status === "active" ? (
                            <Play className="h-4 w-4 text-green-600" />
                          ) : (
                            <Pause className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {rule.status === "active" ? "Running" : "Paused"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedRule(rule)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </div>
                      <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{template.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Steps</p>
                        <p className="font-medium">{template.steps}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Time</p>
                        <p className="font-medium">{template.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium">{template.usageCount} times</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{template.rating}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(template.rating) ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        Run Workflow
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
                <CardDescription>Success rates and execution trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Performance analytics chart would be displayed here</p>
                    <p className="text-sm">Showing automation success rates over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Savings</CardTitle>
                <CardDescription>Hours saved through automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{rule.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(rule.executionCount * 0.5)}h saved
                        </span>
                      </div>
                      <Progress value={(rule.executionCount / 50) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Automation Builder
              </CardTitle>
              <CardDescription>Let AI help you create intelligent automation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Rule Creation</h3>
                  <p className="text-muted-foreground mb-4">
                    Describe what you want to automate, and AI will create the rules for you
                  </p>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Builder
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-medium">Smart Allocation</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        AI analyzes resource skills, availability, and project requirements to suggest optimal
                        allocations.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-medium">Predictive Alerts</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Machine learning predicts when resources will become available and sends proactive
                        notifications.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Settings className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-medium">Auto-Optimization</h4>
                      </div>
                      <p className="text-sm text-purple-700">
                        Continuously optimizes bench management processes based on historical data and outcomes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rule Detail Dialog */}
      {selectedRule && (
        <Dialog open={!!selectedRule} onOpenChange={() => setSelectedRule(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Bot className="h-6 w-6" />
                {selectedRule.name}
              </DialogTitle>
              <DialogDescription>{selectedRule.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <Badge className={getCategoryColor(selectedRule.category)}>{selectedRule.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(selectedRule.status)}>{selectedRule.status}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Executions</p>
                  <p className="text-lg font-semibold">{selectedRule.executionCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-lg font-semibold">{selectedRule.successRate}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Trigger Condition</p>
                <p className="text-sm bg-muted p-3 rounded">{selectedRule.trigger}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Action</p>
                <p className="text-sm bg-muted p-3 rounded">{selectedRule.action}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Last Executed</p>
                <p className="text-sm text-muted-foreground">{selectedRule.lastExecuted}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
