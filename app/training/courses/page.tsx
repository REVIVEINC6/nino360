"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Play,
  Users,
  Clock,
  Star,
  Award,
  PlusCircle,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  durationHours: number
  format: "online" | "classroom" | "hybrid" | "self_paced"
  instructor: string
  maxParticipants: number
  currentEnrollments: number
  cost: number
  currency: string
  status: "draft" | "active" | "inactive" | "archived"
  rating: number
  totalReviews: number
  certificationAvailable: boolean
  prerequisites: string[]
  learningObjectives: string[]
  createdAt: string
  updatedAt: string
}

interface Session {
  id: string
  courseId: string
  sessionName: string
  startDate: string
  endDate: string
  location: string
  virtualLink?: string
  instructor: string
  maxParticipants: number
  currentParticipants: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
    fetchSessions()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, categoryFilter, levelFilter, statusFilter])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      const mockCourses: Course[] = [
        {
          id: "1",
          title: "Advanced React Development",
          description:
            "Master advanced React concepts including hooks, context, performance optimization, and testing strategies for building scalable applications.",
          category: "Technical",
          level: "advanced",
          durationHours: 40,
          format: "online",
          instructor: "Sarah Johnson",
          maxParticipants: 20,
          currentEnrollments: 15,
          cost: 1200,
          currency: "USD",
          status: "active",
          rating: 4.8,
          totalReviews: 24,
          certificationAvailable: true,
          prerequisites: ["JavaScript ES6+", "Basic React", "HTML/CSS"],
          learningObjectives: [
            "Master React Hooks and Custom Hooks",
            "Implement Context API and State Management",
            "Optimize React Performance",
            "Write Comprehensive Tests",
            "Build Production-Ready Applications",
          ],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-15",
        },
        {
          id: "2",
          title: "Project Management Fundamentals",
          description:
            "Learn essential project management skills including planning, execution, monitoring, and closing projects using industry-standard methodologies.",
          category: "Management",
          level: "beginner",
          durationHours: 24,
          format: "hybrid",
          instructor: "Michael Chen",
          maxParticipants: 15,
          currentEnrollments: 12,
          cost: 800,
          currency: "USD",
          status: "active",
          rating: 4.6,
          totalReviews: 18,
          certificationAvailable: true,
          prerequisites: [],
          learningObjectives: [
            "Understand Project Management Lifecycle",
            "Learn Agile and Waterfall Methodologies",
            "Master Project Planning and Scheduling",
            "Develop Risk Management Skills",
            "Practice Stakeholder Communication",
          ],
          createdAt: "2024-01-05",
          updatedAt: "2024-01-20",
        },
        {
          id: "3",
          title: "Data Science with Python",
          description:
            "Comprehensive introduction to data science using Python, covering data analysis, visualization, machine learning, and statistical modeling.",
          category: "Technical",
          level: "intermediate",
          durationHours: 60,
          format: "online",
          instructor: "Dr. Emily Rodriguez",
          maxParticipants: 25,
          currentEnrollments: 22,
          cost: 1500,
          currency: "USD",
          status: "active",
          rating: 4.9,
          totalReviews: 31,
          certificationAvailable: true,
          prerequisites: ["Python Basics", "Statistics Fundamentals", "Mathematics"],
          learningObjectives: [
            "Master Pandas and NumPy for Data Manipulation",
            "Create Visualizations with Matplotlib and Seaborn",
            "Implement Machine Learning Algorithms",
            "Perform Statistical Analysis",
            "Build End-to-End Data Science Projects",
          ],
          createdAt: "2024-01-10",
          updatedAt: "2024-01-25",
        },
        {
          id: "4",
          title: "Leadership Skills Development",
          description:
            "Develop essential leadership competencies including communication, team building, decision making, and strategic thinking for modern leaders.",
          category: "Soft Skills",
          level: "intermediate",
          durationHours: 16,
          format: "classroom",
          instructor: "David Wilson",
          maxParticipants: 12,
          currentEnrollments: 8,
          cost: 600,
          currency: "USD",
          status: "active",
          rating: 4.4,
          totalReviews: 15,
          certificationAvailable: false,
          prerequisites: ["Management Experience Preferred"],
          learningObjectives: [
            "Develop Effective Communication Skills",
            "Learn Team Building Strategies",
            "Master Decision Making Processes",
            "Build Emotional Intelligence",
            "Create Leadership Action Plans",
          ],
          createdAt: "2024-01-12",
          updatedAt: "2024-01-28",
        },
        {
          id: "5",
          title: "Cybersecurity Essentials",
          description:
            "Learn fundamental cybersecurity concepts, threat identification, risk assessment, and security best practices for organizations.",
          category: "Technical",
          level: "beginner",
          durationHours: 32,
          format: "online",
          instructor: "Alex Thompson",
          maxParticipants: 30,
          currentEnrollments: 18,
          cost: 900,
          currency: "USD",
          status: "active",
          rating: 4.7,
          totalReviews: 22,
          certificationAvailable: true,
          prerequisites: ["Basic IT Knowledge"],
          learningObjectives: [
            "Understand Cybersecurity Fundamentals",
            "Identify Common Security Threats",
            "Implement Security Best Practices",
            "Perform Risk Assessments",
            "Develop Incident Response Plans",
          ],
          createdAt: "2024-01-15",
          updatedAt: "2024-02-01",
        },
        {
          id: "6",
          title: "Digital Marketing Strategy",
          description:
            "Comprehensive course on digital marketing including SEO, social media, content marketing, and analytics for business growth.",
          category: "Marketing",
          level: "intermediate",
          durationHours: 28,
          format: "hybrid",
          instructor: "Lisa Wang",
          maxParticipants: 20,
          currentEnrollments: 5,
          cost: 750,
          currency: "USD",
          status: "draft",
          rating: 0,
          totalReviews: 0,
          certificationAvailable: true,
          prerequisites: ["Basic Marketing Knowledge"],
          learningObjectives: [
            "Develop Digital Marketing Strategies",
            "Master SEO and SEM Techniques",
            "Create Effective Social Media Campaigns",
            "Analyze Marketing Performance",
            "Build Integrated Marketing Plans",
          ],
          createdAt: "2024-02-01",
          updatedAt: "2024-02-01",
        },
      ]
      setCourses(mockCourses)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessions = async () => {
    try {
      // Simulate API call
      const mockSessions: Session[] = [
        {
          id: "1",
          courseId: "1",
          sessionName: "React Advanced - Spring 2024",
          startDate: "2024-03-01T09:00:00",
          endDate: "2024-03-08T17:00:00",
          location: "Online",
          virtualLink: "https://zoom.us/j/123456789",
          instructor: "Sarah Johnson",
          maxParticipants: 20,
          currentParticipants: 15,
          status: "scheduled",
        },
        {
          id: "2",
          courseId: "2",
          sessionName: "PM Fundamentals - Q1 2024",
          startDate: "2024-02-15T10:00:00",
          endDate: "2024-02-17T16:00:00",
          location: "New York Office",
          instructor: "Michael Chen",
          maxParticipants: 15,
          currentParticipants: 12,
          status: "completed",
        },
        {
          id: "3",
          courseId: "3",
          sessionName: "Data Science - Spring Cohort",
          startDate: "2024-04-01T09:00:00",
          endDate: "2024-04-15T17:00:00",
          location: "Online",
          virtualLink: "https://zoom.us/j/987654321",
          instructor: "Dr. Emily Rodriguez",
          maxParticipants: 25,
          currentParticipants: 22,
          status: "scheduled",
        },
      ]
      setSessions(mockSessions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      })
    }
  }

  const filterCourses = () => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter)
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter)
    }

    setFilteredCourses(filtered)
  }

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      beginner: { color: "bg-green-100 text-green-800", label: "Beginner" },
      intermediate: { color: "bg-yellow-100 text-yellow-800", label: "Intermediate" },
      advanced: { color: "bg-red-100 text-red-800", label: "Advanced" },
    }
    const config = levelConfig[level as keyof typeof levelConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-yellow-100 text-yellow-800", label: "Inactive" },
      archived: { color: "bg-red-100 text-red-800", label: "Archived" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getFormatBadge = (format: string) => {
    const formatConfig = {
      online: { color: "bg-blue-100 text-blue-800", label: "Online" },
      classroom: { color: "bg-purple-100 text-purple-800", label: "Classroom" },
      hybrid: { color: "bg-indigo-100 text-indigo-800", label: "Hybrid" },
      self_paced: { color: "bg-teal-100 text-teal-800", label: "Self-Paced" },
    }
    const config = formatConfig[format as keyof typeof formatConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getCourseSessions = (courseId: string) => {
    return sessions.filter((session) => session.courseId === courseId)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Create and manage training courses and sessions</p>
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" placeholder="Enter course title" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter course description" rows={3} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="soft-skills">Soft Skills</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (Hours)</Label>
                  <Input id="duration" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="self_paced">Self-Paced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" placeholder="Enter instructor name" />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input id="maxParticipants" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="prerequisites">Prerequisites (comma-separated)</Label>
                  <Input id="prerequisites" placeholder="JavaScript, HTML, CSS" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
                  <Textarea id="objectives" placeholder="Enter learning objectives" rows={4} />
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Create Course</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter((c) => c.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.currentEnrollments, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.rating > 0).length > 0
                ? (
                    courses.filter((c) => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) /
                    courses.filter((c) => c.rating > 0).length
                  ).toFixed(1)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Course satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(courses.reduce((sum, c) => sum + c.cost * c.currentEnrollments, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
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
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const courseSessions = getCourseSessions(course.id)
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getLevelBadge(course.level)}
                      {getFormatBadge(course.format)}
                      {getStatusBadge(course.status)}
                      {course.certificationAvailable && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Award className="h-3 w-3 mr-1" />
                          Certificate
                        </Badge>
                      )}
                    </div>
                  </div>
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
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Session
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.durationHours}h
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {course.currentEnrollments}/{course.maxParticipants}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatCurrency(course.cost)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {course.category}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {course.rating > 0 ? (
                      <>
                        {renderStars(course.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({course.rating}) {course.totalReviews} reviews
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No reviews yet</span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Instructor:</strong> {course.instructor}
                </div>

                {course.prerequisites.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-gray-700">Prerequisites:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.prerequisites.slice(0, 2).map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                      {course.prerequisites.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.prerequisites.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {courseSessions.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-gray-700">Upcoming Sessions:</strong>
                    <div className="mt-1 space-y-1">
                      {courseSessions.slice(0, 2).map((session) => (
                        <div key={session.id} className="text-xs text-gray-600 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {session.sessionName} - {new Date(session.startDate).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Enroll
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses found matching your criteria</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
