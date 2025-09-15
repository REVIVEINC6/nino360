"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import type { RevenueProjection } from "@/lib/types/billing"
import { TrendingUp, Brain, Target } from "lucide-react"

interface ForecastChartProps {
  projections: RevenueProjection[]
  loading: boolean
}

export function ForecastChart({ projections, loading }: ForecastChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!projections || projections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No projection data available</div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100"
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High"
    if (confidence >= 0.6) return "Medium"
    return "Low"
  }

  // Calculate growth metrics
  const firstProjection = projections[projections.length - 1]
  const lastProjection = projections[0]
  const totalGrowth = lastProjection
    ? ((lastProjection.projected_mrr - firstProjection.projected_mrr) / firstProjection.projected_mrr) * 100
    : 0

  const averageConfidence = projections.reduce((sum, p) => sum + p.confidence_score, 0) / projections.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Revenue Forecast
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {averageConfidence.toFixed(0)}% Confidence
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {totalGrowth.toFixed(1)}% Growth
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...projections].reverse()}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tickFormatter={formatMonth} className="text-sm" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} className="text-sm" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "projected_mrr" ? "MRR" : "ARR",
                  ]}
                  labelFormatter={(label) => `Month: ${formatMonth(label)}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projected_mrr"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#mrrGradient)"
                  name="MRR"
                />
                <Area
                  type="monotone"
                  dataKey="projected_arr"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#arrGradient)"
                  name="ARR"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Projection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projections.slice(0, 3).map((projection, index) => (
              <div key={projection.month} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{formatMonth(projection.month)}</div>
                  <Badge className={getConfidenceColor(projection.confidence_score)} variant="secondary">
                    {getConfidenceLabel(projection.confidence_score)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(projection.projected_mrr)}</div>
                  <div className="text-sm text-gray-600">MRR • {formatCurrency(projection.projected_arr)} ARR</div>
                  <div className="text-xs text-gray-500">
                    {(projection.confidence_score * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Factors */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">AI Analysis Factors</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {projections[0]?.factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-blue-800">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {factor}
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalGrowth.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Projected Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(lastProjection?.projected_mrr || 0)}
              </div>
              <div className="text-sm text-gray-600">6-Month MRR Target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(averageConfidence * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
