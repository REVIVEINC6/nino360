import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Award, Clock, Users, Play } from "lucide-react"

export const metadata: Metadata = {
  title: "Nino360 Academy - Training & Certification",
  description: "Master Nino360 with our comprehensive training courses, video tutorials, and certification programs.",
}

export default function AcademyPage() {
  const stats = [
    { icon: BookOpen, label: "Courses", value: "50+" },
    { icon: Video, label: "Video Lessons", value: "200+" },
    { icon: Users, label: "Students", value: "10K+" },
    { icon: Award, label: "Certifications", value: "15+" },
  ]

  const courses = [
    {
      title: "Nino360 Fundamentals",
      description: "Get started with Nino360 basics and core features",
      level: "Beginner",
      duration: "4 hours",
      lessons: 12,
      students: 2500,
      category: "Getting Started",
      topics: ["Platform Overview", "Navigation", "Basic Setup", "User Management"],
    },
    {
      title: "Advanced Talent Acquisition",
      description: "Master recruitment workflows and ATS features",
      level: "Advanced",
      duration: "6 hours",
      lessons: 18,
      students: 1800,
      category: "ATS",
      topics: ["Sourcing Strategies", "Pipeline Management", "Interview Scheduling", "Offer Management"],
    },
    {
      title: "HRMS Best Practices",
      description: "Learn employee management and HR operations",
      level: "Intermediate",
      duration: "5 hours",
      lessons: 15,
      students: 2100,
      category: "HRMS",
      topics: ["Employee Records", "Time Tracking", "Performance Reviews", "Compliance"],
    },
    {
      title: "CRM & Sales Automation",
      description: "Optimize your sales process with CRM tools",
      level: "Intermediate",
      duration: "5 hours",
      lessons: 16,
      students: 1600,
      category: "CRM",
      topics: ["Lead Management", "Pipeline Automation", "Email Campaigns", "Analytics"],
    },
    {
      title: "Automation & Workflows",
      description: "Build powerful automations to streamline operations",
      level: "Advanced",
      duration: "7 hours",
      lessons: 20,
      students: 1200,
      category: "Automation",
      topics: ["Workflow Builder", "Triggers & Actions", "Webhooks", "API Integration"],
    },
    {
      title: "Analytics & Reporting",
      description: "Create insightful reports and dashboards",
      level: "Intermediate",
      duration: "4 hours",
      lessons: 14,
      students: 1900,
      category: "Analytics",
      topics: ["Report Builder", "Custom Dashboards", "Data Visualization", "Export Options"],
    },
  ]

  const certifications = [
    {
      title: "Nino360 Certified Administrator",
      description: "Demonstrate expertise in platform administration and configuration",
      duration: "2 hours",
      questions: 60,
      passingScore: 80,
    },
    {
      title: "Nino360 Certified Recruiter",
      description: "Prove your mastery of talent acquisition and ATS features",
      duration: "90 minutes",
      questions: 50,
      passingScore: 75,
    },
    {
      title: "Nino360 Certified Developer",
      description: "Validate your skills in API integration and custom development",
      duration: "3 hours",
      questions: 75,
      passingScore: 85,
    },
  ]

  const learningPaths = [
    {
      title: "HR Professional Path",
      courses: 5,
      duration: "20 hours",
      description: "Complete learning path for HR professionals",
    },
    {
      title: "Recruiter Path",
      courses: 4,
      duration: "16 hours",
      description: "Specialized training for talent acquisition teams",
    },
    {
      title: "Administrator Path",
      courses: 6,
      duration: "24 hours",
      description: "Comprehensive training for system administrators",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Nino360 Academy
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Master Nino360 Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive training courses, video tutorials, and certification programs to help you become a Nino360
            expert
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Browse Courses
            </Button>
            <Button size="lg" variant="outline">
              View Certifications
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/50 border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Learning Paths</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Structured learning paths designed for different roles and expertise levels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/50 border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{path.courses} courses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{path.duration}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Learning
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn at your own pace with our comprehensive video courses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/50 border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge
                    className={
                      course.level === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : course.level === "Intermediate"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                    }
                  >
                    {course.level}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Course
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Professional Certifications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Validate your expertise with industry-recognized certifications
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/50 border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{cert.title}</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">{cert.description}</p>
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Exam Duration:</span>
                    <span className="font-medium">{cert.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{cert.questions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Passing Score:</span>
                    <span className="font-medium">{cert.passingScore}%</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Certified
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg mb-6 text-white/90">
              Join thousands of professionals who have mastered Nino360 through our academy
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Browse All Courses
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Download Course Catalog
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
