"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, CreditCard, AlertTriangle, Calendar } from "lucide-react"
import type { BillingStats } from "@/lib/types/billing"

interface BillingStatsProps {
  stats: BillingStats | null
  loading: boolean
}

export function BillingStatsComponent({ stats, loading }: BillingStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total MRR */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Monthly Recurring Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats.total_mrr)}</div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <TrendingUp className="h-3 w-3" />
            <span>{formatPercentage(stats.revenue_growth)} growth</span>
          </div>
        </CardContent>
      </Card>

      {/* Total ARR */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Annual Recurring Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.total_arr)}</div>
          <div className="text-sm text-green-600">ARPU: {formatCurrency(stats.average_revenue_per_user)}</div>
        </CardContent>
      </Card>

      {/* Active Tenants */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Tenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{stats.active_tenants.toLocaleString()}</div>
          <div className="text-sm text-purple-600">{stats.trial_tenants} on trial</div>
        </CardContent>
      </Card>

      {/* Churn Rate */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Churn Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{formatPercentage(stats.churn_rate)}</div>
          <Badge variant={stats.churn_rate > 5 ? "destructive" : "secondary"} className="text-xs">
            {stats.churn_rate > 5 ? "High" : "Normal"}
          </Badge>
        </CardContent>
      </Card>

      {/* Overdue Invoices */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Overdue Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{stats.overdue_invoices}</div>
          <div className="text-sm text-red-600">{formatCurrency(stats.total_outstanding)} outstanding</div>
        </CardContent>
      </Card>

      {/* Trial Expiring */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Trials Expiring Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">{stats.trial_expiring_today}</div>
          <Badge variant={stats.trial_expiring_today > 0 ? "destructive" : "secondary"} className="text-xs">
            {stats.trial_expiring_today > 0 ? "Action Required" : "All Good"}
          </Badge>
        </CardContent>
      </Card>

      {/* Payment Success Rate */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-900">97.5%</div>
          <div className="text-sm text-teal-600">Last 30 days</div>
        </CardContent>
      </Card>

      {/* Revenue Growth */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-indigo-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-900">{formatPercentage(stats.revenue_growth)}</div>
          <div className="text-sm text-indigo-600">Month over month</div>
        </CardContent>
      </Card>
    </div>
  )
}
