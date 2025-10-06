"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Briefcase,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Zap,
  Plus,
  Download,
  RefreshCw,
} from "lucide-react"

export default function TalentDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const metrics = [
    {
      title: "Active Job Postings",
      value: "24",
      change: "+3 this week",
      changeType: "positive" as const,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Candidates",
      value: "1,247",
      change: "+89 this month",
      changeType: "positive" as const,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Interviews Scheduled",
      value: "18",
      change: "Next 7 days",
      changeType: "neutral" as const,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Offers Extended",
      value: "7",
      change: "+2 this week",
      changeType: "positive" as const,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Time to Fill",
      value: "28 days",
      change: "-3 days improved",
      changeType: "positive" as const,
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Success Rate",
      value: "73%",
      change: "+5% this quarter",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "application",
      title: "New application received",
      description: "Sarah Johnson applied for Senior React Developer",
      time: "2 minutes ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "interview",
      title: "Interview completed",
      description: "Technical interview with Mike Chen for DevOps Engineer",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "offer",
      title: "Offer accepted",
      description: "Emma Davis accepted Product Manager position",
      time: "3 hours ago",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      id: 4,
      type: "urgent",
      title: "Urgent requirement",
      description: "Client needs Java Developer ASAP - 2 days deadline",
      time: "5 hours ago",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      id: 5,
      type: "assessment",
      title: "Assessment completed",
      description: "Technical assessment submitted by Alex Kumar",
      time: "1 day ago",
      icon: Award,
      color: "text-purple-600",
    },
  ]

  const topPerformingJobs = [
    {
      title: "Senior React Developer",
      applications: 45,
      interviews: 12,
      offers: 3,
      status: "Active",
      priority: "High",
    },
    {
      title: "DevOps Engineer",
      applications: 32,
      interviews: 8,
      offers: 2,
      status: "Active",
      priority: "Medium",
    },
    {
      title: "Product Manager",
      applications: 28,
      interviews: 6,
      offers: 1,
      status: "Filled",
      priority: "High",
    },
    {
      title: "Data Scientist",
      applications: 38,
      interviews: 10,
      offers: 2,
      status: "Active",
      priority: "High",
    },
  ]

  const upcomingInterviews = [
    {
      candidate: "Sarah Johnson",
      position: "Senior React Developer",
      time: "Today, 2:00 PM",
      type: "Technical",
      interviewer: "John Smith",
    },
    {
      candidate: "Mike Chen",
      position: "DevOps Engineer",
      time: "Tomorrow, 10:00 AM",
      type: "Final Round",
      interviewer: "Lisa Wang",
    },
    {
      candidate: "Alex Kumar",
      position: "Data Scientist",
      time: "Tomorrow, 3:00 PM",
      type: "Technical",
      interviewer: "David Brown",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Talent Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your talent acquisition overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Job Posting
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p
                className={`text-xs ${
                  String(metric.changeType) === "positive"
                    ? "text-green-600"
                    : String(metric.changeType) === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your talent pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Performing Jobs
                </CardTitle>
                <CardDescription>Jobs with highest engagement and success rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformingJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <Badge variant={job.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {job.status}
                        </Badge>
                        <Badge variant={job.priority === "High" ? "destructive" : "outline"} className="text-xs">
                          {job.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{job.applications} applications</span>
                        <span>{job.interviews} interviews</span>
                        <span>{job.offers} offers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>Manage your current job openings and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Job Management</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage all your active job postings, track applications, and monitor performance.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Job Posting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Pipeline</CardTitle>
              <CardDescription>Track and manage candidates through your hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Candidate Management</h3>
                <p className="text-muted-foreground mb-4">
                  View candidate profiles, track application status, and manage your talent pipeline.
                </p>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  View All Candidates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Schedule and manage candidate interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {interview.candidate
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{interview.candidate}</h4>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{interview.time}</p>
                    <p className="text-xs text-muted-foreground">
                      {interview.type} with {interview.interviewer}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
