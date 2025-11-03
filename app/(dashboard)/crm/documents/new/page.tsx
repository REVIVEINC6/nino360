"use client"

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

export default function NewDocumentPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<'proposal'|'quote'|'msa'|'nda'|'sow'|'other'>('proposal')
  const [fileUrl, setFileUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [analyzeResult, setAnalyzeResult] = useState<any | null>(null)
  const [notarizeResult, setNotarizeResult] = useState<any | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)
    try {
      let finalFileUrl = fileUrl

      // If a local file was chosen, request a presigned URL from HRMS upload action
      if (file) {
        // Map CRM kinds to HRMS expected kinds
        function mapKindToHrms(k: string) {
          switch (k) {
            case 'proposal':
            case 'msa':
            case 'nda':
            case 'sow':
              return 'CONTRACT'
            case 'quote':
              return 'OFFER'
            case 'other':
            default:
              return 'OTHER'
          }
        }

        const hrmsKind = mapKindToHrms(kind as string)

        const uploadInit = await fetch('/api/hrms/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind: hrmsKind, name: file.name, tags: [] }),
        })

        const uploadData = await uploadInit.json()
        if (!uploadData || uploadData.error) {
          const msg = uploadData?.error || 'Presign failed'
          setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg))
          throw new Error(msg)
        }

        const { presignedUrl, storageKey } = uploadData

        // Upload the file to the presigned URL (simple PUT)
        const putRes = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
        })
        if (!putRes.ok) {
          const text = await putRes.text().catch(() => '')
          setErrorMessage(`Upload failed: ${putRes.status} ${text}`)
          throw new Error('Upload failed')
        }

        // Construct a file URL (this may vary by storage provider)
        finalFileUrl = `/storage/${storageKey}`
      }

      const res = await fetch('/api/crm/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, kind, file_url: finalFileUrl }),
      })

      if (!res.ok) throw new Error('Failed')
  const created = await res.json()
  setCreatedId(created?.id || created?.document?.id || created?.documentId || null)
      // Keep user on page and show quick actions
      // Optionally redirect after actions
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  async function handleAnalyze() {
    if (!createdId) return
    setAnalyzeResult(null)
    try {
      const res = await fetch('/api/crm/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: createdId }),
      })
      const data = await res.json()
      setAnalyzeResult(data)
    } catch (err) {
      setAnalyzeResult({ success: false, error: (err as any).message })
    }
  }

  async function handleNotarize() {
    if (!createdId) return
    setNotarizeResult(null)
    try {
      const res = await fetch('/api/hrms/documents/notarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: createdId }),
      })
      const data = await res.json()
      setNotarizeResult(data)
    } catch (err) {
      setNotarizeResult({ success: false, error: (err as any).message })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Document</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Kind</label>
          <Select value={kind} onValueChange={(v) => setKind(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select kind" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="quote">Quote</SelectItem>
              <SelectItem value="msa">MSA</SelectItem>
              <SelectItem value="nda">NDA</SelectItem>
              <SelectItem value="sow">SOW</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm">File URL</label>
          <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Or choose a local file below" />
        </div>
        <div>
          <label className="text-sm">Or Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2"
          />
          {progress !== null && <div className="text-sm text-muted-foreground">Upload: {progress}%</div>}
        </div>
        <div>
          <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Document'}</Button>
        </div>
      </form>
      {createdId && (
        <div className="mt-6 max-w-lg">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex gap-2 mb-2">
            <Button onClick={handleAnalyze}>Analyze Document</Button>
            <Button variant="outline" onClick={handleNotarize}>Notarize (Blockchain)</Button>
          </div>

          {analyzeResult && (
            <div className="p-3 bg-muted rounded">
              <pre className="text-xs">{JSON.stringify(analyzeResult, null, 2)}</pre>
            </div>
          )}

          {notarizeResult && (
            <div className="p-3 bg-muted rounded mt-2">
              <pre className="text-xs">{JSON.stringify(notarizeResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
