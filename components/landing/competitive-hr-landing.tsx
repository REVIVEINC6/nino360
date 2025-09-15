"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import {
  ArrowRight,
  Users,
  BarChart3,
  Cpu,
  Sparkles,
  Building2,
  TrendingUp,
  Lock,
  Clock,
  DollarSign,
  Target,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  Star,
  PlayCircle,
} from "lucide-react"
import Link from "next/link"
import { DialogTitle } from "@/components/ui/dialog"

export function CompetitiveHRLanding() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Nino360</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#customers" className="text-muted-foreground hover:text-foreground transition-colors">
                Customers
              </Link>
              <Link href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Button onClick={() => setIsAuthModalOpen(true)} className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Workforce Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Your workforce drives your
              <span className="text-primary"> success</span>. We amplify their
              <span className="text-accent"> potential</span>!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto text-balance">
              Meet Nino360—the intelligent HR, Payroll, and Workforce Analytics platform that's powerful, intuitive, and
              designed for the future of work. No complexity, no limitations—just breakthrough results for your team!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
              >
                Get Your Demo—It's Revolutionary!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch 2-Min Overview
              </Button>
            </div>

            {/* Upcoming Webinar Banner */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-accent font-semibold">
                🚀 Mastering AI-Driven Performance Management for Remote Teams
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Register Now • Sept 28, 2 PM EST • Earn 1 SHRM & HRCI Credit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-8">
            15,000+ companies trust Nino360—because exceptional teams don't settle for ordinary software!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15K+</div>
              <div className="text-muted-foreground">Global Companies</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2M+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.99%</div>
              <div className="text-muted-foreground">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Global Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* One Platform Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              One Intelligent Platform to Manage People, Payroll, and Performance!
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Why juggle multiple tools when you can have everything integrated with AI-powered insights?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* HR Cloud */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">NINO360 HR CLOUD</CardTitle>
                <CardDescription className="text-lg mb-4">Hire, engage, and scale with intelligence</CardDescription>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    AI-powered recruitment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Smart performance insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Predictive analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Employee self-service portal
                  </li>
                </ul>
              </CardHeader>
            </Card>

            {/* Payroll Cloud */}
            <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">NINO360 PAYROLL CLOUD</CardTitle>
                <CardDescription className="text-lg mb-4">Payday perfection—automated and stress-free!</CardDescription>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Global payroll in 150+ countries
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Real-time compliance updates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Intelligent tax optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Instant expense processing
                  </li>
                </ul>
              </CardHeader>
            </Card>

            {/* Analytics Cloud */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">NINO360 ANALYTICS CLOUD</CardTitle>
                <CardDescription className="text-lg mb-4">Workforce intelligence that drives decisions</CardDescription>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Predictive workforce modeling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Real-time performance dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    AI-driven recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Custom reporting engine
                  </li>
                </ul>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Nino360 Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">WHY NINO360?</h2>
            <p className="text-xl text-muted-foreground">You ask - Why choose Nino360 over your current HR software?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-3">Intelligently Simple</CardTitle>
              <CardDescription>
                No 500-page manuals. If you can use a smartphone, you'll master Nino360 in minutes.
              </CardDescription>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="mb-3">Delightfully Powerful</CardTitle>
              <CardDescription>
                We believe HR should inspire, not exhaust. Every feature is designed to create joy and drive results.
              </CardDescription>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-3">Truly All-in-One</CardTitle>
              <CardDescription>
                HR, Payroll, Analytics, Performance—no more patchwork of disconnected tools. Everything unified.
              </CardDescription>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="mb-3">People-First Always</CardTitle>
              <CardDescription>
                Your workforce comes first, always. Nino360 helps you show them they're valued and empowered.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade features that scale with your ambitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">AI-Powered Insights</CardTitle>
              <CardDescription>
                Machine learning algorithms predict turnover, optimize hiring, and recommend career paths
              </CardDescription>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="mb-2">Global Compliance</CardTitle>
              <CardDescription>
                Automated compliance across 150+ countries with real-time regulatory updates
              </CardDescription>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">Enterprise Security</CardTitle>
              <CardDescription>
                SOC 2 Type II, GDPR compliant with advanced encryption and zero-trust architecture
              </CardDescription>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="mb-2">Real-Time Analytics</CardTitle>
              <CardDescription>Live dashboards with predictive modeling and customizable KPI tracking</CardDescription>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">Performance Intelligence</CardTitle>
              <CardDescription>
                Continuous feedback loops with AI-driven performance recommendations and goal tracking
              </CardDescription>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="mb-2">Advanced Integrations</CardTitle>
              <CardDescription>
                Seamless connectivity with 500+ business applications via our robust API ecosystem
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Nino360: Because your workforce deserves better than ordinary
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover why forward-thinking companies are switching to Nino360 for a smarter, more intelligent HR and
              Workforce Management experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <CardDescription className="mb-4">
                "Nino360 transformed our HR operations completely. The AI insights helped us reduce turnover by 40% and
                improve employee satisfaction scores dramatically."
              </CardDescription>
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-sm text-muted-foreground">VP of People, TechCorp</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <CardDescription className="mb-4">
                "The global payroll capabilities are unmatched. We process payroll for 15 countries seamlessly, with
                zero compliance issues since switching."
              </CardDescription>
              <div className="font-semibold">Marcus Rodriguez</div>
              <div className="text-sm text-muted-foreground">CFO, GlobalTech Solutions</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <CardDescription className="mb-4">
                "The predictive analytics gave us insights we never had before. We can now proactively address workforce
                challenges before they become problems."
              </CardDescription>
              <div className="font-semibold">Dr. Emily Watson</div>
              <div className="text-sm text-muted-foreground">CHRO, Innovation Labs</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Revolutionize Your Workforce Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join 15,000+ companies already using Nino360 to unlock their workforce potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
            >
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
              Schedule Personal Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Nino360</span>
              </div>
              <p className="text-muted-foreground">
                The intelligent workforce management platform that scales with your ambitions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>HR Cloud</li>
                <li>Payroll Cloud</li>
                <li>Analytics Cloud</li>
                <li>Mobile Apps</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground">© 2024 Nino360 Platform. All rights reserved.</div>
            <div className="flex space-x-4 text-muted-foreground mt-4 md:mt-0">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/security">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <DialogTitle className="text-center text-2xl font-bold">Welcome to Nino360</DialogTitle>
      </AuthModal>
    </div>
  )
}
