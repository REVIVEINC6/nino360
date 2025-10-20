"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, TrendingUp } from "lucide-react"
import { getPipelineStages } from "@/app/(dashboard)/crm/actions/settings"
import { motion } from "framer-motion"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"

export function StagesTab() {
  const [stages, setStages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStages()
  }, [])

  async function loadStages() {
    try {
      const data = await getPipelineStages()
      setStages(data)
    } catch (error) {
      console.error("Failed to load stages:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading stages...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Pipeline Stages</h3>
          <p className="text-sm text-muted-foreground">Configure sales pipeline stages with AI insights</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  {stage.display_order}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{stage.name}</p>
                    {stage.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-muted-foreground">{stage.probability}% probability</p>
                    {stage.avg_days_in_stage && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Avg {stage.avg_days_in_stage} days
                      </p>
                    )}
                    {stage.conversion_rate && <MLConfidenceMeter confidence={stage.conversion_rate / 100} size="sm" />}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
