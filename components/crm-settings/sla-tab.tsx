"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"
import { getSLARules, updateSLARule } from "@/app/(dashboard)/crm/actions/settings"
import { motion } from "framer-motion"

export function SLATab() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRules()
  }, [])

  async function loadRules() {
    try {
      const data = await getSLARules()
      setRules(data)
    } catch (error) {
      console.error("Failed to load SLA rules:", error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleRule(id: string, isActive: boolean) {
    try {
      await updateSLARule(id, { is_active: isActive })
      setRules(rules.map((r) => (r.id === id ? { ...r, is_active: isActive } : r)))
    } catch (error) {
      console.error("Failed to update SLA rule:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading SLA rules...</div>
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Service Level Agreements</h3>
        <p className="text-sm text-muted-foreground">Set response time targets with AI compliance tracking</p>
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
                  <Badge variant="outline" className="bg-blue-500/10">
                    {rule.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Target: {Math.floor(rule.target_minutes / 60)}h {rule.target_minutes % 60}m
                  </p>
                  {rule.compliance_rate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {rule.compliance_rate}% compliance
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
