"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Target,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Send,
  Download,
  Upload,
  SortAsc,
  SortDesc,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  X,
  Save,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Mock data - In production, this would come from your API
const mockLeads = [
  {
    id: "L001",
    companyName: "TechCorp Solutions",
    contactName: "Sarah Johnson",
    title: "VP of Engineering",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    source: "Website",
    status: "Active",
    stage: "Qualified",
    owner: "John Smith",
    createdAt: "2024-01-15",
    lastActivity: "2024-01-20",
    score: 92,
    value: "$450,000",
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    company: {
      size: "500-1000",
      industry: "Technology",
      location: "San Francisco, CA",
      website: "techcorp.com",
    },
    aiInsights: {
      priority: "High",
      nextAction: "Schedule demo call",
      probability: 85,
      riskFactors: [],
    },
  },
  {
    id: "L002",
    companyName: "DataFlow Inc",
    contactName: "Michael Chen",
    title: "CTO",
    email: "m.chen@dataflow.com",
    phone: "+1 (555) 234-5678",
    source: "LinkedIn",
    status: "Active",
    stage: "Contacted",
    owner: "Emily Davis",
    createdAt: "2024-01-12",
    lastActivity: "2024-01-18",
    score: 78,
    value: "$280,000",
    avatar: "/placeholder.svg?height=32&width=32&text=MC",
    company: {
      size: "100-500",
      industry: "Data Analytics",
      location: "Austin, TX",
      website: "dataflow.com",
    },
    aiInsights: {
      priority: "Medium",
      nextAction: "Send follow-up email",
      probability: 65,
      riskFactors: ["No response in 7 days"],
    },
  },
  {
    id: "L003",
    companyName: "CloudTech Ltd",
    contactName: "Lisa Rodriguez",
    title: "Head of Operations",
    email: "lisa.r@cloudtech.com",
    phone: "+1 (555) 345-6789",
    source: "Referral",
    status: "Active",
    stage: "New",
    owner: "David Wilson",
    createdAt: "2024-01-18",
    lastActivity: "2024-01-19",
    score: 65,
    value: "$125,000",
    avatar: "/placeholder.svg?height=32&width=32&text=LR",
    company: {
      size: "50-100",
      industry: "Cloud Services",
      location: "Seattle, WA",
      website: "cloudtech.com",
    },
    aiInsights: {
      priority: "Medium",
      nextAction: "Initial qualification call",
      probability: 45,
      riskFactors: [],
    },
  },
  {
    id: "L004",
    companyName: "InnovateLabs",
    contactName: "Robert Kim",
    title: "Founder & CEO",
    email: "robert@innovatelabs.com",
    phone: "+1 (555) 456-7890",
    source: "Event",
    status: "Active",
    stage: "Converted",
    owner: "Sarah Thompson",
    createdAt: "2024-01-05",
    lastActivity: "2024-01-22",
    score: 95,
    value: "$750,000",
    avatar: "/placeholder.svg?height=32&width=32&text=RK",
    company: {
      size: "200-500",
      industry: "AI/ML",
      location: "Boston, MA",
      website: "innovatelabs.com",
    },
    aiInsights: {
      priority: "High",
      nextAction: "Contract finalization",
      probability: 95,
      riskFactors: [],
    },
  },
  {
    id: "L005",
    companyName: "ScaleUp Ventures",
    contactName: "Amanda Foster",
    title: "VP of Sales",
    email: "amanda@scaleup.com",
    phone: "+1 (555) 567-8901",
    source: "Cold Email",
    status: "Active",
    stage: "Lost",
    owner: "Mike Johnson",
    createdAt: "2024-01-08",
    lastActivity: "2024-01-16",
    score: 35,
    value: "$180,000",
    avatar: "/placeholder.svg?height=32&width=32&text=AF",
    company: {
      size: "100-200",
      industry: "SaaS",
      location: "Denver, CO",
      website: "scaleup.com",
    },
    aiInsights: {
      priority: "Low",
      nextAction: "Archive lead",
      probability: 5,
      riskFactors: ["Budget constraints", "Competitor chosen"],
    },
  },
]

const leadSources = [
  { name: "Website", count: 145, percentage: 35, color: "bg-blue-500" },
  { name: "LinkedIn", count: 98, percentage: 24, color: "bg-purple-500" },
  { name: "Referral", count: 87, percentage: 21, color: "bg-green-500" },
  { name: "Event", count: 52, percentage: 13, color: "bg-orange-500" },
  { name: "Cold Email", count: 28, percentage: 7, color: "bg-red-500" },
]

