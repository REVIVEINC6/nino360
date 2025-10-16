import { TalentMarketplace } from "@/components/talent/talent-marketplace"

export default async function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Talent Marketplace</h1>
        <p className="text-muted-foreground">Job boards and vendor integrations</p>
      </div>

      <TalentMarketplace />
    </div>
  )
}
