import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react"

export default function TalentDashboardPage() {
  // TODO: Fetch real KPIs from database
  const kpis = {
    openJobs: 12,
    candidatesAdded: 45,
    upcomingInterviews: 8,
    offers: 3,
    timeToHire: 28,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talent Dashboard</h1>
        <p className="text-muted-foreground">Overview of your recruitment pipeline</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.openJobs}</div>
            <p className="text-xs text-muted-foreground">Active requisitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.candidatesAdded}</div>
            <p className="text-xs text-muted-foreground">Added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.upcomingInterviews}</div>
            <p className="text-xs text-muted-foreground">Scheduled upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.timeToHire} days</div>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Applied</span>
                <span className="text-sm font-medium">120</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Screen</span>
                <span className="text-sm font-medium">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Interview</span>
                <span className="text-sm font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offer</span>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hired</span>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <p className="font-medium">New candidate added</p>
                  <p className="text-muted-foreground text-xs">John Doe applied for Senior Developer</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="font-medium">Interview scheduled</p>
                  <p className="text-muted-foreground text-xs">Jane Smith - Technical Round on Dec 15</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5" />
                <div>
                  <p className="font-medium">Offer extended</p>
                  <p className="text-muted-foreground text-xs">Mike Johnson for Product Manager role</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
