-- Migration: create jobs table for Nino360
-- id: 002_create_jobs_table.sql

CREATE TABLE IF NOT EXISTS app.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  org_id uuid,
  job_id text UNIQUE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  customer_id uuid,
  client_vendor_info jsonb,
  city text,
  state text,
  country text,
  work_experience_years integer,
  remote_status text,
  languages_required text[],
  industry_id uuid,
  project_name text,
  client_job_id text,
  customer_type text,
  primary_skills text[],
  secondary_skills text[],
  no_of_positions integer DEFAULT 1,
  target_date date,
  created_date timestamptz DEFAULT now(),
  qualifications text,
  priority text DEFAULT 'medium',
  project_id uuid,

  -- pay & billing
  billing_rate numeric(12,2),
  pay_rate numeric(12,2),
  currency text,
  overtime_applicable boolean DEFAULT false,
  payment_terms text,
  invoice_frequency text,

  -- recruitment team
  recruiters uuid[],
  account_manager uuid,
  sourcer uuid,
  recruitment_manager uuid,
  additional_recruiters uuid[],
  client_contact_name text,
  client_contact_email text,
  client_contact_phone text,
  interview_panel uuid[],
  maximum_submissions integer DEFAULT 0,
  share_to_partners boolean DEFAULT false,

  -- dynamic/custom form JSON (for per-tenant customization)
  custom_form jsonb DEFAULT '{}'::jsonb,

  -- soft delete / archive
  archived boolean DEFAULT false,
  deleted_at timestamptz,

  -- audit
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON app.jobs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON app.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON app.jobs USING gin (title gin_trgm_ops);

-- Example RLS policy placeholder (requires enabling row level security and policies per tenant)
-- ALTER TABLE app.jobs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY jobs_isolation ON app.jobs USING (tenant_id = current_setting('app.current_tenant')::uuid);
