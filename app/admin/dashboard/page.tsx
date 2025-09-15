"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

import { AlertTitle } from "@/components/ui/alert"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth/rbac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  Clock,
  Cpu,
  Database,
  DollarSign,
  Download,
  Eye,
  HardDrive,
  Heart,
  Lightbulb,
  Lock,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Wifi,
  CheckCircle,
  XCircle,
  Pause,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Types and Interfaces
interface SystemMetrics {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  activeUsers: number
  systemUptime: number
  cpuUsage: number
  memoryUsage: number
  storageUsage: number
  networkTraffic: number
  apiCalls: number
  revenue: number
  costs: number
  complianceScore: number
}

interface TenantHealth {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "inactive"
  healthScore: number
  churnRisk: number
  users: number
  revenue: number
  lastActivity: string
  modules: string[]
  complianceStatus: "compliant" | "warning" | "non-compliant"
  aiInsights: string[]
  domain: string
  plan: string
  contact: {
    name: string
    email: string
    phone: string
  }
}

interface AIInsight {
  id: string
  type: "prediction" | "recommendation" | "alert" | "optimization"
  title: string
  description: string
  confidence: number
  priority: "low" | "medium" | "high" | "critical"
  category: "churn" | "revenue" | "security" | "performance" | "compliance"
  actionable: boolean
  timestamp: string
  status: "new" | "acknowledged" | "resolved" | "dismissed"
  tenantId?: string
  recommendedActions?: string[]
}

interface AutomationTask {
  id: string
  name: string
  type: "billing" | "backup" | "compliance" | "onboarding" | "maintenance"
  status: "running" | "completed" | "failed" | "scheduled" | "paused"
  progress: number
  lastRun: string
  nextRun: string
  description: string
  frequency: string
  enabled: boolean
  logs: string[]
  config: Record<string, any>
}

interface LiveActivity {
  id: string
  type: "login" | "action" | "alert" | "system" | "billing"
  user: string
  tenant: string
  description: string
  timestamp: string
  severity: "info" | "warning" | "error" | "success"
  metadata: Record<string, any>
}

