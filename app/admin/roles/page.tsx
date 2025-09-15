"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Brain,
  Lock,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Role {
  id: string
  name: string
  description: string
  scope: string
  tenant_id: string | null
  permissions: Record<string, string[]>
  field_permissions: Record<string, any>
  is_system_defined: boolean
  is_active: boolean
  user_count: number
  audit_count: number
  ai_insights: {
    risk_score: number
    insight_type: string
    confidence_score: number
  } | null
  created_at: string
  updated_at: string
}

interface RoleStats {
  total_roles: number
  active_roles: number
  system_roles: number
  tenant_roles: number
  total_assignments: number
  high_risk_roles: number
}

const SCOPE_COLORS = {
  global: "bg-purple-100 text-purple-800",
  tenant: "bg-blue-100 text-blue-800",
  module: "bg-green-100 text-green-800",
}

const RISK_COLORS = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-red-600",
}

export default function RolesPage() {
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [roles, setRoles] = useState<Role[]>([])
  const [stats, setStats] = useState<RoleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [scopeFilter, setScopeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRoles, setTotalRoles] = useState(0)

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
      })

      if (scopeFilter !== "all") {
        params.append("scope", scopeFilter)
      }

      if (statusFilter !== "all") {
        params.append("is_active", statusFilter)
      }

      const response = await fetch(`/api/admin/roles?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRoles(data.data)
        setTotalPages(data.pagination.pages)
        setTotalRoles(data.pagination.total)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch roles",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/roles/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [currentPage, searchQuery, scopeFilter, statusFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  // Handle role actions
  const handleViewRole = (role: Role) => {
    setSelectedRole(role)
    setDetailSheetOpen(true)
  }

  const handleEditRole = (role: Role) => {
    router.push(`/admin/roles/${role.id}/edit`)
  }

  const handleDeleteRole = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/roles/${role.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        })
        fetchRoles()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAssignUsers = (role: Role) => {
    router.push(`/admin/roles/${role.id}/assignments`)
  }

  const handleFieldAccess = (role: Role) => {
    router.push(`/admin/roles/field-access?role_id=${role.id}`)
  }

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 70) return "high"
    if (riskScore >= 40) return "medium"
    return "low"
  }

  const getRiskColor = (riskScore: number) => {
    const level = getRiskLevel(riskScore)
    return RISK_COLORS[level]
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">Manage roles, permissions, and field-level access control</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin/roles/suggest")}>
            <Brain className="mr-2 h-4 w-4" />
            AI Suggestions
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Define a new role with specific permissions and access levels.</DialogDescription>
              </DialogHeader>
              {/* Role creation form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_roles}</div>
              <p className="text-xs text-muted-foreground">{stats.active_roles} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Roles</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.system_roles}</div>
              <p className="text-xs text-muted-foreground">Protected roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenant Roles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tenant_roles}</div>
              <p className="text-xs text-muted-foreground">Custom roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_assignments}</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.high_risk_roles}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Trending up</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="module">Module</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Manage system and tenant roles with granular permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Roles Found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first role.</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium">{role.name}</div>
                          {role.is_system_defined && <Badge variant="secondary">System</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={SCOPE_COLORS[role.scope as keyof typeof SCOPE_COLORS]}>{role.scope}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{role.user_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {role.ai_insights ? (
                        <div className="space-y-1">
                          <div className={`font-medium ${getRiskColor(role.ai_insights.risk_score)}`}>
                            {role.ai_insights.risk_score}%
                          </div>
                          <Progress value={role.ai_insights.risk_score} className="w-16 h-2" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {role.is_active ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(role.updated_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewRole(role)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFieldAccess(role)}>
                            <Lock className="mr-2 h-4 w-4" />
                            Field Access
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignUsers(role)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditRole(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          {!role.is_system_defined && (
                            <DropdownMenuItem onClick={() => handleDeleteRole(role)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Role
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalRoles)} of {totalRoles} roles
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Role Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-[600px] sm:w-[800px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{selectedRole?.name}</span>
              {selectedRole?.is_system_defined && <Badge variant="secondary">System</Badge>}
            </SheetTitle>
            <SheetDescription>{selectedRole?.description}</SheetDescription>
          </SheetHeader>

          {selectedRole && (
            <div className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="audit">Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Scope</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={SCOPE_COLORS[selectedRole.scope as keyof typeof SCOPE_COLORS]}>
                            {selectedRole.scope}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedRole.is_active ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span>Inactive</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedRole.ai_insights ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Risk Score</span>
                              <span className={`font-medium ${getRiskColor(selectedRole.ai_insights.risk_score)}`}>
                                {selectedRole.ai_insights.risk_score}%
                              </span>
                            </div>
                            <Progress value={selectedRole.ai_insights.risk_score} className="w-full" />
                            <div className="text-sm text-muted-foreground">
                              Confidence: {Math.round(selectedRole.ai_insights.confidence_score * 100)}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No risk assessment available</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold">{selectedRole.user_count}</div>
                            <div className="text-sm text-muted-foreground">Active Users</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{selectedRole.audit_count}</div>
                            <div className="text-sm text-muted-foreground">Audit Events</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Module Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(selectedRole.permissions).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(selectedRole.permissions).map(([module, perms]) => (
                            <div key={module} className="flex items-center justify-between">
                              <div className="font-medium capitalize">{module}</div>
                              <div className="flex flex-wrap gap-1">
                                {perms.map((perm) => (
                                  <Badge key={perm} variant="outline">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No module permissions configured</div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Field-Level Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(selectedRole.field_permissions).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(selectedRole.field_permissions).map(([module, tables]) => (
                            <div key={module}>
                              <div className="font-medium capitalize mb-2">{module}</div>
                              {Object.entries(tables as Record<string, any>).map(([table, fields]) => (
                                <div key={table} className="ml-4 mb-2">
                                  <div className="text-sm font-medium text-muted-foreground mb-1">{table}</div>
                                  <div className="ml-4 space-y-1">
                                    {Object.entries(fields as Record<string, string>).map(([field, access]) => (
                                      <div key={field} className="flex items-center justify-between text-sm">
                                        <span>{field}</span>
                                        <Badge
                                          variant={
                                            access === "admin"
                                              ? "default"
                                              : access === "read_write"
                                                ? "secondary"
                                                : "outline"
                                          }
                                        >
                                          {access}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No field-level permissions configured</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Assigned Users</CardTitle>
                      <CardDescription>Users currently assigned to this role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground">User assignments will be loaded here...</div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                      <CardDescription>Recent changes and access events for this role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground">Audit logs will be loaded here...</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
