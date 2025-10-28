"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, ArrowRight, Users, Briefcase, DollarSign, Settings } from "lucide-react"

const steps = [
  {
    id: "invite-team",
    title: "Invite Your Team",
    description: "Add team members and assign roles to get everyone onboarded",
    icon: Users,
    link: "/admin/invitations",
    completed: false,
  },
  {
    id: "add-candidates",
    title: "Add Candidates",
    description: "Import or add candidates to start building your talent pipeline",
    icon: Briefcase,
    link: "/ats/candidates",
    completed: false,
  },
  {
    id: "configure-billing",
    title: "Configure Billing",
    description: "Set up payment methods and billing preferences",
    icon: DollarSign,
    link: "/settings/billing",
    completed: false,
  },
  {
    id: "customize-settings",
    title: "Customize Settings",
    description: "Personalize your workspace with branding and preferences",
    icon: Settings,
    link: "/settings/account",
    completed: false,
  },
]

export function GettingStartedContent() {
  const router = useRouter()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const progress = (completedSteps.length / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to Nino360! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">Let's get you set up in just a few steps</p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Setup Progress</span>
              <span className="text-muted-foreground">
                {completedSteps.length} of {steps.length} completed
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = completedSteps.includes(step.id)

            return (
              <Card
                key={step.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(step.link)
                      }}
                      className="group/btn"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Skip for Now
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            disabled={completedSteps.length < steps.length}
            className="bg-gradient-to-r from-primary via-purple-500 to-pink-500"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
