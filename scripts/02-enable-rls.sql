-- NINO360 Production Foundation — Row Level Security (RLS)
-- Enable RLS and create policies for multi-tenant isolation

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.bench_consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE sec.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AUTH HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION sec.current_user_id() 
RETURNS UUID
LANGUAGE SQL STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub','')::uuid;
$$;

CREATE OR REPLACE FUNCTION sec.current_tenant_id() 
RETURNS UUID
LANGUAGE SQL STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid;
$$;

-- ============================================
-- TENANT POLICIES
-- ============================================

-- Tenants: readable by members, writable by admins
CREATE POLICY tenants_select ON core.tenants
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.tenants.id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY tenants_update ON core.tenants
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = core.tenants.id
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- ============================================
-- USER POLICIES
-- ============================================

-- Users: can read self + co-members within same tenant
CREATE POLICY users_select ON core.users
FOR SELECT USING (
  sec.current_user_id() = core.users.id OR
  EXISTS (
    SELECT 1 FROM core.user_tenants ut1
    JOIN core.user_tenants ut2 ON ut2.tenant_id = ut1.tenant_id 
      AND ut2.user_id = core.users.id
    WHERE ut1.user_id = sec.current_user_id()
  )
);

-- user_tenants: restrict to own memberships
CREATE POLICY ut_select ON core.user_tenants
FOR SELECT USING (
  user_id = sec.current_user_id() OR EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = core.user_tenants.tenant_id
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- user_roles: view within same tenant; write only by admins
CREATE POLICY ur_select ON core.user_roles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.user_roles.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY ur_write ON core.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r2 ON r2.id = ur.role_id
    WHERE ur.tenant_id = core.user_roles.tenant_id
      AND ur.user_id = sec.current_user_id()
      AND r2.key IN ('master_admin','super_admin','admin')
  )
);

-- ============================================
-- MODULE POLICIES (Tenant-scoped)
-- ============================================

-- Clients
CREATE POLICY clients_select ON core.clients
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.clients.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY clients_write ON core.clients
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.clients.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Client Contacts
CREATE POLICY client_contacts_select ON core.client_contacts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.client_contacts.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY client_contacts_write ON core.client_contacts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.client_contacts.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Candidates
CREATE POLICY candidates_select ON core.candidates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.candidates.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY candidates_write ON core.candidates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.candidates.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Job Requisitions
CREATE POLICY jobs_select ON core.job_requisitions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.job_requisitions.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY jobs_write ON core.job_requisitions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.job_requisitions.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Job Applications
CREATE POLICY applications_select ON core.job_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.job_applications.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY applications_write ON core.job_applications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.job_applications.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Interviews
CREATE POLICY interviews_select ON core.interviews
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.interviews.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY interviews_write ON core.interviews
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.interviews.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Bench Consultants
CREATE POLICY bench_select ON core.bench_consultants
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.bench_consultants.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY bench_write ON core.bench_consultants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.bench_consultants.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Vendors
CREATE POLICY vendors_select ON core.vendors
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.vendors.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY vendors_write ON core.vendors
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.vendors.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Vendor Contracts
CREATE POLICY contracts_select ON core.vendor_contracts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.vendor_contracts.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY contracts_write ON core.vendor_contracts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.vendor_contracts.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Projects
CREATE POLICY projects_select ON core.projects
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.projects.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY projects_write ON core.projects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.projects.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Project Assignments
CREATE POLICY assignments_select ON core.project_assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.project_assignments.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY assignments_write ON core.project_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.project_assignments.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Invoices
CREATE POLICY invoices_select ON core.invoices
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.invoices.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY invoices_write ON core.invoices
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.invoices.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- Expenses
CREATE POLICY expenses_select ON core.expenses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.expenses.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY expenses_write ON core.expenses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = core.expenses.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

-- ============================================
-- AI INSIGHTS POLICIES
-- ============================================

CREATE POLICY ai_select ON ai.insights
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = ai.insights.tenant_id 
    AND ut.user_id = sec.current_user_id()
  )
);

CREATE POLICY ai_write ON ai.insights
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM core.user_tenants ut
    WHERE ut.tenant_id = ai.insights.tenant_id 
    AND ut.user_id = sec.current_user_id()
  ) AND EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = ai.insights.tenant_id
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin','manager')
  )
);

-- ============================================
-- AUDIT LOG POLICIES
-- ============================================

-- Audit logs: readable to admins, write via function only
CREATE POLICY audit_select ON sec.audit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM core.user_roles ur
    JOIN core.roles r ON r.id = ur.role_id
    WHERE ur.tenant_id = sec.audit_logs.tenant_id
      AND ur.user_id = sec.current_user_id()
      AND r.key IN ('master_admin','super_admin','admin')
  )
);

-- ============================================
-- AUDIT LOG FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION sec.log_action(
  _tenant UUID, 
  _user UUID, 
  _action TEXT, 
  _resource TEXT, 
  _payload JSONB
)
RETURNS VOID 
LANGUAGE SQL 
SECURITY DEFINER AS $$
  INSERT INTO sec.audit_logs(tenant_id, user_id, action, resource, payload)
  VALUES (_tenant, _user, _action, _resource, COALESCE(_payload, '{}'::JSONB));
$$;

-- Revoke direct access to audit_logs
REVOKE ALL ON TABLE sec.audit_logs FROM anon, authenticated;
GRANT SELECT ON TABLE sec.audit_logs TO authenticated;
