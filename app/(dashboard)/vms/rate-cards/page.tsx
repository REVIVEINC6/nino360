import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

export default function VMSRateCardsPage() {
  const rateCards = [
    {
      id: 1,
      vendor: "TechVendor Inc.",
      role: "Senior Developer",
      location: "US-East",
      minBill: 100,
      maxBill: 150,
      currency: "USD",
    },
    {
      id: 2,
      vendor: "TechVendor Inc.",
      role: "Full Stack Engineer",
      location: "US-West",
      minBill: 110,
      maxBill: 160,
      currency: "USD",
    },
    {
      id: 3,
      vendor: "GlobalStaff LLC",
      role: "DevOps Engineer",
      location: "US-Central",
      minBill: 120,
      maxBill: 170,
      currency: "USD",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rate Cards</h1>
        <p className="text-muted-foreground">Manage vendor rate cards and pricing</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search rate cards..." className="pl-10" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Rate Card
        </Button>
      </div>

      <div className="grid gap-4">
        {rateCards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle className="text-lg">{card.vendor}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{card.role}</p>
                  <p className="text-sm text-muted-foreground">{card.location}</p>
                  <p className="text-sm">
                    Rate:{" "}
                    <span className="font-medium">
                      ${card.minBill} - ${card.maxBill}/{card.currency}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
