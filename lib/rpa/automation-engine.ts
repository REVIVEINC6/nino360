import { supabaseAdmin } from "@/lib/supabase/client"
import { aiCopilot } from "@/lib/ai/copilot"

export interface AutomationRule {
  id: string
  name: string
  trigger: "schedule" | "event" | "condition"
  conditions: Record<string, any>
  actions: AutomationAction[]
  enabled: boolean
  tenantId: string
}

export interface AutomationAction {
  type: "email" | "webhook" | "database" | "ai_analysis" | "report_generation"
  config: Record<string, any>
}

export class RPAEngine {
  private runningJobs = new Map<string, NodeJS.Timeout>()

  async createAutomation(rule: Omit<AutomationRule, "id">): Promise<string> {
    const { data, error } = await supabaseAdmin.from("automation_rules").insert(rule).select("id").single()

    if (error) throw error

    if (rule.enabled) {
      // scheduleAutomation expects a full AutomationRule including id
      const fullRule: AutomationRule = { ...(rule as AutomationRule), id: data.id }
      this.scheduleAutomation(data.id, fullRule)
    }

    return data.id
  }

  async scheduleAutomation(ruleId: string, rule: AutomationRule): Promise<void> {
    if (rule.trigger === "schedule") {
      const interval = this.parseSchedule(rule.conditions.schedule)
      const job = setInterval(async () => {
        await this.executeAutomation(ruleId, rule)
      }, interval)

      this.runningJobs.set(ruleId, job)
    }
  }

  async executeAutomation(ruleId: string, rule: AutomationRule): Promise<void> {
    try {
      console.log(`Executing automation: ${rule.name}`)

      for (const action of rule.actions) {
        await this.executeAction(action, rule.tenantId)
      }

      // Log execution
      await supabaseAdmin.from("automation_logs").insert({
        rule_id: ruleId,
        tenant_id: rule.tenantId,
        status: "success",
        executed_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Automation execution failed for ${rule.name}:`, error)

      await supabaseAdmin.from("automation_logs").insert({
        rule_id: ruleId,
        tenant_id: rule.tenantId,
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        executed_at: new Date().toISOString(),
      })
    }
  }

  private async executeAction(action: AutomationAction, tenantId: string): Promise<void> {
    switch (action.type) {
      case "ai_analysis":
        await aiCopilot.generateInsights(tenantId)
        break

      case "report_generation":
        await this.generateAutomatedReport(tenantId, action.config)
        break

      case "database":
        await this.executeDatabaseAction(action.config)
        break

      case "webhook":
        await this.callWebhook(action.config)
        break

      case "email":
        await this.sendEmail(action.config)
        break
    }
  }

  private async generateAutomatedReport(tenantId: string, config: any): Promise<void> {
    // Generate and store automated reports
    const { data: metrics } = await supabaseAdmin.rpc("get_tenant_metrics", {
      tenant_id: tenantId,
      time_range: config.timeRange || "30d",
    })

    const report = {
      tenant_id: tenantId,
      report_type: config.reportType,
      data: metrics,
      generated_at: new Date().toISOString(),
    }

    await supabaseAdmin.from("automated_reports").insert(report)
  }

  private async executeDatabaseAction(config: any): Promise<void> {
    // Execute database operations
    const { query, params } = config
    await supabaseAdmin.rpc(query, params)
  }

  private async callWebhook(config: any): Promise<void> {
    const response = await fetch(config.url, {
      method: config.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(config.payload),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }
  }

  private async sendEmail(config: any): Promise<void> {
    // Integration with email service (SendGrid, etc.)
    console.log("Sending email:", config)
  }

  private parseSchedule(schedule: string): number {
    // Parse cron-like schedule to milliseconds
    const scheduleMap: Record<string, number> = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    }

    return scheduleMap[schedule] || 60 * 60 * 1000 // Default to hourly
  }

  async stopAutomation(ruleId: string): Promise<void> {
    const job = this.runningJobs.get(ruleId)
    if (job) {
      clearInterval(job)
      this.runningJobs.delete(ruleId)
    }
  }
}

export const rpaEngine = new RPAEngine()
