"use client"

import type React from "react"
import { useState } from "react"
import { ModuleSidebar } from "./module-sidebar"
import { PageSidebar } from "./page-sidebar"
import { TopBar } from "./top-bar"
import { AiInsightsDrawer } from "../tenant/ai-insights-drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Download, Calculator, TrendingUp, DollarSign } from "lucide-react"

interface FinanceLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentPage?: string
}

export function FinanceLayoutWrapper({
  children,
  title = "Finance Management",
  subtitle = "Financial operations and analytics",
  currentPage = "overview",
}: FinanceLayoutWrapperProps) {
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)
  const [notifications] = useState(2)

  // Comprehensive Finance Pages
  const financePages = [
    {
      id: "finance-overview",
      title: "Finance Overview",
      href: "/finance",
      icon: DollarSign,
      description: "Main finance dashboard with key metrics",
      category: "Overview",
      isNew: false,
      notifications: 0,
      status: "active" as const,
    },
    {
      id: "revenue-management",
      title: "Revenue Management",
      href: "/finance/revenue",
      icon: TrendingUp,
      description: "Track and manage revenue streams",
      category: "Revenue",
      isNew: false,
      notifications: 3,
      status: "active" as const,
      children: [
        {
          id: "revenue-tracking",
          title: "Revenue Tracking",
          href: "/finance/revenue/tracking",
          icon: Calculator,
          description: "Monitor revenue performance",
          category: "Revenue",
        },
        {
          id: "revenue-forecasting",
          title: "Revenue Forecasting",
          href: "/finance/revenue/forecasting",
          icon: TrendingUp,
          description: "Predict future revenue trends",
          category: "Revenue",
        },
        {
          id: "client-billing",
          title: "Client Billing",
          href: "/finance/revenue/billing",
          icon: DollarSign,
          description: "Manage client billing and invoices",
          category: "Revenue",
        },
      ],
    },
    {
      id: "expense-management",
      title: "Expense Management",
      href: "/finance/expenses",
      icon: DollarSign,
      description: "Track and control business expenses",
      category: "Expenses",
      isNew: false,
      notifications: 1,
      status: "active" as const,
      children: [
        {
          id: "expense-tracking",
          title: "Expense Tracking",
          href: "/finance/expenses/tracking",
          icon: DollarSign,
          description: "Monitor all business expenses",
          category: "Expenses",
        },
        {
          id: "expense-approval",
          title: "Expense Approval",
          href: "/finance/expenses/approval",
          icon: DollarSign,
          description: "Approve and manage expense requests",
          category: "Expenses",
        },
        {
          id: "vendor-payments",
          title: "Vendor Payments",
          href: "/finance/expenses/vendors",
          icon: DollarSign,
          description: "Manage vendor payments and relationships",
          category: "Expenses",
        },
      ],
    },
    {
      id: "payroll-management",
      title: "Payroll Management",
      href: "/finance/payroll",
      icon: DollarSign,
      description: "Comprehensive payroll processing",
      category: "Payroll",
      isNew: false,
      notifications: 5,
      status: "active" as const,
      children: [
        {
          id: "employee-payroll",
          title: "Employee Payroll",
          href: "/finance/payroll/employees",
          icon: DollarSign,
          description: "Process W2 employee payroll",
          category: "Payroll",
        },
        {
          id: "contractor-payments",
          title: "Contractor Payments",
          href: "/finance/payroll/contractors",
          icon: DollarSign,
          description: "Manage 1099 contractor payments",
          category: "Payroll",
        },
        {
          id: "corp-to-corp",
          title: "Corp-to-Corp",
          href: "/finance/payroll/corp-to-corp",
          icon: DollarSign,
          description: "Handle corporate-to-corporate payments",
          category: "Payroll",
        },
      ],
    },
    {
      id: "accounts-receivable",
      title: "Accounts Receivable",
      href: "/finance/receivables",
      icon: DollarSign,
      description: "Manage outstanding client payments",
      category: "Accounting",
      isNew: false,
      notifications: 2,
      status: "active" as const,
    },
    {
      id: "accounts-payable",
      title: "Accounts Payable",
      href: "/finance/payables",
      icon: DollarSign,
      description: "Track and manage vendor payments",
      category: "Accounting",
      isNew: false,
      notifications: 0,
      status: "active" as const,
    },
    {
      id: "cash-flow",
      title: "Cash Flow Management",
      href: "/finance/cash-flow",
      icon: DollarSign,
      description: "Monitor and forecast cash flow",
      category: "Analytics",
      isNew: false,
      notifications: 0,
      status: "active" as const,
    },
    {
      id: "financial-reports",
      title: "Financial Reports",
      href: "/finance/reports",
      icon: DollarSign,
      description: "Generate comprehensive financial reports",
      category: "Analytics",
      isNew: false,
      notifications: 0,
      status: "active" as const,
      children: [
        {
          id: "profit-loss",
          title: "Profit & Loss",
          href: "/finance/reports/profit-loss",
          icon: DollarSign,
          description: "P&L statements and analysis",
          category: "Analytics",
        },
        {
          id: "balance-sheet",
          title: "Balance Sheet",
          href: "/finance/reports/balance-sheet",
          icon: DollarSign,
          description: "Balance sheet reports",
          category: "Analytics",
        },
        {
          id: "cash-flow-reports",
          title: "Cash Flow Reports",
          href: "/finance/reports/cash-flow",
          icon: DollarSign,
          description: "Detailed cash flow analysis",
          category: "Analytics",
        },
      ],
    },
    {
      id: "budgeting",
      title: "Budgeting & Planning",
      href: "/finance/budgeting",
      icon: DollarSign,
      description: "Create and manage budgets",
      category: "Planning",
      isNew: true,
      notifications: 0,
      status: "active" as const,
    },
    {
      id: "tax-management",
      title: "Tax Management",
      href: "/finance/tax",
      icon: DollarSign,
      description: "Handle tax compliance and reporting",
      category: "Compliance",
      isNew: false,
      notifications: 1,
      status: "active" as const,
    },
    {
      id: "financial-analytics",
      title: "Financial Analytics",
      href: "/finance/analytics",
      icon: DollarSign,
      description: "Advanced financial analytics and insights",
      category: "Analytics",
      isNew: false,
      notifications: 0,
      status: "active" as const,
    },
    {
      id: "finance-settings",
      title: "Finance Settings",
      href: "/finance/settings",
      icon: DollarSign,
      description: "Configure finance module settings",
      category: "Configuration",
      isNew: false,
      notifications: 0,
      status: "active" as const,
    },
  ]

  const pageTools = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Calculator className="h-4 w-4 mr-2" />
        Calculate
      </Button>
      <Button variant="outline" size="sm">
        <TrendingUp className="h-4 w-4 mr-2" />
        Forecast
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export Report
      </Button>
      <Button size="sm">
        <DollarSign className="h-4 w-4 mr-2" />
        New Transaction
      </Button>
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        {notifications > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">{notifications}</Badge>}
      </Button>
      <Button variant="ghost" size="sm">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Module Sidebar */}
      <div className="w-64 border-r bg-white/80 backdrop-blur-sm">
        <ModuleSidebar currentModule="finance" />
      </div>

      {/* Page Sidebar */}
      <div className="w-64 border-r bg-white/60 backdrop-blur-sm">
        <PageSidebar
          pages={financePages}
          currentPage={currentPage}
          currentModule="finance"
          moduleTitle="Finance Management"
          moduleIcon="dollar-sign"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
          <TopBar />
        </div>

        {/* Page Header */}
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Forecast
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">{notifications}</Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-6">{children}</div>
        </main>
      </div>

      {/* AI Insights Drawer */}
      <AiInsightsDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        module="finance"
        context={{
          currentPage,
          title,
          data: {
            totalRevenue: 2450000,
            monthlyGrowth: 12.5,
            profitMargin: 23.8,
          },
        }}
      />
    </div>
  )
}
