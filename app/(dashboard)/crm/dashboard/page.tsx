import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, TrendingUp, Target, Calendar } from "lucide-react"

export default async function CRMDashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">$2.4M pipeline value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Prospect", count: 24, value: "$480K", prob: 10 },
                { stage: "Qualified", count: 18, value: "$720K", prob: 30 },
                { stage: "Proposal", count: 15, value: "$900K", prob: 60 },
                { stage: "Negotiation", count: 12, value: "$600K", prob: 80 },
                { stage: "Closed Won", count: 8, value: "$400K", prob: 100 },
              ].map((item) => (
                <div key={item.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{item.stage}</div>
                    <div className="text-xs text-muted-foreground">({item.count})</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.prob}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "call", subject: "Follow-up call with Acme Corp", time: "2 hours ago" },
                { type: "email", subject: "Proposal sent to TechStart Inc", time: "4 hours ago" },
                { type: "meeting", subject: "Demo scheduled with GlobalTech", time: "1 day ago" },
                { type: "note", subject: "Updated requirements for DataFlow", time: "2 days ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.subject}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weighted Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Weighted Pipeline Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Total Pipeline Value</div>
              <div className="text-2xl font-bold">$3.1M</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Weighted Pipeline</div>
              <div className="text-2xl font-bold text-primary">$1.8M</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Expected Close This Quarter</div>
              <div className="text-xl font-bold text-green-600">$1.2M</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
