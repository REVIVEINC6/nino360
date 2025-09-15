"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarIcon,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  MapPin,
  Wifi,
  Bell,
  Building2,
  Activity,
  CalendarDays,
  UserCheck,
  UserX,
  Coffee,
  Home,
  Plane,
  Heart,
  AlertCircle,
  CheckCircle2,
  Save,
  Send,
  Settings,
  Loader2,
  Edit,
} from "lucide-react"
import { format, startOfWeek, endOfWeek } from "date-fns"

// Types and Interfaces
interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  avatar?: string
  employeeId: string
  manager: string
  location: string
  workSchedule: {
    startTime: string
    endTime: string
    workDays: string[]
    timezone: string
  }
  status: "active" | "inactive" | "on-leave"
}

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position?: string
  date: string
  checkIn?: string | null
  checkOut?: string | null
  status:
    | "present"
    | "absent"
    | "late"
    | "half-day"
    | "on-leave"
    | "holiday"
    | "sick-leave"
    | "vacation"
    | "work-from-home"
  totalHours?: number
  overtimeHours?: number
  breakDuration?: number
  breakStart?: string | null
  breakEnd?: string | null
  notes?: string
  avatar?: string
  location?: {
    checkIn?: { lat: number; lng: number; address: string }
    checkOut?: { lat: number; lng: number; address: string }
  }
  device?: {
    type: "mobile" | "web" | "biometric"
    ip: string
    userAgent?: string
  }
  approvedBy?: string
  isManualEntry?: boolean
  workType?: "office" | "remote" | "hybrid" | "field"
  projectHours?: { projectId: string; hours: number }[]
}

interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  onLeaveToday: number
  averageHours: number
  overtimeHours: number
  attendanceRate: number
}

interface LeaveRequest {
  id: string
  employeeId: string
  employee: Employee
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity" | "emergency" | "bereavement" | "jury-duty"
  startDate: string
  endDate: string
  days: number
  halfDay: boolean
  reason: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  documents?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface RealTimeData {
  currentlyOnline: number
  checkedInToday: number
  onBreak: number
  workingRemote: number
  lateToday: number
  pendingApprovals: number
  systemStatus: "online" | "maintenance" | "offline"
  lastUpdated: string
}

// Mock Data
const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Engineering",
    position: "Senior Software Engineer",
    employeeId: "ENG001",
    manager: "John Smith",
    location: "New York Office",
    workSchedule: {
      startTime: "09:00",
      endTime: "17:00",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timezone: "America/New_York",
    },
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp-002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    employeeId: "MKT001",
    manager: "Lisa Wang",
    location: "San Francisco Office",
    workSchedule: {
      startTime: "08:30",
      endTime: "16:30",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timezone: "America/Los_Angeles",
    },
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "Sales",
    position: "Sales Representative",
    employeeId: "SAL001",
    manager: "David Kim",
    location: "Remote",
    workSchedule: {
      startTime: "09:00",
      endTime: "17:00",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timezone: "America/Chicago",
    },
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp-004",
    name: "James Wilson",
    email: "james.wilson@company.com",
    department: "HR",
    position: "HR Specialist",
    employeeId: "HR001",
    manager: "Amanda Davis",
    location: "New York Office",
    workSchedule: {
      startTime: "08:00",
      endTime: "16:00",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timezone: "America/New_York",
    },
    status: "on-leave",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att-001",
    employeeId: "emp-001",
    employeeName: "Sarah Johnson",
    department: "Engineering",
    position: "Senior Software Engineer",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: "09:15",
    checkOut: null,
    breakDuration: 60,
    status: "present",
    totalHours: 0,
    overtimeHours: 0,
    location: {
      checkIn: { lat: 40.7128, lng: -74.006, address: "123 Main St, New York, NY" },
    },
    device: { type: "mobile", ip: "192.168.1.100", userAgent: "Mobile App v2.1" },
    isManualEntry: false,
    workType: "office",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "att-002",
    employeeId: "emp-002",
    employeeName: "Michael Chen",
    department: "Marketing",
    position: "Marketing Manager",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: "08:45",
    checkOut: "17:30",
    breakDuration: 60,
    totalHours: 8.75,
    overtimeHours: 0.75,
    status: "present",
    location: {
      checkIn: { lat: 37.7749, lng: -122.4194, address: "456 Tech Ave, San Francisco, CA" },
      checkOut: { lat: 37.7749, lng: -122.4194, address: "456 Tech Ave, San Francisco, CA" },
    },
    device: { type: "web", ip: "192.168.1.101" },
    isManualEntry: false,
    workType: "office",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "att-003",
    employeeId: "emp-003",
    employeeName: "Emily Rodriguez",
    department: "Sales",
    position: "Sales Representative",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: "09:00",
    checkOut: "17:00",
    totalHours: 8,
    overtimeHours: 0,
    status: "work-from-home",
    location: {},
    device: { type: "web", ip: "98.139.180.149" },
    isManualEntry: false,
    workType: "remote",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "att-004",
    employeeId: "emp-004",
    employeeName: "James Wilson",
    department: "HR",
    position: "HR Specialist",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: null,
    checkOut: null,
    totalHours: 0,
    overtimeHours: 0,
    status: "sick-leave",
    location: {},
    device: { type: "web", ip: "" },
    isManualEntry: true,
    workType: "office",
    notes: "Approved sick leave - flu symptoms",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-001",
    employeeId: "emp-001",
    employee: mockEmployees[0],
    type: "vacation",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    days: 5,
    halfDay: false,
    reason: "Family vacation to Hawaii",
    status: "pending",
    appliedDate: "2024-01-20",
  },
  {
    id: "leave-002",
    employeeId: "emp-002",
    employee: mockEmployees[1],
    type: "sick",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    days: 3,
    halfDay: false,
    reason: "Medical appointment and recovery",
    status: "approved",
    appliedDate: "2024-02-08",
    approvedBy: "Lisa Wang",
    approvedDate: "2024-02-09",
  },
]

