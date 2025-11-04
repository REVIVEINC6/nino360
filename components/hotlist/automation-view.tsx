"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Zap, Plus } from "lucide-react"
import { CampaignComposer } from "./campaign-composer"
import { AutomationRulesList } from "./automation-rules-list"
import { CreateRuleDialog } from "./create-rule-dialog"

interface AutomationRule {
  id: string
  name: string
  trigger_type: string
  conditions: any
  actions: any
  is_active: boolean
  created_at: string
}

interface AutomationViewProps {
  initialRules: AutomationRule[]
}

export function AutomationView({ initialRules }: AutomationViewProps) {
  const [rules, setRules] = useState(initialRules)
  const [showCreateRule, setShowCreateRule] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Campaign & Automation
          </h1>
          <p className="text-muted-foreground mt-1">Create campaigns and automate your hotlist workflows</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="composer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="composer" className="gap-2">
            <Send className="h-4 w-4" />
            Campaign Composer
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Zap className="h-4 w-4" />
            Automation Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="mt-6">
          <CampaignComposer />
        </TabsContent>

        <TabsContent value="rules" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateRule(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Rule
            </Button>
          </div>

          <AutomationRulesList
            rules={rules}
            onRuleUpdate={(updatedRule) => {
              setRules(rules.map((r) => (r.id === updatedRule.id ? updatedRule : r)))
            }}
            onRuleDelete={(ruleId) => {
              setRules(rules.filter((r) => r.id !== ruleId))
            }}
          />

          <CreateRuleDialog
            open={showCreateRule}
            onOpenChange={setShowCreateRule}
            onSuccess={(newRule) => {
              setRules([newRule, ...rules])
              setShowCreateRule(false)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
