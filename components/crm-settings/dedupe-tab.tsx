"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles } from "lucide-react"
import { getDedupeRules, updateDedupeRule } from "@/app/(dashboard)/crm/actions/settings"
import { motion } from "framer-motion"

export function DedupeTab() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRules()
  }, [])

  async function loadRules() {
    try {
      const data = await getDedupeRules()
      setRules(data)
    } catch (error) {
      console.error("Failed to load dedupe rules:", error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleRule(id: string, isActive: boolean) {
    try {
      await updateDedupeRule(id, { is_active: isActive })
      setRules(rules.map((r) => (r.id === id ? { ...r, is_active: isActive } : r)))
    } catch (error) {
      console.error("Failed to update dedupe rule:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dedupe rules...</div>
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Deduplication Rules</h3>
        <p className="text-sm text-muted-foreground">Prevent duplicate records with AI-powered matching</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{rule.name}</p>
                  {rule.auto_merge && (
                    <Badge variant="outline" className="bg-purple-500/10">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Auto-merge
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-muted-foreground">Entity: {rule.entity_type}</p>
                  {rule.fuzzy_threshold && (
                    <p className="text-sm text-muted-foreground">
                      Threshold: {(rule.fuzzy_threshold * 100).toFixed(0)}%
                    </p>
                  )}
                  {rule.matches_found > 0 && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3 text-blue-500" />
                      {rule.matches_found} matches found
                    </p>
                  )}
                </div>
              </div>
              <Switch checked={rule.is_active} onCheckedChange={(checked) => toggleRule(rule.id, checked)} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
