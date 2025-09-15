"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Shield,
  Plane,
  DollarSign,
  Users,
  Calendar,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface BenefitPlan {
  id: string
  name: string
  type: "health" | "dental" | "vision" | "life" | "disability" | "retirement" | "pto" | "other"
  provider: string
  description: string
  cost: {
    employee: number
    employer: number
  }
  coverage: string
  eligibility: string
  enrollmentPeriod: string
  status: "active" | "inactive" | "pending"
}

interface EmployeeBenefit {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  benefits: {
    planId: string
    planName: string
    type: string
    status: "enrolled" | "pending" | "declined" | "expired"
    enrollmentDate: string
    cost: number
  }[]
  totalCost: number
  eligibilityDate: string
}

export default function BenefitsPage() {
  const [benefitPlans, setBenefitPlans] = useState<BenefitPlan[]>([])
  const [employeeBenefits, setEmployeeBenefits] = useState<EmployeeBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPlans: BenefitPlan[] = [
        {
          id: "1",
          name: "Premium Health Plan",
          type: "health",
          provider: "Blue Cross Blue Shield",
          description: "Comprehensive health coverage with low deductibles",
          cost: {
            employee: 250,
            employer: 750,
          },
          coverage: "Individual and Family",
          eligibility: "Full-time employees after 90 days",
          enrollmentPeriod: "Annual Open Enrollment",
          status: "active",
        },
        {
          id: "2",
          name: "Basic Health Plan",
          type: "health",
          provider: "Aetna",
          description: "Essential health coverage with higher deductibles",
          cost: {
            employee: 150,
            employer: 450,
          },
          coverage: "Individual and Family",
          eligibility: "Full-time employees after 90 days",
          enrollmentPeriod: "Annual Open Enrollment",
          status: "active",
        },
        {
          id: "3",
          name: "Dental Plus",
          type: "dental",
          provider: "Delta Dental",
          description: "Comprehensive dental coverage including orthodontics",
          cost: {
            employee: 45,
            employer: 35,
          },
          coverage: "Individual and Family",
          eligibility: "All employees",
          enrollmentPeriod: "Quarterly",
          status: "active",
        },
        {
          id: "4",
          name: "Vision Care",
          type: "vision",
          provider: "VSP",
          description: "Eye exams, glasses, and contact lens coverage",
          cost: {
            employee: 15,
            employer: 10,
          },
          coverage: "Individual and Family",
          eligibility: "All employees",
          enrollmentPeriod: "Quarterly",
          status: "active",
        },
        {
          id: "5",
          name: "Life Insurance",
          type: "life",
          provider: "MetLife",
          description: "Basic life insurance coverage",
          cost: {
            employee: 0,
            employer: 25,
          },
          coverage: "2x Annual Salary",
          eligibility: "All employees",
          enrollmentPeriod: "Immediate",
          status: "active",
        },
        {
          id: "6",
          name: "401(k) Plan",
          type: "retirement",
          provider: "Fidelity",
          description: "Retirement savings with company matching",
          cost: {
            employee: 0,
            employer: 0,
          },
          coverage: "Up to 6% company match",
          eligibility: "All employees after 30 days",
          enrollmentPeriod: "Immediate",
          status: "active",
        },
      ]

      const mockEmployeeBenefits: EmployeeBenefit[] = [
        {
          id: "1",
          employeeId: "emp1",
          employeeName: "Sarah Johnson",
          position: "Senior Software Engineer",
          department: "Engineering",
          benefits: [
            {
              planId: "1",
              planName: "Premium Health Plan",
              type: "health",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 250,
            },
            {
              planId: "3",
              planName: "Dental Plus",
              type: "dental",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 45,
            },
            {
              planId: "4",
              planName: "Vision Care",
              type: "vision",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 15,
            },
            {
              planId: "6",
              planName: "401(k) Plan",
              type: "retirement",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 0,
            },
          ],
          totalCost: 310,
          eligibilityDate: "2023-10-01",
        },
        {
          id: "2",
          employeeId: "emp2",
          employeeName: "Michael Chen",
          position: "Marketing Specialist",
          department: "Marketing",
          benefits: [
            {
              planId: "2",
              planName: "Basic Health Plan",
              type: "health",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 150,
            },
            {
              planId: "3",
              planName: "Dental Plus",
              type: "dental",
              status: "pending",
              enrollmentDate: "2024-04-01",
              cost: 45,
            },
            {
              planId: "6",
              planName: "401(k) Plan",
              type: "retirement",
              status: "enrolled",
              enrollmentDate: "2024-01-01",
              cost: 0,
            },
          ],
          totalCost: 150,
          eligibilityDate: "2023-12-01",
        },
        {
          id: "3",
          employeeId: "emp3",
          employeeName: "Emily Rodriguez",
          position: "Sales Representative",
          department: "Sales",
          benefits: [
            {
              planId: "1",
              planName: "Premium Health Plan",
              type: "health",
              status: "enrolled",
              enrollmentDate: "2024-02-01",
              cost: 250,
            },
            {
              planId: "4",
              planName: "Vision Care",
              type: "vision",
              status: "declined",
              enrollmentDate: "",
              cost: 0,
            },
            {
              planId: "6",
              planName: "401(k) Plan",
              type: "retirement",
              status: "enrolled",
              enrollmentDate: "2024-02-01",
              cost: 0,
            },
          ],
          totalCost: 250,
          eligibilityDate: "2024-02-01",
        },
      ]

      setBenefitPlans(mockPlans)
      setEmployeeBenefits(mockEmployeeBenefits)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "enrolled":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
      case "declined":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-4 w-4" />
      case "dental":
        return <Shield className="h-4 w-4" />
      case "vision":
        return <Eye className="h-4 w-4" />
      case "life":
        return <Shield className="h-4 w-4" />
      case "disability":
        return <Shield className="h-4 w-4" />
      case "retirement":
        return <DollarSign className="h-4 w-4" />
      case "pto":
        return <Plane className="h-4 w-4" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enrolled":
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "declined":
      case "inactive":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredPlans = benefitPlans.filter((plan) => {
    if (selectedType !== "all" && plan.type !== selectedType) {
      return false
    }
    if (selectedStatus !== "all" && plan.status !== selectedStatus) {
      return false
    }
    return true
  })

  const handleEnrollEmployee = (employeeId: string, planId: string) => {
    console.log("Enroll employee", employeeId, "in plan", planId)
  }

  const handleEditPlan = (planId: string) => {
    console.log("Edit plan:", planId)
  }

  const handleCreatePlan = () => {
    console.log("Create new benefit plan")
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
          <h1 className="text-3xl font-bold tracking-tight">Benefits Administration</h1>
          <p className="text-muted-foreground">Manage employee benefits, plans, and enrollments</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <Plus className="mr-2 h-4 w-4" />
          Add Benefit Plan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="dental">Dental</SelectItem>
            <SelectItem value="vision">Vision</SelectItem>
            <SelectItem value="life">Life Insurance</SelectItem>
            <SelectItem value="retirement">Retirement</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Benefits Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitPlans.length}</div>
            <p className="text-xs text-muted-foreground">Active benefit plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeBenefits.length}</div>
            <p className="text-xs text-muted-foreground">With active benefits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${employeeBenefits.reduce((sum, emp) => sum + emp.totalCost, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly employee costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Employee participation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
          <TabsTrigger value="enrollments">Employee Enrollments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(plan.type)}
                        {plan.name}
                        <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">Provider: {plan.provider}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan.id)}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cost Breakdown */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Employee Cost</p>
                      <p className="text-xl font-bold text-blue-900">${plan.cost.employee}/month</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Employer Cost</p>
                      <p className="text-xl font-bold text-green-900">${plan.cost.employer}/month</p>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Coverage</span>
                      <span className="text-sm font-medium">{plan.coverage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Eligibility</span>
                      <span className="text-sm font-medium">{plan.eligibility}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Enrollment</span>
                      <span className="text-sm font-medium">{plan.enrollmentPeriod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <div className="grid gap-4">
            {employeeBenefits.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{employee.employeeName}</CardTitle>
                      <CardDescription>
                        {employee.position} • {employee.department}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Eligible: {new Date(employee.eligibilityDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Monthly Cost: ${employee.totalCost}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Enroll
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Enrolled Benefits</p>
                    <div className="grid gap-2">
                      {employee.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(benefit.type)}
                            <span className="text-sm font-medium">{benefit.planName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(benefit.status)} variant="secondary">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(benefit.status)}
                                {benefit.status}
                              </div>
                            </Badge>
                            {benefit.cost > 0 && <span className="text-sm">${benefit.cost}/mo</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment by Plan Type</CardTitle>
                <CardDescription>Employee participation rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Health Insurance</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dental Insurance</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vision Insurance</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>401(k) Plan</span>
                    <span className="font-medium">88%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Monthly benefit costs by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Engineering</span>
                    <span className="font-medium">$12,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-medium">$8,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <span className="font-medium">$6,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HR</span>
                    <span className="font-medium">$4,100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
