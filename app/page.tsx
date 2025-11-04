"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { HeroSection } from "@/components/landing/hero-section"
import { PillarsSection } from "@/components/landing/pillars-section"
import { ModulesCarousel } from "@/components/landing/modules-carousel"
import { CopilotDemo } from "@/components/landing/copilot-demo"
import { AutomationOrchestrator } from "@/components/landing/automation-orchestrator"
import { MLInsightsDashboard } from "@/components/landing/ml-insights-dashboard"
import { BlockchainTrust } from "@/components/landing/blockchain-trust"
import { PlatformPreview } from "@/components/landing/platform-preview"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-slate-50 to-white text-slate-900 overflow-hidden">
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 backdrop-blur-xl bg-white/70"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image src="/logo-primary.png" alt="Nino360" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold font-heading bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              NINO360
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#platform" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Platform
            </Link>
            <Link href="#modules" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Modules
            </Link>
            <Link href="#copilot" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              AI Copilot
            </Link>
            <Link href="#trust" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Trust & Security
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] hover:opacity-90 transition-opacity text-white">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <HeroSection />

      <PillarsSection />

      <ModulesCarousel />

      <CopilotDemo />

      <AutomationOrchestrator />

      <MLInsightsDashboard />

      <BlockchainTrust />

      <PlatformPreview />

      <TestimonialsSection />

      <CTASection />

      <footer className="border-t border-slate-200/50 py-12 backdrop-blur-xl bg-white/70">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                <Image src="/logo-primary.png" alt="Nino360" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold font-heading bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                NINO360
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <Link href="#platform" className="hover:text-slate-900 transition-colors">
                Platform
              </Link>
              <Link href="#security" className="hover:text-slate-900 transition-colors">
                Security & Trust
              </Link>
              <Link href="#partners" className="hover:text-slate-900 transition-colors">
                Partners
              </Link>
              <Link href="#careers" className="hover:text-slate-900 transition-colors">
                Careers
              </Link>
              <Link href="#contact" className="hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>© 2025 Nino360. Designed with Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
