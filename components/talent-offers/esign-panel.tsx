"use client"

import { Mail, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Signer {
  name: string
  email: string
  role: string
  status: "pending" | "viewed" | "signed" | "declined"
  signer_id?: string
}

interface EsignPanelProps {
  signerPayload?: {
    provider: string
    envelope_id: string
    signers: Signer[]
  }
  onPollStatus: () => void
  onResend: (signerId: string) => void
}

export function EsignPanel({ signerPayload, onPollStatus, onResend }: EsignPanelProps) {
  if (!signerPayload) {
    return (
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No e-sign request initiated yet</p>
        </CardContent>
      </Card>
    )
  }

  const allSigned = signerPayload.signers.every((s) => s.status === "signed")

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>E-Signature Status</CardTitle>
        <Button onClick={onPollStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Provider: {signerPayload.provider}</span>
          <span>•</span>
          <span className="font-mono">{signerPayload.envelope_id}</span>
        </div>

        {allSigned && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              All signers have completed signing
            </p>
          </div>
        )}

        <div className="space-y-3">
          {signerPayload.signers.map((signer, index) => {
            const isPending = signer.status === "pending"
            const isSigned = signer.status === "signed"
            const isDeclined = signer.status === "declined"

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                    <Mail className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{signer.name}</p>
                    <p className="text-xs text-muted-foreground">{signer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={isSigned ? "default" : isDeclined ? "destructive" : "secondary"} className="gap-1">
                    {isPending && <Clock className="h-3 w-3" />}
                    {isSigned && <CheckCircle className="h-3 w-3" />}
                    {isDeclined && <XCircle className="h-3 w-3" />}
                    {signer.status}
                  </Badge>
                  {isPending && (
                    <Button onClick={() => onResend(signer.signer_id!)} variant="ghost" size="sm">
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
