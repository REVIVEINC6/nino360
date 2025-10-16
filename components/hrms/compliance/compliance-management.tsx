"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, AlertTriangle, Clock, Shield } from "lucide-react"
import useSWR from "swr"
import { getOverview } from "@/app/(dashboard)/hrms/compliance/actions"

export function ComplianceManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  const { data: kpis, error } = useSWR(
    "compliance-overview",
    async () => {
      const result = await getOverview()
      return result.success ? result.data : null
    },
    { refreshInterval: 30000 },
  )

  if (error) {
    return <div className="text-red-500">Error loading compliance data</div>
  }

  if (!kpis) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
          <p className="text-muted-foreground">Manage policies, training, I-9/immigration, retention, and evidence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Ack %</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.policyAckPct}%</div>
            <p className="text-xs text-muted-foreground">acknowledged / assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">I-9 On-time %</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.i9OnTimePct}%</div>
            <p className="text-xs text-muted-foreground">S1 & S2 within deadlines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Immigration Expiries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.immigrationExpiries}</div>
            <p className="text-xs text-muted-foreground">≤30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training %</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.trainingCompletionPct}%</div>
            <p className="text-xs text-muted-foreground">completed / due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Background Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.backgroundPending}</div>
            <p className="text-xs text-muted-foreground">pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{kpis.exceptionsOpen}</div>
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
            <p className="text-xs text-muted-foreground">open</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="obligations">Obligations</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Key metrics and trends across all compliance areas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Overview dashboard with trend charts, top overdue items, and risk panel will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obligations" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Obligations</CardTitle>
              <CardDescription>Track policy acknowledgments, training, I-9, immigration, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Obligations board with filters and quick actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Unified task list with SLA badges and inline actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Task table with complete/block/reassign actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Link documents and URLs, verify hashes, and notarize</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Evidence table with hash verification and notarization will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Controls & Frameworks</CardTitle>
              <CardDescription>Map controls to artifacts and track compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Control mapping with framework selection and status tracking will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Exceptions</CardTitle>
              <CardDescription>Manage compliance exceptions with approvals and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Exception table with open/waive/mitigate/close actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>View compliance action history with hash-chain verification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Audit log filtered by compliance actions will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
