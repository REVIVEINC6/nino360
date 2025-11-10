"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const roles = [
  {
    name: "Admin",
    description: "Full access to all features and settings",
    userCount: 3,
    color: "bg-red-500/10 text-red-600",
  },
  {
    name: "Recruiter",
    description: "Manage candidates, jobs, and interviews",
    userCount: 12,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Account Manager",
    description: "Manage clients and projects",
    userCount: 8,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    name: "Finance",
    description: "Access to financial data and invoicing",
    userCount: 4,
    color: "bg-green-500/10 text-green-600",
  },
  {
    name: "Employee",
    description: "Basic access to view assigned tasks",
    userCount: 25,
    color: "bg-gray-500/10 text-gray-600",
  },
]

const permissions = [
  { module: "CRM", view: true, create: true, edit: true, delete: false },
  { module: "Talent", view: true, create: true, edit: true, delete: true },
  { module: "Bench", view: true, create: true, edit: true, delete: false },
  { module: "VMS", view: true, create: false, edit: false, delete: false },
  { module: "Finance", view: true, create: true, edit: true, delete: false },
  { module: "Projects", view: true, create: true, edit: true, delete: false },
  { module: "Reports", view: true, create: false, edit: false, delete: false },
  { module: "Admin", view: false, create: false, edit: false, delete: false },
]

export function RolesPermissions() {
  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <Badge variant="secondary" className={role.color}>
                  {role.userCount} users
                </Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>Configure permissions for the Recruiter role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.module} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="font-medium">{permission.module}</div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch id={`${permission.module}-view`} checked={permission.view} />
                    <Label htmlFor={`${permission.module}-view`} className="text-sm text-muted-foreground">
                      View
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id={`${permission.module}-create`} checked={permission.create} />
                    <Label htmlFor={`${permission.module}-create`} className="text-sm text-muted-foreground">
                      Create
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id={`${permission.module}-edit`} checked={permission.edit} />
                    <Label htmlFor={`${permission.module}-edit`} className="text-sm text-muted-foreground">
                      Edit
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id={`${permission.module}-delete`} checked={permission.delete} />
                    <Label htmlFor={`${permission.module}-delete`} className="text-sm text-muted-foreground">
                      Delete
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
