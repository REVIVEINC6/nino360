"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SceneParticles } from "./scene-particles"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <SceneParticles />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />

      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="relative h-32 w-32">
          <Image src="/logo-primary.png" alt="Nino360" fill className="object-contain" />
          <div className="absolute inset-0 animate-pulse-glow">
            <Image src="/logo-primary.png" alt="" fill className="object-contain" />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-lg"
          >
            <Sparkles className="h-5 w-5 text-[#D0FF00]" />
            <span className="text-sm font-medium bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              The Superintelligent Enterprise OS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight text-balance leading-tight"
          >
            Reimagine Enterprise{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent glow-sm">
              Intelligence
            </span>{" "}
            with Nino360
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 text-balance max-w-3xl mx-auto leading-relaxed"
          >
            <span className="text-[#4F46E5] font-semibold">Generative AI</span> •{" "}
            <span className="text-[#F81CE5] font-semibold">Intelligent AI</span> •{" "}
            <span className="text-[#8B5CF6] font-semibold">ML</span> •{" "}
            <span className="text-[#D0FF00] font-semibold">Automation</span> •{" "}
            <span className="text-[#F81CE5] font-semibold">Blockchain</span>
            <br />
            unified for next-gen enterprise transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="#modules">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] hover:opacity-90 transition-opacity text-lg px-8 py-6 gap-2 neon-glow-hover"
              >
                🚀 Explore Platform
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#copilot">
              <Button
                size="lg"
                variant="outline"
                className="border-[#8B5CF6]/50 text-slate-900 hover:bg-slate-100 text-lg px-8 py-6 gap-2 bg-white/50 backdrop-blur-sm"
              >
                ✨ Watch the Copilot
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 overflow-hidden backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-2xl py-4 shadow-lg"
          >
            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 text-sm text-slate-600">
                  <span>1200+ Enterprises</span>
                  <span className="text-[#8B5CF6]">•</span>
                  <span>30+ Countries</span>
                  <span className="text-[#8B5CF6]">•</span>
                  <span>24/7 Automations</span>
                  <span className="text-[#8B5CF6]">•</span>
                  <span>Verifiable Blockchain Audit</span>
                  <span className="text-[#8B5CF6]">•</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
