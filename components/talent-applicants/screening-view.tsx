"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Plus, Settings, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ScreeningViewProps {
  templates: any[]
  history: any[]
}

export function ScreeningView({ templates, history }: ScreeningViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Screening</h1>
          <p className="text-muted-foreground">Automated candidate evaluation powered by AI</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Screenings</p>
              <p className="text-2xl font-bold">{history.length}</p>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Templates</p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Screening Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold">{template.name}</h3>
                <Badge variant={template.is_active ? "default" : "secondary"}>
                  {template.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{template.criteria?.length || 0} criteria</span>
                <span className="text-muted-foreground">Used {template.usage_count || 0} times</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Screenings</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {history.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.applicant_name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{item.score}%</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.recommendation?.replace("_", " ")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
