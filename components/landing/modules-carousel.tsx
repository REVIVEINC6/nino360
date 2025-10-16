"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Users, Briefcase, DollarSign, BarChart3, GraduationCap, FileText, Network, Zap, Target } from "lucide-react"

const modules = [
  {
    icon: Users,
    name: "CRM",
    description: "AI-powered customer relationship management",
    features: ["Lead scoring", "Auto-follow-ups", "Pipeline forecasting", "Sentiment analysis", "Deal intelligence"],
    stat: "85% lead conversion lift",
    color: "#4F46E5",
  },
  {
    icon: Target,
    name: "Talent (ATS)",
    description: "Intelligent applicant tracking system",
    features: ["Resume parsing", "Candidate matching", "Interview scheduling", "Skill extraction", "Culture fit AI"],
    stat: "60% faster hiring",
    color: "#8B5CF6",
  },
  {
    icon: Network,
    name: "Bench",
    description: "Consultant availability management",
    features: ["Real-time availability", "Skill matching", "Utilization tracking", "Bench marketing", "Auto-placement"],
    stat: "92% utilization rate",
    color: "#A855F7",
  },
  {
    icon: Zap,
    name: "Hotlist",
    description: "Rapid candidate deployment",
    features: ["Instant matching", "Quick submissions", "Priority alerts", "Fast-track approvals", "Speed metrics"],
    stat: "2hr avg response time",
    color: "#D0FF00",
  },
  {
    icon: Briefcase,
    name: "HRMS",
    description: "Complete human resource management",
    features: [
      "Payroll automation",
      "Benefits admin",
      "Performance reviews",
      "Compliance tracking",
      "Time & attendance",
    ],
    stat: "70% admin time saved",
    color: "#F81CE5",
  },
  {
    icon: DollarSign,
    name: "Finance",
    description: "Intelligent financial operations",
    features: ["Auto-invoicing", "Expense tracking", "Cash flow forecasting", "Revenue recognition", "Tax compliance"],
    stat: "9 days DSO reduction",
    color: "#4F46E5",
  },
  {
    icon: FileText,
    name: "VMS",
    description: "Vendor management system",
    features: [
      "Vendor onboarding",
      "Contract management",
      "Compliance checks",
      "Performance scoring",
      "Risk assessment",
    ],
    stat: "95% compliance rate",
    color: "#8B5CF6",
  },
  {
    icon: GraduationCap,
    name: "Training",
    description: "Learning management system",
    features: ["Course creation", "Progress tracking", "Skill assessments", "Certification mgmt", "AI recommendations"],
    stat: "3x skill development",
    color: "#A855F7",
  },
  {
    icon: BarChart3,
    name: "Project Management",
    description: "Intelligent project orchestration",
    features: ["Task automation", "Resource allocation", "Risk prediction", "Timeline optimization", "Budget tracking"],
    stat: "40% faster delivery",
    color: "#D0FF00",
  },
]

export function ModulesCarousel() {
  const [selectedModule, setSelectedModule] = useState(0)

  return (
    <section id="modules" className="relative py-32 bg-gradient-to-b from-black via-[#0a0015] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            9 Intelligent Modules Powered by{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Generative AI
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Comprehensive enterprise suite with AI at every layer
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setSelectedModule(index)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedModule === index
                  ? "bg-gradient-to-br from-white/10 to-white/5 border-2 scale-105"
                  : "bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-white/30"
              }`}
              style={{
                borderColor: selectedModule === index ? module.color : undefined,
                boxShadow: selectedModule === index ? `0 0 30px ${module.color}40` : undefined,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${module.color}30, ${module.color}10)`,
                  }}
                >
                  <module.icon className="h-6 w-6" style={{ color: module.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{module.name}</h3>
                  <p className="text-sm text-white/60">{module.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {module.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-white/70">
                    <div className="h-1 w-1 rounded-full" style={{ background: module.color }} />
                    {feature}
                  </div>
                ))}
              </div>

              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${module.color}20, ${module.color}10)`,
                  color: module.color,
                }}
              >
                {module.stat}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
