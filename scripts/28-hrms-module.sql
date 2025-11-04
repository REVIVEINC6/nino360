-- ============================================================================
-- Nino360 HRMS Module (Step 7)
-- ============================================================================
-- Schema: hr
-- Features: Employees, Assignments, Attendance, Timesheets, I-9/Immigration,
--           Performance, Benefits, On/Offboarding, Documents, Helpdesk
-- ============================================================================

-- Create schema
create schema if not exists hr;

-- ============================================================================
-- EMPLOYEES
-- ============================================================================
create table if not exists hr.employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  code text,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  location text,
  work_auth text,
  hire_date date,
  termination_date date,
  employment_type text check (employment_type in ('W2','C2C','Contract','Full-Time','Part-Time')),
  department text,
  title text,
  manager_id uuid references core.users(id) on delete set null,
  status text default 'active' check (status in ('active','leave','terminated')),
  tags text[] default '{}',
  cost_rate numeric(14,2),
  bill_rate numeric(14,2),
  profile jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- ASSIGNMENTS
-- ============================================================================
create table if not exists hr.assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  job_id uuid references ats.jobs(id) on delete set null,
  customer_id uuid references finance.customers(id) on delete set null,
  role text,
  start_date date not null,
  end_date date,
  allocation_percent int2 default 100 check (allocation_percent between 1 and 100),
  status text default 'active' check (status in ('active','planned','ended')),
  notes text,
  created_at timestamptz default now()
);

-- ============================================================================
-- ATTENDANCE
-- ============================================================================
create table if not exists hr.attendance (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present','absent','leave','holiday','remote')),
  checkin_at timestamptz,
  checkout_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================================
-- TIMESHEETS
-- ============================================================================
create table if not exists hr.timesheets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  week_start date not null,
  status text default 'open' check (status in ('open','submitted','approved','rejected','exported')),
  submitted_at timestamptz,
  approved_by uuid references core.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists hr.timesheet_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  timesheet_id uuid not null references hr.timesheets(id) on delete cascade,
  project text,
  task text,
  day date not null,
  hours numeric(5,2) not null check (hours between 0 and 24),
  notes text,
  created_at timestamptz default now()
);

-- ============================================================================
-- IMMIGRATION
-- ============================================================================
create table if not exists hr.immigration_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  case_type text not null,
  case_number text,
  status text default 'open' check (status in ('open','rfe','approved','denied','withdrawn','closed')),
  priority_date date,
  filing_date date,
  expiry_date date,
  attorney jsonb default '{}'::jsonb,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================================
-- I-9 COMPLIANCE
-- ============================================================================
create table if not exists hr.i9_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  section1_completed_at timestamptz,
  section2_completed_at timestamptz,
  doc_type text,
  doc_number text,
  doc_expiry date,
  pdf_url text,
  e_verify_case text,
  status text default 'pending' check (status in ('pending','complete','reverify_due')),
  created_at timestamptz default now()
);

-- ============================================================================
-- DOCUMENTS
-- ============================================================================
create table if not exists hr.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid references hr.employees(id) on delete cascade,
  kind text not null,
  title text not null,
  file_url text not null,
  mime text,
  ai_parsed jsonb default '{}'::jsonb,
  uploaded_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================================
-- PERFORMANCE
-- ============================================================================
create table if not exists hr.performance_cycles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  period_start date not null,
  period_end date not null,
  status text default 'draft' check (status in ('draft','open','review','calibration','closed')),
  created_at timestamptz default now()
);

create table if not exists hr.performance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  cycle_id uuid not null references hr.performance_cycles(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  manager_id uuid references core.users(id) on delete set null,
  self_review text,
  manager_review text,
  ai_summary text,
  rating numeric(3,2),
  status text default 'pending' check (status in ('pending','submitted','manager_submitted','finalized')),
  created_at timestamptz default now()
);

