import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Eye, FileCheck, Server, Key, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Security & Compliance | Nino360",
  description: "Enterprise-grade security and compliance for your HR data",
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Enterprise-Grade Security</span>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Your Data is{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Safe & Secure
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground">
              Nino360 is built with security at its core. We employ industry-leading practices to protect your sensitive
              HR data and ensure compliance with global standards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Security Team</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">Security Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Security Features</h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Comprehensive security measures to protect your data at every layer
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
              },
              {
                icon: Key,
                title: "Multi-Factor Authentication",
                description: "TOTP-based 2FA and biometric authentication support",
              },
              {
                icon: Eye,
                title: "Role-Based Access Control",
                description: "Granular permissions with row-level security policies",
              },
              {
                icon: Server,
                title: "Data Residency",
                description: "Choose where your data is stored with regional data centers",
              },
              {
                icon: AlertTriangle,
                title: "Threat Detection",
                description: "AI-powered anomaly detection and real-time security monitoring",
              },
              {
                icon: FileCheck,
                title: "Audit Logging",
                description: "Comprehensive audit trails with blockchain verification",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/20 p-6 backdrop-blur-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-pretty text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="border-y bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Compliance & Certifications</h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              We meet the highest standards for data protection and privacy
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "SOC 2 Type II",
                status: "Certified",
                description: "Annual security audits",
              },
              {
                name: "GDPR",
                status: "Compliant",
                description: "EU data protection",
              },
              {
                name: "HIPAA",
                status: "Compliant",
                description: "Healthcare data security",
              },
              {
                name: "ISO 27001",
                status: "Certified",
                description: "Information security",
              },
            ].map((cert, index) => (
              <div key={index} className="rounded-xl border bg-background/50 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-500">{cert.status}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Security Practices</h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Our commitment to maintaining the highest security standards
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border bg-gradient-to-br from-background to-muted/20 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-semibold">Infrastructure Security</h3>
              <ul className="space-y-3">
                {[
                  "Multi-region redundancy with automatic failover",
                  "DDoS protection and WAF (Web Application Firewall)",
                  "Regular penetration testing and vulnerability assessments",
                  "Automated security patching and updates",
                  "Network segmentation and isolation",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-background to-muted/20 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-semibold">Application Security</h3>
              <ul className="space-y-3">
                {[
                  "Secure development lifecycle (SDLC) practices",
                  "Code review and static analysis for every release",
                  "Input validation and output encoding",
                  "Protection against OWASP Top 10 vulnerabilities",
                  "Regular security training for development team",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="border-y bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Data Protection</h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Your data privacy is our top priority
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Data Encryption",
                items: [
                  "AES-256 encryption at rest",
                  "TLS 1.3 for data in transit",
                  "Encrypted database backups",
                  "Key rotation policies",
                ],
              },
              {
                title: "Access Controls",
                items: [
                  "Principle of least privilege",
                  "Multi-factor authentication",
                  "IP whitelisting options",
                  "Session management",
                ],
              },
              {
                title: "Data Retention",
                items: [
                  "Configurable retention policies",
                  "Secure data deletion",
                  "Right to be forgotten",
                  "Data portability",
                ],
              },
            ].map((section, index) => (
              <div key={index} className="rounded-xl border bg-background/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Questions About Security?</h2>
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Our security team is here to answer any questions about our security practices and compliance
            certifications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Security Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
