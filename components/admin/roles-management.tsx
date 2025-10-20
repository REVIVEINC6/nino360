"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Shield, Edit, Trash2, Copy, MoreVertical, Sparkles, Lock, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { CreateRoleDialog } from "./create-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { PermissionsDialog } from "./permissions-dialog"
import { deleteRole, bulkDeleteRoles, cloneRole } from "@/app/(dashboard)/admin/actions/roles"

interface Role {
  id: string
  key: string
  label: string
  description?: string
  role_permissions?: { count: number }[]
}

interface Permission {
  id: string
  key: string
  description?: string
}

interface RolesManagementProps {
  initialRoles: Role[]
  initialPermissions: Permission[]
}

export function RolesManagement({ initialRoles, initialPermissions }: RolesManagementProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [permissions] = useState<Permission[]>(initialPermissions)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("key")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selected, setSelected] = useState<string[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [verifyingAudit, setVerifyingAudit] = useState(false)
  const { toast } = useToast()

  // Filter and sort roles
  const filteredRoles = roles
    .filter((role) => {
      if (!search) return true
      return (
        role.key.toLowerCase().includes(search.toLowerCase()) || role.label.toLowerCase().includes(search.toLowerCase())
      )
    })
    .sort((a, b) => {
      const aVal = a[sortBy as keyof Role] as string
      const bVal = b[sortBy as keyof Role] as string
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      await deleteRole(roleId)
      setRoles(roles.filter((r) => r.id !== roleId))
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selected.length} role(s)?`)) return

    try {
      await bulkDeleteRoles({ roleIds: selected })
      setRoles(roles.filter((r) => !selected.includes(r.id)))
      setSelected([])
      toast({
        title: "Success",
        description: `${selected.length} role(s) deleted successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleClone = async (role: Role) => {
    const newKey = prompt(`Enter key for cloned role (original: ${role.key}):`, `${role.key}_copy`)
    const newLabel = prompt(`Enter label for cloned role (original: ${role.label}):`, `${role.label} (Copy)`)

    if (!newKey || !newLabel) return

    try {
      const result = await cloneRole(role.id, newKey, newLabel)
      setRoles([...roles, result.role])
      toast({
        title: "Success",
        description: "Role cloned successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const loadAiRecommendations = async () => {
    try {
      const { getRoleRecommendations } = await import("@/app/(dashboard)/admin/actions/roles")
      const recommendations = await getRoleRecommendations()
      setAiRecommendations(recommendations)
      setShowAiPanel(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load AI recommendations",
        variant: "destructive",
      })
    }
  }

  const verifyAuditChain = async (roleId: string) => {
    setVerifyingAudit(true)
    try {
      const { verifyRoleAuditChain } = await import("@/app/(dashboard)/admin/actions/roles")
      const result = await verifyRoleAuditChain(roleId)
      toast({
        title: result.valid ? "Audit Verified" : "Audit Failed",
        description: result.message,
        variant: result.valid ? "default" : "destructive",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to verify audit chain",
        variant: "destructive",
      })
    } finally {
      setVerifyingAudit(false)
    }
  }

  const triggerAutomation = async (action: "sync" | "audit" | "cleanup") => {
    try {
      const { triggerRoleAutomation } = await import("@/app/(dashboard)/admin/actions/roles")
      const result = await triggerRoleAutomation(action)
      toast({
        title: "Automation Triggered",
        description: result.message,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getPermissionCount = (role: Role) => {
    return role.role_permissions?.[0]?.count || 0
  }

  const isSystemRole = (key: string) => {
    return ["master_admin", "super_admin", "admin"].includes(key)
  }

  return (
    <div className="space-y-6">
      {showAiPanel && aiRecommendations.length > 0 && (
        <Card className="glass-card border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Recommendations
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAiPanel(false)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiRecommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-lg glass-card border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{rec.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{rec.description}</div>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"
                      }
                      className="ml-2"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Create, edit, and manage roles with their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 glass-input"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] glass-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key">Key</SelectItem>
                  <SelectItem value="label">Label</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="glass-button"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadAiRecommendations} className="glass-button bg-transparent">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="glass-button bg-transparent">
                    <Zap className="h-4 w-4 mr-2" />
                    Automation
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => triggerAutomation("sync")}>
                    Sync Roles Across Tenants
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => triggerAutomation("audit")}>Run Audit Checks</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => triggerAutomation("cleanup")}>Cleanup Unused Roles</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {selected.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selected.length})
                </Button>
              )}
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.length === filteredRoles.length && filteredRoles.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(filteredRoles.map((r) => r.id))
                      } else {
                        setSelected([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(role.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelected([...selected, role.id])
                          } else {
                            setSelected(selected.filter((id) => id !== role.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{role.label}</div>
                          {role.description && <div className="text-sm text-muted-foreground">{role.description}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{role.key}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getPermissionCount(role)} permission{getPermissionCount(role) !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isSystemRole(role.key) ? (
                        <Badge variant="default">System</Badge>
                      ) : (
                        <Badge variant="outline">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditRole(role)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPermissionsRole(role)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => verifyAuditChain(role.id)} disabled={verifyingAudit}>
                            <Lock className="h-4 w-4 mr-2" />
                            Verify Audit Chain
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClone(role)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(role.id)}
                            disabled={isSystemRole(role.key)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        permissions={permissions}
        onSuccess={(newRole) => {
          setRoles([...roles, newRole])
          setCreateOpen(false)
        }}
      />

      {editRole && (
        <EditRoleDialog
          open={!!editRole}
          onOpenChange={(open) => !open && setEditRole(null)}
          role={editRole}
          onSuccess={(updatedRole) => {
            setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
            setEditRole(null)
          }}
        />
      )}

      {permissionsRole && (
        <PermissionsDialog
          open={!!permissionsRole}
          onOpenChange={(open) => !open && setPermissionsRole(null)}
          role={permissionsRole}
          permissions={permissions}
          onSuccess={() => {
            setPermissionsRole(null)
          }}
        />
      )}
    </div>
  )
}
