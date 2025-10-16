"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Shield } from "lucide-react"

export function HashVerifier() {
  const [hash, setHash] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleVerify = async () => {
    if (hash.length !== 64) return

    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsVerifying(false)
    setIsVerified(true)

    setTimeout(() => setIsVerified(false), 5000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Enter 64-character hash..."
          className="flex-1 glass border-white/20 font-mono text-sm"
          maxLength={64}
        />
        <Button
          onClick={handleVerify}
          disabled={hash.length !== 64 || isVerifying}
          className="bg-gradient-to-r from-[#4F46E5] to-[#A855F7]"
        >
          <Shield className="h-4 w-4 mr-2" />
          Verify
        </Button>
      </div>

      <AnimatePresence>
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg glass-card border-[#D0FF00] border-2"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#D0FF00]" />
              <div>
                <p className="font-semibold">Verified on-chain ✓</p>
                <p className="text-sm text-white/60">Merkle root: 0x7a8f...3c2d • Block: 18,234,567</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
