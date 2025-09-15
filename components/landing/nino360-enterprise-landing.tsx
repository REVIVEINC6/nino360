"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Brain,
  Shield,
  Globe2,
  ArrowRight,
  TrendingUp,
  Lock,
  Award,
  CheckCircle,
  Play,
  Calendar,
  Download,
  Phone,
  Zap,
  Building2,
  UserCheck,
  Settings,
  Database,
  MessageSquare,
  Target,
  ClipboardCheck,
  Users,
  DollarSign,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Nino360 Enterprise SaaS Landing Page
 * Professional, trust-focused design for C-suite executives and enterprise decision makers
 * Emphasizes security, scalability, compliance, and ROI
 */

const enterpriseFeatures = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "SOC2 Type II, ISO 27001, GDPR compliant with end-to-end encryption",
    metrics: "99.9% uptime SLA",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "Global Scale",
    description: "Multi-region deployment with 150+ country payroll compliance",
    metrics: "50+ languages",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Native Platform",
    description: "Advanced ML models for predictive analytics and automation",
    metrics: "40% efficiency gain",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Proven ROI",
    description: "Average 300% ROI within 12 months of implementation",
    metrics: "6-month payback",
  },
]

const nineModules = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "CRM",
    route: "/crm",
    description:
      "Customer relationship management with lead tracking and analytics powered by generative AI for intelligent customer insights and automated relationship building.",
    category: "AI",
    features: [
      "AI-powered lead scoring and qualification",
      "Automated customer journey mapping",
      "Predictive sales analytics and forecasting",
      "Intelligent customer segmentation",
      "Generative email campaigns and follow-ups",
      "Real-time sentiment analysis from interactions",
    ],
    metrics: "85% increase in lead conversion rates",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Talent",
    route: "/talent",
    description:
      "Talent acquisition and management system with AI-driven candidate matching, automated screening, and predictive hiring success models.",
    category: "AI",
    features: [
      "Generative job description creation",
      "AI-powered candidate matching and ranking",
      "Automated interview scheduling and coordination",
      "Bias-free candidate evaluation algorithms",
      "Predictive performance and retention modeling",
      "Intelligent skills gap analysis and recommendations",
    ],
    metrics: "60% faster time-to-hire with 40% better retention",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Bench",
    route: "/bench",
    description:
      "Resource bench management with allocation tracking, utilization optimization, and AI-powered resource planning for maximum efficiency.",
    category: "RPA",
    features: [
      "Automated resource allocation workflows",
      "Real-time utilization tracking and reporting",
      "Intelligent bench optimization algorithms",
      "Automated project-resource matching",
      "Capacity planning with predictive analytics",
      "Skills inventory management and updates",
    ],
    metrics: "95% resource utilization with optimal allocation",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Hotlist Management",
    route: "/hotlist",
    description:
      "Priority candidate and requirement management with intelligent matching, automated outreach, and real-time market intelligence.",
    category: "AI",
    features: [
      "AI-powered priority candidate identification",
      "Automated requirement-candidate matching",
      "Intelligent market rate analysis",
      "Generative outreach message creation",
      "Real-time availability tracking",
      "Predictive candidate interest scoring",
    ],
    metrics: "90% hotlist fulfillment rate with faster placements",
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: "HRMS",
    route: "/hrms",
    description:
      "Human resource management with employee tracking, performance analytics, and AI-driven insights for workforce optimization.",
    category: "RPA",
    features: [
      "Automated employee lifecycle management",
      "AI-powered performance prediction and coaching",
      "Intelligent attendance and leave management",
      "Automated compliance tracking and reporting",
      "Generative performance review assistance",
      "Predictive employee satisfaction analysis",
    ],
    metrics: "80% reduction in HR administrative tasks",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Finance",
    route: "/finance",
    description:
      "Financial management and reporting dashboard with automated accounting, AI-powered forecasting, and blockchain-secured transactions.",
    category: "Blockchain",
    features: [
      "Automated invoice processing and payments",
      "AI-powered financial forecasting and budgeting",
      "Blockchain-secured transaction records",
      "Intelligent expense categorization and approval",
      "Real-time financial analytics and reporting",
      "Automated compliance and audit trail generation",
    ],
    metrics: "100% financial transparency with immutable records",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "VMS",
    route: "/vms",
    description:
      "Vendor management system with contract tracking, performance monitoring, and AI-powered vendor optimization for strategic partnerships.",
    category: "RPA",
    features: [
      "Automated vendor onboarding and qualification",
      "AI-powered vendor performance analytics",
      "Intelligent contract management and renewals",
      "Automated compliance monitoring and reporting",
      "Predictive vendor risk assessment",
      "Smart vendor recommendation engine",
    ],
    metrics: "75% improvement in vendor performance tracking",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Training",
    route: "/training",
    description:
      "Learning management with courses, progress tracking, and AI-personalized learning paths for continuous skill development.",
    category: "Blockchain",
    features: [
      "AI-personalized learning path generation",
      "Automated skill assessment and gap analysis",
      "Blockchain-verified certification tracking",
      "Intelligent content recommendation engine",
      "Real-time progress monitoring and analytics",
      "Automated compliance training management",
    ],
    metrics: "Immutable skill credentials with global verification",
  },
  {
    icon: <ClipboardCheck className="w-8 h-8" />,
    title: "Project Management",
    route: "/project-management",
    description:
      "Project tracking with task management, team collaboration, and AI-powered project success prediction and optimization.",
    category: "Blockchain",
    features: [
      "AI-powered project timeline optimization",
      "Automated task assignment and tracking",
      "Blockchain-secured project milestone records",
      "Intelligent resource allocation and planning",
      "Predictive project risk assessment",
      "Real-time collaboration and communication tools",
    ],
    metrics: "100% transparent project tracking with immutable milestones",
  },
]