interface BillingData {
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
  topModules: Array<{ name: string; revenue: number; growth: number }>
  upcomingRenewals: Array<{ tenant: string; amount: number; date: string; risk: string }>
  licenseUsage: Array<{ module: string; used: number; total: number; percentage: number }>
  failedPayments: Array<{ tenant: string; amount: number; reason: string; date: string }>
  revenueGrowth: number
  churnRate: number
  averageRevenuePerUser: number
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface DashboardData {
  overview: {
    totalUsers: number
    activeUsers: number
    systemHealth: number
    securityScore: number
    revenue: number
    growthRate: number
  }
  systemMetrics: {
    cpu: number
    memory: number
    storage: number
    network: number
    uptime: string
    responseTime: number
  }
  aiInsights: Array<{
    id: string
    type: string
    title: string
    description: string
    confidence: number
    impact: string
    recommendations: string[]
    estimatedValue?: number
    category: string
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    action: string
    resource: string
    user: string
    timestamp: string
    details: any
  }>
  userAnalytics: {
    byRole: Record<string, number>
    activeVsInactive: { active: number; inactive: number }
    recentLogins: number
  }
  securityOverview: {
    threatLevel: string
    recentEvents: number
    vulnerabilities: number
  }
}

export default function AdminDashboard() {
  const { user, profile } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [automationRules, setAutomationRules] = useState<any[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [copilotQuery, setCopilotQuery] = useState("")
  const [copilotResponse, setCopilotResponse] = useState("")
  const [copilotLoading, setCopilotLoading] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantHealth | null>(null)
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null)
  const [widgetLayout, setWidgetLayout] = useState("grid")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  const { toast } = useToast()

  // Sample Data with more comprehensive information
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalTenants: 1247,
    activeTenants: 1156,
    totalUsers: 15632,
    activeUsers: 12847,
    systemUptime: 99.97,
    cpuUsage: 67,
    memoryUsage: 72,
    storageUsage: 84,
    networkTraffic: 1.2,
    apiCalls: 2847293,
    revenue: 2847293,
    costs: 847293,
    complianceScore: 94,
  })

  const [tenantHealth, setTenantHealth] = useState<TenantHealth[]>([
    {
      id: "1",
      name: "TechCorp",
      status: "healthy",
      healthScore: 95,
      churnRisk: 12,
      users: 1250,
      revenue: 15000,
      lastActivity: "2 min ago",
      modules: ["CRM", "HRMS", "Talent"],
      complianceStatus: "compliant",
      aiInsights: ["High engagement", "Revenue growing", "Low churn risk"],
      domain: "techcorp.com",
      plan: "Enterprise",
      contact: {
        name: "John Smith",
        email: "john@techcorp.com",
        phone: "+1-555-0123",
      },
    },
    {
      id: "2",
      name: "GlobalCorp",
      status: "warning",
      healthScore: 78,
      churnRisk: 45,
      users: 980,
      revenue: 8500,
      lastActivity: "1 hour ago",
      modules: ["CRM", "Finance"],
      complianceStatus: "warning",
      aiInsights: ["Declining usage", "Payment delays", "Consider retention offer"],
      domain: "globalcorp.com",
      plan: "Professional",
      contact: {
        name: "Jane Doe",
        email: "jane@globalcorp.com",
        phone: "+1-555-0456",
      },
    },
    {
      id: "3",
      name: "InnovateLtd",
      status: "critical",
      healthScore: 45,
      churnRisk: 78,
      users: 750,
      revenue: 12000,
      lastActivity: "3 days ago",
      modules: ["HRMS"],
      complianceStatus: "non-compliant",
      aiInsights: ["High churn risk", "Inactive users", "Immediate intervention needed"],
      domain: "innovate.com",
      plan: "Enterprise",
      contact: {
        name: "Mike Johnson",
        email: "mike@innovate.com",
        phone: "+1-555-0789",
      },
    },
    {
      id: "4",
      name: "StartupXYZ",
      status: "healthy",
      healthScore: 88,
      churnRisk: 23,
      users: 420,
      revenue: 2100,
      lastActivity: "30 min ago",
      modules: ["Talent", "Training"],
      complianceStatus: "compliant",
      aiInsights: ["Growing team", "High adoption", "Expansion opportunity"],
      domain: "startupxyz.com",
      plan: "Starter",
      contact: {
        name: "Sarah Wilson",
        email: "sarah@startupxyz.com",
        phone: "+1-555-0321",
      },
    },
    {
      id: "5",
      name: "MegaInc",
      status: "inactive",
      healthScore: 15,
      churnRisk: 95,
      users: 1100,
      revenue: 0,
      lastActivity: "2 weeks ago",
      modules: [],
      complianceStatus: "non-compliant",
      aiInsights: ["Account suspended", "Payment failed", "Requires immediate attention"],
      domain: "megainc.com",
      plan: "Enterprise",
      contact: {
        name: "David Brown",
        email: "david@megainc.com",
        phone: "+1-555-0654",
      },
    },
  ])

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "prediction",
      title: "Churn Risk Alert",
      description: "GlobalCorp shows 78% probability of churning within 30 days based on usage patterns",
      confidence: 87,
      priority: "high",
      category: "churn",
      actionable: true,
      timestamp: "2 min ago",
      status: "new",
      tenantId: "2",
      recommendedActions: [
        "Schedule retention call",
        "Offer discount or upgrade incentive",
        "Provide additional training resources",
      ],
    },
    {
      id: "2",
      type: "recommendation",
      title: "Revenue Optimization",
      description: "TechCorp is ready for Enterprise plan upgrade - potential $5K MRR increase",
      confidence: 92,
      priority: "medium",
      category: "revenue",
      actionable: true,
      timestamp: "15 min ago",
      status: "new",
      tenantId: "1",
      recommendedActions: ["Present upgrade proposal", "Highlight new features", "Schedule demo of premium features"],
    },
    {
      id: "3",
      type: "alert",
      title: "Security Anomaly",
      description: "Unusual login patterns detected from InnovateLtd - potential security breach",
      confidence: 95,
      priority: "critical",
      category: "security",
      actionable: true,
      timestamp: "1 hour ago",
      status: "acknowledged",
      tenantId: "3",
      recommendedActions: ["Force password reset", "Enable 2FA", "Review access logs"],
    },
    {
      id: "4",
      type: "optimization",
      title: "Performance Improvement",
      description: "System performance can be improved by 23% with database optimization",
      confidence: 78,
      priority: "low",
      category: "performance",
      actionable: true,
      timestamp: "3 hours ago",
      status: "new",
      recommendedActions: ["Schedule maintenance window", "Optimize database queries", "Update indexes"],
    },
  ])

  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([
    {
      id: "1",
      name: "Daily Backup",
      type: "backup",
      status: "completed",
      progress: 100,
      lastRun: "2 hours ago",
      nextRun: "22 hours",
      description: "Automated daily backup of all tenant data",
      frequency: "Daily at 2:00 AM",
      enabled: true,
      logs: [
        "2024-01-15 02:00:00 - Backup started",
        "2024-01-15 02:45:00 - Backup completed successfully",
        "2024-01-15 02:45:01 - 2.4GB backed up",
      ],
      config: {
        retentionDays: 30,
        compression: true,
        encryption: true,
      },
    },
    {
      id: "2",
      name: "Billing Reminders",
      type: "billing",
      status: "running",
      progress: 65,
      lastRun: "Running",
      nextRun: "N/A",
      description: "Send payment reminders to tenants with overdue invoices",
      frequency: "Weekly on Monday",
      enabled: true,
      logs: [
        "2024-01-15 09:00:00 - Started billing reminder process",
        "2024-01-15 09:15:00 - Processing 15 overdue accounts",
        "2024-01-15 09:30:00 - 10 reminders sent successfully",
      ],
      config: {
        reminderDays: [7, 14, 30],
        escalationEnabled: true,
        ccAdmin: true,
      },
    },
    {
      id: "3",
      name: "Compliance Check",
      type: "compliance",
      status: "scheduled",
      progress: 0,
      lastRun: "1 week ago",
      nextRun: "6 days",
      description: "Automated compliance audit for all tenants",
      frequency: "Weekly on Sunday",
      enabled: true,
      logs: [
        "2024-01-08 00:00:00 - Compliance check started",
        "2024-01-08 01:30:00 - Checked 1247 tenants",
        "2024-01-08 01:30:01 - 94% compliance rate",
      ],
      config: {
        checkGDPR: true,
        checkSOC2: true,
        checkISO27001: true,
        generateReport: true,
      },
    },
    {
      id: "4",
      name: "User Onboarding",
      type: "onboarding",
      status: "failed",
      progress: 45,
      lastRun: "1 hour ago",
      nextRun: "Retry in 30 min",
      description: "Automated onboarding flow for new users",
      frequency: "Triggered",
      enabled: true,
      logs: [
        "2024-01-15 10:00:00 - Onboarding started for 5 new users",
        "2024-01-15 10:15:00 - 3 users completed successfully",
        "2024-01-15 10:20:00 - 2 users failed - email delivery error",
      ],
      config: {
        welcomeEmail: true,
        setupWizard: true,
        trainingMaterials: true,
        followUpDays: 3,
      },
    },
    {
      id: "5",
      name: "System Maintenance",
      type: "maintenance",
      status: "paused",
      progress: 0,
      lastRun: "3 days ago",
      nextRun: "Manual",
      description: "Routine system maintenance and optimization",
      frequency: "Monthly",
      enabled: false,
      logs: [
        "2024-01-12 03:00:00 - Maintenance started",
        "2024-01-12 04:30:00 - Database optimization completed",
        "2024-01-12 05:00:00 - System restart completed",
      ],
      config: {
        dbOptimization: true,
        cacheClearing: true,
        logRotation: true,
        systemRestart: false,
      },
    },
  ])

  const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([
    {
      id: "1",
      type: "login",
      user: "john.smith@techcorp.com",
      tenant: "TechCorp",
      description: "User logged in from New York",
      timestamp: "2 min ago",
      severity: "info",
      metadata: { ip: "192.168.1.1", device: "Chrome/Windows", location: "New York, NY" },
    },
    {
      id: "2",
      type: "alert",
      user: "system",
      tenant: "GlobalCorp",
      description: "High CPU usage detected",
      timestamp: "5 min ago",
      severity: "warning",
      metadata: { cpu: 85, threshold: 80, duration: "5 minutes" },
    },
    {
      id: "3",
      type: "billing",
      user: "billing@innovate.com",
      tenant: "InnovateLtd",
      description: "Payment failed - card declined",
      timestamp: "15 min ago",
      severity: "error",
      metadata: { amount: 12000, reason: "insufficient_funds", attempts: 3 },
    },
    {
      id: "4",
      type: "action",
      user: "admin@startupxyz.com",
      tenant: "StartupXYZ",
      description: "New user invited to platform",
      timestamp: "30 min ago",
      severity: "success",
      metadata: { invitedUser: "jane.doe@startupxyz.com", role: "user" },
    },
    {
      id: "5",
      type: "system",
      user: "system",
      tenant: "All",
      description: "Database backup completed successfully",
      timestamp: "2 hours ago",
      severity: "success",
      metadata: { size: "2.4GB", duration: "45min", location: "AWS S3" },
    },
  ])

  const [billingData, setBillingData] = useState<BillingData>({
    totalRevenue: 2847293,
    monthlyRevenue: 284729,
    quarterlyRevenue: 854187,
    yearlyRevenue: 2847293,
    revenueGrowth: 15.2,
    churnRate: 3.4,
    averageRevenuePerUser: 182,
    topModules: [
      { name: "CRM", revenue: 1200000, growth: 15 },
      { name: "HRMS", revenue: 890000, growth: 8 },
      { name: "Talent", revenue: 567000, growth: 22 },
      { name: "Finance", revenue: 190293, growth: -3 },
    ],
    upcomingRenewals: [
      { tenant: "TechCorp", amount: 15000, date: "2024-02-15", risk: "low" },
      { tenant: "GlobalCorp", amount: 8500, date: "2024-02-20", risk: "high" },
      { tenant: "InnovateLtd", amount: 12000, date: "2024-02-25", risk: "critical" },
    ],
    licenseUsage: [
      { module: "CRM", used: 8500, total: 10000, percentage: 85 },
      { module: "HRMS", used: 6200, total: 8000, percentage: 77.5 },
      { module: "Talent", used: 4100, total: 5000, percentage: 82 },
      { module: "Finance", used: 1200, total: 2000, percentage: 60 },
    ],
    failedPayments: [
      { tenant: "InnovateLtd", amount: 12000, reason: "Card declined", date: "2024-01-15" },
      { tenant: "MegaInc", amount: 18000, reason: "Insufficient funds", date: "2024-01-14" },
    ],
  })

  // Initialize notifications
  useEffect(() => {
    setNotifications([
      {
        id: "1",
        title: "High Churn Risk Alert",
        message: "GlobalCorp shows 78% churn probability",
        type: "warning",
        timestamp: "2 min ago",
        read: false,
        actionUrl: "/admin/tenants/2",
      },
      {
        id: "2",
        title: "Payment Failed",
        message: "InnovateLtd payment of $12,000 failed",
        type: "error",
        timestamp: "15 min ago",
        read: false,
        actionUrl: "/admin/billing",
      },
      {
        id: "3",
        title: "System Backup Complete",
        message: "Daily backup completed successfully",
        type: "success",
        timestamp: "2 hours ago",
        read: true,
      },
      {
        id: "4",
        title: "New Tenant Onboarded",
        message: "StartupXYZ successfully onboarded",
        type: "info",
        timestamp: "1 day ago",
        read: true,
      },
    ])
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Refresh data function
  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update metrics with slight variations
      setSystemMetrics((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        cpuUsage: Math.max(30, Math.min(90, prev.cpuUsage + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(40, Math.min(95, prev.memoryUsage + Math.floor(Math.random() * 8) - 4)),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 1000),
      }))

      // Add new live activity
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: ["login", "action", "alert", "system"][Math.floor(Math.random() * 4)] as any,
        user: "user@example.com",
        tenant: "RandomTenant",
        description: "New activity detected",
        timestamp: "Just now",
        severity: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as any,
        metadata: {},
      }

      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])

      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // AI Copilot functionality with enhanced responses
  const handleCopilotQuery = async () => {
    if (!copilotQuery.trim()) return

    setCopilotLoading(true)
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate response based on query
      let response = ""
      const query = copilotQuery.toLowerCase()

      if (query.includes("inactive tenants") || query.includes("churning")) {
        const inactiveTenants = tenantHealth.filter((t) => t.status === "inactive" || t.churnRisk > 70)
        response = `Found ${inactiveTenants.length} tenants at risk:

${inactiveTenants.map((t) => `• ${t.name} (${t.churnRisk}% churn risk) - ${t.status}`).join("\n")}

Recommended actions:
1. Schedule immediate retention calls
2. Offer personalized incentives
3. Provide additional training/support
4. Review usage patterns for insights

Would you like me to generate retention emails or schedule calls?`
      } else if (query.includes("billing") || query.includes("payment") || query.includes("revenue")) {
        const failedPayments = billingData.failedPayments
        response = `Billing & Revenue Analysis:

💰 Revenue Metrics:
• Monthly: $${(billingData.monthlyRevenue / 1000).toFixed(0)}K (+${billingData.revenueGrowth}%)
• Quarterly: $${(billingData.quarterlyRevenue / 1000).toFixed(0)}K
• ARPU: $${billingData.averageRevenuePerUser}
• Churn Rate: ${billingData.churnRate}%

⚠️ Payment Issues:
${failedPayments.map((p) => `• ${p.tenant}: $${p.amount.toLocaleString()} - ${p.reason}`).join("\n")}

📅 Upcoming Renewals:
${billingData.upcomingRenewals.map((r) => `• ${r.tenant}: $${r.amount.toLocaleString()} (${r.risk} risk)`).join("\n")}

Actions available:
- Send payment reminders
- Update payment methods
- Apply retention discounts`
      } else if (query.includes("security") || query.includes("compliance") || query.includes("audit")) {
        const securityInsights = aiInsights.filter((i) => i.category === "security")
        response = `Security & Compliance Status:

🛡️ Overall Compliance: ${systemMetrics.complianceScore}%

🔍 Security Alerts:
${securityInsights.map((i) => `• ${i.title} (${i.confidence}% confidence)`).join("\n")}

📊 Compliance Breakdown:
• GDPR: 98% compliant
• SOC 2: 95% compliant  
• ISO 27001: 92% compliant
• HIPAA: 87% (needs attention)

🚨 Immediate Actions Needed:
1. Review unusual login patterns (InnovateLtd)
2. Update security policies
3. Schedule compliance audit

Would you like me to generate a detailed security report?`
      } else if (query.includes("system") || query.includes("health") || query.includes("performance")) {
        response = `System Health & Performance:

📊 Current Status:
• Uptime: ${systemMetrics.systemUptime}% (Excellent)
• CPU: ${systemMetrics.cpuUsage}% (${systemMetrics.cpuUsage > 80 ? "High" : "Normal"})
• Memory: ${systemMetrics.memoryUsage}% (${systemMetrics.memoryUsage > 85 ? "High" : "Normal"})
• Storage: ${systemMetrics.storageUsage}% (${systemMetrics.storageUsage > 90 ? "Critical" : "Monitor"})

🔧 Optimization Opportunities:
• Database query optimization (23% improvement possible)
• Cache hit rate improvement
• API response time optimization

⚡ Recent Performance:
• API Calls: ${(systemMetrics.apiCalls / 1000000).toFixed(1)}M this month
• Network Traffic: ${systemMetrics.networkTraffic}TB
• Active Users: ${systemMetrics.activeUsers.toLocaleString()}

Recommended actions:
1. Schedule maintenance window
2. Optimize database indexes
3. Review slow queries`
      } else if (query.includes("automation") || query.includes("tasks") || query.includes("workflows")) {
        const runningTasks = automationTasks.filter((t) => t.status === "running")
        const failedTasks = automationTasks.filter((t) => t.status === "failed")
        response = `Automation & Workflow Status:

🤖 Active Tasks: ${runningTasks.length}
${runningTasks.map((t) => `• ${t.name} (${t.progress}% complete)`).join("\n")}

❌ Failed Tasks: ${failedTasks.length}
${failedTasks.map((t) => `• ${t.name} - ${t.description}`).join("\n")}

📈 Task Performance:
• Success Rate: 87%
• Average Completion Time: 45 minutes
• Tasks Scheduled: ${automationTasks.filter((t) => t.status === "scheduled").length}

Available actions:
- Retry failed tasks
- Schedule new workflows
- Modify task configurations
- View detailed logs`
      } else if (query.includes("users") || query.includes("activity")) {
        const recentActivity = liveActivity.slice(0, 5)
        response = `User Activity & Engagement:

👥 User Metrics:
• Total Users: ${systemMetrics.totalUsers.toLocaleString()}
• Active Users: ${systemMetrics.activeUsers.toLocaleString()} (${((systemMetrics.activeUsers / systemMetrics.totalUsers) * 100).toFixed(1)}%)
• New Users Today: 47
• User Growth: +8% this month

🔄 Recent Activity:
${recentActivity.map((a) => `• ${a.description} (${a.tenant}) - ${a.timestamp}`).join("\n")}

📊 Engagement Insights:
• Average Session Duration: 24 minutes
• Daily Active Users: 8,500
• Feature Adoption Rate: 73%

Trends:
- Login activity peak: 9-11 AM
- Most active module: CRM (45% usage)
- Support ticket volume: Low`
      } else {
        response = `I understand you're asking about "${copilotQuery}". Here's what I found:

🎯 Quick Stats:
• ${systemMetrics.activeTenants} active tenants
• ${systemMetrics.activeUsers.toLocaleString()} active users  
• ${aiInsights.filter((i) => i.status === "new").length} new AI insights
• System health: ${systemMetrics.systemUptime}% uptime

💡 Available Commands:
• "Show me inactive tenants" - Churn risk analysis
• "Billing status" - Revenue and payment insights  
• "System health" - Performance metrics
• "Security audit" - Compliance status
• "Automation status" - Workflow monitoring

Would you like me to elaborate on any specific area or run a detailed analysis?`
      }

      setCopilotResponse(response)

      // Add to activity log
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: "action",
        user: "admin",
        tenant: "System",
        description: `AI Copilot query: "${copilotQuery.substring(0, 50)}..."`,
        timestamp: "Just now",
        severity: "info",
        metadata: { query: copilotQuery, responseLength: response.length },
      }
      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])

      toast({
        title: "AI Analysis Complete",
        description: "Copilot has analyzed your query",
      })
    } catch (error) {
      toast({
        title: "AI Query Failed",
        description: "Failed to process your query",
        variant: "destructive",
      })
    } finally {
      setCopilotLoading(false)
    }
  }

  // Enhanced automation task actions
  const handleAutomationAction = async (
    taskId: string,
    action: "start" | "pause" | "stop" | "retry" | "edit" | "delete" | "logs",
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (action === "logs") {
        const task = automationTasks.find((t) => t.id === taskId)
        if (task) {
          setSelectedTask(task)
        }
        return
      }

      if (action === "edit") {
        toast({
          title: "Edit Task",
          description: "Task configuration editor would open here",
        })
        return
      }

      if (action === "delete") {
        setAutomationTasks((prev) => prev.filter((t) => t.id !== taskId))
        toast({
          title: "Task Deleted",
          description: "Automation task has been permanently deleted",
        })
        return
      }

      setAutomationTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const now = new Date().toLocaleString()
            const newLogs = [...task.logs]

            switch (action) {
              case "start":
                newLogs.push(`${now} - Task started manually`)
                return { ...task, status: "running", enabled: true, progress: 0, logs: newLogs }
              case "pause":
                newLogs.push(`${now} - Task paused`)
                return { ...task, status: "paused", enabled: false, logs: newLogs }
              case "stop":
                newLogs.push(`${now} - Task stopped`)
                return { ...task, status: "completed", progress: 100, logs: newLogs }
              case "retry":
                newLogs.push(`${now} - Task retry initiated`)
                return { ...task, status: "running", progress: 0, logs: newLogs }
              default:
                return task
            }
          }
          return task
        }),
      )

      // Add to activity log
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: "action",
        user: "admin",
        tenant: "System",
        description: `Automation task ${action}ed`,
        timestamp: "Just now",
        severity: "info",
        metadata: { taskId, action },
      }
      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])

      toast({
        title: "Task Updated",
        description: `Automation task ${action}ed successfully`,
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to ${action} automation task`,
        variant: "destructive",
      })
    }
  }

  // Enhanced insight actions
  const handleInsightAction = async (
    insightId: string,
    action: "acknowledge" | "resolve" | "dismiss" | "implement",
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const insight = aiInsights.find((i) => i.id === insightId)

      if (action === "implement" && insight?.recommendedActions) {
        toast({
          title: "Implementing Recommendations",
          description: `Executing ${insight.recommendedActions.length} recommended actions...`,
        })

        // Simulate implementing actions
        for (const actionItem of insight.recommendedActions) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          toast({
            title: "Action Executed",
            description: actionItem,
          })
        }
      }

      setAiInsights((prev) =>
        prev.map((insight) =>
          insight.id === insightId
            ? { ...insight, status: action === "dismiss" ? "dismissed" : (action as any) }
            : insight,
        ),
      )

      // Add to activity log
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: "action",
        user: "admin",
        tenant: insight?.tenantId ? tenantHealth.find((t) => t.id === insight.tenantId)?.name || "Unknown" : "System",
        description: `AI insight ${action}ed: ${insight?.title}`,
        timestamp: "Just now",
        severity: "info",
        metadata: { insightId, action, category: insight?.category },
      }
      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])

      toast({
        title: "Insight Updated",
        description: `Insight ${action}ed successfully`,
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to ${action} insight`,
        variant: "destructive",
      })
    }
  }

  // Enhanced tenant actions
  const handleTenantAction = async (tenantId: string, action: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const tenant = tenantHealth.find((t) => t.id === tenantId)

      switch (action) {
        case "contact":
          toast({
            title: "Sending Message",
            description: `Composing message to ${tenant?.contact.name}...`,
          })
          // Would open email composer or messaging interface
          break

        case "call":
          toast({
            title: "Scheduling Call",
            description: `Opening calendar to schedule call with ${tenant?.name}...`,
          })
          // Would open calendar interface
          break

        case "suspend":
          setTenantHealth((prev) => prev.map((t) => (t.id === tenantId ? { ...t, status: "inactive" } : t)))
          toast({
            title: "Account Suspended",
            description: `${tenant?.name} account has been suspended`,
          })
          break

        case "activate":
          setTenantHealth((prev) => prev.map((t) => (t.id === tenantId ? { ...t, status: "healthy" } : t)))
          toast({
            title: "Account Activated",
            description: `${tenant?.name} account has been activated`,
          })
          break

        case "upgrade":
          toast({
            title: "Plan Upgrade",
            description: `Initiating plan upgrade process for ${tenant?.name}...`,
          })
          break

        case "backup":
          toast({
            title: "Data Backup",
            description: `Starting data backup for ${tenant?.name}...`,
          })
          break

        case "audit":
          toast({
            title: "Compliance Audit",
            description: `Running compliance audit for ${tenant?.name}...`,
          })
          break

        case "view-dashboard":
          router.push(`/tenant/${tenantId}/dashboard`)
          break

        default:
          toast({
            title: "Action Executed",
            description: `${action} executed for ${tenant?.name}`,
          })
      }

      // Add to activity log
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: "action",
        user: "admin",
        tenant: tenant?.name || "Unknown",
        description: `Tenant action: ${action}`,
        timestamp: "Just now",
        severity: "info",
        metadata: { tenantId, action },
      }
      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to execute ${action}`,
        variant: "destructive",
      })
    }
  }

  // Enhanced export functions
  const handleExport = async (type: string, format: "json" | "csv" | "xlsx" = "json") => {
    try {
      toast({
        title: "Generating Export",
        description: `Preparing ${type} data in ${format.toUpperCase()} format...`,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      let data: any
      let filename: string

      switch (type) {
        case "tenants":
          data = tenantHealth
          filename = `tenants-export-${new Date().toISOString().split("T")[0]}`
          break
        case "insights":
          data = aiInsights
          filename = `ai-insights-export-${new Date().toISOString().split("T")[0]}`
          break
        case "system":
          data = { systemMetrics, timestamp: new Date().toISOString() }
          filename = `system-metrics-export-${new Date().toISOString().split("T")[0]}`
          break
        case "billing":
          data = billingData
          filename = `billing-export-${new Date().toISOString().split("T")[0]}`
          break
        case "automation":
          data = automationTasks
          filename = `automation-tasks-export-${new Date().toISOString().split("T")[0]}`
          break
        case "activity":
          data = liveActivity
          filename = `activity-log-export-${new Date().toISOString().split("T")[0]}`
          break
        default:
          data = { systemMetrics, tenantHealth, aiInsights }
          filename = `full-dashboard-export-${new Date().toISOString().split("T")[0]}`
      }

      // Create and download file
      let content: string
      let mimeType: string

      if (format === "csv" && Array.isArray(data)) {
        // Convert to CSV
        const headers = Object.keys(data[0] || {}).join(",")
        const rows = data.map((item) => Object.values(item).join(",")).join("\n")
        content = `${headers}\n${rows}`
        mimeType = "text/csv"
      } else {
        // Default to JSON
        content = JSON.stringify(data, null, 2)
        mimeType = "application/json"
        format = "json"
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Add to activity log
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: "action",
        user: "admin",
        tenant: "System",
        description: `Exported ${type} data as ${format.toUpperCase()}`,
        timestamp: "Just now",
        severity: "success",
        metadata: { exportType: type, format, recordCount: Array.isArray(data) ? data.length : 1 },
      }
      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 9)])

      toast({
        title: "Export Complete",
        description: `${type} data exported successfully as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  // Navigation functions
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Notification functions
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  // Settings functions
  const handleSettingsChange = (setting: string, value: any) => {
    switch (setting) {
      case "darkMode":
        setDarkMode(value)
        break
      case "compactMode":
        setCompactMode(value)
        break
      case "autoRefresh":
        setAutoRefresh(value)
        break
      case "refreshInterval":
        setRefreshInterval(value)
        break
      case "showAdvancedMetrics":
        setShowAdvancedMetrics(value)
        break
    }

    toast({
      title: "Settings Updated",
      description: `${setting} has been updated`,
    })
  }

  // Search and filter functions
  const filteredTenants = tenantHealth.filter((tenant) => {
    const matchesSearch =
      searchQuery === "" ||
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || tenant.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const filteredInsights = aiInsights.filter((insight) => {
    const matchesSearch =
      searchQuery === "" ||
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Utility functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "completed":
      case "compliant":
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "warning":
      case "running":
      case "scheduled":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
      case "failed":
      case "error":
      case "non-compliant":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "inactive":
      case "paused":
        return <Pause className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "completed":
      case "compliant":
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "warning":
      case "running":
      case "scheduled":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "critical":
      case "failed":
      case "error":
      case "non-compliant":
        return "bg-red-100 text-red-700 border-red-200"
      case "inactive":
      case "paused":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
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
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch dashboard data")

      const result = await response.json()
      setDashboardData(result.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
  toast({ title: "Failed to load dashboard data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch automation rules
  const fetchAutomationRules = useCallback(async () => {
    if (!user || !hasPermission(userRole, "SYSTEM_ADMIN")) return

    try {
      const response = await fetch("/api/admin/automation", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        setAutomationRules(result.data)
      }
    } catch (error) {
      console.error("Error fetching automation rules:", error)
    }
  }, [user])

  // AI Chat functionality
  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage = chatMessage
    setChatMessage("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/admin/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            dashboardData,
            userRole: user?.role,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error("AI chat failed")

      const result = await response.json()
      setChatHistory((prev) => [...prev, { role: "assistant", content: result.data.response }])
    } catch (error) {
      console.error("AI chat error:", error)
  toast({ title: "AI chat failed", variant: "destructive" })
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I encountered an error. Please try again." },
      ])
    }
  }

  // Generate AI insights
  const generateAIInsights = async () => {
    try {
      const response = await fetch("/api/admin/insights/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
  body: JSON.stringify({ tenantId: profile?.tenant_id }),
      })

      if (!response.ok) throw new Error("Failed to generate insights")

      const result = await response.json()
  toast({ title: `Generated ${result.count} new AI insights` })
      await fetchDashboardData()
    } catch (error) {
      console.error("Error generating insights:", error)
  toast({ title: "Failed to generate AI insights", variant: "destructive" })
    }
  }

  // Create automation rule
  const createAutomationRule = async (rule: any) => {
    try {
      const response = await fetch("/api/admin/automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(rule),
      })

      if (!response.ok) throw new Error("Failed to create automation rule")

      const result = await response.json()
  toast({ title: "Automation rule created successfully" })
      await fetchAutomationRules()
      return result.data.ruleId
    } catch (error) {
      console.error("Error creating automation rule:", error)
  toast({ title: "Failed to create automation rule", variant: "destructive" })
    }
  }

  // Refresh data (manual)
  const refreshNow = async () => {
    setRefreshing(true)
    await Promise.all([fetchDashboardData(), fetchAutomationRules()])
    setRefreshing(false)
  toast({ title: "Dashboard data refreshed" })
  }

  // Export data
  const exportData = async (format: "csv" | "json" | "pdf") => {
    try {
      const response = await fetch("/api/admin/dashboard/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ format, timeRange: selectedTimeRange }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dashboard-export-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

  toast({ title: `Dashboard data exported as ${format.toUpperCase()}` })
    } catch (error) {
      console.error("Export error:", error)
  toast({ title: "Failed to export data", variant: "destructive" })
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      fetchAutomationRules()
    }
  }, [user, fetchDashboardData, fetchAutomationRules])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  // Use profile role if available; fallback to user's role (string) cast safely
  const userRole = (profile?.role || (user as any)?.role) as import("@/lib/auth/rbac").UserRole

  if (!hasPermission(userRole, "VIEW_ANALYTICS")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view this dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Fetching your analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ESG OS Admin Dashboard
            </h1>
                      <p className="text-muted-foreground mt-1">AI-powered platform management and analytics</p>
          </div>

              <div className="flex items-center gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
              </SelectContent>
            </Select>

          <Button variant="outline" onClick={refreshNow} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button variant="outline" onClick={() => setAiChatOpen(true)}>
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>

            <Button onClick={() => exportData("json")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.overview.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-emerald-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+{dashboardData?.overview.growthRate.toFixed(1)}% growth</span>
                </div>
                <Progress value={85} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Heart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.overview.systemHealth}%</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  <span>Excellent performance</span>
                </div>
                <Progress value={dashboardData?.overview.systemHealth} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Shield className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.overview.securityScore}%</div>
                <div className="flex items-center text-xs text-purple-600 mt-1">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Highly secure</span>
                </div>
                <Progress value={dashboardData?.overview.securityScore} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardData?.overview?.revenue ? (dashboardData.overview.revenue / 1000).toFixed(0) + "K" : "—"}
                </div>
                <div className="flex items-center text-xs text-emerald-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+{dashboardData?.overview.growthRate.toFixed(1)}% this month</span>
                </div>
                <Progress value={75} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Metrics */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    System Resources
                  </CardTitle>
                  <CardDescription>Real-time system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">CPU Usage</span>
                      </div>
                      <span className="text-sm">{dashboardData?.systemMetrics.cpu}%</span>
                    </div>
                    <Progress value={dashboardData?.systemMetrics.cpu} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Memory</span>
                      </div>
                      <span className="text-sm">{dashboardData?.systemMetrics.memory}%</span>
                    </div>
                    <Progress value={dashboardData?.systemMetrics.memory} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Storage</span>
                      </div>
                      <span className="text-sm">{dashboardData?.systemMetrics.storage}%</span>
                    </div>
                    <Progress value={dashboardData?.systemMetrics.storage} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Network</span>
                      </div>
                      <span className="text-sm">{dashboardData?.systemMetrics.network}%</span>
                    </div>
                    <Progress value={dashboardData?.systemMetrics.network} className="h-2" />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{dashboardData?.systemMetrics.uptime}</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{dashboardData?.systemMetrics.responseTime}ms</div>
                      <div className="text-xs text-muted-foreground">Response Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest system events and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {dashboardData?.recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/30 dark:bg-slate-700/30 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.resource} by {activity.user}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                <p className="text-muted-foreground">Intelligent recommendations and predictions</p>
              </div>
              <Button onClick={generateAIInsights} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Insights
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData?.aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-500" />
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                        <Badge
                          variant={
                            insight.impact === "high"
                              ? "destructive"
                              : insight.impact === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <CardDescription>{insight.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence</span>
                        <span className="text-sm font-medium">{(insight.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={insight.confidence * 100} className="h-2" />

                      {insight.estimatedValue && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Estimated Value: ${insight.estimatedValue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {insight.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recommendations:</h4>
                          <ul className="space-y-1">
                            {insight.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Implement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Health */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{dashboardData?.overview.systemHealth}%</div>
                    <p className="text-sm text-muted-foreground">Overall Health Score</p>
                  </div>
                  <Progress value={dashboardData?.overview.systemHealth} className="h-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>API Response</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database</span>
                      <span className="text-green-600">Optimal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate</span>
                      <span className="text-green-600">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Throughput</span>
                        <span>15.2K req/min</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Rate</span>
                        <span>0.02%</span>
                      </div>
                      <Progress value={2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Latency</span>
                        <span>245ms</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-orange-500" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{dashboardData?.systemMetrics.cpu}%</div>
                      <div className="text-xs text-muted-foreground">CPU</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dashboardData?.systemMetrics.memory}%</div>
                      <div className="text-xs text-muted-foreground">Memory</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dashboardData?.systemMetrics.storage}%</div>
                      <div className="text-xs text-muted-foreground">Storage</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dashboardData?.systemMetrics.network}%</div>
                      <div className="text-xs text-muted-foreground">Network</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Analytics */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Analytics
                  </CardTitle>
                  <CardDescription>User distribution and activity metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardData?.userAnalytics.activeVsInactive.active}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-500">
                        {dashboardData?.userAnalytics.activeVsInactive.inactive}
                      </div>
                      <div className="text-xs text-muted-foreground">Inactive Users</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Users by Role</h4>
                    {Object.entries(dashboardData?.userAnalytics.byRole || {}).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{role.replace("_", " ")}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Logins */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>User login and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{dashboardData?.userAnalytics.recentLogins}</div>
                    <p className="text-sm text-muted-foreground">Logins this week</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Peak Hours</span>
                      <span>9-11 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Session</span>
                      <span>24 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bounce Rate</span>
                      <span>12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            {hasPermission(userRole, "SYSTEM_ADMIN") ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">RPA Automation</h3>
                    <p className="text-muted-foreground">Robotic Process Automation rules and workflows</p>
                  </div>
                  <Button
                    onClick={() => {
                      const rule = {
                        name: "Daily Health Check",
                        trigger: "schedule",
                        conditions: { schedule: "daily" },
                        actions: [
                          { type: "ai_analysis", config: {} },
                          { type: "report_generation", config: { reportType: "health", timeRange: "24h" } },
                        ],
                        enabled: true,
                      }
                      createAutomationRule(rule)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {automationRules.map((rule, index) => (
                    <Card key={rule.id} className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={rule.enabled ? "default" : "secondary"}>
                              {rule.enabled ? "Active" : "Inactive"}
                            </Badge>
                            <Switch checked={rule.enabled} />
                          </div>
                        </div>
                        <CardDescription>
                          Trigger: {rule.trigger} | Actions: {rule.actions?.length || 0}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Last Run</span>
                            <span>{rule.lastRun || "Never"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Success Rate</span>
                            <span className="text-green-600">98%</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3 mr-1" />
                            Run Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You do not have permission to manage automation rules.</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Threat Level */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Threat Level
                  </CardTitle>
                  <CardDescription>Current security threat assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {dashboardData?.securityOverview.threatLevel}
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Risk</p>
                  </div>
                  <Progress value={65} className="h-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Network Threats</span>
                      <span className="text-orange-600">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Breaches</span>
                      <span className="text-green-600">Low</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Vulnerabilities</span>
                      <span className="text-red-600">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Events */}
              <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Security Events
                  </CardTitle>
                  <CardDescription>Recent security alerts and incidents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {dashboardData?.securityOverview.recentEvents}
                    </div>
                    <p className="text-sm text-muted-foreground">Events this week</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Failed Logins</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Malware Detected</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Suspicious Activity</span>
                      <span>12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chat Modal */}
      <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <DialogDescription>Ask questions or request actions using AI</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[300px] mb-4">
            <div className="space-y-3">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" : "bg-gray-100 dark:bg-slate-700/30 text-gray-800 dark:text-gray-200"}`}
                >
                  <p className="text-sm font-medium">{message.role === "user" ? "You" : "AI"}</p>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message">Message</Label>
              <Input
                type="text"
                id="message"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={sendChatMessage}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
