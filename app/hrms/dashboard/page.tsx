"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AiInsightsDrawer } from "@/components/tenant/ai-insights-drawer"
import {
  Users,
  UserCheck,
  Clock,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  Bell,
  Eye,
  Edit,
  Send,
  Phone,
  Mail,
  MapPin,
  Building2,
  Award,
  DollarSign,
  Heart,
  BarChart3,
  Activity,
  GraduationCap,
  UserPlus,
  FileText,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  ArrowUp,
  Loader2,
  Target,
  Calendar,
} from "lucide-react"

// Types and Interfaces
interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  position: string
  department: string
  location: string
  hire_date: string
  status: "active" | "inactive" | "terminated" | "on_leave"
  avatar_url?: string
  salary: number
  manager_id?: string
  city: string
  created_at: string
  updated_at: string
}

interface AttendanceRecord {
  id: string
  employee_id: string
  employee: Employee
  date: string
  check_in_time?: string
  check_out_time?: string
  status: "present" | "absent" | "late" | "half_day"
  total_hours?: number
  break_duration_minutes: number
  overtime_hours: number
  notes?: string
}

interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: "vacation" | "sick" | "personal" | "maternity" | "paternity"
  start_date: string
  end_date: string
  days_requested: number
  status: "pending" | "approved" | "rejected" | "cancelled"
  reason: string
  created_at: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  employee_name?: string
}

interface DashboardMetrics {
  total_employees: number
  active_employees: number
  present_today: number
  absent_today: number
  on_leave: number
  pending_leave_requests: number
  new_hires_this_month: number
  turnover_rate: number
  average_attendance: number
  employee_satisfaction: number
  training_completion_rate: number
  performance_reviews_due: number
}

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  action_url?: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  action: () => void
  permission: string[]
}

