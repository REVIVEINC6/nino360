"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Clock, AlertTriangle, BarChart3, FileText, Activity } from "lucide-react"
import { navigationData } from "@/lib/navigation-data"

interface PageStatus {
  path: string
  name: string
  exists: boolean
  hasContent: boolean
  hasAPI: boolean
  hasSchema: boolean
  completionScore: number
  issues: string[]
}

interface ModuleStatus {
  id: string
  name: string
  totalPages: number
  completedPages: number
  inProgressPages: number
  missingPages: number
  completionPercentage: number
  pages: PageStatus[]
  hasLayout: boolean
  hasAPI: boolean
}

export function ApplicationStatus() {
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([])
  const [overallStats, setOverallStats] = useState({
    totalModules: 0,
    totalPages: 0,
    completedPages: 0,
    inProgressPages: 0,
    missingPages: 0,
    overallCompletion: 0,
  })

  useEffect(() => {
    analyzeApplicationStatus()
  }, [])

  const analyzeApplicationStatus = () => {
    const statuses: ModuleStatus[] = []
    let totalPages = 0
    let completedPages = 0
    let inProgressPages = 0
    let missingPages = 0

    // Define existing pages based on the actual file structure
    const existingPages = new Set([
      // Dashboard
      "/dashboard",

      // Admin Module
      "/admin/dashboard",
      "/admin/users",
      "/admin/tenants",
      "/admin/roles",
      "/admin/roles/field-access",
      "/admin/modules",
      "/admin/marketplace",
      "/admin/billing",
      "/admin/system",

      // CRM Module
      "/crm/dashboard",
      "/crm/leads",
      "/crm/contacts",
      "/crm/companies",
      "/crm/pipeline",
      "/crm/analytics",
      "/crm/ai-assistant",
      "/crm/campaigns",
      "/crm/documents",
      "/crm/engagements",
      "/crm/reports",
      "/crm/settings",
      "/crm/calendar",

      // Talent Module
      "/talent/dashboard",
      "/talent/jobs",
      "/talent/candidates",
      "/talent/applicants",
      "/talent/interviews",
      "/talent/offers",
      "/talent/onboarding",
      "/talent/analytics",
      "/talent/ai",
      "/talent/assessments",
      "/talent/automation",
      "/talent/community",
      "/talent/engagement",
      "/talent/integrations",
      "/talent/marketplace",
      "/talent/recognition",
      "/talent/referrals",
      "/talent/skills",
      "/talent/sourcing",

      // HRMS Module
      "/hrms/dashboard",
      "/hrms/employees",
      "/hrms/attendance",
      "/hrms/payroll",
      "/hrms/performance",
      "/hrms/benefits",
      "/hrms/teams",
      "/hrms/training",
      "/hrms/analytics",
      "/hrms/ai-assistant",
      "/hrms/helpdesk",
      "/hrms/onboarding",
      "/hrms/offboarding",
      "/hrms/organization",
      "/hrms/reports",
      "/hrms/settings",

      // Finance Module
      "/finance",
      "/finance/payroll",
      "/finance/expenses",
      "/finance/revenue",

      // Bench Module
      "/bench",
      "/bench/pool",
      "/bench/allocation",
      "/bench/tracking",
      "/bench/skills",
      "/bench/utilization",
      "/bench/forecasting",
      "/bench/automation",

      // Hotlist Module
      "/hotlist",
      "/hotlist/priority",
      "/hotlist/requirements",

      // VMS Module
      "/vms",
      "/vms/jobs",
      "/vms/vendors",

      // Training Module
      "/training",

      // Tenant Module
      "/tenant",
      "/tenant/dashboard",
      "/tenant/directory",
      "/tenant/onboarding",
      "/tenant/users",
      "/tenant/analytics",
      "/tenant/configuration",
      "/tenant/security",
      "/tenant/access",
      "/tenant/billing",
      "/tenant/data",

      // Settings Module
      "/settings",
      "/settings/general",
      "/settings/preferences",

      // Profile
      "/profile",

      // Other pages
      "/login",
      "/platform-overview",
      "/sample-data",
      "/data-verification",
    ])

    // Pages with substantial content
    const pagesWithContent = new Set([
      "/dashboard",
      "/admin/dashboard",
      "/admin/billing",
      "/admin/marketplace",
      "/admin/modules",
      "/admin/roles",
      "/admin/tenants",
      "/admin/users",
      "/crm/dashboard",
      "/crm/leads",
      "/crm/contacts",
      "/crm/companies",
      "/crm/analytics",
      "/talent/dashboard",
      "/talent/applicants",
      "/talent/candidates",
      "/hrms/dashboard",
      "/hrms/employees",
      "/bench",
      "/hotlist",
      "/tenant",
      "/settings",
      "/profile",
      "/login",
    ])

    // Pages with API endpoints
    const pagesWithAPI = new Set([
      "/admin/roles",
      "/admin/users",
      "/admin/tenants",
      "/admin/billing",
      "/admin/marketplace",
      "/admin/system",
      "/crm/leads",
      "/crm/companies",
      "/auth/login",
      "/auth/register",
      "/profile",
      "/settings",
      "/notifications",
      "/billing",
      "/marketplace",
      "/chat",
      "/docs",
      "/health",
    ])

    navigationData.forEach((module) => {
      const modulePages: PageStatus[] = []
      let moduleCompleted = 0
      let moduleInProgress = 0
      let moduleMissing = 0

      module.pages.forEach((page) => {
        const exists = existingPages.has(page.path)
        const hasContent = pagesWithContent.has(page.path)
        const hasAPI = pagesWithAPI.has(page.path)
        const hasSchema = page.path.includes("/admin/") || page.path.includes("/crm/") || page.path.includes("/tenant/")

        const issues: string[] = []
        if (!exists) issues.push("Page file missing")
        if (exists && !hasContent) issues.push("Placeholder content")
        if (page.path.includes("/api/") && !hasAPI) issues.push("API endpoint missing")

        let completionScore = 0
        if (exists) completionScore += 25
        if (hasContent) completionScore += 50
        if (hasAPI && page.path.includes("/api/")) completionScore += 15
        if (hasSchema) completionScore += 10

        const pageStatus: PageStatus = {
          path: page.path,
          name: page.name,
          exists,
          hasContent,
          hasAPI,
          hasSchema,
          completionScore,
          issues,
        }

        modulePages.push(pageStatus)
        totalPages++

        if (completionScore >= 75) {
          moduleCompleted++
          completedPages++
        } else if (completionScore >= 25) {
          moduleInProgress++
          inProgressPages++
        } else {
          moduleMissing++
          missingPages++
        }
      })

      const moduleStatus: ModuleStatus = {
        id: module.id,
        name: module.name,
        totalPages: module.pages.length,
        completedPages: moduleCompleted,
        inProgressPages: moduleInProgress,
        missingPages: moduleMissing,
        completionPercentage: Math.round((moduleCompleted / module.pages.length) * 100),
        pages: modulePages,
        hasLayout: existingPages.has(`/${module.id}/layout`),
        hasAPI: pagesWithAPI.has(`/api/${module.id}`),
      }

      statuses.push(moduleStatus)
    })

    setModuleStatuses(statuses)
    setOverallStats({
      totalModules: navigationData.length,
      totalPages,
      completedPages,
      inProgressPages,
      missingPages,
      overallCompletion: Math.round((completedPages / totalPages) * 100),
    })
  }

  const getStatusIcon = (completionScore: number) => {
    if (completionScore >= 75) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (completionScore >= 25) return <Clock className="h-4 w-4 text-yellow-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (completionScore: number) => {
    if (completionScore >= 75) return <Badge className="bg-green-100 text-green-800">Complete</Badge>
    if (completionScore >= 25) return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
    return <Badge className="bg-red-100 text-red-800">Missing</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalModules}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.completedPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overallStats.inProgressPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.missingPages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall Application Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{overallStats.overallCompletion}%</span>
            </div>
            <Progress value={overallStats.overallCompletion} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Module Details */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Modules Overview</TabsTrigger>
          <TabsTrigger value="pages">Page Details</TabsTrigger>
          <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moduleStatuses.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{module.name}</span>
                    <Badge variant="outline">{module.completionPercentage}%</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={module.completionPercentage} className="h-2" />

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{module.completedPages}</div>
                      <div className="text-muted-foreground">Complete</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{module.inProgressPages}</div>
                      <div className="text-muted-foreground">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{module.missingPages}</div>
                      <div className="text-muted-foreground">Missing</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {module.hasLayout && <Badge variant="secondary">Layout</Badge>}
                    {module.hasAPI && <Badge variant="secondary">API</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <ScrollArea className="h-[600px]">
            {moduleStatuses.map((module) => (
              <Card key={module.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {module.name} Pages
                    <Badge variant="outline">{module.pages.length} pages</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.pages.map((page) => (
                      <div key={page.path} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(page.completionScore)}
                          <div>
                            <div className="font-medium">{page.name}</div>
                            <div className="text-sm text-muted-foreground">{page.path}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(page.completionScore)}
                          <div className="text-sm text-muted-foreground">{page.completionScore}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <ScrollArea className="h-[600px]">
            {moduleStatuses.map((module) => {
              const pagesWithIssues = module.pages.filter((page) => page.issues.length > 0)
              if (pagesWithIssues.length === 0) return null

              return (
                <Card key={module.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      {module.name} Issues
                      <Badge variant="destructive">{pagesWithIssues.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pagesWithIssues.map((page) => (
                        <div key={page.path} className="border-l-4 border-yellow-400 pl-4">
                          <div className="font-medium">{page.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">{page.path}</div>
                          <div className="space-y-1">
                            {page.issues.map((issue, index) => (
                              <div key={index} className="text-sm text-red-600 flex items-center gap-2">
                                <XCircle className="h-3 w-3" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
