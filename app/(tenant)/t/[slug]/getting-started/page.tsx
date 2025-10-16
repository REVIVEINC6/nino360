"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Users, Mail, Palette, Upload, Grid3x3, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const CHECKLIST_ITEMS = [
  {
    id: "invite",
    title: "Invite team members",
    description: "Add your colleagues to collaborate",
    icon: Users,
    link: "/t/[slug]/admin/users",
  },
  {
    id: "email",
    title: "Connect email & calendar",
    description: "Sync your communications",
    icon: Mail,
    link: "/t/[slug]/admin/integrations",
  },
  {
    id: "branding",
    title: "Configure branding",
    description: "Customize your workspace appearance",
    icon: Palette,
    link: "/t/[slug]/admin/branding",
  },
  {
    id: "import",
    title: "Import data",
    description: "Upload contacts, candidates, or other data",
    icon: Upload,
    link: "/t/[slug]/admin",
  },
  {
    id: "modules",
    title: "Choose modules",
    description: "Enable the features you need",
    icon: Grid3x3,
    link: "/t/[slug]/admin/feature-flags",
  },
]

export default function GettingStartedPage() {
  const [completed, setCompleted] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setCompleted((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const progress = (completed.length / CHECKLIST_ITEMS.length) * 100

  return (
    <div className="container max-w-4xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Nino360!</h1>
          <p className="text-muted-foreground">Let's get your workspace set up</p>
        </div>

        <Card className="glass-panel border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Setup Progress</h2>
              <p className="text-muted-foreground">
                {completed.length} of {CHECKLIST_ITEMS.length} completed
              </p>
            </div>
            <div className="text-4xl font-bold text-purple-500">{Math.round(progress)}%</div>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        <div className="space-y-4 mb-8">
          {CHECKLIST_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isCompleted = completed.includes(item.id)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-panel border-white/10 p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-white/40" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <Link href={item.link.replace("[slug]", "demo")}>
                        <Button variant="outline" size="sm" className="border-white/10 bg-transparent">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {progress === 100 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="glass-panel border-purple-500 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <Rocket className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-muted-foreground mb-6">Your workspace is ready to use</p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Go to Dashboard
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
