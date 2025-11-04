"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Download,
  FileText,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  FolderOpen,
  Lock,
  TrendingUp,
  FileCheck,
  AlertCircle,
} from "lucide-react"

export function DocumentsManagementContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage employee documents with AI extraction and blockchain verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/20">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              1,247
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">23</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Action needed
              </Badge>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">5</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
              <p className="text-xs text-muted-foreground">Require renewal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">892</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <FileCheck className="h-3 w-3 mr-1" />
                71.5%
              </Badge>
              <p className="text-xs text-muted-foreground">Blockchain verified</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="backdrop-blur-sm bg-linear-to-br from-blue-500/10 to-purple-500/10 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-purple-500">
              <FileCheck className="h-4 w-4 text-white" />
            </div>
            AI Document Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Compliance Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    23 I-9 documents expiring in next 30 days. Schedule renewals to maintain compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">AI Extraction</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    156 documents processed with 98.5% accuracy. Auto-populated 342 employee fields.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Blockchain Verified</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    892 documents verified on blockchain. 100% tamper-proof audit trail maintained.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="backdrop-blur-sm bg-white/50 border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="esign">E-Signatures</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Documents</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/20">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 border-white/20">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "Offer Letter - John Doe",
                    type: "OFFER",
                    employee: "John Doe",
                    date: "2025-01-15",
                    status: "valid",
                    verified: true,
                  },
                  {
                    title: "Passport - Jane Smith",
                    type: "ID",
                    employee: "Jane Smith",
                    date: "2024-12-20",
                    status: "valid",
                    verified: true,
                  },
                  {
                    title: "H1B Approval - Bob Wilson",
                    type: "VISA",
                    employee: "Bob Wilson",
                    date: "2024-11-10",
                    status: "expiring",
                    verified: false,
                  },
                  {
                    title: "I-9 Form - Alice Johnson",
                    type: "I9",
                    employee: "Alice Johnson",
                    date: "2024-10-05",
                    status: "valid",
                    verified: true,
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-purple-500">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{doc.employee}</p>
                          <span className="text-muted-foreground">•</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          {doc.verified && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Verified</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            doc.status === "valid"
                              ? "bg-green-100 text-green-700"
                              : doc.status === "expiring"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {doc.status === "valid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {doc.status === "expiring" && <Clock className="h-3 w-3 mr-1" />}
                          {doc.status === "expired" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {doc.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{doc.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Document Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "Contracts", count: 234, icon: FileText, color: "blue" },
                  { name: "Identification", count: 456, icon: Shield, color: "green" },
                  { name: "Immigration", count: 123, icon: Lock, color: "purple" },
                  { name: "Benefits", count: 189, icon: FileCheck, color: "orange" },
                  { name: "Policies", count: 67, icon: FolderOpen, color: "pink" },
                  { name: "Offers", count: 178, icon: FileText, color: "indigo" },
                ].map((folder, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${folder.color}-100`}>
                        <folder.icon className={`h-6 w-6 text-${folder.color}-600`} />
                      </div>
                      <Badge variant="secondary">{folder.count}</Badge>
                    </div>
                    <h3 className="font-semibold">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{folder.count} documents</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Company Policies</CardTitle>
                <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white">Create Policy</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "Code of Conduct",
                    version: 3,
                    published: "2025-01-01",
                    ackRate: 95,
                    status: "active",
                  },
                  {
                    title: "Remote Work Policy",
                    version: 2,
                    published: "2024-12-15",
                    ackRate: 87,
                    status: "active",
                  },
                  {
                    title: "Data Privacy Policy",
                    version: 4,
                    published: "2024-11-20",
                    ackRate: 100,
                    status: "active",
                  },
                ].map((policy, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20"
                  >
                    <div>
                      <p className="font-medium">{policy.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Version {policy.version} • Published {policy.published}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{policy.ackRate}% Acknowledged</p>
                        <Badge
                          variant="secondary"
                          className={
                            policy.ackRate === 100
                              ? "bg-green-100 text-green-700"
                              : policy.ackRate >= 90
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                          }
                        >
                          {policy.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="esign" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>E-Signature Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "Employment Agreement - Sarah Lee",
                    recipients: 2,
                    signed: 1,
                    status: "pending",
                    date: "2025-01-20",
                  },
                  {
                    title: "NDA - Michael Chen",
                    recipients: 3,
                    signed: 3,
                    status: "completed",
                    date: "2025-01-18",
                  },
                  {
                    title: "Offer Letter - David Park",
                    recipients: 2,
                    signed: 0,
                    status: "sent",
                    date: "2025-01-19",
                  },
                ].map((esign, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20"
                  >
                    <div>
                      <p className="font-medium">{esign.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {esign.signed}/{esign.recipients} signed • Sent {esign.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className={
                          esign.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : esign.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                        }
                      >
                        {esign.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
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
