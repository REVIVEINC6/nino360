import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Calendar, TrendingUp, Sparkles, Brain, Target, Zap } from "lucide-react"
import { TalentDashboardSidebar } from "@/components/talent/talent-dashboard-sidebar"
import { AIInsightsPanel } from "@/components/talent/ai-insights-panel"
import { QuickActionsPanel } from "@/components/talent/quick-actions-panel"
import { PipelineFunnel } from "@/components/talent/pipeline-funnel"
import { RecentActivityFeed } from "@/components/talent/recent-activity-feed"
import { AIRecommendations } from "@/components/talent/ai-recommendations"
import { SmartMetrics } from "@/components/talent/smart-metrics"
import { TwoPane } from "@/components/layout/two-pane"

export default async function TalentDashboardPage() {
  // TODO: Fetch real KPIs from database with RBAC filtering
  const kpis = {
    openJobs: 12,
    candidatesAdded: 45,
    upcomingInterviews: 8,
    offers: 3,
    timeToHire: 28,
    aiMatchScore: 87,
    automationRate: 65,
    qualityScore: 4.2,
  }

  return (
      <TwoPane right={<TalentDashboardSidebar />}>
      <div className="space-y-6">
        {/* AI Insights Banner */}
        <AIInsightsPanel />

        {/* Smart Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.openJobs}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-green-500" />
                <span className="text-green-600">3 high-priority</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidates (7d)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.candidatesAdded}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Brain className="h-3 w-3 text-blue-500" />
                <span className="text-blue-600">{kpis.aiMatchScore}% AI match avg</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.upcomingInterviews}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-500" />
                <span className="text-purple-600">{kpis.automationRate}% automated</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.timeToHire} days</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3 text-orange-500" />
                <span className="text-green-600">-5 days vs target</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Pipeline and Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <PipelineFunnel />
          <RecentActivityFeed />
        </div>

        {/* Smart Metrics */}
        <SmartMetrics />
      </div>
      </TwoPane>
  )
}
