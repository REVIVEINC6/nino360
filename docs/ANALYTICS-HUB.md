# Enterprise Analytics Hub - Step 14

## Overview

The Enterprise Analytics Hub provides warehouse-grade analytics by syncing Nino360 data to BigQuery/Snowflake with CDC, transforming it with dbt, and exposing metrics through BI tools and the in-app Reports module.

## Architecture

\`\`\`
Supabase Postgres (Production)
  └─> CDC Connector (Logical Replication)
       ├─> BigQuery (Storage Write API)
       └─> Snowflake (Snowpipe Streaming)

Warehouse (BQ/SF)
  └─> Raw (bronze) → Staging (silver) → Marts (gold) → Metrics

BI & Apps
  ├─> In-app Reports/Copilot
  ├─> Looker Studio / Metabase / Superset
  └─> Scheduled Reports
\`\`\`

## Setup

### 1. Enable CDC from Supabase

\`\`\`sql
-- Enable logical replication
ALTER SYSTEM SET wal_level = logical;

-- Create publication for all tables
CREATE PUBLICATION nino360_cdc FOR ALL TABLES;

-- Create replication slot
SELECT pg_create_logical_replication_slot('nino360_slot', 'pgoutput');
\`\`\`

### 2. Configure BigQuery

\`\`\`bash
# Create dataset
bq mk --dataset --location=US nino360:raw
bq mk --dataset --location=US nino360:analytics

# Set up CDC connector (using Dataflow or custom)
gcloud dataflow jobs run nino360-cdc \
  --gcs-location gs://dataflow-templates/latest/Cloud_PubSub_to_BigQuery \
  --region us-central1 \
  --parameters inputTopic=projects/nino360/topics/cdc
\`\`\`

### 3. Configure Snowflake

\`\`\`sql
-- Create database and schemas
CREATE DATABASE NINO360;
CREATE SCHEMA NINO360.RAW;
CREATE SCHEMA NINO360.ANALYTICS;

-- Create warehouse
CREATE WAREHOUSE ANALYTICS_WH
  WITH WAREHOUSE_SIZE = 'SMALL'
  AUTO_SUSPEND = 300
  AUTO_RESUME = TRUE;

-- Set up Snowpipe
CREATE PIPE NINO360.RAW.CDC_PIPE
  AS COPY INTO NINO360.RAW.CHANGES
  FROM @CDC_STAGE
  FILE_FORMAT = (TYPE = JSON);
\`\`\`

### 4. Install dbt

\`\`\`bash
cd warehouse/dbt_nino360
pip install dbt-core dbt-bigquery dbt-snowflake

# Configure profiles
cp profiles.yml ~/.dbt/profiles.yml

# Set environment variables
export BIGQUERY_KEYFILE_PATH=/path/to/keyfile.json
export SNOWFLAKE_ACCOUNT=your-account
export SNOWFLAKE_USER=your-user
export SNOWFLAKE_PASSWORD=your-password

# Install dependencies
dbt deps

# Run models
dbt run --target bigquery
dbt test
dbt docs generate
dbt docs serve
\`\`\`

### 5. Enable in Application

\`\`\`sql
-- Add warehouse configuration
INSERT INTO system_config (key, value) VALUES (
  'warehouse_config',
  '{
    "enabled": true,
    "provider": "bigquery",
    "projectId": "nino360-analytics",
    "dataset": "analytics"
  }'::jsonb
);
\`\`\`

## dbt Models

### Staging Layer (Silver)

Staging models deduplicate CDC changes and extract the latest state:

- `stg_finance_invoices` - Current invoice records
- `stg_ats_applications` - Current application records
- `stg_bench_consultants` - Current consultant records
- etc.

### Marts Layer (Gold)

Business-ready aggregated tables:

- **Finance**: `mart_finance_ar_open`, `mart_finance_revenue`
- **ATS**: `mart_ats_pipeline`, `mart_ats_time_to_hire`
- **Bench**: `mart_bench_utilization`, `mart_bench_placements`
- **VMS**: `mart_vms_vendor_performance`
- **HRMS**: `mart_hrms_headcount`, `mart_hrms_attrition`
- **Projects**: `mart_projects_delivery`, `mart_projects_burn_rate`
- **CRM**: `mart_crm_pipeline`, `mart_crm_win_rate`
- **Hotlist**: `mart_hotlist_matches`, `mart_hotlist_fill_rate`
- **LMS**: `mart_lms_completions`, `mart_lms_engagement`

### Metrics Layer

Semantic metrics exposed as views:

- `total_ar_open` - Total accounts receivable
- `weighted_pipeline` - CRM pipeline value
- `avg_match_score` - Hotlist match quality
- `course_completion_rate` - LMS completion %

## Multi-Tenant Governance

### Row-Level Security (BigQuery)

\`\`\`sql
CREATE ROW ACCESS POLICY tenant_filter
ON `nino360.mart_finance_ar_open`
GRANT TO ('group:tenant_123@org.com')
FILTER USING (tenant_id = 'TENANT-123');
\`\`\`

### Secure Views (Snowflake)

\`\`\`sql
CREATE SECURE VIEW MART.FINANCE_AR_OPEN_SECURE AS
SELECT * FROM MART.FINANCE_AR_OPEN 
WHERE TENANT_ID = CURRENT_ROLE()::STRING;
\`\`\`

### PII Masking

Use macros for PII fields:

\`\`\`sql
SELECT
  {{ mask_email('email') }} as email,
  {{ mask_phone('phone') }} as phone
FROM mart_hrms_employees
\`\`\`

## Orchestration

### GitHub Actions

Hourly runs for incremental models:

\`\`\`yaml
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
\`\`\`

Daily full refresh at 6 AM IST:

\`\`\`yaml
on:
  schedule:
    - cron: '30 0 * * *'  # 6 AM IST = 12:30 AM UTC
\`\`\`

### Manual Runs

\`\`\`bash
# Run specific models
dbt run --select tag:hourly

# Full refresh
dbt run --full-refresh

# Run tests
dbt test

# Generate docs
dbt docs generate
\`\`\`

## Cost Controls

### BigQuery

- Partition by date: `PARTITION BY DATE(_ingest_ts)`
- Cluster by tenant: `CLUSTER BY tenant_id, id`
- Set query limits: `LIMIT 5000` in app queries
- Use materialized views for frequent queries
- Set table TTL: 90 days for raw changes

### Snowflake

- Auto-suspend warehouses: 5 minutes
- Use result caching
- Avoid `SELECT *`
- Cluster tables by tenant_id
- Use transient tables for staging

## BI Connectors

### Looker Studio

1. Create BigQuery connection
2. Apply row-level security via service account
3. Import prebuilt dashboards from `/warehouse/bi_templates/looker/`

### Metabase

1. Add BigQuery/Snowflake database
2. Import questions from `/warehouse/bi_templates/metabase/`
3. Configure tenant filtering

### Superset

1. Add database connection
2. Import dashboards from `/warehouse/bi_templates/superset/`
3. Configure RLS filters

## Monitoring

### Data Quality Tests

\`\`\`yaml
# tests/schema.yml
models:
  - name: mart_finance_ar_open
    tests:
      - dbt_utils.recency:
          datepart: hour
          field: _last_updated
          interval: 2
\`\`\`

### Freshness Checks

\`\`\`yaml
sources:
  - name: raw
    tables:
      - name: finance_invoices_changes
        freshness:
          warn_after: {count: 30, period: minute}
          error_after: {count: 60, period: minute}
\`\`\`

### Alerting

Failed dbt runs trigger webhooks to Step 9 Automation:

\`\`\`bash
curl -X POST $WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"event":"dbt_failure","message":"Pipeline failed"}'
\`\`\`

## Usage in Application

### Reports Module Integration

\`\`\`tsx
// Enable warehouse in settings
const config = await getWarehouseConfig()

// Query warehouse
const result = await queryWarehouse(`
  SELECT * FROM mart_finance_ar_open
  WHERE tenant_id = 'TENANT-123'
  LIMIT 100
