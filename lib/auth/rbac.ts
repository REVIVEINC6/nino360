// Role-Based Access Control (RBAC) system
export type UserRole =
  | "master_admin"
  | "super_admin"
  | "admin"
  | "recruitment_manager"
  | "hr_manager"
  | "business_development_manager"
  | "account_manager"
  | "recruiter"
  | "hr_specialist"
  | "employee"
  | "candidate"
  | "client"
  | "vendor"
  | "guest"

export const PERMISSIONS = {
  // System-level permissions
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  TENANT_ADMIN: "TENANT_ADMIN",

  // User management
  CREATE_USERS: "CREATE_USERS",
  EDIT_USERS: "EDIT_USERS",
  DELETE_USERS: "DELETE_USERS",
  VIEW_USERS: "VIEW_USERS",

  // Data access
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
  EXPORT_DATA: "EXPORT_DATA",

  // AI features
  VIEW_AI_INSIGHTS: "VIEW_AI_INSIGHTS",
  IMPLEMENT_AI_RECOMMENDATIONS: "IMPLEMENT_AI_RECOMMENDATIONS",

  // Billing
  MANAGE_BILLING: "MANAGE_BILLING",
  VIEW_BILLING: "VIEW_BILLING",

  // Module-specific permissions
  MANAGE_CRM: "MANAGE_CRM",
  VIEW_CRM: "VIEW_CRM",
  MANAGE_HRMS: "MANAGE_HRMS",
  VIEW_HRMS: "VIEW_HRMS",
  MANAGE_TALENT: "MANAGE_TALENT",
  VIEW_TALENT: "VIEW_TALENT",
  MANAGE_FINANCE: "MANAGE_FINANCE",
  VIEW_FINANCE: "VIEW_FINANCE",
} as const

export type Permission = keyof typeof PERMISSIONS

// Role hierarchy and permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  master_admin: [
    "SYSTEM_ADMIN",
    "TENANT_ADMIN",
    "CREATE_USERS",
    "EDIT_USERS",
    "DELETE_USERS",
    "VIEW_USERS",
    "VIEW_ANALYTICS",
    "EXPORT_DATA",
    "VIEW_AI_INSIGHTS",
    "IMPLEMENT_AI_RECOMMENDATIONS",
    "MANAGE_BILLING",
    "VIEW_BILLING",
    "MANAGE_CRM",
    "VIEW_CRM",
    "MANAGE_HRMS",
    "VIEW_HRMS",
    "MANAGE_TALENT",
    "VIEW_TALENT",
    "MANAGE_FINANCE",
    "VIEW_FINANCE",
  ],
  super_admin: [
    "SYSTEM_ADMIN",
    "TENANT_ADMIN",
    "CREATE_USERS",
    "EDIT_USERS",
    "DELETE_USERS",
    "VIEW_USERS",
    "VIEW_ANALYTICS",
    "EXPORT_DATA",
    "VIEW_AI_INSIGHTS",
    "IMPLEMENT_AI_RECOMMENDATIONS",
    "MANAGE_BILLING",
    "VIEW_BILLING",
    "MANAGE_CRM",
    "VIEW_CRM",
    "MANAGE_HRMS",
    "VIEW_HRMS",
    "MANAGE_TALENT",
    "VIEW_TALENT",
    "MANAGE_FINANCE",
    "VIEW_FINANCE",
  ],
  admin: [
    "TENANT_ADMIN",
    "CREATE_USERS",
    "EDIT_USERS",
    "VIEW_USERS",
    "VIEW_ANALYTICS",
    "EXPORT_DATA",
    "VIEW_AI_INSIGHTS",
    "IMPLEMENT_AI_RECOMMENDATIONS",
    "VIEW_BILLING",
    "MANAGE_CRM",
    "VIEW_CRM",
    "MANAGE_HRMS",
    "VIEW_HRMS",
    "MANAGE_TALENT",
    "VIEW_TALENT",
    "MANAGE_FINANCE",
    "VIEW_FINANCE",
  ],
  recruitment_manager: [
    "VIEW_USERS",
    "VIEW_ANALYTICS",
    "VIEW_AI_INSIGHTS",
    "MANAGE_TALENT",
    "VIEW_TALENT",
    "VIEW_CRM",
    "VIEW_HRMS",
  ],
  hr_manager: [
    "VIEW_USERS",
    "VIEW_ANALYTICS",
    "VIEW_AI_INSIGHTS",
    "MANAGE_HRMS",
    "VIEW_HRMS",
    "VIEW_TALENT",
    "VIEW_CRM",
  ],
  business_development_manager: ["VIEW_ANALYTICS", "MANAGE_CRM", "VIEW_CRM", "VIEW_TALENT", "VIEW_FINANCE"],
  account_manager: ["VIEW_CRM", "VIEW_TALENT", "VIEW_FINANCE"],
  recruiter: ["VIEW_TALENT", "VIEW_CRM"],
  hr_specialist: ["VIEW_HRMS", "VIEW_TALENT"],
  employee: ["VIEW_HRMS"],
  candidate: [],
  client: ["VIEW_CRM"],
  vendor: [],
  guest: [],
}

// Helper functions
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}

export function canAccessTenant(userRole: UserRole, userTenantId: string, targetTenantId: string): boolean {
  // Master and Super admins can access any tenant
  if (userRole === "master_admin" || userRole === "super_admin") {
    return true
  }

  // Other roles can only access their own tenant
  return userTenantId === targetTenantId
}

export function getRoleHierarchy(): Record<UserRole, number> {
  return {
    master_admin: 100,
    super_admin: 90,
    admin: 80,
    recruitment_manager: 70,
    hr_manager: 70,
    business_development_manager: 60,
    account_manager: 50,
    recruiter: 40,
    hr_specialist: 40,
    employee: 30,
    client: 20,
    candidate: 10,
    vendor: 10,
    guest: 0,
  }
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy[managerRole] > hierarchy[targetRole]
}

export function getAvailableRoles(userRole: UserRole): UserRole[] {
  const hierarchy = getRoleHierarchy()
  const userLevel = hierarchy[userRole]

  return Object.entries(hierarchy)
    .filter(([_, level]) => level < userLevel)
    .map(([role, _]) => role as UserRole)
}
