import React, { useEffect, useState } from 'react'

type KpiCardProps = {
  title: string
  endpoint: string
}

export default function KpiCard({ title, endpoint }: KpiCardProps) {
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    fetch(endpoint, { headers: { 'x-tenant-id': 'demo-tenant-1' }, signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Error')
      })
      .finally(() => setLoading(false))

    return () => ac.abort()
  }, [endpoint])

  if (loading) return <div className="p-4 border rounded animate-pulse">Loading {title}...</div>
  if (error) return <div className="p-4 border rounded text-red-600">Error: {error}</div>

  return (
    <div className="p-4 border rounded">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{typeof data === 'object' ? JSON.stringify(data).slice(0, 20) : String(data)}</div>
    </div>
  )
}