`)

// Get semantic metrics
const metrics = await getWarehouseMetrics('TENANT-123', 'total_ar_open', 'month')
\`\`\`

### AI Copilot Integration

The Copilot can now query warehouse marts:

\`\`\`tsx
// User: "Show me AR aging for this month"
// Copilot generates:
SELECT aging_bucket, SUM(amount_due) as total
FROM mart_finance_ar_open
WHERE tenant_id = @tenant_id
  AND DATE(invoice_date_ist) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
GROUP BY aging_bucket
\`\`\`

## Troubleshooting

### CDC Lag

Check replication slot lag:

\`\`\`sql
SELECT slot_name, confirmed_flush_lsn, pg_current_wal_lsn()
FROM pg_replication_slots;
\`\`\`

### dbt Failures

Check logs:

\`\`\`bash
dbt run --debug
cat logs/dbt.log
\`\`\`

### Query Performance

Analyze query plan:

\`\`\`sql
-- BigQuery
SELECT * FROM `nino360.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
ORDER BY total_bytes_processed DESC;

-- Snowflake
SELECT * FROM TABLE(INFORMATION_SCHEMA.QUERY_HISTORY())
WHERE START_TIME > DATEADD(hour, -1, CURRENT_TIMESTAMP())
ORDER BY TOTAL_ELAPSED_TIME DESC;
\`\`\`

## Next Steps

- **Step 15**: Admin Enhancements (Feature Flags, GenAI Config, API Gateway, System Health)
