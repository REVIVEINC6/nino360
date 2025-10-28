"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Clock, User, MessageSquare } from "lucide-react"
import { getApprovals, setApproval } from "@/app/(dashboard)/talent/jobs/actions"
import { toast } from "sonner"

interface ApprovalWorkflowProps {
  requisitionId: string
}

export function ApprovalWorkflow({ requisitionId }: ApprovalWorkflowProps) {
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadApprovals()
  }, [requisitionId])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      const data = await getApprovals(requisitionId)
      setApprovals(data)
    } catch (error) {
      console.error("[v0] Error loading approvals:", error)
      toast.error("Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (approvalId: string) => {
    try {
      setProcessing(approvalId)
      await setApproval(approvalId, "approved", comment || undefined)
      toast.success("Requisition approved")
      setComment("")
      await loadApprovals()
    } catch (error) {
      console.error("[v0] Error approving:", error)
      toast.error("Failed to approve")
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (approvalId: string) => {
    try {
      setProcessing(approvalId)
      await setApproval(approvalId, "rejected", comment || undefined)
      toast.success("Requisition rejected")
      setComment("")
      await loadApprovals()
    } catch (error) {
      console.error("[v0] Error rejecting:", error)
      toast.error("Failed to reject")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      default:
        return <Badge variant="outline">Skipped</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading approval workflow...</p>
      </Card>
    )
  }

  if (approvals.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="font-semibold">No Approvals Required</h3>
          <p className="text-sm text-muted-foreground">This requisition doesn't have an approval workflow yet</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Approval Workflow</h3>
        <p className="text-sm text-muted-foreground">Track approval status and provide feedback</p>
      </div>

      <div className="space-y-4">
        {approvals.map((approval, index) => (
          <div key={approval.id} className="relative">
            {index < approvals.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />}

            <div className="flex gap-4">
              <div className="relative">{getStatusIcon(approval.status)}</div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={approval.approver?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{approval.approver?.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">Step {approval.step}</p>
                    </div>
                  </div>
                  {getStatusBadge(approval.status)}
                </div>

                {approval.comment && (
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{approval.comment}</p>
                  </div>
                )}

                {approval.decided_at && (
                  <p className="text-xs text-muted-foreground">
                    {approval.status === "approved" ? "Approved" : "Rejected"} on{" "}
                    {new Date(approval.decided_at).toLocaleString()}
                  </p>
                )}

                {approval.status === "pending" && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <Textarea
                      placeholder="Add a comment (optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        disabled={processing === approval.id}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(approval.id)}
                        disabled={processing === approval.id}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
