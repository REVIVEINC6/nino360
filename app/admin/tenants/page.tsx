"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Edit,
  Pause,
  Play,
  Trash2,
  FileText,
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Bot,
  Shield,
} from "lucide-react"

interface Tenant {
  id: string
  name: string
  domain: string
  logo?: string
  status: "active" | "trial" | "suspended" | "inactive"
  plan: "starter" | "professional" | "enterprise"
  users: number
  revenue: number
  createdAt: string
  lastActive: string
  location: string
  modules: string[]
  health: number
  growth: number
  contact: {
    name: string
    email: string
    phone: string
  }
}

// Mock data for demonstration
const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Acme Corporation",
    domain: "acme.com",
    logo: "/placeholder.svg?height=32&width=32",
    status: "active",
    plan: "enterprise",
    users: 245,
    revenue: 2990,
    createdAt: "2024-01-15",
    lastActive: "2024-01-20",
    location: "New York, US",
    modules: ["CRM", "HRMS", "Finance"],
    health: 95,
    growth: 12,
    contact: {
      name: "John Smith",
      email: "john@acme.com",
      phone: "+1-555-0123",
    },
  },
  {
    id: "2",
    name: "TechStart Inc",
    domain: "techstart.io",
    logo: "/placeholder.svg?height=32&width=32",
    status: "trial",
    plan: "professional",
    users: 45,
    revenue: 990,
    createdAt: "2024-01-10",
    lastActive: "2024-01-19",
    location: "San Francisco, US",
    modules: ["CRM", "Talent"],
    health: 78,
    growth: 8,
    contact: {
      name: "Sarah Johnson",
      email: "sarah@techstart.io",
      phone: "+1-555-0456",
    },
  },
  {
    id: "3",
    name: "Global Solutions",
    domain: "globalsol.com",
    logo: "/placeholder.svg?height=32&width=32",
    status: "suspended",
    plan: "starter",
    users: 12,
    revenue: 290,
    createdAt: "2024-01-05",
    lastActive: "2024-01-18",
    location: "London, UK",
    modules: ["CRM"],
    health: 45,
    growth: -5,
    contact: {
      name: "Michael Brown",
      email: "michael@globalsol.com",
      phone: "+44-20-7946-0958",
    },
  },
]

const statusConfig = {
  active: { color: "bg-green-500", label: "Active", icon: CheckCircle },
  trial: { color: "bg-blue-500", label: "Trial", icon: Clock },
  suspended: { color: "bg-red-500", label: "Suspended", icon: XCircle },
  inactive: { color: "bg-gray-500", label: "Inactive", icon: Minus },
}

const planConfig = {
  starter: { color: "bg-blue-100 text-blue-800", label: "Starter", price: 29 },
  professional: { color: "bg-purple-100 text-purple-800", label: "Professional", price: 99 },
  enterprise: { color: "bg-orange-100 text-orange-800", label: "Enterprise", price: 299 },
}

