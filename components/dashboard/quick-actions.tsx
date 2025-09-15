"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Users,
  Building2,
  FileText,
  Settings,
  Briefcase,
  UserPlus,
  Calendar,
  BarChart3,
  Shield,
  Download,
  Upload,
} from "lucide-react"

interface QuickActionsProps {
  userRole?: string
  tenantId?: string
  onActionClick: (action: string) => void
}

export function QuickActions({ userRole, tenantId, onActionClick }: QuickActionsProps) {
  const getActionsForRole = (role?: string) => {
    const baseActions = [
      {
        id: "add-user",
        title: "Add User",
        description: "Create a new user account",
        icon: <UserPlus className="h-6 w-6" />,
        color: "bg-blue-100 text-blue-600",
        href: "/admin/users/new",
        requiredRole: ["admin", "super_admin", "master_admin"],
      },
      {
        id: "new-tenant",
        title: "New Tenant",
        description: "Set up a new tenant",
        icon: <Building2 className="h-6 w-6" />,
        color: "bg-green-100 text-green-600",
        href: "/admin/tenants/new",
        requiredRole: ["super_admin", "master_admin"],
      },
      {
        id: "generate-report",
        title: "Generate Report",
        description: "Create analytics report",
        icon: <FileText className="h-6 w-6" />,
        color: "bg-purple-100 text-purple-600",
        href: "/reports/generate",
        requiredRole: ["admin", "super_admin", "master_admin", "hr_manager", "recruitment_manager"],
      },
      {
        id: "system-settings",
        title: "System Settings",
        description: "Configure system preferences",
        icon: <Settings className="h-6 w-6" />,
        color: "bg-orange-100 text-orange-600",
        href: "/admin/system",
        requiredRole: ["admin", "super_admin", "master_admin"],
      },
      {
        id: "schedule-meeting",
        title: "Schedule Meeting",
        description: "Book a new meeting",
        icon: <Calendar className="h-6 w-6" />,
        color: "bg-indigo-100 text-indigo-600",
        href: "/calendar/new",
        requiredRole: ["recruiter", "hr_manager", "recruitment_manager", "admin", "super_admin", "master_admin"],
      },
      {
        id: "view-analytics",
        title: "View Analytics",
        description: "Access detailed analytics",
        icon: <BarChart3 className="h-6 w-6" />,
        color: "bg-pink-100 text-pink-600",
        href: "/analytics",
        requiredRole: ["admin", "super_admin", "master_admin", "hr_manager", "recruitment_manager"],
      },
      {
        id: "security-audit",
        title: "Security Audit",
        description: "Run security check",
        icon: <Shield className="h-6 w-6" />,
        color: "bg-red-100 text-red-600",
        href: "/admin/security/audit",
        requiredRole: ["admin", "super_admin", "master_admin"],
      },
      {
        id: "export-data",
        title: "Export Data",
        description: "Download system data",
        icon: <Download className="h-6 w-6" />,
        color: "bg-teal-100 text-teal-600",
        href: "/admin/export",
        requiredRole: ["admin", "super_admin", "master_admin"],
      },
      {
        id: "import-data",
        title: "Import Data",
        description: "Upload bulk data",
        icon: <Upload className="h-6 w-6" />,
        color: "bg-yellow-100 text-yellow-600",
        href: "/admin/import",
        requiredRole: ["admin", "super_admin", "master_admin"],
      },
      {
        id: "manage-jobs",
        title: "Manage Jobs",
        description: "Create and edit job postings",
        icon: <Briefcase className="h-6 w-6" />,
        color: "bg-cyan-100 text-cyan-600",
        href: "/talent/jobs",
        requiredRole: ["recruiter", "recruitment_manager", "hr_manager", "admin", "super_admin", "master_admin"],
      },
    ]

    return baseActions.filter((action) => !action.requiredRole || action.requiredRole.includes(role || ""))
  }

  const actions = getActionsForRole(userRole)

  const handleActionClick = (action: any) => {
    onActionClick(action.id)
    if (action.href) {
      window.location.href = action.href
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks and shortcuts based on your role
          {userRole && (
            <Badge variant="outline" className="ml-2">
              {userRole.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-muted/50 transition-all duration-200 group"
              onClick={() => handleActionClick(action)}
            >
              <div className={`p-2 rounded-full transition-all duration-200 group-hover:scale-110 ${action.color}`}>
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No actions available</p>
            <p className="text-sm">Contact your administrator for access to more features.</p>
          </div>
        )}

        {/* Role-specific tips */}
        {userRole && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">💡 Tips for your role:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              {userRole.includes("admin") && (
                <p>• Use keyboard shortcuts: Ctrl+K for command palette, Ctrl+Shift+N for new user</p>
              )}
              {userRole.includes("recruiter") && (
                <p>• Quickly access candidate pipeline from the CRM module for faster hiring</p>
              )}
              {userRole.includes("hr_manager") && (
                <p>• Check the HRMS dashboard for pending approvals and employee requests</p>
              )}
              <p>• All actions are logged for audit purposes and compliance</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
