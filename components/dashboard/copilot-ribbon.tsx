"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, Plus, FileText, Calendar, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { askCopilot } from "@/app/(dashboard)/dashboard/actions"

const quickActions = [
  { label: "Create Opportunity", icon: Plus, action: "create_opportunity", href: "/crm/opportunities/new" },
  { label: "Schedule Interviews", icon: Calendar, action: "schedule_interviews", href: "/talent/interviews" },
  { label: "Raise Invoice", icon: DollarSign, action: "raise_invoice", href: "/finance/invoices/new" },
  { label: "Start Campaign", icon: FileText, action: "start_campaign", href: "/hotlist/campaigns/new" },
]

const orchestrationSteps = ["Planner", "Tools", "Policy/DLP", "Execute", "Ledger Hash"]

export function CopilotRibbon() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [response, setResponse] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsProcessing(true)
    setResponse(null)

    for (let i = 0; i < orchestrationSteps.length; i++) {
      setActiveStep(i)
      await new Promise((resolve) => setTimeout(resolve, 600))
    }

    try {
      const result = await askCopilot({ question: query })
      setResponse(result.answer)
    } catch (error) {
      setResponse("Sorry, I encountered an error processing your request. Please try again.")
    }

    setIsProcessing(false)
    setActiveStep(null)
    setQuery("")
  }

  const handleQuickAction = (href: string) => {
    router.push(href)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel border-primary/20 p-4 mb-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">Nino Copilot</span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-3xl">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Summarize week: wins, risks, cashflow; schedule hiring sync; draft follow-ups..."
              className="pr-12 bg-background/50 border-primary/20 focus:border-primary/40"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              disabled={isProcessing || !query.trim()}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        <div className="hidden lg:flex items-center gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              className="gap-2 border-primary/20 hover:border-primary/40 bg-transparent"
              onClick={() => handleQuickAction(action.href)}
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/10"
          >
            {orchestrationSteps.map((step, index) => (
              <Badge
                key={step}
                variant={index === activeStep ? "default" : index < (activeStep || 0) ? "secondary" : "outline"}
                className={cn("transition-all", index === activeStep && "neon-glow")}
              >
                {step}
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-primary/10"
          >
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
