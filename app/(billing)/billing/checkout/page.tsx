"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "pro"
  const interval = (searchParams.get("interval") || "month") as "month" | "year"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const planDetails: Record<string, { name: string; price: { month: number; year: number } }> = {
    pro: { name: "Pro", price: { month: 49, year: 490 } },
    enterprise: { name: "Enterprise", price: { month: 0, year: 0 } },
  }

  const selectedPlan = planDetails[plan]
  const price = selectedPlan?.price[interval] || 0

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_code: plan, interval }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to create checkout session")

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error: any) {
      setError(error.message || "Failed to initiate checkout")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-panel border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h1>
            <p className="text-white/60">Subscribe to {selectedPlan?.name} Plan</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Plan</span>
                <span className="text-white font-medium">{selectedPlan?.name}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Billing</span>
                <span className="text-white font-medium">{interval === "month" ? "Monthly" : "Yearly"}</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-2xl font-bold text-white">
                    ${price}
                    <span className="text-sm text-white/60">/{interval === "month" ? "mo" : "yr"}</span>
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full border-white/10 bg-transparent text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>

            <div className="flex items-start gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
              <div className="text-sm text-green-200">
                <p className="font-medium mb-1">14-day free trial included</p>
                <p className="text-green-200/80">Cancel anytime during the trial period</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
