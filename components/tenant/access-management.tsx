"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, Key, Settings, Plus, Search, Edit, Trash2, Copy } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function AccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Tabs defaultValue="roles" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="roles">
          <Users className="mr-2 h-4 w-4" />
          Roles
        </TabsTrigger>
        <TabsTrigger value="rbac">
          <Shield className="mr-2 h-4 w-4" />
          RBAC Matrix
        </TabsTrigger>
        <TabsTrigger value="fbac">
          <Key className="mr-2 h-4 w-4" />
          FBAC Flags
        </TabsTrigger>
        <TabsTrigger value="simulator">
          <Settings className="mr-2 h-4 w-4" />
          Simulator
        </TabsTrigger>
      </TabsList>

      <TabsContent value="roles" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Role Management</h3>
              <p className="text-sm text-muted-foreground">Create and manage custom roles for your organization</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Admin</TableCell>
                <TableCell>Full system access</TableCell>
                <TableCell>5</TableCell>
                <TableCell>
                  <Badge variant="secondary">All</Badge>
                </TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Manager</TableCell>
                <TableCell>Team management and reporting</TableCell>
                <TableCell>12</TableCell>
                <TableCell>
                  <Badge variant="secondary">15</Badge>
                </TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Employee</TableCell>
                <TableCell>Standard employee access</TableCell>
                <TableCell>48</TableCell>
                <TableCell>
                  <Badge variant="secondary">8</Badge>
                </TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="rbac" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">RBAC Permission Matrix</h3>
            <p className="text-sm text-muted-foreground">
              Configure role-based access control permissions across modules
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Module</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Manager</TableHead>
                  <TableHead className="text-center">Employee</TableHead>
                  <TableHead className="text-center">Contractor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["CRM", "Talent/ATS", "HRMS", "Finance", "Projects", "VMS", "Bench", "Training"].map((module) => (
                  <TableRow key={module}>
                    <TableCell className="font-medium">{module}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">Write</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">Read</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">Read</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="fbac" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Feature-Based Access Control</h3>
            <p className="text-sm text-muted-foreground">Control access to specific features and capabilities</p>
          </div>

          <div className="space-y-4">
            {[
              { name: "AI Copilot", description: "Access to AI-powered assistance" },
              { name: "Advanced Analytics", description: "Access to advanced reporting and analytics" },
              { name: "API Access", description: "Programmatic API access" },
              { name: "Bulk Operations", description: "Perform bulk data operations" },
              { name: "Data Export", description: "Export data to external formats" },
              { name: "Integration Management", description: "Configure external integrations" },
            ].map((feature) => (
              <div key={feature.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Switch />
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="simulator" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Access Simulator</h3>
            <p className="text-sm text-muted-foreground">Test and simulate user access permissions</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Select User</Label>
              <Input placeholder="Search for a user..." />
            </div>

            <div>
              <Label>Select Module</Label>
              <Input placeholder="Select module to test..." />
            </div>

            <Button className="w-full">Run Simulation</Button>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Select a user and module to simulate access permissions</p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
