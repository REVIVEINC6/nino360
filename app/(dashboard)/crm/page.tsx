import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Shield, Zap } from "lucide-react"
import { ClientsTable } from "@/components/crm/clients-table"
import { ClientsKanban } from "@/components/crm/clients-kanban"
import { CRMStats } from "@/components/crm/crm-stats"
import { CRMAIInsights } from "@/components/crm/crm-ai-insights"
import { CRMBlockchainAudit } from "@/components/crm/crm-blockchain-audit"
import { CRMRPAAutomation } from "@/components/crm/crm-rpa-automation"
import { AddClientDialog } from "@/components/crm/add-client-dialog"
import { ExportCRMDialog } from "@/components/crm/export-crm-dialog"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { checkPermission } from "@/lib/rbac/check-permission"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { redirect } from "next/navigation"
import {
  generateCRMInsights,
  getBlockchainAuditTrail,
  getRPAWorkflows,
  exportCRMData,
} from "@/app/(dashboard)/crm/ai/actions"

export default async function CRMPage() {
  const canView = await checkPermission(PERMISSIONS.CRM_DASHBOARD_VIEW)
  if (!canView) {
    redirect("/unauthorized")
  }

  const canCreate = await checkPermission(PERMISSIONS.CRM_CLIENTS_CREATE)
  const canExport = await checkPermission(PERMISSIONS.CRM_CLIENTS_EXPORT)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            CRM
          </h1>
          <p className="text-muted-foreground">Manage your client relationships with AI-powered insights</p>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Shield className="h-3 w-3" />
              Blockchain Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Zap className="h-3 w-3" />
              RPA Automated
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {canExport && <ExportCRMDialog exportAction={exportCRMData} />}
          {canCreate && <AddClientDialog />}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Suspense fallback={<PageSkeleton />}>
          <CRMAIInsights generateInsights={generateCRMInsights} />
        </Suspense>
        <Suspense fallback={<PageSkeleton />}>
          <CRMBlockchainAudit getAuditTrail={getBlockchainAuditTrail} />
        </Suspense>
        <Suspense fallback={<PageSkeleton />}>
          <CRMRPAAutomation getWorkflows={getRPAWorkflows} />
        </Suspense>
      </div>

      {/* Stats */}
      <Suspense fallback={<PageSkeleton />}>
        <CRMStats />
      </Suspense>

      {/* Clients View */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Pipeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>Manage and track your client accounts with real-time data</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PageSkeleton />}>
                <ClientsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban">
          <Suspense fallback={<PageSkeleton />}>
            <ClientsKanban />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
