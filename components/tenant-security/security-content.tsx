"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityHeader } from "./security-header"
import { PolicyPanel } from "./policy-panel"
import { DlpPanel } from "./dlp-panel"
import { SsoPanel } from "./sso-panel"
import { SecretsPanel } from "./secrets-panel"
import { AuditExplorer } from "./audit-explorer"
import { ErrorState } from "./error-state"
// Use server actions that exist under the dashboard tenant actions
// Use a server API route to aggregate tenant security context for the client
const SECURITY_CONTEXT_API = "/api/tenant/security"
import { toast } from "sonner"

export function SecurityContent() {
  const [context, setContext] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContext()
  }, [])

  async function loadContext() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(SECURITY_CONTEXT_API)
      const body = await res.json()

      if (!body.success) throw new Error(body.error || "Failed to load security context")

      setContext(body.data)
    } catch (err: any) {
      const message = err?.message || "Failed to load security settings"
      setError(message)
      toast.error(message)
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (error || !context) {
    return <ErrorState message={error || "Failed to load security settings"} onRetry={loadContext} />
  }

  const { features } = context

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SecurityHeader context={context} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="policies">Policies</TabsTrigger>
            {features.dlp && <TabsTrigger value="dlp">DLP & Redaction</TabsTrigger>}
            {features.sso && <TabsTrigger value="sso">SSO & Identity</TabsTrigger>}
            <TabsTrigger value="secrets">Secrets</TabsTrigger>
            {features.audit && <TabsTrigger value="audit">Audit Explorer</TabsTrigger>}
          </TabsList>

          <TabsContent value="policies">
            <PolicyPanel context={context} onUpdate={loadContext} />
          </TabsContent>

          {features.dlp && (
            <TabsContent value="dlp">
              <DlpPanel context={context} onUpdate={loadContext} />
            </TabsContent>
          )}

          {features.sso && (
            <TabsContent value="sso">
              <SsoPanel context={context} onUpdate={loadContext} />
            </TabsContent>
          )}

          <TabsContent value="secrets">
            <SecretsPanel context={context} onUpdate={loadContext} />
          </TabsContent>

          {features.audit && (
            <TabsContent value="audit">
              <AuditExplorer context={context} />
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  )
}
