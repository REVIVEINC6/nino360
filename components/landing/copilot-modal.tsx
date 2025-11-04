"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, CheckCircle2 } from "lucide-react"

interface CopilotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CopilotModal({ open, onOpenChange }: CopilotModalProps) {
  const [prompt, setPrompt] = useState(
    "Create a CRM opportunity for Acme, assign Priya, schedule demo next Tuesday, and draft follow-up email.",
  )
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { label: "Plan", icon: "🧠", description: "Analyzing request and creating execution plan" },
    { label: "Tool: CRM", icon: "📊", description: "Creating opportunity in CRM" },
    { label: "Tool: Calendar", icon: "📅", description: "Scheduling demo for next Tuesday" },
    { label: "Draft Email", icon: "✉️", description: "Generating follow-up email" },
    { label: "Ledger Attest", icon: "🔗", description: "Recording action on blockchain" },
  ]

  const handleExecute = async () => {
    setIsExecuting(true)
    setCurrentStep(0)

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep(i + 1)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsExecuting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#D0FF00]" />
            Nino Copilot - Live Demo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your command..."
              className="flex-1 glass border-white/20"
              disabled={isExecuting}
            />
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-linear-to-r from-[#4F46E5] to-[#A855F7]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70">AI Orchestration</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: currentStep > index ? 1 : 0.3,
                      x: 0,
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg glass-card ${
                      currentStep === index + 1 ? "border-[#D0FF00] border-2" : "border-white/10"
                    }`}
                  >
                    <div className="text-2xl">{step.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{step.label}</div>
                      <div className="text-sm text-white/60">{step.description}</div>
                    </div>
                    {currentStep > index && <CheckCircle2 className="h-5 w-5 text-[#D0FF00]" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {currentStep === steps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg glass-card border-[#D0FF00] border-2 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-[#D0FF00] mx-auto mb-2" />
              <p className="font-semibold">Execution Complete!</p>
              <p className="text-sm text-white/60 mt-1">All actions verified and recorded on blockchain</p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
