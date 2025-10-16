-- Nino360 Step 7: Projects (Internal) Module
-- Complete project management with milestones, tasks, team allocations, budgets, and Finance integration

-- Create projects schema
CREATE SCHEMA IF NOT EXISTS proj;

-- PROJECTS table
CREATE TABLE IF NOT EXISTS proj.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  client_id UUID REFERENCES finance.clients(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  model TEXT NOT NULL DEFAULT 'T&M' CHECK (model IN ('T&M','Fixed','Retainer','Internal')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','on_hold','completed','canceled')),
  color TEXT DEFAULT '#2563eb',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON proj.projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON proj.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON proj.projects(client_id);

-- BUDGETS table (per project, in base currency)
CREATE TABLE IF NOT EXISTS proj.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'USD',
  labor_budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  expense_budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  fee_budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id)
);
CREATE INDEX IF NOT EXISTS idx_budgets_project ON proj.budgets(project_id);

-- MILESTONES table (for Fixed/Retainer or internal checkpoints)
CREATE TABLE IF NOT EXISTS proj.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  amount NUMERIC(14,2) DEFAULT 0, -- for Fixed model billing
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','in_progress','ready_for_bill','billed','completed','canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON proj.milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON proj.milestones(status);

-- TASKS table (Kanban board)
CREATE TABLE IF NOT EXISTS proj.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done','blocked')),
  assignee_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  estimate_hours NUMERIC(8,2) DEFAULT 0,
  logged_hours NUMERIC(8,2) DEFAULT 0,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON proj.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON proj.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON proj.tasks(assignee_id);

-- TEAM ALLOCATIONS table (capacity planning)
CREATE TABLE IF NOT EXISTS proj.allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  person_id UUID NOT NULL, -- could be core.users or bench.consultants
  person_type TEXT NOT NULL DEFAULT 'user' CHECK (person_type IN ('user','consultant')),
  role TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  allocation_pct INT CHECK (allocation_pct BETWEEN 0 AND 100),
  bill_rate NUMERIC(14,2),
  pay_rate NUMERIC(14,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_allocations_project ON proj.allocations(project_id);
CREATE INDEX IF NOT EXISTS idx_allocations_person ON proj.allocations(person_id);

-- CHANGE ORDERS table (scope/fee changes)
CREATE TABLE IF NOT EXISTS proj.change_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','billed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_change_orders_project ON proj.change_orders(project_id);

-- FILES table (references to storage)
CREATE TABLE IF NOT EXISTS proj.files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES proj.projects(id) ON DELETE CASCADE,
  title TEXT,
  file_url TEXT NOT NULL,
  mime TEXT,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_files_project ON proj.files(project_id);

-- Enable RLS on all tables
ALTER TABLE proj.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proj.files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects (tenant read; write for admins/managers/owner)
CREATE POLICY projects_read ON proj.projects FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY projects_write ON proj.projects FOR ALL USING (
  tenant_id = sec.current_tenant_id() AND (
    EXISTS (
      SELECT 1 FROM core.user_roles ur 
      JOIN core.roles r ON r.id = ur.role_id 
      WHERE ur.tenant_id = proj.projects.tenant_id 
      AND ur.user_id = sec.current_user_id() 
      AND r.key IN ('master_admin','super_admin','admin','manager')
    )
    OR owner_id = sec.current_user_id()
  )
);

-- RLS Policies for budgets
CREATE POLICY budgets_read ON proj.budgets FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY budgets_write ON proj.budgets FOR ALL USING (tenant_id = sec.current_tenant_id());

-- RLS Policies for milestones
CREATE POLICY milestones_read ON proj.milestones FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY milestones_write ON proj.milestones FOR ALL USING (tenant_id = sec.current_tenant_id());

-- RLS Policies for tasks
CREATE POLICY tasks_read ON proj.tasks FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY tasks_write ON proj.tasks FOR ALL USING (tenant_id = sec.current_tenant_id());

-- RLS Policies for allocations
CREATE POLICY allocations_read ON proj.allocations FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY allocations_write ON proj.allocations FOR ALL USING (tenant_id = sec.current_tenant_id());

-- RLS Policies for change orders
CREATE POLICY change_orders_read ON proj.change_orders FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY change_orders_write ON proj.change_orders FOR ALL USING (tenant_id = sec.current_tenant_id());

-- RLS Policies for files
CREATE POLICY files_read ON proj.files FOR SELECT USING (tenant_id = sec.current_tenant_id());
CREATE POLICY files_write ON proj.files FOR ALL USING (tenant_id = sec.current_tenant_id());

-- Audit helper function
CREATE OR REPLACE FUNCTION proj.audit(_action TEXT, _resource TEXT, _payload JSONB)
RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT sec.log_action(sec.current_tenant_id(), sec.current_user_id(), _action, _resource, _payload);
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION proj.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON proj.projects FOR EACH ROW EXECUTE FUNCTION proj.update_timestamp();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON proj.milestones FOR EACH ROW EXECUTE FUNCTION proj.update_timestamp();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON proj.tasks FOR EACH ROW EXECUTE FUNCTION proj.update_timestamp();
CREATE TRIGGER change_orders_updated_at BEFORE UPDATE ON proj.change_orders FOR EACH ROW EXECUTE FUNCTION proj.update_timestamp();

-- View for project KPIs
CREATE OR REPLACE VIEW proj.project_kpis AS
SELECT 
  p.id,
  p.tenant_id,
  p.code,
  p.name,
  p.status,
  p.model,
  b.labor_budget,
  b.expense_budget,
  b.fee_budget,
  (b.labor_budget + b.expense_budget + b.fee_budget) AS total_budget,
  COUNT(DISTINCT t.id) AS task_count,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) AS completed_tasks,
  SUM(t.estimate_hours) AS total_estimate_hours,
  SUM(t.logged_hours) AS total_logged_hours,
  COUNT(DISTINCT m.id) AS milestone_count,
  COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) AS completed_milestones
FROM proj.projects p
LEFT JOIN proj.budgets b ON b.project_id = p.id
LEFT JOIN proj.tasks t ON t.project_id = p.id
LEFT JOIN proj.milestones m ON m.project_id = p.id
GROUP BY p.id, p.tenant_id, p.code, p.name, p.status, p.model, 
         b.labor_budget, b.expense_budget, b.fee_budget;

COMMENT ON TABLE proj.projects IS 'Internal projects for tracking work, budgets, and profitability';
COMMENT ON TABLE proj.budgets IS 'Budget allocations per project (labor, expense, fee)';
COMMENT ON TABLE proj.milestones IS 'Project milestones for Fixed/Retainer billing or checkpoints';
COMMENT ON TABLE proj.tasks IS 'Kanban-style tasks for project execution';
COMMENT ON TABLE proj.allocations IS 'Team member allocations and capacity planning';
COMMENT ON TABLE proj.change_orders IS 'Scope and fee changes for projects';
COMMENT ON TABLE proj.files IS 'Project document storage references';
