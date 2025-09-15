"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Calendar, Target, Plus, Filter, Download, TrendingUp, UserCheck } from "lucide-react"

const talentStats = [
  {
    title: "Open Positions",
    value: "24",
    change: "+3",
    icon: Briefcase,
    color: "text-blue-600",
  },
  {
    title: "Active Candidates",
    value: "156",
    change: "+12",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Interviews Scheduled",
    value: "18",
    change: "+5",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Hire Rate",
    value: "68%",
    change: "+4%",
    icon: Target,
    color: "text-emerald-600",
  },
]

const recentJobs = [
  { title: "Senior Frontend Developer", applicants: 45, status: "Active", department: "Engineering" },
  { title: "Product Manager", applicants: 32, status: "Active", department: "Product" },
  { title: "UX Designer", applicants: 28, status: "Paused", department: "Design" },
  { title: "Data Scientist", applicants: 67, status: "Active", department: "Analytics" },
]

export default function TalentPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Dashboard</h1>
          <p className="text-muted-foreground">Recruitment and talent acquisition overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {talentStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Job Postings */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recent Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{job.applicants} applicants</p>
                    <Badge variant={job.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hiring Pipeline */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hiring Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Applied", count: 234, color: "bg-blue-500" },
                { stage: "Screening", count: 89, color: "bg-yellow-500" },
                { stage: "Interview", count: 45, color: "bg-orange-500" },
                { stage: "Final Round", count: 18, color: "bg-purple-500" },
                { stage: "Offer", count: 8, color: "bg-green-500" },
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-sm">{stage.stage}</span>
                  </div>
                  <Badge variant="outline">{stage.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Plus className="h-6 w-6" />
              Post New Job
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="h-6 w-6" />
              Review Candidates
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              Schedule Interviews
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <UserCheck className="h-6 w-6" />
              Send Offers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
