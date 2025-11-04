"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Edit,
  Plus,
  Building2,
  CreditCard,
  Search,
  Download,
  Ban,
  CheckCircle,
  Eye,
  Filter,
  Archive,
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  TrendingDown,
  AlertTriangle,
} from "lucide-react"
import {
  listTenants,
  upsertTenant,
  getTenantDetails,
  updateTenantStatus,
  toggleTenantFeature,
  bulkSuspendTenants,
  overrideTenantPlans,
  exportTenantsCSV,
  listPlans,
  archiveTenant,
  generateTenantInsights,
  verifyTenantAuditChain,
  triggerTenantRPAWorkflow,
} from "../actions/tenants"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { motion } from "framer-motion"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function TenantsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [viewingDetails, setViewingDetails] = useState<any | null>(null)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    status: "trial",
    plan_id: "",
    billing_email: "",
  })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPlan, setFilterPlan] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [per] = useState(20)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [bulkPlanDialogOpen, setBulkPlanDialogOpen] = useState(false)
  const [bulkPlanId, setBulkPlanId] = useState("")
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [auditVerification, setAuditVerification] = useState<any>(null)
  const [rpaDialogOpen, setRpaDialogOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState("")
  const { toast } = useToast()

  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    trial: 0,
    suspended: 0,
  })

  const loadTenants = async () => {
    setLoading(true)
    try {
      const result = await listTenants({
        q: searchTerm,
        page,
        per,
        status: filterStatus,
        plan: filterPlan,
        sortBy,
        sortOrder,
      })

      if ((result as any).error) {
        toast({ title: "Error", description: (result as any).error, variant: "destructive" })
        setRows([])
        setTotal(0)
        setMetrics({ total: 0, active: 0, trial: 0, suspended: 0 })
        return
      }

      const rows = (result as any).rows as any[]
      const total = (result as any).total as number

      setRows(rows)
      setTotal(total)

      // Calculate metrics
      const activeCount = rows.filter((r: any) => r.status === "active").length
      const trialCount = rows.filter((r: any) => r.status === "trial").length
      const suspendedCount = rows.filter((r: any) => r.status === "suspended").length

      setMetrics({
        total,
        active: activeCount,
        trial: trialCount,
        suspended: suspendedCount,
      })
    } catch (error) {
      console.error("[v0] Error loading tenants:", error)
      toast({ title: "Error", description: "Failed to load tenants", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const loadPlans = async () => {
    try {
      const data = await listPlans()
      setPlans(data)
    } catch (error) {
      console.error("[v0] Error loading plans:", error)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [searchTerm, page, filterStatus, filterPlan, sortBy, sortOrder])

  useEffect(() => {
    loadPlans()
  }, [])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const channel = supabase
      .channel("admin-tenants")
      .on("postgres_changes", { event: "*", schema: "core", table: "tenants" }, () => {
        loadTenants()
      })
      .subscribe()

    return () => {
      // cleanup
      try {
        supabase.removeChannel?.(channel)
      } catch (e) {
        // noop
      }
    }
  }, [searchTerm, page, filterStatus, filterPlan, sortBy, sortOrder])

  const handleSave = async () => {
    try {
        const res = await upsertTenant({
        ...(editing ? { id: editing.id } : {}),
        ...form,
      })
        if ((res as any)?.error) {
          toast({ title: "Error", description: (res as any).error, variant: "destructive" })
          return
        }
      setEditing(null)
      setForm({ name: "", slug: "", status: "trial", plan_id: "", billing_email: "" })
      await loadTenants()
      toast({ title: "Success", description: `Tenant ${editing ? "updated" : "created"} successfully` })
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleEdit = (tenant: any) => {
    setEditing(tenant)
    setForm({
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
      plan_id: tenant.plan?.[0]?.plan_id || "",
      billing_email: tenant.billing_email || "",
    })
  }

  const handleViewDetails = async (tenant: any) => {
    try {
      const details = await getTenantDetails(tenant.id)
      setViewingDetails(details)
    } catch (error: any) {
      console.error("[v0] Error loading tenant details:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleStatusChange = async (tenantId: string, status: "active" | "suspended") => {
    try {
      await updateTenantStatus(tenantId, status)
      await loadTenants()
      toast({ title: "Success", description: `Tenant ${status === "active" ? "activated" : "suspended"}` })
    } catch (error: any) {
      console.error("[v0] Error updating status:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleFeatureToggle = async (tenantId: string, featureSlug: string, enabled: boolean) => {
    try {
      await toggleTenantFeature(tenantId, featureSlug, enabled)
      if (viewingDetails) {
        const details = await getTenantDetails(tenantId)
        setViewingDetails(details)
      }
      toast({ title: "Success", description: `Feature ${enabled ? "enabled" : "disabled"}` })
    } catch (error: any) {
      console.error("[v0] Error toggling feature:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportTenantsCSV(searchTerm)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tenants-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: "Success", description: "Tenants exported successfully" })
    } catch (error: any) {
      console.error("[v0] Error exporting:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

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

  const handleBulkSuspend = async (action: "suspend" | "activate") => {
    try {
      await bulkSuspendTenants({ tenant_ids: selected, action })
      setSelected([])
      toast({ title: "Success", description: `${selected.length} tenant(s) ${action}d` })
      await loadTenants()
    } catch (error: any) {
      console.error("[v0] Error in bulk action:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleBulkPlanOverride = async () => {
    try {
      await overrideTenantPlans({ tenant_ids: selected, plan_id: bulkPlanId })
      setSelected([])
      setBulkPlanDialogOpen(false)
      setBulkPlanId("")
      toast({ title: "Success", description: `Plan overridden for ${selected.length} tenant(s)` })
      await loadTenants()
    } catch (error: any) {
      console.error("[v0] Error overriding plans:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleArchive = async (tenantId: string) => {
    try {
      await archiveTenant(tenantId)
      toast({ title: "Success", description: "Tenant archived" })
      await loadTenants()
    } catch (error: any) {
      console.error("[v0] Error archiving tenant:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleLoadInsights = async (tenantId: string) => {
    setLoadingInsights(true)
    try {
      const insights = await generateTenantInsights(tenantId)
      setAiInsights(insights)
      toast({ title: "Success", description: "AI insights generated successfully" })
    } catch (error: any) {
      console.error("[v0] Error loading insights:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleVerifyAuditChain = async (tenantId: string) => {
    try {
      const verification = await verifyTenantAuditChain(tenantId)
      setAuditVerification(verification)
      toast({
        title: verification.verified ? "Verified" : "Warning",
        description: verification.message,
        variant: verification.verified ? "default" : "destructive",
      })
    } catch (error: any) {
      console.error("[v0] Error verifying audit chain:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleTriggerRPA = async () => {
    if (!viewingDetails || !selectedWorkflow) return

    try {
      const result = await triggerTenantRPAWorkflow(viewingDetails.tenant.id, selectedWorkflow)
      setRpaDialogOpen(false)
      setSelectedWorkflow("")
      toast({ title: "Success", description: result.message })
    } catch (error: any) {
      console.error("[v0] Error triggering RPA:", error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / per))

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tenant Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage organizations, plans, and lifecycle events</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Tenant" : "Create Tenant"}</DialogTitle>
                <DialogDescription>Configure organization details and plan</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    placeholder="Acme Corp"
                    value={form.name}
                    onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="acme-corp"
                    value={form.slug}
                    onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(v: string) => setForm((f) => ({ ...f, status: v }))}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={form.plan_id} onValueChange={(v: string) => setForm((f) => ({ ...f, plan_id: v }))}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="billing_email">Billing Email</Label>
                  <Input
                    id="billing_email"
                    type="email"
                    placeholder="billing@acme.com"
                    value={form.billing_email}
                    onChange={(e) => setForm((v) => ({ ...v, billing_email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: "Total Tenants",
              value: metrics.total,
              icon: Building2,
              color: "from-indigo-500 to-purple-500",
              bgColor: "bg-indigo-500/10",
            },
            {
              title: "Active",
              value: metrics.active,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-500/10",
            },
            {
              title: "Trial",
              value: metrics.trial,
              icon: TrendingUp,
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-500/10",
            },
            {
              title: "Suspended",
              value: metrics.suspended,
              icon: Ban,
              color: "from-red-500 to-pink-500",
              bgColor: "bg-red-500/10",
            },
          ].map((stat, index: number) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p
                        className={`text-3xl font-bold mt-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tenant Directory</CardTitle>
                  <CardDescription>Search, filter, and manage all organizations</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkSuspend("activate")}
                    disabled={selected.length === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkSuspend("suspend")}
                    disabled={selected.length === 0}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkPlanDialogOpen(true)}
                    disabled={selected.length === 0}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Override Plan
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selected.length > 0) {
                        toast({ title: "Coming Soon", description: "Bulk AI insights generation" })
                      }
                    }}
                    disabled={selected.length === 0}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Insights
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: string) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPlan} onValueChange={(value: string) => setFilterPlan(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {plans.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading tenants...</div>
              ) : rows.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No tenants found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("all")
                      setFilterPlan("all")
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
                        <th className="p-3 text-left">Organization</th>
                        <th className="p-3 text-left">Plan</th>
                        <th className="p-3 text-left">Users</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Created</th>
                        <th className="p-3 text-left w-32">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r: any) => (
                        <tr key={r.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{r.name}</div>
                              <div className="text-xs text-muted-foreground">{r.slug}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{r.plan?.[0]?.plans?.name || "No Plan"}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{r.user_count?.[0]?.count || 0}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                r.status === "active" ? "default" : r.status === "trial" ? "secondary" : "destructive"
                              }
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(r)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(r)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {rows.length} of {total} tenants
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={bulkPlanDialogOpen} onOpenChange={setBulkPlanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override Plan for {selected.length} Tenant(s)</DialogTitle>
              <DialogDescription>Select a plan to apply to all selected tenants</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={bulkPlanId} onValueChange={(value: string) => setBulkPlanId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkPlanOverride} disabled={!bulkPlanId}>
                Override Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingDetails} onOpenChange={(open) => !open && setViewingDetails(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingDetails?.tenant?.name}</DialogTitle>
              <DialogDescription>Tenant details, features, and usage statistics</DialogDescription>
            </DialogHeader>

            {viewingDetails && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                  <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                  <TabsTrigger value="ai">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Organization Name</Label>
                      <div className="font-medium">{viewingDetails.tenant.name}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Slug</Label>
                      <div className="font-medium">{viewingDetails.tenant.slug}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge
                        variant={
                          viewingDetails.tenant.status === "active"
                            ? "default"
                            : viewingDetails.tenant.status === "trial"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {viewingDetails.tenant.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Plan</Label>
                      <div className="font-medium">{viewingDetails.tenant.plan?.[0]?.plans?.name || "No Plan"}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Billing Email</Label>
                      <div className="font-medium">{viewingDetails.tenant.billing_email || "Not set"}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created</Label>
                      <div className="font-medium">
                        {new Date(viewingDetails.tenant.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant={viewingDetails.tenant.status === "active" ? "destructive" : "default"}
                      onClick={() => {
                        handleStatusChange(
                          viewingDetails.tenant.id,
                          viewingDetails.tenant.status === "active" ? "suspended" : "active",
                        )
                        setViewingDetails(null)
                      }}
                    >
                      {viewingDetails.tenant.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                    <Button variant="outline" onClick={() => handleEdit(viewingDetails.tenant)}>
                      Edit Details
                    </Button>
                    <Button variant="outline" onClick={() => handleArchive(viewingDetails.tenant.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="space-y-2">
                    {viewingDetails.features?.length > 0 ? (
                      viewingDetails.features.map((f: any) => (
                        <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{f.features.name}</div>
                            <div className="text-sm text-muted-foreground">{f.features.description}</div>
                          </div>
                          <Switch
                            checked={f.enabled}
                            onCheckedChange={(checked: boolean) =>
                              handleFeatureToggle(viewingDetails.tenant.id, f.features.slug, checked)
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No feature overrides. Using plan defaults.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{viewingDetails.stats?.user_count || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{viewingDetails.stats?.doc_count || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Copilot Sessions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{viewingDetails.stats?.copilot_sessions || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Recent activity for this tenant</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyAuditChain(viewingDetails.tenant.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Chain
                    </Button>
                  </div>

                  {auditVerification && (
                    <div
                      className={`p-3 rounded-lg border ${
                        auditVerification.verified
                          ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {auditVerification.verified ? (
                          <Shield className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">{auditVerification.message}</div>
                          <div className="text-sm text-muted-foreground">Total logs: {auditVerification.totalLogs}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {viewingDetails.stats?.recent_audit?.map((log: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 border rounded text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{log.action}</div>
                          <div className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                    )) || <div className="text-center py-8 text-muted-foreground">No audit logs available</div>}
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  {!aiInsights ? (
                    <div className="text-center py-12 space-y-4">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <div>
                        <p className="text-lg font-medium">AI-Powered Tenant Insights</p>
                        <p className="text-sm text-muted-foreground">
                          Generate health scores, churn predictions, and recommendations
                        </p>
                      </div>
                      <Button onClick={() => handleLoadInsights(viewingDetails.tenant.id)} disabled={loadingInsights}>
                        {loadingInsights ? "Generating..." : "Generate Insights"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{aiInsights.healthScore}/100</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {aiInsights.healthScore >= 80
                                ? "Excellent"
                                : aiInsights.healthScore >= 60
                                  ? "Good"
                                  : aiInsights.healthScore >= 40
                                    ? "Fair"
                                    : "Needs Attention"}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Churn Risk</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              {aiInsights.churnRisk === "High" && <TrendingDown className="h-5 w-5 text-red-500" />}
                              {aiInsights.churnRisk === "Medium" && (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              )}
                              <div className="text-2xl font-bold">{aiInsights.churnRisk}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Recommendations</Label>
                        <div className="space-y-2 mt-2">
                          {aiInsights.recommendations?.map((rec: string, i: number) => (
                            <div key={i} className="p-3 border rounded-lg bg-muted/50">
                              <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  {i + 1}
                                </div>
                                <div className="flex-1 text-sm">{rec}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {aiInsights.upsellOpportunities?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Upsell Opportunities</Label>
                          <div className="space-y-2 mt-2">
                            {aiInsights.upsellOpportunities.map((opp: string, i: number) => (
                              <div key={i} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                                <div className="text-sm">{opp}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadInsights(viewingDetails.tenant.id)}
                          disabled={loadingInsights}
                        >
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setRpaDialogOpen(true)}>
                          <Zap className="h-4 w-4 mr-2" />
                          Trigger RPA Workflow
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={rpaDialogOpen} onOpenChange={setRpaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trigger RPA Workflow</DialogTitle>
              <DialogDescription>Automate tenant lifecycle management tasks</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workflow Type</Label>
                <Select value={selectedWorkflow} onValueChange={(value: string) => setSelectedWorkflow(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health_check">Tenant Health Check</SelectItem>
                    <SelectItem value="onboarding">Automated Onboarding</SelectItem>
                    <SelectItem value="compliance">Compliance Audit</SelectItem>
                    <SelectItem value="renewal">Renewal Preparation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRpaDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTriggerRPA} disabled={!selectedWorkflow}>
                <Zap className="mr-2 h-4 w-4" />
                Trigger Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TwoPane>
  )
}
