import { createClient } from "@/lib/supabase"

export class EdgeFunctionManager {
  private supabase = createClient()

  async invokeFunction(functionName: string, payload?: any, options?: { headers?: Record<string, string> }) {
    try {
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error(`Edge function ${functionName} error:`, error)
      return { data: null, error }
    }
  }

  // AI-powered lead scoring
  async scoreLeads(leads: any[]) {
    return this.invokeFunction("score-leads", { leads })
  }

  // Generate AI insights
  async generateInsights(tenantId: string, module: string) {
    return this.invokeFunction("generate-insights", { tenantId, module })
  }

  // Process bulk data operations
  async processBulkOperation(operation: string, data: any[]) {
    return this.invokeFunction("bulk-processor", { operation, data })
  }

  // Send notifications
  async sendNotification(notification: {
    userId: string
    type: string
    title: string
    message: string
    data?: any
  }) {
    return this.invokeFunction("send-notification", notification)
  }

  // Generate reports
  async generateReport(reportConfig: {
    type: string
    tenantId: string
    dateRange: { start: string; end: string }
    filters?: any
  }) {
    return this.invokeFunction("generate-report", reportConfig)
  }

  // Data synchronization
  async syncExternalData(syncConfig: {
    source: string
    tenantId: string
    credentials: any
    mappings: any
  }) {
    return this.invokeFunction("sync-external-data", syncConfig)
  }

  // Email processing
  async processEmail(emailData: {
    to: string[]
    subject: string
    template: string
    variables: any
  }) {
    return this.invokeFunction("process-email", emailData)
  }

  // Analytics processing
  async processAnalytics(analyticsData: {
    tenantId: string
    events: any[]
    timeframe: string
  }) {
    return this.invokeFunction("process-analytics", analyticsData)
  }
}

// Global edge function manager instance
export const edgeFunctionManager = new EdgeFunctionManager()
