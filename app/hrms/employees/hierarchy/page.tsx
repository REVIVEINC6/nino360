"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Crown,
  User,
  Expand,
  Minimize,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  location: string
  avatar?: string
  managerId?: string
  directReports: string[]
  level: number
}

// Sample organizational data
const sampleEmployees: Employee[] = [
  {
    id: "ceo-001",
    name: "Robert Johnson",
    position: "Chief Executive Officer",
    department: "Executive",
    email: "robert.johnson@company.com",
    phone: "+1 (555) 100-0001",
    location: "San Francisco, CA",
    directReports: ["cto-001", "cfo-001", "cmo-001", "chro-001"],
    level: 0,
  },
  {
    id: "cto-001",
    name: "Sarah Chen",
    position: "Chief Technology Officer",
    department: "Engineering",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 100-0002",
    location: "San Francisco, CA",
    managerId: "ceo-001",
    directReports: ["eng-mgr-001", "eng-mgr-002"],
    level: 1,
  },
  {
    id: "cfo-001",
    name: "Michael Davis",
    position: "Chief Financial Officer",
    department: "Finance",
    email: "michael.davis@company.com",
    phone: "+1 (555) 100-0003",
    location: "New York, NY",
    managerId: "ceo-001",
    directReports: ["fin-mgr-001"],
    level: 1,
  },
  {
    id: "cmo-001",
    name: "Lisa Rodriguez",
    position: "Chief Marketing Officer",
    department: "Marketing",
    email: "lisa.rodriguez@company.com",
    phone: "+1 (555) 100-0004",
    location: "Austin, TX",
    managerId: "ceo-001",
    directReports: ["mkt-mgr-001"],
    level: 1,
  },
  {
    id: "chro-001",
    name: "David Wilson",
    position: "Chief Human Resources Officer",
    department: "Human Resources",
    email: "david.wilson@company.com",
    phone: "+1 (555) 100-0005",
    location: "Chicago, IL",
    managerId: "ceo-001",
    directReports: ["hr-mgr-001"],
    level: 1,
  },
  {
    id: "eng-mgr-001",
    name: "John Smith",
    position: "Engineering Manager",
    department: "Engineering",
    email: "john.smith@company.com",
    phone: "+1 (555) 200-0001",
    location: "San Francisco, CA",
    managerId: "cto-001",
    directReports: ["eng-001", "eng-002", "eng-003"],
    level: 2,
  },
  {
    id: "eng-mgr-002",
    name: "Jennifer Lee",
    position: "Senior Engineering Manager",
    department: "Engineering",
    email: "jennifer.lee@company.com",
    phone: "+1 (555) 200-0002",
    location: "Seattle, WA",
    managerId: "cto-001",
    directReports: ["eng-004", "eng-005"],
    level: 2,
  },
  {
    id: "fin-mgr-001",
    name: "Robert Brown",
    position: "Finance Manager",
    department: "Finance",
    email: "robert.brown@company.com",
    phone: "+1 (555) 200-0003",
    location: "New York, NY",
    managerId: "cfo-001",
    directReports: ["fin-001", "fin-002"],
    level: 2,
  },
  {
    id: "mkt-mgr-001",
    name: "Anna Kowalski",
    position: "Marketing Manager",
    department: "Marketing",
    email: "anna.kowalski@company.com",
    phone: "+1 (555) 200-0004",
    location: "Austin, TX",
    managerId: "cmo-001",
    directReports: ["mkt-001", "mkt-002"],
    level: 2,
  },
  {
    id: "hr-mgr-001",
    name: "Emily Thompson",
    position: "HR Manager",
    department: "Human Resources",
    email: "emily.thompson@company.com",
    phone: "+1 (555) 200-0005",
    location: "Chicago, IL",
    managerId: "chro-001",
    directReports: ["hr-001"],
    level: 2,
  },
  // Individual Contributors
  {
    id: "eng-001",
    name: "Sarah Johnson",
    position: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 300-0001",
    location: "San Francisco, CA",
    managerId: "eng-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "eng-002",
    name: "James Kim",
    position: "Software Engineer",
    department: "Engineering",
    email: "james.kim@company.com",
    phone: "+1 (555) 300-0002",
    location: "San Francisco, CA",
    managerId: "eng-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "eng-003",
    name: "Maria Garcia",
    position: "Frontend Developer",
    department: "Engineering",
    email: "maria.garcia@company.com",
    phone: "+1 (555) 300-0003",
    location: "San Francisco, CA",
    managerId: "eng-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "eng-004",
    name: "Alex Thompson",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "alex.thompson@company.com",
    phone: "+1 (555) 300-0004",
    location: "Seattle, WA",
    managerId: "eng-mgr-002",
    directReports: [],
    level: 3,
  },
  {
    id: "eng-005",
    name: "Rachel Wong",
    position: "Data Engineer",
    department: "Engineering",
    email: "rachel.wong@company.com",
    phone: "+1 (555) 300-0005",
    location: "Seattle, WA",
    managerId: "eng-mgr-002",
    directReports: [],
    level: 3,
  },
  {
    id: "fin-001",
    name: "Kevin Martinez",
    position: "Financial Analyst",
    department: "Finance",
    email: "kevin.martinez@company.com",
    phone: "+1 (555) 300-0006",
    location: "New York, NY",
    managerId: "fin-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "fin-002",
    name: "Sophie Anderson",
    position: "Accountant",
    department: "Finance",
    email: "sophie.anderson@company.com",
    phone: "+1 (555) 300-0007",
    location: "New York, NY",
    managerId: "fin-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "mkt-001",
    name: "Daniel Lee",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "daniel.lee@company.com",
    phone: "+1 (555) 300-0008",
    location: "Austin, TX",
    managerId: "mkt-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "mkt-002",
    name: "Jessica Taylor",
    position: "Content Marketing Manager",
    department: "Marketing",
    email: "jessica.taylor@company.com",
    phone: "+1 (555) 300-0009",
    location: "Austin, TX",
    managerId: "mkt-mgr-001",
    directReports: [],
    level: 3,
  },
  {
    id: "hr-001",
    name: "Christopher Davis",
    position: "HR Specialist",
    department: "Human Resources",
    email: "christopher.davis@company.com",
    phone: "+1 (555) 300-0010",
    location: "Chicago, IL",
    managerId: "hr-mgr-001",
    directReports: [],
    level: 3,
  },
]

