"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, Copy, Shield, X, AlertCircle } from "lucide-react"
import { useState } from "react"
import { verifyHash } from "@/app/(dashboard)/tenant/dashboard/actions"

interface HashBadgeProps {
  hash: string
  prevHash: string | null
}

export function HashBadge({ hash, prevHash }: HashBadgeProps) {
  const [copied, setCopied] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<any>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    setVerifying(true)
    setVerifyResult(null)
    try {
      const result = await verifyHash({ hash })
      setVerifyResult(result)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-primary/10">
          <Shield className="h-3 w-3 text-primary" />
          <span className="font-mono text-xs">{hash.slice(0, 8)}...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Hash Chain Verification
          </DialogTitle>
          <DialogDescription>
            Verify the cryptographic integrity of this audit entry in the immutable hash chain
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Current Hash</label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded bg-muted p-2 text-xs font-mono break-all">{hash}</code>
              <Button size="sm" variant="ghost" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Previous Hash</label>
            <code className="mt-1 block rounded bg-muted p-2 text-xs font-mono break-all">
              {prevHash || "Genesis block (no previous hash)"}
            </code>
          </div>
          <Button onClick={handleVerify} disabled={verifying} className="w-full">
            {verifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Hash Chain
              </>
            )}
          </Button>
          {verifyResult && (
            <div
              className={`rounded-lg border p-4 ${
                verifyResult.valid ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {verifyResult.valid ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-500">✓ Valid Hash Chain</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-500">✗ Invalid Hash Chain</span>
                  </>
                )}
              </div>
              {verifyResult.error && (
                <div className="mt-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{verifyResult.error}</p>
                </div>
              )}
              {verifyResult.record && (
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Action: {verifyResult.record.action}</p>
                  <p>Entity: {verifyResult.record.entity || "N/A"}</p>
                  <p>Timestamp: {new Date(verifyResult.record.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
