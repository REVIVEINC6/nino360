"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  UserCheck,
  FolderKanban,
  UserCog,
  Flame,
  GraduationCap,
  Settings,
  BarChart3,
  Zap,
  Brain,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const modules = [
  {
    name: "Admin",
    icon: Settings,
    description: "System administration, user management, security, and platform configuration",
    pages: 17,
    href: "/admin",
    color: "from-slate-500 to-slate-600",
  },
  {
    name: "CRM",
    icon: Users,
    description: "Customer relationship management with AI-powered insights and automation",
    pages: 15,
    href: "/crm",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Talent/ATS",
    icon: UserCheck,
    description: "Applicant tracking system with AI candidate matching and recruitment automation",
    pages: 16,
    href: "/talent",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "HRMS",
    icon: Building2,
    description: "Human resource management with employee lifecycle, performance, and compliance",
    pages: 16,
    href: "/hrms",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Finance",
    icon: DollarSign,
    description: "Financial management with AR/AP, payroll, expenses, and forecasting",
    pages: 14,
    href: "/finance",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "VMS",
    icon: Briefcase,
    description: "Vendor management system with compliance, rate cards, and invoicing",
    pages: 11,
    href: "/vms",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    description: "Project management with tasks, milestones, time tracking, and team collaboration",
    pages: 12,
    href: "/projects",
    color: "from-indigo-500 to-violet-500",
  },
  {
    name: "Bench",
    icon: UserCog,
    description: "Bench management with consultant tracking, allocation, and placement analytics",
    pages: 9,
    href: "/bench",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Hotlist",
    icon: Flame,
    description: "Priority candidate and requirement matching with automated campaigns",
    pages: 7,
    href: "/hotlist",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Training",
    icon: GraduationCap,
    description: "Learning management with courses, certifications, and skill development",
    pages: 7,
    href: "/training",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Tenant",
    icon: Building2,
    description: "Multi-tenant management with branding, configuration, and access control",
    pages: 14,
    href: "/tenant",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Settings",
    icon: Settings,
    description: "Personal settings, security, integrations, and preferences",
    pages: 8,
    href: "/settings",
    color: "from-gray-500 to-slate-500",
  },
  {
    name: "Reports",
    icon: BarChart3,
    description: "Advanced reporting with AI copilot, data explorer, and custom dashboards",
    pages: 3,
    href: "/reports",
    color: "from-pink-500 to-rose-500",
  },
]

const platformFeatures = [
  {
    icon: Brain,
    title: "AI Copilot",
    description: "Generative AI assistant across all modules with context-aware suggestions",
  },
  {
    icon: Zap,
    title: "RPA Automation",
    description: "Robotic process automation for repetitive tasks and workflows",
  },
  {
    icon: Sparkles,
    title: "Machine Learning",
    description: "Predictive analytics and intelligent insights powered by ML models",
  },
  {
    icon: Shield,
    title: "Blockchain Trust",
    description: "Immutable audit trails and verification for critical business data",
  },
]

export function PlatformOverviewContent() {
  const totalPages = modules.reduce((sum, module) => sum + module.pages, 0)

  return (
    <div className="space-y-8">
      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-purple-500">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">{modules.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pages</p>
              <p className="text-2xl font-bold">{totalPages}+</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-linear-to-br from-green-500 to-emerald-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Features</p>
              <p className="text-2xl font-bold">50+</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-linear-to-br from-orange-500 to-red-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security Level</p>
              <p className="text-2xl font-bold">Enterprise</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {platformFeatures.map((feature) => (
            <Card key={feature.title} className="glass-card-hover p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-lg bg-linear-to-br from-[#4F46E5] to-[#A855F7]">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.name} href={module.href}>
              <Card className="glass-card-hover p-6 h-full cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-linear-to-br ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">{module.pages} pages</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#8B5CF6] transition-colors">
                  {module.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                <div className="flex items-center text-sm text-[#8B5CF6] font-medium group-hover:gap-2 transition-all">
                  Explore module
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/crm/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              CRM Dashboard
            </Button>
          </Link>
          <Link href="/talent/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <UserCheck className="h-4 w-4" />
              Talent Dashboard
            </Button>
          </Link>
          <Link href="/reports/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/settings/account">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
