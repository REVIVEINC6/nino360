"use client"

import React from 'react'

export default function JobFormRenderer({ schema, values = {}, onChange }: { schema: any; values?: any; onChange?: (v: any) => void }) {
  if (!schema || !schema.fields) return null

  function renderField(field: any) {
    const val = values[field.name] ?? ''
    const handle = (v: any) => {
      onChange?.({ ...values, [field.name]: v })
    }

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <input className="border p-2 w-full" value={val} onChange={(e) => handle(e.target.value)} />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <textarea className="border p-2 w-full" value={val} onChange={(e) => handle(e.target.value)} />
          </div>
        )

      case 'number':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <input type="number" className="border p-2 w-full" value={val} onChange={(e) => handle(Number(e.target.value))} />
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <select className="border p-2 w-full" value={val} onChange={(e) => handle(e.target.value)}>
              <option value="">Select...</option>
              {(field.options || []).map((o: any) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(val)} onChange={(e) => handle(Boolean(e.target.checked))} />
            <label className="text-sm">{field.label}</label>
          </div>
        )

      case 'date':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <input type="date" className="border p-2" value={val} onChange={(e) => handle(e.target.value)} />
          </div>
        )

      case 'json':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">{field.label}</label>
            <textarea className="border p-2 w-full" value={JSON.stringify(val, null, 2)} onChange={(e) => handle(JSON.parse(e.target.value || '{}'))} />
          </div>
        )

      default:
        return null
    }
  }

  return <form className="space-y-4">{schema.fields.map((f: any) => renderField(f))}</form>
}