const stageStats = [
  { stage: "New", count: 89, color: "bg-blue-500" },
  { stage: "Contacted", count: 156, color: "bg-yellow-500" },
  { stage: "Qualified", count: 78, color: "bg-green-500" },
  { stage: "Converted", count: 45, color: "bg-purple-500" },
  { stage: "Lost", count: 32, color: "bg-red-500" },
]

const aiRecommendations = [
  {
    id: 1,
    type: "high-priority",
    title: "High-Value Lead Alert",
    description: "TechCorp Solutions shows 92% conversion probability",
    action: "Schedule demo call today",
    impact: "$450K potential",
    leadId: "L001",
  },
  {
    id: 2,
    type: "at-risk",
    title: "Lead Going Cold",
    description: "DataFlow Inc hasn't responded in 7 days",
    action: "Send personalized follow-up",
    impact: "$280K at risk",
    leadId: "L002",
  },
  {
    id: 3,
    type: "opportunity",
    title: "Expansion Opportunity",
    description: "InnovateLabs ready for upsell discussion",
    action: "Prepare expansion proposal",
    impact: "$200K additional",
    leadId: "L004",
  },
]

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState(mockLeads)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [selectedOwner, setSelectedOwner] = useState("all")
  const [sortField, setSortField] = useState("score")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false)
  const [showEditLeadDialog, setShowEditLeadDialog] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false)
  const [bulkActionType, setBulkActionType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [newLead, setNewLead] = useState({
    companyName: "",
    contactName: "",
    title: "",
    email: "",
    phone: "",
    source: "Website",
    stage: "New",
    value: "",
    notes: "",
  })

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      // Simulate random score updates
      setLeads((prevLeads) =>
        prevLeads.map((lead) => ({
          ...lead,
          score: Math.max(0, Math.min(100, lead.score + (Math.random() - 0.5) * 5)),
          lastActivity: Math.random() > 0.9 ? new Date().toISOString().split("T")[0] : lead.lastActivity,
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "qualified":
        return "bg-green-100 text-green-800 border-green-200"
      case "converted":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "lost":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <AlertTriangle className="h-4 w-4 text-red-500" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = selectedStage === "all" || lead.stage.toLowerCase() === selectedStage.toLowerCase()
      const matchesSource = selectedSource === "all" || lead.source.toLowerCase() === selectedSource.toLowerCase()
      const matchesOwner = selectedOwner === "all" || lead.owner.toLowerCase() === selectedOwner.toLowerCase()
      return matchesSearch && matchesStage && matchesSource && matchesOwner
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]
      const direction = sortDirection === "asc" ? 1 : -1
      return aValue > bValue ? direction : -direction
    })

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const handleSelectAll = () => {
    setSelectedLeads(selectedLeads.length === filteredLeads.length ? [] : filteredLeads.map((lead) => lead.id))
  }

  const handleBulkAction = (action: string) => {
    setBulkActionType(action)
    setShowBulkActionDialog(true)
  }

  const executeBulkAction = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    switch (bulkActionType) {
      case "Assign":
        setLeads((prev) =>
          prev.map((lead) => (selectedLeads.includes(lead.id) ? { ...lead, owner: "New Owner" } : lead)),
        )
        break
      case "Update Stage":
        setLeads((prev) =>
          prev.map((lead) => (selectedLeads.includes(lead.id) ? { ...lead, stage: "Contacted" } : lead)),
        )
        break
      case "Send Email":
        // Email functionality would be implemented here
        break
      case "Export":
        const selectedLeadData = leads.filter((lead) => selectedLeads.includes(lead.id))
        const dataStr = JSON.stringify(selectedLeadData, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileDefaultName = `leads-export-${new Date().toISOString().split("T")[0]}.json`
        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
        break
    }

    toast({
      title: "Bulk Action Completed",
      description: `${bulkActionType} applied to ${selectedLeads.length} leads`,
    })

    setSelectedLeads([])
    setShowBulkActionDialog(false)
    setIsLoading(false)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleAddLead = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const leadId = `L${String(leads.length + 1).padStart(3, "0")}`
    const newLeadData = {
      id: leadId,
      companyName: newLead.companyName,
      contactName: newLead.contactName,
      title: newLead.title,
      email: newLead.email,
      phone: newLead.phone,
      source: newLead.source,
      status: "Active",
      stage: newLead.stage,
      owner: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      score: Math.floor(Math.random() * 40) + 30,
      value: newLead.value ? `$${newLead.value}` : "$0",
      avatar: `/placeholder.svg?height=32&width=32&text=${newLead.contactName
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
      company: {
        size: "Unknown",
        industry: "Unknown",
        location: "Unknown",
        website: "unknown.com",
      },
      aiInsights: {
        priority: "Medium",
        nextAction: "Initial contact",
        probability: 50,
        riskFactors: [],
      },
    }

    setLeads((prev) => [newLeadData, ...prev])
    setNewLead({
      companyName: "",
      contactName: "",
      title: "",
      email: "",
      phone: "",
      source: "Website",
      stage: "New",
      value: "",
      notes: "",
    })
    setShowAddLeadDialog(false)
    setIsLoading(false)

    toast({
      title: "Lead Added",
      description: `${newLead.contactName} has been added successfully`,
    })
  }

  const handleEditLead = (lead: any) => {
    setEditingLead(lead)
    setShowEditLeadDialog(true)
  }

  const handleUpdateLead = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLeads((prev) => prev.map((lead) => (lead.id === editingLead.id ? editingLead : lead)))

    setShowEditLeadDialog(false)
    setEditingLead(null)
    setIsLoading(false)

    toast({
      title: "Lead Updated",
      description: `${editingLead.contactName} has been updated successfully`,
    })
  }

  const handleDeleteLead = async (leadId: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const leadToDelete = leads.find((lead) => lead.id === leadId)
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
    setIsLoading(false)

    toast({
      title: "Lead Deleted",
      description: `${leadToDelete?.contactName} has been deleted`,
      variant: "destructive",
    })
  }

  const handleCall = (lead: any) => {
    toast({
      title: "Initiating Call",
      description: `Calling ${lead.contactName} at ${lead.phone}`,
    })
    // In a real app, this would integrate with a calling system
  }

  const handleEmail = (lead: any) => {
    toast({
      title: "Opening Email",
      description: `Composing email to ${lead.email}`,
    })
    // In a real app, this would open the email client or compose modal
  }

  const handleScheduleMeeting = (lead: any) => {
    toast({
      title: "Opening Calendar",
      description: `Scheduling meeting with ${lead.contactName}`,
    })
    // In a real app, this would open calendar integration
  }

  const handleAssignBDM = (lead: any) => {
    toast({
      title: "Assign BDM",
      description: `Opening assignment dialog for ${lead.contactName}`,
    })
    // In a real app, this would open a BDM assignment modal
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast({
          title: "Import Started",
          description: `Processing ${file.name}...`,
        })
        // In a real app, this would process the file
      }
    }
    input.click()
  }

  const handleExportAll = () => {
    const dataStr = JSON.stringify(filteredLeads, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `all-leads-export-${new Date().toISOString().split("T")[0]}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Export Complete",
      description: `${filteredLeads.length} leads exported successfully`,
    })
  }

  const handleRefreshData = async () => {
    setIsLoading(true)

    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate some data changes
    setLeads((prev) =>
      prev.map((lead) => ({
        ...lead,
        score: Math.max(0, Math.min(100, lead.score + (Math.random() - 0.5) * 10)),
        lastActivity: Math.random() > 0.7 ? new Date().toISOString().split("T")[0] : lead.lastActivity,
      })),
    )

    setIsLoading(false)

    toast({
      title: "Data Refreshed",
      description: "Lead data has been updated with latest information",
    })
  }

  const handleAIRecommendationAction = (recommendation: any) => {
    const lead = leads.find((l) => l.id === recommendation.leadId)
    if (lead) {
      switch (recommendation.type) {
        case "high-priority":
          handleScheduleMeeting(lead)
          break
        case "at-risk":
          handleEmail(lead)
          break
        case "opportunity":
          toast({
            title: "Preparing Proposal",
            description: `Creating expansion proposal for ${lead.contactName}`,
          })
          break
      }
    }
  }

  const totalValue = filteredLeads.reduce((sum, lead) => sum + Number.parseInt(lead.value.replace(/[$,]/g, "")), 0)
  const avgScore = Math.round(filteredLeads.reduce((sum, lead) => sum + lead.score, 0) / filteredLeads.length)

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lead Management
          </h1>
          <p className="text-muted-foreground">AI-powered lead pipeline with intelligent scoring and recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
            className="bg-white/60 backdrop-blur-sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className="bg-white/60 backdrop-blur-sm"
          >
            <Activity className={`mr-2 h-4 w-4 ${isRealTimeEnabled ? "text-green-500" : "text-gray-400"}`} />
            Real-time {isRealTimeEnabled ? "On" : "Off"}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                <Brain className="mr-2 h-4 w-4" />
                AI Insights
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  AI Lead Insights
                </SheetTitle>
                <SheetDescription>Smart recommendations to optimize your lead conversion</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {aiRecommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg border bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600">{rec.action}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 bg-transparent"
                        onClick={() => handleAIRecommendationAction(rec)}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={() => setShowAddLeadDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card
          className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/crm/leads")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLeads.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/crm/pipeline")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/crm/analytics")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <p className="text-xs text-muted-foreground">+5 points this week</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/crm/reports")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights Banner */}
      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            <Card className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">AI Lead Intelligence</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAIInsights(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Smart recommendations to optimize your lead conversion today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-green-50/80 rounded-lg border border-green-200/50 cursor-pointer"
                    onClick={() => router.push("/crm/leads?priority=high")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">High-Intent Leads</span>
                    </div>
                    <p className="text-xs text-green-700">3 leads show strong buying signals - prioritize outreach</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-orange-50/80 rounded-lg border border-orange-200/50 cursor-pointer"
                    onClick={() => router.push("/crm/leads?status=at-risk")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">At-Risk Leads</span>
                    </div>
                    <p className="text-xs text-orange-700">2 warm leads haven't been contacted in 5+ days</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/50 cursor-pointer"
                    onClick={() => router.push("/crm/analytics?view=timing")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Best Time to Call</span>
                    </div>
                    <p className="text-xs text-blue-700">Tuesday 2-4 PM shows highest response rates</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Lead Sources & Stage Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadSources.map((source) => (
                <div key={source.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedSource(source.name.toLowerCase())}
                    >
                      {source.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{source.count}</span>
                  </div>
                  <div
                    className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                    onClick={() => setSelectedSource(source.name.toLowerCase())}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full ${source.color}`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stageStats.map((stat) => (
                <div key={stat.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${stat.color} cursor-pointer`}
                      onClick={() => setSelectedStage(stat.stage.toLowerCase())}
                    />
                    <span
                      className="text-sm font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedStage(stat.stage.toLowerCase())}
                    >
                      {stat.stage}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer"
                    onClick={() => setSelectedStage(stat.stage.toLowerCase())}
                  >
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lead Database</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedLeads.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm">
                          Bulk Actions ({selectedLeads.length})
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkAction("Assign")}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign to BDM
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("Update Stage")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Update Stage
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("Send Email")}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction("Export")}>
                          <Download className="mr-2 h-4 w-4" />
                          Export Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm" onClick={handleImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/60 backdrop-blur-sm"
                    onClick={handleExportAll}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
              <CardDescription>Manage and prioritize your sales prospects with AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50/50 rounded-lg">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-[140px] bg-white/80">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-[140px] bg-white/80">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="cold email">Cold Email</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedStage("all")
                    setSelectedSource("all")
                    setSelectedOwner("all")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>

              {/* Table */}
              <div className="rounded-lg border bg-white/80 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLeads.length === filteredLeads.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                        <div className="flex items-center gap-1">
                          Score
                          {sortField === "score" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
                        <div className="flex items-center gap-1">
                          Value
                          {sortField === "value" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>AI Priority</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredLeads.map((lead, index) => (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedLeads.includes(lead.id)}
                              onCheckedChange={() => handleSelectLead(lead.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={lead.avatar || "/placeholder.svg"} alt={lead.contactName} />
                                <AvatarFallback>
                                  {lead.contactName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{lead.contactName}</div>
                                <div className="text-sm text-muted-foreground">{lead.title}</div>
                                <div className="text-xs text-muted-foreground">{lead.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.companyName}</div>
                              <div className="text-sm text-muted-foreground">{lead.company.industry}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getScoreIcon(lead.score)}
                              <span className={`font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.source}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{lead.owner}</TableCell>
                          <TableCell className="font-medium">{lead.value}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{lead.lastActivity}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(lead.aiInsights.priority)}>
                              {lead.aiInsights.priority}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/crm/leads/${lead.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Lead
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignBDM(lead)}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Assign BDM
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCall(lead)}>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEmail(lead)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleScheduleMeeting(lead)}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Meeting
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteLead(lead.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Lead Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedLead.avatar || "/placeholder.svg"} alt={selectedLead.contactName} />
                    <AvatarFallback>
                      {selectedLead.contactName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedLead.contactName}</SheetTitle>
                    <SheetDescription>
                      {selectedLead.title} at {selectedLead.companyName}
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => handleCall(selectedLead)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEmail(selectedLead)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleScheduleMeeting(selectedLead)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Meeting
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditLead(selectedLead)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </SheetHeader>

              <Tabs defaultValue="summary" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="ai">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lead Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm">{selectedLead.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-sm">{selectedLead.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Source</label>
                          <Badge variant="outline">{selectedLead.source}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Stage</label>
                          <Badge className={getStageColor(selectedLead.stage)}>{selectedLead.stage}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Owner</label>
                          <p className="text-sm">{selectedLead.owner}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Value</label>
                          <p className="text-sm font-medium">{selectedLead.value}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Lead Score</label>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={selectedLead.score} className="flex-1" />
                          <span className={`font-bold ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="company" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company Size</label>
                          <p className="text-sm">{selectedLead.company.size} employees</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Industry</label>
                          <p className="text-sm">{selectedLead.company.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Location</label>
                          <p className="text-sm">{selectedLead.company.location}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Website</label>
                          <a
                            href={`https://${selectedLead.company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {selectedLead.company.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Lead created</p>
                            <p className="text-xs text-gray-500">{selectedLead.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">First contact made</p>
                            <p className="text-xs text-gray-500">{selectedLead.lastActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Follow-up scheduled</p>
                            <p className="text-xs text-gray-500">Tomorrow at 2:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        AI Insights & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Next Best Action</h4>
                        <p className="text-sm text-blue-800 mb-3">{selectedLead.aiInsights.nextAction}</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (selectedLead.aiInsights.nextAction.includes("call")) {
                              handleCall(selectedLead)
                            } else if (selectedLead.aiInsights.nextAction.includes("email")) {
                              handleEmail(selectedLead)
                            } else {
                              handleScheduleMeeting(selectedLead)
                            }
                          }}
                        >
                          Take Action
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Conversion Probability</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={selectedLead.aiInsights.probability} className="flex-1" />
                            <span className="text-sm font-medium">{selectedLead.aiInsights.probability}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Priority Level</label>
                          <Badge className={getPriorityColor(selectedLead.aiInsights.priority)}>
                            {selectedLead.aiInsights.priority}
                          </Badge>
                        </div>
                      </div>
                      {selectedLead.aiInsights.riskFactors.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Risk Factors</label>
                          <div className="mt-2 space-y-1">
                            {selectedLead.aiInsights.riskFactors.map((risk: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                {risk}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Create a new lead record with contact and company information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={newLead.contactName}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, contactName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={newLead.companyName}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={newLead.title}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="VP of Sales"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="50000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select
                  value={newLead.source}
                  onValueChange={(value) => setNewLead((prev) => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Cold Email">Cold Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={newLead.stage}
                  onValueChange={(value) => setNewLead((prev) => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newLead.notes}
                onChange={(e) => setNewLead((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLeadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead} disabled={isLoading || !newLead.contactName || !newLead.email}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add Lead
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={showEditLeadDialog} onOpenChange={setShowEditLeadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update lead information and details.</DialogDescription>
          </DialogHeader>
          {editingLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editContactName">Contact Name *</Label>
                  <Input
                    id="editContactName"
                    value={editingLead.contactName}
                    onChange={(e) => setEditingLead((prev) => ({ ...prev, contactName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCompanyName">Company Name</Label>
                  <Input
                    id="editCompanyName"
                    value={editingLead.companyName}
                    onChange={(e) => setEditingLead((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStage">Stage</Label>
                  <Select
                    value={editingLead.stage}
                    onValueChange={(value) => setEditingLead((prev) => ({ ...prev, stage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSource">Source</Label>
                  <Select
                    value={editingLead.source}
                    onValueChange={(value) => setEditingLead((prev) => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Cold Email">Cold Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditLeadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLead} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Lead
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkActionType.toLowerCase()} {selectedLeads.length} selected leads?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBulkActionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={executeBulkAction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${bulkActionType}`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