export default function HRMSDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  // State Management
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([])
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false)
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null)

  // Form States
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    job_title: "",
    hire_date: "",
    salary: "",
    manager_id: "",
    city: "",
  })

  const [leaveRequestForm, setLeaveRequestForm] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  })

  // Get tenant ID helper function
  const getCurrentTenantId = useCallback(async () => {
    if (!user?.id) return null

    try {
      // First try to get from user metadata
      if (user.user_metadata?.tenant_id) {
        return user.user_metadata.tenant_id
      }

      // Then try to get from users table - use limit(1) to avoid multiple rows error
      const { data: userData, error } = await supabase.from("users").select("tenant_id").eq("id", user.id).limit(1)

      if (error || !userData || userData.length === 0) {
        console.log("User not found in users table, creating tenant and user...")

        // Create a default tenant first
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .insert([
            {
              name: `${user.email?.split("@")[0] || "User"}'s Organization`,
              domain: user.email?.split("@")[1] || "example.com",
              status: "active",
            },
          ])
          .select()
          .single()

        if (tenantError) {
          console.error("Error creating tenant:", tenantError)
          return null
        }

        // Create user record with tenant_id
        const { error: userError } = await supabase.from("users").upsert([
          {
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || user.email?.split("@")[0] || "User",
            last_name: user.user_metadata?.last_name || "",
            tenant_id: tenantData.id,
            role: "admin",
            status: "active",
          },
        ])

        if (userError) {
          console.error("Error creating user:", userError)
        }

        return tenantData.id
      }

      // Get the first user record (in case of duplicates)
      const userRecord = Array.isArray(userData) ? userData[0] : userData
      return userRecord?.tenant_id || null
    } catch (error) {
      console.error("Error in getCurrentTenantId:", error)
      return null
    }
  }, [user, supabase])

  // Initialize tenant ID
  useEffect(() => {
    const initializeTenant = async () => {
      if (user) {
        const tenantId = await getCurrentTenantId()
        setCurrentTenantId(tenantId)
      }
    }

    initializeTenant()
  }, [user, getCurrentTenantId])

  // Real-time subscriptions
  useEffect(() => {
    const setupRealtimeSubscriptions = () => {
      if (!currentTenantId) return

      // Subscribe to employee changes
      const employeeSubscription = supabase
        .channel("employees")
        .on("postgres_changes", { event: "*", schema: "public", table: "employees" }, (payload) => {
          console.log("Employee change:", payload)
          fetchEmployees()
          fetchMetrics()
        })
        .subscribe()

      // Subscribe to attendance changes
      const attendanceSubscription = supabase
        .channel("attendance")
        .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, (payload) => {
          console.log("Attendance change:", payload)
          fetchAttendance()
          fetchMetrics()
        })
        .subscribe()

      // Subscribe to leave requests
      const leaveSubscription = supabase
        .channel("leave_requests")
        .on("postgres_changes", { event: "*", schema: "public", table: "leave_requests" }, (payload) => {
          console.log("Leave request change:", payload)
          fetchLeaveRequests()
          fetchMetrics()
        })
        .subscribe()

      return () => {
        employeeSubscription.unsubscribe()
        attendanceSubscription.unsubscribe()
        leaveSubscription.unsubscribe()
      }
    }

    if (currentTenantId) {
      setupRealtimeSubscriptions()
    }
  }, [currentTenantId, supabase])

  // Data Fetching Functions
  const fetchMetrics = useCallback(async () => {
    if (!currentTenantId) return

    try {
      // Fetch employees for this tenant
      const { data: employeeData } = await supabase.from("employees").select("*").eq("tenant_id", currentTenantId)

      // Fetch today's attendance
      const today = new Date().toISOString().split("T")[0]
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .eq("date", today)

      // Fetch pending leave requests
      const { data: leaveData } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .eq("status", "pending")

      if (employeeData) {
        const totalEmployees = employeeData.length
        const activeEmployees = employeeData.filter((emp) => emp.status === "active").length
        const presentToday = attendanceData?.filter((att) => att.status === "present").length || 0
        const absentToday = activeEmployees - presentToday
        const onLeave = employeeData.filter((emp) => emp.status === "on_leave").length

        // Calculate new hires this month
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const newHiresThisMonth = employeeData.filter((emp) => {
          const hireDate = new Date(emp.hire_date)
          return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear
        }).length

        setMetrics({
          total_employees: totalEmployees,
          active_employees: activeEmployees,
          present_today: presentToday,
          absent_today: absentToday,
          on_leave: onLeave,
          pending_leave_requests: leaveData?.length || 0,
          new_hires_this_month: newHiresThisMonth,
          turnover_rate: 2.3,
          average_attendance: activeEmployees > 0 ? (presentToday / activeEmployees) * 100 : 0,
          employee_satisfaction: 4.2,
          training_completion_rate: 87.5,
          performance_reviews_due: 12,
        })
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch dashboard metrics",
        variant: "destructive",
      })
    }
  }, [supabase, currentTenantId])

  const fetchEmployees = useCallback(async () => {
    if (!currentTenantId) return

    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setEmployees(data || [])
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      })
    }
  }, [supabase, currentTenantId])

  const fetchAttendance = useCallback(async () => {
    if (!currentTenantId) return

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .gte("date", sevenDaysAgo)
        .order("date", { ascending: false })

      if (error) throw error

      setRecentAttendance(data || [])
    } catch (error) {
      console.error("Error fetching attendance:", error)
      // Don't show error toast for attendance as it's not critical
    }
  }, [supabase, currentTenantId])

  const fetchLeaveRequests = useCallback(async () => {
    if (!currentTenantId) return

    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          *,
          employees!inner(first_name, last_name)
        `)
        .eq("tenant_id", currentTenantId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform data to include employee name
      const transformedData =
        data?.map((leave: any) => ({
          ...leave,
          employee_name: `${leave.employees.first_name} ${leave.employees.last_name}`,
        })) || []

      setPendingLeaves(transformedData)
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    }
  }, [supabase, currentTenantId])

  const fetchNotifications = useCallback(async () => {
    // Mock notifications - in production, fetch from database
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "warning",
        title: "Leave Request Pending",
        message: "5 leave requests require your approval",
        timestamp: new Date().toISOString(),
        read: false,
        action_url: "/hrms/leave-management",
      },
      {
        id: "2",
        type: "info",
        title: "New Employee Onboarding",
        message: "3 new employees starting next week",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        action_url: "/hrms/onboarding",
      },
      {
        id: "3",
        type: "success",
        title: "Training Completed",
        message: "Safety training completed by 25 employees",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  // Initial Data Load
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentTenantId) return

      setLoading(true)
      try {
        await Promise.all([
          fetchMetrics(),
          fetchEmployees(),
          fetchAttendance(),
          fetchLeaveRequests(),
          fetchNotifications(),
        ])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentTenantId, fetchMetrics, fetchEmployees, fetchAttendance, fetchLeaveRequests, fetchNotifications])

  // Event Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([fetchMetrics(), fetchEmployees(), fetchAttendance(), fetchLeaveRequests()])
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddEmployee = async () => {
    if (!currentTenantId) {
      toast({
        title: "Error",
        description: "No tenant found. Please try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("employees").insert([
        {
          ...newEmployeeForm,
          tenant_id: currentTenantId,
          employee_id: `EMP${Date.now()}`,
          status: "active",
          created_by: user?.id,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Employee added successfully",
      })

      setNewEmployeeForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "",
        job_title: "",
        hire_date: "",
        salary: "",
        manager_id: "",
        city: "",
      })
      setShowEmployeeModal(false)
    } catch (error) {
      console.error("Error adding employee:", error)
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      })
    }
  }

  const handleLeaveRequest = async () => {
    if (!currentTenantId) {
      toast({
        title: "Error",
        description: "No tenant found. Please try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    try {
      const startDate = new Date(leaveRequestForm.start_date)
      const endDate = new Date(leaveRequestForm.end_date)
      const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const { error } = await supabase.from("leave_requests").insert([
        {
          ...leaveRequestForm,
          tenant_id: currentTenantId,
          days_requested: daysRequested,
          status: "pending",
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })

      setLeaveRequestForm({
        employee_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
      })
      setShowLeaveModal(false)
    } catch (error) {
      console.error("Error submitting leave request:", error)
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      })
    }
  }

  const handleApproveLeave = async (leaveId: string) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "approved",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", leaveId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Leave request approved",
      })
    } catch (error) {
      console.error("Error approving leave:", error)
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      })
    }
  }

  const handleRejectLeave = async (leaveId: string) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "rejected",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: "Rejected by manager",
        })
        .eq("id", leaveId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Leave request rejected",
      })
    } catch (error) {
      console.error("Error rejecting leave:", error)
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      })
    }
  }

  const handleMarkAttendance = async (employeeId: string, status: "present" | "absent") => {
    if (!currentTenantId) {
      toast({
        title: "Error",
        description: "No tenant found. Please try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    try {
      const today = new Date().toISOString().split("T")[0]
      const { error } = await supabase.from("attendance").upsert([
        {
          tenant_id: currentTenantId,
          employee_id: employeeId,
          date: today,
          status,
          check_in_time: status === "present" ? new Date().toISOString() : null,
          total_hours: status === "present" ? 8 : 0,
          break_duration_minutes: 0,
          overtime_hours: 0,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: `Attendance marked as ${status}`,
      })
    } catch (error) {
      console.error("Error marking attendance:", error)
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      })
    }
  }

  const handleExportData = async (type: "employees" | "attendance" | "leaves") => {
    try {
      let data: any[] = []
      let filename = ""

      switch (type) {
        case "employees":
          data = employees
          filename = "employees_export.csv"
          break
        case "attendance":
          data = recentAttendance
          filename = "attendance_export.csv"
          break
        case "leaves":
          data = pendingLeaves
          filename = "leave_requests_export.csv"
          break
      }

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "No data available to export",
          variant: "destructive",
        })
        return
      }

      // Convert to CSV
      const headers = Object.keys(data[0] || {})
      const csvContent = [
        headers.join(","),
        ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
      ].join("\n")

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: `${type} data exported successfully`,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  // Quick Actions Configuration
  const quickActions: QuickAction[] = [
    {
      id: "add-employee",
      title: "Add New Employee",
      description: "Register a new employee in the system",
      icon: UserPlus,
      color: "bg-blue-500",
      action: () => setShowEmployeeModal(true),
      permission: ["admin", "hr_manager"],
    },
    {
      id: "mark-attendance",
      title: "Mark Attendance",
      description: "Record employee attendance for today",
      icon: Clock,
      color: "bg-green-500",
      action: () => router.push("/hrms/attendance"),
      permission: ["admin", "hr_manager", "supervisor"],
    },
    {
      id: "leave-request",
      title: "Submit Leave Request",
      description: "Request time off or leave",
      icon: CalendarIcon,
      color: "bg-purple-500",
      action: () => setShowLeaveModal(true),
      permission: ["all"],
    },
    {
      id: "generate-report",
      title: "Generate Report",
      description: "Create HR reports and analytics",
      icon: FileText,
      color: "bg-orange-500",
      action: () => router.push("/hrms/reports"),
      permission: ["admin", "hr_manager"],
    },
    {
      id: "payroll",
      title: "Process Payroll",
      description: "Manage employee payroll and benefits",
      icon: DollarSign,
      color: "bg-emerald-500",
      action: () => router.push("/hrms/payroll"),
      permission: ["admin", "payroll_manager"],
    },
    {
      id: "performance",
      title: "Performance Review",
      description: "Conduct employee performance evaluations",
      icon: Award,
      color: "bg-yellow-500",
      action: () => router.push("/hrms/performance"),
      permission: ["admin", "hr_manager", "supervisor"],
    },
  ]

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map((emp) => emp.department))).filter(Boolean)

  if (loading || !currentTenantId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!currentTenantId ? "Setting up your workspace..." : "Loading HRMS Dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  const metricsData = [
    {
      title: "Total Employees",
      value: metrics?.total_employees || "0",
      change: `+${metrics?.new_hires_this_month || "0"}`,
      changeType: "increase" as const,
      icon: Users,
      description: "Active employees",
    },
    {
      title: "Present Today",
      value: metrics?.present_today || "0",
      change: `${metrics?.average_attendance.toFixed(1) || "0"}%`,
      changeType: "neutral" as const,
      icon: UserCheck,
      description: "Attendance rate",
    },
    {
      title: "Pending Leaves",
      value: metrics?.pending_leave_requests || "0",
      change: "-5",
      changeType: "decrease" as const,
      icon: Calendar,
      description: "Awaiting approval",
    },
    {
      title: "Avg Attendance",
      value: `${metrics?.average_attendance.toFixed(1) || "0"}%`,
      change: "+2.1%",
      changeType: "increase" as const,
      icon: Clock,
      description: "Last 30 days",
    },
  ]

  const recentActivitiesData = [
    {
      id: 1,
      type: "onboarding",
      title: "New employee onboarded",
      description: "Sarah Johnson joined Marketing team",
      time: "2 hours ago",
      icon: UserCheck,
      status: "success",
    },
    {
      id: 2,
      type: "leave",
      title: "Leave request approved",
      description: "Mike Chen's vacation request approved",
      time: "4 hours ago",
      icon: Calendar,
      status: "info",
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance marked",
      description: "Daily attendance processed for Engineering",
      time: "6 hours ago",
      icon: Clock,
      status: "success",
    },
    {
      id: 4,
      type: "performance",
      title: "Performance review completed",
      description: "Q4 reviews completed for Sales team",
      time: "1 day ago",
      icon: Target,
      status: "success",
    },
    {
      id: 5,
      type: "training",
      title: "Training session scheduled",
      description: "Leadership training for managers",
      time: "2 days ago",
      icon: Award,
      status: "info",
    },
  ]

  const departmentsData = departments.map((dept) => ({
    name: dept,
    employees: employees.filter((emp) => emp.department === dept).length,
    attendance: 95.0,
    color: "bg-blue-500",
  }))

  const quickActionsData = [
    { title: "Add Employee", icon: UserPlus, href: "/hrms/employees/new", color: "bg-blue-500" },
    { title: "Process Payroll", icon: DollarSign, href: "/hrms/payroll", color: "bg-green-500" },
    { title: "Review Timesheets", icon: Clock, href: "/hrms/timesheets", color: "bg-purple-500" },
    { title: "Generate Reports", icon: FileText, href: "/hrms/reports", color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HRMS Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Admin"}! Here's your HR
              overview for today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative bg-transparent">
                  <Bell className="h-4 w-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {notifications.filter((n) => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-semibold">Notifications</h4>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${notification.read ? "bg-muted/50" : "bg-background"}`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === "error"
                                  ? "bg-red-500"
                                  : notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : notification.type === "success"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                              {notification.action_url && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto mt-2"
                                  onClick={() => router.push(notification.action_url!)}
                                >
                                  View Details
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>

            <AiInsightsDrawer isOpen={false} module="hrms" />

            <Button
              onClick={() => setShowQuickActionsModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                      <p className="text-3xl font-bold">{metrics.total_employees}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />+{metrics.new_hires_this_month} this month
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                      <p className="text-3xl font-bold">{metrics.present_today}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metrics.average_attendance.toFixed(1)}% attendance rate
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Leaves</p>
                      <p className="text-3xl font-bold">{metrics.pending_leave_requests}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Requires approval
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100">
                      <CalendarIcon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                      <p className="text-3xl font-bold">{metrics?.average_attendance.toFixed(1)}%</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.1% from last month
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {[
                        {
                          action: "New employee onboarded",
                          details: "Sarah Johnson joined Marketing team",
                          time: "2 hours ago",
                          type: "success",
                        },
                        {
                          action: "Leave request approved",
                          details: "Mike Chen's vacation request approved",
                          time: "4 hours ago",
                          type: "info",
                        },
                        {
                          action: "Attendance marked",
                          details: "25 employees clocked in this morning",
                          time: "6 hours ago",
                          type: "success",
                        },
                        {
                          action: "Performance review due",
                          details: "12 employees need quarterly review",
                          time: "1 day ago",
                          type: "warning",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === "success"
                                ? "bg-green-500"
                                : activity.type === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Department Overview */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Department Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.length > 0 ? (
                      departments.map((dept) => {
                        const deptEmployees = employees.filter((emp) => emp.department === dept)
                        const percentage = employees.length > 0 ? (deptEmployees.length / employees.length) * 100 : 0
                        return (
                          <div key={dept} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{dept}</span>
                              <span className="text-sm text-muted-foreground">{deptEmployees.length} employees</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No departments found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Employee Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{metrics?.employee_satisfaction}/5.0</div>
                    <Progress value={(metrics?.employee_satisfaction || 0) * 20} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Based on recent surveys</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{metrics?.training_completion_rate}%</div>
                    <Progress value={metrics?.training_completion_rate || 0} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Completion rate this quarter</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    Turnover Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{metrics?.turnover_rate}%</div>
                    <Progress value={metrics?.turnover_rate || 0} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Annual turnover rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            {/* Employee Management Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
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
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleExportData("employees")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setShowEmployeeModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={employee.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {employee.first_name[0]}
                                  {employee.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {employee.first_name} {employee.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{employee.position}</p>
                                <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                employee.status === "active"
                                  ? "default"
                                  : employee.status === "on_leave"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{employee.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{employee.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{employee.city}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setShowEmployeeModal(true)
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAttendance(employee.id, "present")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAttendance(employee.id, "absent")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No employees found</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Real-time attendance tracking and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics?.present_today}</div>
                    <div className="text-sm text-muted-foreground">Present Today</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{metrics?.absent_today}</div>
                    <div className="text-sm text-muted-foreground">Absent Today</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{metrics?.on_leave}</div>
                    <div className="text-sm text-muted-foreground">On Leave</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics?.average_attendance.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Avg Attendance</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Recent Attendance Records</h4>
                  <Button variant="outline" onClick={() => handleExportData("attendance")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {recentAttendance.length > 0 ? (
                      recentAttendance.map((record) => {
                        const employee = employees.find((emp) => emp.id === record.employee_id)
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee?.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {employee?.first_name[0]}
                                  {employee?.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {employee?.first_name} {employee?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">{record.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge
                                variant={
                                  record.status === "present"
                                    ? "default"
                                    : record.status === "late"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {record.status}
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm font-medium">{record.total_hours || 0}h</p>
                                <p className="text-xs text-muted-foreground">
                                  {record.check_in_time && new Date(record.check_in_time).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No attendance records found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Leave Requests Management
                </CardTitle>
                <CardDescription>Review and manage employee leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {pendingLeaves.length} Pending Requests
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleExportData("leaves")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => setShowLeaveModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {pendingLeaves.length > 0 ? (
                      pendingLeaves.map((leave) => (
                        <Card key={leave.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {leave.employee_name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-semibold">{leave.employee_name}</h4>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {leave.leave_type} Leave • {leave.days_requested} days
                                  </p>
                                </div>
                                <div className="text-sm">
                                  <p>
                                    <strong>Duration:</strong> {new Date(leave.start_date).toLocaleDateString()} -{" "}
                                    {new Date(leave.end_date).toLocaleDateString()}
                                  </p>
                                  <p className="mt-1">
                                    <strong>Reason:</strong> {leave.reason}
                                  </p>
                                  <p className="mt-1 text-muted-foreground">
                                    Submitted: {new Date(leave.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  leave.status === "approved"
                                    ? "default"
                                    : leave.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {leave.status}
                              </Badge>
                              {leave.status === "pending" && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveLeave(leave.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleRejectLeave(leave.id)}>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No pending leave requests</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Modal */}
        <Dialog open={showQuickActionsModal} onOpenChange={setShowQuickActionsModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Quick Actions</DialogTitle>
              <DialogDescription>Choose an action to perform quickly</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {quickActions.map((action) => (
                <Card
                  key={action.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    action.action()
                    setShowQuickActionsModal(false)
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Employee Modal */}
        <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEmployee ? "Employee Details" : "Add New Employee"}</DialogTitle>
              <DialogDescription>
                {selectedEmployee
                  ? "View and manage employee information"
                  : "Enter employee information to add them to the system"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={selectedEmployee ? selectedEmployee.first_name : newEmployeeForm.first_name}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, first_name: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={selectedEmployee ? selectedEmployee.last_name : newEmployeeForm.last_name}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, last_name: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedEmployee ? selectedEmployee.email : newEmployeeForm.email}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={selectedEmployee ? selectedEmployee.phone : newEmployeeForm.phone}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={selectedEmployee ? selectedEmployee.department : newEmployeeForm.department}
                  onValueChange={(value) => setNewEmployeeForm({ ...newEmployeeForm, department: value })}
                  disabled={!!selectedEmployee}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={selectedEmployee ? selectedEmployee.position : newEmployeeForm.job_title}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, job_title: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={selectedEmployee ? selectedEmployee.hire_date.split("T")[0] : newEmployeeForm.hire_date}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, hire_date: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={selectedEmployee ? selectedEmployee.salary : newEmployeeForm.salary}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, salary: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Location</Label>
                <Input
                  id="city"
                  value={selectedEmployee ? selectedEmployee.city : newEmployeeForm.city}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, city: e.target.value })}
                  disabled={!!selectedEmployee}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmployeeModal(false)
                  setSelectedEmployee(null)
                }}
              >
                Cancel
              </Button>
              {!selectedEmployee && (
                <Button onClick={handleAddEmployee}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Leave Request Modal */}
        <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
              <DialogDescription>Fill out the form to request time off</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee_select">Employee</Label>
                <Select
                  value={leaveRequestForm.employee_id}
                  onValueChange={(value) => setLeaveRequestForm({ ...leaveRequestForm, employee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave_type">Leave Type</Label>
                <Select
                  value={leaveRequestForm.leave_type}
                  onValueChange={(value) => setLeaveRequestForm({ ...leaveRequestForm, leave_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="paternity">Paternity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={leaveRequestForm.start_date}
                    onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={leaveRequestForm.end_date}
                    onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request..."
                  value={leaveRequestForm.reason}
                  onChange={(e) => setLeaveRequestForm({ ...leaveRequestForm, reason: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleLeaveRequest}>
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
