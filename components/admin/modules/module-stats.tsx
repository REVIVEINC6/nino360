"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, CheckCircle, TestTube, Zap } from "lucide-react"
import type { AIInsight } from "@/lib/types/modules"

interface ModuleStatsProps {
  totalModules: number
  activeModules: number
  betaModules: number
  insights: AIInsight[]
}

export function ModuleStats({ totalModules, activeModules, betaModules, insights }: ModuleStatsProps) {
  const adoptionRate = totalModules > 0 ? (activeModules / totalModules) * 100 : 0
  const criticalInsights = insights.filter((i) => i.confidence > 0.8).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalModules}</div>
          <p className="text-xs text-muted-foreground">Across all categories</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeModules}</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={adoptionRate} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground">{adoptionRate.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Beta Modules</CardTitle>
          <TestTube className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{betaModules}</div>
          <p className="text-xs text-muted-foreground">In testing phase</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          <Zap className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{criticalInsights}</div>
          <p className="text-xs text-muted-foreground">High confidence alerts</p>
        </CardContent>
      </Card>
    </div>
  )
}
