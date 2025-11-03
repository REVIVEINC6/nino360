declare module "@/types/crm" {
  export type UUID = string

  export interface Account {
    id: UUID
    tenant_id: UUID
    name: string
    domain?: string
    industry?: string
    employees?: number
    owner_id?: UUID
    created_at?: string
  }

  export interface Contact {
    id?: UUID
    tenant_id?: UUID
    account_id?: UUID | null
    owner_id?: UUID | null
    created_by?: UUID
    first_name?: string
    last_name?: string
    title?: string
    email?: string
    phone?: string
    mobile?: string
    linkedin_url?: string
    twitter_url?: string
    website?: string
    address?: Record<string, any>
    tags?: string[]
    marketing_opt_in?: boolean
    do_not_call?: boolean
    do_not_email?: boolean
    last_engaged_at?: string
    health_score?: number
    enrichment?: Record<string, any>
    dedupe_key?: string
    notes?: string
    created_at?: string
    updated_at?: string
  }

  export interface Activity {
    id?: UUID
    tenant_id?: UUID
    entity_type?: string
    entity_id?: UUID
    type?: string
    ts?: string
    subject?: string
    data?: Record<string, any>
    owner_id?: UUID
  }

  export interface ContactList {
    id?: UUID
    tenant_id?: UUID
    name?: string
    kind?: "static" | "segment"
    definition?: Record<string, any>
    created_by?: UUID
    created_at?: string
  }
}