const integrationPartners = [
  { name: "Salesforce", logo: "SF" },
  { name: "Microsoft", logo: "MS" },
  { name: "Google Workspace", logo: "GW" },
  { name: "Slack", logo: "SL" },
  { name: "Workday", logo: "WD" },
  { name: "SAP", logo: "SAP" },
  { name: "Oracle", logo: "OR" },
  { name: "ServiceNow", logo: "SN" },
]

const industrySolutions = [
  {
    industry: "Financial Services",
    icon: <Building2 className="w-8 h-8" />,
    description: "Regulatory compliance, risk management, and global workforce coordination",
    features: ["SOX compliance", "Risk assessment", "Global operations"],
  },
  {
    industry: "Technology",
    icon: <Zap className="w-8 h-8" />,
    description: "Rapid scaling, remote workforce management, and innovation-focused culture",
    features: ["Rapid scaling", "Remote-first", "Innovation metrics"],
  },
  {
    industry: "Manufacturing",
    icon: <Settings className="w-8 h-8" />,
    description: "Multi-site coordination, safety compliance, and operational efficiency",
    features: ["Safety tracking", "Multi-site ops", "Efficiency metrics"],
  },
  {
    industry: "Healthcare",
    icon: <UserCheck className="w-8 h-8" />,
    description: "Credential management, compliance tracking, and patient care optimization",
    features: ["Credential tracking", "HIPAA compliance", "Care optimization"],
  },
]

const stats = [
  { value: "50+", label: "Early Adopters" },
  { value: "100K+", label: "Employees Managed" },
  { value: "25+", label: "Countries Supported" },
  { value: "99.9%", label: "Uptime SLA" },
]

