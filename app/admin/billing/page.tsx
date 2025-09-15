"use client"

import { useBilling } from "@/hooks/use-billing"
import { BillingStatsComponent } from "@/components/admin/billing/billing-stats"
import { BillingTable } from "@/components/admin/billing/billing-table"
import { PlanEditor } from "@/components/admin/billing/plan-editor"
import { BillingCopilot } from "@/components/admin/billing/billing-copilot"
import { ForecastChart } from "@/components/admin/billing/forecast-chart"
import { ChurnRiskPanel } from "@/components/admin/billing/churn-risk-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, Settings, TrendingUp, Users, AlertTriangle, CreditCard } from "lucide-react"
import { BillingTest } from "@/components/admin/billing/billing-test"

export default function AdminBillingPage() {
  const {
    accounts,
    stats,
    plans,
    churnRisk,
    projections,
    loading,
    error,
    refetch,
    updateBillingAccount,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    generateInvoice,
    addCredit,
    exportBillingData,
  } = useBilling()

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Billing Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage tenant subscriptions, billing, and revenue analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Revenue Dashboard
          </Badge>
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => exportBillingData("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Temporary Test Component - Remove after testing */}
      <BillingTest />

      {/* Stats Overview */}
      <BillingStatsComponent stats={stats} loading={loading} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="churn" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Churn Risk
          </TabsTrigger>
          <TabsTrigger value="copilot" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            AI Copilot
          </TabsTrigger>
        </TabsList>

        {/* Billing Accounts */}
        <TabsContent value="accounts" className="space-y-6">
          <BillingTable
            accounts={accounts}
            loading={loading}
            onUpdateAccount={updateBillingAccount}
            onAddCredit={addCredit}
            onGenerateInvoice={generateInvoice}
            onExportData={exportBillingData}
          />
        </TabsContent>

        {/* Subscription Plans */}
        <TabsContent value="plans" className="space-y-6">
          <PlanEditor
            plans={plans}
            loading={loading}
            onCreatePlan={createSubscriptionPlan}
            onUpdatePlan={updateSubscriptionPlan}
          />
        </TabsContent>

        {/* Revenue Forecast */}
        <TabsContent value="forecast" className="space-y-6">
          <ForecastChart projections={projections} loading={loading} />
        </TabsContent>

        {/* Churn Risk Analysis */}
        <TabsContent value="churn" className="space-y-6">
          <ChurnRiskPanel tenants={churnRisk} loading={loading} />
        </TabsContent>

        {/* AI Billing Copilot */}
        <TabsContent value="copilot" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BillingCopilot />
            </div>
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Tenants</span>
                    <span className="font-semibold">{stats?.active_tenants || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold">${(stats?.total_mrr || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Churn Risk</span>
                    <span className="font-semibold text-orange-600">{churnRisk.length} tenants</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <span className="font-semibold text-green-600">{(stats?.revenue_growth || 0).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>New subscription: TechCorp Pro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Payment received: $2,400</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Trial expiring: StartupXYZ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Plan upgrade: DataFlow Enterprise</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
