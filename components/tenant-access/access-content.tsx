"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccessHeader } from "./access-header"
import { RolesPanel } from "./roles-panel"
import { PermMatrix } from "./perm-matrix"
import { FeatureFlagsGrid } from "./feature-flags-grid"
import { getContext } from "@/app/(app)/tenant/access/actions"

function ErrorState(props: { message: string; onRetry?: () => void }) {
  const { message, onRetry } = props
  return (
    <div className="rounded-md border border-dashed border-neutral-200 p-6 text-sm text-neutral-600">
      <p className="text-sm text-red-600">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}

export function Simulator(props: any) {
  const { context } = props
  // Minimal local placeholder for the missing Simulator module.
  // Replace this with the full implementation or restore the original module.
  return (
    <div className="rounded-md border border-dashed border-neutral-200 p-6 text-sm text-neutral-600">
      Simulator panel is not available.
    </div>
  )
}

export function ScopesPanel(props: any) {
  const { context } = props
  // Minimal local placeholder for the missing ScopesPanel module.
  // Replace this with the full implementation or restore the original module.
  return (
    <div className="rounded-md border border-dashed border-neutral-200 p-6 text-sm text-neutral-600">
      Scopes panel is not available.
    </div>
  )
}

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
