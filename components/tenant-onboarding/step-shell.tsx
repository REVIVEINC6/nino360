"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepShellProps {
  title: string
  description: string
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  isLoading?: boolean
  saving?: boolean
  canGoBack?: boolean
  canGoNext?: boolean
}

export function StepShell({
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  isLoading = false,
  saving = false,
  canGoBack = true,
  canGoNext = true,
}: StepShellProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-white/60">{description}</p>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_1px_#ffffff33]">
        {children}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={!canGoBack || isLoading || saving}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext || isLoading || saving}
          className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] hover:opacity-90"
        >
          {saving ? "Saving..." : nextLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
