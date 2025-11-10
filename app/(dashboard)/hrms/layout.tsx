import type React from "react"
import {
  Building2,
  Users,
  Calendar,
  Clock,
  FileText,
  Plane,
  Shield,
  Ticket,
  TrendingUp,
  DollarSign,
  Award,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function HRMSLayout({ children }: { children: React.ReactNode }) {
  const tabs = [
    { name: "Dashboard", href: "/hrms/dashboard", icon: Building2 },
    { name: "Employees", href: "/hrms/employees", icon: Users },
    { name: "Assignments", href: "/hrms/assignments", icon: Calendar },
    { name: "Attendance", href: "/hrms/attendance", icon: Clock },
    { name: "Timesheets", href: "/hrms/timesheets", icon: FileText },
    { name: "Immigration", href: "/hrms/immigration", icon: Plane },
    { name: "I-9 Compliance", href: "/hrms/i9-compliance", icon: Shield },
    { name: "Documents", href: "/hrms/documents", icon: FileText },
    { name: "Help Desk", href: "/hrms/helpdesk", icon: Ticket },
    { name: "Performance", href: "/hrms/performance", icon: TrendingUp },
    { name: "Compensation", href: "/hrms/compensation", icon: DollarSign },
    { name: "Benefits", href: "/hrms/benefits", icon: Award },
    { name: "Settings", href: "/hrms/settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent hover:border-primary whitespace-nowrap"
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
