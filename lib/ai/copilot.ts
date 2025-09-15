import { OpenAI } from "openai"
import { supabaseAdmin } from "@/lib/supabase/client"

let openai: any
if (!process.env.OPENAI_API_KEY) {
  // build-time stub that returns empty/harmless responses
  openai = {
    chat: {
      completions: {
        create: async () => ({ choices: [{ message: { content: "[]" } }] }),
      },
    },
  }
} else {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
}

export interface AIInsight {
  type: "optimization" | "prediction" | "recommendation" | "alert"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high" | "critical"
  recommendations: string[]
  estimatedValue?: number
  category: string
}

export class AICopilot {
  async generateInsights(tenantId: string): Promise<AIInsight[]> {
    try {
      // Fetch tenant data for analysis
      const { data: metrics } = await supabaseAdmin
        .from("system_metrics")
        .select("*")
        .eq("tenant_id", tenantId)
        .gte("recorded_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      const { data: users } = await supabaseAdmin.from("users").select("*").eq("tenant_id", tenantId)

      // Generate AI insights using GPT-4
      const prompt = `
        Analyze the following tenant data and generate actionable insights:
        
        Metrics: ${JSON.stringify(metrics)}
  Users: ${JSON.stringify(users?.map((u: any) => ({ role: u.role, active: u.is_active, lastLogin: u.last_login })))}
        
        Generate insights for:
        1. Performance optimization opportunities
        2. Security recommendations
        3. Cost optimization
        4. User engagement improvements
        5. Predictive analytics
        
        Return as JSON array with type, title, description, confidence (0-1), impact (low/medium/high/critical), and recommendations array.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant specialized in SaaS platform optimization and analytics. Provide actionable, data-driven insights.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })

      const insights = JSON.parse(completion.choices[0].message.content || "[]") as AIInsight[]

      // Store insights in database
      for (const insight of insights) {
        await supabaseAdmin.from("ai_insights").insert({
          tenant_id: tenantId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          impact: insight.impact,
          status: "active",
          metadata: {
            recommendations: insight.recommendations,
            estimatedValue: insight.estimatedValue,
            category: insight.category,
          },
        })
      }

      return insights
    } catch (error) {
      console.error("Error generating AI insights:", error)
      return []
    }
  }

  async chatWithCopilot(message: string, context: Record<string, any>): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for the Nino360 platform. Help users with platform management, analytics, and optimization. Context: ${JSON.stringify(context)}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      return completion.choices[0].message.content || "I apologize, but I could not process your request."
    } catch (error) {
      console.error("Error in AI chat:", error)
      return "I encountered an error processing your request. Please try again."
    }
  }

  async generatePredictions(tenantId: string, type: "revenue" | "churn" | "growth"): Promise<any> {
    try {
      // Fetch historical data
      const { data: historicalData } = await supabaseAdmin.rpc("get_tenant_metrics", {
        tenant_id: tenantId,
        time_range: "90d",
      })

      const prompt = `
        Based on this historical data, generate ${type} predictions for the next 3 months:
        ${JSON.stringify(historicalData)}
        
        Provide monthly predictions with confidence intervals and key factors influencing the forecast.
        Return as JSON with predictions array containing month, value, confidence, and factors.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a predictive analytics AI specialized in SaaS metrics forecasting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      })

      return JSON.parse(completion.choices[0].message.content || "{}")
    } catch (error) {
      console.error("Error generating predictions:", error)
      return null
    }
  }
}

export const aiCopilot = new AICopilot()
