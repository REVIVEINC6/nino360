"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Star,
  TrendingUp,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  DollarSign,
} from "lucide-react"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  location: string
  hireDate: string
  status: "active" | "inactive" | "on-leave"
  salary: number
  performanceRating: number
  avatar?: string
  manager: string
  skills: string[]
  projects: number
}

const sampleEmployees: Employee[] = [
  {
    id: "emp-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    hireDate: "2022-03-15",
    status: "active",
    salary: 125000,
    performanceRating: 4.8,
    manager: "John Smith",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    projects: 3,
  },
  {
    id: "emp-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    department: "Product",
    location: "New York, NY",
    hireDate: "2021-08-22",
    status: "active",
    salary: 135000,
    performanceRating: 4.6,
    manager: "Lisa Davis",
    skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
    projects: 5,
  },
  {
    id: "emp-003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    department: "Design",
    location: "Austin, TX",
    hireDate: "2023-01-10",
    status: "active",
    salary: 95000,
    performanceRating: 4.9,
    manager: "David Wilson",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    projects: 2,
  },
  {
    id: "emp-004",
    firstName: "James",
    lastName: "Thompson",
    email: "james.thompson@company.com",
    phone: "+1 (555) 456-7890",
    position: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    hireDate: "2022-11-05",
    status: "on-leave",
    salary: 75000,
    performanceRating: 4.2,
    manager: "Jennifer Brown",
    skills: ["Digital Marketing", "SEO", "Content Creation", "Analytics"],
    projects: 1,
  },
  {
    id: "emp-005",
    firstName: "Amanda",
    lastName: "Davis",
    email: "amanda.davis@company.com",
    phone: "+1 (555) 567-8901",
    position: "Data Scientist",
    department: "Analytics",
    location: "Seattle, WA",
    hireDate: "2021-06-18",
    status: "active",
    salary: 140000,
    performanceRating: 4.7,
    manager: "Robert Kim",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    projects: 4,
  },
  {
    id: "emp-006",
    firstName: "Kevin",
    lastName: "Park",
    email: "kevin.park@company.com",
    phone: "+1 (555) 678-9012",
    position: "DevOps Engineer",
    department: "Engineering",
    location: "Denver, CO",
    hireDate: "2020-09-12",
    status: "active",
    salary: 115000,
    performanceRating: 4.5,
    manager: "John Smith",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    projects: 2,
  },
  {
    id: "emp-007",
    firstName: "Rachel",
    lastName: "White",
    email: "rachel.white@company.com",
    phone: "+1 (555) 789-0123",
    position: "HR Business Partner",
    department: "Human Resources",
    location: "Boston, MA",
    hireDate: "2022-02-28",
    status: "active",
    salary: 85000,
    performanceRating: 4.4,
    manager: "Patricia Miller",
    skills: ["Employee Relations", "Recruitment", "Performance Management", "HRIS"],
    projects: 3,
  },
  {
    id: "emp-008",
    firstName: "Daniel",
    lastName: "Lee",
    email: "daniel.lee@company.com",
    phone: "+1 (555) 890-1234",
    position: "Sales Manager",
    department: "Sales",
    location: "Miami, FL",
    hireDate: "2021-04-14",
    status: "active",
    salary: 110000,
    performanceRating: 4.8,
    manager: "Mark Johnson",
    skills: ["Sales Strategy", "CRM", "Negotiation", "Team Leadership"],
    projects: 6,
  },
]

