import { OfferManagement } from "@/components/talent/offer-management"

export default async function OffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offer Management</h1>
        <p className="text-muted-foreground">Templates, approvals, and e-signature workflow</p>
      </div>

      <OfferManagement />
    </div>
  )
}
