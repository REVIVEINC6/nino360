"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { useState } from "react"
import { verifyBlockchainAudit } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"

interface BlockchainAuditPanelProps {
  applicantId: string
  auditRecords: any[]
}

export function BlockchainAuditPanel({ applicantId, auditRecords }: BlockchainAuditPanelProps) {
  const [verifying, setVerifying] = useState(false)
  const { toast } = useToast()

  const handleVerify = async (recordId: string) => {
    setVerifying(true)
    try {
      const response = await verifyBlockchainAudit(recordId)

      if (response.success) {
        toast({
          title: "Verification successful",
          description: response.data?.verified ? "Audit record is valid" : "Verification failed",
          variant: response.data?.verified ? "default" : "destructive",
        })
      } else {
        toast({
          title: "Verification failed",
          description: response.error || "Failed to verify audit record",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Blockchain Audit Trail</h3>
      </div>

      <div className="space-y-3">
        {auditRecords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit records yet</p>
        ) : (
          auditRecords.map((record) => (
            <div key={record.id} className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{record.action_type}</span>
                    <Badge
                      variant={record.verification_status === "verified" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {record.verification_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(record.created_at).toLocaleString()}</p>
                </div>
                {record.verification_status === "verified" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {record.verification_status === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                {record.verification_status === "failed" && <AlertCircle className="h-4 w-4 text-red-600" />}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Hash:</span>
                  <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-[10px] truncate">
                    {record.data_hash}
                  </code>
                </div>

                {record.previous_hash && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Prev:</span>
                    <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-[10px] truncate">
                      {record.previous_hash}
                    </code>
                  </div>
                )}

                {record.blockchain_tx_hash && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tx:</span>
                    <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-[10px] truncate">
                      {record.blockchain_tx_hash}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(`https://etherscan.io/tx/${record.blockchain_tx_hash}`, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {record.verification_status !== "verified" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 bg-transparent"
                  onClick={() => handleVerify(record.id)}
                  disabled={verifying}
                >
                  {verifying ? "Verifying..." : "Verify on Blockchain"}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
