import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Database, Users, FileText, Shield, Zap, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Migration Services | Nino360",
  description:
    "Seamlessly migrate from your current system to Nino360 with our expert migration services and zero downtime guarantee.",
}

export default function MigrationPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seamless Migration
            </span>
            <br />
            to Nino360
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-pretty">
            Switch from your current system with confidence. Our expert team ensures a smooth, secure migration with
            zero downtime.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Migration <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Talk to Migration Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Migration Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Successful Migrations", value: "500+" },
              { label: "Average Migration Time", value: "2 Weeks" },
              { label: "Data Accuracy", value: "99.9%" },
              { label: "Customer Satisfaction", value: "4.9/5" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-white/20 shadow-lg text-center"
              >
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Migration Process
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven 5-step process to ensure your data is migrated safely and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Discovery & Planning",
                description: "Analyze your current system and create a detailed migration plan",
                icon: FileText,
              },
              {
                step: "2",
                title: "Data Mapping",
                description: "Map your existing data structure to Nino360 schema",
                icon: Database,
              },
              {
                step: "3",
                title: "Test Migration",
                description: "Run test migrations to validate data integrity",
                icon: Shield,
              },
              {
                step: "4",
                title: "Full Migration",
                description: "Execute complete data migration with zero downtime",
                icon: Zap,
              },
              {
                step: "5",
                title: "Validation & Training",
                description: "Verify data accuracy and train your team",
                icon: Users,
              },
            ].map((process) => (
              <div
                key={process.step}
                className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                  {process.step}
                </div>
                <process.icon className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                <p className="text-sm text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Migrate */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Migrate
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We handle all aspects of your data migration with precision and care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Employee Data",
                items: [
                  "Personal information",
                  "Employment history",
                  "Compensation records",
                  "Performance reviews",
                  "Documents & files",
                ],
              },
              {
                title: "Candidate Data",
                items: [
                  "Applicant profiles",
                  "Resumes & CVs",
                  "Interview notes",
                  "Assessment results",
                  "Communication history",
                ],
              },
              {
                title: "Business Data",
                items: [
                  "Client accounts",
                  "Project records",
                  "Financial data",
                  "Custom fields",
                  "Integrations & workflows",
                ],
              },
            ].map((category) => (
              <div
                key={category.title}
                className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Guarantees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Guarantees
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stand behind our migration services with these commitments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Zero Data Loss",
                description: "We guarantee 100% data integrity throughout the migration process",
              },
              {
                icon: Clock,
                title: "Zero Downtime",
                description: "Your business operations continue uninterrupted during migration",
              },
              {
                icon: CheckCircle2,
                title: "Data Validation",
                description: "Comprehensive validation to ensure accuracy and completeness",
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Expert migration team available 24/7 throughout the process",
              },
            ].map((guarantee) => (
              <div
                key={guarantee.title}
                className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-white/20 shadow-lg text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <guarantee.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{guarantee.title}</h3>
                <p className="text-sm text-gray-600">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Systems */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Migrate From{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Any System
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We support migration from all major HRMS, ATS, and CRM platforms
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                "Workday",
                "SAP SuccessFactors",
                "Oracle HCM",
                "ADP",
                "BambooHR",
                "Greenhouse",
                "Lever",
                "iCIMS",
                "Salesforce",
                "HubSpot",
                "Zoho",
                "Custom Systems",
              ].map((system) => (
                <div
                  key={system}
                  className="p-4 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 border border-purple-100"
                >
                  <p className="font-medium text-gray-700">{system}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6">
              Don't see your system?{" "}
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">
                Contact us
              </Link>{" "}
              for custom migration support
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make the Switch?</h2>
            <p className="text-xl mb-8 text-white/90">Schedule a free migration consultation with our experts today</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Download Migration Guide
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
