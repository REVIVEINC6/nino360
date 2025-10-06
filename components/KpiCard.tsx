import React from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url, { headers: { 'x-tenant-id': 'demo-tenant-1' } }).then(r=>r.json())

export default function KpiCard({ title, endpoint }: { title: string, endpoint: string }){
  const { data, error } = useSWR(endpoint, fetcher)
  if (!data) return (<div className="p-4 border rounded animate-pulse">Loading {title}...</div>)
  if (error) return (<div className="p-4 border rounded text-red-600">Error</div>)
  return (
    <div className="p-4 border rounded">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{JSON.stringify(data).slice(0,20)}</div>
    </div>
  )
}
