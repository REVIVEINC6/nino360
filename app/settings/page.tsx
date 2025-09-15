"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Key,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  UserCog,
  Layers,
  HardDrive,
} from "lucide-react"
import Link from "next/link"

export default function SettingsOverviewPage() {
  const settingsCategories = [
    {
      id: "general",
      title: "General Settings",
      description: "Company information, localization, and system configuration",
      icon: Settings,
      href: "/settings/general",
      status: "configured",
      completionRate: 85,
    },
    {
      id: "preferences",
      title: "User Preferences",
      description: "Customize your personal platform experience and interface",
      icon: UserCog,
      href: "/settings/preferences",
      status: "configured",
      completionRate: 92,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure notification preferences and delivery methods",
      icon: Bell,
      href: "/settings/notifications",
      status: "pending",
      completionRate: 45,
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Manage security policies, authentication, and access controls",
      icon: Shield,
      href: "/settings/security",
      status: "configured",
      completionRate: 78,
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connect and manage third-party services and applications",
      icon: Layers,
      href: "/settings/integrations",
      status: "pending",
      completionRate: 30,
    },
    {
      id: "api",
      title: "API Management",
      description: "Manage API keys, rate limits, and developer access",
      icon: Key,
      href: "/settings/api",
      status: "configured",
      completionRate: 67,
    },
    {
      id: "backup",
      title: "Backup & Recovery",
      description: "Configure data backup schedules and recovery options",
      icon: HardDrive,
      href: "/settings/backup",
      status: "warning",
      completionRate: 55,
    },
    {
      id: "logs",
      title: "System Logs",
      description: "View and analyze system activities and audit trails",
      icon: FileText,
      href: "/settings/logs",
      status: "configured",
      completionRate: 100,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "configured":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "configured":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const overallCompletion = Math.round(
    settingsCategories.reduce((acc, cat) => acc + cat.completionRate, 0) / settingsCategories.length,
  )

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Configuration</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCompletion}%</div>
            <Progress value={overallCompletion} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Platform configuration completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configured Sections</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settingsCategories.filter((cat) => cat.status === "configured").length}
            </div>
            <p className="text-xs text-muted-foreground">of {settingsCategories.length} sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settingsCategories.filter((cat) => cat.status === "pending" || cat.status === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground">sections need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="mt-1">{category.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(category.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(category.status)}
                      <span className="capitalize">{category.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Configuration Progress</span>
                    <span className="font-medium">{category.completionRate}%</span>
                  </div>
                  <Progress value={category.completionRate} className="h-2" />
                  <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={category.href}>Configure</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common settings tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/settings/general" className="flex flex-col items-center gap-2">
                <Settings className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">System Configuration</div>
                  <div className="text-sm text-muted-foreground">Update company settings</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/settings/security" className="flex flex-col items-center gap-2">
                <Shield className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Security Review</div>
                  <div className="text-sm text-muted-foreground">Check security policies</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/settings/backup" className="flex flex-col items-center gap-2">
                <Database className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Backup Status</div>
                  <div className="text-sm text-muted-foreground">Review backup settings</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
