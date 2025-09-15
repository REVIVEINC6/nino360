"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  Users,
  Calendar,
  Plus,
  Edit,
  Eye,
  Play,
  CheckCircle,
} from "lucide-react"

interface TrainingCourse {
  id: string
  title: string
  description: string
  category: string
  type: "online" | "in-person" | "hybrid"
  duration: number // in hours
  instructor: string
  maxParticipants: number
  currentParticipants: number
  startDate: string
  endDate: string
  status: "draft" | "published" | "in-progress" | "completed" | "cancelled"
  required: boolean
  departments: string[]
  materials: {
    name: string
    type: "video" | "document" | "quiz" | "assignment"
    url: string
  }[]
}

interface EmployeeTraining {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  courses: {
    courseId: string
    courseTitle: string
    status: "not-started" | "in-progress" | "completed" | "failed"
    progress: number
    enrollmentDate: string
    completionDate?: string
    score?: number
  }[]
  totalHours: number
  completedHours: number
  certifications: {
    name: string
    issueDate: string
    expiryDate: string
    status: "active" | "expired" | "pending"
  }[]
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCourse[]>([])
  const [employeeTraining, setEmployeeTraining] = useState<EmployeeTraining[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourses: TrainingCourse[] = [
        {
          id: "1",
          title: "Cybersecurity Fundamentals",
          description: "Essential cybersecurity practices for all employees",
          category: "Security",
          type: "online",
          duration: 4,
          instructor: "John Security",
          maxParticipants: 100,
          currentParticipants: 45,
          startDate: "2024-03-01",
          endDate: "2024-03-31",
          status: "in-progress",
          required: true,
          departments: ["All"],
          materials: [
            { name: "Introduction Video", type: "video", url: "/videos/intro.mp4" },
            { name: "Security Guidelines", type: "document", url: "/docs/guidelines.pdf" },
            { name: "Knowledge Check", type: "quiz", url: "/quiz/security-basics" },
          ],
        },
        {
          id: "2",
          title: "Leadership Development Program",
          description: "Advanced leadership skills for managers and senior staff",
          category: "Leadership",
          type: "hybrid",
          duration: 16,
          instructor: "Sarah Leadership",
          maxParticipants: 20,
          currentParticipants: 12,
          startDate: "2024-04-01",
          endDate: "2024-05-15",
          status: "published",
          required: false,
          departments: ["Management"],
          materials: [
            { name: "Leadership Principles", type: "document", url: "/docs/leadership.pdf" },
            { name: "Case Studies", type: "assignment", url: "/assignments/case-studies" },
            { name: "Final Assessment", type: "quiz", url: "/quiz/leadership-final" },
          ],
        },
        {
          id: "3",
          title: "React Development Bootcamp",
          description: "Comprehensive React.js training for developers",
          category: "Technical",
          type: "online",
          duration: 40,
          instructor: "Mike Developer",
          maxParticipants: 30,
          currentParticipants: 18,
          startDate: "2024-03-15",
          endDate: "2024-04-30",
          status: "in-progress",
          required: false,
          departments: ["Engineering"],
          materials: [
            { name: "React Basics", type: "video", url: "/videos/react-basics.mp4" },
            { name: "Hands-on Projects", type: "assignment", url: "/projects/react-todo" },
            { name: "Component Quiz", type: "quiz", url: "/quiz/react-components" },
          ],
        },
        {
          id: "4",
          title: "Sales Techniques Masterclass",
          description: "Advanced sales strategies and customer relationship building",
          category: "Sales",
          type: "in-person",
          duration: 8,
          instructor: "Lisa Sales",
          maxParticipants: 25,
          currentParticipants: 22,
          startDate: "2024-04-10",
          endDate: "2024-04-11",
          status: "published",
          required: true,
          departments: ["Sales"],
          materials: [
            { name: "Sales Playbook", type: "document", url: "/docs/sales-playbook.pdf" },
            { name: "Role Playing Exercise", type: "assignment", url: "/exercises/role-play" },
          ],
        },
      ]

      const mockEmployeeTraining: EmployeeTraining[] = [
        {
          id: "1",
          employeeId: "emp1",
          employeeName: "Sarah Johnson",
          position: "Senior Software Engineer",
          department: "Engineering",
          courses: [
            {
              courseId: "1",
              courseTitle: "Cybersecurity Fundamentals",
              status: "completed",
              progress: 100,
              enrollmentDate: "2024-03-01",
              completionDate: "2024-03-15",
              score: 95,
            },
            {
              courseId: "3",
              courseTitle: "React Development Bootcamp",
              status: "in-progress",
              progress: 65,
              enrollmentDate: "2024-03-15",
            },
          ],
          totalHours: 44,
          completedHours: 4,
          certifications: [
            {
              name: "Cybersecurity Awareness",
              issueDate: "2024-03-15",
              expiryDate: "2025-03-15",
              status: "active",
            },
          ],
        },
        {
          id: "2",
          employeeId: "emp2",
          employeeName: "Michael Chen",
          position: "Marketing Specialist",
          department: "Marketing",
          courses: [
            {
              courseId: "1",
              courseTitle: "Cybersecurity Fundamentals",
              status: "in-progress",
              progress: 75,
              enrollmentDate: "2024-03-01",
            },
            {
              courseId: "2",
              courseTitle: "Leadership Development Program",
              status: "not-started",
              progress: 0,
              enrollmentDate: "2024-04-01",
            },
          ],
          totalHours: 20,
          completedHours: 0,
          certifications: [],
        },
        {
          id: "3",
          employeeId: "emp3",
          employeeName: "Emily Rodriguez",
          position: "Sales Representative",
          department: "Sales",
          courses: [
            {
              courseId: "1",
              courseTitle: "Cybersecurity Fundamentals",
              status: "completed",
              progress: 100,
              enrollmentDate: "2024-03-01",
              completionDate: "2024-03-20",
              score: 88,
            },
            {
              courseId: "4",
              courseTitle: "Sales Techniques Masterclass",
              status: "not-started",
              progress: 0,
              enrollmentDate: "2024-04-10",
            },
          ],
          totalHours: 12,
          completedHours: 4,
          certifications: [
            {
              name: "Cybersecurity Awareness",
              issueDate: "2024-03-20",
              expiryDate: "2025-03-20",
              status: "active",
            },
          ],
        },
      ]

      setCourses(mockCourses)
      setEmployeeTraining(mockEmployeeTraining)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "published":
      case "active":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "not-started":
      case "draft":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Video className="h-4 w-4" />
      case "in-person":
        return <Users className="h-4 w-4" />
      case "hybrid":
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      case "assignment":
        return <Edit className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory !== "all" && course.category !== selectedCategory) {
      return false
    }
    if (selectedType !== "all" && course.type !== selectedType) {
      return false
    }
    if (selectedStatus !== "all" && course.status !== selectedStatus) {
      return false
    }
    return true
  })

  const handleCreateCourse = () => {
    console.log("Create new training course")
  }

  const handleEditCourse = (courseId: string) => {
    console.log("Edit course:", courseId)
  }

  const handleEnrollEmployee = (courseId: string) => {
    console.log("Enroll employee in course:", courseId)
  }

  const handleViewCourse = (courseId: string) => {
    console.log("View course details:", courseId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training & Development</h1>
          <p className="text-muted-foreground">Manage employee training programs and track progress</p>
        </div>
        <Button onClick={handleCreateCourse}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Leadership">Leadership</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Training Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Active training programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + course.currentParticipants, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeTraining.reduce((sum, emp) => sum + emp.completedHours, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Hours completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="employees">Employee Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(course.type)}
                        {course.title}
                        <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                        {course.required && <Badge variant="destructive">Required</Badge>}
                      </CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.currentParticipants}/{course.maxParticipants} enrolled
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(course.startDate).toLocaleDateString()} -{" "}
                          {new Date(course.endDate).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEnrollEmployee(course.id)}>
                        <Plus className="mr-1 h-3 w-3" />
                        Enroll
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditCourse(course.id)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewCourse(course.id)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Course Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Enrollment Progress</span>
                      <span>{Math.round((course.currentParticipants / course.maxParticipants) * 100)}%</span>
                    </div>
                    <Progress value={(course.currentParticipants / course.maxParticipants) * 100} />
                  </div>

                  {/* Course Materials */}
                  <div>
                    <p className="text-sm font-medium mb-2">Course Materials</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {course.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getMaterialIcon(material.type)}
                            <span className="text-sm">{material.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor and Departments */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Instructor: {course.instructor}</span>
                    <span>Departments: {course.departments.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4">
            {employeeTraining.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{employee.employeeName}</CardTitle>
                      <CardDescription>
                        {employee.position} • {employee.department}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {employee.completedHours}/{employee.totalHours} hours completed
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {employee.certifications.length} certifications
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Enroll in Course
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Training Progress</span>
                      <span>{Math.round((employee.completedHours / employee.totalHours) * 100)}%</span>
                    </div>
                    <Progress value={(employee.completedHours / employee.totalHours) * 100} />
                  </div>

                  {/* Course Progress */}
                  <div>
                    <p className="text-sm font-medium mb-2">Course Progress</p>
                    <div className="space-y-2">
                      {employee.courses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{course.courseTitle}</span>
                              <Badge className={getStatusColor(course.status)} variant="secondary">
                                {course.status}
                              </Badge>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{course.progress}% complete</span>
                              {course.score && <span>Score: {course.score}%</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {employee.certifications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Certifications</p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {employee.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="text-sm font-medium">{cert.name}</span>
                              <p className="text-xs text-muted-foreground">
                                Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(cert.status)} variant="secondary">
                              {cert.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Completion by Department</CardTitle>
                <CardDescription>Average completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Engineering</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HR</span>
                    <span className="font-medium">90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Training Categories</CardTitle>
                <CardDescription>Most enrolled course types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Security</span>
                    <span className="font-medium">45 enrollments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technical</span>
                    <span className="font-medium">32 enrollments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Leadership</span>
                    <span className="font-medium">28 enrollments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-medium">22 enrollments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
