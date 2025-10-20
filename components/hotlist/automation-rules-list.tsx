"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Zap } from "lucide-react"
import { toggleAutomationRule, deleteAutomationRule } from "@/app/(dashboard)/hotlist/actions/campaigns"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface AutomationRule {
  id: string
  name: string
  trigger_type: string
  conditions: any
  actions: any
  is_active: boolean
  created_at: string
}

interface AutomationRulesListProps {
  rules: AutomationRule[]
  onRuleUpdate: (rule: AutomationRule) => void
  onRuleDelete: (ruleId: string) => void
}

export function AutomationRulesList({ rules, onRuleUpdate, onRuleDelete }: AutomationRulesListProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(rule: AutomationRule) {
    startTransition(async () => {
      const result = await toggleAutomationRule(rule.id, !rule.is_active)
      if (result.success) {
        onRuleUpdate({ ...rule, is_active: !rule.is_active })
        toast.success(`Rule ${!rule.is_active ? "enabled" : "disabled"}`)
      } else {
        toast.error("Failed to toggle rule")
      }
    })
  }

  function handleDelete(ruleId: string) {
    if (!confirm("Are you sure you want to delete this automation rule?")) return

    startTransition(async () => {
      const result = await deleteAutomationRule(ruleId)
      if (result.success) {
        onRuleDelete(ruleId)
        toast.success("Rule deleted")
      } else {
        toast.error("Failed to delete rule")
      }
    })
  }

  const triggerTypeLabels: Record<string, string> = {
    candidate_added: "Candidate Added",
    requirement_created: "Requirement Created",
    match_found: "Match Found",
    response_received: "Response Received",
    scheduled: "Scheduled",
  }

  if (rules.length === 0) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-12 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No automation rules</h3>
          <p className="text-muted-foreground mb-4">Create your first automation rule to streamline your workflow</p>
          <Button>Create Rule</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <Card key={rule.id} className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{rule.name}</h4>
                  <Badge variant={rule.is_active ? "default" : "secondary"}>
                    {rule.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  <span>Trigger: {triggerTypeLabels[rule.trigger_type] || rule.trigger_type}</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(rule.created_at), { addSuffix: true })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={rule.is_active} onCheckedChange={() => handleToggle(rule)} disabled={isPending} />

                <Button variant="ghost" size="icon" disabled={isPending}>
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(rule.id)}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
