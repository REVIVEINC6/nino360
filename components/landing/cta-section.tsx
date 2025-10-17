"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const rotateX = useTransform(y, [-300, 300], [10, -10])
  const rotateY = useTransform(x, [-300, 300], [-10, 10])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("cta-section")?.getBoundingClientRect()
      if (rect) {
        mouseX.set(e.clientX - rect.left - rect.width / 2)
        mouseY.set(e.clientY - rect.top - rect.height / 2)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleSubmit = async () => {
    if (!name || !email || !company) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
        })
        setName("")
        setEmail("")
        setCompany("")
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="cta-section"
      className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 50%, #4F46E5, #8B5CF6, #A855F7, transparent)",
          rotateX,
          rotateY,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-bold font-heading text-slate-900">
            Shape the Future with{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Nino360
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Launch with GenAI, Intelligent AI, ML, Automation, and Blockchain trust.
          </p>

          <div className="max-w-2xl mx-auto p-8 rounded-2xl backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg">
            <div className="space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Work Email"
                className="bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              />
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] hover:opacity-90 transition-opacity text-lg gap-2 text-white"
              >
                {isSubmitting ? "Submitting..." : "Request a Demo"}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-[#8B5CF6]/50 text-slate-900 hover:bg-slate-100 text-lg bg-white/50"
              >
                Join Partner Network
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-500">Join 1200+ enterprises transforming with AI-powered intelligence</p>
        </motion.div>
      </div>
    </section>
  )
}
