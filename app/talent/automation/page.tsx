"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Zap,
  TrendingUp,
  Settings,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Workflow,
  Filter,
  BarChart3,
  Activity,
  Lightbulb,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Search,
  MoreHorizontal,
} from "lucide-react"

// Types
interface AutomationRule {
  id: string
  name: string
  description: string
  category: "screening" | "scheduling" | "communication" | "reporting" | "workflow"
  status: "active" | "paused" | "draft"
  trigger: string
  actions: string[]
  conditions: string[]
  frequency: string
  lastRun: Date
  nextRun: Date
  successRate: number
  totalRuns: number
  timeSaved: number // in hours
  createdAt: Date
  updatedAt: Date
}

interface AutomationMetric {
  id: string
  name: string
  value: number
  unit: string
  change: number
  trend: "up" | "down" | "stable"
  category: string
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedSetupTime: number
  potentialSavings: number
  tags: string[]
}

// Mock data
const mockAutomationRules: AutomationRule[] = [
  {
    id: "rule-1",
    name: "AI Resume Screening",
    description: "Automatically screen resumes based on job requirements and rank candidates",
    category: "screening",
    status: "active",
    trigger: "New application received",
    actions: ["Parse resume", "Score against requirements", "Send to hiring manager if score > 75%"],
    conditions: ["Job posting is active", "Application is complete"],
    frequency: "Real-time",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 1 * 60 * 60 * 1000),
    successRate: 94.2,
    totalRuns: 1247,
    timeSaved: 156.5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "rule-2",
    name: "Interview Scheduling Bot",
    description: "Automatically schedule interviews based on interviewer availability",
    category: "scheduling",
    status: "active",
    trigger: "Candidate passes initial screening",
    actions: ["Check interviewer calendar", "Send calendar invite", "Send confirmation email"],
    conditions: ["Interviewer is available", "Candidate confirmed interest"],
    frequency: "Real-time",
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 30 * 60 * 1000),
    successRate: 87.8,
    totalRuns: 342,
    timeSaved: 89.3,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "rule-3",
    name: "Candidate Follow-up Sequence",
    description: "Send personalized follow-up emails to candidates at different stages",
    category: "communication",
    status: "active",
    trigger: "Candidate status changes",
    actions: ["Generate personalized email", "Schedule send time", "Track engagement"],
    conditions: ["Email template exists", "Candidate opted in"],
    frequency: "Daily",
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
    successRate: 91.5,
    totalRuns: 856,
    timeSaved: 67.2,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "rule-4",
    name: "Weekly Hiring Report",
    description: "Generate and distribute weekly hiring metrics and insights",
    category: "reporting",
    status: "active",
    trigger: "Every Monday at 9 AM",
    actions: ["Compile metrics", "Generate insights", "Send to stakeholders"],
    conditions: ["Data is available", "Recipients are active"],
    frequency: "Weekly",
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    successRate: 98.1,
    totalRuns: 52,
    timeSaved: 26.0,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "rule-5",
    name: "Onboarding Workflow",
    description: "Automate new hire onboarding tasks and document collection",
    category: "workflow",
    status: "paused",
    trigger: "Offer accepted",
    actions: ["Create onboarding checklist", "Send welcome package", "Schedule orientation"],
    conditions: ["Offer is signed", "Start date is confirmed"],
    frequency: "Real-time",
    lastRun: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    successRate: 85.3,
    totalRuns: 23,
    timeSaved: 34.5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
]

const mockMetrics: AutomationMetric[] = [
  {
    id: "metric-1",
    name: "Time Saved",
    value: 373.5,
    unit: "hours",
    change: 23.4,
    trend: "up",
    category: "efficiency",
  },
  {
    id: "metric-2",
    name: "Automation Success Rate",
    value: 91.2,
    unit: "%",
    change: 2.1,
    trend: "up",
    category: "quality",
  },
  {
    id: "metric-3",
    name: "Active Automations",
    value: 12,
    unit: "rules",
    change: 3,
    trend: "up",
    category: "coverage",
  },
  {
    id: "metric-4",
    name: "Cost Savings",
    value: 18750,
    unit: "$",
    change: 12.8,
    trend: "up",
    category: "financial",
  },
]

const mockTemplates: AutomationTemplate[] = [
  {
    id: "template-1",
    name: "Smart Resume Parser",
    description: "Extract and structure information from resumes automatically",
    category: "screening",
    difficulty: "beginner",
    estimatedSetupTime: 15,
    potentialSavings: 40,
    tags: ["AI", "parsing", "screening"],
  },
  {
    id: "template-2",
    name: "Interview Feedback Collector",
    description: "Automatically collect and analyze interview feedback",
    category: "workflow",
    difficulty: "intermediate",
    estimatedSetupTime: 30,
    potentialSavings: 25,
    tags: ["feedback", "analysis", "workflow"],
  },
  {
    id: "template-3",
    name: "Candidate Engagement Tracker",
    description: "Track and optimize candidate engagement throughout the process",
    category: "communication",
    difficulty: "advanced",
    estimatedSetupTime: 60,
    potentialSavings: 60,
    tags: ["engagement", "tracking", "optimization"],
  },
]

