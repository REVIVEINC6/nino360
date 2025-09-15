"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Users,
  DollarSign,
  CheckSquare,
  TrendingUp,
  Calendar,
  FileText,
  UserCheck,
  Briefcase,
  CreditCard,
  Activity,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Phone,
  Star,
} from "lucide-react"

interface SampleDataStats {
  tenants: number
  users: number
  totalPipeline: number
  activeTasks: number
  completedActivities: number
  pendingNotifications: number
}

interface CRMData {
  leads: Array<{
    id: string
    name: string
    company: string
    value: number
    status: string
    probability: number
    lastContact: string
  }>
  opportunities: Array<{
    id: string
    title: string
    value: number
    stage: string
    probability: number
    closeDate: string
  }>
  activities: Array<{
    id: string
    type: string
    subject: string
    contact: string
    date: string
    status: string
  }>
}

interface HRData {
  employees: Array<{
    id: string
    name: string
    position: string
    department: string
    status: string
    hireDate: string
  }>
  candidates: Array<{
    id: string
    name: string
    position: string
    stage: string
    score: number
    appliedDate: string
  }>
  positions: Array<{
    id: string
    title: string
    department: string
    status: string
    applicants: number
  }>
}

interface FinanceData {
  invoices: Array<{
    id: string
    customer: string
    amount: number
    status: string
    dueDate: string
  }>
  payments: Array<{
    id: string
    amount: number
    method: string
    date: string
    status: string
  }>
  expenses: Array<{
    id: string
    description: string
    amount: number
    category: string
    date: string
  }>
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  user: string
  timestamp: string
  priority: string
  module: string
}

