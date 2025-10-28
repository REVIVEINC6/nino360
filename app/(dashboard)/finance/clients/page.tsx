import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

async function getClients() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("finance.clients").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching clients:", error)
    return []
  }

  return data || []
}

function ClientsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function ClientsList() {
  const clients = await getClients()

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">No clients found</p>
          <Button>
            <Plus className="mr-2 w-4 h-4" />
            Add Client
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {clients.map((client: any) => (
        <Card key={client.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {client.payment_terms} • {client.currency}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {client.status}
                </span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Clients</h2>
          <p className="text-muted-foreground text-sm">Manage your finance clients and billing information</p>
        </div>
        <Button>
          <Plus className="mr-2 w-4 h-4" />
          Add Client
        </Button>
      </div>

      <Suspense fallback={<ClientsSkeleton />}>
        {/* Render synchronously with pre-fetched data */}
        <div className="space-y-4">
          {clients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-muted-foreground">No clients found</p>
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Client
                </Button>
              </CardContent>
            </Card>
          ) : (
            clients.map((client: any) => (
              <Card key={client.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {client.payment_terms} • {client.currency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {client.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Suspense>
    </div>
  )
}
