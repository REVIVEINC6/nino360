export type RawLead = Partial<{
  first_name: string
  last_name: string
  name: string
  email: string
  work_email: string
  phone: string
  company: string
  organization: string
  title: string
  role: string
  source: string
  notes: string
}>

export function normalizeLeadRecord(input: RawLead, opts?: { defaultSource?: string }) {
  const first = input.first_name || (input.name ? input.name.split(" ")[0] : "")
  const last = input.last_name || (input.name ? input.name.split(" ").slice(1).join(" ") : "")
  const email = (input.email || input.work_email || "").trim()
  const phone = (input.phone || "").trim()
  const company = (input.company || input.organization || "").trim()
  const title = (input.title || input.role || "").trim()
  const source = (input.source || opts?.defaultSource || "import").trim()
  const notes = (input.notes || "").trim()

  return {
    first_name: first,
    last_name: last,
    email,
    phone,
    company,
    title,
    source,
    status: "new" as const,
    notes,
  }
}
