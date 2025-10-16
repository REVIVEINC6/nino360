import { Shield, Lock, Key, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAuditChain, verifyAuditChain, getAnchors } from "../actions/security"
import { getDlpFindings } from "../actions/dlp"
import { getLegalHolds } from "../actions/exports"

export default async function SecurityPage() {
  const [auditChain, chainVerification, anchors, dlpFindings, legalHolds] = await Promise.all([
    getAuditChain(50),
    verifyAuditChain(),
    getAnchors(),
    getDlpFindings({ status: "open", limit: 10 }),
    getLegalHolds(),
  ])

  const stats = {
    auditRecords: auditChain.length,
    chainValid: chainVerification.valid,
    anchors: anchors.length,
    openFindings: dlpFindings.filter((f) => f.status === "open").length,
    criticalFindings: dlpFindings.filter((f) => f.severity === "critical").length,
    activeLegalHolds: legalHolds.filter((h) => h.status === "active").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security & Compliance</h1>
        <p className="text-muted-foreground">Enterprise-grade security controls and compliance monitoring</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Chain</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auditRecords}</div>
            <p className="text-xs text-muted-foreground">
              {stats.chainValid ? (
                <span className="text-green-600">✓ Chain verified</span>
              ) : (
                <span className="text-red-600">⚠ Chain broken</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Anchors</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.anchors}</div>
            <p className="text-xs text-muted-foreground">Immutable proof records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DLP Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openFindings}</div>
            <p className="text-xs text-muted-foreground">{stats.criticalFindings} critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal Holds</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLegalHolds}</div>
            <p className="text-xs text-muted-foreground">Active preservation orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Chain</TabsTrigger>
          <TabsTrigger value="anchors">Blockchain Anchors</TabsTrigger>
          <TabsTrigger value="dlp">DLP Findings</TabsTrigger>
          <TabsTrigger value="legal">Legal Holds</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events</CardTitle>
              <CardDescription>Cryptographically chained audit log with tamper detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditChain.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between border-b pb-2">
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
                      <p className="text-xs font-mono text-muted-foreground">{record.curr_hash.substring(0, 12)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anchors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Anchors</CardTitle>
              <CardDescription>Periodic anchoring to public blockchain for immutable proof</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {anchors.map((anchor) => (
                  <div key={anchor.id} className="flex items-center justify-between border-b pb-2">
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
          </Card>
        </TabsContent>

        <TabsContent value="dlp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open DLP Findings</CardTitle>
              <CardDescription>Data loss prevention alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dlpFindings.map((finding) => (
                  <div key={finding.id} className="flex items-center justify-between border-b pb-2">
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
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Holds</CardTitle>
              <CardDescription>Data preservation orders for litigation or investigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {legalHolds.map((hold) => (
                  <div key={hold.id} className="flex items-center justify-between border-b pb-2">
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
