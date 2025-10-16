"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPipeline, moveApplication } from "../../actions/pipelines"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PipelinePage() {
  const params = useParams()
  const jobId = params.jobId as string
  const [stages, setStages] = useState<any[]>([])
  const [apps, setApps] = useState<any[]>([])

  const load = async () => {
    try {
      const { stages, apps } = await getPipeline(jobId)
      setStages(stages)
      setApps(apps)
    } catch (error) {
      console.error("[v0] Error loading pipeline:", error)
    }
  }

  useEffect(() => {
    if (jobId) load()
  }, [jobId])

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("appId", appId)
  }

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const appId = e.dataTransfer.getData("appId")
    try {
      await moveApplication({ application_id: appId, to_stage: stageId })
      load()
    } catch (error) {
      console.error("[v0] Error moving application:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/talent/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Drag and drop candidates between stages</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageApps = apps.filter((app) => app.stage_id === stage.id)
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragOver={handleDragOver}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {stage.name}
                    <Badge variant="secondary">{stageApps.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className="p-3 border rounded-lg bg-card hover:bg-accent cursor-move"
                    >
                      <p className="font-medium text-sm">
                        {app.candidate?.first_name} {app.candidate?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{app.candidate?.current_title}</p>
                      {app.score && (
                        <Badge variant="outline" className="mt-2">
                          Score: {app.score}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No candidates</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
