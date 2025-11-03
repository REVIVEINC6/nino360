import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AutomationRulesManagement } from "@/components/admin/automation-rules-management"
import { getAutomationStats, getAutomationRules } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AutomationRulesPage() {
  const [stats, rules] = await Promise.all([getAutomationStats(), getAutomationRules()])

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Automation & RPA
          </h1>
          <p className="text-muted-foreground mt-2">Robotic Process Automation rules and workflows</p>
        </div>

        {/* Stats */}
  <div className="grid gap-4 md:grid-cols-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{stats.totalRules}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-linear-to-br from-green-500 to-green-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activeRules}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-linear-to-br from-purple-500 to-purple-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Executions (24h)</p>
                <p className="text-2xl font-bold">{stats.executions24h}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-linear-to-br from-pink-500 to-pink-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Management */}
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <AutomationRulesManagement initialRules={rules} />
        </Suspense>
      </div>
    </TwoPane>
  )
}
