"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Globe, ExternalLink, CheckCircle2, Loader2 } from "lucide-react"
import {
  listTargets,
  publishRequisition,
  unpublishRequisition,
  getPublishStatus,
} from "@/app/(dashboard)/talent/jobs/actions"
import { toast } from "sonner"

interface PublishingPanelProps {
  requisitionId: string
}

export function PublishingPanel({ requisitionId }: PublishingPanelProps) {
  const [targets, setTargets] = useState<any[]>([])
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])
  const [publishedTargets, setPublishedTargets] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    loadData()
  }, [requisitionId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [targetsData, statusData] = await Promise.all([listTargets(), getPublishStatus(requisitionId)])
      setTargets(targetsData)
      setPublishedTargets(statusData.published_targets || [])
      setSelectedTargets(statusData.published_targets || [])
    } catch (error) {
      console.error("[v0] Error loading publishing data:", error)
      toast.error("Failed to load publishing options")
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      setPublishing(true)
      await publishRequisition(requisitionId, selectedTargets)
      toast.success("Requisition published successfully")
      await loadData()
    } catch (error) {
      console.error("[v0] Error publishing:", error)
      toast.error("Failed to publish requisition")
    } finally {
      setPublishing(false)
    }
  }

  const handleUnpublish = async (targetKeys?: string[]) => {
    try {
      setPublishing(true)
      await unpublishRequisition(requisitionId, targetKeys)
      toast.success("Requisition unpublished")
      await loadData()
    } catch (error) {
      console.error("[v0] Error unpublishing:", error)
      toast.error("Failed to unpublish")
    } finally {
      setPublishing(false)
    }
  }

  const toggleTarget = (targetKey: string) => {
    setSelectedTargets((prev) =>
      prev.includes(targetKey) ? prev.filter((k) => k !== targetKey) : [...prev, targetKey],
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading publishing options...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Publishing & Distribution</h3>
        <p className="text-sm text-muted-foreground">Publish this job to multiple channels and track distribution</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          {targets.map((target) => {
            const isPublished = publishedTargets.includes(target.key)
            const isSelected = selectedTargets.includes(target.key)

            return (
              <div
                key={target.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={target.key}
                    checked={isSelected}
                    onCheckedChange={() => toggleTarget(target.key)}
                    disabled={!target.enabled}
                  />
                  <Label htmlFor={target.key} className="flex items-center gap-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{target.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{target.kind.replace("_", " ")}</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  {isPublished && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Published
                    </Badge>
                  )}
                  {!target.enabled && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not Configured
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePublish} disabled={publishing || selectedTargets.length === 0}>
            {publishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Publish to Selected
              </>
            )}
          </Button>

          {publishedTargets.length > 0 && (
            <Button variant="outline" onClick={() => handleUnpublish()} disabled={publishing}>
              Unpublish All
            </Button>
          )}
        </div>
      </div>

      {publishedTargets.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            This job is currently published to {publishedTargets.length} channel{publishedTargets.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </Card>
  )
}
