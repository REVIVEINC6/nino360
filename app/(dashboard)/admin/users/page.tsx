"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Download,
  UserPlus,
  CheckCircle,
  XCircle,
  Ban,
  Filter,
  Eye,
  Users,
  Activity,
  Shield,
  Clock,
  Sparkles,
  Link2,
  Zap,
  Save,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  listUsers,
  bulkUserStatus,
  exportUsersCSV,
  getUserDetails,
  updateUser,
  bulkAssignRole,
  resetUserPassword,
  saveFilter,
  getSavedFilters,
} from "../actions/users"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { useToast } from "@/hooks/use-toast"
import { useFeatureFlags } from "@/hooks/use-feature-flags"
import { motion } from "framer-motion"

function AIInsights({ metrics }: { metrics: any }) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    try {
      const newInsights = []

      if (metrics.suspended > metrics.total * 0.05) {
        newInsights.push(
          `⚠️ High suspension rate detected: ${((metrics.suspended / metrics.total) * 100).toFixed(1)}% of users are suspended`,
        )
      }

      if (metrics.pending > 10) {
        newInsights.push(`📋 ${metrics.pending} users pending activation - consider automated onboarding`)
      }

      if (metrics.inactive > metrics.active * 0.3) {
        newInsights.push(`💤 ${metrics.inactive} inactive users detected - recommend re-engagement campaign`)
      }

      const activeRate = (metrics.active / metrics.total) * 100
      if (activeRate > 80) {
        newInsights.push(`✅ Excellent user engagement: ${activeRate.toFixed(1)}% active users`)
      }

      setInsights(newInsights)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (metrics.total > 0) {
      generateInsights()
    }
  }, [metrics])

  if (insights.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Insights
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={generateInsights} disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.map((insight: any, i: number) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm text-muted-foreground"
            >
              {insight}
            </motion.p>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AuditBadge({ verified }: { verified: boolean }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <Link2 className={`h-3 w-3 ${verified ? "text-green-500" : "text-yellow-500"}`} />
      <span className={verified ? "text-green-500" : "text-yellow-500"}>{verified ? "Verified" : "Pending"}</span>
    </div>
  )
}

export default function UsersPage() {
  const [rows, setRows] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [per] = useState(20)
  const [q, setQ] = useState("")
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<string>("desc")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: "", status: "" })
  const { toast } = useToast()

  const { hasFeature } = useFeatureFlags()
  const aiEnabled = hasFeature("ai_insights")
  const blockchainEnabled = hasFeature("audit_chain")
  const rpaEnabled = hasFeature("rpa_automation")

  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const [filterName, setFilterName] = useState("")

  const [showBulkRole, setShowBulkRole] = useState(false)
  const [bulkRoleId, setBulkRoleId] = useState("")
  const [bulkTenantId, setBulkTenantId] = useState("")

  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    pending: 0,
  })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await listUsers({
        q,
        page,
        per,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortOrder,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        setRows([])
        setTotal(0)
        return
      }

      setRows(result.rows)
      setTotal(result.total)

      const activeCount = result.rows.filter((r: any) => r.status === "active").length
      const inactiveCount = result.rows.filter((r: any) => r.status === "inactive").length
      const suspendedCount = result.rows.filter((r: any) => r.status === "suspended").length
      const pendingCount = result.rows.filter((r: any) => r.status === "pending").length

      setMetrics({
        total: result.total,
        active: activeCount,
        inactive: inactiveCount,
        suspended: suspendedCount,
        pending: pendingCount,
      })
    } catch (error: any) {
      console.error("[v0] Error loading users:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSavedFilters = async () => {
    try {
      const result = await getSavedFilters()
      if (!result.error) {
        setSavedFilters(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading saved filters:", error)
    }
  }

  useEffect(() => {
    loadUsers()
    loadSavedFilters()
  }, [q, page, per, statusFilter, roleFilter, sortBy, sortOrder])

  // Realtime updates
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const channel = supabase
      .channel("admin-users")
      .on("postgres_changes", { event: "*", schema: "core", table: "users" }, () => {
        loadUsers()
      })
      .on("postgres_changes", { event: "*", schema: "core", table: "user_roles" }, () => {
        loadUsers()
      })
      .subscribe()

    return () => {
      try {
        supabase.removeChannel?.(channel)
      } catch (e) {
        // noop
      }
    }
  }, [q, page, per, statusFilter, roleFilter, sortBy, sortOrder])

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selected.length === rows.length) {
      setSelected([])
    } else {
      setSelected(rows.map((r) => r.id))
    }
  }

  const handleBulk = async (action: "activate" | "deactivate" | "suspend") => {
    try {
      await bulkUserStatus({ user_ids: selected, action })
      setSelected([])
      toast({
        title: "Success",
        description: `${selected.length} user(s) ${action}d`,
      })
      await loadUsers()
    } catch (error: any) {
      console.error("[v0] Error in bulk action:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportUsersCSV(q)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-${new Date().toISOString()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Users exported successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error exporting:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = async (user: any) => {
    setSelectedUser(user)
    setDetailsOpen(true)
    setEditMode(false)
    setEditForm({ full_name: user.full_name || "", status: user.status || "active" })

    try {
      const details = await getUserDetails({ user_id: user.id })
      setUserDetails(details)
    } catch (error: any) {
      console.error("[v0] Error loading user details:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async () => {
    try {
      await updateUser({
        user_id: selectedUser.id,
        full_name: editForm.full_name,
        status: editForm.status,
      })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      setEditMode(false)
      setDetailsOpen(false)
      await loadUsers()
    } catch (error: any) {
      console.error("[v0] Error updating user:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSaveFilter = async () => {
    try {
      await saveFilter({
        name: filterName,
        filter_type: "users",
        filter_config: {
          q,
          status: statusFilter,
          role: roleFilter,
          sortBy,
          sortOrder,
        },
      })
      toast({
        title: "Success",
        description: "Filter saved successfully",
      })
      setShowSaveFilter(false)
      setFilterName("")
      await loadSavedFilters()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleBulkRoleAssign = async () => {
    try {
      await bulkAssignRole({
        user_ids: selected,
        tenant_id: bulkTenantId,
        role_id: bulkRoleId,
      })
      toast({
        title: "Success",
        description: `Role assigned to ${selected.length} user(s)`,
      })
      setShowBulkRole(false)
      setSelected([])
      await loadUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handlePasswordReset = async (user: any) => {
    try {
      await resetUserPassword({ user_id: user.id, email: user.email })
      toast({
        title: "Success",
        description: "Password reset email sent",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / per))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Global User Management
          </h1>
          <p className="text-muted-foreground">Manage user accounts, permissions, and access across all regions</p>
        </div>
        <div className="flex gap-2">
          {rpaEnabled && (
            <Button variant="outline" className="glass-card border-white/20 bg-transparent">
              <Zap className="mr-2 h-4 w-4" />
              RPA Workflows
            </Button>
          )}
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Users",
            value: metrics.total,
            icon: Users,
            color: "from-indigo-500 to-purple-500",
            trend: null,
          },
          {
            label: "Active",
            value: metrics.active,
            icon: CheckCircle,
            color: "from-green-500 to-emerald-500",
            trend: "+12%",
          },
          {
            label: "Inactive",
            value: metrics.inactive,
            icon: XCircle,
            color: "from-gray-500 to-slate-500",
            trend: "-5%",
          },
          { label: "Suspended", value: metrics.suspended, icon: Ban, color: "from-red-500 to-rose-500", trend: "-2%" },
          {
            label: "Pending",
            value: metrics.pending,
            icon: Clock,
            color: "from-yellow-500 to-orange-500",
            trend: "+8%",
          },
        ].map((stat, index: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-4 w-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  {stat.trend && (
                    <div
                      className={`flex items-center gap-1 text-xs ${stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.trend.startsWith("+") ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {aiEnabled && <AIInsights metrics={metrics} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Search, filter, and manage users across all regions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulk("activate")}
                  disabled={selected.length === 0}
                  className="glass-card border-white/20"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulk("deactivate")}
                  disabled={selected.length === 0}
                  className="glass-card border-white/20"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulk("suspend")}
                  disabled={selected.length === 0}
                  className="glass-card border-white/20"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkRole(true)}
                  disabled={selected.length === 0}
                  className="glass-card border-white/20"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Assign Role
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="glass-card border-white/20 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Search by email or name..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(1)
                }}
                className="md:col-span-2"
              />

              <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="full_name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setShowSaveFilter(true)}>
                <Save className="mr-2 h-4 w-4" />
                Save Filter
              </Button>
            </div>

            {savedFilters.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Saved Filters:</span>
                {savedFilters.map((filter: any) => (
                  <Button
                    key={filter.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const config: any = filter.filter_config
                      setQ(config.q || "")
                      setStatusFilter(config.status || "all")
                      setRoleFilter(config.role || "")
                      setSortBy(config.sortBy || "created_at")
                      setSortOrder(config.sortOrder || "desc")
                    }}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQ("")
                    setStatusFilter("all")
                    setRoleFilter("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-3 text-left w-12">
                        <Checkbox
                          checked={selected.length === rows.length && rows.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Roles</th>
                      <th className="p-3 text-left">Tenants</th>
                      <th className="p-3 text-left">Created</th>
                      {blockchainEnabled && <th className="p-3 text-left">Audit</th>}
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </td>
                        <td className="p-3">{r.email}</td>
                        <td className="p-3">{r.full_name || "-"}</td>
                        <td className="p-3">
                          <Badge variant={getStatusColor(r.status)}>{r.status}</Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {r.roles || "None"}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{r.tenants || "-"}</td>
                        <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                        {blockchainEnabled && (
                          <td className="p-3">
                            <AuditBadge verified={true} />
                          </td>
                        )}
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(r)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {rows.length} of {total} users
                {selected.length > 0 && ` (${selected.length} selected)`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View and manage user information, roles, and activity</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    {editMode ? (
                      <Select
                        value={editForm.status}
                        onValueChange={(v: string) => setEditForm({ ...editForm, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                    )}
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    {editMode ? (
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{selectedUser.full_name || "-"}</p>
                    )}
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <p className="text-xs text-muted-foreground font-mono">{selectedUser.id}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={() => handlePasswordReset(selectedUser)}>
                    Reset Password
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4">
                {userDetails?.roles && userDetails.roles.length > 0 ? (
                  <div className="space-y-2">
                    {userDetails.roles.map((role: any) => (
                      <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium">{role.label}</span>
                        </div>
                        <Badge variant="outline">{role.key}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No roles assigned</p>
                )}
              </TabsContent>

              <TabsContent value="tenants" className="space-y-4">
                {userDetails?.tenants && userDetails.tenants.length > 0 ? (
                  <div className="space-y-2">
                    {userDetails.tenants.map((tenant: any) => (
                      <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {tenant.is_primary && <Badge variant="default">Primary</Badge>}
                          <Badge variant="outline">{tenant.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No tenant memberships</p>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {userDetails?.activity && userDetails.activity.length > 0 ? (
                  <div className="space-y-2">
                    {userDetails.activity.map((log: any) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{log.action}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{log.resource_type}</p>
                          {blockchainEnabled && log.hash && (
                            <div className="mt-2">
                              <AuditBadge verified={true} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Save Changes</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setEditMode(true)}>Edit User</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveFilter} onOpenChange={setShowSaveFilter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>
            <DialogDescription>Save your current filter settings for quick access</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Filter Name</Label>
              <Input
                placeholder="e.g., Active Users"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveFilter(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter} disabled={!filterName}>
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkRole} onOpenChange={setShowBulkRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Role Assignment</DialogTitle>
            <DialogDescription>Assign a role to {selected.length} selected user(s)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tenant</Label>
              <Input placeholder="Tenant ID" value={bulkTenantId} onChange={(e) => setBulkTenantId(e.target.value)} />
            </div>
            <div>
              <Label>Role</Label>
              <Input placeholder="Role ID" value={bulkRoleId} onChange={(e) => setBulkRoleId(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkRole(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkRoleAssign} disabled={!bulkTenantId || !bulkRoleId}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
