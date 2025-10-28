-- Nino360 — Step 10: HRMS (100% Production)
-- Complete Human Resource Management System

-- Create HR schema
create schema if not exists hr;

-- ============================
-- EMPLOYEE MASTER
-- ============================
create table hr.employees (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  user_id uuid references core.users(id) on delete set null,
  emp_code text not null,
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  dob date,
  gender text,
  hire_date date,
  termination_date date,
  employment_type text not null default 'employee' check (employment_type in ('employee','contractor','intern','consultant')),
  work_location text,
  manager_id uuid references hr.employees(id) on delete set null,
  department text,
  designation text,
  status text not null default 'active' check (status in ('active','on_leave','terminated','inactive')),
  picture_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, emp_code)
);
create index on hr.employees(tenant_id);
create index on hr.employees(manager_id);

-- EMPLOYEE PROFILES
create table hr.employee_profiles (
  employee_id uuid primary key references hr.employees(id) on delete cascade,
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  address jsonb default '{}'::jsonb,
  emergency_contacts jsonb default '[]'::jsonb,
  bank jsonb default '{}'::jsonb,
  tax jsonb default '{}'::jsonb,
  custom jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ASSIGNMENTS (project/client placement)
create table hr.assignments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  project_id uuid references proj.projects(id) on delete set null,
  client_id uuid references finance.clients(id) on delete set null,
  title text,
  start_date date not null,
  end_date date,
  bill_rate numeric(14,2),
  pay_rate numeric(14,2),
  currency text default 'USD',
  status text not null default 'active' check (status in ('active','completed','on_hold')),
  created_at timestamptz default now()
);
create index on hr.assignments(tenant_id, employee_id);

-- ATTENDANCE
create table hr.attendance (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  work_hours numeric(6,2),
  status text default 'present' check (status in ('present','absent','on_leave','holiday')),
  notes text,
  unique(tenant_id, employee_id, work_date)
);
create index on hr.attendance(tenant_id, employee_id, work_date);

-- LEAVE POLICIES
create table hr.leave_policies (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  accrual_per_month numeric(6,2) not null default 1.5,
  carry_forward boolean default true,
  max_balance numeric(6,2) default 24,
  unique(tenant_id, name)
);

-- LEAVE BALANCES
create table hr.leave_balances (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  policy_id uuid not null references hr.leave_policies(id) on delete cascade,
  balance numeric(6,2) not null default 0,
  as_of date not null default current_date,
  unique(employee_id, policy_id)
);

-- LEAVE REQUESTS
create table hr.leave_requests (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  policy_id uuid not null references hr.leave_policies(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  days numeric(6,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','canceled')),
  approver_id uuid references hr.employees(id) on delete set null,
  reason text,
  created_at timestamptz default now()
);
create index on hr.leave_requests(tenant_id, employee_id);

-- TIMESHEETS (Employee flavor; sync with Finance)
create table hr.timesheets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  status text not null default 'open' check (status in ('open','submitted','approved','rejected','locked','exported')),
  approver_emp_id uuid references hr.employees(id) on delete set null,
  created_at timestamptz default now(),
  unique(tenant_id, employee_id, week_start)
);

create table hr.timesheet_entries (
  id uuid primary key default uuid_generate_v4(),
  timesheet_id uuid not null references hr.timesheets(id) on delete cascade,
  work_date date not null,
  project_id uuid references proj.projects(id) on delete set null,
  assignment_id uuid references hr.assignments(id) on delete set null,
  hours numeric(5,2) not null,
  notes text
);

-- COMPENSATION & BENEFITS
create table hr.compensation (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  effective_date date not null,
  ctc numeric(14,2),
  pay_frequency text default 'monthly',
  components jsonb default '{}'::jsonb,
  currency text default 'USD',
  notes text
);

create table hr.benefits (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  plan_name text not null,
  provider text,
  coverage jsonb default '{}'::jsonb,
  start_date date,
  end_date date
);

-- PERFORMANCE
create table hr.performance_cycles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text default 'open' check (status in ('open','locked','completed')),
  unique(tenant_id, name)
);

