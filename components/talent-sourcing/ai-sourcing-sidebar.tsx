"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Sparkles, Bot, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface AISourcingSidebarProps {
  analytics?: any
  insights?: any[]
}

export function AISourcingSidebar({ analytics, insights = [] }: AISourcingSidebarProps) {
  return (
    <div className="w-80 border-l bg-white/50 backdrop-blur-md p-6 space-y-6 overflow-y-auto">
      {/* Analytics Overview */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Sourcing Analytics</h3>
        </div>

        <Card className="p-4 bg-linear-to-br from-blue-50/50 to-purple-50/50 border-blue-200/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Candidates</span>
              <Badge variant="secondary" className="bg-blue-100">
                {analytics?.total_candidates || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New This Week</span>
              <Badge variant="default" className="bg-linear-to-r from-blue-600 to-purple-600">
                {analytics?.new_this_week || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Match</span>
              <Badge variant="secondary" className="bg-green-100">
                {analytics?.high_match_candidates || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Rate</span>
              <span className="text-sm font-medium text-green-600">{analytics?.response_rate || 0}%</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <Separator />

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">AI Insights</h3>
        </div>

        <div className="space-y-3">
          {insights.slice(0, 3).map((insight, index) => (
            <Card
              key={insight.id}
              className="p-4 bg-linear-to-br from-purple-50/50 to-pink-50/50 border-purple-200/50"
            >
              <div className="flex items-start gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {insight.insight_type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {insight.confidence}%
                </Badge>
              </div>
              <p className="text-sm font-medium mb-1">{insight.title}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <Separator />

      {/* Technology Badges */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-semibold mb-4">Powered By</h3>
        <div className="space-y-2">
          <Card className="p-3 bg-linear-to-r from-blue-50/50 to-purple-50/50 border-blue-200/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Generative AI</span>
            </div>
          </Card>
          <Card className="p-3 bg-linear-to-r from-purple-50/50 to-pink-50/50 border-purple-200/50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium">Machine Learning</span>
            </div>
          </Card>
          <Card className="p-3 bg-linear-to-r from-green-50/50 to-blue-50/50 border-green-200/50">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Blockchain</span>
            </div>
          </Card>
          <Card className="p-3 bg-linear-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">RPA Automation</span>
            </div>
          </Card>
        </div>
      </motion.div>

      <Separator />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-white/50">
            <Bot className="h-4 w-4 mr-2" />
            Run AI Matching
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-white/50">
            <Sparkles className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-white/50">
            <Shield className="h-4 w-4 mr-2" />
            View Audit Trail
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
