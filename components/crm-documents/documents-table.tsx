"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Send, Sparkles } from "lucide-react"
import { GlassPanel } from "@/components/shared/glass-panel"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { analyzeDocument } from "@/app/(dashboard)/crm/actions/documents"

interface DocumentsTableProps {
  documents: any[]
  onRefresh?: () => void
}

export function DocumentsTable({ documents, onRefresh }: DocumentsTableProps) {
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  async function handleAnalyze(documentId: string) {
    setAnalyzing(documentId)
    try {
      await analyzeDocument(documentId)
      onRefresh?.()
    } catch (error) {
      console.error("[v0] Error analyzing document:", error)
    } finally {
      setAnalyzing(null)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      shared: "bg-blue-500",
      viewed: "bg-purple-500",
      signed: "bg-green-500",
      expired: "bg-red-500",
      void: "bg-gray-400",
    }
    return colors[status] || "bg-gray-500"
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">All Documents</h3>
        <Badge variant="outline" className="glass-panel">
          {documents.length} documents
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{doc.title}</p>
                      {doc.blockchain_hash && <BlockchainBadge hash={doc.blockchain_hash} size="sm" />}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{doc.account?.name || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.kind}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                </TableCell>
                <TableCell>
                  {doc.ai_confidence ? (
                    <MLConfidenceMeter value={doc.ai_confidence} size="sm" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAnalyze(doc.id)}
                      disabled={analyzing === doc.id}
                      className="ai-glow"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {analyzing === doc.id ? "Analyzing..." : "Analyze"}
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    {doc.view_count || 0}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassPanel>
  )
}