export default function TalentAutomationPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules)
  const [metrics, setMetrics] = useState<AutomationMetric[]>(mockMetrics)
  const [templates, setTemplates] = useState<AutomationTemplate[]>(mockTemplates)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Filter automation rules
  const filteredRules = automationRules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Toggle automation rule status
  const toggleAutomationStatus = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, status: rule.status === "active" ? "paused" : "active" } : rule,
      ),
    )
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "screening":
        return <Filter className="h-4 w-4" />
      case "scheduling":
        return <Calendar className="h-4 w-4" />
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      case "reporting":
        return <BarChart3 className="h-4 w-4" />
      case "workflow":
        return <Workflow className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <div className="h-3 w-3" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Talent Automation</h1>
          <p className="text-muted-foreground">Streamline your hiring process with intelligent automation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Rules
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                        <p className="text-2xl font-bold">
                          {metric.unit === "$" ? "$" : ""}
                          {metric.value.toLocaleString()}
                          {metric.unit !== "$" ? ` ${metric.unit}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span
                          className={`text-sm ${
                            metric.trend === "up"
                              ? "text-green-500"
                              : metric.trend === "down"
                                ? "text-red-500"
                                : "text-muted-foreground"
                          }`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {automationRules.slice(0, 5).map((rule) => (
                      <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(rule.status)}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">Last run: {rule.lastRun.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {rule.successRate}% success
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Bot className="h-6 w-6" />
                    <span className="text-xs">Create Rule</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">Import Rules</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Automation Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Performance Trends</CardTitle>
              <CardDescription>Track the performance of your automation rules over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Performance chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search automation rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="screening">Screening</option>
              <option value="scheduling">Scheduling</option>
              <option value="communication">Communication</option>
              <option value="reporting">Reporting</option>
              <option value="workflow">Workflow</option>
            </select>
          </div>

          {/* Automation Rules List */}
          <div className="space-y-4">
            {filteredRules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">{getCategoryIcon(rule.category)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{rule.name}</h3>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(rule.status)}`} />
                            <Badge variant="outline" className="text-xs capitalize">
                              {rule.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {rule.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Trigger</p>
                              <p className="text-muted-foreground">{rule.trigger}</p>
                            </div>
                            <div>
                              <p className="font-medium">Frequency</p>
                              <p className="text-muted-foreground">{rule.frequency}</p>
                            </div>
                            <div>
                              <p className="font-medium">Success Rate</p>
                              <div className="flex items-center gap-2">
                                <Progress value={rule.successRate} className="h-2 flex-1" />
                                <span className="text-muted-foreground">{rule.successRate}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <span>Total runs: {rule.totalRuns.toLocaleString()}</span>
                            <span>Time saved: {rule.timeSaved}h</span>
                            <span>Last run: {rule.lastRun.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.status === "active"}
                          onCheckedChange={() => toggleAutomationStatus(rule.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Automation Templates</h2>
              <p className="text-muted-foreground">Pre-built automation templates to get you started quickly</p>
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge
                        variant={
                          template.difficulty === "beginner"
                            ? "secondary"
                            : template.difficulty === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Setup Time</span>
                        <span className="font-medium">{template.estimatedSetupTime} min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Potential Savings</span>
                        <span className="font-medium">{template.potentialSavings}h/month</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">
                        Use Template
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automation ROI */}
            <Card>
              <CardHeader>
                <CardTitle>Return on Investment</CardTitle>
                <CardDescription>Cost savings and efficiency gains from automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Saved</span>
                    <span className="font-semibold">373.5 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Savings</span>
                    <span className="font-semibold">$18,750</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ROI</span>
                    <span className="font-semibold text-green-600">340%</span>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">$15,600</p>
                    <p className="text-sm text-muted-foreground">Net savings this quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Success rates across different automation categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Screening", rate: 94.2, color: "bg-blue-500" },
                    { category: "Scheduling", rate: 87.8, color: "bg-green-500" },
                    { category: "Communication", rate: 91.5, color: "bg-purple-500" },
                    { category: "Reporting", rate: 98.1, color: "bg-orange-500" },
                    { category: "Workflow", rate: 85.3, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Insights</CardTitle>
              <CardDescription>Key insights and recommendations for your automation strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">High Performance</p>
                      <p className="text-sm text-muted-foreground">
                        Your screening automations are performing 15% above industry average
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Optimization Opportunity</p>
                      <p className="text-sm text-muted-foreground">
                        Consider automating interview feedback collection to save 20+ hours/month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Attention Needed</p>
                      <p className="text-sm text-muted-foreground">
                        Onboarding workflow has been paused - consider reactivating
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Next Steps</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Review paused automations</li>
                      <li>• Implement feedback collection</li>
                      <li>• Expand screening criteria</li>
                      <li>• Set up advanced reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
