"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccessHeader } from "./access-header"
import { RolesPanel } from "./roles-panel"
import { PermMatrix } from "./perm-matrix"
import { FeatureFlagsGrid } from "./feature-flags-grid"
import { ScopesPanel } from "./scopes-panel"
import { Simulator } from "./simulator"
import { ErrorState } from "./error-state"
import { getContext } from "@/app/(app)/tenant/access/actions"

export function AccessContent() {
  const [context, setContext] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContext()
  }, [])

  async function loadContext() {
    try {
      setLoading(true)
      const result = await getContext()
      if (result.error) {
        setError(result.error)
      } else {
        setContext(result.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load access control data")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadContext} />
  }

  if (loading || !context) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AccessHeader context={context} />

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="scopes">Scopes</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <RolesPanel context={context} onUpdate={loadContext} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermMatrix context={context} onUpdate={loadContext} />
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          <FeatureFlagsGrid context={context} onUpdate={loadContext} />
        </TabsContent>

        <TabsContent value="scopes" className="mt-6">
          <ScopesPanel context={context} onUpdate={loadContext} />
        </TabsContent>

        <TabsContent value="simulator" className="mt-6">
          <Simulator context={context} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
