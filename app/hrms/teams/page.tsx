"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Users, Search, Plus, User, Target, TrendingUp, Calendar, Building2, Mail, Edit, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamMember {
  id: string
  name: string
  position: string
  email: string
  phone: string
  avatar?: string
}

interface Team {
  id: string
  name: string
  department: string
  manager: TeamMember
  members: TeamMember[]
  description: string
  projects: number
  performance: number
  budget: number
  established: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTeams: Team[] = [
        {
          id: "1",
          name: "Frontend Development",
          department: "Engineering",
          manager: {
            id: "1",
            name: "Sarah Johnson",
            position: "Senior Frontend Lead",
            email: "sarah.johnson@company.com",
            phone: "+1 (555) 123-4567",
          },
          members: [
            {
              id: "2",
              name: "Mike Chen",
              position: "Frontend Developer",
              email: "mike.chen@company.com",
              phone: "+1 (555) 234-5678",
            },
            {
              id: "3",
              name: "Emily Rodriguez",
              position: "UI/UX Designer",
              email: "emily.rodriguez@company.com",
              phone: "+1 (555) 345-6789",
            },
            {
              id: "4",
              name: "David Kim",
              position: "Frontend Developer",
              email: "david.kim@company.com",
              phone: "+1 (555) 456-7890",
            },
          ],
          description: "Responsible for developing and maintaining user-facing applications and interfaces.",
          projects: 8,
          performance: 92,
          budget: 450000,
          established: "2022-01-15",
        },
        {
          id: "2",
          name: "Backend Development",
          department: "Engineering",
          manager: {
            id: "5",
            name: "James Wilson",
            position: "Backend Team Lead",
            email: "james.wilson@company.com",
            phone: "+1 (555) 567-8901",
          },
          members: [
            {
              id: "6",
              name: "Lisa Zhang",
              position: "Senior Backend Developer",
              email: "lisa.zhang@company.com",
              phone: "+1 (555) 678-9012",
            },
            {
              id: "7",
              name: "Robert Taylor",
              position: "DevOps Engineer",
              email: "robert.taylor@company.com",
              phone: "+1 (555) 789-0123",
            },
            {
              id: "8",
              name: "Amanda Davis",
              position: "Backend Developer",
              email: "amanda.davis@company.com",
              phone: "+1 (555) 890-1234",
            },
          ],
          description: "Handles server-side development, APIs, databases, and infrastructure management.",
          projects: 12,
          performance: 88,
          budget: 520000,
          established: "2021-11-20",
        },
        {
          id: "3",
          name: "Product Management",
          department: "Product",
          manager: {
            id: "9",
            name: "Jennifer Brown",
            position: "VP of Product",
            email: "jennifer.brown@company.com",
            phone: "+1 (555) 901-2345",
          },
          members: [
            {
              id: "10",
              name: "Kevin Park",
              position: "Senior Product Manager",
              email: "kevin.park@company.com",
              phone: "+1 (555) 012-3456",
            },
            {
              id: "11",
              name: "Rachel White",
              position: "Product Analyst",
              email: "rachel.white@company.com",
              phone: "+1 (555) 123-4567",
            },
          ],
          description: "Defines product strategy, roadmap, and coordinates cross-functional initiatives.",
          projects: 6,
          performance: 95,
          budget: 380000,
          established: "2022-03-10",
        },
        {
          id: "4",
          name: "Marketing",
          department: "Marketing",
          manager: {
            id: "12",
            name: "Daniel Lee",
            position: "Marketing Director",
            email: "daniel.lee@company.com",
            phone: "+1 (555) 234-5678",
          },
          members: [
            {
              id: "13",
              name: "Sophie Martinez",
              position: "Content Marketing Specialist",
              email: "sophie.martinez@company.com",
              phone: "+1 (555) 345-6789",
            },
            {
              id: "14",
              name: "Alex Thompson",
              position: "Digital Marketing Manager",
              email: "alex.thompson@company.com",
              phone: "+1 (555) 456-7890",
            },
            {
              id: "15",
              name: "Maria Garcia",
              position: "Social Media Manager",
              email: "maria.garcia@company.com",
              phone: "+1 (555) 567-8901",
            },
          ],
          description: "Drives brand awareness, lead generation, and customer acquisition strategies.",
          projects: 10,
          performance: 87,
          budget: 320000,
          established: "2021-08-05",
        },
        {
          id: "5",
          name: "Data Science",
          department: "Analytics",
          manager: {
            id: "16",
            name: "Dr. Patricia Miller",
            position: "Head of Data Science",
            email: "patricia.miller@company.com",
            phone: "+1 (555) 678-9012",
          },
          members: [
            {
              id: "17",
              name: "Thomas Anderson",
              position: "Senior Data Scientist",
              email: "thomas.anderson@company.com",
              phone: "+1 (555) 789-0123",
            },
            {
              id: "18",
              name: "Jessica Wong",
              position: "Machine Learning Engineer",
              email: "jessica.wong@company.com",
              phone: "+1 (555) 890-1234",
            },
          ],
          description: "Analyzes data to derive insights and builds machine learning models for business optimization.",
          projects: 5,
          performance: 94,
          budget: 420000,
          established: "2022-06-01",
        },
      ]
      setTeams(mockTeams)
      setFilteredTeams(mockTeams)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.manager.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTeams(filtered)
  }, [searchTerm, teams])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600"
    if (performance >= 80) return "text-blue-600"
    if (performance >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const totalMembers = teams.reduce((sum, team) => sum + team.members.length + 1, 0) // +1 for manager
  const avgPerformance = teams.length > 0 ? teams.reduce((sum, team) => sum + team.performance, 0) / teams.length : 0
  const totalBudget = teams.reduce((sum, team) => sum + team.budget, 0)
  const totalProjects = teams.reduce((sum, team) => sum + team.projects, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage teams and departments across your organization</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage teams and departments across your organization</p>
        </div>
        <Button onClick={() => router.push("/hrms/teams/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Including managers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Team performance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search teams, departments, or managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4" />
                    {team.department}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/hrms/teams/${team.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/hrms/teams/${team.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{team.description}</p>

              {/* Team Manager */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{team.manager.name}</p>
                  <p className="text-xs text-muted-foreground">{team.manager.position}</p>
                </div>
                <div className="ml-auto">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{team.members.length + 1}</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{team.projects}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getPerformanceColor(team.performance)}`}>
                    {team.performance}%
                  </div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
              </div>

              {/* Performance Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Team Performance</span>
                  <span>{team.performance}%</span>
                </div>
                <Progress value={team.performance} className="h-2" />
              </div>

              {/* Team Members Preview */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Team Members</span>
                  <span className="text-xs text-muted-foreground">{team.members.length} members</span>
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member, index) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                      title={member.name}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  ))}
                  {team.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center pt-2 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {formatDate(team.established)}</span>
                </div>
                <div className="font-medium">{formatCurrency(team.budget)} budget</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or create a new team.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
