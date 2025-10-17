"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function BlockchainTrust() {
  const [hash, setHash] = useState("")
  const [verified, setVerified] = useState(false)

  const handleVerify = () => {
    if (hash.length > 0) {
      setVerified(true)
      setTimeout(() => setVerified(false), 3000)
    }
  }

  return (
    <section id="trust" className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Blockchain
            </span>{" "}
            Trust Layer
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Verifiable by Blockchain. Every action cryptographically signed and auditable.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Shield, title: "Hash-Chained Audit", description: "Every transaction linked in immutable chain" },
            { icon: CheckCircle2, title: "Signed Artifacts", description: "Digital signatures on all documents" },
            { icon: Lock, title: "Ledger Attestation", description: "On-chain verification of critical events" },
          ].map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg text-center"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F81CE5]/20 to-[#F81CE5]/10 flex items-center justify-center mx-auto mb-4">
                <badge.icon className="h-8 w-8 text-[#F81CE5]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">{badge.title}</h3>
              <p className="text-sm text-slate-600">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto p-8 rounded-2xl backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-slate-900">Verify Event Hash</h3>
          <p className="text-sm text-slate-600 text-center mb-6">
            Paste an event hash to verify authenticity on the blockchain
          </p>

          <div className="flex gap-3">
            <Input
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x7a8f3d2e..."
              className="bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400"
            />
            <Button
              onClick={handleVerify}
              className="bg-gradient-to-r from-[#F81CE5] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white"
            >
              Verify
            </Button>
          </div>

          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-500">Hash verified successfully!</p>
                <p className="text-xs text-green-500/70 mt-1">Block: 1,234,567 • Timestamp: 2025-01-10 14:32:18 UTC</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
