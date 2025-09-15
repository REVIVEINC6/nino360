"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Brain,
  Cpu,
  Shield,
  Zap,
  BarChart3,
  Users,
  CreditCard,
  BadgeCheck,
  Bot,
  KeyRound,
  Lock,
  Layers,
  Globe2,
  Workflow,
  Sparkles,
  Box,
  Building2,
  Settings,
  FileText,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Nino360 — AI-Native HR & Workforce OS
 * Landing page showcasing 9 modules + advanced AI (GenAI/ML/RPA/Blockchain)
 * - TailwindCSS, framer-motion, lucide-react
 * - Production-ready structure and clean, modern styling
 * - Replace logo/links as needed; connect CTAs to your forms/app
 */

const badges = [
  { icon: <Brain className="w-4 h-4" />, label: "Generative AI Copilot" },
  { icon: <Cpu className="w-4 h-4" />, label: "Predictive ML" },
  { icon: <Workflow className="w-4 h-4" />, label: "RPA Automation" },
  { icon: <Shield className="w-4 h-4" />, label: "Blockchain Audit" },
]

const modules = [
  {
    key: "dashboard",
    name: "Dashboard",
    desc: "Executive cockpit with real‑time people, payroll, and project KPIs.",
    bullets: [
      "AI insights feed & anomaly alerts",
      "Natural‑language Q&A on org data",
      "Predictive forecasts (headcount, cost, churn)",
    ],
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    key: "crm",
    name: "CRM",
    desc: "Client & opportunity management connected to workforce planning.",
    bullets: [
      "AI deal scoring & next‑best action",
      "Quote → Contract smart‑flows",
      "Revenue projections tied to hiring",
    ],
    icon: <Users className="w-6 h-6" />,
  },
  {
    key: "talent",
    name: "Talent / ATS",
    desc: "Sourcing to offer with GenAI resumes, screening, and interview RPA.",
    bullets: ["JD & outreach auto‑draft (GenAI)", "AI match score & bias checks", "1‑click interview scheduling bots"],
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    key: "hrms",
    name: "HRMS",
    desc: "Core HR, documents, policies, and lifecycle automation.",
    bullets: ["Policy drafts & letters (GenAI)", "Smart cases & workflows (RPA)", "Wellbeing signals & nudges (ML)"],
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    key: "bench",
    name: "Bench Marketing",
    desc: "Market internal talent with AI profiles and outbound automation.",
    bullets: ["AI portfolio & pitch generator", "Hot‑match client mapping", "Multi‑channel RPA campaigns"],
    icon: <Box className="w-6 h-6" />,
  },
  {
    key: "hotlist",
    name: "Hotlist Marketing",
    desc: "Real‑time inventory of deployable talent synced to demand.",
    bullets: ["Auto‑refresh skills & visas", "Demand‑signal alerts", "Smart rate guidance (ML)"],
    icon: <BadgeCheck className="w-6 h-6" />,
  },
  {
    key: "finance",
    name: "Finance",
    desc: "Payroll, AR/AP, invoicing, and pay‑on‑pay with risk controls.",
    bullets: ["Global payroll compliance", "Fraud & variance detection", "Smart dunning & cashflow ML"],
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    key: "vms",
    name: "VMS",
    desc: "Vendors, contracts, compliance, and assignment lifecycle.",
    bullets: ["Smart contract clauses (GenAI)", "Blockchain audit trail", "RPA onboarding & checks"],
    icon: <Layers className="w-6 h-6" />,
  },
  {
    key: "projects",
    name: "Project Management",
    desc: "Resourcing, timesheets, billing, and profitability in one flow.",
    bullets: ["AI staffing & capacity plans", "Auto‑timesheet nudges (RPA)", "Profitability forecast (ML)"],
    icon: <FileText className="w-6 h-6" />,
  },
]

const features = [
  {
    icon: <Bot className="w-5 h-5" />,
    title: "AI Copilot Everywhere",
    text: "Compose emails, policies, and insights across modules with context awareness.",
  },
  {
    icon: <KeyRound className="w-5 h-5" />,
    title: "RBAC + RLS Security",
    text: "Tenant isolation, least‑privilege access, and end‑to‑end encryption.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Blockchain Compliance",
    text: "Immutable payroll, contracts, and credential verification for audits.",
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: "Global by Default",
    text: "Multi‑geo payroll, tax packs, and localization for fast expansion.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "RPA Workflows",
    text: "No‑code builders trigger bots for onboarding, payroll closes, and more.",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Open & Extensible",
    text: "Modern APIs, webhooks, and SDKs to integrate your stack quickly.",
  },
]

const logos = ["Acme", "Globex", "Umbrella", "Initech", "Stark", "Wayne"]

