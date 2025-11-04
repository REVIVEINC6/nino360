import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { logSecurityEvent } from "./audit-logger"

export interface AnomalyDetectionResult {
  isAnomaly: boolean
  riskScore: number
  reasons: string[]
  recommendations: string[]
}

export async function detectLoginAnomaly(
  userId: string,
  loginData: {
    ipAddress: string
    userAgent: string
    location?: { country?: string; city?: string }
    deviceFingerprint: string
  },
): Promise<AnomalyDetectionResult> {
  const supabase = await createServerClient()

  // Get user's login history
  const { data: loginHistory } = await supabase
    .from("audit_logs")
    .select("ip_address, user_agent, metadata, created_at")
    .eq("user_id", userId)
    .eq("action", "user.login")
    .eq("success", true)
    .order("created_at", { ascending: false })
    .limit(50)

  // Get user's devices
  const { data: devices } = await supabase.from("user_devices").select("fingerprint, trusted").eq("user_id", userId)

  const anomalyFactors: string[] = []
  let riskScore = 0

  // Check for new device
  const isNewDevice = !devices?.some((d) => d.fingerprint === loginData.deviceFingerprint)
  if (isNewDevice) {
    anomalyFactors.push("Login from new device")
    riskScore += 30
  }

  // Check for new IP
  const recentIPs = loginHistory?.map((l) => l.ip_address) || []
  const isNewIP = !recentIPs.includes(loginData.ipAddress)
  if (isNewIP) {
    anomalyFactors.push("Login from new IP address")
    riskScore += 20
  }

  // Check for unusual time
  const currentHour = new Date().getHours()
  const recentLoginHours = loginHistory?.map((l) => new Date(l.created_at).getHours()) || []
  const avgLoginHour = recentLoginHours.reduce((a, b) => a + b, 0) / recentLoginHours.length
  if (Math.abs(currentHour - avgLoginHour) > 6) {
    anomalyFactors.push("Login at unusual time")
    riskScore += 15
  }

  // Check for impossible travel
  if (loginHistory && loginHistory.length > 0) {
    const lastLogin = loginHistory[0]
    const timeDiff = Date.now() - new Date(lastLogin.created_at).getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff < 1 && lastLogin.ip_address !== loginData.ipAddress) {
      anomalyFactors.push("Impossible travel detected")
      riskScore += 50
    }
  }

  // Use AI for advanced pattern analysis
  if (loginHistory && loginHistory.length >= 10) {
    const aiAnalysis = await analyzeLoginPatternWithAI(userId, loginHistory, loginData)
    if (aiAnalysis.isAnomaly) {
      anomalyFactors.push(...aiAnalysis.reasons)
      riskScore += aiAnalysis.riskScore
    }
  }

  const isAnomaly = riskScore >= 50

  if (isAnomaly) {
    await logSecurityEvent({
      userId,
      eventType: "anomaly_detected",
      severity: riskScore >= 70 ? "high" : "medium",
      ipAddress: loginData.ipAddress,
      metadata: {
        riskScore,
        factors: anomalyFactors,
        deviceFingerprint: loginData.deviceFingerprint,
      },
    })
  }

  return {
    isAnomaly,
    riskScore: Math.min(100, riskScore),
    reasons: anomalyFactors,
    recommendations: generateRecommendations(riskScore, anomalyFactors),
  }
}

async function analyzeLoginPatternWithAI(
  userId: string,
  loginHistory: any[],
  currentLogin: any,
): Promise<{ isAnomaly: boolean; riskScore: number; reasons: string[] }> {
  try {
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      prompt: `Analyze this login attempt for anomalies:

User ID: ${userId}
Current Login:
- IP: ${currentLogin.ipAddress}
- User Agent: ${currentLogin.userAgent}
- Location: ${JSON.stringify(currentLogin.location)}
- Time: ${new Date().toISOString()}

Recent Login History (last 50 logins):
${loginHistory.map((l, i) => `${i + 1}. IP: ${l.ip_address}, Time: ${l.created_at}`).join("\n")}

Analyze patterns and identify any anomalies. Respond in JSON format:
{
  "isAnomaly": boolean,
  "riskScore": number (0-50),
  "reasons": string[]
}`,
      temperature: 0.3,
    })

    const analysis = JSON.parse(text)
    return analysis
  } catch (error) {
    console.error("[v0] AI anomaly detection failed:", error)
    return { isAnomaly: false, riskScore: 0, reasons: [] }
  }
}

function generateRecommendations(riskScore: number, factors: string[]): string[] {
  const recommendations: string[] = []

  if (riskScore >= 70) {
    recommendations.push("Require additional verification (MFA)")
    recommendations.push("Send security alert to user email")
    recommendations.push("Temporarily lock account pending verification")
  } else if (riskScore >= 50) {
    recommendations.push("Require MFA verification")
    recommendations.push("Send notification to user")
  } else if (riskScore >= 30) {
    recommendations.push("Monitor session closely")
    recommendations.push("Consider sending notification")
  }

  if (factors.includes("Login from new device")) {
    recommendations.push("Prompt user to trust this device")
  }

  if (factors.includes("Impossible travel detected")) {
    recommendations.push("Verify user identity immediately")
  }

  return recommendations
}

export async function detectAccountTakeoverAttempt(userId: string): Promise<boolean> {
  const supabase = await createServerClient()

  // Check for multiple failed login attempts
  const { data: failedAttempts } = await supabase
    .from("audit_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("action", "user.login")
    .eq("success", false)
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())

  if (failedAttempts && failedAttempts.length >= 10) {
    await logSecurityEvent({
      userId,
      eventType: "account_takeover_attempt",
      severity: "critical",
      metadata: { failedAttempts: failedAttempts.length },
    })
    return true
  }

  return false
}

export async function detectAnomalies(data: {
  userId: string
  eventType: string
  metadata?: any
}): Promise<AnomalyDetectionResult> {
  if (data.eventType === "login") {
    return detectLoginAnomaly(data.userId, data.metadata)
  }
  return {
    isAnomaly: false,
    riskScore: 0,
    reasons: [],
    recommendations: [],
  }
}

export const AIAnomalyDetectionService = {
  detectLoginAnomaly,
  detectAccountTakeoverAttempt,
  detectAnomalies,
}