-- ============================================================================
-- BENEFITS
-- ============================================================================
create table if not exists hr.benefits_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  key text not null,
  name text not null,
  provider text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists hr.benefits_enrollments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  plan_id uuid not null references hr.benefits_plans(id) on delete cascade,
  start_date date not null,
  end_date date,
  status text default 'active' check (status in ('active','waived','ended')),
  created_at timestamptz default now()
);

-- ============================================================================
-- ONBOARDING / OFFBOARDING
-- ============================================================================
create table if not exists hr.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  title text not null,
  assignee_user_id uuid references core.users(id) on delete set null,
  due_date date,
  status text default 'open' check (status in ('open','done','blocked')),
  created_at timestamptz default now()
);

create table if not exists hr.offboarding_checklist (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  item text not null,
  status text default 'open' check (status in ('open','done')),
  created_at timestamptz default now()
);

-- ============================================================================
-- HELPDESK
-- ============================================================================
create table if not exists hr.tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  requester_id uuid references core.users(id) on delete set null,
  category text check (category in ('it','payroll','benefits','hr','immigration')),
  subject text not null,
  body text,
  status text default 'open' check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz default now()
);

-- ============================================================================
-- MIGRATIONS
-- ============================================================================
do $$
begin
  -- Migrate hr.employees table
  -- Add code column and migrate from emp_code if it exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'code'
  ) then
    alter table hr.employees add column code text;
    
    -- Migrate data from emp_code if it exists
    if exists (
      select 1 from information_schema.columns 
      where table_schema = 'hr' and table_name = 'employees' and column_name = 'emp_code'
    ) then
      execute 'update hr.employees set code = emp_code where code is null and emp_code is not null';
    end if;
  end if;

  -- Add title column and migrate from designation if it exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'title'
  ) then
    alter table hr.employees add column title text;
    
    -- Migrate data from designation if it exists
    if exists (
      select 1 from information_schema.columns 
      where table_schema = 'hr' and table_name = 'employees' and column_name = 'designation'
    ) then
      execute 'update hr.employees set title = designation where title is null and designation is not null';
    end if;
  end if;

  -- Add other missing columns
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'work_auth'
  ) then
    alter table hr.employees add column work_auth text;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'hire_date'
  ) then
    alter table hr.employees add column hire_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'termination_date'
  ) then
    alter table hr.employees add column termination_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'employment_type'
  ) then
    alter table hr.employees add column employment_type text check (employment_type in ('W2','C2C','Contract','Full-Time','Part-Time'));
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'department'
  ) then
    alter table hr.employees add column department text;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'manager_id'
  ) then
    alter table hr.employees add column manager_id uuid references core.users(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'tags'
  ) then
    alter table hr.employees add column tags text[] default '{}';
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'cost_rate'
  ) then
    alter table hr.employees add column cost_rate numeric(14,2);
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'bill_rate'
  ) then
    alter table hr.employees add column bill_rate numeric(14,2);
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'profile'
  ) then
    alter table hr.employees add column profile jsonb default '{}'::jsonb;
  end if;

  -- Update status enum to include 'leave' if it doesn't exist
  -- This is a bit tricky with CHECK constraints, so we'll just ensure the column exists
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'employees' and column_name = 'status'
  ) then
    alter table hr.employees add column status text default 'active' check (status in ('active','leave','terminated'));
  end if;

  -- Simplified attendance date migration - just add column with default, no data migration
  -- Migrate hr.attendance table - add date column if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'attendance' and column_name = 'date'
  ) then
    -- Add with default to handle existing rows
    alter table hr.attendance add column date date not null default current_date;
    
    -- Remove default after adding (new rows will need explicit date)
    alter table hr.attendance alter column date drop default;
  end if;

  -- Add expiry_date column to immigration_cases if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'immigration_cases' and column_name = 'expiry_date'
  ) then
    alter table hr.immigration_cases add column expiry_date date;
  end if;

  -- Add doc_expiry column to i9_records if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'hr' and table_name = 'i9_records' and column_name = 'doc_expiry'
  ) then
    alter table hr.i9_records add column doc_expiry date;
  end if;

end $$;

