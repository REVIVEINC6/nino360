"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, X } from "lucide-react"
import { HashBadge } from "./hash-badge"
// Use API proxy to verify audit hashes server-side
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AuditMiniProps {
  audits: Array<{
    ts: string
    action: string
    entity: string
    id: string
    hash: string
  }>
}

export function AuditMini({ audits }: AuditMiniProps) {
  const [verifying, setVerifying] = useState<string | null>(null)
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean
    record?: any
    error?: string
  } | null>(null)

  const handleVerify = async (hash: string) => {
    setVerifying(hash)
    try {
      const res = await fetch('/api/crm/dashboard/verify-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      })
      const result = await res.json()
      setVerifyResult(result)
    } catch (err: any) {
      setVerifyResult({ valid: false, error: err.message || String(err) })
    }
  }

  return (
    <>
      <Card className="glass-panel border-[#8B5CF6]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#8B5CF6]" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {audits.map((audit) => (
              <div
                key={audit.hash}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs font-medium">{audit.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(audit.ts), { addSuffix: true })}
                  </p>
                </div>
                <HashBadge hash={audit.hash} onVerify={() => handleVerify(audit.hash)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!verifying}
        onOpenChange={() => {
          setVerifying(null)
          setVerifyResult(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hash Verification</DialogTitle>
          </DialogHeader>
          {verifyResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {verifyResult.valid ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Hash chain verified</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-red-500">Verification failed</span>
                  </>
                )}
              </div>
              {verifyResult.record && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{verifyResult.record.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entity:</span>
                    <span className="font-medium">{verifyResult.record.entity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="font-medium">{new Date(verifyResult.record.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              )}
              {verifyResult.error && <p className="text-sm text-red-500">{verifyResult.error}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
