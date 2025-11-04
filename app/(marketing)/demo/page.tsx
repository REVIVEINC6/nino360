"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Mail, Building2, Users, Briefcase, Phone, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const DEMO_SLOTS = [
  { date: "2025-01-15", time: "10:00 AM", available: true },
  { date: "2025-01-15", time: "2:00 PM", available: true },
  { date: "2025-01-16", time: "11:00 AM", available: true },
  { date: "2025-01-16", time: "3:00 PM", available: false },
  { date: "2025-01-17", time: "10:00 AM", available: true },
  { date: "2025-01-17", time: "1:00 PM", available: true },
]

export default function DemoPage() {
  const [step, setStep] = useState<"form" | "schedule" | "success">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadData, setLeadData] = useState({
    name: "",
    work_email: "",
    company: "",
    size: "",
    industry: "",
    phone: "",
  })
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const { toast } = useToast()

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setStep("schedule")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScheduleDemo = async () => {
    if (!selectedSlot) {
      toast({
        title: "Select a time",
        description: "Please choose a demo slot",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/demo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadData.work_email,
          slot: selectedSlot,
        }),
      })

      if (!response.ok) throw new Error("Failed to book")

      setStep("success")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book demo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            NINO360
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Demo</h1>
            <p className="text-xl text-white/70">See Nino360 in action with a personalized walkthrough</p>
          </div>

          {step === "form" && (
            <Card className="glass-panel border-white/10 p-8">
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">
                      <User className="inline h-4 w-4 mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      required
                      value={leadData.name}
                      onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_email" className="text-white/80">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Work Email *
                    </Label>
                    <Input
                      id="work_email"
                      type="email"
                      required
                      value={leadData.work_email}
                      onChange={(e) => setLeadData({ ...leadData, work_email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white/80">
                      <Building2 className="inline h-4 w-4 mr-2" />
                      Company *
                    </Label>
                    <Input
                      id="company"
                      required
                      value={leadData.company}
                      onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-white/80">
                      <Users className="inline h-4 w-4 mr-2" />
                      Company Size
                    </Label>
                    <select
                      id="size"
                      value={leadData.size}
                      onChange={(e) => setLeadData({ ...leadData, size: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white/80">
                      <Briefcase className="inline h-4 w-4 mr-2" />
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      value={leadData.industry}
                      onChange={(e) => setLeadData({ ...leadData, industry: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/80">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={leadData.phone}
                      onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Continue to Schedule"
                  )}
                </Button>
              </form>
            </Card>
          )}

          {step === "schedule" && (
            <Card className="glass-panel border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Choose a Time</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {DEMO_SLOTS.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                        ? "border-purple-500 bg-purple-500/20"
                        : slot.available
                          ? "border-white/10 bg-white/5 hover:border-purple-500/50"
                          : "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">{slot.date}</div>
                        <div className="text-white/60 text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1 border-white/10 text-white">
                  Back
                </Button>
                <Button
                  onClick={handleScheduleDemo}
                  disabled={!selectedSlot || isSubmitting}
                  className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Demo"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {step === "success" && (
            <Card className="glass-panel border-white/10 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Demo Scheduled!</h2>
              <p className="text-white/70 mb-6">
                We've sent a calendar invite to <span className="text-white font-medium">{leadData.work_email}</span>
              </p>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">{selectedSlot?.date}</span>
                  <span className="text-white/60">at</span>
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">{selectedSlot?.time}</span>
                </div>
              </div>
              <Link href="/">
                <Button className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Back to Home
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
