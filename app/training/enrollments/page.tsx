"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  Award,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Enrollment {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  sessionId: string
  sessionName: string
  courseName: string
  instructor: string
  enrollmentDate: string
  completionDate?: string
  status: "enrolled" | "in_progress" | "completed" | "dropped" | "failed"
  progressPercentage: number
  finalScore?: number
  certificationEarned: boolean
  feedback?: string
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEnrollments()
  }, [])

  useEffect(() => {
    filterEnrollments()
  }, [enrollments, searchTerm, statusFilter, courseFilter])

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      const mockEnrollments: Enrollment[] = [
        {
          id: "1",
          userId: "user1",
          userName: "John Smith",
          userEmail: "john.smith@company.com",
          sessionId: "session1",
          sessionName: "React Advanced - Spring 2024",
          courseName: "Advanced React Development",
          instructor: "Sarah Johnson",
          enrollmentDate: "2024-02-15",
          completionDate: "2024-03-08",
          status: "completed",
          progressPercentage: 100,
          finalScore: 92,
          certificationEarned: true,
          feedback: "Excellent course! Learned a lot about advanced React patterns.",
        },
        {
          id: "2",
          userId: "user2",
          userName: "Emily Davis",
          userEmail: "emily.davis@company.com",
          sessionId: "session2",
          sessionName: "PM Fundamentals - Q1 2024",
          courseName: "Project Management Fundamentals",
          instructor: "Michael Chen",
          enrollmentDate: "2024-02-10",
          status: "in_progress",
          progressPercentage: 65,
          certificationEarned: false,
        },
        {
          id: "3",
          userId: "user3",
          userName: "Michael Brown",
          userEmail: "michael.brown@company.com",
          sessionId: "session3",
          sessionName: "Data Science - Spring Cohort",
          courseName: "Data Science with Python",
          instructor: "Dr. Emily Rodriguez",
          enrollmentDate: "2024-03-01",
          status: "enrolled",
          progressPercentage: 0,
          certificationEarned: false,
        },
        {
          id: "4",
          userId: "user4",
          userName: "Sarah Wilson",
          userEmail: "sarah.wilson@company.com",
          sessionId: "session4",
          sessionName: "Leadership Workshop - February",
          courseName: "Leadership Skills Development",
          instructor: "David Wilson",
          enrollmentDate: "2024-02-18",
          completionDate: "2024-02-22",
          status: "completed",
          progressPercentage: 100,
          finalScore: 88,
          certificationEarned: false,
          feedback: "Great interactive sessions and practical exercises.",
        },
        {
          id: "5",
          userId: "user5",
          userName: "David Johnson",
          userEmail: "david.johnson@company.com",
          sessionId: "session5",
          sessionName: "Cybersecurity Bootcamp - Winter",
          courseName: "Cybersecurity Essentials",
          instructor: "Alex Thompson",
          enrollmentDate: "2024-01-10",
          status: "dropped",
          progressPercentage: 25,
          certificationEarned: false,
          feedback: "Had to drop due to scheduling conflicts.",
        },
        {
          id: "6",
          userId: "user6",
          userName: "Lisa Anderson",
          userEmail: "lisa.anderson@company.com",
          sessionId: "session1",
          sessionName: "React Advanced - Spring 2024",
          courseName: "Advanced React Development",
          instructor: "Sarah Johnson",
          enrollmentDate: "2024-02-20",
          status: "in_progress",
          progressPercentage: 45,
          certificationEarned: false,
        },
        {
          id: "7",
          userId: "user7",
          userName: "Robert Taylor",
          userEmail: "robert.taylor@company.com",
          sessionId: "session2",
          sessionName: "PM Fundamentals - Q1 2024",
          courseName: "Project Management Fundamentals",
          instructor: "Michael Chen",
          enrollmentDate: "2024-02-12",
          completionDate: "2024-02-17",
          status: "failed",
          progressPercentage: 80,
          finalScore: 55,
          certificationEarned: false,
          feedback: "Need to retake the final assessment.",
        },
      ]
      setEnrollments(mockEnrollments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enrollments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterEnrollments = () => {
    let filtered = enrollments

    if (searchTerm) {
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.sessionName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((enrollment) => enrollment.status === statusFilter)
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((enrollment) => enrollment.courseName === courseFilter)
    }

    setFilteredEnrollments(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      enrolled: { color: "bg-blue-100 text-blue-800", label: "Enrolled", icon: BookOpen },
      in_progress: { color: "bg-yellow-100 text-yellow-800", label: "In Progress", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", label: "Completed", icon: CheckCircle },
      dropped: { color: "bg-gray-100 text-gray-800", label: "Dropped", icon: XCircle },
      failed: { color: "bg-red-100 text-red-800", label: "Failed", icon: AlertCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getUniqueCourses = () => {
    return Array.from(new Set(enrollments.map((enrollment) => enrollment.courseName)))
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === "completed") return "bg-green-500"
    if (status === "failed" || status === "dropped") return "bg-red-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-gray-300"
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Enrollments</h1>
          <p className="text-gray-600">Track learner progress and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter((e) => e.status === "in_progress" || e.status === "enrolled").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.length > 0
                ? Math.round((enrollments.filter((e) => e.status === "completed").length / enrollments.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.filter((e) => e.certificationEarned).length}</div>
            <p className="text-xs text-muted-foreground">Certificates earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {getUniqueCourses().map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {getUserInitials(enrollment.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{enrollment.userName}</div>
                          <div className="text-sm text-gray-500">{enrollment.userEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enrollment.courseName}</div>
                        <div className="text-sm text-gray-500">by {enrollment.instructor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{enrollment.sessionName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(enrollment.status)}
                        {enrollment.certificationEarned && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Award className="h-3 w-3 mr-1" />
                            Certified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{enrollment.progressPercentage}%</span>
                        </div>
                        <Progress value={enrollment.progressPercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {enrollment.finalScore ? (
                        <div
                          className={`font-medium ${
                            enrollment.finalScore >= 80
                              ? "text-green-600"
                              : enrollment.finalScore >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {enrollment.finalScore}%
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</div>
                      {enrollment.completionDate && (
                        <div className="text-xs text-gray-500">
                          Completed: {new Date(enrollment.completionDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Enrollment
                          </DropdownMenuItem>
                          {enrollment.feedback && (
                            <DropdownMenuItem>
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Feedback
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredEnrollments.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No enrollments found matching your criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
