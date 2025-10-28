"use client"

import { useEffect, useState } from "react"
import { getDocumentsEnhanced } from "@/app/(dashboard)/crm/actions/documents"
import { DocumentsStats } from "./documents-stats"
import { DocumentsTable } from "./documents-table"
import { DocumentsAIPanel } from "./documents-ai-panel"

export function DocumentsContent() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    try {
      const data = await getDocumentsEnhanced()
      setDocuments(data)
    } catch (error) {
      console.error("[v0] Error loading documents:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading documents...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <DocumentsStats documents={documents} />
        <DocumentsTable documents={documents} onRefresh={loadDocuments} />
      </div>

      <div className="lg:col-span-1">
        <DocumentsAIPanel documents={documents} />
      </div>
    </div>
  )
}
