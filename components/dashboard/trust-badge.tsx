"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, AlertCircle, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const trustBadges = [
  { label: "Hash-Chained Audit", status: "valid" },
  { label: "Signed Artifacts", status: "valid" },
  { label: "Attested Calls", status: "warning" },
]

export function TrustBadge() {
  const [hash, setHash] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!hash.trim()) return

    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const isValid = Math.random() > 0.3

    toast({
      title: isValid ? "Hash Verified" : "Invalid Hash",
      description: isValid
        ? "Event integrity confirmed via blockchain audit trail"
        : "Hash not found in ledger or tampered",
      variant: isValid ? "default" : "destructive",
    })

    setIsVerifying(false)
    setHash("")
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-5 w-5 text-primary" />
          Blockchain Trust
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge variant={badge.status === "valid" ? "default" : "secondary"} className="gap-1">
                {badge.status === "valid" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {badge.label}
              </Badge>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Verify Event Hash</label>
          <div className="flex gap-2">
            <Input
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Paste event hash..."
              className="font-mono text-xs"
            />
            <Button size="icon" onClick={handleVerify} disabled={isVerifying || !hash.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
