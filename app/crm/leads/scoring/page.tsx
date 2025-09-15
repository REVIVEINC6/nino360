"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import {
  Target,
  Brain,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Save,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ScoringCriterion {
  id: string
  name: string
  description: string
  weight: number
  enabled: boolean
  factors: {
    name: string
    weight: number
    enabled: boolean
  }[]
}

interface LeadScore {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  score: number
  grade: string
  trend: "up" | "down" | "stable"
  change: number
  factors: {
    demographic: number
    behavioral: number
    engagement: number
    intent: number
  }
  lastActivity: string
  assignedTo?: string
}

const initialCriteria: ScoringCriterion[] = [
  {
    id: "demographic",
    name: "Demographic Fit",
    description: "Company size, industry, location alignment",
    weight: 25,
    enabled: true,
    factors: [
      { name: "Company Size", weight: 40, enabled: true },
      { name: "Industry Match", weight: 35, enabled: true },
      { name: "Geographic Location", weight: 25, enabled: true },
    ],
  },
  {
    id: "behavioral",
    name: "Behavioral Signals",
    description: "Website activity, email engagement, content downloads",
    weight: 30,
    enabled: true,
    factors: [
      { name: "Website Visits", weight: 30, enabled: true },
      { name: "Email Opens/Clicks", weight: 25, enabled: true },
      { name: "Content Downloads", weight: 25, enabled: true },
      { name: "Social Media Engagement", weight: 20, enabled: true },
    ],
  },
  {
    id: "engagement",
    name: "Sales Engagement",
    description: "Response to outreach, meeting attendance, proposal requests",
    weight: 35,
    enabled: true,
    factors: [
      { name: "Email Response Rate", weight: 30, enabled: true },
      { name: "Meeting Attendance", weight: 25, enabled: true },
      { name: "Proposal Requests", weight: 25, enabled: true },
      { name: "Follow-up Engagement", weight: 20, enabled: true },
    ],
  },
  {
    id: "intent",
    name: "Purchase Intent",
    description: "Budget discussions, timeline urgency, decision-maker involvement",
    weight: 10,
    enabled: true,
    factors: [
      { name: "Budget Confirmed", weight: 40, enabled: true },
      { name: "Timeline Defined", weight: 30, enabled: true },
      { name: "Decision Maker Engaged", weight: 30, enabled: true },
    ],
  },
]

const initialLeadScores: LeadScore[] = [
  {
    id: "L001",
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    score: 92,
    grade: "A+",
    trend: "up",
    change: 8,
    factors: {
      demographic: 85,
      behavioral: 95,
      engagement: 90,
      intent: 98,
    },
    lastActivity: "2024-01-15T10:30:00Z",
    assignedTo: "John Smith",
  },
  {
    id: "L002",
    name: "Michael Chen",
    company: "DataFlow Solutions",
    email: "m.chen@dataflow.com",
    score: 78,
    grade: "B+",
    trend: "stable",
    change: 0,
    factors: {
      demographic: 80,
      behavioral: 75,
      engagement: 82,
      intent: 75,
    },
    lastActivity: "2024-01-14T15:45:00Z",
    assignedTo: "Jane Doe",
  },
  {
    id: "L003",
    name: "Lisa Rodriguez",
    company: "CloudTech Ltd.",
    email: "lisa.r@cloudtech.com",
    score: 65,
    grade: "B",
    trend: "down",
    change: -5,
    factors: {
      demographic: 70,
      behavioral: 60,
      engagement: 68,
      intent: 62,
    },
    lastActivity: "2024-01-13T09:20:00Z",
  },
  {
    id: "L004",
    name: "Robert Kim",
    company: "InnovateLabs",
    email: "robert@innovatelabs.com",
    score: 95,
    grade: "A+",
    trend: "up",
    change: 12,
    factors: {
      demographic: 90,
      behavioral: 98,
      engagement: 95,
      intent: 97,
    },
    lastActivity: "2024-01-15T14:20:00Z",
    assignedTo: "John Smith",
  },
]

