"use client"

import { CheckCircle, XCircle, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Approval {
  approver_id: string
  status: "pending" | "approved" | "rejected"
  comment?: string
  decided_at?: string
  approver?: {
    full_name: string
    email: string
  }
}

interface ApprovalTimelineProps {
  approvals: Approval[]
}

export function ApprovalTimeline({ approvals }: ApprovalTimelineProps) {
  return (
    <div className="space-y-4">
      {approvals.map((approval, index) => {
        const isPending = approval.status === "pending"
        const isApproved = approval.status === "approved"
        const isRejected = approval.status === "rejected"

        return (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{approval.approver?.full_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{approval.approver?.email}</p>
                </div>
                <Badge variant={isApproved ? "default" : isRejected ? "destructive" : "secondary"} className="gap-1">
                  {isPending && <Clock className="h-3 w-3" />}
                  {isApproved && <CheckCircle className="h-3 w-3" />}
                  {isRejected && <XCircle className="h-3 w-3" />}
                  {approval.status}
                </Badge>
              </div>

              {approval.comment && (
                <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded border border-white/10">
                  {approval.comment}
                </p>
              )}

              {approval.decided_at && (
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(approval.decided_at), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
