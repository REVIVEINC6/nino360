"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Save,
  Loader2,
  TrendingUp,
  Calendar,
  DollarSign,
  Building2,
  User,
  Target,
  AlertCircle,
} from "lucide-react"
import { createOpportunityWithAI } from "@/app/(dashboard)/crm/actions/opportunities"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NewOpportunityForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEnriching, setIsEnriching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiPredictions, setAiPredictions] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: "",
    account_id: "",
    contact_id: "",
    amount: "",
    close_date: "",
    description: "",
    probability: "50",
  })

  const handleAIEnrich = async () => {
    if (!formData.title) {
      setError("Please enter an opportunity title first")
      return
    }

    setIsEnriching(true)
    setError(null)

    // Simulate AI enrichment (in production, call actual AI endpoint)
    setTimeout(() => {
      const predictions = {
        predicted_amount: Math.floor(Math.random() * 200000) + 50000,
        predicted_close_date: new Date(Date.now() + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        win_probability: Math.floor(Math.random() * 40) + 40,
        confidence: Math.floor(Math.random() * 30) + 70,
        insights: [
          "Similar deals in this industry average $" + (Math.floor(Math.random() * 100000) + 50000).toLocaleString(),
          "Typical sales cycle is 45-60 days",
          "High engagement score indicates strong interest",
        ],
      }

      setAiPredictions(predictions)
      setFormData((prev) => ({
        ...prev,
        amount: predictions.predicted_amount.toString(),
        close_date: predictions.predicted_close_date,
        probability: predictions.win_probability.toString(),
      }))
      setIsEnriching(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createOpportunityWithAI({
        title: formData.title,
        account_id: formData.account_id || undefined,
        contact_id: formData.contact_id || undefined,
        amount: formData.amount ? Number.parseFloat(formData.amount) : undefined,
        close_date: formData.close_date || undefined,
        description: formData.description || undefined,
      })

      if (result.success) {
        router.push(`/crm/opportunities`)
        router.refresh()
      } else {
        setError(result.error || "Failed to create opportunity")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Form Card */}
      <Card className="glass-panel border-2 border-white/20 shadow-2xl">
        <CardHeader className="border-b border-white/10 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Opportunity Details</CardTitle>
              <CardDescription>Fill in the details or let AI help you</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAIEnrich}
              disabled={isEnriching || !formData.title}
              className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Auto-Fill
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Alert variant="destructive" className="glass-panel border-red-500/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Predictions Banner */}
          <AnimatePresence>
            {aiPredictions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-2 border-blue-500/30 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">AI Predictions</h4>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">
                            {aiPredictions.confidence}% Confidence
                          </Badge>
                        </div>
                        <div className="grid gap-2 text-sm">
                          {aiPredictions.insights.map((insight: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Opportunity Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Enterprise License Renewal"
                required
                className="glass-input h-12 text-lg"
              />
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label htmlFor="account" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                Account
              </Label>
              <Select
                value={formData.account_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, account_id: value }))}
              >
                <SelectTrigger className="glass-input h-11">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Acme Corp</SelectItem>
                  <SelectItem value="2">TechStart Inc</SelectItem>
                  <SelectItem value="3">GlobalTech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contact" className="flex items-center gap-2">
                <User className="h-4 w-4 text-pink-500" />
                Contact
              </Label>
              <Select
                value={formData.contact_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, contact_id: value }))}
              >
                <SelectTrigger className="glass-input h-11">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                  <SelectItem value="3">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Deal Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  className="glass-input h-11 pl-7"
                />
              </div>
            </div>

            {/* Close Date */}
            <div className="space-y-2">
              <Label htmlFor="close_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                Expected Close Date
              </Label>
              <Input
                id="close_date"
                type="date"
                value={formData.close_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, close_date: e.target.value }))}
                className="glass-input h-11"
              />
            </div>

            {/* Probability */}
            <div className="space-y-2">
              <Label htmlFor="probability" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Win Probability
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="probability"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData((prev) => ({ ...prev, probability: e.target.value }))}
                  className="flex-1"
                />
                <Badge variant="secondary" className="w-16 justify-center">
                  {formData.probability}%
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Add any additional details about this opportunity..."
                rows={4}
                className="glass-input resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="glass-panel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !formData.title}
          className="bg-linear-to-r from-blue-500 via-purple-600 to-pink-600 text-white border-0 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 shadow-lg px-8"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Opportunity
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
