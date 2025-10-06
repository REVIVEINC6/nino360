import serverClient from './supabaseServer'

export async function getMetrics(tenantId: string, opts: { range?: '7d'|'30d'|'90d', k?: string } = {}) {
  // minimal implementation - gather counts and simple sums
  const today = new Date().toISOString().slice(0,10)
  const { data: m } = await serverClient.from('metrics_daily').select('*').eq('tenant_id', tenantId).order('dt', { ascending: false }).limit(30)
  return { metrics: m || [] }
}
