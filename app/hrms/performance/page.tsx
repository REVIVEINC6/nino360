"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  Star,
  Target,
  Award,
  Calendar,
  Users,
  BarChart3,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  reviewPeriod: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  overallRating: number
  goals: Goal[]
  competencies: Competency[]
  reviewDate: string
  reviewerName: string
  avatar?: string
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  status: "on_track" | "at_risk" | "completed" | "not_started"
  dueDate: string
}

interface Competency {
  id: string
  name: string
  rating: number
  feedback: string
}

const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: "1",
    employeeId: "emp-001",
    employeeName: "Sarah Johnson",
    department: "Marketing",
    position: "Marketing Manager",
    reviewPeriod: "Q4 2024",
    status: "completed",
    overallRating: 4.5,
    reviewDate: "2024-01-15",
    reviewerName: "Mike Chen",
    goals: [
      {
        id: "g1",
        title: "Increase Lead Generation",
        description: "Improve lead generation by 25% through digital campaigns",
        progress: 90,
        status: "on_track",
        dueDate: "2024-03-31",
      },
      {
        id: "g2",
        title: "Team Development",
        description: "Mentor 2 junior marketing specialists",
        progress: 100,
        status: "completed",
        dueDate: "2024-02-28",
      },
    ],
    competencies: [
      { id: "c1", name: "Leadership", rating: 4, feedback: "Shows strong leadership skills" },
      { id: "c2", name: "Communication", rating: 5, feedback: "Excellent communication abilities" },
      { id: "c3", name: "Strategic Thinking", rating: 4, feedback: "Good strategic planning" },
    ],
  },
  {
    id: "2",
    employeeId: "emp-002",
    employeeName: "David Wilson",
    department: "Engineering",
    position: "Senior Developer",
    reviewPeriod: "Q4 2024",
    status: "in_progress",
    overallRating: 4.2,
    reviewDate: "2024-01-20",
    reviewerName: "Lisa Park",
    goals: [
      {
        id: "g3",
        title: "Code Quality Improvement",
        description: "Reduce bug reports by 30%",
        progress: 75,
        status: "on_track",
        dueDate: "2024-04-30",
      },
      {
        id: "g4",
        title: "Knowledge Sharing",
        description: "Conduct 4 technical workshops",
        progress: 50,
        status: "at_risk",
        dueDate: "2024-03-15",
      },
    ],
    competencies: [
      { id: "c4", name: "Technical Skills", rating: 5, feedback: "Outstanding technical expertise" },
      { id: "c5", name: "Problem Solving", rating: 4, feedback: "Great problem-solving abilities" },
      { id: "c6", name: "Collaboration", rating: 4, feedback: "Works well with team members" },
    ],
  },
  {
    id: "3",
    employeeId: "emp-003",
    employeeName: "Emily Chen",
    department: "Sales",
    position: "Sales Representative",
    reviewPeriod: "Q4 2024",
    status: "overdue",
    overallRating: 3.8,
    reviewDate: "2024-01-10",
    reviewerName: "John Smith",
    goals: [
      {
        id: "g5",
        title: "Sales Target Achievement",
        description: "Achieve 120% of quarterly sales target",
        progress: 85,
        status: "at_risk",
        dueDate: "2024-03-31",
      },
    ],
    competencies: [
      { id: "c7", name: "Sales Skills", rating: 4, feedback: "Strong sales performance" },
      { id: "c8", name: "Customer Relations", rating: 4, feedback: "Excellent customer relationships" },
    ],
  },
]

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockPerformanceReviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || review.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = Array.from(new Set(reviews.map((r) => r.department)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "on_track":
        return "text-blue-600"
      case "at_risk":
        return "text-orange-600"
      case "not_started":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Management
          </h1>
          <p className="text-muted-foreground mt-1">Track employee performance, goals, and development progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {reviews.filter((r) => r.status === "completed").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reviews.filter((r) => r.status === "in_progress").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600">
                  {reviews.filter((r) => r.status === "overdue").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {review.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{review.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{review.position}</p>
                          <p className="text-xs text-muted-foreground">{review.department}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(review.status)}>{review.status.replace("_", " ")}</Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Rating</span>
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(review.overallRating))}
                            <span className="text-sm ml-1">{review.overallRating}/5</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Goals Progress</p>
                        <div className="space-y-2">
                          {review.goals.slice(0, 2).map((goal) => (
                            <div key={goal.id} className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground truncate flex-1">{goal.title}</span>
                              <div className="flex items-center gap-2 ml-2">
                                <Progress value={goal.progress} className="w-16 h-2" />
                                <span className="text-xs w-8">{goal.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Review: {new Date(review.reviewDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals & Objectives Overview
              </CardTitle>
              <CardDescription>Track progress on individual and team goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {review.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">{review.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                      {review.goals.map((goal) => (
                        <Card key={goal.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-sm">{goal.title}</h5>
                              <Badge variant="outline" className={getGoalStatusColor(goal.status)}>
                                {goal.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{goal.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs">Progress</span>
                                <span className="text-xs font-medium">{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {review !== reviews[reviews.length - 1] && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Average Rating</p>
                      <p className="text-2xl font-bold text-green-600">4.2/5</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Goal Completion</p>
                      <p className="text-2xl font-bold text-blue-600">78%</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800">Review Completion</p>
                      <p className="text-2xl font-bold text-purple-600">85%</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptReviews = reviews.filter((r) => r.department === dept)
                    const avgRating = deptReviews.reduce((sum, r) => sum + r.overallRating, 0) / deptReviews.length

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(avgRating))}
                            <span className="text-sm ml-1">{avgRating.toFixed(1)}</span>
                          </div>
                        </div>
                        <Progress value={(avgRating / 5) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {deptReviews.length} employee{deptReviews.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