create table hr.performance_reviews (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  cycle_id uuid not null references hr.performance_cycles(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  reviewer_emp_id uuid references hr.employees(id) on delete set null,
  self_rating int2 check (self_rating between 1 and 5),
  manager_rating int2 check (manager_rating between 1 and 5),
  goals jsonb default '[]'::jsonb,
  feedback text,
  status text default 'draft' check (status in ('draft','submitted','finalized')),
  created_at timestamptz default now(),
  unique(cycle_id, employee_id)
);

-- DOCUMENTS & IMMIGRATION
create table hr.documents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  title text not null,
  kind text,
  file_url text not null,
  mime text,
  status text default 'valid' check (status in ('valid','expired','revoked','pending')),
  expires_at date,
  uploaded_by uuid references core.users(id) on delete set null,
  created_at timestamptz default now()
);
create index on hr.documents(employee_id);

create table hr.immigration_cases (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  case_type text not null,
  status text not null default 'intake' check (status in ('intake','filed','rfie','approved','denied','withdrawn')),
  attorney text,
  received_at date,
  expires_at date,
  notes text
);

-- I-9 (US) minimal
create table hr.i9_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid not null references hr.employees(id) on delete cascade,
  section1 jsonb not null,
  section2 jsonb,
  status text default 'pending' check (status in ('pending','complete','reverify_required')),
  created_at timestamptz default now()
);

-- HELP DESK
create table hr.tickets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references core.tenants(id) on delete cascade,
  employee_id uuid references hr.employees(id) on delete set null,
  subject text not null,
  body text,
  category text,
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  status text default 'open' check (status in ('open','in_progress','resolved','closed')),
  assignee_emp_id uuid references hr.employees(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on hr.tickets(tenant_id, status);

-- Enable RLS for all tables
alter table hr.employees enable row level security;
alter table hr.employee_profiles enable row level security;
alter table hr.assignments enable row level security;
alter table hr.attendance enable row level security;
alter table hr.leave_policies enable row level security;
alter table hr.leave_balances enable row level security;
alter table hr.leave_requests enable row level security;
alter table hr.timesheets enable row level security;
alter table hr.timesheet_entries enable row level security;
alter table hr.compensation enable row level security;
alter table hr.benefits enable row level security;
alter table hr.performance_cycles enable row level security;
alter table hr.performance_reviews enable row level security;
alter table hr.documents enable row level security;
alter table hr.immigration_cases enable row level security;
alter table hr.i9_records enable row level security;
alter table hr.tickets enable row level security;

-- RLS Policies (tenant membership read; HR/admin write)
create policy hr_employees_read on hr.employees for select using (tenant_id = sec.current_tenant_id());
create policy hr_employees_write on hr.employees for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.employees.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','manager')
  )
);

-- Repeat similar policies for other hr.* tables
create policy hr_profiles_read on hr.employee_profiles for select using (tenant_id = sec.current_tenant_id());
create policy hr_profiles_write on hr.employee_profiles for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.employee_profiles.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','manager')
  )
);

create policy hr_assignments_read on hr.assignments for select using (tenant_id = sec.current_tenant_id());
create policy hr_assignments_write on hr.assignments for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.assignments.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','manager')
  )
);

create policy hr_attendance_read on hr.attendance for select using (tenant_id = sec.current_tenant_id());
create policy hr_attendance_write on hr.attendance for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.attendance.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','manager')
  )
);

create policy hr_leave_policies_read on hr.leave_policies for select using (tenant_id = sec.current_tenant_id());
create policy hr_leave_policies_write on hr.leave_policies for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.leave_policies.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_leave_balances_read on hr.leave_balances for select using (tenant_id = sec.current_tenant_id());
create policy hr_leave_balances_write on hr.leave_balances for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.leave_balances.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_leave_requests_read on hr.leave_requests for select using (tenant_id = sec.current_tenant_id());
create policy hr_leave_requests_write on hr.leave_requests for all using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.leave_requests.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr','manager')
    )
  )
);

create policy hr_timesheets_read on hr.timesheets for select using (tenant_id = sec.current_tenant_id());
create policy hr_timesheets_write on hr.timesheets for all using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.timesheets.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr','manager')
    )
  )
);

create policy hr_timesheet_entries_read on hr.timesheet_entries for select using (
  exists (select 1 from hr.timesheets where id = hr.timesheet_entries.timesheet_id and tenant_id = sec.current_tenant_id())
);
create policy hr_timesheet_entries_write on hr.timesheet_entries for all using (
  exists (
    select 1 from hr.timesheets ts
    where ts.id = hr.timesheet_entries.timesheet_id
      and ts.tenant_id = sec.current_tenant_id()
      and (
        ts.employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
        exists (
          select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
          where ur.tenant_id = ts.tenant_id and ur.user_id = sec.current_user_id()
            and r.key in ('master_admin','super_admin','admin','hr','manager')
        )
      )
  )
);

