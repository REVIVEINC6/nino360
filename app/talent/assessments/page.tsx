"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Eye, Play, CheckCircle, Clock, Star, FileText } from "lucide-react"

const mockAssessments = [
  {
    id: "assess-001",
    candidateName: "Sarah Johnson",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "Senior Software Engineer",
    assessmentType: "Technical",
    status: "Completed",
    score: 85,
    completedDate: "2024-01-20",
    duration: 120,
    skills: ["React", "System Design", "Algorithms"],
  },
  {
    id: "assess-002",
    candidateName: "Michael Chen",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "Product Manager",
    assessmentType: "Case Study",
    status: "In Progress",
    score: 0,
    completedDate: null,
    duration: 90,
    skills: ["Product Strategy", "Analytics", "Problem Solving"],
  },
]

export default function AssessmentCenter() {
  const [assessments] = useState(mockAssessments)
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Center</h1>
          <p className="text-gray-600">Evaluate candidate skills and competencies</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">82%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessments */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={assessment.candidateAvatar || "/placeholder.svg"}
                      alt={assessment.candidateName}
                    />
                    <AvatarFallback>
                      {assessment.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{assessment.candidateName}</CardTitle>
                    <p className="text-sm text-gray-600">{assessment.jobTitle}</p>
                    <p className="text-xs text-gray-500">{assessment.assessmentType}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.status === "Completed" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-sm font-bold text-green-600">{assessment.score}%</span>
                  </div>
                  <Progress value={assessment.score} className="h-2" />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Skills Assessed</p>
                <div className="flex flex-wrap gap-1">
                  {assessment.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration: {assessment.duration} min</span>
                {assessment.completedDate && (
                  <span className="text-gray-500">
                    Completed: {new Date(assessment.completedDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  View Results
                </Button>
                {assessment.status === "In Progress" && (
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
