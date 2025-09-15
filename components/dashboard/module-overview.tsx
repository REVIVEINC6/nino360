"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface ModuleStats {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance" | "error"
  usage: number
  performance: number
  users: number
  lastUpdated: string
  version: string
  healthScore: number
}

interface ModuleOverviewProps {
  modules?: ModuleStats[]
  onModuleClick: (moduleId: string) => void
}

export function ModuleOverview({ modules = [], onModuleClick }: ModuleOverviewProps) {
  const getModuleIcon = (moduleId: string) => {
    switch (moduleId.toLowerCase()) {
      case "crm":
        return <TrendingUp className="h-8 w-8" />
      case "hrms":
        return <Users className="h-8 w-8" />
      case "talent":
        return <Users className="h-8 w-8" />
      case "finance":
        return <DollarSign className="h-8 w-8" />
      case "admin":
        return <Settings className="h-8 w-8" />
      case "analytics":
        return <BarChart3 className="h-8 w-8" />
      case "vms":
        return <Building2 className="h-8 w-8" />
      default:
        return <FileText className="h-8 w-8" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100"
      case "maintenance":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      case "inactive":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  // Default modules if none provided
  const defaultModules: ModuleStats[] = [
    {
      id: "crm",
      name: "CRM",
      status: "active",
      usage: 85,
      performance: 96,
      users: 1247,
      lastUpdated: "2 hours ago",
      version: "2.1.0",
      healthScore: 96,
    },
    {
      id: "hrms",
      name: "HRMS",
      status: "active",
      usage: 78,
      performance: 94,
      users: 892,
      lastUpdated: "1 hour ago",
      version: "2.0.5",
      healthScore: 94,
    },
    {
      id: "talent",
      name: "Talent",
      status: "active",
      usage: 72,
      performance: 91,
      users: 634,
      lastUpdated: "30 minutes ago",
      version: "1.9.2",
      healthScore: 91,
    },
    {
      id: "finance",
      name: "Finance",
      status: "active",
      usage: 65,
      performance: 89,
      users: 423,
      lastUpdated: "45 minutes ago",
      version: "1.8.1",
      healthScore: 89,
    },
    {
      id: "vms",
      name: "VMS",
      status: "active",
      usage: 58,
      performance: 87,
      users: 312,
      lastUpdated: "1 hour ago",
      version: "1.7.3",
      healthScore: 87,
    },
    {
      id: "analytics",
      name: "Analytics",
      status: "maintenance",
      usage: 45,
      performance: 72,
      users: 156,
      lastUpdated: "3 hours ago",
      version: "1.6.0",
      healthScore: 72,
    },
  ]

  const displayModules = modules.length > 0 ? modules : defaultModules

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Overview</CardTitle>
        <CardDescription>Status and performance of all platform modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => onModuleClick(module.id)}
            >
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${getStatusColor(module.status)}`}>
                        {getModuleIcon(module.id)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {getStatusIcon(module.status)}v{module.version}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        module.status === "active"
                          ? "default"
                          : module.status === "maintenance"
                            ? "secondary"
                            : module.status === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {module.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{module.users.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{module.usage}%</div>
                      <div className="text-xs text-muted-foreground">Usage Rate</div>
                    </div>
                  </div>

                  {/* Health Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Score</span>
                      <span className={`font-medium ${getHealthScoreColor(module.healthScore)}`}>
                        {module.healthScore}%
                      </span>
                    </div>
                    <Progress value={module.healthScore} className="h-2" />
                  </div>

                  {/* Performance Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span className={`font-medium ${getHealthScoreColor(module.performance)}`}>
                        {module.performance}%
                      </span>
                    </div>
                    <Progress value={module.performance} className="h-2" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Updated: {module.lastUpdated}</span>
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`/${module.id}/dashboard`, "_blank")
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`/${module.id}/settings`, "_blank")
                      }}
                    >
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {displayModules.filter((m) => m.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {displayModules.reduce((sum, m) => sum + m.users, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(displayModules.reduce((sum, m) => sum + m.healthScore, 0) / displayModules.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Health Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {displayModules.filter((m) => m.status === "maintenance" || m.status === "error").length}
            </div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
