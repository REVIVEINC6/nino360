"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Check, Rocket } from "lucide-react"
import { completeOnboarding } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ReviewLaunchStepProps {
  tenantId: string
  onComplete: () => void
  context: {
    name: string
    slug: string
    completedSteps: number[]
  }
}

export function ReviewLaunchStep({ tenantId, onComplete, context }: ReviewLaunchStepProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [launching, setLaunching] = useState(false)

  const steps = [
    { id: 1, label: "Company Profile", completed: context.completedSteps.includes(1) },
    { id: 2, label: "Branding", completed: context.completedSteps.includes(2) },
    { id: 3, label: "Policies", completed: context.completedSteps.includes(3) },
    { id: 4, label: "Integrations", completed: context.completedSteps.includes(4) },
    { id: 5, label: "Import Data", completed: context.completedSteps.includes(5) },
    { id: 6, label: "Roles & Permissions", completed: context.completedSteps.includes(6) },
    { id: 7, label: "Enable Modules", completed: context.completedSteps.includes(7) },
    { id: 8, label: "Invite Users", completed: context.completedSteps.includes(8) },
  ]

  const completedCount = steps.filter((s) => s.completed).length
  const progress = Math.round((completedCount / steps.length) * 100)

  const handleLaunch = async () => {
    setLaunching(true)
    try {
      await completeOnboarding(tenantId)
      toast({
        title: "Success!",
        description: "Your workspace is ready to use",
      })
      onComplete()
      router.push("/tenant/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive",
      })
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-10 h-10 text-[#8B5CF6]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h3>
          <p className="text-white/60">
            You've completed {completedCount} of {steps.length} setup steps ({progress}%)
          </p>
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed ? "bg-[#10b981]" : "bg-white/10"
                }`}
              >
                {step.completed && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm ${step.completed ? "text-white" : "text-white/60"}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6">
        <h4 className="text-white font-medium mb-3">What happens next?</h4>
        <ul className="space-y-2 text-white/60 text-sm">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
            <span>Your workspace will be activated and ready to use</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
            <span>Invited users will receive email invitations</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
            <span>You can customize settings anytime from the dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
            <span>Access all enabled modules immediately</span>
          </li>
        </ul>
      </Card>

      <button
        onClick={handleLaunch}
        disabled={launching}
        className="w-full bg-[#D0FF00] hover:bg-[#D0FF00]/90 text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Rocket className="w-5 h-5" />
        {launching ? "Launching..." : "Launch Workspace"}
      </button>
    </div>
  )
}
