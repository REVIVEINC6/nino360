import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, CreditCard, Settings } from "lucide-react"

interface TenantStatsProps {
  totalUsers?: number
  departments?: number
  billingStatus?: string
  storageUsed?: string
}

export function TenantStats({
  totalUsers = 0,
  departments = 0,
  billingStatus = "Active",
  storageUsed = "0 GB",
}: TenantStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Active users</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{departments}</div>
          <p className="text-xs text-muted-foreground">Organizational units</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Billing Status</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{billingStatus}</div>
          <p className="text-xs text-muted-foreground">Current status</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{storageUsed}</div>
          <p className="text-xs text-muted-foreground">Of allocated space</p>
        </CardContent>
      </Card>
    </div>
  )
}
