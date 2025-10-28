"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import useSWR from "swr"
import { getOverview } from "@/app/(dashboard)/hrms/compliance/actions"

export function ComplianceManagementContent() {
  const [activeTab, setActiveTab] = useState("overview")

  const { data: kpis, error } = useSWR(
    "compliance-overview",
    async () => {
      const result = await getOverview({})
      return result.success ? result.data : null
    },
    { refreshInterval: 30000 },
  )

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error loading compliance data</div>
      </div>
    )
  }

  if (!kpis) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="glass-card rounded-2xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Compliance Management
            </h1>
            <p className="mt-1 text-gray-600">Track and manage HR compliance requirements and audits</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/20 bg-white/50 backdrop-blur-sm hover:bg-white/70">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Policy Ack %</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.policyAckPct}%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>acknowledged / assigned</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">I-9 On-time %</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.i9OnTimePct}%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>S1 & S2 within deadlines</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Immigration Expiries</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.immigrationExpiries}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <AlertTriangle className="h-3 w-3 text-orange-600" />
              <span>≤30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Training %</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.trainingCompletionPct}%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>completed / due</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Background Checks</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.backgroundPending}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <Clock className="h-3 w-3 text-gray-600" />
              <span>pending</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-gray-900">{kpis.exceptionsOpen}</div>
              <Badge
                variant={
                  kpis.exceptionsRisk === "CRITICAL"
                    ? "destructive"
                    : kpis.exceptionsRisk === "HIGH"
                      ? "destructive"
                      : kpis.exceptionsRisk === "MEDIUM"
                        ? "default"
                        : "secondary"
                }
              >
                {kpis.exceptionsRisk}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span>open</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="obligations">Obligations</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Compliance Overview</CardTitle>
              <CardDescription className="text-gray-600">
                Key metrics and trends across all compliance areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Overview dashboard with trend charts, top overdue items, and risk panel will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obligations" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Obligations</CardTitle>
              <CardDescription className="text-gray-600">
                Track policy acknowledgments, training, I-9, immigration, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Obligations board with filters and quick actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Tasks</CardTitle>
              <CardDescription className="text-gray-600">
                Unified task list with SLA badges and inline actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Task table with complete/block/reassign actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Evidence</CardTitle>
              <CardDescription className="text-gray-600">
                Link documents and URLs, verify hashes, and notarize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Evidence table with hash verification and notarization will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Controls & Frameworks</CardTitle>
              <CardDescription className="text-gray-600">
                Map controls to artifacts and track compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Control mapping with framework selection and status tracking will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Exceptions</CardTitle>
              <CardDescription className="text-gray-600">
                Manage compliance exceptions with approvals and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Exception table with open/waive/mitigate/close actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="flex-1">
          <Card className="glass-card border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">Audit Trail</CardTitle>
              <CardDescription className="text-gray-600">
                View compliance action history with hash-chain verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Audit log filtered by compliance actions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
