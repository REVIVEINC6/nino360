"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  BarChart3,
  Plus,
  Filter,
  Search,
  Briefcase,
  ArrowUpRight,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export function HotlistModule() {
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock data for hotlist metrics
  const hotlistStats = {
    priorityCandidates: 47,
    urgentRequirements: 12,
    activeMatches: 89,
    responseRate: 94.2,
    avgTimeToResponse: "2.3 hours",
    placementRate: 78.5,
  }

  // Mock priority candidates data
  const priorityCandidates = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior React Developer",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "5+ years",
      location: "San Francisco, CA",
      availability: "Immediate",
      priority: "High",
      matchScore: 95,
      lastContact: "2 hours ago",
      status: "Interview Scheduled",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "DevOps Engineer",
      skills: ["AWS", "Kubernetes", "Docker"],
      experience: "7+ years",
      location: "Austin, TX",
      availability: "2 weeks",
      priority: "High",
      matchScore: 92,
      lastContact: "1 day ago",
      status: "Client Review",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Product Manager",
      skills: ["Strategy", "Analytics", "Agile"],
      experience: "6+ years",
      location: "New York, NY",
      availability: "Immediate",
      priority: "Critical",
      matchScore: 98,
      lastContact: "30 minutes ago",
      status: "Offer Pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock urgent requirements data
  const urgentRequirements = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      client: "TechCorp Inc.",
      deadline: "3 days",
      priority: "Critical",
      budget: "$120k - $150k",
      candidates: 8,
      status: "Active Search",
      requirements: ["React", "Node.js", "PostgreSQL"],
    },
    {
      id: 2,
      title: "Cloud Architect",
      client: "CloudFirst Solutions",
      deadline: "1 week",
      priority: "High",
      budget: "$140k - $180k",
      candidates: 5,
      status: "Screening",
      requirements: ["AWS", "Terraform", "Microservices"],
    },
    {
      id: 3,
      title: "Data Scientist",
      client: "Analytics Pro",
      deadline: "5 days",
      priority: "High",
      budget: "$110k - $140k",
      candidates: 12,
      status: "Interview Phase",
      requirements: ["Python", "ML", "TensorFlow"],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "offer pending":
        return "bg-green-100 text-green-800"
      case "interview scheduled":
        return "bg-blue-100 text-blue-800"
      case "client review":
        return "bg-purple-100 text-purple-800"
      case "active search":
        return "bg-orange-100 text-orange-800"
      case "screening":
        return "bg-yellow-100 text-yellow-800"
      case "interview phase":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotlist Management</h1>
          <p className="text-gray-600 mt-1">Priority candidates and urgent requirements dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add to Hotlist
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority Candidates</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{hotlistStats.priorityCandidates}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Requirements</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{hotlistStats.urgentRequirements}</div>
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 inline mr-1" />3 critical deadlines
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{hotlistStats.activeMatches}</div>
            <p className="text-xs text-muted-foreground">
              <Activity className="h-3 w-3 inline mr-1" />
              {hotlistStats.responseRate}% response rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{hotlistStats.placementRate}%</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 inline mr-1" />
              +5.2% this month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Priority Candidates</TabsTrigger>
            <TabsTrigger value="requirements">Urgent Requirements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common hotlist management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Add Priority Candidate
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Mark Requirement Urgent
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Run AI Matching
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest hotlist updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Chen added to priority list</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cloud Architect role marked urgent</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI matching completed for 12 candidates</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weekly hotlist report generated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Priority Candidates
                </CardTitle>
                <CardDescription>High-priority candidates requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priorityCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {candidate.experience}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(candidate.priority)}`}>
                              {candidate.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{candidate.matchScore}% match</span>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(candidate.status)}`}>{candidate.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Last contact: {candidate.lastContact}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Urgent Requirements
                </CardTitle>
                <CardDescription>Critical job requirements with approaching deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgentRequirements.map((requirement) => (
                    <motion.div
                      key={requirement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{requirement.title}</h4>
                          <p className="text-sm text-muted-foreground">{requirement.client}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-xs ${getPriorityColor(requirement.priority)}`}>
                            {requirement.priority}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Deadline: {requirement.deadline}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{requirement.candidates} candidates</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{requirement.budget}</span>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(requirement.status)}`}>{requirement.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {requirement.requirements.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Rate</span>
                      <span>{hotlistStats.responseRate}%</span>
                    </div>
                    <Progress value={hotlistStats.responseRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Placement Rate</span>
                      <span>{hotlistStats.placementRate}%</span>
                    </div>
                    <Progress value={hotlistStats.placementRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Match Accuracy</span>
                      <span>87.3%</span>
                    </div>
                    <Progress value={87.3} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Time Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Response Time</span>
                    <span className="font-semibold">{hotlistStats.avgTimeToResponse}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Time to Interview</span>
                    <span className="font-semibold">1.8 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Time to Offer</span>
                    <span className="font-semibold">5.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Time to Placement</span>
                    <span className="font-semibold">12.4 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
