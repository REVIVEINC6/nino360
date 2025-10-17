"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUserAudit, verifyHash } from "@/app/(dashboard)/tenant/users/actions"
import { formatDistanceToNow } from "date-fns"
import { Shield, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface AuditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function AuditDrawer({ open, onOpenChange, userId }: AuditDrawerProps) {
  const [audit, setAudit] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)

  useEffect(() => {
    if (open && userId) {
      setLoading(true)
      getUserAudit(userId).then((data) => {
        setAudit(data || [])
        setLoading(false)
      })
    }
  }, [open, userId])

  const handleVerifyHash = async (hash: string) => {
    setVerifying(hash)
    try {
      const result = await verifyHash(hash)
      if (result.valid) {
        toast.success("Hash verified successfully", {
          description: "Audit entry integrity confirmed",
        })
      } else {
        toast.error("Hash verification failed", {
          description: result.error || "Integrity check failed",
        })
      }
    } catch (error) {
      toast.error("Verification error")
    } finally {
      setVerifying(null)
    }
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast.success("Hash copied to clipboard")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[600px] backdrop-blur-xl bg-black/90 border-white/10">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#8B5CF6]" />
            Audit Timeline
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
            </div>
          ) : audit.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit entries found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {audit.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-l-2 border-[#8B5CF6]/30 pl-4 pb-4 hover:border-[#8B5CF6] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {entry.entity} • {entry.entity_id}
                  </div>
                  {entry.hash && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 font-mono text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
                        {entry.hash.slice(0, 32)}...
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyHash(entry.hash)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleVerifyHash(entry.hash)}
                        disabled={verifying === entry.hash}
                      >
                        {verifying === entry.hash ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Shield className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                  {entry.diff && (
                    <div className="mt-2 text-xs">
                      <details className="cursor-pointer">
                        <summary className="text-muted-foreground hover:text-foreground">View changes</summary>
                        <pre className="mt-2 p-2 bg-white/5 rounded text-xs overflow-auto">
                          {JSON.stringify(entry.diff, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
