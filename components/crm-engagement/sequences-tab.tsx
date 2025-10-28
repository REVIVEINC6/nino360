"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Sparkles, Play, Pause } from "lucide-react"
import { getSequences, aiOptimizeSequence } from "@/app/(dashboard)/crm/actions/engagement"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"
import { motion } from "framer-motion"

export function SequencesTab() {
  const [sequences, setSequences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSequences()
  }, [])

  async function loadSequences() {
    try {
      const data = await getSequences()
      setSequences(data)
    } catch (error) {
      console.error("Failed to load sequences:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleOptimize(sequenceId: string) {
    try {
      await aiOptimizeSequence(sequenceId)
      await loadSequences()
    } catch (error) {
      console.error("Failed to optimize sequence:", error)
    }
  }

  if (loading) {
    return <div className="glass-card p-6">Loading sequences...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Email Sequences</h3>
            <p className="text-sm text-muted-foreground">Automated follow-up sequences with AI optimization</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Sequence
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Active Contacts</TableHead>
              <TableHead>Open Rate</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sequences.map((sequence) => (
              <TableRow key={sequence.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {sequence.name}
                    {sequence.blockchain_hash && <BlockchainBadge hash={sequence.blockchain_hash} />}
                  </div>
                </TableCell>
                <TableCell>{sequence.steps?.length || 0} steps</TableCell>
                <TableCell>{sequence.total_enrolled || 0}</TableCell>
                <TableCell>{sequence.avg_open_rate?.toFixed(1) || 0}%</TableCell>
                <TableCell>
                  {sequence.ai_optimized ? (
                    <MLConfidenceMeter confidence={sequence.ml_confidence || 0} />
                  ) : (
                    <span className="text-sm text-muted-foreground">Not optimized</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={sequence.status === "active" ? "default" : "secondary"}>{sequence.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!sequence.ai_optimized && (
                      <Button variant="ghost" size="sm" onClick={() => handleOptimize(sequence.id)}>
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Optimize
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      {sequence.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  )
}
