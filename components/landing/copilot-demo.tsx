"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

const examplePrompts = [
  "Create a CRM opportunity for Acme, assign Priya, schedule demo next Tuesday, and draft follow-up email.",
  "Find available consultants with React skills for a 6-month project starting next month.",
  "Generate invoice for Project Alpha, send to client, and update cash flow forecast.",
  "Analyze timesheet anomalies for last week and flag any compliance issues.",
]

const orchestrationSteps = [
  { name: "Planner", status: "complete", description: "Breaking down task into steps" },
  { name: "Tools", status: "complete", description: "Selecting CRM, Calendar, Email APIs" },
  { name: "Memory", status: "complete", description: "Retrieving context about Acme & Priya" },
  { name: "Policy", status: "complete", description: "Checking permissions & compliance" },
  { name: "Blockchain", status: "active", description: "Recording action hash to ledger" },
]

export function CopilotDemo() {
  const [prompt, setPrompt] = useState(examplePrompts[0])
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecute = () => {
    setIsExecuting(true)
    setTimeout(() => setIsExecuting(false), 3000)
  }

  return (
    <section id="copilot" className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Nino Copilot —{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Live Generative AI Demo
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Watch AI orchestrate complex workflows in natural language
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <Sparkles className="h-5 w-5 text-[#D0FF00]" />
                AI Prompt Console
              </h3>

              <div className="space-y-4">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your command..."
                  className="bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                />

                <Button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="w-full bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] hover:opacity-90 transition-opacity text-white"
                >
                  {isExecuting ? "Executing..." : "Execute AI Command"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-sm text-slate-600">Try these examples:</p>
                {examplePrompts.slice(1).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="block w-full text-left text-sm text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-6 text-slate-900">AI Orchestration Flow</h3>

            <div className="space-y-4">
              {orchestrationSteps.map((step, index) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: isExecuting ? index * 0.5 : 0 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "complete" ? "bg-green-500/20" : "bg-[#8B5CF6]/20"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-slate-900">{step.name}</h4>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {isExecuting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <p className="text-sm text-green-600">✓ Task completed successfully! Blockchain proof: 0x7a8f...3d2e</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
