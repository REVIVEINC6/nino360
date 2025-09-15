"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  CalendarIcon,
  Phone,
  Mail,
  Plus,
  Bot,
  Activity,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Building2,
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Search,
  Bell,
  TrendingUpIcon,
  BarChart3,
  PieChartIcon,
  Globe,
  Download,
  UserPlus,
  FileText,
  Settings,
  CheckCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
  PlayCircle,
  Wifi,
  WifiOff,
  MessageSquare,
  X,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import AIChatInterface from "@/components/ai/ai-chat-interface"
import { useRouter } from "next/navigation"

import {
  salesMetrics,
  pipelineData,
  revenueData,
  todaysActivities,
  aiInsights,
  leadSources,
  teamPerformance,
  quickActions,
} from "./data"

export default function AdvancedCRMDashboard() {
  // State management
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    metrics: salesMetrics,
    pipeline: pipelineData,
    revenue: revenueData,
    activities: todaysActivities,
    insights: aiInsights,
    leadSources: leadSources,
    team: teamPerformance,
  })

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const { toast } = useToast()

  // Add router hook after other hooks
  const router = useRouter()

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return

    const interval = setInterval(() => {
      // Simulate real-time metric updates
      setDashboardData((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalLeads: {
            ...prev.metrics.totalLeads,
            value: prev.metrics.totalLeads.value + Math.floor(Math.random() * 3),
          },
        },
      }))

      // Simulate new notifications
      if (Math.random() > 0.8) {
        setNotifications((prev) => prev + 1)
        toast({
          title: "New Activity",
          description: "A new lead has been added to your pipeline",
          duration: 3000,
        })
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [realTimeUpdates, toast])

  // Auto-refresh data
  const handleRefreshData = useCallback(async () => {
    setRefreshing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update data with slight variations
    setDashboardData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        totalLeads: {
          ...prev.metrics.totalLeads,
          value: prev.metrics.totalLeads.value + Math.floor(Math.random() * 10 - 5),
        },
      },
    }))

    setRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated successfully",
      duration: 2000,
    })
  }, [toast])

  // Utility functions
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }, [])

  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }, [])

  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`
  }, [])

  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return CalendarIcon
      case "demo":
        return PlayCircle
      case "proposal":
        return FileText
      default:
        return Activity
    }
  }, [])

  const getActivityColor = useCallback((type: string) => {
    switch (type) {
      case "call":
        return "bg-green-500"
      case "email":
        return "bg-blue-500"
      case "meeting":
        return "bg-purple-500"
      case "demo":
        return "bg-orange-500"
      case "proposal":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }, [])

  const getInsightIcon = useCallback((type: string) => {
    switch (type) {
      case "opportunity":
        return Target
      case "risk":
        return AlertTriangle
      case "upsell":
        return TrendingUpIcon
      case "lead":
        return Users
      case "prediction":
        return Brain
      default:
        return Lightbulb
    }
  }, [])

  // Add these navigation and action handlers after the existing handlers

  const handleNavigateToLeads = useCallback(() => {
    router.push("/crm/leads")
  }, [router])

  const handleNavigateToContacts = useCallback(() => {
    router.push("/crm/contacts")
  }, [router])

  const handleNavigateToCompanies = useCallback(() => {
    router.push("/crm/companies")
  }, [router])

  const handleNavigateToPipeline = useCallback(() => {
    router.push("/crm/pipeline")
  }, [router])

  const handleNavigateToAnalytics = useCallback(() => {
    router.push("/crm/analytics")
  }, [router])

  const handleNavigateToReports = useCallback(() => {
    router.push("/crm/reports")
  }, [router])

  const handleNavigateToSettings = useCallback(() => {
    router.push("/crm/settings")
  }, [router])

  const handleExportData = useCallback(
    async (type: string) => {
      toast({
        title: "Export Started",
        description: `Exporting ${type} data...`,
        duration: 2000,
      })

      // Simulate export process
      setTimeout(() => {
        const data =
          type === "pipeline"
            ? dashboardData.pipeline
            : type === "activities"
              ? dashboardData.activities
              : type === "team"
                ? dashboardData.team
                : dashboardData.revenue

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `crm-${type}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Export Complete",
          description: `${type} data exported successfully`,
          duration: 2000,
        })
      }, 1500)
    },
    [dashboardData, toast],
  )

  const handleScheduleMeeting = useCallback(
    (contact?: string, company?: string) => {
      toast({
        title: "Meeting Scheduler",
        description: `Opening calendar for ${contact || "new contact"}...`,
        duration: 2000,
      })

      // Simulate opening calendar/meeting scheduler
      setTimeout(() => {
        const newActivity = {
          id: Date.now(),
          time: "10:00 AM",
          type: "meeting",
          title: `Meeting with ${contact || "New Contact"}`,
          contact: contact || "New Contact",
          company: company || "New Company",
          status: "scheduled",
          priority: "medium",
          value: "$0",
          duration: "60 min",
          outcome: "Pending",
          nextAction: "Prepare meeting agenda",
          avatar: "/placeholder.svg?height=32&width=32&text=NC",
          tags: ["scheduled", "new"],
          notes: "Meeting scheduled via dashboard quick action",
          followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          dealStage: "prospecting",
          probability: 25,
        }

        setDashboardData((prev) => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
        }))

        toast({
          title: "Meeting Scheduled",
          description: `Meeting with ${contact || "New Contact"} has been scheduled`,
          duration: 3000,
        })
      }, 1000)
    },
    [toast],
  )

  const handleSendEmail = useCallback(
    (contact?: string, template?: string) => {
      toast({
        title: "Email Composer",
        description: `Opening email composer for ${contact || "new contact"}...`,
        duration: 2000,
      })

      // Simulate email sending
      setTimeout(() => {
        const newActivity = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "email",
          title: `Email sent to ${contact || "New Contact"}`,
          contact: contact || "New Contact",
          company: "Unknown Company",
          status: "completed",
          priority: "medium",
          value: "$0",
          duration: "5 min",
          outcome: "Email sent successfully",
          nextAction: "Wait for response",
          avatar: "/placeholder.svg?height=32&width=32&text=NC",
          tags: ["email", "outbound"],
          notes: `Email sent using ${template || "default"} template`,
          followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          dealStage: "prospecting",
          probability: 15,
        }

        setDashboardData((prev) => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
        }))

        toast({
          title: "Email Sent",
          description: `Email sent to ${contact || "New Contact"} successfully`,
          duration: 3000,
        })
      }, 800)
    },
    [toast],
  )

  const handleCreateProposal = useCallback(
    (deal?: any) => {
      toast({
        title: "Proposal Generator",
        description: "Opening proposal generator...",
        duration: 2000,
      })

      // Simulate proposal creation
      setTimeout(() => {
        const newActivity = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "proposal",
          title: `Proposal created for ${deal?.name || "New Opportunity"}`,
          contact: deal?.contact || "New Contact",
          company: deal?.company || "New Company",
          status: "completed",
          priority: "high",
          value: deal?.value || "$50K",
          duration: "30 min",
          outcome: "Proposal generated and ready for review",
          nextAction: "Send proposal to client",
          avatar: "/placeholder.svg?height=32&width=32&text=NC",
          tags: ["proposal", "generated"],
          notes: "Proposal created using AI-powered template with custom pricing",
          followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          dealStage: "proposal",
          probability: 60,
        }

        setDashboardData((prev) => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
        }))

        toast({
          title: "Proposal Created",
          description: "Proposal has been generated and is ready for review",
          duration: 3000,
        })
      }, 1200)
    },
    [toast],
  )

  const handleLogCall = useCallback(
    (contact?: string, outcome?: string) => {
      toast({
        title: "Call Logger",
        description: "Opening call logging form...",
        duration: 2000,
      })

      // Simulate call logging
      setTimeout(() => {
        const newActivity = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "call",
          title: `Call with ${contact || "New Contact"}`,
          contact: contact || "New Contact",
          company: "Unknown Company",
          status: "completed",
          priority: "medium",
          value: "$25K",
          duration: "20 min",
          outcome: outcome || "Positive conversation, interested in our solution",
          nextAction: "Send follow-up email with pricing",
          avatar: "/placeholder.svg?height=32&width=32&text=NC",
          tags: ["call", "logged"],
          notes: "Call logged via dashboard quick action",
          followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          dealStage: "qualification",
          probability: 45,
        }

        setDashboardData((prev) => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
        }))

        toast({
          title: "Call Logged",
          description: `Call with ${contact || "New Contact"} has been logged`,
          duration: 3000,
        })
      }, 800)
    },
    [toast],
  )

  const handleAddNewLead = useCallback(() => {
    toast({
      title: "Lead Creator",
      description: "Opening new lead form...",
      duration: 2000,
    })

    // Simulate lead creation
    setTimeout(() => {
      const leadNames = ["TechStart Inc", "Innovation Labs", "Digital Solutions", "Future Corp", "Smart Systems"]
      const contacts = ["John Smith", "Sarah Johnson", "Mike Chen", "Lisa Wang", "David Brown"]
      const randomLead = leadNames[Math.floor(Math.random() * leadNames.length)]
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)]

      setDashboardData((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalLeads: {
            ...prev.metrics.totalLeads,
            value: prev.metrics.totalLeads.value + 1,
          },
        },
      }))

      const newActivity = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "lead",
        title: `New lead: ${randomLead}`,
        contact: randomContact,
        company: randomLead,
        status: "pending",
        priority: "medium",
        value: "$35K",
        duration: "5 min",
        outcome: "Lead created and assigned",
        nextAction: "Initial outreach within 24 hours",
        avatar: "/placeholder.svg?height=32&width=32&text=NL",
        tags: ["new-lead", "inbound"],
        notes: "Lead created via dashboard quick action",
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        dealStage: "prospecting",
        probability: 20,
      }

      setDashboardData((prev) => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
      }))

      toast({
        title: "Lead Created",
        description: `New lead ${randomLead} has been added to your pipeline`,
        duration: 3000,
      })
    }, 1000)
  }, [toast])

  const handleManageTeam = useCallback(() => {
    toast({
      title: "Team Management",
      description: "Opening team management interface...",
      duration: 2000,
    })

    setTimeout(() => {
      router.push("/crm/settings/users")
    }, 1000)
  }, [router, toast])

  const handleViewAllInsights = useCallback(() => {
    setIsAIDrawerOpen(true)
    toast({
      title: "AI Insights",
      description: "Opening AI insights panel...",
      duration: 2000,
    })
  }, [])

  const handleConfigurePipeline = useCallback(() => {
    toast({
      title: "Pipeline Configuration",
      description: "Opening pipeline settings...",
      duration: 2000,
    })

    setTimeout(() => {
      router.push("/crm/settings/workflows")
    }, 1000)
  }, [router, toast])

  const handleViewAllActivities = useCallback(() => {
    router.push("/crm/engagements")
  }, [router])

  const handleViewCalendar = useCallback(() => {
    router.push("/crm/calendar")
  }, [router])

  // Event handlers
  const handleQuickAction = useCallback(
    (actionId: number) => {
      const action = quickActions.find((a) => a.id === actionId)
      if (!action) return

      toast({
        title: `${action.title} Started`,
        description: action.description,
        duration: 2000,
      })

      // Simulate action execution
      switch (actionId) {
        case 1: // Add New Lead
          setShowQuickActions(false)
          // Open lead creation modal/form
          break
        case 2: // Schedule Meeting
          // Open calendar/meeting scheduler
          break
        case 3: // Send Email
          // Open email composer
          break
        case 4: // Create Proposal
          // Open proposal generator
          break
        case 5: // Log Call
          // Open call logging form
          break
        case 6: // Update Deal
          // Open deal update form
          break
      }
    },
    [toast],
  )

  const handleInsightAction = useCallback(
    (insight: any) => {
      setSelectedInsight(insight)

      // Mark insight as read
      setDashboardData((prev) => ({
        ...prev,
        insights: prev.insights.map((i) => (i.id === insight.id ? { ...i, isRead: true } : i)),
      }))

      toast({
        title: "Action Initiated",
        description: `${insight.action} has been started`,
        duration: 3000,
      })
    },
    [toast],
  )

  const handleActivityUpdate = useCallback(
    (activityId: number, updates: any) => {
      setDashboardData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity) =>
          activity.id === activityId ? { ...activity, ...updates } : activity,
        ),
      }))

      toast({
        title: "Activity Updated",
        description: "Activity has been updated successfully",
        duration: 2000,
      })
    },
    [toast],
  )

  const handleDealStageChange = useCallback(
    (dealId: number, newStage: string) => {
      // Update pipeline data
      setDashboardData((prev) => {
        const updatedPipeline = prev.pipeline.map((stage) => ({
          ...stage,
          deals: stage.deals?.map((deal) => (deal.id === dealId ? { ...deal, stage: newStage } : deal)) || [],
        }))

        return {
          ...prev,
          pipeline: updatedPipeline,
        }
      })

      toast({
        title: "Deal Stage Updated",
        description: `Deal moved to ${newStage} stage`,
        duration: 2000,
      })
    },
    [toast],
  )

  const handleTeamMemberClick = useCallback((member: any) => {
    setSelectedTeamMember(member)
  }, [])

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }, [])

  const handleTimeframeChange = useCallback(
    (timeframe: string) => {
      setSelectedTimeframe(timeframe)

      // Simulate data refresh for new timeframe
      toast({
        title: "Timeframe Updated",
        description: `Data updated for ${timeframe} period`,
        duration: 2000,
      })
    },
    [toast],
  )

  // Computed values
  const filteredActivities = useMemo(() => {
    let filtered = dashboardData.activities

    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.contact.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter(
        (activity) =>
          activeFilters.includes(activity.status) ||
          activeFilters.includes(activity.priority) ||
          activeFilters.includes(activity.type),
      )
    }

    return filtered
  }, [dashboardData.activities, searchQuery, activeFilters])

  const unreadInsights = useMemo(() => {
    return dashboardData.insights.filter((insight) => !insight.isRead).length
  }, [dashboardData.insights])

  const totalPipelineValue = useMemo(() => {
    return dashboardData.pipeline.reduce((total, stage) => total + stage.value, 0)
  }, [dashboardData.pipeline])

  const avgDealSize = useMemo(() => {
    const totalDeals = dashboardData.pipeline.reduce((total, stage) => total + stage.count, 0)
    return totalDeals > 0 ? totalPipelineValue / totalDeals : 0
  }, [totalPipelineValue, dashboardData.pipeline])

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Glassmorphism Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
            >
              <BarChart3 className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                CRM Dashboard
              </motion.h1>
              <motion.p
                className="text-sm lg:text-base text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                AI-powered sales intelligence and pipeline management
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/50 backdrop-blur-sm border-white/20 focus:bg-white/70"
              />
            </div>

            {/* Timeframe Selector */}
            <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-24 bg-white/50 backdrop-blur-sm border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>

            {/* Real-time Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              className={`bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 ${
                realTimeUpdates ? "text-green-600" : "text-gray-600"
              }`}
            >
              {realTimeUpdates ? <Wifi className="mr-2 h-4 w-4" /> : <WifiOff className="mr-2 h-4 w-4" />}
              <span className="hidden lg:inline">{realTimeUpdates ? "Live" : "Static"}</span>
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={refreshing}
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden lg:inline">Refresh</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="outline"
              size="sm"
              className="relative bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Quick Actions */}
            <Popover open={showQuickActions} onOpenChange={setShowQuickActions}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">Quick</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="ghost"
                        className="h-auto p-3 flex flex-col items-start gap-1 hover:bg-muted"
                        onClick={() => {
                          switch (action.id) {
                            case 1:
                              handleAddNewLead()
                              break
                            case 2:
                              handleScheduleMeeting()
                              break
                            case 3:
                              handleSendEmail()
                              break
                            case 4:
                              handleCreateProposal()
                              break
                            case 5:
                              handleLogCall()
                              break
                            case 6:
                              handleNavigateToPipeline()
                              break
                            default:
                              handleQuickAction(action.id)
                          }
                          setShowQuickActions(false)
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`p-1 rounded ${action.color} text-white`}>
                            <action.icon className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium">{action.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">{action.description}</span>
                        <span className="text-xs text-muted-foreground font-mono">{action.shortcut}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {/* AI Copilot */}
            <Sheet open={isAIDrawerOpen} onOpenChange={setIsAIDrawerOpen}>
              <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Bot className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">AI Copilot</span>
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[540px] bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border-l border-white/20">
                <AIChatInterface module="crm" />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 lg:space-y-8 relative z-10">
        {/* Summary Cards Row */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Leads",
              value: formatNumber(dashboardData.metrics.totalLeads.value),
              change: dashboardData.metrics.totalLeads.change,
              trend: dashboardData.metrics.totalLeads.trend,
              target: dashboardData.metrics.totalLeads.target,
              progress: dashboardData.metrics.totalLeads.progress,
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
              subtitle: `${formatNumber(dashboardData.metrics.totalLeads.weeklyGrowth)}% this week`,
            },
            {
              title: "Active Accounts",
              value: formatNumber(dashboardData.metrics.activeAccounts.value),
              change: dashboardData.metrics.activeAccounts.change,
              trend: dashboardData.metrics.activeAccounts.trend,
              target: dashboardData.metrics.activeAccounts.target,
              progress: dashboardData.metrics.activeAccounts.progress,
              icon: Building2,
              gradient: "from-purple-500 to-pink-500",
              subtitle: `${formatNumber(dashboardData.metrics.activeAccounts.weeklyGrowth)}% this week`,
            },
            {
              title: "Active Opportunities",
              value: formatNumber(dashboardData.metrics.activeOpportunities.value),
              change: dashboardData.metrics.activeOpportunities.change,
              trend: dashboardData.metrics.activeOpportunities.trend,
              target: dashboardData.metrics.activeOpportunities.target,
              progress: dashboardData.metrics.activeOpportunities.progress,
              icon: Target,
              gradient: "from-orange-500 to-red-500",
              subtitle: `${formatCurrency(avgDealSize)} avg deal size`,
            },
            {
              title: "Revenue Forecast",
              value: formatCurrency(dashboardData.metrics.revenueForecast.value),
              change: dashboardData.metrics.revenueForecast.change,
              trend: dashboardData.metrics.revenueForecast.trend,
              target: dashboardData.metrics.revenueForecast.target,
              progress: dashboardData.metrics.revenueForecast.progress,
              icon: DollarSign,
              gradient: "from-green-500 to-emerald-500",
              subtitle: `${formatPercentage(dashboardData.metrics.revenueForecast.weeklyGrowth)} this week`,
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer"
              onClick={() => {
                switch (metric.title) {
                  case "Total Leads":
                    handleNavigateToLeads()
                    break
                  case "Active Accounts":
                    handleNavigateToContacts()
                    break
                  case "Active Opportunities":
                    handleNavigateToPipeline()
                    break
                  case "Revenue Forecast":
                    handleNavigateToAnalytics()
                    break
                }
              }}
            >
              <Card className="relative overflow-hidden bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 group-hover:bg-white/70">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-br ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <metric.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight mb-2">{metric.value}</div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">vs target</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress to target</span>
                      <span className="font-medium">{metric.progress}%</span>
                    </div>
                    <Progress value={metric.progress} className="h-2" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{metric.subtitle}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pipeline Funnel and Revenue Chart */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pipeline Funnel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                          <PieChartIcon className="h-5 w-5" />
                          Sales Pipeline
                        </CardTitle>
                        <CardDescription>{formatCurrency(totalPipelineValue)} total pipeline value</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 backdrop-blur-sm"
                          onClick={() => handleFilterChange("pipeline")}
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 backdrop-blur-sm"
                          onClick={handleNavigateToPipeline}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.pipeline.map((stage, index) => (
                        <motion.div
                          key={stage.stage}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedDeal(stage)}
                        >
                          <div className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-white">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full shadow-sm group-hover:scale-125 transition-transform duration-300"
                                  style={{ backgroundColor: stage.color }}
                                />
                                <h3 className="font-semibold text-gray-700">{stage.stage}</h3>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <div className="text-lg font-bold" style={{ color: stage.color }}>
                                  {stage.count}
                                </div>
                                <div className="text-xs text-muted-foreground">Deals</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-green-600">{formatCurrency(stage.value)}</div>
                                <div className="text-xs text-muted-foreground">Value</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-blue-600">{stage.conversion}%</div>
                                <div className="text-xs text-muted-foreground">Conv. Rate</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Avg Deal Size: {formatCurrency(stage.avgDealSize)}</span>
                                <span>Avg Time: {stage.avgTimeInStage} days</span>
                              </div>
                              <Progress
                                value={stage.conversion}
                                className="h-2"
                                style={{
                                  background: `linear-gradient(to right, ${stage.color}20, ${stage.color}40)`,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Revenue Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Revenue Analytics
                        </CardTitle>
                        <CardDescription>Performance vs forecast with trends</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={selectedTimeframe === "30d" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTimeframeChange("30d")}
                          className="bg-white/50 backdrop-blur-sm"
                        >
                          30d
                        </Button>
                        <Button
                          variant={selectedTimeframe === "90d" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTimeframeChange("90d")}
                          className="bg-white/50 backdrop-blur-sm"
                        >
                          90d
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={dashboardData.revenue}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value: any, name: string) => [
                            formatCurrency(value),
                            name === "revenue" ? "Actual Revenue" : "Forecast",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="forecast"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          fill="url(#forecastGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Insights and Lead Sources */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          AI Insights
                          {unreadInsights > 0 && <Badge className="bg-red-500 text-white">{unreadInsights} new</Badge>}
                        </CardTitle>
                        <CardDescription>Intelligent recommendations to accelerate your sales</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewAllInsights}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {dashboardData.insights.slice(0, 5).map((insight, index) => {
                          const Icon = getInsightIcon(insight.type)
                          return (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                insight.isRead
                                  ? "bg-gray-50 border-gray-200"
                                  : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md"
                              } hover:shadow-lg`}
                              onClick={() => handleInsightAction(insight)}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-2 rounded-lg ${getPriorityColor(insight.priority)} text-white shadow-sm`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-800 truncate">{insight.title}</h4>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          insight.priority === "urgent"
                                            ? "border-red-200 text-red-700 bg-red-50"
                                            : insight.priority === "high"
                                              ? "border-orange-200 text-orange-700 bg-orange-50"
                                              : "border-blue-200 text-blue-700 bg-blue-50"
                                        }`}
                                      >
                                        {insight.priority}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(insight.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{insight.description}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {insight.confidence}% confidence
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {insight.impact}
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs bg-white/50 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleInsightAction(insight)

                                        // Execute specific actions based on insight type
                                        switch (insight.type) {
                                          case "opportunity":
                                            handleScheduleMeeting(
                                              insight.title.includes("TechCorp") ? "John Smith" : "Unknown Contact",
                                            )
                                            break
                                          case "risk":
                                            handleSendEmail(
                                              insight.title.includes("DataFlow") ? "Sarah Johnson" : "Unknown Contact",
                                              "follow-up",
                                            )
                                            break
                                          case "upsell":
                                            handleCreateProposal({ name: "CloudTech Expansion", value: "$125K" })
                                            break
                                          case "lead":
                                            handleAddNewLead()
                                            break
                                          default:
                                            handleNavigateToAnalytics()
                                        }
                                      }}
                                    >
                                      Take Action
                                      <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Lead Sources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Lead Sources
                    </CardTitle>
                    <CardDescription>Performance by acquisition channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={dashboardData.leadSources}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dashboardData.leadSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => [`${value}%`, "Share"]}
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-3">
                        {dashboardData.leadSources.map((source, index) => (
                          <motion.div
                            key={source.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                              <span className="font-medium text-sm">{source.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{source.value}%</div>
                              <div className="text-xs text-muted-foreground">{formatNumber(source.count)} leads</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            {/* Detailed Pipeline View */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Pipeline Management</CardTitle>
                      <CardDescription>Detailed view of all deals in your sales pipeline</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportData("pipeline")}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleConfigurePipeline}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-5">
                    {dashboardData.pipeline.map((stage, stageIndex) => (
                      <motion.div
                        key={stage.stage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: stageIndex * 0.1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{stage.stage}</h3>
                          <Badge variant="outline" className="bg-white/50">
                            {stage.count}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                          {formatCurrency(stage.value)} total value
                        </div>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-3">
                            {stage.deals?.map((deal, dealIndex) => (
                              <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: dealIndex * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => setSelectedDeal(deal)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-green-600 font-semibold">{formatCurrency(deal.value)}</span>
                                    <span className="text-muted-foreground">{deal.probability}% prob.</span>
                                  </div>
                                  <Progress value={deal.probability} className="h-1" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {/* Activities Management */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Today's Activities</CardTitle>
                      <CardDescription>Manage your sales activities and follow-ups</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search activities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                            {activeFilters.length > 0 && (
                              <Badge className="ml-2 bg-blue-500 text-white">{activeFilters.length}</Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Filter Activities</h4>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <div className="flex flex-wrap gap-2">
                                {["completed", "in-progress", "pending", "scheduled"].map((status) => (
                                  <Button
                                    key={status}
                                    variant={activeFilters.includes(status) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFilterChange(status)}
                                    className="text-xs"
                                  >
                                    {status}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <div className="flex flex-wrap gap-2">
                                {["urgent", "high", "medium", "low"].map((priority) => (
                                  <Button
                                    key={priority}
                                    variant={activeFilters.includes(priority) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFilterChange(priority)}
                                    className="text-xs"
                                  >
                                    {priority}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <div className="flex flex-wrap gap-2">
                                {["call", "email", "meeting", "demo", "proposal"].map((type) => (
                                  <Button
                                    key={type}
                                    variant={activeFilters.includes(type) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFilterChange(type)}
                                    className="text-xs"
                                  >
                                    {type}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setActiveFilters([])} className="w-full">
                              Clear Filters
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/50 backdrop-blur-sm"
                        onClick={() => handleScheduleMeeting()}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {filteredActivities.map((activity, index) => {
                        const ActivityIcon = getActivityIcon(activity.type)
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            className="group p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedActivity(activity)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-2">
                                <div
                                  className={`p-2 rounded-lg ${getActivityColor(activity.type)} text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <ActivityIcon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{activity.time}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800 truncate">{activity.title}</h4>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                                      {activity.status}
                                    </Badge>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <div className="text-sm font-medium text-gray-700">{activity.contact}</div>
                                    <div className="text-xs text-muted-foreground">{activity.company}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-green-600">{activity.value}</div>
                                    <div className="text-xs text-muted-foreground">Deal Value</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-blue-600">{activity.probability}%</div>
                                    <div className="text-xs text-muted-foreground">Close Probability</div>
                                  </div>
                                </div>
                                {activity.notes && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.notes}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {activity.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs bg-white/50 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedActivity(activity)
                                      }}
                                    >
                                      <Edit className="mr-1 h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs bg-white/50 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleActivityUpdate(activity.id, { status: "completed" })
                                      }}
                                    >
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Complete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Team Performance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Team Performance</CardTitle>
                      <CardDescription>Monitor your sales team's performance and activities</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/50 backdrop-blur-sm"
                        onClick={handleManageTeam}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Manage Team
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/50 backdrop-blur-sm"
                        onClick={handleNavigateToAnalytics}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {dashboardData.team.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="group p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => handleTeamMemberClick(member)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all duration-300">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                member.status === "active" ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-lg font-bold ${
                                    member.performance >= 100 ? "text-green-600" : "text-orange-600"
                                  }`}
                                >
                                  {member.performance}%
                                </div>
                                <div className="text-xs text-muted-foreground">vs target</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-lg font-bold text-blue-600">{member.deals}</div>
                                <div className="text-xs text-muted-foreground">Deals</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-green-600">{formatCurrency(member.revenue)}</div>
                                <div className="text-xs text-muted-foreground">Revenue</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-purple-600">{member.activities}</div>
                                <div className="text-xs text-muted-foreground">Activities</div>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-xs">
                                <span>Progress to target</span>
                                <span className="font-medium">{member.performance}%</span>
                              </div>
                              <Progress
                                value={member.performance}
                                className="h-2"
                                style={{
                                  background:
                                    member.performance >= 100
                                      ? "linear-gradient(to right, #10b98120, #10b98140)"
                                      : "linear-gradient(to right, #f59e0b20, #f59e0b40)",
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {member.callsToday} calls
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {member.emailsToday} emails
                                </span>
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {member.meetingsToday} meetings
                                </span>
                              </div>
                              <span>{member.lastActivity}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-xs text-muted-foreground mb-2">Top Deals:</div>
                              <div className="space-y-1">
                                {member.topDeals.slice(0, 2).map((deal: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                    <span className="truncate">{deal.name}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className="font-semibold text-green-600">{formatCurrency(deal.value)}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {deal.stage}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Selected Deal Modal */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Deal Details</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDeal(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="p-6 max-h-[60vh]">
                <div className="space-y-6">
                  {selectedDeal.stage && (
                    <>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{selectedDeal.stage}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(selectedDeal.value)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Value</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{selectedDeal.count}</div>
                            <div className="text-sm text-muted-foreground">Active Deals</div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3">Stage Metrics</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-lg font-bold">{selectedDeal.conversion}%</div>
                            <div className="text-xs text-muted-foreground">Conversion Rate</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{formatCurrency(selectedDeal.avgDealSize)}</div>
                            <div className="text-xs text-muted-foreground">Avg Deal Size</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{selectedDeal.avgTimeInStage}</div>
                            <div className="text-xs text-muted-foreground">Avg Days in Stage</div>
                          </div>
                        </div>
                      </div>
                      {selectedDeal.deals && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-3">Top Deals in Stage</h4>
                            <div className="space-y-3">
                              {selectedDeal.deals.slice(0, 5).map((deal: any) => (
                                <div
                                  key={deal.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                >
                                  <div>
                                    <div className="font-medium">{deal.name}</div>
                                    <div className="text-sm text-muted-foreground">{deal.probability}% probability</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">{formatCurrency(deal.value)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Activity Details</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="p-6 max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedActivity.title}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getStatusColor(selectedActivity.status)}>{selectedActivity.status}</Badge>
                      <Badge className={`${getPriorityColor(selectedActivity.priority)} text-white`}>
                        {selectedActivity.priority} priority
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedActivity.time} • {selectedActivity.duration}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">{selectedActivity.contact}</div>
                          <div className="text-sm text-muted-foreground">{selectedActivity.company}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Deal Information</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium text-green-600">{selectedActivity.value}</div>
                          <div className="text-sm text-muted-foreground">Deal Value</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-600">{selectedActivity.probability}%</div>
                          <div className="text-sm text-muted-foreground">Close Probability</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedActivity.notes}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Outcome</h4>
                    <p className="text-sm text-gray-600">{selectedActivity.outcome}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Next Action</h4>
                    <p className="text-sm text-gray-600">{selectedActivity.nextAction}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleActivityUpdate(selectedActivity.id, { status: "completed" })
                      setSelectedActivity(null)
                    }}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Team Member Modal */}
      <AnimatePresence>
        {selectedTeamMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTeamMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedTeamMember.avatar || "/placeholder.svg"}
                        alt={selectedTeamMember.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {selectedTeamMember.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTeamMember.name}</h2>
                      <p className="text-muted-foreground">{selectedTeamMember.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTeamMember(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="p-6 max-h-[60vh]">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedTeamMember.deals}</div>
                      <div className="text-sm text-muted-foreground">Active Deals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedTeamMember.revenue)}
                      </div>
                      <div className="text-sm text-muted-foreground">Revenue Generated</div>
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold ${
                          selectedTeamMember.performance >= 100 ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {selectedTeamMember.performance}%
                      </div>
                      <div className="text-sm text-muted-foreground">Performance vs Target</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Today's Activity</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{selectedTeamMember.callsToday}</span>
                        <span className="text-sm text-muted-foreground">calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{selectedTeamMember.emailsToday}</span>
                        <span className="text-sm text-muted-foreground">emails</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{selectedTeamMember.meetingsToday}</span>
                        <span className="text-sm text-muted-foreground">meetings</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Top Deals</h4>
                    <div className="space-y-3">
                      {selectedTeamMember.topDeals.map((deal: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div>
                            <div className="font-medium">{deal.name}</div>
                            <Badge variant="outline" className="mt-1">
                              {deal.stage}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{formatCurrency(deal.value)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Performance Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target: {formatCurrency(selectedTeamMember.target)}</span>
                        <span>Current: {formatCurrency(selectedTeamMember.revenue)}</span>
                      </div>
                      <Progress value={selectedTeamMember.performance} className="h-3" />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelectedTeamMember(null)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleSendEmail(selectedTeamMember.name, "team-message")
                      setSelectedTeamMember(null)
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
