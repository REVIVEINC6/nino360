"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  MoreHorizontal,
  Grid,
  List,
  Download,
  Upload,
  UserPlus,
  Eye,
  Edit,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  location: string
  avatar?: string
  status: "active" | "inactive" | "on-leave" | "terminated"
  startDate: string
  manager: string
  skills: string[]
  performance: number
  lastActive: string
  salary?: number
  employeeId: string
}

// Sample employee data
const sampleEmployees: Employee[] = [
  {
    id: "emp-001",
    employeeId: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    status: "active",
    startDate: "2022-03-15",
    manager: "John Smith",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    performance: 92,
    lastActive: "2024-01-15T10:30:00Z",
    salary: 125000,
  },
  {
    id: "emp-002",
    employeeId: "EMP002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    department: "Product",
    location: "New York, NY",
    status: "active",
    startDate: "2021-08-20",
    manager: "Lisa Davis",
    skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
    performance: 88,
    lastActive: "2024-01-15T09:15:00Z",
    salary: 135000,
  },
  {
    id: "emp-003",
    employeeId: "EMP003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    department: "Design",
    location: "Austin, TX",
    status: "on-leave",
    startDate: "2023-01-10",
    manager: "David Wilson",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    performance: 95,
    lastActive: "2024-01-10T16:45:00Z",
    salary: 95000,
  },
  {
    id: "emp-004",
    employeeId: "EMP004",
    name: "James Thompson",
    email: "james.thompson@company.com",
    phone: "+1 (555) 456-7890",
    position: "DevOps Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    status: "active",
    startDate: "2020-11-05",
    manager: "John Smith",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    performance: 90,
    lastActive: "2024-01-15T11:20:00Z",
    salary: 115000,
  },
  {
    id: "emp-005",
    employeeId: "EMP005",
    name: "Anna Kowalski",
    email: "anna.kowalski@company.com",
    phone: "+1 (555) 567-8901",
    position: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    status: "active",
    startDate: "2023-06-12",
    manager: "Robert Brown",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    performance: 87,
    lastActive: "2024-01-15T08:30:00Z",
    salary: 75000,
  },
  {
    id: "emp-006",
    employeeId: "EMP006",
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+1 (555) 678-9012",
    position: "Data Scientist",
    department: "Analytics",
    location: "Boston, MA",
    status: "inactive",
    startDate: "2022-09-18",
    manager: "Jennifer Lee",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    performance: 93,
    lastActive: "2024-01-12T14:15:00Z",
    salary: 130000,
  },
]

export default function EmployeeDirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(sampleEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("name")
  const [loading, setLoading] = useState(false)

  // Get unique departments and statuses for filters
  const departments = Array.from(new Set(employees.map((emp) => emp.department)))
  const statuses = Array.from(new Set(employees.map((emp) => emp.status)))

  // Filter and search employees
  useEffect(() => {
    let filtered = employees

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((emp) => emp.department === selectedDepartment)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((emp) => emp.status === selectedStatus)
    }

    // Sort employees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "department":
          return a.department.localeCompare(b.department)
        case "position":
          return a.position.localeCompare(b.position)
        case "startDate":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "performance":
          return b.performance - a.performance
        default:
          return 0
      }
    })

    setFilteredEmployees(filtered)
  }, [employees, searchQuery, selectedDepartment, selectedStatus, sortBy])

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

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600"
    if (performance >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const handleExportEmployees = () => {
    // Simulate export functionality
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // In real implementation, this would generate and download a CSV/Excel file
      alert("Employee directory exported successfully!")
    }, 2000)
  }

  const EmployeeCard = ({ employee }: { employee: Employee }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
                <p className="text-xs text-muted-foreground">ID: {employee.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(employee.status)}
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{employee.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                  {employee.performance}% Performance
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date(employee.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {employee.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {employee.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const EmployeeListItem = ({ employee }: { employee: Employee }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center space-x-4 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium truncate">{employee.name}</h3>
            <span className="text-sm text-muted-foreground">({employee.employeeId})</span>
            {getStatusBadge(employee.status)}
          </div>
          <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Building2 className="h-4 w-4" />
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span className={getPerformanceColor(employee.performance)}>{employee.performance}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground">Manage and browse all company employees</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportEmployees} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export"}
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
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
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((emp) => emp.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((employees.filter((emp) => emp.status === "active").length / employees.length) * 100)}% of
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Across the organization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">+3% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees by name, email, position, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        )}
      </div>

      {/* Employee List/Grid */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {filteredEmployees.map((employee, index) => (
                    <div key={employee.id}>
                      <EmployeeListItem employee={employee} />
                      {index < filteredEmployees.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? "Try adjusting your search criteria or filters"
                : "Get started by adding your first employee"}
            </p>
            {!searchQuery && (
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
