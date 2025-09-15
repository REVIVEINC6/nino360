"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
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
 * Nino360 — AI-Native HR & Workforce OS (Light Theme)
 * Landing page showcasing 9 modules + advanced AI (GenAI/ML/RPA/Blockchain)
 * - Light, friendly design inspired by Keka's approachable messaging
 * - Emphasizes ease of use and people-first approach
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

export function Nino360LightLanding() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/login")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/nino360-color-flat.png" alt="Nino360 Logo" className="h-8 w-auto" />
            <span className="font-semibold tracking-tight text-gray-900">Nino360</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#modules" className="hover:text-gray-900">
              Modules
            </a>
            <a href="#features" className="hover:text-gray-900">
              AI & Platform
            </a>
            <a href="#security" className="hover:text-gray-900">
              Security
            </a>
            <a href="#faq" className="hover:text-gray-900">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#demo"
              className="hidden sm:inline-block px-4 py-2 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              View Demo
            </a>
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Get Started"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.1),transparent_40%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 relative">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight text-center"
          >
            Your people drive your success.
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              We elevate their experience!
            </span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed text-center">
            Meet Nino360—the AI-native HR & Workforce OS that's ridiculously easy, friendly, and actually fun to use. No
            jargon, no spreadsheets—just smooth sailing for your team!
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {badges.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <div className="mt-8 mb-8 flex justify-center">
            <div className="relative max-w-4xl w-full">
              <img
                src="/images/hero-dashboard.jpg"
                alt="Nino360 HR Dashboard Interface"
                className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
          <div className="mt-8 flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Get a demo—It's fun, we promise!"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a
              href="#modules"
              className="px-5 py-3 rounded-2xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              Explore Modules
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-6 gap-4 opacity-80">
            {logos.map((l, i) => (
              <div
                key={i}
                className="text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2 text-center shadow-sm"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People-First Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100/50 to-purple-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              10,000+ companies trust Nino360—because happy teams don't run on clunky software!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One platform to manage People, Payroll and Projects with AI that actually makes work enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4">
                  <Zap className="text-white" size={32} />
                </div>
                <CardTitle className="text-gray-900 text-xl">Ridiculously Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  No 200-page manuals. If you can order a pizza online, you can master Nino360.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <Sparkles className="text-white" size={32} />
                </div>
                <CardTitle className="text-gray-900 text-xl">Friendly & Fun</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We believe HR shouldn't make you sigh heavily. Everything is built to spark joy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <Globe2 className="text-white" size={32} />
                </div>
                <CardTitle className="text-gray-900 text-xl">All-in-One (For Real)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  HR, Payroll, Projects, AI—no more Frankenstein of multiple tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <CardTitle className="text-gray-900 text-xl">People-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
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
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">{f.icon}</div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">All 9 Modules</h2>
            <p className="text-gray-600">
              Administrative: Dashboard · Business: CRM, Talent/ATS, HRMS, Bench, Hotlist, Finance, VMS, Projects
            </p>
          </div>
          <a
            href="#contact"
            className="hidden md:inline-block px-4 py-2 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
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
              className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">{m.icon}</div>
                <h3 className="font-semibold text-gray-900">{m.name}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">{m.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {m.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 text-blue-500" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a href={`#demo-${m.key}`} className="text-blue-600 hover:text-blue-700 text-sm">
                  See demo →
                </a>
                <a href={`#learn-${m.key}`} className="text-gray-600 hover:text-gray-900 text-sm">
                  Learn more
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECURITY / COMPLIANCE */}
      <section id="security" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold text-gray-900">Enterprise‑Grade Security & Compliance</h3>
              <p className="mt-2 text-gray-600">
                RBAC, RLS, SSO/SAML, field‑level encryption, SOC2‑ready logs, and blockchain‑secured ledgers for payroll
                and contracts.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" /> SOC2 / ISO 27001 controls
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" /> PII encryption at rest & in transit
                </li>
                <li className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-500" /> Key management & secrets rotation
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" /> Immutable blockchain audit trail
                </li>
              </ul>
            </div>
            <div className="shrink-0 w-full md:w-[420px] rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="text-sm text-gray-600">Sample Audit Extract</div>
              <div className="mt-2 text-xs font-mono bg-white rounded-xl p-3 overflow-auto h-40 border border-gray-200">
                <pre className="leading-6 text-gray-700">{`ledger.block #829441
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
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-tr from-blue-50 to-purple-50 p-10 text-center">
          <h3 className="text-3xl font-semibold text-gray-900">See Nino360 in Action</h3>
          <p className="mt-2 text-gray-600">
            Get a tailored walkthrough for your region, payroll, and compliance needs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Book Live Demo"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a
              href="#contact"
              className="px-6 py-3 rounded-2xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              Download Product Brief
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h3 className="text-2xl font-semibold text-gray-900">FAQs</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {[
            {
              q: "How is Nino360 different from traditional HR suites?",
              a: "We're AI‑native: GenAI assistants, predictive ML, RPA workflows, and blockchain compliance are first‑class across modules.",
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
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="font-medium text-gray-900">{item.q}</div>
              <div className="mt-2 text-sm text-gray-600">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100/50 to-purple-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Nino360: Because life's too short to dread HR
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover why fast-growing companies are making the switch for a sharper, more intelligent HR and Workforce
            experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Join the fun—start a free trial!"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <a
              href="#contact"
              className="px-6 py-3 rounded-2xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex justify-center">
          <div className="relative max-w-3xl w-full">
            <img
              src="/images/team-collaboration.jpg"
              alt="Happy team collaborating with Nino360"
              className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-center">
          <div className="relative max-w-2xl w-full">
            <img
              src="/images/ai-assistant.jpg"
              alt="AI Assistant helping with HR tasks"
              className="w-full h-auto rounded-2xl shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-2xl w-full">
            <img
              src="/images/payroll-automation.jpg"
              alt="Automated payroll processing with global compliance"
              className="w-full h-auto rounded-2xl shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-3">
              <img src="/images/nino360-color-flat.png" alt="Nino360 Logo" className="h-6 w-auto" />
              <span className="font-semibold text-gray-900">Nino360</span>
            </div>
            <p className="mt-3 text-gray-600">The AI‑Native Workforce OS for HR, Payroll, and Projects.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-gray-900 font-medium mb-2">Product</div>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="#modules" className="hover:text-gray-900">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-gray-900">
                    AI & Platform
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-gray-900">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-gray-900 font-medium mb-2">Company</div>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a href="#contact" className="hover:text-gray-900">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div id="contact" className="md:text-right">
            <div className="text-gray-900 font-medium mb-2">Get in Touch</div>
            <div className="text-gray-600">sales@nino360.com</div>
            <div className="text-gray-600">+1 (000) 000‑0000</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 pb-8">
          © {new Date().getFullYear()} Nino360 Inc. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
