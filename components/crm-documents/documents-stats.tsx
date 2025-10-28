"use client"

import { motion } from "framer-motion"
import { FileText, Eye, CheckCircle, TrendingUp } from "lucide-react"
import { GlassPanel } from "@/components/shared/glass-panel"

interface DocumentsStatsProps {
  documents: any[]
}

export function DocumentsStats({ documents }: DocumentsStatsProps) {
  const totalDocs = documents.length
  const totalViews = documents.reduce((sum, doc) => sum + (doc.view_count || 0), 0)
  const signedDocs = documents.filter((doc) => doc.status === "signed").length
  const acceptanceRate = totalDocs > 0 ? Math.round((signedDocs / totalDocs) * 100) : 0

  const stats = [
    {
      label: "Total Documents",
      value: totalDocs,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Signed",
      value: signedDocs,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Acceptance Rate",
      value: `${acceptanceRate}%`,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  )
}