export function SampleDataDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data stats based on the loaded data
  const stats: SampleDataStats = {
    tenants: 2,
    users: 5,
    totalPipeline: 700000,
    activeTasks: 2,
    completedActivities: 2,
    pendingNotifications: 3,
  }

  // CRM sample data
  const crmData: CRMData = {
    leads: [
      {
        id: "1",
        name: "John Smith",
        company: "TechCorp Solutions",
        value: 250000,
        status: "qualified",
        probability: 75,
        lastContact: "2024-01-15",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        company: "Innovation Labs",
        value: 150000,
        status: "proposal",
        probability: 60,
        lastContact: "2024-01-14",
      },
      {
        id: "3",
        name: "Mike Chen",
        company: "Global Enterprises",
        value: 300000,
        status: "negotiation",
        probability: 80,
        lastContact: "2024-01-13",
      },
    ],
    opportunities: [
      {
        id: "1",
        title: "Enterprise Software Solution",
        value: 250000,
        stage: "Proposal",
        probability: 75,
        closeDate: "2024-02-15",
      },
      {
        id: "2",
        title: "Cloud Migration Project",
        value: 150000,
        stage: "Discovery",
        probability: 60,
        closeDate: "2024-03-01",
      },
      {
        id: "3",
        title: "SaaS Platform Opportunity",
        value: 300000,
        stage: "Negotiation",
        probability: 80,
        closeDate: "2024-02-28",
      },
    ],
    activities: [
      {
        id: "1",
        type: "call",
        subject: "Discovery Call - TechCorp",
        contact: "John Smith",
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: "2",
        type: "meeting",
        subject: "Proposal Review Meeting",
        contact: "Sarah Johnson",
        date: "2024-01-16",
        status: "scheduled",
      },
    ],
  }

  // HR sample data
  const hrData: HRData = {
    employees: [
      {
        id: "1",
        name: "Alice Johnson",
        position: "Software Engineer",
        department: "Engineering",
        status: "active",
        hireDate: "2023-06-15",
      },
      {
        id: "2",
        name: "Bob Wilson",
        position: "Sales Manager",
        department: "Sales",
        status: "active",
        hireDate: "2023-08-01",
      },
    ],
    candidates: [
      {
        id: "1",
        name: "Emma Davis",
        position: "Frontend Developer",
        stage: "interview",
        score: 85,
        appliedDate: "2024-01-10",
      },
      {
        id: "2",
        name: "David Brown",
        position: "Marketing Specialist",
        stage: "screening",
        score: 78,
        appliedDate: "2024-01-12",
      },
    ],
    positions: [
      {
        id: "1",
        title: "Frontend Developer",
        department: "Engineering",
        status: "open",
        applicants: 12,
      },
      {
        id: "2",
        title: "Marketing Specialist",
        department: "Marketing",
        status: "open",
        applicants: 8,
      },
    ],
  }

  // Finance sample data
  const financeData: FinanceData = {
    invoices: [
      {
        id: "INV-001",
        customer: "TechCorp Solutions",
        amount: 25000,
        status: "paid",
        dueDate: "2024-01-15",
      },
      {
        id: "INV-002",
        customer: "Innovation Labs",
        amount: 15000,
        status: "draft",
        dueDate: "2024-02-01",
      },
    ],
    payments: [
      {
        id: "PAY-001",
        amount: 25000,
        method: "bank_transfer",
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: "PAY-002",
        amount: 2500,
        method: "credit_card",
        date: "2024-01-14",
        status: "completed",
      },
    ],
    expenses: [
      {
        id: "EXP-001",
        description: "Office Supplies",
        amount: 125,
        category: "Office",
        date: "2024-01-10",
      },
      {
        id: "EXP-002",
        description: "Software License",
        amount: 100,
        category: "Software",
        date: "2024-01-12",
      },
    ],
  }

  // Recent activities based on loaded data
  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "activity",
      title: "Discovery Call Completed",
      description: "Completed discovery call with TechCorp Solutions",
      user: "John Smith",
      timestamp: "2 hours ago",
      priority: "high",
      module: "CRM",
    },
    {
      id: "2",
      type: "notification",
      title: "New Lead Assigned",
      description: "Lead from Innovation Labs assigned to sales team",
      user: "System",
      timestamp: "4 hours ago",
      priority: "medium",
      module: "CRM",
    },
    {
      id: "3",
      type: "task",
      title: "Follow-up Required",
      description: "Follow up with Global Enterprises on proposal",
      user: "Sarah Johnson",
      timestamp: "6 hours ago",
      priority: "high",
      module: "CRM",
    },
    {
      id: "4",
      type: "notification",
      title: "Interview Scheduled",
      description: "Interview scheduled with Emma Davis for Frontend Developer position",
      user: "HR Team",
      timestamp: "1 day ago",
      priority: "medium",
      module: "Talent",
    },
    {
      id: "5",
      type: "task",
      title: "Proposal Preparation",
      description: "Prepare proposal for SaaS Platform Opportunity",
      user: "Mike Chen",
      timestamp: "1 day ago",
      priority: "high",
      module: "CRM",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "paid":
      case "qualified":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
      case "scheduled":
      case "proposal":
      case "draft":
        return "bg-yellow-100 text-yellow-700"
      case "inactive":
      case "cancelled":
      case "overdue":
        return "bg-red-100 text-red-700"
      case "negotiation":
      case "interview":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Tenants</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.tenants}</p>
                  <p className="text-sm text-blue-600 mt-1">TechCorp & StartupXYZ</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.users}</p>
                  <p className="text-sm text-emerald-600 mt-1">All active accounts</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Sales Pipeline</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">${(stats.totalPipeline / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-purple-600 mt-1">3 active opportunities</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Tasks</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeTasks}</p>
                  <p className="text-sm text-orange-600 mt-1">High priority items</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl">
                  <CheckSquare className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="mt-1">{getPriorityIcon(activity.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-slate-900">{activity.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.module}
                        </Badge>
                        <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-500">{activity.user}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )

  const renderCRMData = () => (
    <div className="space-y-6">
      {/* Sales Pipeline */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sales Pipeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crmData.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-slate-900">{opportunity.title}</h4>
                    <p className="text-sm text-slate-600">Close Date: {opportunity.closeDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">${opportunity.value.toLocaleString()}</p>
                    <Badge className={getStatusColor(opportunity.stage)}>{opportunity.stage}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Probability</span>
                    <span>{opportunity.probability}%</span>
                  </div>
                  <Progress value={opportunity.probability} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crmData.leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-slate-900">{lead.name}</h4>
                    <p className="text-sm text-slate-600">{lead.company}</p>
                    <p className="text-xs text-slate-500">Last contact: {lead.lastContact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">${lead.value.toLocaleString()}</p>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  <p className="text-xs text-slate-500 mt-1">{lead.probability}% probability</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent CRM Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crmData.activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
                <div className="p-2 rounded-lg bg-blue-50">
                  {activity.type === "call" ? (
                    <Phone className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Calendar className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{activity.subject}</h4>
                  <p className="text-sm text-slate-600">Contact: {activity.contact}</p>
                  <p className="text-xs text-slate-500">Date: {activity.date}</p>
                </div>
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHRData = () => (
    <div className="space-y-6">
      {/* Employee Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Active Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrData.employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-slate-900">{employee.name}</h4>
                    <p className="text-sm text-slate-600">{employee.position}</p>
                    <p className="text-xs text-slate-500">Hired: {employee.hireDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{employee.department}</p>
                  <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Positions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrData.positions.map((position) => (
              <div
                key={position.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{position.title}</h4>
                  <p className="text-sm text-slate-600">{position.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{position.applicants} applicants</p>
                  <Badge className={getStatusColor(position.status)}>{position.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Candidates Pipeline */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrData.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-slate-900">{candidate.name}</h4>
                    <p className="text-sm text-slate-600">{candidate.position}</p>
                    <p className="text-xs text-slate-500">Applied: {candidate.appliedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{candidate.score}/100</span>
                  </div>
                  <Badge className={getStatusColor(candidate.stage)}>{candidate.stage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderFinanceData = () => (
    <div className="space-y-6">
      {/* Invoices */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeData.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{invoice.id}</h4>
                  <p className="text-sm text-slate-600">{invoice.customer}</p>
                  <p className="text-xs text-slate-500">Due: {invoice.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${invoice.amount.toLocaleString()}</p>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeData.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{payment.id}</h4>
                  <p className="text-sm text-slate-600 capitalize">{payment.method.replace("_", " ")}</p>
                  <p className="text-xs text-slate-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">${payment.amount.toLocaleString()}</p>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeData.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{expense.description}</h4>
                  <p className="text-sm text-slate-600">{expense.category}</p>
                  <p className="text-xs text-slate-500">{expense.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">${expense.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Sample Data Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Overview of loaded sample data across all business modules</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            Data Loaded Successfully
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crm">CRM Data</TabsTrigger>
          <TabsTrigger value="hr">HR & Talent</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
          {renderCRMData()}
        </TabsContent>

        <TabsContent value="hr" className="space-y-6">
          {renderHRData()}
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          {renderFinanceData()}
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                All Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="mt-1">{getPriorityIcon(activity.priority)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-slate-900">{activity.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.module}
                            </Badge>
                            <span className="text-xs text-slate-500">{activity.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-500">{activity.user}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
