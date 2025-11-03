"use client"

import { motion } from "framer-motion"
import { AlertTriangle, TrendingUp, Lightbulb, Shield } from "lucide-react"
import { GlassPanel } from "@/components/shared/glass-panel"
import { Badge } from "@/components/ui/badge"

interface DocumentsAIPanelProps {
  documents: any[]
}

export function DocumentsAIPanel({ documents }: DocumentsAIPanelProps) {
  // Calculate AI insights
  const highRiskDocs = documents.filter((doc) => (doc.ai_risk_score || 0) > 70)
  const pendingSignature = documents.filter((doc) => doc.status === "shared" || doc.status === "viewed")
  const recentlyViewed = documents
    .filter((doc) => doc.last_viewed_at)
    .sort((a, b) => new Date(b.last_viewed_at).getTime() - new Date(a.last_viewed_at).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>

        <div className="space-y-4">
          {/* High Risk Documents */}
          {highRiskDocs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-500">High Risk Documents</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {highRiskDocs.length} document{highRiskDocs.length !== 1 ? "s" : ""} flagged for review
                  </p>
                  <div className="mt-2 space-y-1">
                    {highRiskDocs.slice(0, 2).map((doc) => (
                      <p key={doc.id} className="text-xs text-muted-foreground">
                        • {doc.title}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending Signature */}
          {pendingSignature.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-500">Pending Signature</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pendingSignature.length} document{pendingSignature.length !== 1 ? "s" : ""} awaiting signature
                  </p>
                  <div className="mt-2 space-y-1">
                    {pendingSignature.slice(0, 2).map((doc) => (
                      <p key={doc.id} className="text-xs text-muted-foreground">
                        • {doc.title}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-purple-500">Recently Viewed</p>
                  <p className="text-sm text-muted-foreground mt-1">Hot documents with recent activity</p>
                  <div className="mt-2 space-y-1">
                    {recentlyViewed.map((doc) => (
                      <p key={doc.id} className="text-xs text-muted-foreground">
                        • {doc.title} ({doc.view_count} views)
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </GlassPanel>

      {/* Technology Badges */}
      <GlassPanel className="p-4">
        <p className="text-xs text-muted-foreground mb-3">Powered by</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="glass-panel">
            🤖 AI Analysis
          </Badge>
          <Badge variant="outline" className="glass-panel">
            🔗 Blockchain
          </Badge>
          <Badge variant="outline" className="glass-panel">
            📊 ML Insights
          </Badge>
        </div>
      </GlassPanel>
    </div>
  )
}
