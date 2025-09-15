"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Crown,
  Ban,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Send,
  UserPlus,
  Globe,
  Zap,
  Briefcase,
  Bot,
  Brain,
  Target,
  TrendingDown,
  AlertCircle,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  status: "active" | "inactive" | "suspended" | "invited" | "pending"
  roles: UserRole[]
  tenants: UserTenant[]
  lastLogin: string
  createdAt: string
  updatedAt: string
  department?: string
  location?: string
  jobTitle?: string
  manager?: string
  timezone?: string
  language?: string
  loginCount: number
  lastActivity: string
  mfaEnabled: boolean
  emailVerified: boolean
  phoneVerified: boolean
  notes?: string
  behaviorScore: BehaviorScore
  riskLevel: "low" | "medium" | "high"
  churnRisk: number
  productivityScore: number
  engagementLevel: "low" | "medium" | "high"
  securityScore: number
  aiInsights: AIInsight[]
  sessions: UserSession[]
  devices: UserDevice[]
  activityLogs: ActivityLog[]
  loginHistory: LoginHistory[]
}

interface UserRole {
  id: string
  name: string
  type: "global" | "tenant"
  tenantId?: string
  tenantName?: string
  permissions: string[]
  assignedAt: string
  assignedBy: string
}

interface UserTenant {
  id: string
  name: string
  domain: string
  role: string
  status: "active" | "pending" | "suspended"
  joinedAt: string
  lastAccess: string
}

interface BehaviorScore {
  overall: number
  productivity: number
  engagement: number
  security: number
  collaboration: number
  innovation: number
  trends: {
    week: number
    month: number
    quarter: number
  }
}

interface AIInsight {
  id: string
  type: "risk" | "opportunity" | "recommendation" | "alert"
  title: string
  description: string
  confidence: number
  priority: "low" | "medium" | "high"
  category: string
  createdAt: string
  actionable: boolean
  actions?: string[]
}

interface UserSession {
  id: string
  deviceId: string
  deviceName: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  ipAddress: string
  location: string
  startTime: string
  lastActivity: string
  status: "active" | "expired" | "terminated"
}

interface UserDevice {
  id: string
  name: string
  type: "desktop" | "mobile" | "tablet"
  os: string
  browser: string
  lastUsed: string
  trusted: boolean
  location: string
}

interface ActivityLog {
  id: string
  action: string
  details: string
  timestamp: string
  ipAddress: string
  location: string
  deviceType: string
  success: boolean
  module: string
  tenantId?: string
}

interface LoginHistory {
  id: string
  timestamp: string
  ipAddress: string
  location: string
  device: string
  browser: string
  success: boolean
  failureReason?: string
  mfaUsed: boolean
}

interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  invited: number
  pending: number
  newThisMonth: number
  activeToday: number
  mfaEnabled: number
  highRisk: number
  churnRisk: number
}

interface AIRecommendation {
  id: string
  type: "role_suggestion" | "access_audit" | "churn_prevention" | "invite_recommendation"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  users: string[]
  actions: string[]
  createdAt: string
}

const GLOBAL_ROLES = [
  { id: "super_admin", name: "Super Admin", permissions: ["*"] },
  { id: "admin", name: "Admin", permissions: ["users.*", "tenants.*", "system.*"] },
  { id: "manager", name: "Manager", permissions: ["users.read", "users.write", "reports.*"] },
  { id: "analyst", name: "Analyst", permissions: ["reports.read", "analytics.*"] },
  { id: "support", name: "Support", permissions: ["users.read", "tickets.*"] },
]

const TENANT_ROLES = [
  { id: "tenant_admin", name: "Tenant Admin", permissions: ["tenant.*"] },
  { id: "tenant_manager", name: "Tenant Manager", permissions: ["tenant.read", "tenant.write"] },
  { id: "tenant_user", name: "Tenant User", permissions: ["tenant.read"] },
  { id: "tenant_viewer", name: "Tenant Viewer", permissions: ["tenant.read.limited"] },
]

