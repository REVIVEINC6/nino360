"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, DollarSign, Award, Download, RefreshCw } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalEmployees: number
    activeEmployees: number
    newHires: number
    terminations: number
    turnoverRate: number
    averageTenure: number
    employeeSatisfaction: number
    retentionRate: number
  }
  demographics: {
    ageGroups: { range: string; count: number; percentage: number }[]
    genderDistribution: { gender: string; count: number; percentage: number }[]
    departmentSizes: { department: string; count: number; percentage: number }[]
    locationDistribution: { location: string; count: number; percentage: number }[]
  }
  performance: {
    averageRating: number
    ratingDistribution: { rating: string; count: number; percentage: number }[]
    goalCompletionRate: number
    topPerformers: { name: string; department: string; rating: number }[]
  }
  attendance: {
    averageAttendanceRate: number
    absenteeismRate: number
    lateArrivalRate: number
    overtimeHours: number
    departmentAttendance: { department: string; rate: number }[]
  }
  compensation: {
    averageSalary: number
    salaryRanges: { range: string; count: number; percentage: number }[]
    payrollCosts: number
    benefitsCosts: number
    departmentCosts: { department: string; cost: number }[]
  }
  training: {
    completionRate: number
    averageHoursPerEmployee: number
    topCourses: { course: string; enrollments: number; completionRate: number }[]
    certifications: number
  }
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("last-quarter")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: AnalyticsData = {
        overview: {
          totalEmployees: 157,
          activeEmployees: 152,
          newHires: 12,
          terminations: 5,
          turnoverRate: 8.2,
          averageTenure: 2.4,
          employeeSatisfaction: 4.2,
          retentionRate: 91.8,
        },
        demographics: {
          ageGroups: [
            { range: "18-25", count: 28, percentage: 17.8 },
            { range: "26-35", count: 65, percentage: 41.4 },
            { range: "36-45", count: 42, percentage: 26.8 },
            { range: "46-55", count: 18, percentage: 11.5 },
            { range: "56+", count: 4, percentage: 2.5 },
          ],
          genderDistribution: [
            { gender: "Male", count: 89, percentage: 56.7 },
            { gender: "Female", count: 65, percentage: 41.4 },
            { gender: "Other", count: 3, percentage: 1.9 },
          ],
          departmentSizes: [
            { department: "Engineering", count: 45, percentage: 28.7 },
            { department: "Sales", count: 32, percentage: 20.4 },
            { department: "Marketing", count: 28, percentage: 17.8 },
            { department: "HR", count: 18, percentage: 11.5 },
            { department: "Finance", count: 15, percentage: 9.6 },
            { department: "Operations", count: 19, percentage: 12.1 },
          ],
          locationDistribution: [
            { location: "New York", count: 85, percentage: 54.1 },
            { location: "San Francisco", count: 42, percentage: 26.8 },
            { location: "Remote", count: 30, percentage: 19.1 },
          ],
        },
        performance: {
          averageRating: 4.1,
          ratingDistribution: [
            { rating: "5 - Exceeds", count: 35, percentage: 22.3 },
            { rating: "4 - Meets+", count: 68, percentage: 43.3 },
            { rating: "3 - Meets", count: 42, percentage: 26.8 },
            { rating: "2 - Below", count: 10, percentage: 6.4 },
            { rating: "1 - Poor", count: 2, percentage: 1.3 },
          ],
          goalCompletionRate: 78.5,
          topPerformers: [
            { name: "Sarah Johnson", department: "Engineering", rating: 4.9 },
            { name: "Michael Chen", department: "Sales", rating: 4.8 },
            { name: "Emily Rodriguez", department: "Marketing", rating: 4.7 },
            { name: "David Kim", department: "Engineering", rating: 4.6 },
            { name: "Lisa Wong", department: "Finance", rating: 4.5 },
          ],
        },
        attendance: {
          averageAttendanceRate: 94.2,
          absenteeismRate: 5.8,
          lateArrivalRate: 12.3,
          overtimeHours: 1240,
          departmentAttendance: [
            { department: "Engineering", rate: 96.1 },
            { department: "Finance", rate: 95.8 },
            { department: "HR", rate: 94.2 },
            { department: "Marketing", rate: 93.5 },
            { department: "Sales", rate: 92.8 },
            { department: "Operations", rate: 91.4 },
          ],
        },
        compensation: {
          averageSalary: 78500,
          salaryRanges: [
            { range: "$40K-$60K", count: 32, percentage: 20.4 },
            { range: "$60K-$80K", count: 58, percentage: 36.9 },
            { range: "$80K-$100K", count: 42, percentage: 26.8 },
            { range: "$100K-$120K", count: 18, percentage: 11.5 },
            { range: "$120K+", count: 7, percentage: 4.5 },
          ],
          payrollCosts: 1235000,
          benefitsCosts: 285000,
          departmentCosts: [
            { department: "Engineering", cost: 485000 },
            { department: "Sales", cost: 320000 },
            { department: "Marketing", cost: 245000 },
            { department: "Operations", cost: 185000 },
            { department: "Finance", cost: 165000 },
            { department: "HR", cost: 120000 },
          ],
        },
        training: {
          completionRate: 78.5,
          averageHoursPerEmployee: 24.5,
          topCourses: [
            { course: "Cybersecurity Fundamentals", enrollments: 145, completionRate: 92.4 },
            { course: "Leadership Development", enrollments: 68, completionRate: 85.3 },
            { course: "Technical Skills", enrollments: 89, completionRate: 76.4 },
            { course: "Sales Training", enrollments: 32, completionRate: 90.6 },
          ],
          certifications: 156,
        },
      }

      setAnalyticsData(mockData)
      setLoading(false)
    }, 1000)
  }, [selectedPeriod, selectedDepartment])

  const handleRefresh = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    console.log("Export analytics data")
  }

  const getTrendIcon = (value: number, isPositive = true) => {
    const isGood = isPositive ? value > 0 : value < 0
    return isGood ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getTrendColor = (value: number, isPositive = true) => {
    const isGood = isPositive ? value > 0 : value < 0
    return isGood ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your workforce</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalEmployees}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(7.2)}
              <span className={getTrendColor(7.2)}>+7.2% from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.turnoverRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(-2.1, false)}
              <span className={getTrendColor(-2.1, false)}>-2.1% from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.employeeSatisfaction}/5.0</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(0.3)}
              <span className={getTrendColor(0.3)}>+0.3 from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.compensation.averageSalary.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(4.8)}
              <span className={getTrendColor(4.8)}>+4.8% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workforce Overview</CardTitle>
                <CardDescription>Key workforce metrics and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Employees</span>
                  <span className="font-medium">{analyticsData.overview.activeEmployees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New Hires (This Period)</span>
                  <span className="font-medium text-green-600">+{analyticsData.overview.newHires}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Terminations (This Period)</span>
                  <span className="font-medium text-red-600">-{analyticsData.overview.terminations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Tenure</span>
                  <span className="font-medium">{analyticsData.overview.averageTenure} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Retention Rate</span>
                  <span className="font-medium text-green-600">{analyticsData.overview.retentionRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.demographics.departmentSizes.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dept.count}</span>
                      <Badge variant="secondary">{dept.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Snapshot</CardTitle>
                <CardDescription>Current performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average Performance Rating</span>
                  <span className="font-medium">{analyticsData.performance.averageRating}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Goal Completion Rate</span>
                  <span className="font-medium text-green-600">{analyticsData.performance.goalCompletionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Training Completion Rate</span>
                  <span className="font-medium text-blue-600">{analyticsData.training.completionRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest rated employees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.performance.topPerformers.map((performer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-sm text-muted-foreground">{performer.department}</div>
                    </div>
                    <Badge variant="outline">{performer.rating}/5.0</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Employee age groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{group.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{group.count}</span>
                      <Badge variant="secondary">{group.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Workforce gender breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.demographics.genderDistribution.map((gender, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{gender.gender}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{gender.count}</span>
                      <Badge variant="secondary">{gender.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
                <CardDescription>Employee locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.demographics.locationDistribution.map((location, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{location.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{location.count}</span>
                      <Badge variant="secondary">{location.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Rating Distribution</CardTitle>
                <CardDescription>Employee performance ratings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.performance.ratingDistribution.map((rating, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{rating.rating}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rating.count}</span>
                      <Badge variant="secondary">{rating.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest rated employees this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.performance.topPerformers.map((performer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-sm text-muted-foreground">{performer.department}</div>
                    </div>
                    <Badge variant="outline">{performer.rating}/5.0</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Overall attendance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average Attendance Rate</span>
                  <span className="font-medium text-green-600">{analyticsData.attendance.averageAttendanceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Absenteeism Rate</span>
                  <span className="font-medium text-red-600">{analyticsData.attendance.absenteeismRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Late Arrival Rate</span>
                  <span className="font-medium text-yellow-600">{analyticsData.attendance.lateArrivalRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Overtime Hours</span>
                  <span className="font-medium">{analyticsData.attendance.overtimeHours}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Attendance</CardTitle>
                <CardDescription>Attendance rates by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.attendance.departmentAttendance.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{dept.department}</span>
                    <Badge variant={dept.rate > 95 ? "default" : dept.rate > 90 ? "secondary" : "destructive"}>
                      {dept.rate}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compensation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Employee salary ranges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.compensation.salaryRanges.map((range, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{range.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{range.count}</span>
                      <Badge variant="secondary">{range.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Costs</CardTitle>
                <CardDescription>Annual costs by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.compensation.departmentCosts.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{dept.department}</span>
                    <span className="font-medium">${dept.cost.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Total compensation costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Payroll Costs</span>
                  <span className="font-medium">${analyticsData.compensation.payrollCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Benefits Costs</span>
                  <span className="font-medium">${analyticsData.compensation.benefitsCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Salary</span>
                  <span className="font-medium">${analyticsData.compensation.averageSalary.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Overview</CardTitle>
                <CardDescription>Training program metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Completion Rate</span>
                  <span className="font-medium text-green-600">{analyticsData.training.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Hours per Employee</span>
                  <span className="font-medium">{analyticsData.training.averageHoursPerEmployee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Certifications</span>
                  <span className="font-medium">{analyticsData.training.certifications}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Training Courses</CardTitle>
                <CardDescription>Most popular training programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.training.topCourses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{course.course}</span>
                      <Badge variant="outline">{course.completionRate}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{course.enrollments} enrollments</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
