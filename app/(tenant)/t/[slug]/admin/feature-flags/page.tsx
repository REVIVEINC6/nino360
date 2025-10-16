"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Flag, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface FeatureFlag {
  id: string
  key: string
  enabled: boolean
  description?: string
}

const AVAILABLE_FEATURES = [
  { key: "crm", label: "CRM Module", description: "Customer relationship management" },
  { key: "talent", label: "Talent Module", description: "Applicant tracking system" },
  { key: "hrms", label: "HRMS Module", description: "Human resource management" },
  { key: "finance", label: "Finance Module", description: "Financial management" },
  { key: "bench", label: "Bench Module", description: "Resource bench management" },
  { key: "vms", label: "VMS Module", description: "Vendor management system" },
  { key: "automation", label: "Automation", description: "Workflow automation" },
  { key: "trust", label: "Trust & Audit", description: "Blockchain audit trail" },
  { key: "analytics-lite", label: "Analytics Lite", description: "Basic analytics" },
  { key: "analytics-pro", label: "Analytics Pro", description: "Advanced analytics" },
]

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadFlags()
  }, [])

  const loadFlags = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("feature_flags").select("*")

      if (error) throw error

      setFlags(data || [])
    } catch (error) {
      console.error("Failed to load feature flags:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFeature = async (key: string, enabled: boolean) => {
    try {
      const supabase = getSupabaseBrowserClient()

      const existingFlag = flags.find((f) => f.key === key)

      if (existingFlag) {
        const { error } = await supabase.from("feature_flags").update({ enabled }).eq("id", existingFlag.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("feature_flags").insert({ key, enabled })

        if (error) throw error
      }

      toast({
        title: enabled ? "Feature enabled" : "Feature disabled",
        description: `${AVAILABLE_FEATURES.find((f) => f.key === key)?.label} has been ${enabled ? "enabled" : "disabled"}`,
      })

      loadFlags()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update feature flag",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-muted-foreground">Enable or disable modules and features for your workspace</p>
        </div>

        <Card className="glass-panel border-white/10 p-6">
          <div className="space-y-6">
            {AVAILABLE_FEATURES.map((feature, index) => {
              const flag = flags.find((f) => f.key === feature.key)
              const isEnabled = flag?.enabled || false

              return (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20 mt-1">
                      <Flag className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <Label htmlFor={feature.key} className="text-base font-medium cursor-pointer">
                        {feature.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>

                  <Switch
                    id={feature.key}
                    checked={isEnabled}
                    onCheckedChange={(checked) => toggleFeature(feature.key, checked)}
                  />
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
