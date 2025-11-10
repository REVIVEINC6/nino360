import { Shield, Lock, Key, AlertTriangle, Brain } from "lucide-react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getAuditChain, verifyAuditChain, getAnchors } from "../actions/security"
import { getDlpFindings } from "../actions/dlp"
import { getLegalHolds } from "../actions/exports"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function SecurityPage() {
  const [
    _auditChain,
    _chainVerification,
    _anchors,
    _dlpFindings,
    _legalHolds,
  ] = await Promise.all([
    getAuditChain(50),
    verifyAuditChain(),
    getAnchors(),
    getDlpFindings({ status: "open", limit: 10 }),
    getLegalHolds(),
  ])

  // Staged: unwrap/normalize results from server actions (Supabase may return ParserError types)
  const auditChain = (_auditChain as any) || []
  const chainVerification = (_chainVerification as any) || { valid: false }
  const anchors = (_anchors as any) || []
  const dlpFindings = (_dlpFindings as any) || []
  const legalHolds = (_legalHolds as any) || []

  const stats = {
    auditRecords: auditChain.length,
    chainValid: chainVerification.valid,
    anchors: anchors.length,
  openFindings: dlpFindings.filter((f: any) => f.status === "open").length,
  criticalFindings: dlpFindings.filter((f: any) => f.severity === "critical").length,
  activeLegalHolds: legalHolds.filter((h: any) => h.status === "active").length,
  }

  const securityScore = Math.round(
    (stats.chainValid ? 25 : 0) +
      (stats.criticalFindings === 0 ? 25 : Math.max(0, 25 - stats.criticalFindings * 5)) +
      (stats.openFindings < 5 ? 25 : Math.max(0, 25 - stats.openFindings * 2)) +
      (stats.anchors > 0 ? 25 : 0),
  )

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Security & Compliance
          </h1>
          <p className="text-muted-foreground mt-2">Enterprise-grade security controls and compliance monitoring</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card group hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Chain</CardTitle>
              <div className="rounded-full bg-linear-to-r from-indigo-500 to-purple-500 p-2">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.auditRecords}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.chainValid ? (
                  <span className="text-green-600 font-medium">✓ Chain verified</span>
                ) : (
                  <span className="text-red-600 font-medium">⚠ Chain broken</span>
                )}
              </p>
            </CardContent>
          </div>

          <div className="glass-card group hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Anchors</CardTitle>
              <div className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 p-2">
                <Lock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.anchors}</div>
              <p className="text-xs text-muted-foreground mt-1">Immutable proof records</p>
            </CardContent>
          </div>

          <div className="glass-card group hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DLP Findings</CardTitle>
              <div className="rounded-full bg-linear-to-r from-orange-500 to-red-500 p-2">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openFindings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-red-600 font-medium">{stats.criticalFindings} critical</span>
              </p>
            </CardContent>
          </div>

          <div className="glass-card group hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Legal Holds</CardTitle>
              <div className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 p-2">
                <Key className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLegalHolds}</div>
              <p className="text-xs text-muted-foreground mt-1">Active preservation orders</p>
            </CardContent>
          </div>
        </div>

        <div className="glass-card border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Security Insights
              </CardTitle>
            </div>
            <CardDescription>Real-time security posture analysis powered by ML</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Security Score</span>
                <span
                  className={`text-lg font-bold ${securityScore >= 80 ? "text-green-600" : securityScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {securityScore}%
                </span>
              </div>
              <Progress value={securityScore} className="h-2" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Chain Integrity</span>
                  <span className="text-xs font-medium">{stats.chainValid ? "100%" : "0%"}</span>
                </div>
                <Progress value={stats.chainValid ? 100 : 0} className="h-1" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">DLP Compliance</span>
                  <span className="text-xs font-medium">{Math.max(0, 100 - stats.openFindings * 10)}%</span>
                </div>
                <Progress value={Math.max(0, 100 - stats.openFindings * 10)} className="h-1" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Blockchain Coverage</span>
                  <span className="text-xs font-medium">{stats.anchors > 0 ? "100%" : "0%"}</span>
                </div>
                <Progress value={stats.anchors > 0 ? 100 : 0} className="h-1" />
              </div>
            </div>

            {stats.criticalFindings > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Critical Security Alert</p>
                  <p className="text-xs text-red-700 mt-1">
                    {stats.criticalFindings} critical DLP finding{stats.criticalFindings > 1 ? "s" : ""} require
                    immediate attention
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </div>

  <Tabs defaultValue="audit" className="space-y-4">
          <TabsList className="glass-card">
            <TabsTrigger value="audit">Audit Chain</TabsTrigger>
            <TabsTrigger value="anchors">Blockchain Anchors</TabsTrigger>
            <TabsTrigger value="dlp">DLP Findings</TabsTrigger>
            <TabsTrigger value="legal">Legal Holds</TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-4">
            <div className="glass-card">
              <CardHeader>
                <CardTitle>Recent Audit Events</CardTitle>
                <CardDescription>Cryptographically chained audit log with tamper detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditChain.slice(0, 10).map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between border-b border-white/20 pb-2 hover:bg-white/30 rounded px-2 transition-colors"
                    >
                      <div>
                        <p className="font-medium">
                          {record.module}.{record.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.resource} by {record.actor?.email || "System"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{new Date(record.created_at).toLocaleString()}</p>
                        <p className="text-xs font-mono text-purple-600">{record.curr_hash.substring(0, 12)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="anchors" className="space-y-4">
            <div className="glass-card">
              <CardHeader>
                <CardTitle>Blockchain Anchors</CardTitle>
                <CardDescription>Periodic anchoring to public blockchain for immutable proof</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {anchors.map((anchor: any) => (
                    <div
                      key={anchor.id}
                      className="flex items-center justify-between border-b border-white/20 pb-2 hover:bg-white/30 rounded px-2 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{anchor.chain.toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {anchor.merkle_root.substring(0, 20)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{new Date(anchor.anchored_at).toLocaleString()}</p>
                        {anchor.tx_id && (
                          <p className="text-xs font-mono text-blue-600">TX: {anchor.tx_id.substring(0, 12)}...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="dlp" className="space-y-4">
            <div className="glass-card">
              <CardHeader>
                <CardTitle>Open DLP Findings</CardTitle>
                <CardDescription>Data loss prevention alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dlpFindings.map((finding: any) => (
                    <div
                      key={finding.id}
                      className="flex items-center justify-between border-b border-white/20 pb-2 hover:bg-white/30 rounded px-2 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{finding.detector}</p>
                        <p className="text-sm text-muted-foreground">{finding.location}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            finding.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : finding.severity === "high"
                                ? "bg-orange-100 text-orange-700"
                                : finding.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <div className="glass-card">
              <CardHeader>
                <CardTitle>Legal Holds</CardTitle>
                <CardDescription>Data preservation orders for litigation or investigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {legalHolds.map((hold: any) => (
                    <div
                      key={hold.id}
                      className="flex items-center justify-between border-b border-white/20 pb-2 hover:bg-white/30 rounded px-2 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{hold.case_name}</p>
                        <p className="text-sm text-muted-foreground">{hold.description}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            hold.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {hold.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(hold.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TwoPane>
  )
}
