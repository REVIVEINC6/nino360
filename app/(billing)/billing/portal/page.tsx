"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, Download, Calendar, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Subscription {
  plan_code: string
  interval: string
  status: string
  current_period_end: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: string
  due_date: string
  paid_at: string | null
  hosted_url: string | null
}

export default function BillingPortalPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Get current subscription
      const { data: subData } = await supabase.from("subscriptions").select("*").single()

      setSubscription(subData)

      // Get invoices
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false })

      setInvoices(invoiceData || [])
    } catch (error) {
      console.error("Failed to load billing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    toast({
      title: "Opening billing portal",
      description: "Redirecting to payment provider...",
    })
    // In production, this would redirect to Stripe/Razorpay portal
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and view invoices</p>
        </div>

        {/* Current Subscription */}
        <Card className="glass-panel border-white/10 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-purple-400">
                  {subscription?.plan_code?.toUpperCase() || "FREE"}
                </span>
                <Badge
                  variant={subscription?.status === "active" ? "default" : "secondary"}
                  className="bg-green-500/20 text-green-400"
                >
                  {subscription?.status || "Active"}
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleManageSubscription}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </div>

          {subscription && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Billing Cycle</span>
                </div>
                <p className="text-white font-medium capitalize">{subscription.interval}ly</p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Next Billing Date</span>
                </div>
                <p className="text-white font-medium">
                  {subscription.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Amount</span>
                </div>
                <p className="text-white font-medium">
                  ${subscription.plan_code === "pro" ? (subscription.interval === "month" ? "49" : "490") : "0"}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Invoices */}
        <Card className="glass-panel border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-6">Invoice History</h2>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <DollarSign className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {invoice.invoice_number || `Invoice #${invoice.id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-white/60">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-white">
                        ${invoice.amount.toFixed(2)} {invoice.currency}
                      </p>
                      <Badge
                        variant={invoice.status === "paid" ? "default" : "secondary"}
                        className={
                          invoice.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>

                    {invoice.hosted_url && (
                      <Button variant="outline" size="sm" className="border-white/10 bg-transparent" asChild>
                        <a href={invoice.hosted_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
