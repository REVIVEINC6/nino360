import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Users, Briefcase, DollarSign, UserCircle, Sparkles, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              NINO360
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#modules"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Modules
            </Link>
            <Link
              href="#security"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Enterprise HRMS Platform
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-pretty text-xl text-muted-foreground">
              Comprehensive talent management, HRMS, CRM, VMS, and finance solutions with advanced AI, blockchain
              security, and RPA automation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card rounded-lg border p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
              <p className="text-pretty text-muted-foreground">
                Leverage generative AI and machine learning for intelligent decision-making and predictive analytics.
              </p>
            </div>
            <div className="glass-card rounded-lg border p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Blockchain Security</h3>
              <p className="text-pretty text-muted-foreground">
                Immutable audit trails and cryptographic verification ensure data integrity and compliance.
              </p>
            </div>
            <div className="glass-card rounded-lg border p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">RPA Automation</h3>
              <p className="text-pretty text-muted-foreground">
                Automate repetitive tasks and workflows to increase efficiency and reduce manual errors.
              </p>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Modules</h2>
            <p className="text-pretty text-xl text-muted-foreground">Everything you need to manage your enterprise</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/talent/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Talent Management</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Recruitment, applicant tracking, skills matrix, and talent sourcing
                </p>
              </div>
            </Link>
            <Link href="/hrms/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <UserCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">HRMS Core</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Employee management, payroll, benefits, time tracking, and compliance
                </p>
              </div>
            </Link>
            <Link href="/crm/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold">CRM</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Customer relationship management, leads, opportunities, and accounts
                </p>
              </div>
            </Link>
            <Link href="/vms/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold">VMS</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Vendor management, contracts, compliance, and performance tracking
                </p>
              </div>
            </Link>
            <Link href="/finance/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold">Finance</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Billing, invoicing, pay-on-pay settlements, and financial reporting
                </p>
              </div>
            </Link>
            <Link href="/tenant/dashboard" className="group">
              <div className="glass-card rounded-lg border p-6 space-y-3 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Building2 className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold">Tenant Management</h3>
                <p className="text-pretty text-sm text-muted-foreground">
                  Multi-tenant administration, settings, and organization management
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="glass-card rounded-2xl border p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your enterprise?</h2>
            <p className="text-pretty text-xl text-muted-foreground mb-8">
              Join leading organizations using Nino360 for their HR and business operations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                NINO360
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/security" className="hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Nino360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
