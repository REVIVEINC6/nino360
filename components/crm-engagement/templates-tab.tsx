"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles } from "lucide-react"
import { getTemplates, aiGenerateTemplateVariants } from "@/app/(dashboard)/crm/actions/engagement"
import { motion } from "framer-motion"

export function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const data = await getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error("Failed to load templates:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateVariants(templateId: string) {
    try {
      await aiGenerateTemplateVariants(templateId)
      await loadTemplates()
    } catch (error) {
      console.error("Failed to generate variants:", error)
    }
  }

  if (loading) {
    return <div className="glass-card p-6">Loading templates...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Email Templates</h3>
            <p className="text-sm text-muted-foreground">Reusable email templates with AI variants</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="glass-panel p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.category}</p>
                </div>
                <Badge variant="secondary">{template.usage_count} uses</Badge>
              </div>

              {template.ai_generated && (
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600">AI-Enhanced</span>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Use Template
                </Button>
                {!template.ai_generated && (
                  <Button variant="ghost" size="sm" onClick={() => handleGenerateVariants(template.id)}>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