export default function LeadScoringPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [criteria, setCriteria] = useState<ScoringCriterion[]>(initialCriteria)
  const [leadScores, setLeadScores] = useState<LeadScore[]>(initialLeadScores)
  const [isTraining, setIsTraining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<LeadScore | null>(null)
  const [isLeadDetailOpen, setIsLeadDetailOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [editingCriterion, setEditingCriterion] = useState<ScoringCriterion | null>(null)
  const [newCriterion, setNewCriterion] = useState<Partial<ScoringCriterion>>({})

  const { toast } = useToast()

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time score updates
      setLeadScores((prev) =>
        prev.map((lead) => {
          if (Math.random() > 0.95) {
            // 5% chance of update
            const change = Math.floor(Math.random() * 10) - 5
            const newScore = Math.max(0, Math.min(100, lead.score + change))
            return {
              ...lead,
              score: newScore,
              change: change,
              trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
              lastActivity: new Date().toISOString(),
            }
          }
          return lead
        }),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800 border-green-200"
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const updateCriteriaWeight = (id: string, weight: number) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight } : c)))
    toast({
      title: "Weight Updated",
      description: `Scoring weight has been adjusted to ${weight}%`,
    })
  }

  const toggleCriteria = (id: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)))
    const criterion = criteria.find((c) => c.id === id)
    toast({
      title: criterion?.enabled ? "Criterion Disabled" : "Criterion Enabled",
      description: `${criterion?.name} has been ${criterion?.enabled ? "disabled" : "enabled"}`,
    })
  }

  const handleTrainModel = async () => {
    setIsTraining(true)
    toast({
      title: "Training Started",
      description: "AI model training has begun. This may take a few minutes.",
    })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Training Complete",
        description: "AI model has been successfully retrained with 94.8% accuracy.",
      })
    } catch (error) {
      toast({
        title: "Training Failed",
        description: "Failed to train the AI model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
    }
  }

  const handleSaveConfiguration = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configuration Saved",
        description: "Scoring configuration has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)

    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create and download CSV
      const csvContent = [
        ["Name", "Company", "Email", "Score", "Grade", "Last Activity"],
        ...leadScores.map((lead) => [
          lead.name,
          lead.company,
          lead.email,
          lead.score.toString(),
          lead.grade,
          new Date(lead.lastActivity).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `lead-scores-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Export Complete",
        description: "Lead scoring data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleViewLeadDetails = (lead: LeadScore) => {
    setSelectedLead(lead)
    setIsLeadDetailOpen(true)
  }

  const handleEditLead = (lead: LeadScore) => {
    // Navigate to lead edit page
    window.location.href = `/crm/leads/${lead.id}/edit`
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLeadScores((prev) => prev.filter((lead) => lead.id !== leadId))

      toast({
        title: "Lead Deleted",
        description: "Lead has been removed from scoring.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddCriterion = () => {
    setNewCriterion({
      name: "",
      description: "",
      weight: 10,
      enabled: true,
      factors: [],
    })
    setIsConfigModalOpen(true)
  }

  const handleSaveCriterion = () => {
    if (newCriterion.name && newCriterion.description) {
      const criterion: ScoringCriterion = {
        id: `custom_${Date.now()}`,
        name: newCriterion.name!,
        description: newCriterion.description!,
        weight: newCriterion.weight || 10,
        enabled: newCriterion.enabled || true,
        factors: newCriterion.factors || [],
      }

      setCriteria((prev) => [...prev, criterion])
      setIsConfigModalOpen(false)
      setNewCriterion({})

      toast({
        title: "Criterion Added",
        description: `${criterion.name} has been added to scoring criteria.`,
      })
    }
  }

  const filteredLeads = leadScores.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "high" && lead.score >= 80) ||
      (statusFilter === "medium" && lead.score >= 60 && lead.score < 80) ||
      (statusFilter === "low" && lead.score < 60)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Scoring</h1>
          <p className="text-muted-foreground">AI-powered lead qualification and prioritization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
            {isExporting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
          <Button variant="outline" onClick={handleTrainModel} disabled={isTraining}>
            {isTraining ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
            {isTraining ? "Training..." : "Train Model"}
          </Button>
          <Button onClick={handleSaveConfiguration} disabled={isSaving}>
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">82.5</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+5.2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Quality Leads</p>
                <p className="text-2xl font-bold">{leadScores.filter((l) => l.score >= 80).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score 80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">24.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">For scored leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model Accuracy</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">AI prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="leads">Scored Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Distribution of lead scores across your database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  {
                    range: "90-100",
                    count: leadScores.filter((l) => l.score >= 90).length,
                    color: "bg-green-500",
                    label: "A+",
                  },
                  {
                    range: "80-89",
                    count: leadScores.filter((l) => l.score >= 80 && l.score < 90).length,
                    color: "bg-blue-500",
                    label: "A",
                  },
                  {
                    range: "70-79",
                    count: leadScores.filter((l) => l.score >= 70 && l.score < 80).length,
                    color: "bg-yellow-500",
                    label: "B",
                  },
                  {
                    range: "60-69",
                    count: leadScores.filter((l) => l.score >= 60 && l.score < 70).length,
                    color: "bg-orange-500",
                    label: "C",
                  },
                  {
                    range: "0-59",
                    count: leadScores.filter((l) => l.score < 60).length,
                    color: "bg-red-500",
                    label: "D",
                  },
                ].map((segment) => (
                  <div key={segment.range} className="text-center">
                    <div
                      className={`h-20 ${segment.color} rounded-lg mb-2 flex items-end justify-center pb-2 cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      <span className="text-white font-bold">{segment.count}</span>
                    </div>
                    <div className="text-sm font-medium">{segment.label}</div>
                    <div className="text-xs text-muted-foreground">{segment.range}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Criteria */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Criteria</CardTitle>
                <CardDescription>Most predictive scoring factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criteria
                    .filter((c) => c.enabled)
                    .map((criterion) => (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{criterion.name}</p>
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{criterion.weight}%</p>
                          <p className="text-xs text-muted-foreground">Weight</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Machine learning recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Behavioral signals are strongest</p>
                      <p className="text-sm text-muted-foreground">
                        Website activity shows 85% correlation with conversion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Consider industry weighting</p>
                      <p className="text-sm text-muted-foreground">Tech companies convert 40% higher than average</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Model performing well</p>
                      <p className="text-sm text-muted-foreground">94.2% accuracy on recent predictions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Scoring Configuration</h3>
              <p className="text-sm text-muted-foreground">Customize your lead scoring criteria and weights</p>
            </div>
            <Button onClick={handleAddCriterion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Criterion
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                {criteria.map((criterion) => (
                  <motion.div
                    key={criterion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Switch checked={criterion.enabled} onCheckedChange={() => toggleCriteria(criterion.id)} />
                        <div>
                          <h3 className="font-semibold">{criterion.name}</h3>
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{criterion.weight}% Weight</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCriterion(criterion)
                            setIsConfigModalOpen(true)
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {criterion.enabled && (
                      <div className="space-y-4">
                        <div>
                          <Label>Overall Weight: {criterion.weight}%</Label>
                          <Slider
                            value={[criterion.weight]}
                            onValueChange={(value) => updateCriteriaWeight(criterion.id, value[0])}
                            max={50}
                            min={5}
                            step={5}
                            className="mt-2"
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {criterion.factors.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Switch checked={factor.enabled} />
                                <span className="text-sm font-medium">{factor.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{factor.weight}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="high">High Score (80+)</SelectItem>
                <SelectItem value="medium">Medium Score (60-79)</SelectItem>
                <SelectItem value="low">Low Score (60-)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scored Leads ({filteredLeads.length})</CardTitle>
              <CardDescription>Leads ranked by AI scoring algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                        <Badge className={getGradeColor(lead.grade)}>{lead.grade}</Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getTrendIcon(lead.trend)}
                          <span
                            className={`text-xs ${
                              lead.trend === "up"
                                ? "text-green-600"
                                : lead.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {lead.change > 0 ? "+" : ""}
                            {lead.change} points
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • Last activity: {new Date(lead.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {Object.entries(lead.factors).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <div className={`font-bold ${getScoreColor(value)}`}>{value}</div>
                            <div className="text-muted-foreground capitalize">{key.slice(0, 3)}</div>
                          </div>
                        ))}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewLeadDetails(lead)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/crm/leads/${lead.id}`, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Scoring
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Performance</CardTitle>
                <CardDescription>How well scores predict conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: "90-100", conversion: 45.2, count: leadScores.filter((l) => l.score >= 90).length },
                    {
                      range: "80-89",
                      conversion: 32.8,
                      count: leadScores.filter((l) => l.score >= 80 && l.score < 90).length,
                    },
                    {
                      range: "70-79",
                      conversion: 18.5,
                      count: leadScores.filter((l) => l.score >= 70 && l.score < 80).length,
                    },
                    {
                      range: "60-69",
                      conversion: 8.2,
                      count: leadScores.filter((l) => l.score >= 60 && l.score < 70).length,
                    },
                    { range: "0-59", conversion: 2.1, count: leadScores.filter((l) => l.score < 60).length },
                  ].map((segment) => (
                    <div key={segment.range} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score {segment.range}</span>
                        <span>{segment.conversion}% conversion</span>
                      </div>
                      <Progress value={segment.conversion} className="h-2" />
                      <div className="text-xs text-muted-foreground">{segment.count} leads in this range</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>AI model accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Prediction Accuracy</span>
                      <span className="text-sm font-bold">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-sm font-bold">91.8%</span>
                    </div>
                    <Progress value={91.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-sm font-bold">89.5%</span>
                    </div>
                    <Progress value={89.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">F1 Score</span>
                      <span className="text-sm font-bold">90.6%</span>
                    </div>
                    <Progress value={90.6} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Which factors contribute most to accurate scoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Website Visit Frequency", importance: 0.28, category: "Behavioral" },
                  { name: "Email Engagement Rate", importance: 0.24, category: "Behavioral" },
                  { name: "Company Size Match", importance: 0.18, category: "Demographic" },
                  { name: "Industry Alignment", importance: 0.15, category: "Demographic" },
                  { name: "Response to Outreach", importance: 0.12, category: "Engagement" },
                  { name: "Content Download Activity", importance: 0.08, category: "Behavioral" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress value={feature.importance * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {(feature.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Sheet */}
      <Sheet open={isLeadDetailOpen} onOpenChange={setIsLeadDetailOpen}>
        <SheetContent className="w-[600px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>Detailed scoring breakdown and lead information</SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}</div>
                  <Badge className={getGradeColor(selectedLead.grade)}>{selectedLead.grade}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedLead.name}</h3>
                  <p className="text-muted-foreground">{selectedLead.company}</p>
                  <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                  {selectedLead.phone && <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Scoring Breakdown</h4>
                {Object.entries(selectedLead.factors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize font-medium">{key}</span>
                      <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Activity</h4>
                <p className="text-sm text-muted-foreground">
                  Last activity: {new Date(selectedLead.lastActivity).toLocaleString()}
                </p>
                {selectedLead.assignedTo && (
                  <p className="text-sm text-muted-foreground">Assigned to: {selectedLead.assignedTo}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleEditLead(selectedLead)} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lead
                </Button>
                <Button variant="outline" onClick={() => window.open(`/crm/leads/${selectedLead.id}`, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCriterion ? "Edit Criterion" : "Add New Criterion"}</DialogTitle>
            <DialogDescription>
              {editingCriterion
                ? "Modify the scoring criterion settings"
                : "Create a new scoring criterion for lead evaluation"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCriterion.name || ""}
                onChange={(e) => setNewCriterion((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter criterion name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCriterion.description || ""}
                onChange={(e) => setNewCriterion((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this criterion measures"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (%)</Label>
              <Slider
                value={[newCriterion.weight || 10]}
                onValueChange={(value) => setNewCriterion((prev) => ({ ...prev, weight: value[0] }))}
                max={50}
                min={5}
                step={5}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground">Current weight: {newCriterion.weight || 10}%</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCriterion}>{editingCriterion ? "Update" : "Add"} Criterion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
