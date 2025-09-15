"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Mail,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  RefreshCw,
  Edit,
  CheckCircle,
  AlertTriangle,
  Bot,
  Brain,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Lead {
  id: string
  name: string
  email: string
  company: string
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  value: number
  source: string
  assignedTo: string
  createdAt: string
  lastActivity: string
  score: number
}

interface Deal {
  id: string
  title: string
  company: string
  value: number
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  probability: number
  closeDate: string
  owner: string
  lastActivity: string
}

interface CRMMetrics {
  totalLeads: number
  qualifiedLeads: number
  totalDeals: number
  dealValue: number
  conversionRate: number
  avgDealSize: number
  salesCycle: number
  winRate: number
}

export function CRMModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalLeads: 1247,
    qualifiedLeads: 342,
    totalDeals: 89,
    dealValue: 2847293,
    conversionRate: 27.4,
    avgDealSize: 31990,
    salesCycle: 45,
    winRate: 68.2,
  })

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@techcorp.com",
      company: "TechCorp Solutions",
      status: "qualified",
      value: 45000,
      source: "Website",
      assignedTo: "Sarah Johnson",
      createdAt: "2024-01-15",
      lastActivity: "2024-01-20",
      score: 85,
    },
    {
      id: "2",
      name: "Emily Davis",
      email: "emily.davis@innovate.com",
      company: "Innovate Inc",
      status: "proposal",
      value: 78000,
      source: "Referral",
      assignedTo: "Mike Wilson",
      createdAt: "2024-01-12",
      lastActivity: "2024-01-19",
      score: 92,
    },
    {
      id: "3",
      name: "Robert Chen",
      email: "robert.chen@globaltech.com",
      company: "GlobalTech Ltd",
      status: "new",
      value: 23000,
      source: "LinkedIn",
      assignedTo: "Lisa Brown",
      createdAt: "2024-01-18",
      lastActivity: "2024-01-18",
      score: 67,
    },
  ])

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      title: "Enterprise CRM Implementation",
      company: "TechCorp Solutions",
      value: 125000,
      stage: "negotiation",
      probability: 75,
      closeDate: "2024-02-15",
      owner: "Sarah Johnson",
      lastActivity: "2024-01-20",
    },
    {
      id: "2",
      title: "HR Management System",
      company: "Innovate Inc",
      value: 89000,
      stage: "proposal",
      probability: 60,
      closeDate: "2024-02-28",
      owner: "Mike Wilson",
      lastActivity: "2024-01-19",
    },
    {
      id: "3",
      title: "Analytics Platform License",
      company: "DataFlow Corp",
      value: 156000,
      stage: "qualification",
      probability: 40,
      closeDate: "2024-03-15",
      owner: "Lisa Brown",
      lastActivity: "2024-01-17",
    },
  ])

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update metrics with slight variations
      setMetrics((prev) => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor((Math.random() - 0.5) * 20),
        qualifiedLeads: prev.qualifiedLeads + Math.floor((Math.random() - 0.5) * 10),
        conversionRate: Math.max(20, Math.min(35, prev.conversionRate + (Math.random() - 0.5) * 2)),
        winRate: Math.max(60, Math.min(80, prev.winRate + (Math.random() - 0.5) * 3)),
      }))

      toast.success("CRM data refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh CRM data")
    } finally {
      setLoading(false)
    }
  }

  const handleLeadAction = async (leadId: string, action: string) => {
    try {
      switch (action) {
        case "qualify":
          setLeads((prev) =>
            prev.map((lead) => (lead.id === leadId ? { ...lead, status: "qualified" as const } : lead)),
          )
          toast.success("Lead qualified successfully")
          break
        case "contact":
          toast.info("Opening contact form...")
          break
        case "convert":
          setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
          toast.success("Lead converted to deal")
          break
        case "delete":
          if (confirm("Are you sure you want to delete this lead?")) {
            setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
            toast.success("Lead deleted successfully")
          }
          break
        default:
          toast.info(`Action ${action} performed`)
      }
    } catch (error) {
      toast.error("Failed to perform action")
    }
  }

  const handleDealAction = async (dealId: string, action: string) => {
    try {
      switch (action) {
        case "advance":
          setDeals((prev) =>
            prev.map((deal) => {
              if (deal.id === dealId) {
                const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed-won"]
                const currentIndex = stages.indexOf(deal.stage)
                const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)]
                return { ...deal, stage: nextStage as any, probability: Math.min(deal.probability + 20, 100) }
              }
              return deal
            }),
          )
          toast.success("Deal advanced to next stage")
          break
        case "schedule":
          toast.info("Opening calendar...")
          break
        case "update":
          toast.info("Opening deal editor...")
          break
        case "close-won":
          setDeals((prev) =>
            prev.map((deal) =>
              deal.id === dealId ? { ...deal, stage: "closed-won" as const, probability: 100 } : deal,
            ),
          )
          toast.success("Deal marked as won!")
          break
        case "close-lost":
          setDeals((prev) =>
            prev.map((deal) =>
              deal.id === dealId ? { ...deal, stage: "closed-lost" as const, probability: 0 } : deal,
            ),
          )
          toast.info("Deal marked as lost")
          break
        default:
          toast.info(`Action ${action} performed`)
      }
    } catch (error) {
      toast.error("Failed to perform action")
    }
  }

  const exportData = async (type: string) => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const data = type === "leads" ? leads : type === "deals" ? deals : metrics
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crm-${type}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "proposal":
        return "bg-purple-100 text-purple-800"
      case "negotiation":
        return "bg-orange-100 text-orange-800"
      case "closed-won":
        return "bg-emerald-100 text-emerald-800"
      case "closed-lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospecting":
        return "bg-blue-100 text-blue-800"
      case "qualification":
        return "bg-yellow-100 text-yellow-800"
      case "proposal":
        return "bg-purple-100 text-purple-800"
      case "negotiation":
        return "bg-orange-100 text-orange-800"
      case "closed-won":
        return "bg-emerald-100 text-emerald-800"
      case "closed-lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        refreshData()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Dashboard</h2>
          <p className="text-muted-foreground">Manage leads, deals, and customer relationships with AI insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData("overview")} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{metrics.qualifiedLeads} qualified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.dealValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {metrics.totalDeals} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2.1% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.winRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Above target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Pipeline Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="deals">Deal Tracking</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sales Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Deal progression by stage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stage: "Prospecting", count: 23, value: 450000 },
                  { stage: "Qualification", count: 18, value: 720000 },
                  { stage: "Proposal", count: 12, value: 890000 },
                  { stage: "Negotiation", count: 8, value: 1200000 },
                ].map((item) => (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} deals • ${(item.value / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <Progress value={(item.count / 23) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest CRM activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: "New lead created", user: "Sarah Johnson", time: "2 minutes ago", type: "lead" },
                  { action: "Deal advanced to negotiation", user: "Mike Wilson", time: "15 minutes ago", type: "deal" },
                  { action: "Meeting scheduled", user: "Lisa Brown", time: "1 hour ago", type: "activity" },
                  { action: "Proposal sent", user: "Sarah Johnson", time: "2 hours ago", type: "proposal" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Lead Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData("leads")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        <Badge variant="outline">{lead.source}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Score: <span className={`font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${lead.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Assigned to {lead.assignedTo}</p>
                    <p className="text-xs text-muted-foreground">Last activity: {lead.lastActivity}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleLeadAction(lead.id, "contact")}>
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleLeadAction(lead.id, "qualify")}>
                            Qualify Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLeadAction(lead.id, "convert")}>
                            Convert to Deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleLeadAction(lead.id, "delete")}
                            className="text-red-600"
                          >
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Deal Tracking</h3>
            <Button variant="outline" size="sm" onClick={() => exportData("deals")}>
              <Download className="h-4 w-4 mr-2" />
              Export Deals
            </Button>
          </div>

          <div className="grid gap-4">
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{deal.title}</h4>
                    <p className="text-sm text-muted-foreground">{deal.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      <span className="text-sm text-muted-foreground">{deal.probability}% probability</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2 w-48" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${deal.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Close: {deal.closeDate}</p>
                    <p className="text-sm text-muted-foreground">Owner: {deal.owner}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleDealAction(deal.id, "advance")}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Advance
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleDealAction(deal.id, "schedule")}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDealAction(deal.id, "update")}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDealAction(deal.id, "close-won")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Won
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDealAction(deal.id, "close-lost")}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Mark as Lost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Powered CRM Insights</h3>
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Generate New Insights
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <Badge className="bg-green-100 text-green-800">High Impact</Badge>
                </div>
                <Badge variant="outline">94% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Lead Scoring Optimization</h4>
              <p className="text-sm text-muted-foreground mb-4">
                AI identified 23 high-value leads that should be prioritized. These leads have a 78% higher conversion
                probability.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Reassign top-scoring leads to senior sales reps and implement automated nurturing sequences.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Implement
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>
                </div>
                <Badge variant="outline">87% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Deal Risk Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                5 deals worth $890K are at risk of being lost due to prolonged inactivity and competitor pressure.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Schedule urgent follow-up calls and prepare competitive battle cards for at-risk deals.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Take Action
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <Badge className="bg-blue-100 text-blue-800">Revenue Impact</Badge>
                </div>
                <Badge variant="outline">91% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Upselling Opportunities</h4>
              <p className="text-sm text-muted-foreground mb-4">
                12 existing customers show strong indicators for premium plan upgrades, potentially adding $340K ARR.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Create targeted upselling campaigns and schedule expansion conversations with account managers.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <Badge className="bg-red-100 text-red-800">Churn Risk</Badge>
                </div>
                <Badge variant="outline">83% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Customer Retention Alert</h4>
              <p className="text-sm text-muted-foreground mb-4">
                7 customers showing early churn signals based on usage patterns and support ticket frequency.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Initiate proactive retention outreach and offer additional training or support resources.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Start Retention
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