export default function OrganizationChartPage() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["ceo-001"]))
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [viewMode, setViewMode] = useState<"tree" | "compact">("tree")
  const [filteredDepartment, setFilteredDepartment] = useState<string>("all")

  // Get unique departments
  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = searchQuery
      ? emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesDepartment = filteredDepartment === "all" || emp.department === filteredDepartment

    return matchesSearch && matchesDepartment
  })

  // Build organizational tree
  const buildOrgTree = (managerId?: string): Employee[] => {
    return filteredEmployees.filter((emp) => emp.managerId === managerId).sort((a, b) => a.name.localeCompare(b.name))
  }

  const toggleNode = (employeeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId)
    } else {
      newExpanded.add(employeeId)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const allIds = new Set(employees.map((emp) => emp.id))
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set(["ceo-001"]))
  }

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find((emp) => emp.id === id)
  }

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-purple-100 border-purple-300", // CEO
      "bg-blue-100 border-blue-300", // C-Level
      "bg-green-100 border-green-300", // Managers
      "bg-yellow-100 border-yellow-300", // Individual Contributors
    ]
    return colors[Math.min(level, colors.length - 1)]
  }

  const EmployeeNode = ({ employee, level = 0 }: { employee: Employee; level?: number }) => {
    const hasDirectReports = employee.directReports.length > 0
    const isExpanded = expandedNodes.has(employee.id)
    const directReports = buildOrgTree(employee.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: level * 0.1 }}
        className="relative"
      >
        <div
          className={`border-2 rounded-lg p-4 ${getLevelColor(employee.level)} cursor-pointer hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3" onClick={() => setSelectedEmployee(employee)}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{employee.name}</h3>
                  {employee.level === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                </div>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
                <p className="text-xs text-muted-foreground">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasDirectReports && (
                <Badge variant="outline" className="text-xs">
                  {employee.directReports.length} reports
                </Badge>
              )}
              {hasDirectReports && (
                <Button size="sm" variant="ghost" onClick={() => toggleNode(employee.id)} className="p-1">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <Button size="sm" variant="ghost" className="p-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Direct Reports */}
        <AnimatePresence>
          {hasDirectReports && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-8 mt-4 space-y-4 border-l-2 border-gray-200 pl-4"
            >
              {directReports.map((report) => (
                <EmployeeNode key={report.id} employee={report} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  const CompactEmployeeCard = ({ employee }: { employee: Employee }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedEmployee(employee)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{employee.name}</h3>
              {employee.level === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
            </div>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
              <span>{employee.department}</span>
              <span>{employee.location}</span>
              {employee.directReports.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {employee.directReports.length} reports
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Chart</h1>
          <p className="text-muted-foreground">Company organizational structure and hierarchy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={collapseAll}>
            <Minimize className="h-4 w-4 mr-2" />
            Collapse All
          </Button>
          <Button variant="outline" onClick={expandAll}>
            <Expand className="h-4 w-4 mr-2" />
            Expand All
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Chart
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
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Management Levels</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...employees.map((emp) => emp.level)) + 1}</div>
            <p className="text-xs text-muted-foreground">Organizational levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((emp) => emp.directReports.length > 0).length}</div>
            <p className="text-xs text-muted-foreground">People managers</p>
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
                  placeholder="Search employees by name, position, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filteredDepartment}
                onChange={(e) => setFilteredDepartment(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "tree" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("tree")}
                  className="rounded-r-none"
                >
                  Tree View
                </Button>
                <Button
                  variant={viewMode === "compact" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("compact")}
                  className="rounded-l-none"
                >
                  Compact View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>{viewMode === "tree" ? "Hierarchical tree view" : "Compact list view"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[800px]">
                {viewMode === "tree" ? (
                  <div className="space-y-6">
                    {buildOrgTree().map((employee) => (
                      <EmployeeNode key={employee.id} employee={employee} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEmployees
                      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
                      .map((employee) => (
                        <CompactEmployeeCard key={employee.id} employee={employee} />
                      ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Employee Details Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>
                {selectedEmployee ? "Selected employee information" : "Select an employee to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEmployee ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} alt={selectedEmployee.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                        {selectedEmployee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{selectedEmployee.name}</h3>
                        {selectedEmployee.level === 0 && <Crown className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <p className="text-muted-foreground">{selectedEmployee.position}</p>
                      <Badge className={getLevelColor(selectedEmployee.level)}>{selectedEmployee.department}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmployee.location}</span>
                    </div>
                  </div>

                  <Separator />

                  {selectedEmployee.managerId && (
                    <div>
                      <h4 className="font-medium mb-2">Reports To</h4>
                      <div className="text-sm">{getEmployeeById(selectedEmployee.managerId)?.name || "Unknown"}</div>
                    </div>
                  )}

                  {selectedEmployee.directReports.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Direct Reports ({selectedEmployee.directReports.length})</h4>
                      <div className="space-y-2">
                        {selectedEmployee.directReports.map((reportId) => {
                          const report = getEmployeeById(reportId)
                          return report ? (
                            <div key={reportId} className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={report.avatar || "/placeholder.svg"} alt={report.name} />
                                <AvatarFallback className="text-xs">
                                  {report.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{report.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Click on any employee in the organization chart to view their details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
