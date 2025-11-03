import { createServerClient } from "@/lib/supabase/server"

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  checks: {
    database: boolean
    auth: boolean
  }
  metrics: {
    responseTime: number
    errorRate: number
  }
}

export class HealthCheckService {
  async checkHealth(): Promise<HealthStatus> {
    const start = Date.now()

    const checks = {
      database: await this.checkDatabase(),
      auth: await this.checkAuth(),
    }

    const allHealthy = Object.values(checks).every((check) => check)
    const someHealthy = Object.values(checks).some((check) => check)

    const status: HealthStatus["status"] = allHealthy ? "healthy" : someHealthy ? "degraded" : "unhealthy"

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
      metrics: {
        responseTime: Date.now() - start,
        errorRate: 0, // Calculate from recent metrics
      },
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const supabase = await createServerClient()
      const { error } = await supabase.from("user_profiles").select("id").limit(1)
      return !error
    } catch {
      return false
    }
  }

  private async checkAuth(): Promise<boolean> {
    try {
      const supabase = await createServerClient()
      const { error } = await supabase.auth.getSession()
      return !error
    } catch {
      return false
    }
  }
}

export const healthCheckService = new HealthCheckService()
