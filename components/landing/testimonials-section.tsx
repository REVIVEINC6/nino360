"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "Nino360 is our enterprise nervous system. It connects every department with intelligent automation.",
    author: "Sarah Chen",
    role: "CTO, TechCorp Global",
    company: "TechCorp",
  },
  {
    quote: "End-to-end visibility with verifiable AI trust. We've reduced operational overhead by 60%.",
    author: "Michael Rodriguez",
    role: "VP Operations, Staffing Solutions Inc",
    company: "Staffing Solutions",
  },
  {
    quote: "The AI copilot understands our business context better than any tool we've used. Game-changing.",
    author: "Priya Patel",
    role: "Head of HR, Enterprise Dynamics",
    company: "Enterprise Dynamics",
  },
]

const logos = ["TechCorp", "Staffing Solutions", "Enterprise Dynamics", "Global Consulting", "Innovation Labs"]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#0a0015] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Global Innovators
            </span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#8B5CF6]/30 backdrop-blur-sm">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-[#8B5CF6]/30" />

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6"
            >
              <p className="text-2xl text-white/90 leading-relaxed">"{testimonials[currentIndex].quote}"</p>
              <div>
                <p className="font-semibold text-lg">{testimonials[currentIndex].author}</p>
                <p className="text-white/60">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="ghost" size="icon" onClick={prev} className="text-white hover:bg-white/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? "w-8 bg-[#8B5CF6]" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={next} className="text-white hover:bg-white/10">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-12"
        >
          {logos.map((logo, i) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#8B5CF6]/50 transition-colors"
            >
              <span className="text-white/60 font-medium">{logo}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
