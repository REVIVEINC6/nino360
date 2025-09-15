"use client"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  BarChart3,
  Building2,
  UserPlus,
  Users,
  Settings,
  Shield,
  Key,
  CreditCard,
  Database,
  Zap,
  FileText,
  GitBranch,
  Bot,
  Coins,
  Factory,
  Globe,
  UserCheck,
  Workflow,
  MessageSquare,
  Plus,
  Activity,
} from "lucide-react"

const tenantFeatures = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3 },
  { id: "directory", title: "Tenant Directory", icon: Globe },
  { id: "onboarding", title: "Tenant Onboarding", icon: UserCheck },
  { id: "users", title: "User Management", icon: Users },
  { id: "analytics", title: "Tenant Analytics", icon: BarChart3 },
  { id: "configuration", title: "Configuration", icon: Settings },
  { id: "security", title: "Security Management", icon: Shield },
  { id: "access", title: "Access Control", icon: Key },
  { id: "billing", title: "Billing & Subscription", icon: CreditCard },
  { id: "data", title: "Data Management", icon: Database },
  { id: "integrations", title: "Integrations", icon: Workflow },
  { id: "notifications", title: "Notifications", icon: MessageSquare },
  { id: "audit", title: "Audit Logs", icon: FileText },
  { id: "workflows", title: "Workflows", icon: GitBranch },
  { id: "ai", title: "AI Technologies", icon: Bot },
  { id: "blockchain", title: "Blockchain", icon: Coins },
  { id: "rpa", title: "RPA", icon: Factory },
]

const tenants = [
  {
    id: 1,
    name: "TechCorp Solutions",
    domain: "techcorp.esgos.com",
    plan: "Enterprise",
    users: 247,
    status: "Active",
    created: "2023-01-15",
    lastActive: "2 hours ago",
    modules: ["CRM", "Talent", "HRMS", "Finance"],
    utilization: 85,
  },
  {
    id: 2,
    name: "InnovateLabs Inc",
    domain: "innovate.esgos.com",
    plan: "Professional",
    users: 89,
    status: "Active",
    created: "2023-03-20",
    lastActive: "1 day ago",
    modules: ["CRM", "Talent", "Bench"],
    utilization: 72,
  },
  {
    id: 3,
    name: "GlobalStaff Partners",
    domain: "globalstaff.esgos.com",
    plan: "Enterprise",
    users: 156,
    status: "Trial",
    created: "2024-01-10",
    lastActive: "30 minutes ago",
    modules: ["CRM", "Talent", "VMS", "HRMS"],
    utilization: 68,
  },
]

export function TenantModule() {
  const [activeFeature, setActiveFeature] = useState("dashboard")

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Administration</h1>
          <p className="text-muted-foreground">Comprehensive tenant management and configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Activity className="mr-2 h-4 w-4" />
            Health Check
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Tenant Features Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management Features</CardTitle>
          <CardDescription>Access all tenant administration functionalities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
            {tenantFeatures.map((feature) => (
              <Button
                key={feature.id}
                variant={activeFeature === feature.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFeature(feature.id)}
                className="justify-start"
              >
                <feature.icon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{feature.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeFeature} onValueChange={setActiveFeature}>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+3 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Uptime this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tenant Directory */}
        <TabsContent value="directory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Directory</CardTitle>
              <CardDescription>Overview of all tenant organizations and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{tenant.name}</h3>
                        <Badge
                          variant={
                            tenant.plan === "Enterprise"
                              ? "default"
                              : tenant.plan === "Professional"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {tenant.plan}
                        </Badge>
                        <Badge variant={tenant.status === "Active" ? "default" : "secondary"}>{tenant.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                      <div className="flex flex-wrap gap-1">
                        {tenant.modules.map((module) => (
                          <Badge key={module} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-4">
                        <span>Users: {tenant.users}</span>
                        <span>Created: {tenant.created}</span>
                        <span>Last Active: {tenant.lastActive}</span>
                        <span>Utilization: {tenant.utilization}%</span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={tenant.utilization} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tenant Onboarding */}
        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Onboarding</CardTitle>
              <CardDescription>Manage tenant onboarding processes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Tenant onboarding interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage tenant users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tenant Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Usage Across Tenants</CardTitle>
              <CardDescription>Most popular modules and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>CRM Module</span>
                    <span>42 tenants (89%)</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Talent Acquisition</span>
                    <span>38 tenants (81%)</span>
                  </div>
                  <Progress value={81} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>HRMS</span>
                    <span>35 tenants (74%)</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Finance</span>
                    <span>28 tenants (60%)</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>VMS</span>
                    <span>22 tenants (47%)</span>
                  </div>
                  <Progress value={47} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tenant Activities</CardTitle>
              <CardDescription>Latest tenant onboarding and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New tenant onboarded</p>
                    <p className="text-xs text-muted-foreground">GlobalStaff Partners started trial • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Configuration updated</p>
                    <p className="text-xs text-muted-foreground">TechCorp enabled VMS module • 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Subscription upgraded</p>
                    <p className="text-xs text-muted-foreground">InnovateLabs upgraded to Enterprise • 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Security audit completed</p>
                    <p className="text-xs text-muted-foreground">
                      DataFlow Systems passed compliance check • 2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure tenant settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configuration interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Management */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Management</CardTitle>
              <CardDescription>Configure security settings and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage access permissions and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access control interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Subscription */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage tenant billing and subscription plans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Billing & subscription interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage tenant data and storage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Data management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Manage tenant integrations and workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Integrations interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure tenant notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notifications interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>View tenant activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Audit logs interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows */}
        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>Manage tenant workflows and processes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Workflows interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Technologies */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Technologies</CardTitle>
              <CardDescription>Explore AI functionalities for tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">AI technologies interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain</CardTitle>
              <CardDescription>Manage tenant blockchain integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Blockchain interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RPA */}
        <TabsContent value="rpa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RPA</CardTitle>
              <CardDescription>Configure tenant RPA processes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">RPA interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
