"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Star,
  Award,
  Target,
  TrendingUp,
  Clock,
  FileText,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  MoreHorizontal,
} from "lucide-react"

interface EmployeeProfile {
  id: string
  employeeId: string
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  workInfo: {
    position: string
    department: string
    manager: string
    startDate: string
    employmentType: string
    workLocation: string
    salary: number
    status: "active" | "inactive" | "on-leave" | "terminated"
  }
  skills: {
    name: string
    level: number
    category: string
  }[]
  performance: {
    currentRating: number
    goals: {
      title: string
      progress: number
      dueDate: string
      status: "on-track" | "at-risk" | "completed"
    }[]
    reviews: {
      date: string
      rating: number
      reviewer: string
      comments: string
    }[]
  }
  benefits: {
    healthInsurance: boolean
    dentalInsurance: boolean
    visionInsurance: boolean
    retirement401k: boolean
    paidTimeOff: number
    sickLeave: number
  }
  documents: {
    name: string
    type: string
    uploadDate: string
    status: "approved" | "pending" | "rejected"
  }[]
  avatar?: string
}

// Sample employee profile data
const sampleProfile: EmployeeProfile = {
  id: "emp-001",
  employeeId: "EMP001",
  personalInfo: {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105",
    dateOfBirth: "1990-05-15",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
    },
  },
  workInfo: {
    position: "Senior Software Engineer",
    department: "Engineering",
    manager: "John Smith",
    startDate: "2022-03-15",
    employmentType: "Full-time",
    workLocation: "San Francisco, CA",
    salary: 125000,
    status: "active",
  },
  skills: [
    { name: "React", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Programming" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "AWS", level: 80, category: "Cloud" },
    { name: "Leadership", level: 75, category: "Soft Skills" },
    { name: "Project Management", level: 70, category: "Management" },
  ],
  performance: {
    currentRating: 92,
    goals: [
      {
        title: "Complete React Migration Project",
        progress: 85,
        dueDate: "2024-03-31",
        status: "on-track",
      },
      {
        title: "Mentor 2 Junior Developers",
        progress: 60,
        dueDate: "2024-06-30",
        status: "on-track",
      },
      {
        title: "Obtain AWS Certification",
        progress: 30,
        dueDate: "2024-04-15",
        status: "at-risk",
      },
    ],
    reviews: [
      {
        date: "2023-12-15",
        rating: 92,
        reviewer: "John Smith",
        comments: "Excellent performance this quarter. Strong technical leadership and mentoring skills.",
      },
      {
        date: "2023-09-15",
        rating: 88,
        reviewer: "John Smith",
        comments: "Good progress on key projects. Continue developing leadership skills.",
      },
    ],
  },
  benefits: {
    healthInsurance: true,
    dentalInsurance: true,
    visionInsurance: false,
    retirement401k: true,
    paidTimeOff: 20,
    sickLeave: 10,
  },
  documents: [
    {
      name: "Employment Contract",
      type: "Contract",
      uploadDate: "2022-03-10",
      status: "approved",
    },
    {
      name: "I-9 Form",
      type: "Compliance",
      uploadDate: "2022-03-12",
      status: "approved",
    },
    {
      name: "Performance Review Q4 2023",
      type: "Review",
      uploadDate: "2023-12-20",
      status: "approved",
    },
    {
      name: "Training Certificate - AWS",
      type: "Training",
      uploadDate: "2024-01-10",
      status: "pending",
    },
  ],
}

