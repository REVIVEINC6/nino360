"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Eye } from "lucide-react"

interface RolesPermissionsStepProps {
  tenantId: string
  onComplete: () => void
}

export function RolesPermissionsStep({ tenantId, onComplete }: RolesPermissionsStepProps) {
  const defaultRoles = [
    {
      id: "admin",
      name: "Admin",
      icon: Shield,
      description: "Full access to all features and settings",
      permissions: ["All permissions"],
    },
    {
      id: "manager",
      name: "Manager",
      icon: Users,
      description: "Manage team members and projects",
      permissions: ["Manage users", "View reports", "Edit projects"],
    },
    {
      id: "recruiter",
      name: "Recruiter",
      icon: Users,
      description: "Manage candidates and job postings",
      permissions: ["Manage candidates", "Post jobs", "Schedule interviews"],
    },
    {
      id: "viewer",
      name: "Viewer",
      icon: Eye,
      description: "Read-only access to data",
      permissions: ["View data", "Export reports"],
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        Default roles have been created for your workspace. You can customize them later in settings.
      </p>

      {defaultRoles.map((role) => {
        const Icon = role.icon
        return (
          <Card key={role.id} className="backdrop-blur-xl bg-white/5 border-white/10 p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{role.name}</h3>
                <p className="text-white/60 text-sm mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}

      <button
        onClick={onComplete}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors mt-6"
      >
        Continue
      </button>
    </div>
  )
}
