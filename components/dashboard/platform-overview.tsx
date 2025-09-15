"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertTriangle,
  Activity,
  Shield,
  Users,
  Zap,
  Settings,
  BarChart3,
  CreditCard,
  GraduationCap,
  Briefcase,
  UserCheck,
  Package,
  Brain,
  TrendingUp,
  Eye,
  Server,
} from "lucide-react"

interface SystemHealth {
  component: string
  status: "healthy" | "warning" | "critical"
  uptime: number
  lastCheck: string
  details: string
}

interface ModuleStatus {
  id: string
  name: string
  icon: any
  status: "active" | "inactive" | "maintenance"
  version: string
  lastUpdate: string
  usage: number
  description: string
}

interface PlatformFeature {
  category: string
  features: Array<{
    name: string
    status: "available" | "beta" | "coming_soon"
    description: string
  }>
}

export function PlatformOverview() {
  const [activeTab, setActiveTab] = useState("overview")

  // System health data
  const systemHealth: SystemHealth[] = [
    {
      component: "Database",
      status: "healthy",
      uptime: 99.97,
      lastCheck: "2 minutes ago",
      details: "All database connections stable, query performance optimal",
    },
    {
      component: "Authentication",
      status: "healthy",
      uptime: 99.99,
      lastCheck: "1 minute ago",
      details: "User authentication and session management working perfectly",
    },
    {
      component: "Security",
      status: "healthy",
      uptime: 100,
      lastCheck: "30 seconds ago",
      details: "RLS policies active, no security vulnerabilities detected",
    },
    {
      component: "Performance",
      status: "healthy",
      uptime: 99.95,
      lastCheck: "1 minute ago",
      details: "Average response time: 127ms, all services responding normally",
    },
    {
      component: "Storage",
      status: "warning",
      uptime: 99.8,
      lastCheck: "5 minutes ago",
      details: "Storage usage at 85%, consider scaling up soon",
    },
    {
      component: "Network",
      status: "healthy",
      uptime: 99.92,
      lastCheck: "2 minutes ago",
      details: "Network connectivity stable, CDN performance optimal",
    },
  ]

  // Module status data
  const moduleStatus: ModuleStatus[] = [
    {
      id: "crm",
      name: "CRM Module",
      icon: Users,
      status: "active",
      version: "2.1.0",
      lastUpdate: "2024-01-10",
      usage: 95,
      description: "Customer relationship management with leads, opportunities, and activities",
    },
    {
      id: "talent",
      name: "Talent Management",
      icon: Briefcase,
      status: "active",
      version: "1.8.2",
      lastUpdate: "2024-01-08",
      usage: 78,
      description: "Recruitment pipeline, candidate tracking, and job position management",
    },
    {
      id: "hrms",
      name: "HRMS Module",
      icon: UserCheck,
      status: "active",
      version: "2.0.1",
      lastUpdate: "2024-01-12",
      usage: 87,
      description: "Employee management, attendance tracking, and performance reviews",
    },
    {
      id: "finance",
      name: "Finance Module",
      icon: CreditCard,
      status: "active",
      version: "1.9.5",
      lastUpdate: "2024-01-09",
      usage: 82,
      description: "Invoicing, payments, expenses, and financial reporting",
    },
    {
      id: "training",
      name: "Training Module",
      icon: GraduationCap,
      status: "active",
      version: "1.5.3",
      lastUpdate: "2024-01-07",
      usage: 64,
      description: "Training courses, sessions, and employee skill development",
    },
    {
      id: "analytics",
      name: "Analytics Dashboard",
      icon: BarChart3,
      status: "active",
      version: "2.2.0",
      lastUpdate: "2024-01-11",
      usage: 91,
      description: "Business intelligence, reporting, and data visualization",
    },
    {
      id: "admin",
      name: "Admin Console",
      icon: Settings,
      status: "active",
      version: "1.7.8",
      lastUpdate: "2024-01-13",
      usage: 73,
      description: "Platform administration, user management, and system configuration",
    },
    {
      id: "ai",
      name: "AI Assistant",
      icon: Brain,
      status: "active",
      version: "1.3.1",
      lastUpdate: "2024-01-14",
      usage: 56,
      description: "AI-powered insights, automation, and intelligent recommendations",
    },
  ]

  // Platform features
  const platformFeatures: PlatformFeature[] = [
    {
      category: "Core Business Modules",
      features: [
        {
          name: "Customer Relationship Management (CRM)",
          status: "available",
          description: "Complete CRM with leads, opportunities, contacts, and pipeline management",
        },
        {
          name: "Human Resource Management System (HRMS)",
          status: "available",
          description: "Employee lifecycle management, attendance, and performance tracking",
        },
        {
          name: "Talent Management & Recruitment",
          status: "available",
          description: "End-to-end recruitment process with candidate pipeline and job management",
        },
        {
          name: "Financial Management",
          status: "available",
          description: "Invoicing, payments, expense tracking, and financial reporting",
        },
        {
          name: "Training & Development",
          status: "available",
          description: "Employee training programs, course management, and skill development",
        },
      ],
    },
    {
      category: "Platform Features",
      features: [
        {
          name: "Multi-tenant Architecture",
          status: "available",
          description: "Complete tenant isolation with role-based access control",
        },
        {
          name: "Advanced Analytics & Reporting",
          status: "available",
          description: "Business intelligence dashboards with real-time insights",
        },
        {
          name: "AI-Powered Insights",
          status: "available",
          description: "Machine learning recommendations and automated decision support",
        },
        {
          name: "Document Management",
          status: "available",
          description: "Centralized document storage with version control and sharing",
        },
        {
          name: "Task & Project Management",
          status: "available",
          description: "Collaborative task management with project tracking",
        },
      ],
    },
    {
      category: "Security & Compliance",
      features: [
        {
          name: "Row-Level Security (RLS)",
          status: "available",
          description: "Database-level security ensuring complete tenant data isolation",
        },
        {
          name: "Role-Based Access Control (RBAC)",
          status: "available",
          description: "Granular permissions system with hierarchical role management",
        },
        {
          name: "Audit Logging",
          status: "available",
          description: "Comprehensive audit trails for all user actions and system events",
        },
        {
          name: "Data Encryption",
          status: "available",
          description: "End-to-end encryption for data at rest and in transit",
        },
        {
          name: "GDPR Compliance",
          status: "available",
          description: "Built-in privacy controls and data protection mechanisms",
        },
      ],
    },
    {
      category: "Integration & API",
      features: [
        {
          name: "REST API",
          status: "available",
          description: "Comprehensive REST API for all platform functionality",
        },
        {
          name: "Webhook Support",
          status: "available",
          description: "Real-time event notifications via webhooks",
        },
        {
          name: "Third-party Integrations",
          status: "beta",
          description: "Pre-built connectors for popular business applications",
        },
        {
          name: "Custom Integrations",
          status: "available",
          description: "Flexible integration framework for custom connections",
        },
        {
          name: "Data Import/Export",
          status: "available",
          description: "Bulk data operations with CSV, Excel, and API support",
        },
      ],
    },
    {
      category: "Advanced Features",
      features: [
        {
          name: "Workflow Automation",
          status: "beta",
          description: "Visual workflow builder with conditional logic and triggers",
        },
        {
          name: "Mobile Applications",
          status: "coming_soon",
          description: "Native mobile apps for iOS and Android platforms",
        },
        {
          name: "Advanced AI Features",
          status: "beta",
          description: "Predictive analytics, natural language processing, and ML models",
        },
        {
          name: "White-label Solutions",
          status: "coming_soon",
          description: "Complete branding customization for enterprise clients",
        },
        {
          name: "Multi-language Support",
          status: "coming_soon",
          description: "Internationalization with support for multiple languages",
        },
      ],
    },
  ]

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-100 text-emerald-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "critical":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700"
      case "inactive":
        return "bg-gray-100 text-gray-700"
      case "maintenance":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getFeatureStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700"
      case "beta":
        return "bg-blue-100 text-blue-700"
      case "coming_soon":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const healthyCount = systemHealth.filter((h) => h.status === "healthy").length
  const warningCount = systemHealth.filter((h) => h.status === "warning").length
  const criticalCount = systemHealth.filter((h) => h.status === "critical").length
  const overallHealth = (healthyCount / systemHealth.length) * 100

  const activeModules = moduleStatus.filter((m) => m.status === "active").length
  const totalModules = moduleStatus.length

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">System Health</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{overallHealth.toFixed(0)}%</p>
                  <p className="text-sm text-emerald-600 mt-1">{healthyCount} components healthy</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl">
                  <Activity className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Modules</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {activeModules}/{totalModules}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">All systems operational</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Security Score</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">100%</p>
                  <p className="text-sm text-purple-600 mt-1">All tests passed</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Platform Uptime</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">99.97%</p>
                  <p className="text-sm text-orange-600 mt-1">Last 30 days</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Health Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.map((component, index) => (
              <motion.div
                key={component.component}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getHealthStatusIcon(component.status)}
                    <h4 className="font-medium text-slate-900">{component.component}</h4>
                  </div>
                  <Badge className={getHealthStatusColor(component.status)}>{component.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">{component.uptime}%</span>
                  </div>
                  <Progress value={component.uptime} className="h-2" />
                  <p className="text-xs text-slate-500">{component.details}</p>
                  <p className="text-xs text-slate-400">Last check: {component.lastCheck}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Eye className="h-5 w-5" />
              <span className="text-sm">View Sample Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Security Tests</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="h-5 w-5" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Settings className="h-5 w-5" />
              <span className="text-sm">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderModules = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {moduleStatus.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <module.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{module.name}</CardTitle>
                      <p className="text-xs text-slate-500">v{module.version}</p>
                    </div>
                  </div>
                  <Badge className={getModuleStatusColor(module.status)}>{module.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 mb-4">{module.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Usage</span>
                    <span className="font-medium">{module.usage}%</span>
                  </div>
                  <Progress value={module.usage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last Update</span>
                    <span>{module.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderFeatures = () => (
    <div className="space-y-6">
      {platformFeatures.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.features.map((feature, featureIndex) => (
                  <div
                    key={feature.name}
                    className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{feature.name}</h4>
                      <Badge className={getFeatureStatusColor(feature.status)} variant="outline">
                        {feature.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Platform Overview
          </h1>
          <p className="text-slate-600 mt-1">Comprehensive overview of Nino360 Platform capabilities and status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            Platform Ready
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Status</TabsTrigger>
          <TabsTrigger value="features">Feature Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {renderModules()}
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {renderFeatures()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
