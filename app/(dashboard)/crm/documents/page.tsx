import { DocumentsCenter } from "@/components/crm/documents-center"

export default async function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents & Proposals</h1>
        <p className="text-muted-foreground">Quotes, proposals, and e-signature management</p>
      </div>

      <DocumentsCenter />
    </div>
  )
}
