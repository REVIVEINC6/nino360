"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Users, Lock, Settings, Plus, Search, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export function TenantAccessContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Mock data
  const roles = [
    { id: "1", name: "Admin", description: "Full system access", users: 5, permissions: 45 },
    { id: "2", name: "Manager", description: "Department management", users: 12, permissions: 32 },
    { id: "3", name: "Employee", description: "Standard access", users: 156, permissions: 18 },
    { id: "4", name: "Contractor", description: "Limited access", users: 23, permissions: 12 },
  ]

  const permissions = [
    { id: "1", module: "CRM", name: "View Contacts", enabled: true },
    { id: "2", module: "CRM", name: "Edit Contacts", enabled: true },
    { id: "3", module: "CRM", name: "Delete Contacts", enabled: false },
    { id: "4", module: "HRMS", name: "View Employees", enabled: true },
    { id: "5", module: "HRMS", name: "Edit Employees", enabled: false },
    { id: "6", module: "Finance", name: "View Invoices", enabled: true },
    { id: "7", module: "Finance", name: "Approve Payments", enabled: false },
  ]

  const policies = [
    { id: "1", name: "IP Whitelist", type: "Network", status: "active", rules: 5 },
    { id: "2", name: "Time-based Access", type: "Temporal", status: "active", rules: 3 },
    { id: "3", name: "Data Masking", type: "Privacy", status: "active", rules: 8 },
    { id: "4", name: "MFA Required", type: "Security", status: "active", rules: 2 },
  ]

  return (
    <Tabs defaultValue="roles" className="space-y-6">
      <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
        <TabsTrigger
          value="roles"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
        >
          <Shield className="h-4 w-4 mr-2" />
          Roles
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
        >
          <Lock className="h-4 w-4 mr-2" />
          Permissions
        </TabsTrigger>
        <TabsTrigger
          value="policies"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Policies
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
        >
          <Users className="h-4 w-4 mr-2" />
          User Access
        </TabsTrigger>
      </TabsList>

      <TabsContent value="roles" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Define a new role with specific permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Role Name</Label>
                  <Input placeholder="e.g., Project Manager" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input placeholder="Brief description of the role" />
                </div>
                <Button className="w-full bg-linear-to-r from-blue-500 to-purple-500">Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="p-6 bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <Badge variant="secondary" className="bg-linear-to-r from-blue-500/10 to-purple-500/10">
                      {role.users} users
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{role.permissions} permissions</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-4">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="space-y-6">
            {["CRM", "HRMS", "Finance", "Projects"].map((module) => (
              <div key={module}>
                <h3 className="text-lg font-semibold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {module} Module
                </h3>
                <div className="space-y-3">
                  {permissions
                    .filter((p) => p.module === module)
                    .map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg bg-white/30">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={permission.enabled} />
                          <Label className="cursor-pointer">{permission.name}</Label>
                        </div>
                        <Badge variant={permission.enabled ? "default" : "secondary"}>
                          {permission.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="policies" className="space-y-4">
        <div className="flex justify-end">
          <Button className="bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>

        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy.id} className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{policy.name}</h3>
                    <Badge className="bg-linear-to-r from-green-500/10 to-emerald-500/10 text-green-700">
                      {policy.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Type: {policy.type}</span>
                    <span>•</span>
                    <span>{policy.rules} rules</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={policy.status === "active"} />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <p className="text-muted-foreground">User access management interface coming soon...</p>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
