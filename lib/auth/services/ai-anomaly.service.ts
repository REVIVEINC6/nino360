import { createServerClient } from "@/lib/supabase/server"

interface DetectAnomaliesInput {
  userId: string
  eventType: string
  metadata?: Record<string, any>
}

/**
 * Detect anomalies in user behavior using simple heuristics
 * In production, this would use ML models
 */
export async function detectAnomalies(input: DetectAnomaliesInput): Promise<void> {
  try {
    const supabase = await createServerClient()

    // Get recent events for this user
    const { data: recentEvents } = await supabase
      .from("security_events")
      .select("*")
      .eq("user_id", input.userId)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (!recentEvents || recentEvents.length === 0) return

    // Simple anomaly detection heuristics
    const anomalies: string[] = []

    // Check for rapid login attempts
    const loginEvents = recentEvents.filter((e) => e.event_type === "login_success" || e.event_type === "login_failed")
    if (loginEvents.length > 10) {
      anomalies.push("rapid_login_attempts")
    }

    // Check for multiple failed logins
    const failedLogins = recentEvents.filter((e) => e.event_type === "login_failed")
    if (failedLogins.length > 5) {
      anomalies.push("multiple_failed_logins")
    }

    // Check for login from new location (simplified)
    if (input.metadata?.ipAddress) {
      const previousIPs = recentEvents.map((e) => e.ip_address).filter(Boolean)

      if (previousIPs.length > 0 && !previousIPs.includes(input.metadata.ipAddress)) {
        anomalies.push("new_location")
      }
    }

    // Log anomalies if detected
    if (anomalies.length > 0) {
      await supabase.from("security_events").insert({
        user_id: input.userId,
        event_type: "anomaly_detected",
        severity: "warning",
        metadata: {
          anomalies,
          original_event: input.eventType,
          ...input.metadata,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Anomaly detection error:", error)
    // Don't throw - anomaly detection failures shouldn't break the main flow
  }
}

/**
 * Calculate risk score for a user action
 */
export async function calculateRiskScore(userId: string, eventType: string): Promise<number> {
  try {
    const supabase = await createServerClient()

    // Get recent security events
    const { data: events } = await supabase
      .from("security_events")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (!events) return 0

    let riskScore = 0

    // Increase risk for failed logins
    const failedLogins = events.filter((e) => e.event_type === "login_failed").length
    riskScore += failedLogins * 10

    // Increase risk for anomalies
    const anomalies = events.filter((e) => e.event_type === "anomaly_detected").length
    riskScore += anomalies * 20

    // Cap at 100
    return Math.min(100, riskScore)
  } catch (error) {
    console.error("[v0] Calculate risk score error:", error)
    return 0
  }
}
