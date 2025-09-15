"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Award,
  Users,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Star,
} from "lucide-react"

export function TrainingModule() {
  const [searchTerm, setSearchTerm] = useState("")

  const trainingMetrics = {
    activeCourses: 34,
    enrolledLearners: 287,
    completionRate: 78.5,
    certificatesIssued: 156,
    avgCourseRating: 4.6,
    totalHours: 1247,
  }

  const courseCategories = [
    { name: "Technical Skills", courses: 12, learners: 145, completion: 82 },
    { name: "Soft Skills", courses: 8, learners: 98, completion: 75 },
    { name: "Compliance Training", courses: 6, learners: 287, completion: 95 },
    { name: "Leadership Development", courses: 8, learners: 67, completion: 68 },
  ]

  const popularCourses = [
    {
      id: 1,
      title: "React Development Fundamentals",
      instructor: "Sarah Johnson",
      duration: "8 hours",
      enrolled: 45,
      rating: 4.8,
      progress: 65,
      category: "Technical",
    },
    {
      id: 2,
      title: "Project Management Essentials",
      instructor: "Mike Chen",
      duration: "12 hours",
      enrolled: 38,
      rating: 4.7,
      progress: 42,
      category: "Management",
    },
    {
      id: 3,
      title: "Data Privacy & Security",
      instructor: "Lisa Wang",
      duration: "4 hours",
      enrolled: 156,
      rating: 4.9,
      progress: 89,
      category: "Compliance",
    },
  ]

  const recentCertifications = [
    { id: 1, learner: "John Smith", course: "AWS Cloud Practitioner", date: "2024-01-15", score: 92 },
    { id: 2, learner: "Emma Davis", course: "Agile Methodology", date: "2024-01-14", score: 88 },
    { id: 3, learner: "Alex Rodriguez", course: "Cybersecurity Basics", date: "2024-01-13", score: 95 },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-blue-500"
      case "Management":
        return "bg-purple-500"
      case "Compliance":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trainingMetrics.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Learners</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{trainingMetrics.enrolledLearners}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingMetrics.completionRate}%</div>
            <Progress value={trainingMetrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{trainingMetrics.certificatesIssued}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Course Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingMetrics.avgCourseRating}</div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.floor(trainingMetrics.avgCourseRating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingMetrics.totalHours}</div>
            <p className="text-xs text-muted-foreground">Learning hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses or learners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="learners">Learners</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Course Categories</CardTitle>
                <CardDescription>Training programs by category and completion rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category.courses} courses</Badge>
                        <span className="text-sm text-muted-foreground">{category.learners} learners</span>
                      </div>
                    </div>
                    <Progress value={category.completion} className="h-2" />
                    <div className="text-xs text-muted-foreground">{category.completion}% completion rate</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Courses</CardTitle>
                <CardDescription>Most enrolled and highest-rated courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm">{course.title}</h3>
                          <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                        </div>
                        <Badge className={getCategoryColor(course.category)}>{course.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{course.duration}</span>
                        <span>{course.enrolled} enrolled</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Create and manage training courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Course Library</h3>
                <p className="text-muted-foreground mb-4">Comprehensive course management interface coming soon</p>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learner Management</CardTitle>
              <CardDescription>Track learner progress and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Learner Dashboard</h3>
                <p className="text-muted-foreground mb-4">Advanced learner tracking interface coming soon</p>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  View Learners
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Certifications</CardTitle>
              <CardDescription>Latest certificates issued to learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCertifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{cert.learner}</p>
                      <p className="text-sm text-muted-foreground">{cert.course}</p>
                      <p className="text-xs text-muted-foreground">Completed: {cert.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">{cert.score}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