-- Create indexes after migrations to ensure columns exist
create unique index if not exists idx_hr_employees_tenant_code on hr.employees(tenant_id, code) where code is not null;
create index if not exists idx_hr_employees_tenant on hr.employees(tenant_id);
create index if not exists idx_hr_employees_status on hr.employees(tenant_id, status);
create index if not exists idx_hr_employees_email on hr.employees(email) where email is not null;

create index if not exists idx_hr_assignments_tenant on hr.assignments(tenant_id);
create index if not exists idx_hr_assignments_employee on hr.assignments(employee_id);
create index if not exists idx_hr_assignments_dates on hr.assignments(tenant_id, start_date, end_date);

create unique index if not exists idx_hr_attendance_unique on hr.attendance(tenant_id, employee_id, date);
create index if not exists idx_hr_attendance_date on hr.attendance(tenant_id, date);

create unique index if not exists idx_hr_timesheets_unique on hr.timesheets(tenant_id, employee_id, week_start);
create index if not exists idx_hr_timesheets_status on hr.timesheets(tenant_id, status);

create index if not exists idx_hr_timesheet_lines_sheet on hr.timesheet_lines(timesheet_id);
create index if not exists idx_hr_timesheet_lines_day on hr.timesheet_lines(tenant_id, day);

create index if not exists idx_hr_immigration_tenant on hr.immigration_cases(tenant_id);
create index if not exists idx_hr_immigration_employee on hr.immigration_cases(employee_id);
create index if not exists idx_hr_immigration_expiry on hr.immigration_cases(tenant_id, expiry_date) where expiry_date is not null;

create index if not exists idx_hr_i9_tenant on hr.i9_records(tenant_id);
create index if not exists idx_hr_i9_employee on hr.i9_records(employee_id);
create index if not exists idx_hr_i9_expiry on hr.i9_records(tenant_id, doc_expiry) where doc_expiry is not null;

create index if not exists idx_hr_documents_tenant on hr.documents(tenant_id);
create index if not exists idx_hr_documents_employee on hr.documents(employee_id) where employee_id is not null;
create index if not exists idx_hr_documents_kind on hr.documents(tenant_id, kind);

create index if not exists idx_hr_perf_cycles_tenant on hr.performance_cycles(tenant_id);

create unique index if not exists idx_hr_perf_reviews_unique on hr.performance_reviews(cycle_id, employee_id);
create index if not exists idx_hr_perf_reviews_cycle on hr.performance_reviews(cycle_id);

create unique index if not exists idx_hr_benefits_plans_key on hr.benefits_plans(tenant_id, key);

create unique index if not exists idx_hr_benefits_enrollments_unique on hr.benefits_enrollments(employee_id, plan_id, start_date);
create index if not exists idx_hr_benefits_enrollments_employee on hr.benefits_enrollments(employee_id);

create index if not exists idx_hr_onboarding_employee on hr.onboarding_tasks(employee_id);
create index if not exists idx_hr_onboarding_status on hr.onboarding_tasks(tenant_id, status);

create index if not exists idx_hr_offboarding_employee on hr.offboarding_checklist(employee_id);

