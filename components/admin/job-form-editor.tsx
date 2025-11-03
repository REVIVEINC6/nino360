"use client"

import { useEffect, useState } from 'react'

export default function JobFormEditor() {
  const [schema, setSchema] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/job-form')
      .then((r) => r.json())
      .then((s) => setSchema(s))
      .catch(() => setSchema(null))
  }, [])

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/job-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || '' },
        body: JSON.stringify({ schema }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Save failed')
      setSaving(false)
    } catch (err: any) {
      setError(err?.message || String(err))
      setSaving(false)
    }
  }

  if (!schema) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Job Form Editor</h2>
      <textarea className="w-full h-96 p-2 border" value={JSON.stringify(schema, null, 2)} onChange={(e) => setSchema(JSON.parse(e.target.value))} />
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  )
}
