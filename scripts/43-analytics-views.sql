-- Materialized views for analytics and reporting
-- Run this script to create optimized views for dashboards

-- ============================================================================
-- CRM Analytics Views
-- ============================================================================

-- Sales pipeline metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS crm_pipeline_metrics AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', created_at) as month,
  stage,
  COUNT(*) as opportunity_count,
  SUM(amount) as total_value,
  AVG(amount) as avg_deal_size,
  COUNT(CASE WHEN status = 'won' THEN 1 END) as won_count,
  COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost_count,
  ROUND(
    COUNT(CASE WHEN status = 'won' THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as win_rate
FROM crm_opportunities
GROUP BY tenant_id, DATE_TRUNC('month', created_at), stage;

CREATE INDEX idx_crm_pipeline_metrics_tenant ON crm_pipeline_metrics(tenant_id);
CREATE INDEX idx_crm_pipeline_metrics_month ON crm_pipeline_metrics(month);

-- Lead conversion funnel
CREATE MATERIALIZED VIEW IF NOT EXISTS crm_lead_funnel AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', created_at) as month,
  source,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
  ROUND(
    COUNT(CASE WHEN status = 'qualified' THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as qualification_rate,
  ROUND(
    COUNT(CASE WHEN status = 'converted' THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as conversion_rate
FROM crm_leads
GROUP BY tenant_id, DATE_TRUNC('month', created_at), source;

CREATE INDEX idx_crm_lead_funnel_tenant ON crm_lead_funnel(tenant_id);
CREATE INDEX idx_crm_lead_funnel_month ON crm_lead_funnel(month);

-- ============================================================================
-- Talent/ATS Analytics Views
-- ============================================================================

-- Recruitment funnel metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS ats_recruitment_funnel AS
SELECT 
  tenant_id,
  job_id,
  DATE_TRUNC('month', created_at) as month,
  stage,
  COUNT(*) as candidate_count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days_in_stage,
  COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired_count
FROM ats_applications
GROUP BY tenant_id, job_id, DATE_TRUNC('month', created_at), stage;

CREATE INDEX idx_ats_funnel_tenant ON ats_recruitment_funnel(tenant_id);
CREATE INDEX idx_ats_funnel_job ON ats_recruitment_funnel(job_id);

-- Time to hire metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS ats_time_to_hire AS
SELECT 
  j.tenant_id,
  j.id as job_id,
  j.title as job_title,
  j.department,
  DATE_TRUNC('month', j.created_at) as month,
  COUNT(a.id) FILTER (WHERE a.status = 'hired') as hires,
  AVG(
    EXTRACT(EPOCH FROM (a.updated_at - j.created_at))/86400
  ) FILTER (WHERE a.status = 'hired') as avg_time_to_hire_days,
  MIN(
    EXTRACT(EPOCH FROM (a.updated_at - j.created_at))/86400
  ) FILTER (WHERE a.status = 'hired') as min_time_to_hire_days,
  MAX(
    EXTRACT(EPOCH FROM (a.updated_at - j.created_at))/86400
  ) FILTER (WHERE a.status = 'hired') as max_time_to_hire_days
FROM ats_job_requisitions j
LEFT JOIN ats_applications a ON j.id = a.job_id
GROUP BY j.tenant_id, j.id, j.title, j.department, DATE_TRUNC('month', j.created_at);

CREATE INDEX idx_ats_tth_tenant ON ats_time_to_hire(tenant_id);
CREATE INDEX idx_ats_tth_month ON ats_time_to_hire(month);

-- Source effectiveness
CREATE MATERIALIZED VIEW IF NOT EXISTS ats_source_effectiveness AS
SELECT 
  c.tenant_id,
  c.source,
  DATE_TRUNC('month', c.created_at) as month,
  COUNT(DISTINCT c.id) as total_candidates,
  COUNT(DISTINCT a.id) as applications,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'hired') as hires,
  ROUND(
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'hired')::numeric / 
    NULLIF(COUNT(DISTINCT c.id), 0) * 100, 
    2
  ) as hire_rate
FROM ats_candidates c
LEFT JOIN ats_applications a ON c.id = a.candidate_id
GROUP BY c.tenant_id, c.source, DATE_TRUNC('month', c.created_at);

CREATE INDEX idx_ats_source_tenant ON ats_source_effectiveness(tenant_id);
CREATE INDEX idx_ats_source_month ON ats_source_effectiveness(month);

-- ============================================================================
-- HRMS Analytics Views
-- ============================================================================

-- Headcount and attrition
CREATE MATERIALIZED VIEW IF NOT EXISTS hrms_headcount_metrics AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', date) as month,
  department,
  COUNT(*) FILTER (WHERE status = 'active') as active_employees,
  COUNT(*) FILTER (WHERE status = 'terminated' AND DATE_TRUNC('month', termination_date) = DATE_TRUNC('month', date)) as terminations,
  COUNT(*) FILTER (WHERE DATE_TRUNC('month', hire_date) = DATE_TRUNC('month', date)) as new_hires,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'terminated' AND DATE_TRUNC('month', termination_date) = DATE_TRUNC('month', date))::numeric / 
    NULLIF(COUNT(*) FILTER (WHERE status = 'active'), 0) * 100, 
    2
  ) as attrition_rate
FROM hrms_employees
CROSS JOIN generate_series(
  DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'),
  DATE_TRUNC('month', CURRENT_DATE),
  INTERVAL '1 month'
) as date
WHERE hire_date <= date
GROUP BY tenant_id, DATE_TRUNC('month', date), department;

CREATE INDEX idx_hrms_headcount_tenant ON hrms_headcount_metrics(tenant_id);
CREATE INDEX idx_hrms_headcount_month ON hrms_headcount_metrics(month);

-- Timesheet utilization
CREATE MATERIALIZED VIEW IF NOT EXISTS hrms_utilization_metrics AS
SELECT 
  t.tenant_id,
  t.employee_id,
  e.first_name,
  e.last_name,
  e.department,
  DATE_TRUNC('month', t.week_start_date) as month,
  SUM(t.total_hours) as total_hours,
  SUM(t.billable_hours) as billable_hours,
  ROUND(
    SUM(t.billable_hours)::numeric / 
    NULLIF(SUM(t.total_hours), 0) * 100, 
    2
  ) as utilization_rate
FROM hrms_timesheets t
JOIN hrms_employees e ON t.employee_id = e.id
WHERE t.status = 'approved'
GROUP BY t.tenant_id, t.employee_id, e.first_name, e.last_name, e.department, DATE_TRUNC('month', t.week_start_date);

CREATE INDEX idx_hrms_util_tenant ON hrms_utilization_metrics(tenant_id);
CREATE INDEX idx_hrms_util_employee ON hrms_utilization_metrics(employee_id);
CREATE INDEX idx_hrms_util_month ON hrms_utilization_metrics(month);

-- ============================================================================
-- Finance Analytics Views
-- ============================================================================

-- Revenue and collections
CREATE MATERIALIZED VIEW IF NOT EXISTS finance_revenue_metrics AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', invoice_date) as month,
  COUNT(*) as invoice_count,
  SUM(total_amount) as total_invoiced,
  SUM(paid_amount) as total_collected,
  SUM(total_amount - paid_amount) as outstanding,
  ROUND(
    SUM(paid_amount)::numeric / 
    NULLIF(SUM(total_amount), 0) * 100, 
    2
  ) as collection_rate,
  AVG(
    CASE 
      WHEN payment_date IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (payment_date - invoice_date))/86400 
    END
  ) as avg_days_to_payment
FROM finance_invoices
WHERE status != 'draft'
GROUP BY tenant_id, DATE_TRUNC('month', invoice_date);

CREATE INDEX idx_finance_revenue_tenant ON finance_revenue_metrics(tenant_id);
CREATE INDEX idx_finance_revenue_month ON finance_revenue_metrics(month);

-- Aging report
CREATE MATERIALIZED VIEW IF NOT EXISTS finance_aging_report AS
SELECT 
  tenant_id,
  customer_id,
  SUM(total_amount - paid_amount) FILTER (WHERE CURRENT_DATE - due_date <= 30) as current,
  SUM(total_amount - paid_amount) FILTER (WHERE CURRENT_DATE - due_date BETWEEN 31 AND 60) as days_31_60,
  SUM(total_amount - paid_amount) FILTER (WHERE CURRENT_DATE - due_date BETWEEN 61 AND 90) as days_61_90,
  SUM(total_amount - paid_amount) FILTER (WHERE CURRENT_DATE - due_date > 90) as over_90_days,
  SUM(total_amount - paid_amount) as total_outstanding
FROM finance_invoices
WHERE status = 'sent' AND (total_amount - paid_amount) > 0
GROUP BY tenant_id, customer_id;

CREATE INDEX idx_finance_aging_tenant ON finance_aging_report(tenant_id);
CREATE INDEX idx_finance_aging_customer ON finance_aging_report(customer_id);

-- ============================================================================
-- Bench Analytics Views
-- ============================================================================

-- Bench utilization
CREATE MATERIALIZED VIEW IF NOT EXISTS bench_utilization_metrics AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', date) as month,
  COUNT(DISTINCT resource_id) as total_resources,
  COUNT(DISTINCT resource_id) FILTER (WHERE status = 'available') as bench_count,
  COUNT(DISTINCT resource_id) FILTER (WHERE status = 'allocated') as allocated_count,
  ROUND(
    COUNT(DISTINCT resource_id) FILTER (WHERE status = 'allocated')::numeric / 
    NULLIF(COUNT(DISTINCT resource_id), 0) * 100, 
    2
  ) as utilization_rate,
  AVG(bench_days) FILTER (WHERE status = 'available') as avg_bench_days
FROM bench_tracking
CROSS JOIN generate_series(
  DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months'),
  DATE_TRUNC('month', CURRENT_DATE),
  INTERVAL '1 month'
) as date
GROUP BY tenant_id, DATE_TRUNC('month', date);

CREATE INDEX idx_bench_util_tenant ON bench_utilization_metrics(tenant_id);
CREATE INDEX idx_bench_util_month ON bench_utilization_metrics(month);

-- ============================================================================
-- VMS Analytics Views
-- ============================================================================

-- Vendor performance
CREATE MATERIALIZED VIEW IF NOT EXISTS vms_vendor_performance AS
SELECT 
  v.tenant_id,
  v.id as vendor_id,
  v.name as vendor_name,
  DATE_TRUNC('month', s.created_at) as month,
  COUNT(s.id) as total_submissions,
  COUNT(s.id) FILTER (WHERE s.status = 'shortlisted') as shortlisted,
  COUNT(s.id) FILTER (WHERE s.status = 'hired') as hires,
  ROUND(
    COUNT(s.id) FILTER (WHERE s.status = 'hired')::numeric / 
    NULLIF(COUNT(s.id), 0) * 100, 
    2
  ) as hire_rate,
  AVG(
    EXTRACT(EPOCH FROM (s.created_at - j.created_at))/3600
  ) as avg_response_time_hours
FROM vms_vendors v
LEFT JOIN vms_submissions s ON v.id = s.vendor_id
LEFT JOIN vms_jobs j ON s.job_id = j.id
GROUP BY v.tenant_id, v.id, v.name, DATE_TRUNC('month', s.created_at);

CREATE INDEX idx_vms_perf_tenant ON vms_vendor_performance(tenant_id);
CREATE INDEX idx_vms_perf_vendor ON vms_vendor_performance(vendor_id);
CREATE INDEX idx_vms_perf_month ON vms_vendor_performance(month);

-- ============================================================================
-- Training/LMS Analytics Views
-- ============================================================================

-- Learning completion metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS lms_completion_metrics AS
SELECT 
  c.tenant_id,
  c.id as course_id,
  c.title as course_title,
  c.category,
  DATE_TRUNC('month', e.enrolled_at) as month,
  COUNT(e.id) as total_enrollments,
  COUNT(e.id) FILTER (WHERE e.status = 'completed') as completions,
  COUNT(e.id) FILTER (WHERE e.status = 'in_progress') as in_progress,
  ROUND(
    COUNT(e.id) FILTER (WHERE e.status = 'completed')::numeric / 
    NULLIF(COUNT(e.id), 0) * 100, 
    2
  ) as completion_rate,
  AVG(e.progress) as avg_progress,
  AVG(
    EXTRACT(EPOCH FROM (e.completed_at - e.enrolled_at))/86400
  ) FILTER (WHERE e.status = 'completed') as avg_days_to_complete
FROM lms_courses c
LEFT JOIN lms_enrollments e ON c.id = e.course_id
GROUP BY c.tenant_id, c.id, c.title, c.category, DATE_TRUNC('month', e.enrolled_at);

CREATE INDEX idx_lms_completion_tenant ON lms_completion_metrics(tenant_id);
CREATE INDEX idx_lms_completion_course ON lms_completion_metrics(course_id);
CREATE INDEX idx_lms_completion_month ON lms_completion_metrics(month);

-- ============================================================================
-- Refresh function for all materialized views
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_all_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY crm_pipeline_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY crm_lead_funnel;
  REFRESH MATERIALIZED VIEW CONCURRENTLY ats_recruitment_funnel;
  REFRESH MATERIALIZED VIEW CONCURRENTLY ats_time_to_hire;
  REFRESH MATERIALIZED VIEW CONCURRENTLY ats_source_effectiveness;
  REFRESH MATERIALIZED VIEW CONCURRENTLY hrms_headcount_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY hrms_utilization_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY finance_revenue_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY finance_aging_report;
  REFRESH MATERIALIZED VIEW CONCURRENTLY bench_utilization_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY vms_vendor_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY lms_completion_metrics;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (run daily at 2 AM)
-- Note: This requires pg_cron extension
-- SELECT cron.schedule('refresh-analytics', '0 2 * * *', 'SELECT refresh_all_analytics_views()');

COMMENT ON FUNCTION refresh_all_analytics_views IS 'Refreshes all materialized views for analytics dashboards';
