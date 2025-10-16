import { Badge } from "@/components/ui/badge"
import { Shield, Crown, Users, Eye } from "lucide-react"

interface RoleBadgeProps {
  role: string
}

const roleConfig: Record<string, { label: string; icon: any; className: string }> = {
  tenant_admin: {
    label: "Admin",
    icon: Crown,
    className: "bg-gradient-to-r from-[#D0FF00] to-[#F81CE5] text-black",
  },
  manager: {
    label: "Manager",
    icon: Shield,
    className: "border-[#D0FF00] text-[#D0FF00]",
  },
  member: {
    label: "Member",
    icon: Users,
    className: "border-[#F81CE5] text-[#F81CE5]",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    className: "border-muted-foreground text-muted-foreground",
  },
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role] || roleConfig.viewer
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
