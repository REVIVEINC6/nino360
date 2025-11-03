import React from 'react'

export const dynamic = 'force-dynamic'

type Props = { params: { runId: string } }

export default async function RunDetailPage({ params }: Props) {
  const { runId } = params

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Run {runId}</h1>
      <p className="text-sm text-muted-foreground">Preview and execute this run.</p>
    </div>
  )
}
