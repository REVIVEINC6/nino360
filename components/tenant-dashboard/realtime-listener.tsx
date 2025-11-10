"use client"
import { useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function RealtimeListener({ onModuleUpdate, onAuditInsert }: { onModuleUpdate?: (data: any) => void; onAuditInsert?: (entry: any) => void }) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const modCh = supabase
      .channel('rt-mod-usage')
      .on('postgres_changes', { event: '*', schema: 'app', table: 'module_usage' }, (payload: any) => {
        if (onModuleUpdate) onModuleUpdate(payload.new)
      })
      .subscribe()

    const auditCh = supabase
      .channel('rt-audit-tenant')
      .on('postgres_changes', { event: 'INSERT', schema: 'app', table: 'audit_log' }, (payload: any) => {
        if (onAuditInsert) onAuditInsert(payload.new)
      })
      .subscribe()

    return () => {
      try {
        supabase.removeChannel?.(modCh)
        supabase.removeChannel?.(auditCh)
      } catch (e) {}
    }
  }, [onModuleUpdate, onAuditInsert])

  return null
}
