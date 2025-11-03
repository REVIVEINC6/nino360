import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export interface DeviceFingerprint {
  id: string
  userAgent: string
  ipAddress: string
  platform?: string
  language?: string
  timezone?: string
  screenResolution?: string
  hash: string
}

export async function generateDeviceFingerprint(clientData?: Partial<DeviceFingerprint>): Promise<string> {
  const headersList = await headers()

  const fingerprintData = {
    userAgent: clientData?.userAgent || headersList.get("user-agent") || "unknown",
    ipAddress: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown",
    platform: clientData?.platform,
    language: clientData?.language || headersList.get("accept-language"),
    timezone: clientData?.timezone,
    screenResolution: clientData?.screenResolution,
  }

  const fingerprintString = JSON.stringify(fingerprintData, Object.keys(fingerprintData).sort())
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(fingerprintString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function registerDevice(
  userId: string,
  deviceData: {
    deviceName?: string
    deviceType: "web" | "mobile" | "tablet" | "desktop"
    osName?: string
    osVersion?: string
    browserName?: string
    browserVersion?: string
    fingerprint?: string
  },
) {
  const supabase = await createServerClient()
  const headersList = await headers()

  const fingerprint = deviceData.fingerprint || (await generateDeviceFingerprint())

  // Check if device already exists
  const { data: existing } = await supabase
    .from("user_devices")
    .select("id")
    .eq("user_id", userId)
    .eq("fingerprint", fingerprint)
    .single()

  if (existing) {
    // Update last seen
    await supabase
      .from("user_devices")
      .update({
        last_seen_at: new Date().toISOString(),
        last_ip: headersList.get("x-forwarded-for") || "unknown",
      })
      .eq("id", existing.id)

    return existing.id
  }

  // Register new device
  const { data, error } = await supabase
    .from("user_devices")
    .insert({
      user_id: userId,
      device_name: deviceData.deviceName || "Unknown Device",
      device_type: deviceData.deviceType,
      os_name: deviceData.osName,
      os_version: deviceData.osVersion,
      browser_name: deviceData.browserName,
      browser_version: deviceData.browserVersion,
      fingerprint,
      last_ip: headersList.get("x-forwarded-for") || "unknown",
      trusted: false,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] Failed to register device:", error)
    throw error
  }

  return data.id
}

export async function verifyDevice(userId: string, fingerprint: string): Promise<boolean> {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("user_devices")
    .select("trusted")
    .eq("user_id", userId)
    .eq("fingerprint", fingerprint)
    .single()

  return data?.trusted || false
}

export async function trustDevice(userId: string, deviceId: string) {
  const supabase = await createServerClient()

  await supabase.from("user_devices").update({ trusted: true }).eq("id", deviceId).eq("user_id", userId)
}

export async function getUserDevices(userId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("user_devices")
    .select("*")
    .eq("user_id", userId)
    .order("last_seen_at", { ascending: false })

  if (error) throw error

  return data
}

export async function revokeDevice(userId: string, deviceId: string) {
  const supabase = await createServerClient()

  // Revoke all sessions for this device
  await supabase.from("user_sessions").update({ revoked: true }).eq("user_id", userId).eq("device_id", deviceId)

  // Delete device
  await supabase.from("user_devices").delete().eq("id", deviceId).eq("user_id", userId)
}

export async function getDeviceFingerprint(clientData?: Partial<DeviceFingerprint>): Promise<string> {
  return generateDeviceFingerprint(clientData)
}

export const DeviceFingerprintService = {
  generateDeviceFingerprint,
  getDeviceFingerprint,
  registerDevice,
  verifyDevice,
  trustDevice,
  getUserDevices,
  revokeDevice,
}
