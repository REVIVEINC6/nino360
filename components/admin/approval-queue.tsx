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
import { Check, X, Clock, User, Mail, Shield } from "lucide-react"
import { decideApproval } from "@/app/(dashboard)/admin/actions/approvals"
import { useToast } from "@/hooks/use-toast"

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

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No pending approvals</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pending.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {approval.kind === "invite" && <Mail className="h-4 w-4" />}
                        {approval.kind === "join_request" && <User className="h-4 w-4" />}
                        {approval.kind === "role_change" && <Shield className="h-4 w-4" />}
                        {approval.kind.replace("_", " ").toUpperCase()}
                      </CardTitle>
                      <CardDescription>{new Date(approval.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant="outline">{approval.status}</Badge>
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
            ))}
          </div>
        )}
      </div>

      {/* Decided Approvals */}
      {decided.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Decisions</h2>
          <div className="grid gap-4">
            {decided.slice(0, 5).map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{approval.kind.replace("_", " ").toUpperCase()}</CardTitle>
                    <Badge variant={approval.status === "approved" ? "default" : "destructive"}>
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
            >
              {loading ? "Processing..." : decision === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