export function Nino360EnterpriseLanding() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const router = useRouter()

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/login")
      setIsLoading(false)
    }, 1000)
  }

  const nextModule = () => {
    setCurrentModuleIndex((prev) => (prev + 1) % nineModules.length)
  }

  const prevModule = () => {
    setCurrentModuleIndex((prev) => (prev - 1 + nineModules.length) % nineModules.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ENTERPRISE NAVBAR */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/nino360-logo.png" alt="Nino360" className="h-8 w-auto" />
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#platform" className="hover:text-accent transition-colors">
              Platform
            </a>
            <a href="#solutions" className="hover:text-accent transition-colors">
              Solutions
            </a>
            <a href="#security" className="hover:text-accent transition-colors">
              Security
            </a>
            <a href="#technology" className="hover:text-accent transition-colors">
              Technology
            </a>
            <a href="#resources" className="hover:text-accent transition-colors">
              Resources
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-accent"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button variant="ghost" className="text-primary-foreground hover:text-accent">
              <Phone className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {isLoading ? "Loading..." : "Request Demo"}
            </Button>
          </div>
        </div>
      </header>

      {/* ENTERPRISE HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/95 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground">
                  <Award className="w-4 h-4" />
                  Next-Gen HR Platform 2024
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Your people drive your success. We elevate their experience!
                <span className="text-accent block">with Nino360</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl mb-8 text-primary-foreground/90 leading-relaxed"
              >
                AI-driven HR and workforce management solutions powered by 9 intelligent modules combining Generative
                AI, RPA, and Blockchain technology. The future of workforce management starts here.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
                >
                  {isLoading ? "Loading..." : "Request Demo"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Overview
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-accent">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative">
              <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-primary-foreground/20 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-foreground mb-2">AI-Native Platform</h3>
                  <p className="text-primary-foreground/80">9 Intelligent Modules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
              9 Intelligent Modules Powered by Generative AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Our platform combines cutting-edge Generative AI, RPA automation, and Blockchain security across 9
              specialized modules to deliver unprecedented intelligence and automation in workforce management
            </p>
          </div>

          {/* Module Carousel */}
          <div className="relative mb-16">
            <Card className="border-border shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-xl flex-shrink-0 ${
                        nineModules[currentModuleIndex].category === "AI"
                          ? "bg-blue-100 text-blue-600"
                          : nineModules[currentModuleIndex].category === "RPA"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {nineModules[currentModuleIndex].icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{nineModules[currentModuleIndex].title}</CardTitle>
                        <div
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            nineModules[currentModuleIndex].category === "AI"
                              ? "bg-blue-100 text-blue-600"
                              : nineModules[currentModuleIndex].category === "RPA"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {nineModules[currentModuleIndex].category}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {nineModules[currentModuleIndex].route}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevModule}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {currentModuleIndex + 1} / {nineModules.length}
                    </span>
                    <Button variant="outline" size="sm" onClick={nextModule}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-6 leading-relaxed">
                  {nineModules[currentModuleIndex].description}
                </CardDescription>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {nineModules[currentModuleIndex].features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-accent">{nineModules[currentModuleIndex].metrics}</div>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Explore {nineModules[currentModuleIndex].title}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Overview Grid */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4 mb-8">
            {nineModules.map((module, index) => (
              <button
                key={index}
                onClick={() => setCurrentModuleIndex(index)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  currentModuleIndex === index
                    ? "border-accent bg-accent/10 shadow-md"
                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 ${
                    module.category === "AI"
                      ? "text-blue-600"
                      : module.category === "RPA"
                        ? "text-green-600"
                        : "text-purple-600"
                  }`}
                >
                  {module.icon}
                </div>
                <div className="text-xs font-medium text-center">{module.title}</div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
                <div className="text-sm text-muted-foreground font-medium">Generative AI Modules</div>
                <div className="text-xs text-muted-foreground mt-1">CRM • Talent • Hotlist Management</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <div className="text-sm text-muted-foreground font-medium">RPA Automation Modules</div>
                <div className="text-xs text-muted-foreground mt-1">Bench • HRMS • VMS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-sm text-muted-foreground font-medium">Blockchain Security Modules</div>
                <div className="text-xs text-muted-foreground mt-1">Finance • Training • Project Management</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">Built for Every Industry</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored solutions that understand the unique challenges of your industry
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {industrySolutions.map((solution, index) => (
              <Card key={index} className="border-border shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">{solution.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{solution.industry}</h3>
                    <p className="text-muted-foreground mb-4">{solution.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {solution.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs bg-background text-foreground rounded-full border">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">Seamless Integrations</h2>
            <p className="text-xl text-muted-foreground">Connect with your existing tools and workflows effortlessly</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-12">
            {integrationPartners.map((partner, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-foreground shadow-sm">
                  {partner.logo}
                </div>
                <span className="text-xs text-muted-foreground mt-2 text-center">{partner.name}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" className="border-border bg-transparent">
              <Database className="mr-2 w-4 h-4" />
              View All Integrations
            </Button>
          </div>
        </div>
      </section>

      {/* ENTERPRISE FEATURES */}
      <section id="platform" className="py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">Built for Enterprise Scale</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Security, compliance, and scalability that meets the demands of global organizations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="border-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent text-accent-foreground">{feature.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <div className="text-sm font-semibold text-accent">{feature.metrics}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY & COMPLIANCE */}
      <section id="security" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Enterprise-Grade Security & Compliance
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Built with security-first architecture to meet the most stringent enterprise requirements
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  "SOC2 Type II Certified",
                  "ISO 27001 Compliant",
                  "GDPR & CCPA Ready",
                  "End-to-End Encryption",
                  "Zero Trust Architecture",
                  "Blockchain Audit Trail",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 w-4 h-4" />
                Download Security Whitepaper
              </Button>
            </div>

            <div className="relative">
              <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-border flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise Security</h3>
                  <p className="text-muted-foreground">SOC2 Type II Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Elevate Your Workforce Management Today</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join the next generation of HR technology with Generative AI, RPA, and Blockchain innovation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Schedule Demo"}
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Phone className="mr-2 w-5 h-5" />
              Speak with Sales
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70">
            Free consultation • Custom pricing • 30-day implementation guarantee
          </p>
        </div>
      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="bg-secondary border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/nino360-logo.png" alt="Nino360" className="h-6 w-auto" />
              </div>
              <p className="text-muted-foreground mb-4">
                The AI-Native HR & Workforce Management Platform for Enterprise Organizations
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                SOC2 Type II Certified
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    HR Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Payroll & Benefits
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Talent Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Workforce Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Generative AI Models
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    RPA Automation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blockchain Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nino360 Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