const PERMISSIONS = [
  "users.read",
  "users.write",
  "users.delete",
  "tenants.read",
  "tenants.write",
  "tenants.delete",
  "system.read",
  "system.write",
  "system.admin",
  "reports.read",
  "reports.write",
  "reports.export",
  "analytics.read",
  "analytics.write",
  "billing.read",
  "billing.write",
  "security.read",
  "security.write",
  "ai.read",
  "ai.write",
  "ai.admin",
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    invited: 0,
    pending: 0,
    newThisMonth: 0,
    activeToday: 0,
    mfaEnabled: 0,
    highRisk: 0,
    churnRisk: 0,
  })
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [tenantFilter, setTenantFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null)
  const [showRoleAssignment, setShowRoleAssignment] = useState<string | null>(null)
  const [showTenantAccess, setShowTenantAccess] = useState<string | null>(null)
  const [showAICopilot, setShowAICopilot] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [aiCopilotQuery, setAiCopilotQuery] = useState("")
  const [aiCopilotResponse, setAiCopilotResponse] = useState("")
  const [aiCopilotLoading, setAiCopilotLoading] = useState(false)

  // Generate mock data
  const generateMockUsers = useCallback((): User[] => {
    const tenants = [
      { id: "1", name: "Acme Corporation", domain: "acme.com" },
      { id: "2", name: "TechStart Inc", domain: "techstart.com" },
      { id: "3", name: "Global Solutions", domain: "globalsolutions.com" },
      { id: "4", name: "DataFlow Ltd", domain: "dataflow.com" },
      { id: "5", name: "Innovation Hub", domain: "innovationhub.com" },
    ]

    const statuses: User["status"][] = ["active", "inactive", "suspended", "invited", "pending"]
    const riskLevels: User["riskLevel"][] = ["low", "medium", "high"]
    const engagementLevels: User["engagementLevel"][] = ["low", "medium", "high"]
    const departments = ["IT", "Sales", "Marketing", "HR", "Finance", "Operations", "Support", "Legal"]
    const locations = ["New York", "San Francisco", "London", "Tokyo", "Sydney", "Toronto", "Berlin", "Singapore"]
    const jobTitles = [
      "Software Engineer",
      "Product Manager",
      "Sales Director",
      "Marketing Specialist",
      "HR Manager",
      "Financial Analyst",
      "Operations Lead",
      "Support Specialist",
    ]

    return Array.from({ length: 200 }, (_, i) => {
      const firstName = `User${i + 1}`
      const lastName = `LastName${i + 1}`
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
      const engagementLevel = engagementLevels[Math.floor(Math.random() * engagementLevels.length)]

      // Generate user roles
      const userRoles: UserRole[] = []
      if (Math.random() > 0.7) {
        const globalRole = GLOBAL_ROLES[Math.floor(Math.random() * GLOBAL_ROLES.length)]
        userRoles.push({
          id: `role-${i}-global`,
          name: globalRole.name,
          type: "global",
          permissions: globalRole.permissions,
          assignedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          assignedBy: "System Admin",
        })
      }

      // Generate tenant assignments
      const userTenants: UserTenant[] = []
      const numTenants = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numTenants; j++) {
        const tenant = tenants[Math.floor(Math.random() * tenants.length)]
        const tenantRole = TENANT_ROLES[Math.floor(Math.random() * TENANT_ROLES.length)]

        userTenants.push({
          id: tenant.id,
          name: tenant.name,
          domain: tenant.domain,
          role: tenantRole.name,
          status: Math.random() > 0.1 ? "active" : "pending",
          joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccess: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        userRoles.push({
          id: `role-${i}-${j}`,
          name: tenantRole.name,
          type: "tenant",
          tenantId: tenant.id,
          tenantName: tenant.name,
          permissions: tenantRole.permissions,
          assignedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          assignedBy: "Tenant Admin",
        })
      }

      // Generate behavior score
      const behaviorScore: BehaviorScore = {
        overall: Math.floor(Math.random() * 100),
        productivity: Math.floor(Math.random() * 100),
        engagement: Math.floor(Math.random() * 100),
        security: Math.floor(Math.random() * 100),
        collaboration: Math.floor(Math.random() * 100),
        innovation: Math.floor(Math.random() * 100),
        trends: {
          week: Math.floor(Math.random() * 20) - 10,
          month: Math.floor(Math.random() * 30) - 15,
          quarter: Math.floor(Math.random() * 40) - 20,
        },
      }

      // Generate AI insights
      const aiInsights: AIInsight[] = []
      if (Math.random() > 0.6) {
        const insightTypes: AIInsight["type"][] = ["risk", "opportunity", "recommendation", "alert"]
        const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)]

        aiInsights.push({
          id: `insight-${i}`,
          type: insightType,
          title: `${
            insightType === "risk"
              ? "Security Risk Detected"
              : insightType === "opportunity"
                ? "Growth Opportunity"
                : insightType === "recommendation"
                  ? "Role Optimization"
                  : "Activity Alert"
          }`,
          description: `AI-generated insight for user behavior analysis`,
          confidence: Math.floor(Math.random() * 40) + 60,
          priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
          category: "User Behavior",
          createdAt: new Date().toISOString(),
          actionable: Math.random() > 0.3,
          actions: ["Review access", "Update role", "Schedule check-in"],
        })
      }

      // Generate sessions
      const sessions: UserSession[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: `session-${i}-${j}`,
        deviceId: `device-${i}-${j}`,
        deviceName: `Device ${j + 1}`,
        deviceType: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)] as any,
        browser: ["Chrome", "Firefox", "Safari", "Edge"][Math.floor(Math.random() * 4)],
        os: ["Windows", "macOS", "iOS", "Android", "Linux"][Math.floor(Math.random() * 5)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.3 ? "active" : "expired",
      }))

      return {
        id: `user-${i + 1}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        status,
        roles: userRoles,
        tenants: userTenants,
        lastLogin: status === "active" ? `${Math.floor(Math.random() * 60)} minutes ago` : "Never",
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        department: departments[Math.floor(Math.random() * departments.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        manager:
          i > 10
            ? `User${Math.floor(Math.random() * 10) + 1} LastName${Math.floor(Math.random() * 10) + 1}`
            : undefined,
        timezone: "UTC",
        language: "English",
        loginCount: Math.floor(Math.random() * 500),
        lastActivity: `${Math.floor(Math.random() * 24)} hours ago`,
        mfaEnabled: Math.random() > 0.4,
        emailVerified: Math.random() > 0.1,
        phoneVerified: Math.random() > 0.3,
        notes: Math.random() > 0.7 ? "Important user - handle with care" : undefined,
        behaviorScore,
        riskLevel,
        churnRisk: Math.floor(Math.random() * 100),
        productivityScore: Math.floor(Math.random() * 100),
        engagementLevel,
        securityScore: Math.floor(Math.random() * 100),
        aiInsights,
        sessions,
        devices: [],
        activityLogs: [],
        loginHistory: [],
      }
    })
  }, [])

  const generateAIRecommendations = useCallback((): AIRecommendation[] => {
    return [
      {
        id: "rec-1",
        type: "access_audit",
        title: "Elevated Access Review Required",
        description: "15 users have admin access but haven't logged in for 30+ days",
        confidence: 92,
        impact: "high",
        users: ["user-1", "user-5", "user-12"],
        actions: ["Review access levels", "Revoke unused permissions", "Schedule access review"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "rec-2",
        type: "churn_prevention",
        title: "Churn Risk Detected",
        description: "8 users showing decreased engagement patterns",
        confidence: 78,
        impact: "medium",
        users: ["user-3", "user-8", "user-15"],
        actions: ["Send engagement survey", "Schedule check-in", "Provide training"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "rec-3",
        type: "role_suggestion",
        title: "Role Optimization Opportunities",
        description: "12 users could benefit from role adjustments based on activity",
        confidence: 85,
        impact: "medium",
        users: ["user-2", "user-7", "user-11"],
        actions: ["Suggest role changes", "Review permissions", "Update access"],
        createdAt: new Date().toISOString(),
      },
    ]
  }, [])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUsers = generateMockUsers()
      const mockRecommendations = generateAIRecommendations()

      setUsers(mockUsers)
      setAiRecommendations(mockRecommendations)

      // Calculate stats
      const stats: UserStats = {
        total: mockUsers.length,
        active: mockUsers.filter((u) => u.status === "active").length,
        inactive: mockUsers.filter((u) => u.status === "inactive").length,
        suspended: mockUsers.filter((u) => u.status === "suspended").length,
        invited: mockUsers.filter((u) => u.status === "invited").length,
        pending: mockUsers.filter((u) => u.status === "pending").length,
        newThisMonth: mockUsers.filter((u) => {
          const created = new Date(u.createdAt)
          const now = new Date()
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length,
        activeToday: mockUsers.filter((u) => u.lastLogin.includes("minutes ago") || u.lastLogin.includes("hour ago"))
          .length,
        mfaEnabled: mockUsers.filter((u) => u.mfaEnabled).length,
        highRisk: mockUsers.filter((u) => u.riskLevel === "high").length,
        churnRisk: mockUsers.filter((u) => u.churnRisk > 70).length,
      }

      setUserStats(stats)
      setLoading(false)
    }

    loadData()
  }, [generateMockUsers, generateAIRecommendations])

  // Filter users
  useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.tenants.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) =>
        user.roles.some((role) => role.name.toLowerCase().includes(roleFilter.toLowerCase())),
      )
    }

    if (tenantFilter !== "all") {
      filtered = filtered.filter((user) => user.tenants.some((tenant) => tenant.name === tenantFilter))
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((user) => user.riskLevel === riskFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, statusFilter, roleFilter, tenantFilter, riskFilter])

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      setRefreshing(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          lastActivity: Math.random() > 0.9 ? "Just now" : user.lastActivity,
          behaviorScore: {
            ...user.behaviorScore,
            overall: Math.max(0, Math.min(100, user.behaviorScore.overall + (Math.random() - 0.5) * 5)),
          },
        })),
      )

      setRefreshing(false)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200"
      case "invited":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "inactive":
        return <XCircle className="h-3 w-3" />
      case "suspended":
        return <Ban className="h-3 w-3" />
      case "invited":
        return <Mail className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="h-3 w-3" />
      case "medium":
        return <AlertTriangle className="h-3 w-3" />
      case "high":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "low":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUserAction = async (action: string, userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    try {
      switch (action) {
        case "view":
          setShowUserDetails(userId)
          break
        case "assign_role":
          setShowRoleAssignment(userId)
          break
        case "manage_tenants":
          setShowTenantAccess(userId)
          break
        case "suspend":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)))
          toast.success(`${user.firstName} ${user.lastName} has been suspended`)
          break
        case "activate":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)))
          toast.success(`${user.firstName} ${user.lastName} has been activated`)
          break
        case "reset_mfa":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, mfaEnabled: false } : u)))
          toast.success(`MFA reset for ${user.firstName} ${user.lastName}`)
          break
        case "terminate_sessions":
          setUsers((prev) =>
            prev.map((u) =>
              u.id === userId
                ? {
                    ...u,
                    sessions: u.sessions.map((s) => ({ ...s, status: "terminated" as const })),
                  }
                : u,
            ),
          )
          toast.success(`All sessions terminated for ${user.firstName} ${user.lastName}`)
          break
        case "send_invite":
          toast.success(`Invitation sent to ${user.email}`)
          break
        case "delete":
          if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            setUsers((prev) => prev.filter((u) => u.id !== userId))
            toast.success(`${user.firstName} ${user.lastName} has been deleted`)
          }
          break
      }
    } catch (error) {
      toast.error("Action failed. Please try again.")
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first")
      return
    }

    try {
      switch (action) {
        case "activate":
          setUsers((prev) => prev.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: "active" as const } : u)))
          toast.success(`${selectedUsers.length} users activated`)
          break
        case "suspend":
          setUsers((prev) =>
            prev.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: "suspended" as const } : u)),
          )
          toast.success(`${selectedUsers.length} users suspended`)
          break
        case "assign_role":
          setShowBulkActions(true)
          break
        case "send_invites":
          toast.success(`Invitations sent to ${selectedUsers.length} users`)
          break
        case "export":
          toast.success(`Exported ${selectedUsers.length} users`)
          break
      }
      setSelectedUsers([])
    } catch (error) {
      toast.error("Bulk action failed. Please try again.")
    }
  }

  const handleAICopilotQuery = async (query: string) => {
    setAiCopilotLoading(true)
    setAiCopilotQuery(query)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const responses = {
      "users with high risk":
        "I found 12 users with high risk scores. They have elevated permissions but low activity. Consider reviewing their access levels.",
      "inactive admins":
        "There are 5 admin users who haven't logged in for 30+ days. I recommend reviewing their admin privileges.",
      "churn prediction":
        "Based on engagement patterns, 8 users are at risk of churning. They show decreased activity and low collaboration scores.",
      "role optimization":
        "15 users could benefit from role adjustments. Their current permissions don't match their activity patterns.",
      "security audit":
        "Security analysis shows 23 users without MFA enabled and 7 with suspicious login patterns from new locations.",
    }

    const response =
      responses[query.toLowerCase() as keyof typeof responses] ||
      "I can help you analyze user behavior, identify security risks, suggest role optimizations, and predict churn. What specific insights would you like?"

    setAiCopilotResponse(response)
    setAiCopilotLoading(false)
  }

  const tenants = Array.from(new Set(users.flatMap((u) => u.tenants.map((t) => t.name))))
  const roles = Array.from(new Set(users.flatMap((u) => u.roles.map((r) => r.name))))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const selectedUser = showUserDetails ? users.find((u) => u.id === showUserDetails) : null

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Global User Management
          </h1>
          <p className="text-gray-600 mt-1">AI-powered user lifecycle management across all tenants</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAICopilot(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Copilot
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1000)
              toast.success("Data refreshed")
            }}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddUser(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {aiRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-700">{rec.title}</span>
                  <Badge
                    className={`${
                      rec.impact === "high"
                        ? "bg-red-100 text-red-800"
                        : rec.impact === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {rec.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card
          className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setStatusFilter("active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setStatusFilter("pending")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{userStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setRiskFilter("high")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{userStats.highRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MFA Enabled</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.mfaEnabled}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Risk</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.churnRisk}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, role, tenant, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/50"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-white/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tenantFilter} onValueChange={setTenantFilter}>
                <SelectTrigger className="w-40 bg-white/50">
                  <SelectValue placeholder="Tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant} value={tenant}>
                      {tenant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32 bg-white/50">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setRoleFilter("all")
                  setTenantFilter("all")
                  setRiskFilter("all")
                  toast.success("Filters cleared")
                }}
                className="bg-white/50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedUsers.length} user(s) selected</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")}>
                      <Ban className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("assign_role")}>
                      <Crown className="h-4 w-4 mr-1" />
                      Assign Role
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("send_invites")}>
                      <Mail className="h-4 w-4 mr-1" />
                      Send Invites
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Tenants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Behavior Score</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-white/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers((prev) => [...prev, user.id])
                          } else {
                            setSelectedUsers((prev) => prev.filter((id) => id !== user.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleUserAction("view", user.id)}>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className="font-medium cursor-pointer hover:text-blue-600"
                            onClick={() => handleUserAction("view", user.id)}
                          >
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.jobTitle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.slice(0, 2).map((role) => (
                          <Badge key={role.id} variant="outline" className="text-xs">
                            {role.name}
                          </Badge>
                        ))}
                        {user.roles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.roles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.tenants.slice(0, 2).map((tenant) => (
                          <Badge key={tenant.id} variant="outline" className="text-xs">
                            {tenant.name}
                          </Badge>
                        ))}
                        {user.tenants.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.tenants.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(user.riskLevel)}>
                        {getRiskIcon(user.riskLevel)}
                        <span className="ml-1 capitalize">{user.riskLevel}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              user.behaviorScore.overall >= 80
                                ? "bg-green-500"
                                : user.behaviorScore.overall >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${user.behaviorScore.overall}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{user.behaviorScore.overall}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{user.lastLogin}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.mfaEnabled ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserAction("view", user.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("assign_role", user.id)}>
                            <Crown className="h-4 w-4 mr-2" />
                            Assign Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("manage_tenants", user.id)}>
                            <Building2 className="h-4 w-4 mr-2" />
                            Manage Tenants
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
                          {user.status === "active" ? (
                            <DropdownMenuItem onClick={() => handleUserAction("suspend", user.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction("activate", user.id)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleUserAction("send_invite", user.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Invite
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Security Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserAction("reset_mfa", user.id)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Reset MFA
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("terminate_sessions", user.id)}>
                            <Zap className="h-4 w-4 mr-2" />
                            Terminate Sessions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUserAction("delete", user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Sheet */}
      <Sheet open={!!showUserDetails} onOpenChange={() => setShowUserDetails(null)}>
        <SheetContent className="w-[800px] sm:w-[900px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Profile</SheetTitle>
            <SheetDescription>Comprehensive user information and management</SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.jobTitle} • {selectedUser.department}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {getStatusIcon(selectedUser.status)}
                      <span className="ml-1 capitalize">{selectedUser.status}</span>
                    </Badge>
                    <Badge className={getRiskColor(selectedUser.riskLevel)}>
                      {getRiskIcon(selectedUser.riskLevel)}
                      <span className="ml-1 capitalize">{selectedUser.riskLevel} Risk</span>
                    </Badge>
                    <Badge className={getEngagementColor(selectedUser.engagementLevel)}>
                      <span className="capitalize">{selectedUser.engagementLevel} Engagement</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{selectedUser.behaviorScore.overall}</div>
                  <div className="text-sm text-gray-500">Behavior Score</div>
                  <div
                    className={`text-sm ${selectedUser.behaviorScore.trends.week >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedUser.behaviorScore.trends.week >= 0 ? "+" : ""}
                    {selectedUser.behaviorScore.trends.week} this week
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              {selectedUser.aiInsights.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">AI Insights</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedUser.aiInsights.map((insight) => (
                      <div key={insight.id} className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{insight.title}</span>
                          <Badge
                            className={`${
                              insight.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : insight.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        {insight.actionable && insight.actions && (
                          <div className="flex gap-1 mt-2">
                            {insight.actions.map((action, idx) => (
                              <Button key={idx} size="sm" variant="outline" className="text-xs bg-transparent">
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                  <TabsTrigger value="tenants">Tenants</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedUser.email}</span>
                          {selectedUser.emailVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        {selectedUser.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{selectedUser.phone}</span>
                            {selectedUser.phoneVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        )}
                        {selectedUser.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{selectedUser.location}</span>
                          </div>
                        )}
                        {selectedUser.timezone && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{selectedUser.timezone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Organization</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedUser.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedUser.department}</span>
                        </div>
                        {selectedUser.manager && (
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{selectedUser.manager}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Activity Stats</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Login Count</span>
                          <span className="text-sm font-medium">{selectedUser.loginCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Activity</span>
                          <span className="text-sm font-medium">{selectedUser.lastActivity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Sessions</span>
                          <span className="text-sm font-medium">
                            {selectedUser.sessions.filter((s) => s.status === "active").length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Security Status</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">MFA Status</span>
                          <Badge
                            className={
                              selectedUser.mfaEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedUser.mfaEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Security Score</span>
                          <span className="text-sm font-medium">{selectedUser.securityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Risk Level</span>
                          <Badge className={getRiskColor(selectedUser.riskLevel)}>{selectedUser.riskLevel}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Engagement</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Productivity</span>
                          <span className="text-sm font-medium">{selectedUser.productivityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Churn Risk</span>
                          <span className="text-sm font-medium">{selectedUser.churnRisk}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <Badge className={getEngagementColor(selectedUser.engagementLevel)}>
                            {selectedUser.engagementLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Assigned Roles</h4>
                    <Button size="sm" onClick={() => handleUserAction("assign_role", selectedUser.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Role
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedUser.roles.map((role) => (
                      <div key={role.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                role.type === "global" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                              }
                            >
                              {role.type === "global" ? (
                                <Crown className="h-3 w-3 mr-1" />
                              ) : (
                                <Building2 className="h-3 w-3 mr-1" />
                              )}
                              {role.name}
                            </Badge>
                            {role.tenantName && <span className="text-sm text-gray-500">in {role.tenantName}</span>}
                          </div>
                          <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Assigned by {role.assignedBy} on {new Date(role.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 5).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tenants" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Tenant Access</h4>
                    <Button size="sm" onClick={() => handleUserAction("manage_tenants", selectedUser.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tenant
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedUser.tenants.map((tenant) => (
                      <div key={tenant.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            <div>
                              <h5 className="font-medium">{tenant.name}</h5>
                              <p className="text-sm text-gray-500">{tenant.domain}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Role: </span>
                            <span className="font-medium">{tenant.role}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Joined: </span>
                            <span className="font-medium">{new Date(tenant.joinedAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Access: </span>
                            <span className="font-medium">{new Date(tenant.lastAccess).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Recent Activity</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Logged into CRM Module</p>
                            <p className="text-xs text-gray-500">{Math.floor(Math.random() * 60)} minutes ago</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {["CRM", "HRMS", "Talent", "Finance"][Math.floor(Math.random() * 4)]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Active Sessions</h4>
                      <div className="space-y-2">
                        {selectedUser.sessions
                          .filter((s) => s.status === "active")
                          .map((session) => (
                            <div key={session.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {session.deviceType === "desktop" && <Monitor className="h-4 w-4" />}
                                  {session.deviceType === "mobile" && <Smartphone className="h-4 w-4" />}
                                  {session.deviceType === "tablet" && <Tablet className="h-4 w-4" />}
                                  <span className="font-medium text-sm">{session.deviceName}</span>
                                </div>
                                <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                                  <Zap className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-xs text-gray-500 space-y-1">
                                <p>
                                  {session.browser} on {session.os}
                                </p>
                                <p>
                                  {session.location} • {session.ipAddress}
                                </p>
                                <p>Started {new Date(session.startTime).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Security Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Multi-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Switch checked={selectedUser.mfaEnabled} />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Email Verification</p>
                            <p className="text-sm text-gray-500">Verify email address</p>
                          </div>
                          <Badge
                            className={
                              selectedUser.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedUser.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Phone Verification</p>
                            <p className="text-sm text-gray-500">Verify phone number</p>
                          </div>
                          <Badge
                            className={
                              selectedUser.phoneVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedUser.phoneVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Behavior Scores</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Overall", value: selectedUser.behaviorScore.overall, color: "blue" },
                          { label: "Productivity", value: selectedUser.behaviorScore.productivity, color: "green" },
                          { label: "Engagement", value: selectedUser.behaviorScore.engagement, color: "purple" },
                          { label: "Security", value: selectedUser.behaviorScore.security, color: "red" },
                          { label: "Collaboration", value: selectedUser.behaviorScore.collaboration, color: "yellow" },
                          { label: "Innovation", value: selectedUser.behaviorScore.innovation, color: "indigo" },
                        ].map((score) => (
                          <div key={score.label} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{score.label}</span>
                              <span className="text-sm font-bold">{score.value}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-${score.color}-500`}
                                style={{ width: `${score.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Trends</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">This Week</span>
                            <span
                              className={`font-bold ${selectedUser.behaviorScore.trends.week >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {selectedUser.behaviorScore.trends.week >= 0 ? "+" : ""}
                              {selectedUser.behaviorScore.trends.week}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {selectedUser.behaviorScore.trends.week >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-500">vs last week</span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">This Month</span>
                            <span
                              className={`font-bold ${selectedUser.behaviorScore.trends.month >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {selectedUser.behaviorScore.trends.month >= 0 ? "+" : ""}
                              {selectedUser.behaviorScore.trends.month}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {selectedUser.behaviorScore.trends.month >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-500">vs last month</span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">This Quarter</span>
                            <span
                              className={`font-bold ${selectedUser.behaviorScore.trends.quarter >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {selectedUser.behaviorScore.trends.quarter >= 0 ? "+" : ""}
                              {selectedUser.behaviorScore.trends.quarter}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {selectedUser.behaviorScore.trends.quarter >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-500">vs last quarter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => handleUserAction("assign_role", selectedUser.id)}>
                  <Crown className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("manage_tenants", selectedUser.id)}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Tenants
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("reset_mfa", selectedUser.id)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Reset MFA
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUserAction("terminate_sessions", selectedUser.id)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Terminate Sessions
                </Button>
                {selectedUser.status === "active" ? (
                  <Button size="sm" variant="destructive" onClick={() => handleUserAction("suspend", selectedUser.id)}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleUserAction("activate", selectedUser.id)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Copilot Dialog */}
      <Dialog open={showAICopilot} onOpenChange={setShowAICopilot}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              AI Copilot
            </DialogTitle>
            <DialogDescription>
              Ask me about user behavior, security risks, role optimization, or churn prediction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAICopilotQuery("users with high risk")}
                className="justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                High Risk Users
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAICopilotQuery("inactive admins")}
                className="justify-start"
              >
                <Crown className="h-4 w-4 mr-2" />
                Inactive Admins
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAICopilotQuery("churn prediction")}
                className="justify-start"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Churn Prediction
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAICopilotQuery("role optimization")}
                className="justify-start"
              >
                <Target className="h-4 w-4 mr-2" />
                Role Optimization
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiQuery">Ask AI Copilot</Label>
              <div className="flex gap-2">
                <Input
                  id="aiQuery"
                  placeholder="Ask about user patterns, security risks, or recommendations..."
                  value={aiCopilotQuery}
                  onChange={(e) => setAiCopilotQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAICopilotQuery(aiCopilotQuery)}
                />
                <Button
                  onClick={() => handleAICopilotQuery(aiCopilotQuery)}
                  disabled={aiCopilotLoading || !aiCopilotQuery.trim()}
                >
                  {aiCopilotLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {aiCopilotResponse && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">AI Response</span>
                </div>
                <p className="text-sm text-gray-700">{aiCopilotResponse}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with role and tenant assignments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@company.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="Software Engineer" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Engineering" />
              </div>
            </div>
            <div>
              <Label htmlFor="globalRole">Global Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select global role" />
                </SelectTrigger>
                <SelectContent>
                  {GLOBAL_ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tenant Assignments</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tenants.map((tenant) => (
                  <div key={tenant} className="flex items-center space-x-2">
                    <Checkbox id={tenant} />
                    <Label htmlFor={tenant} className="text-sm">
                      {tenant}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAddUser(false)
                toast.success("User created successfully")
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Assignment Dialog */}
      <Dialog open={!!showRoleAssignment} onOpenChange={() => setShowRoleAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>Assign global or tenant-specific roles to the user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Role</SelectItem>
                  <SelectItem value="tenant">Tenant Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {GLOBAL_ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tenant (for tenant roles)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant} value={tenant}>
                      {tenant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleAssignment(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowRoleAssignment(null)
                toast.success("Role assigned successfully")
              }}
            >
              <Crown className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tenant Access Dialog */}
      <Dialog open={!!showTenantAccess} onOpenChange={() => setShowTenantAccess(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tenant Access</DialogTitle>
            <DialogDescription>Add or remove tenant access for the user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Available Tenants</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tenants.map((tenant) => (
                  <div key={tenant} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`tenant-${tenant}`} />
                      <Label htmlFor={`tenant-${tenant}`}>{tenant}</Label>
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {TENANT_ROLES.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTenantAccess(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowTenantAccess(null)
                toast.success("Tenant access updated successfully")
              }}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Update Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
