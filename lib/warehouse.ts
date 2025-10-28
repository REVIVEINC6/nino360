"use server"

import { createServerClient } from "@/lib/supabase/server"

export type WarehouseConfig = {
  enabled: boolean
  provider: "bigquery" | "snowflake" | "postgres"
  connectionString?: string
  projectId?: string
  dataset?: string
}

export async function getWarehouseConfig(): Promise<WarehouseConfig> {
  const supabase = await createServerClient()

  const { data: config } = await supabase.from("system_config").select("value").eq("key", "warehouse_config").single()

  if (!config?.value) {
    return {
      enabled: false,
      provider: "postgres",
    }
  }

  return config.value as WarehouseConfig
}

export async function queryWarehouse(sql: string, params?: Record<string, any>) {
  const config = await getWarehouseConfig()

  if (!config.enabled || config.provider === "postgres") {
    // Fallback to app database
    const supabase = await createServerClient()
    return supabase.rpc("execute_sql", { sql_query: sql, params })
  }

  // Query warehouse based on provider
  if (config.provider === "bigquery") {
    return queryBigQuery(sql, params, config)
  } else if (config.provider === "snowflake") {
    return querySnowflake(sql, params, config)
  }

  throw new Error(`Unsupported warehouse provider: ${config.provider}`)
}

async function queryBigQuery(sql: string, params: Record<string, any> | undefined, config: WarehouseConfig) {
  // Add query limits for cost control
  const limitedSql = sql.includes("LIMIT") ? sql : `${sql} LIMIT 5000`

  // In production, use @google-cloud/bigquery client
  // For now, return mock structure
  console.log("[v0] BigQuery query:", limitedSql, params)

  return {
    data: [],
    error: null,
  }
}

async function querySnowflake(sql: string, params: Record<string, any> | undefined, config: WarehouseConfig) {
  // Add query limits for cost control
  const limitedSql = sql.includes("LIMIT") ? sql : `${sql} LIMIT 5000`

  // In production, use snowflake-sdk client
  console.log("[v0] Snowflake query:", limitedSql, params)

  return {
    data: [],
    error: null,
  }
}

export async function getWarehouseMetrics(tenantId: string, metric: string, timeGrain = "month") {
  const config = await getWarehouseConfig()

  if (!config.enabled) {
    return { data: null, error: "Warehouse not enabled" }
  }

  // Query semantic metrics layer
  const sql = `
    SELECT 
      date_trunc(timestamp_col, ${timeGrain}) as period,
      ${metric} as value
    FROM metrics.${metric}
    WHERE tenant_id = @tenant_id
    ORDER BY period DESC
    LIMIT 100
  `

  return queryWarehouse(sql, { tenant_id: tenantId })
}
