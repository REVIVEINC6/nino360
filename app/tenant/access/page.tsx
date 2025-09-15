"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Lock,
  Key,
  Users,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  UserCheck,
  Settings,
  Crown,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  isSystem: boolean
}

interface AccessRule {
  id: string
  name: string
  description: string
  type: "allow" | "deny"
  resource: string
  conditions: string[]
  enabled: boolean
  priority: number
}

export default function AccessControl() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("roles")
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [accessRules, setAccessRules] = useState<AccessRule[]>([])
  const [showAddRole, setShowAddRole] = useState(false)
  const [showAddRule, setShowAddRule] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    loadAccessData()
  }, [])

  const loadAccessData = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRoles([
      {
        id: "1",
        name: "Super Admin",
        description: "Full system access with all permissions",
        permissions: ["*"],
        userCount: 2,
        isSystem: true,
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        name: "Tenant Admin",
        description: "Full access within tenant scope",
        permissions: ["tenant.*", "user.manage", "billing.view"],
        userCount: 5,
        isSystem: true,
        createdAt: "2024-01-01",
      },
      {
        id: "3",
        name: "Manager",
        description: "Management access to assigned modules",
        permissions: ["user.view", "report.view", "data.read"],
        userCount: 12,
        isSystem: false,
        createdAt: "2024-01-15",
      },
      {
        id: "4",
        name: "End User",
        description: "Basic user access to assigned features",
        permissions: ["profile.edit", "data.read"],
        userCount: 156,
        isSystem: true,
        createdAt: "2024-01-01",
      },
      {
        id: "5",
        name: "Viewer",
        description: "Read-only access to reports and data",
        permissions: ["data.read", "report.view"],
        userCount: 23,
        isSystem: false,
        createdAt: "2024-02-01",
      },
    ])

    setPermissions([
      { id: "1", name: "tenant.*", description: "All tenant operations", category: "Tenant", isSystem: true },
      { id: "2", name: "user.manage", description: "Manage users", category: "User Management", isSystem: true },
      { id: "3", name: "user.view", description: "View users", category: "User Management", isSystem: true },
      { id: "4", name: "billing.view", description: "View billing information", category: "Billing", isSystem: true },
      { id: "5", name: "billing.manage", description: "Manage billing", category: "Billing", isSystem: true },
      { id: "6", name: "report.view", description: "View reports", category: "Reports", isSystem: true },
      { id: "7", name: "report.create", description: "Create reports", category: "Reports", isSystem: true },
      { id: "8", name: "data.read", description: "Read data", category: "Data", isSystem: true },
      { id: "9", name: "data.write", description: "Write data", category: "Data", isSystem: true },
      { id: "10", name: "profile.edit", description: "Edit own profile", category: "Profile", isSystem: true },
    ])

    setAccessRules([
      {
        id: "1",
        name: "Admin IP Restriction",
        description: "Restrict admin access to office IPs only",
        type: "allow",
        resource: "admin.*",
        conditions: ["ip_range:192.168.1.0/24", "role:admin"],
        enabled: true,
        priority: 1,
      },
      {
        id: "2",
        name: "Block Suspicious IPs",
        description: "Block access from known malicious IP ranges",
        type: "deny",
        resource: "*",
        conditions: ["ip_range:203.0.113.0/24"],
        enabled: true,
        priority: 2,
      },
      {
        id: "3",
        name: "Time-based Access",
        description: "Restrict access to business hours",
        type: "allow",
        resource: "data.*",
        conditions: ["time:09:00-17:00", "weekday:mon-fri"],
        enabled: false,
        priority: 3,
      },
    ])

    setLoading(false)
  }

  const handleRoleToggle = (roleId: string, enabled: boolean) => {
    // Handle role enable/disable
    toast({
      title: enabled ? "Role Enabled" : "Role Disabled",
      description: `Role has been ${enabled ? "enabled" : "disabled"} successfully.`,
    })
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId))
    toast({
      title: "Role Deleted",
      description: "Role has been deleted successfully.",
    })
  }

  const handleRuleToggle = (ruleId: string) => {
    setAccessRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
    toast({
      title: "Access Rule Updated",
      description: "Access rule has been updated successfully.",
    })
  }

  const getRoleIcon = (roleName: string) => {
    if (roleName.includes("Super Admin")) return <Crown className="h-4 w-4 text-purple-500" />
    if (roleName.includes("Admin")) return <Shield className="h-4 w-4 text-blue-500" />
    if (roleName.includes("Manager")) return <UserCheck className="h-4 w-4 text-green-500" />
    return <User className="h-4 w-4 text-gray-500" />
  }

  const getRoleBadgeColor = (isSystem: boolean) => {
    return isSystem ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-green-100 text-green-800 border-green-200"
  }

  const getPermissionCategoryColor = (category: string) => {
    const colors = {
      Tenant: "bg-purple-100 text-purple-800",
      "User Management": "bg-blue-100 text-blue-800",
      Billing: "bg-green-100 text-green-800",
      Reports: "bg-yellow-100 text-yellow-800",
      Data: "bg-red-100 text-red-800",
      Profile: "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-600 mt-1">Manage roles, permissions, and access rules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddRule(true)} className="bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
          <Button onClick={() => setShowAddRole(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Access Control Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="rules">Access Rules</TabsTrigger>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Management
              </CardTitle>
              <CardDescription>Create and manage user roles with specific permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {getRoleIcon(role.name)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{role.name}</h3>
                          <Badge variant="outline" className={getRoleBadgeColor(role.isSystem)}>
                            {role.isSystem ? "System" : "Custom"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{role.userCount} users</span>
                          <span>{role.permissions.length} permissions</span>
                          <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                        className="bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Users
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Role
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permission Management
              </CardTitle>
              <CardDescription>View and manage system permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-mono text-sm">{permission.name}</TableCell>
                      <TableCell>{permission.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPermissionCategoryColor(permission.category)}>
                          {permission.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(permission.isSystem)}>
                          {permission.isSystem ? "System" : "Custom"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!permission.isSystem && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Permission
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Permission
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Access Rules
              </CardTitle>
              <CardDescription>Configure conditional access rules and restrictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Switch checked={rule.enabled} onCheckedChange={() => handleRuleToggle(rule.id)} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              rule.type === "allow"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {rule.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Resource: {rule.resource}</span>
                          <span>Priority: {rule.priority}</span>
                          <span>Conditions: {rule.conditions.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Permission Matrix
              </CardTitle>
              <CardDescription>Visual overview of role-permission assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Permission</th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center p-2 border-b min-w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            {getRoleIcon(role.name)}
                            <span className="text-xs">{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">
                          <div>
                            <span className="font-mono text-sm">{permission.name}</span>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={`${role.id}-${permission.id}`} className="text-center p-2 border-b">
                            <Checkbox
                              checked={
                                role.permissions.includes("*") ||
                                role.permissions.includes(permission.name) ||
                                role.permissions.some((p) => permission.name.startsWith(p.replace("*", "")))
                              }
                              disabled={role.permissions.includes("*")}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specific permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input id="roleName" placeholder="Enter role name" />
            </div>
            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Input id="roleDescription" placeholder="Enter role description" />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox id={`perm-${permission.id}`} />
                    <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Create Role</Button>
              <Button variant="outline" onClick={() => setShowAddRole(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Access Rule Dialog */}
      <Dialog open={showAddRule} onOpenChange={setShowAddRule}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Access Rule</DialogTitle>
            <DialogDescription>Create a new conditional access rule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input id="ruleName" placeholder="Enter rule name" />
            </div>
            <div>
              <Label htmlFor="ruleDescription">Description</Label>
              <Input id="ruleDescription" placeholder="Enter rule description" />
            </div>
            <div>
              <Label htmlFor="ruleType">Rule Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ruleResource">Resource Pattern</Label>
              <Input id="ruleResource" placeholder="e.g., admin.*, data.read" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ruleEnabled" />
              <Label htmlFor="ruleEnabled">Enable rule immediately</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Create Rule</Button>
              <Button variant="outline" onClick={() => setShowAddRule(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
