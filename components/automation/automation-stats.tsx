import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Bell, Webhook, CheckCircle } from "lucide-react"

interface AutomationStatsProps {
  activeRules?: number
  alertsToday?: number
  webhooksConfigured?: number
  successRate?: number
}

export function AutomationStats({
  activeRules = 0,
  alertsToday = 0,
  webhooksConfigured = 0,
  successRate = 0,
}: AutomationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRules}</div>
          <p className="text-xs text-muted-foreground">Currently enabled</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsToday}</div>
          <p className="text-xs text-muted-foreground">Triggered today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
          <Webhook className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{webhooksConfigured}</div>
          <p className="text-xs text-muted-foreground">Configured endpoints</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  )
}
