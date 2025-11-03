"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2 } from "lucide-react"

interface LinkageRule {
  id: string
  rule_name: string
  rule_type: string
  priority: number
  is_active: boolean
  allocation_method: string
  ai_suggested?: boolean
  ai_confidence?: number
}

interface LinkageRulesPanelProps {
  rules: LinkageRule[]
  onCreateRule?: () => void
  onEditRule?: (ruleId: string) => void
  onToggleRule?: (ruleId: string, isActive: boolean) => void
  onDeleteRule?: (ruleId: string) => void
}

export function LinkageRulesPanel({
  rules,
  onCreateRule,
  onEditRule,
  onToggleRule,
  onDeleteRule,
}: LinkageRulesPanelProps) {
  const getRuleTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      direct: "bg-blue-500/20 text-blue-300",
      split: "bg-green-500/20 text-green-300",
      net: "bg-orange-500/20 text-orange-300",
      reroute: "bg-purple-500/20 text-purple-300",
    }

    return (
      <Badge variant="secondary" className={variants[type] || variants.direct}>
        {type}
      </Badge>
    )
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Linkage Rules</CardTitle>
          <Button size="sm" onClick={onCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-white/10"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{rule.rule_name}</span>
                  {getRuleTypeBadge(rule.rule_type)}
                  {rule.ai_suggested && (
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 text-xs">
                      AI {(rule.ai_confidence! * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Priority: {rule.priority} • Method: {rule.allocation_method}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={rule.is_active} onCheckedChange={(checked) => onToggleRule?.(rule.id, checked)} />
                <Button variant="ghost" size="sm" onClick={() => onEditRule?.(rule.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteRule?.(rule.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
