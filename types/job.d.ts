export interface JobPayDetails {
  billing_rate?: number
  pay_rate?: number
  currency?: string
  overtime_applicable?: boolean
  payment_terms?: string
  invoice_frequency?: 'weekly' | 'bi-weekly' | 'monthly' | string
}

export interface RecruitmentTeam {
  recruiters?: string[] // user ids
  account_manager?: string
  sourcer?: string
  recruitment_manager?: string
  additional_recruiters?: string[]
  interview_panel?: string[]
}

export interface Job {
  id: string
  tenant_id: string
  org_id?: string
  job_id?: string
  title: string
  status: 'open' | 'closed' | 'on_hold' | string
  customer_id?: string
  client_vendor_info?: Record<string, any>
  city?: string
  state?: string
  country?: string
  work_experience_years?: number
  remote_status?: 'onsite' | 'hybrid' | 'remote' | string
  languages_required?: string[]
  industry_id?: string
  project_name?: string
  client_job_id?: string
  customer_type?: 'direct' | 'vendor' | 'partner' | string
  primary_skills?: string[]
  secondary_skills?: string[]
  no_of_positions?: number
  target_date?: string
  created_date?: string
  qualifications?: string
  priority?: 'high' | 'medium' | 'low' | string
  project_id?: string

  pay_details?: JobPayDetails
  recruitment_team?: RecruitmentTeam

  custom_form?: Record<string, any>

  archived?: boolean
  deleted_at?: string

  created_by?: string
  updated_by?: string
  created_at?: string
  updated_at?: string
}

export type JobFormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'reference'
  | 'json'

export interface JobFormField {
  name: string
  label: string
  type: JobFormFieldType
  required?: boolean
  options?: Array<{ label: string; value: string }>
  reference?: { table: string; labelField?: string; valueField?: string }
}

export interface JobFormSchema {
  fields: JobFormField[]
}
