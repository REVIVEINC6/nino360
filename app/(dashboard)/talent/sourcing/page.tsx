import { SourcingCenter } from "@/components/talent/sourcing-center"

export default async function SourcingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Candidate Sourcing</h1>
        <p className="text-muted-foreground">Import candidates, manage webhooks, and run sourcing campaigns</p>
      </div>

      <SourcingCenter />
    </div>
  )
}