export default function EmployeeProfilesPage() {
  const [profile, setProfile] = useState<EmployeeProfile>(sampleProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Inactive" },
      "on-leave": { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "On Leave" },
      terminated: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Terminated" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getGoalStatusBadge = (status: string) => {
    const statusConfig = {
      "on-track": { color: "bg-green-100 text-green-800", label: "On Track" },
      "at-risk": { color: "bg-red-100 text-red-800", label: "At Risk" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["on-track"]

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getDocumentStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pending" },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 75) return "bg-blue-500"
    if (level >= 60) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const handleSaveProfile = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      // In real implementation, this would save to backend
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Profile</h1>
          <p className="text-muted-foreground">Detailed employee information and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/nino360-primary.png"} alt={profile.personalInfo.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                {profile.personalInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{profile.personalInfo.name}</h2>
                  <p className="text-lg text-muted-foreground">{profile.workInfo.position}</p>
                  <p className="text-sm text-muted-foreground">Employee ID: {profile.employeeId}</p>
                </div>
                {getStatusBadge(profile.workInfo.status)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.workInfo.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.workInfo.workLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Started {new Date(profile.workInfo.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reports to {profile.workInfo.manager}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Rating</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.performance.currentRating}%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.performance.goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {profile.performance.goals.filter((g) => g.status === "completed").length} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Years of Service</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(
                    (new Date().getTime() - new Date(profile.workInfo.startDate).getTime()) /
                      (1000 * 60 * 60 * 24 * 365),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Years</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.skills.length}</div>
                <p className="text-xs text-muted-foreground">
                  Avg level:{" "}
                  {Math.round(profile.skills.reduce((acc, skill) => acc + skill.level, 0) / profile.skills.length)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Performance review completed</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Training certificate uploaded</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Goal progress updated</p>
                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={profile.personalInfo.name} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.personalInfo.email} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={profile.personalInfo.phone} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input value={profile.personalInfo.address} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input type="date" value={profile.personalInfo.dateOfBirth} disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Contact Name</label>
                  <Input value={profile.personalInfo.emergencyContact.name} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Relationship</label>
                  <Input value={profile.personalInfo.emergencyContact.relationship} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input value={profile.personalInfo.emergencyContact.phone} disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Position</label>
                  <Input value={profile.workInfo.position} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input value={profile.workInfo.department} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Manager</label>
                  <Input value={profile.workInfo.manager} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Employment Type</label>
                  <Input value={profile.workInfo.employmentType} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Work Location</label>
                  <Input value={profile.workInfo.workLocation} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" value={profile.workInfo.startDate} disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.performance.currentRating}%</div>
                <Progress value={profile.performance.currentRating} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    profile.performance.goals.reduce((acc, goal) => acc + goal.progress, 0) /
                      profile.performance.goals.length,
                  )}
                  %
                </div>
                <Progress
                  value={
                    profile.performance.goals.reduce((acc, goal) => acc + goal.progress, 0) /
                    profile.performance.goals.length
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.performance.reviews.length}</div>
                <p className="text-xs text-muted-foreground">Total reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.performance.goals.map((goal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      {getGoalStatusBadge(goal.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.performance.reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Review - {new Date(review.date).toLocaleDateString()}</h4>
                        <p className="text-sm text-muted-foreground">Reviewed by {review.reviewer}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{review.rating}%</div>
                        <Progress value={review.rating} className="w-20" />
                      </div>
                    </div>
                    <p className="text-sm">{review.comments}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Competencies</CardTitle>
              <CardDescription>Employee skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  profile.skills.reduce(
                    (acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = []
                      acc[skill.category].push(skill)
                      return acc
                    },
                    {} as Record<string, typeof profile.skills>,
                  ),
                ).map(([category, skills]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <div className="space-y-3">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getSkillColor(skill.level)}`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Enrollment</CardTitle>
              <CardDescription>Current benefits and enrollment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Insurance Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Health Insurance</span>
                      <Badge
                        className={
                          profile.benefits.healthInsurance ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {profile.benefits.healthInsurance ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dental Insurance</span>
                      <Badge
                        className={
                          profile.benefits.dentalInsurance ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {profile.benefits.dentalInsurance ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vision Insurance</span>
                      <Badge
                        className={
                          profile.benefits.visionInsurance ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {profile.benefits.visionInsurance ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Retirement & Time Off</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>401(k) Plan</span>
                      <Badge
                        className={
                          profile.benefits.retirement401k ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {profile.benefits.retirement401k ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Paid Time Off</span>
                      <span className="font-medium">{profile.benefits.paidTimeOff} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sick Leave</span>
                      <span className="font-medium">{profile.benefits.sickLeave} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Documents</CardTitle>
                  <CardDescription>Manage employee documents and files</CardDescription>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {document.type} • Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentStatusBadge(document.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