const mockRealTimeData: RealTimeData = {
  currentlyOnline: 156,
  checkedInToday: 234,
  onBreak: 23,
  workingRemote: 89,
  lateToday: 12,
  pendingApprovals: 8,
  systemStatus: "online",
  lastUpdated: new Date().toISOString(),
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("all")
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  })
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [realTimeData, setRealTimeData] = useState<RealTimeData>(mockRealTimeData)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false)
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isExporting, setIsExporting] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const { toast } = useToast()

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Real-time data updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        currentlyOnline: prev.currentlyOnline + Math.floor(Math.random() * 3) - 1,
        lastUpdated: new Date().toISOString(),
      }))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initialize stats
    const mockStats: AttendanceStats = {
      totalEmployees: mockEmployees.length,
      presentToday: mockAttendanceRecords.filter((r) => r.status === "present").length,
      absentToday: mockAttendanceRecords.filter((r) => r.status === "absent").length,
      lateToday: mockAttendanceRecords.filter((r) => r.status === "late").length,
      onLeaveToday: mockAttendanceRecords.filter((r) => ["sick-leave", "vacation"].includes(r.status)).length,
      averageHours: 7.8,
      overtimeHours: 2,
      attendanceRate: 87.5,
    }
    setStats(mockStats)
  }, [])

  useEffect(() => {
    let filtered = attendanceRecords

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((record) => record.department === departmentFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    // Filter by work type
    if (workTypeFilter !== "all") {
      filtered = filtered.filter((record) => record.workType === workTypeFilter)
    }

    setFilteredRecords(filtered)
  }, [searchTerm, departmentFilter, statusFilter, workTypeFilter, attendanceRecords])

  // Utility Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "half-day":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "on-leave":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "work-from-home":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "holiday":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "sick-leave":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "vacation":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "half-day":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "on-leave":
        return <CalendarIcon className="h-4 w-4 text-purple-600" />
      case "holiday":
        return <CalendarDays className="h-4 w-4 text-purple-500" />
      case "sick-leave":
        return <Heart className="h-4 w-4 text-orange-500" />
      case "vacation":
        return <Plane className="h-4 w-4 text-indigo-500" />
      case "work-from-home":
        return <Home className="h-4 w-4 text-cyan-500" />
      default:
        return null
    }
  }

  const getWorkTypeIcon = (workType?: string) => {
    if (!workType) return <Building2 className="h-4 w-4" />

    const icons = {
      office: <Building2 className="h-4 w-4" />,
      remote: <Home className="h-4 w-4" />,
      hybrid: <Wifi className="h-4 w-4" />,
      field: <MapPin className="h-4 w-4" />,
    }
    return icons[workType as keyof typeof icons] || <Building2 className="h-4 w-4" />
  }

  const calculateHours = (checkIn: string | null, checkOut: string | null): number => {
    if (!checkIn || !checkOut) return 0
    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)
    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin
    return Math.max(0, (outMinutes - inMinutes) / 60)
  }

  const formatTime = (time: string | null | undefined): string => {
    if (!time) return "--:--"
    return time
  }

  const formatDuration = (hours?: number): string => {
    if (!hours) return "0h 0m"
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  // Event Handlers
  const handleCheckIn = useCallback(
    async (employeeId: string) => {
      setLoading(true)
      try {
        const currentTime = format(new Date(), "HH:mm")
        const updatedRecords = attendanceRecords.map((record) =>
          record.employeeId === employeeId && record.date === format(selectedDate, "yyyy-MM-dd")
            ? { ...record, checkIn: currentTime, status: "present" as const }
            : record,
        )
        setAttendanceRecords(updatedRecords)
        toast({
          title: "Check-in Successful",
          description: `Employee checked in at ${currentTime}`,
        })
      } catch (error) {
        toast({
          title: "Check-in Failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [attendanceRecords, selectedDate, toast],
  )

  const handleCheckOut = useCallback(
    async (employeeId: string) => {
      setLoading(true)
      try {
        const currentTime = format(new Date(), "HH:mm")
        const updatedRecords = attendanceRecords.map((record) => {
          if (record.employeeId === employeeId && record.date === format(selectedDate, "yyyy-MM-dd")) {
            const totalHours = calculateHours(record.checkIn, currentTime)
            return {
              ...record,
              checkOut: currentTime,
              totalHours,
              overtimeHours: Math.max(0, totalHours - 8),
            }
          }
          return record
        })
        setAttendanceRecords(updatedRecords)
        toast({
          title: "Check-out Successful",
          description: `Employee checked out at ${currentTime}`,
        })
      } catch (error) {
        toast({
          title: "Check-out Failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [attendanceRecords, selectedDate, toast],
  )

  const handleApproveLeave = useCallback(
    async (leaveId: string) => {
      setLoading(true)
      try {
        const updatedRequests = leaveRequests.map((request) =>
          request.id === leaveId
            ? {
                ...request,
                status: "approved" as const,
                approvedBy: "Current User",
                approvedDate: format(new Date(), "yyyy-MM-dd"),
              }
            : request,
        )
        setLeaveRequests(updatedRequests)
        toast({
          title: "Leave Approved",
          description: "Leave request has been approved successfully",
        })
      } catch (error) {
        toast({
          title: "Approval Failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [leaveRequests, toast],
  )

  const handleRejectLeave = useCallback(
    async (leaveId: string, reason: string) => {
      setLoading(true)
      try {
        const updatedRequests = leaveRequests.map((request) =>
          request.id === leaveId
            ? {
                ...request,
                status: "rejected" as const,
                rejectionReason: reason,
                approvedBy: "Current User",
                approvedDate: format(new Date(), "yyyy-MM-dd"),
              }
            : request,
        )
        setLeaveRequests(updatedRequests)
        toast({
          title: "Leave Rejected",
          description: "Leave request has been rejected",
        })
      } catch (error) {
        toast({
          title: "Rejection Failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [leaveRequests, toast],
  )

  const handleExportData = useCallback(async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const csvContent = [
        ["Employee ID", "Name", "Department", "Date", "Check In", "Check Out", "Total Hours", "Status"].join(","),
        ...filteredRecords.map((record) =>
          [
            record.employeeId,
            record.employeeName,
            record.department,
            record.date,
            record.checkIn || "",
            record.checkOut || "",
            (record.totalHours || 0).toString(),
            record.status,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance-report-${format(selectedDate, "yyyy-MM-dd")}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Attendance data has been exported to CSV",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [toast, selectedDate, filteredRecords])

  const handleBulkAction = useCallback(
    async (action: string) => {
      if (selectedRecords.length === 0) {
        toast({
          title: "No Records Selected",
          description: "Please select records to perform bulk actions",
          variant: "destructive",
        })
        return
      }

      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Bulk Action Completed",
          description: `${action} applied to ${selectedRecords.length} records`,
        })
        setSelectedRecords([])
        setIsBulkActionOpen(false)
      } catch (error) {
        toast({
          title: "Bulk Action Failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [selectedRecords, toast],
  )

  // Filtered Data
  const attendanceSummary = {
    totalEmployees: employees.length,
    presentToday: attendanceRecords.filter((r) => r.date === format(new Date(), "yyyy-MM-dd") && r.status === "present")
      .length,
    absentToday: attendanceRecords.filter((r) => r.date === format(new Date(), "yyyy-MM-dd") && r.status === "absent")
      .length,
    lateToday: attendanceRecords.filter((r) => r.date === format(new Date(), "yyyy-MM-dd") && r.status === "late")
      .length,
    onLeaveToday: attendanceRecords.filter(
      (r) => r.date === format(new Date(), "yyyy-MM-dd") && ["sick-leave", "vacation"].includes(r.status),
    ).length,
    workingRemote: attendanceRecords.filter(
      (r) => r.date === format(new Date(), "yyyy-MM-dd") && r.workType === "remote",
    ).length,
    attendanceRate: Math.round(
      (attendanceRecords.filter((r) => r.date === format(new Date(), "yyyy-MM-dd") && r.status === "present").length /
        employees.length) *
        100,
    ),
  }

  const departments = Array.from(new Set(attendanceRecords.map((record) => record.department)))
  const statuses = ["present", "absent", "late", "half-day", "on-leave"]
  const workTypes = ["office", "remote", "hybrid", "field"]

  if (loading && attendanceRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">
            Real-time attendance tracking and workforce management • {format(currentTime, "PPpp")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            System Online
          </Badge>
          <Button variant="outline" onClick={() => setIsManualEntryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
          <Button variant="outline" onClick={() => setIsBulkActionOpen(true)} disabled={selectedRecords.length === 0}>
            <Settings className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
          <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Present Today</p>
                  <p className="text-2xl font-bold text-blue-900">{attendanceSummary.presentToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={attendanceSummary.attendanceRate} className="h-2" />
                <p className="text-xs text-blue-600 mt-1">{attendanceSummary.attendanceRate}% attendance rate</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Online Now</p>
                  <p className="text-2xl font-bold text-green-900">{realTimeData.currentlyOnline}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5 from last hour
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Late Today</p>
                  <p className="text-2xl font-bold text-yellow-900">{attendanceSummary.lateToday}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -2 from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Remote Work</p>
                  <p className="text-2xl font-bold text-purple-900">{attendanceSummary.workingRemote}</p>
                </div>
                <Home className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 mt-2">
                {Math.round((attendanceSummary.workingRemote / attendanceSummary.totalEmployees) * 100)}% of workforce
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">On Break</p>
                  <p className="text-2xl font-bold text-orange-900">{realTimeData.onBreak}</p>
                </div>
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-orange-600 mt-2">Average break: 45 min</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Pending Approvals</p>
                  <p className="text-2xl font-bold text-red-900">{realTimeData.pendingApprovals}</p>
                </div>
                <Bell className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-xs text-red-600 mt-2">Requires attention</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <TabsList className="grid w-full lg:w-auto grid-cols-4">
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              Grid
            </Button>
          </div>
        </div>

        <TabsContent value="today" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
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
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[140px]">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Records */}
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={record.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {record.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{record.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.employeeId} • {record.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Check In</p>
                        <p className="text-sm text-muted-foreground">{formatTime(record.checkIn)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Check Out</p>
                        <p className="text-sm text-muted-foreground">{formatTime(record.checkOut)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Total Hours</p>
                        <p className="text-sm text-muted-foreground">{formatDuration(record.totalHours)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {record.notes && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Daily Attendance View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Daily View</h3>
                <p className="text-muted-foreground">Daily attendance view will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Overview of attendance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats?.attendanceRate}%</p>
                  <p className="text-sm text-muted-foreground">Overall Attendance</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats?.averageHours}</p>
                  <p className="text-sm text-muted-foreground">Average Hours</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{stats?.overtimeHours}</p>
                  <p className="text-sm text-muted-foreground">Overtime Hours</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{stats?.totalEmployees}</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Leave Requests Management
              </CardTitle>
              <CardDescription>Review and manage employee leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={request.employee.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{request.employee.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {request.employee.employeeId}
                          </Badge>
                          <Badge
                            className={
                              request.type === "vacation"
                                ? "bg-blue-100 text-blue-800"
                                : request.type === "sick"
                                  ? "bg-red-100 text-red-800"
                                  : request.type === "personal"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {request.type}
                          </Badge>
                          <Badge
                            className={
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {format(new Date(request.startDate), "MMM d")} -{" "}
                          {format(new Date(request.endDate), "MMM d, yyyy")} • {request.days} day
                          {request.days > 1 ? "s" : ""} {request.halfDay && "(Half Day)"}
                        </p>
                        <p className="text-sm">{request.reason}</p>
                        {request.rejectionReason && (
                          <Alert className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Rejection Reason:</strong> {request.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.status === "pending" && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Leave Request</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting {request.employee.name}'s leave request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="rejection-reason">Rejection Reason</Label>
                                  <Textarea
                                    id="rejection-reason"
                                    placeholder="Please provide a detailed reason for rejection..."
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button
                                    onClick={() =>
                                      handleRejectLeave(request.id, "Insufficient staffing during requested period")
                                    }
                                    disabled={loading}
                                  >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Reject Request
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveLeave(request.id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <div className="text-right">
                          <p className="text-sm text-green-600 font-medium">Approved</p>
                          <p className="text-xs text-muted-foreground">by {request.approvedBy}</p>
                        </div>
                      )}
                      {request.status === "rejected" && (
                        <div className="text-right">
                          <p className="text-sm text-red-600 font-medium">Rejected</p>
                          <p className="text-xs text-muted-foreground">by {request.approvedBy}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manual Entry Dialog */}
      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manual Attendance Entry</DialogTitle>
            <DialogDescription>Add or modify attendance records manually</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual-employee">Employee</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="manual-date">Date</Label>
                <Input type="date" className="mt-1" defaultValue={format(selectedDate, "yyyy-MM-dd")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual-checkin">Check In Time</Label>
                <Input type="time" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="manual-checkout">Check Out Time</Label>
                <Input type="time" className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual-status">Status</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                    <SelectItem value="sick-leave">Sick Leave</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="work-from-home">Work from Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="manual-worktype">Work Type</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="field">Field Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="manual-notes">Notes (Optional)</Label>
              <Textarea className="mt-1" placeholder="Add any additional notes or comments..." />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsManualEntryOpen(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>Apply actions to {selectedRecords.length} selected records</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleBulkAction("Mark as Present")} disabled={loading}>
                <UserCheck className="mr-2 h-4 w-4" />
                Mark as Present
              </Button>
              <Button variant="outline" onClick={() => handleBulkAction("Mark as Absent")} disabled={loading}>
                <UserX className="mr-2 h-4 w-4" />
                Mark as Absent
              </Button>
              <Button variant="outline" onClick={() => handleBulkAction("Export Selected")} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Button variant="outline" onClick={() => handleBulkAction("Send Notification")} disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedEmployee.name.split(" ").map((n) => n[0])}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.position} • {selectedEmployee.department}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Employee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span>{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager:</span>
                      <span>{selectedEmployee.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedEmployee.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        className={
                          selectedEmployee.status === "active"
                            ? "bg-green-100 text-green-800"
                            : selectedEmployee.status === "on-leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {selectedEmployee.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Work Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Time:</span>
                      <span>{selectedEmployee.workSchedule.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Time:</span>
                      <span>{selectedEmployee.workSchedule.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Work Days:</span>
                      <span>{selectedEmployee.workSchedule.workDays.length} days/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timezone:</span>
                      <span>{selectedEmployee.workSchedule.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Recent Attendance</h4>
                <div className="space-y-2">
                  {attendanceRecords
                    .filter((r) => r.employeeId === selectedEmployee.id)
                    .slice(0, 5)
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(record.status)}
                          <div>
                            <p className="font-medium">{format(new Date(record.date), "EEEE, MMM d")}</p>
                            <p className="text-sm text-muted-foreground">
                              {record.checkIn && record.checkOut
                                ? `${record.checkIn} - ${record.checkOut}`
                                : record.checkIn
                                  ? `Checked in at ${record.checkIn}`
                                  : "No check-in recorded"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(record.status)}>{record.status.replace("-", " ")}</Badge>
                          {(record.totalHours || 0) > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">{formatDuration(record.totalHours)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
