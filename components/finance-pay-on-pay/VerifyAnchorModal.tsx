"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function VerifyAnchorModal({ runId }: { runId: string }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function verify() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pay-on-pay/verify-anchor/dummy?runId=${runId}`)
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" /> Verify On-Chain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Anchor</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Button onClick={verify} disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
          {result && (
            <pre className="text-xs bg-muted p-2 rounded max-h-64 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
