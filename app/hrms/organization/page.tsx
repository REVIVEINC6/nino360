"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Users,
  User,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Department {
  id: string
  name: string
  description: string
  manager: {
    id: string
    name: string
    email: string
  }
  employeeCount: number
  budget: number
  established: string
  location: string
  performance: number
}

interface Office {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  employeeCount: number
  departments: string[]
  established: string
}

interface OrganizationStats {
  totalEmployees: number
  totalDepartments: number
  totalOffices: number
  avgPerformance: number
  totalBudget: number
}

export default function OrganizationPage() {
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [stats, setStats] = useState<OrganizationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "Engineering",
          description: "Software development and technical innovation",
          manager: {
            id: "1",
            name: "John Smith",
            email: "john.smith@company.com",
          },
          employeeCount: 45,
          budget: 2800000,
          established: "2018-01-15",
          location: "New York, NY",
          performance: 92,
        },
        {
          id: "2",
          name: "Sales",
          description: "Revenue generation and customer acquisition",
          manager: {
            id: "2",
            name: "David Kim",
            email: "david.kim@company.com",
          },
          employeeCount: 32,
          budget: 1950000,
          established: "2018-03-20",
          location: "Austin, TX",
          performance: 87,
        },
        {
          id: "3",
          name: "Marketing",
          description: "Brand management and digital marketing",
          manager: {
            id: "3",
            name: "Lisa Wong",
            email: "lisa.wong@company.com",
          },
          employeeCount: 28,
          budget: 1200000,
          established: "2018-06-10",
          location: "San Francisco, CA",
          performance: 95,
        },
        {
          id: "4",
          name: "Human Resources",
          description: "Employee relations and organizational development",
          manager: {
            id: "4",
            name: "Jennifer Davis",
            email: "jennifer.davis@company.com",
          },
          employeeCount: 12,
          budget: 850000,
          established: "2018-02-01",
          location: "Chicago, IL",
          performance: 89,
        },
        {
          id: "5",
          name: "Finance",
          description: "Financial planning and accounting operations",
          manager: {
            id: "5",
            name: "Robert Johnson",
            email: "robert.johnson@company.com",
          },
          employeeCount: 18,
          budget: 1100000,
          established: "2018-01-20",
          location: "New York, NY",
          performance: 91,
        },
        {
          id: "6",
          name: "Operations",
          description: "Business operations and process optimization",
          manager: {
            id: "6",
            name: "Amanda Wilson",
            email: "amanda.wilson@company.com",
          },
          employeeCount: 22,
          budget: 980000,
          established: "2019-04-15",
          location: "Denver, CO",
          performance: 88,
        },
      ]

      const mockOffices: Office[] = [
        {
          id: "1",
          name: "New York Headquarters",
          address: "123 Business Ave, Suite 100",
          city: "New York",
          state: "NY",
          country: "USA",
          phone: "+1 (212) 555-0100",
          email: "ny.office@company.com",
          employeeCount: 85,
          departments: ["Engineering", "Finance", "Executive"],
          established: "2018-01-01",
        },
        {
          id: "2",
          name: "San Francisco Office",
          address: "456 Tech Street, Floor 5",
          city: "San Francisco",
          state: "CA",
          country: "USA",
          phone: "+1 (415) 555-0200",
          email: "sf.office@company.com",
          employeeCount: 62,
          departments: ["Engineering", "Marketing", "Design"],
          established: "2019-03-15",
        },
        {
          id: "3",
          name: "Austin Office",
          address: "789 Innovation Blvd",
          city: "Austin",
          state: "TX",
          country: "USA",
          phone: "+1 (512) 555-0300",
          email: "austin.office@company.com",
          employeeCount: 48,
          departments: ["Sales", "Customer Success"],
          established: "2020-06-01",
        },
        {
          id: "4",
          name: "Chicago Office",
          address: "321 Corporate Plaza",
          city: "Chicago",
          state: "IL",
          country: "USA",
          phone: "+1 (312) 555-0400",
          email: "chicago.office@company.com",
          employeeCount: 35,
          departments: ["HR", "Operations"],
          established: "2021-01-10",
        },
      ]

      const mockStats: OrganizationStats = {
        totalEmployees: mockDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0),
        totalDepartments: mockDepartments.length,
        totalOffices: mockOffices.length,
        avgPerformance: Math.round(
          mockDepartments.reduce((sum, dept) => sum + dept.performance, 0) / mockDepartments.length,
        ),
        totalBudget: mockDepartments.reduce((sum, dept) => sum + dept.budget, 0),
      }

      setDepartments(mockDepartments)
      setOffices(mockOffices)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateDepartment = () => {
    console.log("Create new department")
  }

  const handleEditDepartment = (deptId: string) => {
    console.log("Edit department:", deptId)
  }

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== deptId))
  }

  const handleCreateOffice = () => {
    console.log("Create new office")
  }

  const handleEditOffice = (officeId: string) => {
    console.log("Edit office:", officeId)
  }

  const handleDeleteOffice = (officeId: string) => {
    setOffices((prev) => prev.filter((office) => office.id !== officeId))
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600"
    if (performance >= 80) return "text-yellow-600"
    return "text-red-600"
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
          <h1 className="text-3xl font-bold tracking-tight">Organization Structure</h1>
          <p className="text-muted-foreground">Manage departments, offices, and organizational hierarchy</p>
        </div>
      </div>

      {/* Organization Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offices</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOffices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgPerformance}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.totalBudget / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="hierarchy">Org Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Departments</h2>
            <Button onClick={handleCreateDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {departments.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {department.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{department.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditDepartment(department.id)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteDepartment(department.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Department Manager */}
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{department.manager.name}</p>
                      <p className="text-xs text-muted-foreground">Department Manager</p>
                      <p className="text-xs text-muted-foreground">{department.manager.email}</p>
                    </div>
                  </div>

                  {/* Department Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{department.employeeCount}</p>
                      <p className="text-xs text-muted-foreground">Employees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">${(department.budget / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getPerformanceColor(department.performance)}`}>
                        {department.performance}%
                      </p>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Est. {new Date(department.established).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {department.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Office Locations</h2>
            <Button onClick={handleCreateOffice}>
              <Plus className="mr-2 h-4 w-4" />
              Add Office
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {offices.map((office) => (
              <Card key={office.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {office.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{office.address}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditOffice(office.id)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteOffice(office.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Office Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {office.city}, {office.state}, {office.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{office.email}</span>
                    </div>
                  </div>

                  {/* Office Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{office.employeeCount}</p>
                      <p className="text-xs text-muted-foreground">Employees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{office.departments.length}</p>
                      <p className="text-xs text-muted-foreground">Departments</p>
                    </div>
                  </div>

                  {/* Departments */}
                  <div>
                    <p className="text-sm font-medium mb-2">Departments</p>
                    <div className="flex flex-wrap gap-1">
                      {office.departments.map((dept, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Established Date */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    Established {new Date(office.established).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organizational Hierarchy</CardTitle>
              <CardDescription>Visual representation of the company structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* CEO Level */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Robert Johnson</p>
                        <p className="text-sm text-muted-foreground">Chief Executive Officer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Level */}
                <div className="grid gap-4 md:grid-cols-3">
                  {departments.slice(0, 6).map((dept) => (
                    <div key={dept.id} className="text-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 justify-center">
                          <Building2 className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">{dept.name}</p>
                            <p className="text-xs text-muted-foreground">{dept.manager.name}</p>
                            <p className="text-xs text-muted-foreground">{dept.employeeCount} employees</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
