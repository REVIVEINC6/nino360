"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  AlertTriangle,
  FileText,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import {
  getImmigrationCases,
  getI9Records,
  getImmigrationAlerts,
  getImmigrationAnalytics,
  type ImmigrationCase,
  type I9Record,
  type ImmigrationAlert,
} from "@/app/(dashboard)/hrms/immigration/actions"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ImmigrationManagementContent() {
  const [cases, setCases] = useState<ImmigrationCase[]>([])
  const [i9Records, setI9Records] = useState<I9Record[]>([])
  const [alerts, setAlerts] = useState<ImmigrationAlert[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [casesRes, i9Res, alertsRes, analyticsRes] = await Promise.all([
      getImmigrationCases(),
      getI9Records(),
      getImmigrationAlerts({ resolved: false }),
      getImmigrationAnalytics(),
    ])

    if (casesRes.data) setCases(casesRes.data)
    if (i9Res.data) setI9Records(i9Res.data)
    if (alertsRes.data) setAlerts(alertsRes.data)
    if (analyticsRes.data) setAnalytics(analyticsRes.data)
    setLoading(false)
  }

  const activeCases = cases.filter((c) => c.status === "filed" || c.status === "pending")
  const expiringSoon = cases.filter((c) => {
    if (!c.expiry_date) return false
    const expiryDate = new Date(c.expiry_date)
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
    return expiryDate <= ninetyDaysFromNow && expiryDate >= new Date()
  })
  const rfePending = cases.filter((c) => c.rfe_response_due_date && new Date(c.rfe_response_due_date) >= new Date())

  // Chart data
  const caseTypeData = [
    { name: "H1B", value: cases.filter((c) => c.case_type === "H1B").length },
    { name: "L1", value: cases.filter((c) => c.case_type === "L1").length },
    { name: "Green Card", value: cases.filter((c) => c.case_type === "Green Card").length },
    { name: "TN", value: cases.filter((c) => c.case_type === "TN").length },
    { name: "Other", value: cases.filter((c) => !["H1B", "L1", "Green Card", "TN"].includes(c.case_type)).length },
  ]

  const statusData = [
    { name: "Draft", value: cases.filter((c) => c.status === "draft").length },
    { name: "Filed", value: cases.filter((c) => c.status === "filed").length },
    { name: "Approved", value: cases.filter((c) => c.status === "approved").length },
    { name: "Denied", value: cases.filter((c) => c.status === "denied").length },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Immigration & I-9 Compliance
            </h1>
            <p className="text-gray-600 mt-1">Track visa cases, I-9 records, and compliance</p>
          </div>
          <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeCases.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {cases.filter((c) => c.status === "pending").length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting USCIS</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{expiringSoon.length}</div>
              <p className="text-xs text-gray-500 mt-1">Next 90 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                RFEs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{rfePending.length}</div>
              <p className="text-xs text-gray-500 mt-1">Require response</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-linear-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Expiration Alert</p>
                <p className="text-sm text-gray-600">
                  {expiringSoon.length} visa{expiringSoon.length !== 1 ? "s" : ""} expiring in the next 90 days. Start
                  renewal process immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Approval Rate</p>
                <p className="text-sm text-gray-600">
                  Your H1B approval rate is 94%, which is above the national average of 87%.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">I-9 Compliance</p>
                <p className="text-sm text-gray-600">
                  {i9Records.filter((r) => r.status === "complete").length} of {i9Records.length} I-9 forms completed.{" "}
                  {i9Records.filter((r) => r.status === "pending").length} pending.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="cases" className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-gray-200 p-1">
            <TabsTrigger
              value="cases"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Immigration Cases
            </TabsTrigger>
            <TabsTrigger
              value="i9"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              I-9 Records
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cases.slice(0, 10).map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {case_.employee?.first_name} {case_.employee?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {case_.case_type} • {case_.attorney_firm || "No attorney"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge
                            variant={
                              case_.status === "approved"
                                ? "default"
                                : case_.status === "denied"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {case_.status}
                          </Badge>
                          {case_.expiry_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Expires: {new Date(case_.expiry_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {case_.rfe_response_due_date && new Date(case_.rfe_response_due_date) >= new Date() && (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="i9" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>I-9 Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {i9Records.slice(0, 10).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {record.employee?.first_name} {record.employee?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{record.citizenship_status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            record.status === "complete"
                              ? "default"
                              : record.status === "expired"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                        {record.status === "complete" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : record.status === "expired" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                    >
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          alert.severity === "critical"
                            ? "text-red-600"
                            : alert.severity === "high"
                              ? "text-orange-600"
                              : "text-yellow-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800">{alert.alert_type}</p>
                          <Badge
                            variant={
                              alert.severity === "critical"
                                ? "destructive"
                                : alert.severity === "high"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        {alert.action_required && (
                          <p className="text-sm text-blue-600 mt-2">Action: {alert.action_required}</p>
                        )}
                        {alert.due_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(alert.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Cases by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={caseTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(p: any) => `${p.name} ${((Number(p.percent) || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {caseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Cases by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
