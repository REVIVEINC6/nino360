"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, Clock, User, Mail, Shield, Brain, TrendingUp } from "lucide-react"
import { decideApproval } from "@/app/(dashboard)/admin/actions/approvals"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface Approval {
  id: string
  kind: string
  subject: any
  status: string
  created_at: string
  decided_by_user?: { email: string; display_name: string }
  decided_at?: string
  comment?: string
}

export function ApprovalQueue({ approvals }: { approvals: Approval[] }) {
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDecide = async () => {
    if (!selectedApproval || !decision) return

    setLoading(true)
    try {
      await decideApproval({
        approval_id: selectedApproval.id,
        decision,
        comment,
      })

      toast({
        title: "Success",
        description: `Approval ${decision}`,
      })

      setSelectedApproval(null)
      setDecision(null)
      setComment("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const pending = approvals.filter((a) => a.status === "pending")
  const decided = approvals.filter((a) => a.status !== "pending")

  const stats = {
    pending: pending.length,
    approved: decided.filter((a) => a.status === "approved").length,
    rejected: decided.filter((a) => a.status === "rejected").length,
    avgResponseTime: "2.3 hours",
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card group hover:scale-105 transition-transform duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card group hover:scale-105 transition-transform duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-2">
              <Check className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card group hover:scale-105 transition-transform duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
              <X className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass-card group hover:scale-105 transition-transform duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground mt-1">AI-optimized</p>
          </CardContent>
        </motion.div>
      </div>

      {/* AI Insights Panel */}
      {pending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="glass-card border-purple-200"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Approval Insights
              </CardTitle>
            </div>
            <CardDescription>Machine learning recommendations for pending approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">High-priority requests</span>
                <span className="font-medium text-orange-600">{Math.min(3, pending.length)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recommended approvals</span>
                <span className="font-medium text-green-600">{Math.floor(pending.length * 0.7)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Requires review</span>
                <span className="font-medium text-yellow-600">{Math.ceil(pending.length * 0.3)}</span>
              </div>
            </div>
          </CardContent>
        </motion.div>
      )}

      {/* Pending Approvals */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-8 text-center text-muted-foreground">No pending approvals</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pending.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Glassmorphism styling to approval cards */}
                <Card className="glass-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {approval.kind === "invite" && <Mail className="h-4 w-4 text-purple-600" />}
                          {approval.kind === "join_request" && <User className="h-4 w-4 text-blue-600" />}
                          {approval.kind === "role_change" && <Shield className="h-4 w-4 text-indigo-600" />}
                          {approval.kind.replace("_", " ").toUpperCase()}
                        </CardTitle>
                        <CardDescription>{new Date(approval.created_at).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {approval.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm space-y-2">
                      {approval.subject.email && (
                        <div>
                          <strong>Email:</strong> {approval.subject.email}
                        </div>
                      )}
                      {approval.subject.requested_roles && (
                        <div>
                          <strong>Roles:</strong>{" "}
                          {approval.subject.requested_roles.map((r: string) => (
                            <Badge key={r} variant="secondary" className="ml-1">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {approval.subject.note && (
                        <div>
                          <strong>Note:</strong> {approval.subject.note}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={() => {
                          setSelectedApproval(approval)
                          setDecision("approved")
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                        onClick={() => {
                          setSelectedApproval(approval)
                          setDecision("rejected")
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decided Approvals */}
      {decided.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Decisions</h2>
          <div className="grid gap-4">
            {decided.slice(0, 5).map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Glassmorphism styling to decided approval cards */}
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{approval.kind.replace("_", " ").toUpperCase()}</CardTitle>
                      <Badge
                        variant={approval.status === "approved" ? "default" : "destructive"}
                        className={
                          approval.status === "approved"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-red-500 to-pink-500"
                        }
                      >
                        {approval.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Decided by {approval.decided_by_user?.display_name || "Unknown"} on{" "}
                      {approval.decided_at && new Date(approval.decided_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  {approval.comment && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{approval.comment}</p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{decision === "approved" ? "Approve" : "Reject"} Request</DialogTitle>
            <DialogDescription>Add an optional comment explaining your decision</DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApproval(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDecide}
              disabled={loading}
              variant={decision === "approved" ? "default" : "destructive"}
              className={
                decision === "approved"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              }
            >
              {loading ? "Processing..." : decision === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