export function Nino360RefinedLanding() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 grid place-items-center font-bold">
              N
            </div>
            <span className="font-semibold tracking-tight">Nino360</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#modules" className="hover:text-white">
              Modules
            </a>
            <a href="#features" className="hover:text-white">
              AI & Platform
            </a>
            <a href="#security" className="hover:text-white">
              Security
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#demo"
              className="hidden sm:inline-block px-4 py-2 rounded-xl border border-white/20 hover:border-white/40"
            >
              View Demo
            </a>
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Get Started"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_40%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 relative">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your people drive your success.
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              We elevate their experience!
            </span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-4xl mx-auto leading-relaxed">
            Meet Nino360—the AI-native HR & Workforce OS that's ridiculously easy, friendly, and actually fun to use. No
            jargon, no spreadsheets—just smooth sailing for your team!
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Book a Demo"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a href="#modules" className="px-5 py-3 rounded-2xl border border-white/15 hover:border-white/30">
              Explore Modules
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-6 gap-4 opacity-80">
            {logos.map((l, i) => (
              <div
                key={i}
                className="text-sm text-slate-400 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People-First Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              10,000+ companies trust Nino360—because happy teams don't run on clunky software!
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              One platform to manage People, Payroll and Projects with AI that actually makes work enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4">
                  <Zap className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Ridiculously Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  No 200-page manuals. If you can order a pizza online, you can master Nino360.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <Sparkles className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Friendly & Fun</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  We believe HR shouldn't make you sigh heavily. Everything is built to spark joy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <Globe2 className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">All-in-One (For Real)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  HR, Payroll, Projects, AI—no more Frankenstein of multiple tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">People-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  Your folks come first, always. Nino360 just helps you show them you care.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI STRIP */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">{f.icon}</div>
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-slate-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">All 9 Modules</h2>
            <p className="text-slate-300">
              Administrative: Dashboard · Business: CRM, Talent/ATS, HRMS, Bench, Hotlist, Finance, VMS, Projects
            </p>
          </div>
          <a
            href="#contact"
            className="hidden md:inline-block px-4 py-2 rounded-xl border border-white/15 hover:border-white/30"
          >
            Talk to Sales
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-5 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">{m.icon}</div>
                <h3 className="font-semibold">{m.name}</h3>
              </div>
              <p className="mt-2 text-sm text-slate-300">{m.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {m.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 mt-0.5 text-indigo-400" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a href={`#demo-${m.key}`} className="text-indigo-300 hover:text-indigo-200 text-sm">
                  See demo →
                </a>
                <a href={`#learn-${m.key}`} className="text-slate-300 hover:text-white text-sm">
                  Learn more
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECURITY / COMPLIANCE */}
      <section id="security" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold">Enterprise‑Grade Security & Compliance</h3>
              <p className="mt-2 text-slate-300">
                RBAC, RLS, SSO/SAML, field‑level encryption, SOC2‑ready logs, and blockchain‑secured ledgers for payroll
                and contracts.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> SOC2 / ISO 27001 controls
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> PII encryption at rest & in transit
                </li>
                <li className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Key management & secrets rotation
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Immutable blockchain audit trail
                </li>
              </ul>
            </div>
            <div className="shrink-0 w-full md:w-[420px] rounded-2xl border border-white/10 bg-slate-950/40 p-6">
              <div className="text-sm text-slate-300">Sample Audit Extract</div>
              <div className="mt-2 text-xs font-mono bg-black/40 rounded-xl p-3 overflow-auto h-40 border border-white/10">
                <pre className="leading-6">{`ledger.block #829441
hash: 0xf3a8...b19c
entity: payroll.close
scope: 2025-08
actor: system.rpa
checks: tax, benefits, overtime, geo
status: VERIFIED ✅`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/10 p-10 text-center">
          <h3 className="text-3xl font-semibold">See Nino360 in Action</h3>
          <p className="mt-2 text-slate-200">
            Get a tailored walkthrough for your region, payroll, and compliance needs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Book Live Demo"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a href="#contact" className="px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40">
              Download Product Brief
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h3 className="text-2xl font-semibold">FAQs</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {[
            {
              q: "How is Nino360 different from traditional HR suites?",
              a: "We’re AI‑native: GenAI assistants, predictive ML, RPA workflows, and blockchain compliance are first‑class across modules.",
            },
            {
              q: "Can we run global payroll?",
              a: "Yes—multi‑country payroll, localized tax packs, global benefits, and regional compliance dashboards.",
            },
            {
              q: "Do you integrate with our stack?",
              a: "Open APIs, webhooks, and prebuilt connectors for identity, finance, job boards, and collaboration tools.",
            },
            {
              q: "Is data secure and tenant‑isolated?",
              a: "Strict RBAC and database RLS ensure tenant isolation; field‑level encryption safeguards PII.",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-medium">{item.q}</div>
              <div className="mt-2 text-sm text-slate-300">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Nino360: Because life's too short to dread HR
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Discover why fast-growing companies are making the switch for a sharper, more intelligent HR and Workforce
            experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Join the fun—start a free trial!"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a href="#contact" className="px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 grid place-items-center font-bold">
                N
              </div>
              <span className="font-semibold">Nino360</span>
            </div>
            <p className="mt-3 text-slate-400">The AI‑Native Workforce OS for HR, Payroll, and Projects.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-slate-300 font-medium mb-2">Product</div>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <a href="#modules" className="hover:text-white">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white">
                    AI & Platform
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-slate-300 font-medium mb-2">Company</div>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div id="contact" className="md:text-right">
            <div className="text-slate-300 font-medium mb-2">Get in Touch</div>
            <div className="text-slate-400">sales@nino360.com</div>
            <div className="text-slate-400">+1 (000) 000‑0000</div>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 pb-8">
          © {new Date().getFullYear()} Nino360 Inc. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
