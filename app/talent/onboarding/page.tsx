"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, CheckCircle, Clock, Users, FileText, User } from "lucide-react"

const mockOnboarding = [
  {
    id: "onb-001",
    employeeName: "Sarah Johnson",
  employeeAvatar: "/nino360-primary.png?height=40&width=40",
    position: "Senior Software Engineer",
    startDate: "2024-02-01",
    status: "In Progress",
    progress: 65,
    completedTasks: 13,
    totalTasks: 20,
    buddy: "John Smith",
  },
  {
    id: "onb-002",
    employeeName: "Emily Rodriguez",
  employeeAvatar: "/nino360-primary.png?height=40&width=40",
    position: "UX Designer",
    startDate: "2024-01-15",
    status: "Completed",
    progress: 100,
    completedTasks: 18,
    totalTasks: 18,
    buddy: "Lisa Wang",
  },
]

export default function TalentOnboarding() {
  const [onboardingList] = useState(mockOnboarding)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Onboarding</h1>
          <p className="text-gray-600">Streamline new hire onboarding process</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Hire
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Hires</p>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {onboardingList.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.employeeAvatar || "/nino360-primary.png"} alt={item.employeeName} />
                    <AvatarFallback>
                      {item.employeeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{item.employeeName}</CardTitle>
                    <p className="text-sm text-gray-600">{item.position}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Tasks: {item.completedTasks}/{item.totalTasks}
                </span>
                <span className="text-gray-500">Start: {new Date(item.startDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-400" />
                <span>Buddy: {item.buddy}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Progress
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
