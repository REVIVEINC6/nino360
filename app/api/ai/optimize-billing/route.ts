import { type NextRequest, NextResponse } from "next/server"
import { advancedAI } from "@/lib/ai/advanced-ai"
import { rpa } from "@/lib/rpa/automation-service"
import type { APIResponse } from "@/lib/api-response"

type OptimizeBillingSuccess = {
  potentialSavings: number
  recommendations: unknown
  implementationEffort: unknown
  automationTaskId: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tenantId } = body

    if (!tenantId || typeof tenantId !== "string") {
      return NextResponse.json<APIResponse>({
        success: false,
        error: "Invalid tenantId",
      }, { status: 400 })
    }

    // Use AI to analyze and optimize billing
    const optimization = await advancedAI.optimizeResources(tenantId)

    // Create RPA task for implementing optimizations
    const automationTask = await rpa.createTask({
      name: `Billing Optimization - ${tenantId}`,
      type: "billing_optimization",
      priority: "high",
      parameters: {
        tenantId,
        optimizations: optimization.recommendations,
        potentialSavings: optimization.potentialSavings,
      },
    })

    // Execute the optimization task
    await rpa.executeTask(automationTask.id)

    return NextResponse.json<APIResponse<OptimizeBillingSuccess>>({
      success: true,
      potentialSavings: optimization.potentialSavings,
      recommendations: optimization.recommendations,
      implementationEffort: optimization.implementationEffort,
      automationTaskId: automationTask.id,
      message: "AI optimization analysis complete with RPA implementation started",
    })
  } catch (error) {
    console.error("Error optimizing billing:", error)
    return NextResponse.json<APIResponse>({ success: false, error: "Failed to optimize billing" }, { status: 500 })
  }
}