export default function AdminTenantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // State management
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [sortBy, setSortBy] = useState<keyof Tenant>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Handle URL parameters
  useEffect(() => {
    const action = searchParams.get("action")
    if (action === "create") {
      setIsCreateModalOpen(true)
    }
  }, [searchParams])

  // Filter and sort tenants
  const filteredTenants = useMemo(() => {
    const filtered = tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
      const matchesPlan = planFilter === "all" || tenant.plan === planFilter
      const matchesRegion = regionFilter === "all" || tenant.location.includes(regionFilter)

      return matchesSearch && matchesStatus && matchesPlan && matchesRegion
    })

    // Sort tenants
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "users":
          comparison = a.users - b.users
          break
        case "revenue":
          comparison = a.revenue - b.revenue
          break
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "lastActive":
          comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [tenants, searchQuery, statusFilter, planFilter, regionFilter, sortBy, sortOrder])

  // Pagination
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTenants.slice(startIndex, startIndex + pageSize)
  }, [filteredTenants, currentPage, pageSize])

  const totalPages = Math.ceil(filteredTenants.length / pageSize)

  // Statistics
  const stats = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.status === "active").length
    const trial = tenants.filter((t) => t.status === "trial").length
    const suspended = tenants.filter((t) => t.status === "suspended").length
    const totalRevenue = tenants.reduce((sum, t) => sum + t.revenue, 0)
    const totalUsers = tenants.reduce((sum, t) => sum + t.users, 0)

    return { total, active, trial, suspended, totalRevenue, totalUsers }
  }, [tenants])

  // AI Insights
  const aiInsights = useMemo(
    () => [
      {
        type: "warning",
        title: "Low Engagement Alert",
        description: "3 tenants have no user logins in the past 7 days",
        action: "View Details",
        priority: "high",
      },
      {
        type: "info",
        title: "Module Optimization",
        description: "2 tenants have Finance enabled but no transaction records",
        action: "Suggest Training",
        priority: "medium",
      },
      {
        type: "success",
        title: "Growth Opportunity",
        description: "5 tenants are approaching user limits - suggest plan upgrade",
        action: "Send Upgrade Offers",
        priority: "medium",
      },
      {
        type: "warning",
        title: "Trial Expiration",
        description: "8 trial tenants expire within 3 days",
        action: "Send Conversion Emails",
        priority: "high",
      },
    ],
    [],
  )

  // Event handlers
  const handleTenantSelect = (tenantId: string, checked: boolean) => {
    setSelectedTenants((prev) => (checked ? [...prev, tenantId] : prev.filter((id) => id !== tenantId)))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedTenants(checked ? paginatedTenants.map((t) => t.id) : [])
  }

  const handleTenantAction = async (action: string, tenant: Tenant) => {
    try {
      setLoading(true)
      switch (action) {
        case "view":
          setSelectedTenant(tenant)
          setIsDetailSheetOpen(true)
          break
        case "edit":
          setSelectedTenant(tenant)
          setIsDetailSheetOpen(true)
          break
        case "suspend":
          setTenants((prev) => prev.map((t) => (t.id === tenant.id ? { ...t, status: "suspended" as const } : t)))
          toast({
            title: "Tenant Suspended",
            description: `${tenant.name} has been suspended successfully.`,
          })
          break
        case "activate":
          setTenants((prev) => prev.map((t) => (t.id === tenant.id ? { ...t, status: "active" as const } : t)))
          toast({
            title: "Tenant Activated",
            description: `${tenant.name} has been activated successfully.`,
          })
          break
        case "delete":
          if (confirm(`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`)) {
            setTenants((prev) => prev.filter((t) => t.id !== tenant.id))
            toast({
              title: "Tenant Deleted",
              description: `${tenant.name} has been deleted successfully.`,
              variant: "destructive",
            })
          }
          break
        case "logs":
          router.push(`/admin/tenants/${tenant.id}/logs`)
          break
        case "reset-password":
          toast({
            title: "Password Reset",
            description: `Password reset email sent to ${tenant.contact.email}`,
          })
          break
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedTenants.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select tenants to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSelectedTenants([])
      toast({
        title: "Bulk Action Completed",
        description: `${action} applied to ${selectedTenants.length} tenants.`,
      })
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: "csv" | "xlsx" = "csv") => {
    try {
      setLoading(true)
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Export Completed",
        description: `Tenant data exported as ${format.toUpperCase()} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export tenant data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTenant = async (tenantData: any) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTenant: Tenant = {
        id: Date.now().toString(),
        ...tenantData,
        users: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        health: 100,
        growth: 0,
      }

      setTenants((prev) => [newTenant, ...prev])
      setIsCreateModalOpen(false)
      toast({
        title: "Tenant Created",
        description: `${tenantData.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    setLoading(true)
    // Simulate API refetch
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600"
    if (health >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
              <p className="text-sm text-gray-600">Global tenant directory and configuration hub</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAiPanelOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Copilot
              </Button>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.active / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trial</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
              <p className="text-xs text-muted-foreground">8 expiring soon</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/60 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>Export as Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="bg-white/60 backdrop-blur-sm border-0 shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTenants.length > 0 && (
          <Card className="bg-blue-50/80 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{selectedTenants.length} tenants selected</div>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")}>
                    <Pause className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedTenants([])}>
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tenants Table */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Tenant Directory</CardTitle>
            <CardDescription>Manage all tenant accounts, configurations, and lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTenants.length === paginatedTenants.length && paginatedTenants.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedTenants.map((tenant) => (
                      <motion.tr
                        key={tenant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedTenants.includes(tenant.id)}
                            onCheckedChange={(checked) => handleTenantSelect(tenant.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={tenant.logo || "/placeholder.svg"} />
                              <AvatarFallback>{tenant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-sm text-muted-foreground">{tenant.domain}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={planConfig[tenant.plan].color}>{planConfig[tenant.plan].label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusConfig[tenant.status].color}`} />
                            <span className="text-sm">{statusConfig[tenant.status].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{tenant.users.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{formatCurrency(tenant.revenue)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`text-sm font-medium ${getHealthColor(tenant.health)}`}>
                              {tenant.health}%
                            </div>
                            {getGrowthIcon(tenant.growth)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(tenant.createdAt)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(tenant.lastActive)}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleTenantAction("view", tenant)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTenantAction("edit", tenant)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Configuration
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {tenant.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleTenantAction("suspend", tenant)}>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleTenantAction("activate", tenant)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleTenantAction("reset-password", tenant)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTenantAction("logs", tenant)}>
                                <FileText className="h-4 w-4 mr-2" />
                                View Logs
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleTenantAction("delete", tenant)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTenants.length)}{" "}
                of {filteredTenants.length} tenants
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      {isAiPanelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">AI Copilot</h2>
                    <p className="text-sm text-muted-foreground">Intelligent tenant insights and recommendations</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsAiPanelOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                    <Badge
                      variant={
                        insight.priority === "high"
                          ? "destructive"
                          : insight.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3 bg-transparent">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Tenant Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Create New Tenant</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input placeholder="Enter company name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Domain</label>
                <Input placeholder="company.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Plan</label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input placeholder="admin@company.com" className="mt-1" />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleCreateTenant({
                    name: "New Company",
                    domain: "newcompany.com",
                    plan: "starter",
                    status: "trial",
                    location: "Unknown",
                    modules: ["CRM"],
                    contact: {
                      name: "Admin User",
                      email: "admin@newcompany.com",
                      phone: "+1-555-0000",
                    },
                  })
                }
              >
                Create Tenant
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
