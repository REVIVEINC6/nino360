"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Shield,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
} from "lucide-react"

export function VMSModule() {
  const [searchTerm, setSearchTerm] = useState("")

  const vmsMetrics = {
    activeVendors: 156,
    complianceRate: 94.2,
    avgResponseTime: 2.3,
    totalSubmissions: 1247,
    approvedVendors: 142,
    pendingApprovals: 14,
  }

  const vendorCategories = [
    { name: "Technology Services", count: 45, compliance: 96, performance: 4.8 },
    { name: "Consulting", count: 38, compliance: 92, performance: 4.6 },
    { name: "Staffing Agencies", count: 42, compliance: 95, performance: 4.7 },
    { name: "Professional Services", count: 31, compliance: 91, performance: 4.5 },
  ]

  const recentSubmissions = [
    {
      id: 1,
      vendor: "TechStaff Solutions",
      candidate: "John Smith",
      position: "Senior React Developer",
      client: "FinTech Corp",
      submittedDate: "2024-01-15",
      status: "under_review",
    },
    {
      id: 2,
      vendor: "Global Consulting",
      candidate: "Sarah Johnson",
      position: "DevOps Engineer",
      client: "StartupXYZ",
      submittedDate: "2024-01-14",
      status: "approved",
    },
    {
      id: 3,
      vendor: "Elite Recruiters",
      candidate: "Mike Chen",
      position: "Full Stack Developer",
      client: "Enterprise Inc",
      submittedDate: "2024-01-13",
      status: "rejected",
    },
  ]

  const complianceItems = [
    { item: "Insurance Documentation", status: "compliant", vendors: 142 },
    { item: "W9 Forms", status: "compliant", vendors: 138 },
    { item: "MSA Agreements", status: "warning", vendors: 134 },
    { item: "Background Checks", status: "compliant", vendors: 156 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "under_review":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "non_compliant":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{vmsMetrics.activeVendors}</div>
            <p className="text-xs text-muted-foreground">Registered vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vmsMetrics.complianceRate}%</div>
            <Progress value={vmsMetrics.complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vmsMetrics.avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vmsMetrics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Vendors</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vmsMetrics.approvedVendors}</div>
            <p className="text-xs text-muted-foreground">Fully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{vmsMetrics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors or submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendor Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Categories</CardTitle>
                <CardDescription>Breakdown by service type and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendorCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category.count} vendors</Badge>
                        <span className="text-sm text-muted-foreground">{category.performance}★</span>
                      </div>
                    </div>
                    <Progress value={category.compliance} className="h-2" />
                    <div className="text-xs text-muted-foreground">{category.compliance}% compliance rate</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest candidate submissions from vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{submission.candidate}</p>
                          <p className="text-xs text-muted-foreground">{submission.position}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{submission.vendor}</Badge>
                            <span className="text-xs text-muted-foreground">{submission.client}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status.replace("_", " ")}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>Manage your vendor network and relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vendor Directory</h3>
                <p className="text-muted-foreground mb-4">Comprehensive vendor management interface coming soon</p>
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Vendors
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Submissions</CardTitle>
              <CardDescription>Review and manage candidate submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Submission Management</h3>
                <p className="text-muted-foreground mb-4">Advanced submission tracking interface coming soon</p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  View Submissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
              <CardDescription>Monitor vendor compliance across all requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-muted-foreground">{item.vendors} vendors</p>
                    </div>
                    <Badge className={getComplianceColor(item.status)}>
                      {item.status === "compliant" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {item.status === "warning" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