create policy hr_compensation_read on hr.compensation for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.compensation.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr','finance')
    )
  )
);
create policy hr_compensation_write on hr.compensation for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.compensation.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','finance')
  )
);

create policy hr_benefits_read on hr.benefits for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.benefits.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);
create policy hr_benefits_write on hr.benefits for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.benefits.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_performance_cycles_read on hr.performance_cycles for select using (tenant_id = sec.current_tenant_id());
create policy hr_performance_cycles_write on hr.performance_cycles for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.performance_cycles.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr','manager')
  )
);

create policy hr_performance_reviews_read on hr.performance_reviews for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    reviewer_emp_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.performance_reviews.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr','manager')
    )
  )
);
create policy hr_performance_reviews_write on hr.performance_reviews for all using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    reviewer_emp_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.performance_reviews.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr','manager')
    )
  )
);

create policy hr_documents_read on hr.documents for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.documents.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);
create policy hr_documents_write on hr.documents for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.documents.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_immigration_cases_read on hr.immigration_cases for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.immigration_cases.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);
create policy hr_immigration_cases_write on hr.immigration_cases for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.immigration_cases.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_i9_records_read on hr.i9_records for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.i9_records.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);
create policy hr_i9_records_write on hr.i9_records for all using (
  tenant_id = sec.current_tenant_id() and exists (
    select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
    where ur.tenant_id = hr.i9_records.tenant_id and ur.user_id = sec.current_user_id()
      and r.key in ('master_admin','super_admin','admin','hr')
  )
);

create policy hr_tickets_read on hr.tickets for select using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    assignee_emp_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.tickets.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);
create policy hr_tickets_write on hr.tickets for all using (
  tenant_id = sec.current_tenant_id() and (
    employee_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    assignee_emp_id in (select id from hr.employees where user_id = sec.current_user_id()) or
    exists (
      select 1 from core.user_roles ur join core.roles r on r.id=ur.role_id
      where ur.tenant_id = hr.tickets.tenant_id and ur.user_id = sec.current_user_id()
        and r.key in ('master_admin','super_admin','admin','hr')
    )
  )
);

-- Audit helper function
create or replace function hr.audit(_action text, _resource text, _payload jsonb)
returns void language sql security definer as $$
  select sec.log_action(sec.current_tenant_id(), sec.current_user_id(), _action, _resource, _payload);
$$;

-- Automation triggers for outbox (Step 9 integration)
create or replace function hr.capture_employee_event()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'employee.created', 'employee', new.id, to_jsonb(new));
  elsif TG_OP = 'UPDATE' then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'employee.updated', 'employee', new.id, to_jsonb(new));
  elsif TG_OP = 'DELETE' then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (old.tenant_id, 'employee.deleted', 'employee', old.id, to_jsonb(old));
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_auto_employee_event
after insert or update or delete on hr.employees
for each row execute function hr.capture_employee_event();

-- Timesheet event capture
create or replace function hr.capture_timesheet_event()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'UPDATE' and old.status <> new.status then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'timesheet.status_changed', 'timesheet', new.id, jsonb_build_object('old_status', old.status, 'new_status', new.status, 'employee_id', new.employee_id));
  end if;
  return new;
end;
$$;

create trigger trg_auto_timesheet_event
after update on hr.timesheets
for each row execute function hr.capture_timesheet_event();

-- Leave request event capture
create or replace function hr.capture_leave_event()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'leave.requested', 'leave_request', new.id, to_jsonb(new));
  elsif TG_OP = 'UPDATE' and old.status <> new.status then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'leave.status_changed', 'leave_request', new.id, jsonb_build_object('old_status', old.status, 'new_status', new.status, 'employee_id', new.employee_id));
  end if;
  return new;
end;
$$;

create trigger trg_auto_leave_event
after insert or update on hr.leave_requests
for each row execute function hr.capture_leave_event();

-- Document expiry event capture
create or replace function hr.capture_document_expiry()
returns trigger language plpgsql security definer as $$
begin
  if new.expires_at is not null and new.expires_at <= current_date + interval '15 days' and new.status = 'valid' then
    insert into auto.outbox (tenant_id, event_type, entity_type, entity_id, payload)
    values (new.tenant_id, 'document.expiring_soon', 'document', new.id, to_jsonb(new));
  end if;
  return new;
end;
$$;

create trigger trg_auto_document_expiry
after insert or update on hr.documents
for each row execute function hr.capture_document_expiry();
