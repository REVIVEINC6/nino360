import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

// Rule schema
const RuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  module: z.enum(["crm", "talent", "hrms", "finance", "bench", "vms", "projects", "hotlist", "training"]),
  trigger: z.object({
    event: z.string(), // e.g., 'record.created', 'record.updated', 'field.changed'
    entity: z.string(), // e.g., 'lead', 'candidate', 'employee'
    conditions: z.array(
      z.object({
        field: z.string(),
        operator: z.enum([
          "equals",
          "not_equals",
          "contains",
          "not_contains",
          "greater_than",
          "less_than",
          "in",
          "not_in",
        ]),
        value: z.any(),
      }),
    ),
  }),
  actions: z.array(
    z.object({
      type: z.enum([
        "update_field",
        "send_email",
        "send_notification",
        "create_task",
        "webhook",
        "assign_to",
        "change_status",
      ]),
      config: z.record(z.any()),
    }),
  ),
  enabled: z.boolean(),
  priority: z.number(),
})

type Rule = z.infer<typeof RuleSchema>

export class RuleEngine {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  // Evaluate if a rule should fire
  async evaluateRule(rule: Rule, record: any): Promise<boolean> {
    const { conditions } = rule.trigger

    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(record, condition.field)
      const conditionMet = this.evaluateCondition(fieldValue, condition.operator, condition.value)

      if (!conditionMet) {
        return false
      }
    }

    return true
  }

  // Execute rule actions
  async executeRule(rule: Rule, record: any): Promise<void> {
    console.log(`[v0] Executing rule: ${rule.name}`)

    for (const action of rule.actions) {
      try {
        await this.executeAction(action, record, rule)
      } catch (error) {
        console.error(`[v0] Error executing action ${action.type}:`, error)
        // Log to automation_logs table
        await this.supabase.from("automation_logs").insert({
          rule_id: rule.id,
          action_type: action.type,
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error",
          record_id: record.id,
          record_type: rule.trigger.entity,
        })
      }
    }
  }

  // Execute individual action
  private async executeAction(action: any, record: any, rule: Rule): Promise<void> {
    switch (action.type) {
      case "update_field":
        await this.updateField(record, action.config, rule)
        break
      case "send_email":
        await this.sendEmail(record, action.config, rule)
        break
      case "send_notification":
        await this.sendNotification(record, action.config, rule)
        break
      case "create_task":
        await this.createTask(record, action.config, rule)
        break
      case "webhook":
        await this.callWebhook(record, action.config, rule)
        break
      case "assign_to":
        await this.assignTo(record, action.config, rule)
        break
      case "change_status":
        await this.changeStatus(record, action.config, rule)
        break
      default:
        console.warn(`[v0] Unknown action type: ${action.type}`)
    }
  }

  // Action implementations
  private async updateField(record: any, config: any, rule: Rule): Promise<void> {
    const { table, field, value } = config
    await this.supabase
      .from(table)
      .update({ [field]: value })
      .eq("id", record.id)
  }

  private async sendEmail(record: any, config: any, rule: Rule): Promise<void> {
    // Queue email for sending
    await this.supabase.from("automation_email_queue").insert({
      to: config.to || record.email,
      subject: this.interpolate(config.subject, record),
      body: this.interpolate(config.body, record),
      template: config.template,
      rule_id: rule.id,
    })
  }

  private async sendNotification(record: any, config: any, rule: Rule): Promise<void> {
    await this.supabase.from("notifications").insert({
      user_id: config.user_id || record.assigned_to,
      title: this.interpolate(config.title, record),
      message: this.interpolate(config.message, record),
      type: config.notification_type || "info",
      link: config.link,
      rule_id: rule.id,
    })
  }

  private async createTask(record: any, config: any, rule: Rule): Promise<void> {
    await this.supabase.from("tasks").insert({
      title: this.interpolate(config.title, record),
      description: this.interpolate(config.description, record),
      assigned_to: config.assigned_to || record.assigned_to,
      due_date: config.due_date,
      priority: config.priority || "medium",
      related_to: record.id,
      related_type: rule.trigger.entity,
    })
  }

  private async callWebhook(record: any, config: any, rule: Rule): Promise<void> {
    const response = await fetch(config.url, {
      method: config.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify({
        event: rule.trigger.event,
        entity: rule.trigger.entity,
        record,
        rule_id: rule.id,
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }
  }

  private async assignTo(record: any, config: any, rule: Rule): Promise<void> {
    const table = this.getTableName(rule.trigger.entity)
    await this.supabase.from(table).update({ assigned_to: config.user_id }).eq("id", record.id)
  }

  private async changeStatus(record: any, config: any, rule: Rule): Promise<void> {
    const table = this.getTableName(rule.trigger.entity)
    await this.supabase.from(table).update({ status: config.status }).eq("id", record.id)
  }

  // Helper methods
  private evaluateCondition(fieldValue: any, operator: string, value: any): boolean {
    switch (operator) {
      case "equals":
        return fieldValue === value
      case "not_equals":
        return fieldValue !== value
      case "contains":
        return String(fieldValue).includes(String(value))
      case "not_contains":
        return !String(fieldValue).includes(String(value))
      case "greater_than":
        return Number(fieldValue) > Number(value)
      case "less_than":
        return Number(fieldValue) < Number(value)
      case "in":
        return Array.isArray(value) && value.includes(fieldValue)
      case "not_in":
        return Array.isArray(value) && !value.includes(fieldValue)
      default:
        return false
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj)
  }

  private interpolate(template: string, record: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => record[key] || "")
  }

  private getTableName(entity: string): string {
    const tableMap: Record<string, string> = {
      lead: "crm_leads",
      contact: "crm_contacts",
      opportunity: "crm_opportunities",
      candidate: "ats_candidates",
      job: "ats_job_requisitions",
      employee: "hrms_employees",
      invoice: "finance_invoices",
      // Add more mappings as needed
    }
    return tableMap[entity] || entity
  }
}

// Server action to trigger rule evaluation
export async function evaluateRulesForEvent(module: string, event: string, entity: string, record: any) {
  "use server"

  try {
    const supabase = await createServerClient()

    // Fetch active rules for this event
    const { data: rules } = await supabase
      .from("automation_rules")
      .select("*")
      .eq("module", module)
      .eq("enabled", true)
      .eq("trigger->event", event)
      .eq("trigger->entity", entity)
      .order("priority", { ascending: false })

    if (!rules || rules.length === 0) {
      return { success: true, rulesExecuted: 0 }
    }

    const engine = new RuleEngine(supabase)
    let executedCount = 0

    for (const rule of rules) {
      const shouldExecute = await engine.evaluateRule(rule, record)
      if (shouldExecute) {
        await engine.executeRule(rule, record)
        executedCount++
      }
    }

    return { success: true, rulesExecuted: executedCount }
  } catch (error) {
    console.error("[v0] Rule evaluation error:", error)
    return { success: false, error: "Failed to evaluate rules" }
  }
}
