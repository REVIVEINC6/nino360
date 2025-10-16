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
import { getContext } from "@/app/(app)/tenant/security/actions"
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

    const result = await getContext()
    if (result.success) {
      setContext(result.data)
    } else {
      setError(result.error)
      toast.error(result.error)
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
