"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const submodules: Record<string, { title: string; href: string }[]> = {
  "/admin": [
    { title: "Dashboard", href: "/admin/dashboard" }, // System health, tenants, usage
    { title: "Users", href: "/admin/users" }, // Global users (support)
    { title: "Tenants", href: "/admin/tenants" }, // List, suspend, plan overrides
    { title: "Roles & Permissions", href: "/admin/roles" }, // Catalog, defaults
    { title: "Module Access", href: "/admin/modules" }, // Entitlements per plan
    { title: "Marketplace", href: "/admin/marketplace" }, // Add-ons, SKUs
    { title: "Billing & Invoicing", href: "/admin/billing" }, // Provider sync, disputes
    { title: "Integrations", href: "/admin/integrations" }, // Provider configs, secrets
    { title: "Notifications", href: "/admin/notifications" }, // Templates, rate limits
    { title: "Security", href: "/admin/security" }, // Global DLP presets, IP policies
    { title: "System Health", href: "/admin/system-health" }, // Jobs, queues, errors
    { title: "Knowledge Base", href: "/admin/kb" }, // Docs, playbooks
    { title: "Support Tickets", href: "/admin/tickets" }, // Triage
    { title: "Automation Rules", href: "/admin/automation" }, // Global rules
    { title: "Audit & AI Logs", href: "/admin/audit-ai" }, // Cross-tenant view
    { title: "Reports/Exports", href: "/admin/reports" }, // BI, exports
    { title: "Branding", href: "/admin/branding" }, // Themes
    { title: "Feature Flags", href: "/admin/feature-flags" }, // Gated rollout
    { title: "GenAI Config", href: "/admin/genai" }, // Model routing, guardrails
    { title: "API Gateway", href: "/admin/api-gateway" }, // Keys, usage, rate limits
  ],
  "/tenant": [
    { title: "Dashboard", href: "/tenant/dashboard" }, // KPIs, forecasts, activity, trust badges
    { title: "Directory", href: "/tenant/directory" }, // Tenant list & switch, invites
    { title: "Onboarding", href: "/tenant/onboarding" }, // Wizard (branding, policies, roles, modules, invites)
    { title: "Users", href: "/tenant/users" }, // Members, invites, roles, bulk import, per-user audit
    { title: "Analytics", href: "/tenant/analytics" }, // Usage, seats, adoption, copilot metrics, export
    { title: "Configuration", href: "/tenant/configuration" }, // Branding, locale, policies, integrations, feature flags
    { title: "Security", href: "/tenant/security" }, // MFA/session/IP, DLP, SSO, secrets scan, audit explorer
    { title: "Access", href: "/tenant/access" }, // Roles, RBAC matrix, FBAC flags, scopes, simulator
    { title: "Billing", href: "/tenant/billing" }, // Plan, checkout, portal, invoices, dunning
    { title: "Data", href: "/tenant/data" }, // Docs & RAG, imports/exports, datasets, retention/GDPR
    { title: "Integrations", href: "/tenant/integrations" }, // Connectors hub + AI setup
    { title: "Notifications", href: "/tenant/notifications" }, // Channel routing & rule hooks
  ],
  "/crm": [
    { title: "Dashboard", href: "/crm/dashboard" }, // KPIs, pipeline health, activity feed, AI summary
    { title: "Lead Management", href: "/crm/leads" }, // Capture, score, assign, convert
    { title: "Contact Management", href: "/crm/contacts" }, // 360° contact view, comms, timeline
    { title: "Customer Engagement", href: "/crm/engagement" }, // Sequences, templates, bulk sends
    { title: "Sales Pipeline", href: "/crm/pipeline" }, // Boards by stage; commit, forecast
    { title: "Documents & Proposals", href: "/crm/documents" }, // Quotes, proposals, e-signature stub
    { title: "Calendar & Tasks", href: "/crm/calendar" }, // Tasks, meetings, reminders, routing
    { title: "Analytics", href: "/crm/analytics" }, // Win/loss, stage velocity, attribution
    { title: "Reports & Forecasts", href: "/crm/reports" }, // Quota, forecast, cohort reports
    { title: "AI Assistant", href: "/crm/ai-assistant" }, // NL→actions, email drafting, summary
    { title: "Settings", href: "/crm/settings" }, // Stages, reasons, SLAs, dedupe rules
  ],
  "/talent": [
    { title: "Dashboard", href: "/talent/dashboard" }, // Reqs status, time-to-hire, funnel, AI flags
    { title: "Job Requisitions", href: "/talent/jobs" }, // Create, publish, intake notes
    { title: "Candidate Sourcing", href: "/talent/sourcing" }, // Imports, webhooks, campaigns
    { title: "Applicant Tracking", href: "/talent/applicants" }, // Kanban by stage, bulk ops
    { title: "Interview Management", href: "/talent/interviews" }, // Panel, slots, feedback
    { title: "Assessment Center", href: "/talent/assessments" }, // Tests, scores, proctoring stub
    { title: "Offer Management", href: "/talent/offers" }, // Templates, approvals, e-sign stub
    { title: "Onboarding", href: "/talent/onboarding" }, // Handoff to HRMS onboarding
    { title: "Candidate Engagement", href: "/talent/engagement" }, // Sequences, surveys, NPS
    { title: "Skill Matching", href: "/talent/skills" }, // Profile extraction, JD-fit scoring
    { title: "Analytics", href: "/talent/analytics" }, // Funnel, quality of hire, source ROI
    { title: "Marketplace", href: "/talent/marketplace" }, // Job boards/vendors (future)
    { title: "Automation", href: "/talent/automation" }, // Triggers, rules
    { title: "AI Capabilities", href: "/talent/ai" }, // Prompt library, redaction rules
  ],
  "/bench": [
    { title: "Dashboard", href: "/bench/dashboard" }, // Utilization %, bench days, allocation lead time, bench cost
    { title: "Bench Tracking", href: "/bench/tracking" }, // Roster, availability, bench age
    { title: "Resource Allocation", href: "/bench/allocation" }, // Match needs to people, shortlisting
    { title: "Forecasting", href: "/bench/forecasting" }, // Incoming/outgoing demand, roll-off predictions
    { title: "Analytics", href: "/bench/analytics" }, // Utilization trends, bench cost analysis, lead time metrics
  ],
  "/vms": [
    { title: "Dashboard", href: "/vms/dashboard" }, // KPIs, SLA adherence, submission-to-hire %, dispute rate
    { title: "Vendors", href: "/vms/vendors" }, // Vendor profiles, scorecards, tiering, contracts
    { title: "Job Distribution", href: "/vms/jobs" }, // Create jobs, distribute to vendors, track responses
    { title: "Candidate Submission", href: "/vms/submissions" }, // Receive submissions, duplicate detection, shortlist
    { title: "Timesheet Management", href: "/vms/timesheets" }, // Vendor timesheets, approvals, on-time tracking
    { title: "Vendor Invoicing", href: "/vms/invoicing" }, // Vendor invoices, payment processing, reconciliation
    { title: "Compliance Tracking", href: "/vms/compliance" }, // Compliance docs, expiries, alerts
    { title: "Analytics", href: "/vms/analytics" }, // Vendor performance, SLA metrics, cost analysis
  ],
  "/hrms": [
    { title: "Dashboard", href: "/hrms/dashboard" }, // Headcount, attrition, compliance SLAs, timesheet metrics
    { title: "Employee Management", href: "/hrms/employees" }, // Profiles, docs, lifecycle
    { title: "Assignments", href: "/hrms/assignments" }, // Client/project, dates, rates
    { title: "Attendance", href: "/hrms/attendance" }, // Check-ins, leave balances
    { title: "Timesheets", href: "/hrms/timesheets" }, // Weekly submissions, approvals
    { title: "Invoices (Client)", href: "/hrms/invoices" }, // Client billing (if HR-owned)
    { title: "Accounts Payable", href: "/hrms/accounts-payable" }, // Vendor/contractor payments
    { title: "US Immigration", href: "/hrms/immigration" }, // Statuses, expiries, alerts
    { title: "I-9 Compliance", href: "/hrms/i9-compliance" }, // Verification steps
    { title: "Documents", href: "/hrms/documents" }, // Contracts, policy acks
    { title: "Onboarding", href: "/hrms/onboarding" }, // New hire provisioning
    { title: "Offboarding", href: "/hrms/offboarding" }, // Exit checklist
    { title: "Help Desk", href: "/hrms/helpdesk" }, // HR cases; SLA
    { title: "Performance", href: "/hrms/performance" }, // Goals, reviews, 360
    { title: "Compensation", href: "/hrms/compensation" }, // Bands, cycles, adjustments
    { title: "Benefits", href: "/hrms/benefits" }, // Plans, enrollment, claims
    { title: "HR Analytics", href: "/hrms/analytics" }, // Headcount trends, attrition analysis
  ],
  "/finance": [
    { title: "Dashboard", href: "/finance/dashboard" }, // DSO, aging, cash position, margin by project/client
    { title: "Accounts Receivable", href: "/finance/accounts-receivable" }, // Client invoices, collections, aging buckets
    { title: "Accounts Payable", href: "/finance/accounts-payable" }, // Vendor bills, payment processing, approvals
    { title: "Pay-on-Pay", href: "/finance/pay-on-pay" }, // Client→vendor linkage, reconciliation
    { title: "Payroll", href: "/finance/payroll" }, // Batches, taxes, payroll import (stub)
    { title: "Budgeting", href: "/finance/budgeting" }, // Budget creation, tracking, variance analysis
    { title: "Forecasting", href: "/finance/forecasting" }, // Cashflow forecasting, revenue projections
    { title: "Expenses", href: "/finance/expenses" }, // Employee/vendor expenses, reimbursements
    { title: "Revenue", href: "/finance/revenue" }, // Revenue recognition rules (stub)
    { title: "Reports", href: "/finance/reports" }, // Financial reports, P&L, balance sheet
    { title: "Analytics", href: "/finance/analytics" }, // Budget vs actuals, margin analysis, trends
    { title: "General Ledger", href: "/finance/ledger" }, // GL entries, chart of accounts, journal entries
    { title: "Tax Management", href: "/finance/tax" }, // Tax calculations, compliance, filing
  ],
  "/projects": [
    { title: "Dashboard", href: "/projects/dashboard" }, // Project KPIs, burn vs budget, health overview
    { title: "Projects", href: "/projects" }, // All projects list, create, assign resources
    { title: "Health", href: "/projects/health" }, // Project health tracking, status indicators
    { title: "Risks & Issues", href: "/projects/risks" }, // Risk identification, issue tracking, mitigation
    { title: "Resources", href: "/projects/resources" }, // Resource allocation, bench integration
    { title: "Reports", href: "/projects/reports" }, // Weekly status, burn reports, milestone tracking
  ],
  "/reports": [
    { title: "Dashboard", href: "/reports/dashboard" },
    { title: "Explorer", href: "/reports/explorer" },
    { title: "AI Copilot", href: "/reports/copilot" },
  ],
  "/automation": [
    { title: "Rules", href: "/automation/rules" },
    { title: "Alerts", href: "/automation/alerts" },
    { title: "Webhooks", href: "/automation/webhooks" },
    { title: "Settings", href: "/automation/settings" },
  ],
  "/training": [
    { title: "Dashboard", href: "/training/dashboard" }, // Completion rate, time-to-proficiency, certification coverage
    { title: "Learning Management", href: "/training/learning" }, // Enrollments, track completion, personalized learning paths
    { title: "Course Catalog", href: "/training/catalog" }, // Browse courses, enroll (auto from role/skill gaps)
    { title: "Content Creation", href: "/training/content" }, // Author content, publish courses, AI quiz generator
    { title: "Certification", href: "/training/certification" }, // Certify roles, track certificates, sync to HRMS
    { title: "Analytics", href: "/training/analytics" }, // Completion trends, time-to-proficiency, skill gap analysis
    { title: "Settings", href: "/training/settings" }, // Author vs Learner roles, exam integrity, PII protection
  ],
  "/hotlist": [
    { title: "Dashboard", href: "/hotlist" }, // Response rate, time-to-submit, conversion to interview/offer
    { title: "Priority Candidates", href: "/hotlist/priority" }, // Select priority profiles, package (skills/availability/rates)
    { title: "Urgent Requirements", href: "/hotlist/requirements" }, // Open reqs needing quick fills
    { title: "Matches", href: "/hotlist/matches" }, // Track responses & interest from clients/vendors
    { title: "Analytics", href: "/hotlist/analytics" }, // Response rate, time-to-submit, conversion metrics
    { title: "Automation", href: "/hotlist/automation" }, // Campaign rules, auto-create one-pagers, message personalization
    { title: "Settings", href: "/hotlist/settings" }, // DLP on PII, export controls, distribution preferences
  ],
}

export function SubmoduleSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const currentModule = Object.keys(submodules).find((module) => pathname.startsWith(module))
  const currentSubmodules = currentModule ? submodules[currentModule] : []

  if (!currentModule || currentSubmodules.length === 0 || pathname === "/dashboard") {
    return null
  }

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-0 border-0" : "w-56",
      )}
    >
      {!collapsed && (
        <>
          {/* Module Title */}
          <div className="flex h-16 items-center border-b px-4">
            <h2 className="text-lg font-semibold capitalize">{currentModule.replace("/", "")}</h2>
          </div>

          {/* Sub-navigation */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
            {currentSubmodules.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span>{item.title}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </>
      )}

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  )
}
