"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles, Shield } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function AdminDashboardAI() {
  return (
    <Card className="glass-card border-white/20 shadow-lg backdrop-blur-md bg-white/70">
      <CardHeader>
        <CardTitle className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Insights
        </CardTitle>
        <CardDescription>Machine learning and AI system metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">ML Model Accuracy</span>
            </div>
            <span className="text-sm font-bold text-purple-600">94.2%</span>
          </div>
          <Progress value={94.2} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium">AI Response Time</span>
            </div>
            <span className="text-sm font-bold text-pink-600">1.2s</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Security Score</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">98.5%</span>
          </div>
          <Progress value={98.5} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
