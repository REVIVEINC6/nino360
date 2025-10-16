import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Building2, Users, DollarSign } from "lucide-react"

export default async function AccountsPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <p className="text-xs text-muted-foreground">75% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.2M</div>
            <p className="text-xs text-muted-foreground">+18% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accounts</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search accounts..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Account Name</th>
                  <th className="p-3 text-left text-sm font-medium">Industry</th>
                  <th className="p-3 text-left text-sm font-medium">Size</th>
                  <th className="p-3 text-left text-sm font-medium">Owner</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Acme Corporation",
                    industry: "Technology",
                    size: "Enterprise",
                    owner: "John Doe",
                    status: "customer",
                  },
                  {
                    name: "TechStart Inc",
                    industry: "Software",
                    size: "Mid-Market",
                    owner: "Jane Smith",
                    status: "prospect",
                  },
                  {
                    name: "GlobalTech Solutions",
                    industry: "Consulting",
                    size: "Enterprise",
                    owner: "Bob Johnson",
                    status: "customer",
                  },
                ].map((account, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 text-sm font-medium">{account.name}</td>
                    <td className="p-3 text-sm">{account.industry}</td>
                    <td className="p-3 text-sm">{account.size}</td>
                    <td className="p-3 text-sm">{account.owner}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          account.status === "customer" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
