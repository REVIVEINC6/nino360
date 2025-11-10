import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

export async function getContext() {
  // Minimal context extraction
  const supabase = await createServerClient()
  const { data: user } = await supabase.auth.getUser()
  const tenantId = user?.user?.user_metadata?.tenant_id
  return { tenantId }
}

export const createPayrollPreview = z
  .object({
    periodStart: z.string().refine((s) => !!Date.parse(s)),
    periodEnd: z.string().refine((s) => !!Date.parse(s)),
    includeTypes: z.array(z.string()).optional(),
  })
  .transform((v) => v)

export async function computePreview(input: z.infer<typeof createPayrollPreview>) {
  // Stubbed compute: return an empty preview with summary totals
  return {
    id: 'preview-stub',
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    lines: [],
    summary: { gross: 0, taxes: 0, deductions: 0, net: 0 },
  }
}

export async function requestRunApproval(runId: string, approverIds: string[]) {
  const supabase = await createServerClient()
  // TODO: set payroll_runs.status = 'pending_approval' and record approvers
  await supabase.from('hrms.payroll_runs').update({ status: 'pending_approval' }).eq('id', runId)
  return { success: true }
}

export async function approveRun(runId: string, approverId: string) {
  const supabase = await createServerClient()
  // TODO: apply approval logic
  await supabase.from('hrms.payroll_runs').update({ status: 'approved', approved_by: approverId }).eq('id', runId)
  return { success: true }
}
