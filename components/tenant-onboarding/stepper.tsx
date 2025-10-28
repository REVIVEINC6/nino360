"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
  completed: boolean
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Onboarding progress" className="space-y-1">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.completed
        const isClickable = step.id < currentStep

        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick?.(step.id)}
            disabled={!isClickable}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              "text-left group",
              isActive && "bg-white/10 backdrop-blur-xl border border-white/20",
              !isActive && "hover:bg-white/5",
              !isClickable && "cursor-not-allowed opacity-50",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                "border-2 transition-all",
                isCompleted && "bg-[#8B5CF6] border-[#8B5CF6]",
                isActive && !isCompleted && "border-[#D0FF00] bg-[#D0FF00]/10",
                !isActive && !isCompleted && "border-white/20",
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={cn("text-sm font-medium", isActive && "text-[#D0FF00]")}>{step.id}</span>
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isActive && "text-white",
                !isActive && "text-white/60",
              )}
            >
              {step.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