const departments = ["All", "Engineering", "Product", "Design", "Marketing", "Analytics", "Human Resources", "Sales"]
const locations = [
  "All",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Chicago, IL",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
  "Miami, FL",
]
const statuses = ["All", "active", "inactive", "on-leave"]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter((employee) => {
      const matchesSearch =
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment
      const matchesLocation = selectedLocation === "All" || employee.location === selectedLocation
      const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus

      return matchesSearch && matchesDepartment && matchesLocation && matchesStatus
    })
  }, [searchTerm, selectedDepartment, selectedLocation, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const handleExportEmployees = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Position",
        "Department",
        "Location",
        "Status",
        "Hire Date",
        "Salary",
        "Performance Rating",
      ].join(","),
      ...filteredEmployees.map((emp) =>
        [
          `${emp.firstName} ${emp.lastName}`,
          emp.email,
          emp.position,
          emp.department,
          emp.location,
          emp.status,
          emp.hireDate,
          emp.salary,
          emp.performanceRating,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employees.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const departmentStats = useMemo(() => {
    const stats = departments.slice(1).map((dept) => {
      const deptEmployees = sampleEmployees.filter((emp) => emp.department === dept)
      return {
        name: dept,
        count: deptEmployees.length,
        avgRating: deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length || 0,
        avgSalary: deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / deptEmployees.length || 0,
      }
    })
    return stats.sort((a, b) => b.count - a.count)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground">Manage and view all employees across your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportEmployees}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Enter the employee details to add them to your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" placeholder="Enter job position" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.slice(1).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" type="number" placeholder="Enter salary" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddEmployeeOpen(false)}>Add Employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleEmployees.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleEmployees.filter((emp) => emp.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (sampleEmployees.filter((emp) => emp.status === "active").length / sampleEmployees.length) * 100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(sampleEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / sampleEmployees.length).toFixed(
                1,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5.0 rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(sampleEmployees.reduce((sum, emp) => sum + emp.salary, 0) / sampleEmployees.length / 1000)}K
            </div>
            <p className="text-xs text-muted-foreground">Annual compensation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Employee Directory</TabsTrigger>
          <TabsTrigger value="departments">Department Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <CardDescription>{employee.position}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Employee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusColor(employee.status)}>
                      {employee.status.replace("-", " ")}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className={`h-4 w-4 ${getPerformanceColor(employee.performanceRating)}`} />
                      <span className={`text-sm font-medium ${getPerformanceColor(employee.performanceRating)}`}>
                        {employee.performanceRating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{employee.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Hired {new Date(employee.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Salary: </span>
                      <span className="font-medium">${employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Projects: </span>
                      <span className="font-medium">{employee.projects}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{employee.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find employees.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription>{dept.count} employees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{dept.avgRating.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Avg Performance</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">${(dept.avgSalary / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-muted-foreground">Avg Salary</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Size</span>
                      <span>{dept.count} people</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(dept.count / sampleEmployees.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Growth Trend</CardTitle>
                <CardDescription>Monthly hiring and departure trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "Jan 2024", hired: 3, departed: 1, net: 2 },
                    { month: "Feb 2024", hired: 2, departed: 0, net: 2 },
                    { month: "Mar 2024", hired: 4, departed: 2, net: 2 },
                    { month: "Apr 2024", hired: 1, departed: 1, net: 0 },
                    { month: "May 2024", hired: 3, departed: 0, net: 3 },
                  ].map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{data.month}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.hired} hired, {data.departed} departed
                        </p>
                      </div>
                      <div
                        className={`text-lg font-bold ${data.net > 0 ? "text-green-600" : data.net < 0 ? "text-red-600" : "text-gray-600"}`}
                      >
                        {data.net > 0 ? "+" : ""}
                        {data.net}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Employee performance rating breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      range: "4.5 - 5.0",
                      count: sampleEmployees.filter((e) => e.performanceRating >= 4.5).length,
                      color: "bg-green-500",
                    },
                    {
                      range: "4.0 - 4.4",
                      count: sampleEmployees.filter((e) => e.performanceRating >= 4.0 && e.performanceRating < 4.5)
                        .length,
                      color: "bg-blue-500",
                    },
                    {
                      range: "3.5 - 3.9",
                      count: sampleEmployees.filter((e) => e.performanceRating >= 3.5 && e.performanceRating < 4.0)
                        .length,
                      color: "bg-yellow-500",
                    },
                    {
                      range: "3.0 - 3.4",
                      count: sampleEmployees.filter((e) => e.performanceRating >= 3.0 && e.performanceRating < 3.5)
                        .length,
                      color: "bg-red-500",
                    },
                  ].map((data) => (
                    <div key={data.range} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{data.range}</span>
                        <span>{data.count} employees</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${data.color} h-2 rounded-full`}
                          style={{ width: `${(data.count / sampleEmployees.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
