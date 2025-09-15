"use client"

import { useState } from "react"
import { AdminLayoutWrapper } from "@/components/layout/admin-layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModulesTable } from "@/components/admin/modules/modules-table"
import { ModuleCreateModal } from "@/components/admin/modules/module-create-modal"
import { ModuleAIInsights } from "@/components/admin/modules/module-ai-insights"
import { ModuleStats } from "@/components/admin/modules/module-stats"
import { useModules, useModuleAnalytics } from "@/hooks/use-modules"
import { Plus, Search, Download, BarChart3, Zap, Package, TrendingUp, AlertTriangle } from "lucide-react"

export default function ModulesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const {
    modules,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    tierFilter,
    setTierFilter,
    categoryFilter,
    setCategoryFilter,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleStatus,
    bulkAction,
    exportModules,
    totalModules,
    activeModules,
    betaModules,
  } = useModules()

  const { insights } = useModuleAnalytics()

  const handleBulkAction = async (action: string) => {
    if (selectedModules.length === 0) return
    await bulkAction(selectedModules, action)
    setSelectedModules([])
  }

  const breadcrumbs = [{ label: "Modules", href: "/admin/modules" }]

  return (
    <AdminLayoutWrapper title="Module Management" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
            <p className="text-muted-foreground">Control system-wide module activation, licensing, and tenant access</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => exportModules("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <ModuleStats
          totalModules={totalModules}
          activeModules={activeModules}
          betaModules={betaModules}
          insights={insights}
        />

        {/* Main Content */}
        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters & Search</CardTitle>
                <CardDescription>Filter modules by status, tier, category, or search by name</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedModules.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">{selectedModules.length} module(s) selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("enable")}>
                        Enable All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("disable")}>
                        Disable All
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                        Delete All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modules Table */}
            <ModulesTable
              modules={modules}
              loading={loading}
              selectedModules={selectedModules}
              onSelectionChange={setSelectedModules}
              onUpdate={updateModule}
              onDelete={deleteModule}
              onToggleStatus={toggleModuleStatus}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Module Analytics
                </CardTitle>
                <CardDescription>Usage patterns, performance metrics, and adoption rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Track module performance and usage patterns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <ModuleAIInsights insights={insights} />
          </TabsContent>
        </Tabs>

        {/* Create Module Modal */}
        <ModuleCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} onSubmit={createModule} />
      </div>
    </AdminLayoutWrapper>
  )
}
