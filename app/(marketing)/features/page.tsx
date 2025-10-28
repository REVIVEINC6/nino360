import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  Brain,
  Lock,
  Clock,
  CheckCircle2,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Powerful Features for Modern Teams
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to manage your workforce, from recruitment to retirement. Built with AI, secured with
            blockchain, automated with RPA.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Complete HR Suite</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreModules.map((module) => (
              <div
                key={module.title}
                className="group relative bg-card/50 backdrop-blur-sm border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4">
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Intelligent Automation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI to automate workflows, gain insights, and make data-driven decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aiFeatures.map((feature) => (
              <div key={feature.title} className="bg-card/50 backdrop-blur-sm border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-4">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Built for Security & Compliance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security with blockchain verification and comprehensive audit trails.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your HR Operations?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of companies using Nino360 to streamline their workforce management.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const coreModules = [
  {
    title: "CRM",
    icon: Users,
    description: "Manage client relationships and sales pipeline",
    features: ["Lead tracking", "Opportunity management", "Client portal", "Document management"],
  },
  {
    title: "Talent/ATS",
    icon: Briefcase,
    description: "End-to-end recruitment and applicant tracking",
    features: ["Job postings", "Candidate pipeline", "Interview scheduling", "Offer management"],
  },
  {
    title: "HRMS",
    icon: Users,
    description: "Complete employee lifecycle management",
    features: ["Onboarding", "Time & attendance", "Leave management", "Performance reviews"],
  },
  {
    title: "Finance",
    icon: DollarSign,
    description: "Financial operations and billing",
    features: ["Invoicing", "Expense tracking", "Payroll", "Revenue recognition"],
  },
  {
    title: "VMS",
    icon: Briefcase,
    description: "Vendor and contractor management",
    features: ["Vendor onboarding", "Contract management", "Invoice processing", "Compliance tracking"],
  },
  {
    title: "Projects",
    icon: BarChart3,
    description: "Project planning and resource allocation",
    features: ["Project tracking", "Resource planning", "Time tracking", "Budget management"],
  },
]

const aiFeatures = [
  {
    title: "AI Copilot",
    icon: Sparkles,
    description:
      "Intelligent assistant that helps with daily tasks, provides insights, and automates routine work across all modules.",
  },
  {
    title: "Smart Matching",
    icon: Brain,
    description:
      "AI-powered candidate-to-job matching that analyzes skills, experience, and cultural fit for optimal placements.",
  },
  {
    title: "Predictive Analytics",
    icon: BarChart3,
    description:
      "Forecast attrition, identify high performers, and predict project outcomes with machine learning models.",
  },
  {
    title: "Automated Workflows",
    icon: Zap,
    description: "RPA-powered automation for repetitive tasks like data entry, document processing, and approvals.",
  },
]

const securityFeatures = [
  {
    title: "Blockchain Verification",
    icon: Lock,
    description: "Immutable audit trails with blockchain-backed verification for compliance and security.",
  },
  {
    title: "Role-Based Access",
    icon: Shield,
    description: "Granular permissions and role-based access control to protect sensitive data.",
  },
  {
    title: "SOC 2 Compliant",
    icon: CheckCircle2,
    description: "Enterprise-grade security standards with regular audits and certifications.",
  },
  {
    title: "Data Encryption",
    icon: Lock,
    description: "End-to-end encryption for data at rest and in transit with AES-256.",
  },
  {
    title: "Multi-Factor Auth",
    icon: Shield,
    description: "Enhanced security with 2FA, SSO, and biometric authentication options.",
  },
  {
    title: "Audit Logs",
    icon: Clock,
    description: "Comprehensive activity logging with tamper-proof records for compliance.",
  },
]
