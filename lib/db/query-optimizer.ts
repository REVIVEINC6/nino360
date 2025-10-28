import { createClient } from "@/lib/supabase/server"

/**
 * Query optimization utilities
 */
export const queryOptimizer = {
  /**
   * Execute query with connection pooling
   */
  async executeQuery<T>(query: (client: any) => Promise<T>): Promise<T> {
    const supabase = await createClient()
    return query(supabase)
  },

  /**
   * Batch queries for efficiency
   */
  async batchQuery<T>(queries: Array<(client: any) => Promise<T>>): Promise<T[]> {
    const supabase = await createClient()
    return Promise.all(queries.map((query) => query(supabase)))
  },

  /**
   * Execute query with retry logic
   */
  async executeWithRetry<T>(query: (client: any) => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: Error | null = null

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.executeQuery(query)
      } catch (error) {
        lastError = error as Error
        console.error(`[Query] Attempt ${i + 1} failed:`, error)

        // Exponential backoff
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
        }
      }
    }

    throw lastError || new Error("Query failed after retries")
  },
}

/**
 * Query builder for common patterns
 */
export class QueryBuilder {
  private table: string
  private selectFields: string[] = ["*"]
  private whereConditions: Array<{ field: string; operator: string; value: any }> = []
  private orderByFields: Array<{ field: string; ascending: boolean }> = []
  private limitValue?: number
  private offsetValue?: number

  constructor(table: string) {
    this.table = table
  }

  select(...fields: string[]): this {
    this.selectFields = fields
    return this
  }

  where(field: string, operator: string, value: any): this {
    this.whereConditions.push({ field, operator, value })
    return this
  }

  orderBy(field: string, ascending = true): this {
    this.orderByFields.push({ field, ascending })
    return this
  }

  limit(value: number): this {
    this.limitValue = value
    return this
  }

  offset(value: number): this {
    this.offsetValue = value
    return this
  }

  async execute<T>(): Promise<T[]> {
    const supabase = await createClient()
    let query = supabase.from(this.table).select(this.selectFields.join(","))

    // Apply where conditions
    for (const condition of this.whereConditions) {
      query = query.filter(condition.field, condition.operator, condition.value)
    }

    // Apply ordering
    for (const order of this.orderByFields) {
      query = query.order(order.field, { ascending: order.ascending })
    }

    // Apply pagination
    if (this.limitValue) {
      query = query.limit(this.limitValue)
    }
    if (this.offsetValue) {
      query = query.range(this.offsetValue, this.offsetValue + (this.limitValue || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data as T[]
  }
}