create index if not exists idx_hr_tickets_tenant on hr.tickets(tenant_id);
create index if not exists idx_hr_tickets_status on hr.tickets(tenant_id, status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
alter table hr.employees enable row level security;
alter table hr.assignments enable row level security;
alter table hr.attendance enable row level security;
alter table hr.timesheets enable row level security;
alter table hr.timesheet_lines enable row level security;
alter table hr.immigration_cases enable row level security;
alter table hr.i9_records enable row level security;
alter table hr.documents enable row level security;
alter table hr.performance_cycles enable row level security;
alter table hr.performance_reviews enable row level security;
alter table hr.benefits_plans enable row level security;
alter table hr.benefits_enrollments enable row level security;
alter table hr.onboarding_tasks enable row level security;
alter table hr.offboarding_checklist enable row level security;
alter table hr.tickets enable row level security;

-- Employees
drop policy if exists hr_employees_read on hr.employees;
create policy hr_employees_read on hr.employees for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_employees_write on hr.employees;
create policy hr_employees_write on hr.employees for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.employees'));

-- Assignments
drop policy if exists hr_assignments_read on hr.assignments;
create policy hr_assignments_read on hr.assignments for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_assignments_write on hr.assignments;
create policy hr_assignments_write on hr.assignments for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.assignments'));

-- Attendance
drop policy if exists hr_attendance_read on hr.attendance;
create policy hr_attendance_read on hr.attendance for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_attendance_write on hr.attendance;
create policy hr_attendance_write on hr.attendance for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.attendance'));

-- Timesheets
drop policy if exists hr_timesheets_read on hr.timesheets;
create policy hr_timesheets_read on hr.timesheets for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_timesheets_write on hr.timesheets;
create policy hr_timesheets_write on hr.timesheets for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.timesheets'));

drop policy if exists hr_timesheet_lines_read on hr.timesheet_lines;
create policy hr_timesheet_lines_read on hr.timesheet_lines for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_timesheet_lines_write on hr.timesheet_lines;
create policy hr_timesheet_lines_write on hr.timesheet_lines for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.timesheets'));

-- Immigration
drop policy if exists hr_immigration_read on hr.immigration_cases;
create policy hr_immigration_read on hr.immigration_cases for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_immigration_write on hr.immigration_cases;
create policy hr_immigration_write on hr.immigration_cases for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.immigration'));

-- I-9
drop policy if exists hr_i9_read on hr.i9_records;
create policy hr_i9_read on hr.i9_records for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_i9_write on hr.i9_records;
create policy hr_i9_write on hr.i9_records for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.i9'));

-- Documents
drop policy if exists hr_documents_read on hr.documents;
create policy hr_documents_read on hr.documents for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_documents_write on hr.documents;
create policy hr_documents_write on hr.documents for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.documents'));

-- Performance
drop policy if exists hr_perf_cycles_read on hr.performance_cycles;
create policy hr_perf_cycles_read on hr.performance_cycles for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_perf_cycles_write on hr.performance_cycles;
create policy hr_perf_cycles_write on hr.performance_cycles for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.performance'));

drop policy if exists hr_perf_reviews_read on hr.performance_reviews;
create policy hr_perf_reviews_read on hr.performance_reviews for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_perf_reviews_write on hr.performance_reviews;
create policy hr_perf_reviews_write on hr.performance_reviews for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.performance'));

-- Benefits
drop policy if exists hr_benefits_plans_read on hr.benefits_plans;
create policy hr_benefits_plans_read on hr.benefits_plans for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_benefits_plans_write on hr.benefits_plans;
create policy hr_benefits_plans_write on hr.benefits_plans for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.benefits'));

drop policy if exists hr_benefits_enrollments_read on hr.benefits_enrollments;
create policy hr_benefits_enrollments_read on hr.benefits_enrollments for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_benefits_enrollments_write on hr.benefits_enrollments;
create policy hr_benefits_enrollments_write on hr.benefits_enrollments for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.benefits'));

-- Onboarding
drop policy if exists hr_onboarding_read on hr.onboarding_tasks;
create policy hr_onboarding_read on hr.onboarding_tasks for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_onboarding_write on hr.onboarding_tasks;
create policy hr_onboarding_write on hr.onboarding_tasks for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.onboarding'));

-- Offboarding
drop policy if exists hr_offboarding_read on hr.offboarding_checklist;
create policy hr_offboarding_read on hr.offboarding_checklist for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_offboarding_write on hr.offboarding_checklist;
create policy hr_offboarding_write on hr.offboarding_checklist for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.offboarding'));

-- Helpdesk
drop policy if exists hr_tickets_read on hr.tickets;
create policy hr_tickets_read on hr.tickets for select using (tenant_id = sec.current_tenant_id());
drop policy if exists hr_tickets_write on hr.tickets;
create policy hr_tickets_write on hr.tickets for all using (tenant_id = sec.current_tenant_id() and sec.has_feature('hrms.helpdesk'));

-- ============================================================================
-- FEATURE GATES
-- ============================================================================
insert into core.features (module, key, name, tier, is_guarded, description)
values
  ('hrms', 'hrms.employees', 'Employee Management', 'starter', false, 'Core employee directory and profiles'),
  ('hrms', 'hrms.assignments', 'Employee Assignments', 'starter', false, 'Assign employees to jobs and customers'),
  ('hrms', 'hrms.attendance', 'Attendance Tracking', 'pro', true, 'Daily attendance check-in/out'),
  ('hrms', 'hrms.timesheets', 'Timesheets', 'starter', false, 'Weekly timesheet management'),
  ('hrms', 'hrms.payroll_bridge', 'Payroll Bridge', 'pro', true, 'Export timesheets to payroll'),
  ('hrms', 'hrms.immigration', 'Immigration Tracking', 'pro', true, 'Visa and immigration case management'),
  ('hrms', 'hrms.i9', 'I-9 Compliance', 'pro', true, 'I-9 verification and E-Verify'),
  ('hrms', 'hrms.documents', 'Document Management', 'starter', false, 'Employee document storage'),
  ('hrms', 'hrms.onboarding', 'Onboarding', 'pro', true, 'Employee onboarding workflows'),
  ('hrms', 'hrms.offboarding', 'Offboarding', 'pro', true, 'Employee offboarding checklists'),
  ('hrms', 'hrms.performance', 'Performance Reviews', 'pro', true, 'Performance review cycles'),
  ('hrms', 'hrms.benefits', 'Benefits Management', 'pro', true, 'Benefits plans and enrollments'),
  ('hrms', 'hrms.helpdesk', 'HR Helpdesk', 'starter', false, 'Employee support tickets'),
  ('hrms', 'hrms.ai_assist', 'AI Assistance', 'enterprise', true, 'AI-powered HR features')
on conflict (key) do nothing;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
do $$
declare
  v_tenant_id uuid;
  v_employee_id uuid;
  v_timesheet_id uuid;
  v_cycle_id uuid;
begin
  -- Get first tenant
  select id into v_tenant_id from core.tenants limit 1;
  
  if v_tenant_id is null then
    raise notice 'No tenant found, skipping sample data';
    return;
  end if;

  -- Create sample employee
  insert into hr.employees (
    tenant_id, code, first_name, last_name, email, phone, location,
    work_auth, hire_date, employment_type, department, title, status,
    cost_rate, bill_rate
  ) values (
    v_tenant_id, 'EMP-001', 'John', 'Doe', 'john.doe@example.com', '555-0100',
    'New York, NY', 'USC', current_date - interval '1 year', 'W2',
    'Engineering', 'Senior Software Engineer', 'active', 75.00, 150.00
  )
  returning id into v_employee_id;

  -- Create timesheet
  insert into hr.timesheets (tenant_id, employee_id, week_start, status)
  values (v_tenant_id, v_employee_id, date_trunc('week', current_date), 'open')
  returning id into v_timesheet_id;

  -- Add timesheet lines
  insert into hr.timesheet_lines (tenant_id, timesheet_id, project, task, day, hours)
  values 
    (v_tenant_id, v_timesheet_id, 'Project Alpha', 'Development', current_date, 8.0),
    (v_tenant_id, v_timesheet_id, 'Project Alpha', 'Code Review', current_date + 1, 6.0);

  -- Create performance cycle
  insert into hr.performance_cycles (tenant_id, name, period_start, period_end, status)
  values (v_tenant_id, 'H1 2025', '2025-01-01', '2025-06-30', 'open')
  returning id into v_cycle_id;

  -- Create performance review
  insert into hr.performance_reviews (tenant_id, cycle_id, employee_id, status)
  values (v_tenant_id, v_cycle_id, v_employee_id, 'pending');

  -- Create benefits plan
  insert into hr.benefits_plans (tenant_id, key, name, provider)
  values (v_tenant_id, 'health_ppo', 'Health Insurance PPO', 'Blue Cross');

  raise notice 'Sample HRMS data created successfully';
end $$;
