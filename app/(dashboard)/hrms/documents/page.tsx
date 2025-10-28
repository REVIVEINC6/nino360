import { Suspense } from "react"
import { DocumentsManagementContent } from "@/components/hrms/documents/documents-management-content"

export default async function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentsManagementContent />
      </Suspense>
    </div>
  )
}
