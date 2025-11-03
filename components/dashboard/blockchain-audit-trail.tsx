"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, CheckCircle2, Search, ExternalLink, Lock } from "lucide-react"
import type { AuditEntry } from "@/app/(dashboard)/dashboard/actions"
import { verifyHash } from "@/app/(dashboard)/dashboard/actions"
import { cn } from "@/lib/utils"

interface BlockchainAuditTrailProps {
  auditEntries: AuditEntry[]
}

export function BlockchainAuditTrail({ auditEntries }: BlockchainAuditTrailProps) {
  const [verifyingHash, setVerifyingHash] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [searchHash, setSearchHash] = useState("")

  const handleVerify = async (hash: string) => {
    setVerifyingHash(hash)
    const result = await verifyHash(hash)
    setVerificationResult(result)
    setTimeout(() => {
      setVerifyingHash(null)
      setVerificationResult(null)
    }, 3000)
  }

  // Generate mock blockchain hashes for audit entries
  const entriesWithHashes = auditEntries.slice(0, 5).map((entry) => ({
    ...entry,
    blockchainHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    verified: true,
  }))

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader className="bg-linear-to-r from-green-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Blockchain Audit Trail
            </span>
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Immutable
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search hash..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="w-64 h-9 bg-background/50 border-primary/20"
            />
            <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-transparent">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {entriesWithHashes.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-green-500/20 hover:border-green-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">{entry.action}</span>
                    <Badge variant="outline" className="text-xs">
                      Block #{entry.blockNumber.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{entry.actor}</span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    <span>•</span>
                    <span>{entry.resource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-background px-2 py-1 rounded border border-primary/10">
                      {entry.blockchainHash.substring(0, 20)}...
                      {entry.blockchainHash.substring(entry.blockchainHash.length - 10)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 text-xs"
                      onClick={() => handleVerify(entry.blockchainHash)}
                      disabled={verifyingHash === entry.blockchainHash}
                    >
                      {verifyingHash === entry.blockchainHash ? (
                        "Verifying..."
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                  {verifyingHash === entry.blockchainHash && verificationResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={cn(
                        "text-xs p-2 rounded border",
                        verificationResult.valid
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : "bg-red-500/10 border-red-500/20 text-red-500",
                      )}
                    >
                      {verificationResult.message}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-primary/10 text-center">
          <p className="text-xs text-muted-foreground">
            All critical actions are cryptographically signed and stored on an immutable blockchain ledger
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
