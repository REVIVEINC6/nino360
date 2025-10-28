import { createClient } from "@supabase/supabase-js"
import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"
import * as Device from "expo-device"
import * as Application from "expo-application"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Supabase client with secure storage
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key)
      },
      setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value)
      },
      removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key)
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export interface MobileAuthResult {
  success: boolean
  user?: any
  session?: any
  error?: string
  requiresMFA?: boolean
  requiresEmailVerification?: boolean
}

export interface DeviceInfo {
  deviceId: string
  deviceName: string | null
  osName: string | null
  osVersion: string | null
  modelName: string | null
  brand: string | null
  appVersion: string
}

// Get device fingerprint
export async function getDeviceFingerprint(): Promise<DeviceInfo> {
  const deviceId = Device.osName === "Android" ? Application.getAndroidId() : await Application.getIosIdForVendorAsync()

  return {
    deviceId: deviceId || "unknown",
    deviceName: Device.deviceName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    modelName: Device.modelName,
    brand: Device.brand,
    appVersion: Application.nativeApplicationVersion || "1.0.0",
  }
}

// Register device
export async function registerDevice(userId: string): Promise<void> {
  const deviceInfo = await getDeviceFingerprint()
  const pushToken = await getPushToken()

  const { error } = await supabase.from("auth_mobile_devices").upsert({
    user_id: userId,
    device_id: deviceInfo.deviceId,
    device_name: deviceInfo.deviceName,
    device_type: deviceInfo.osName,
    os_version: deviceInfo.osVersion,
    app_version: deviceInfo.appVersion,
    push_token: pushToken,
    is_trusted: false,
    last_used_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error registering device:", error)
  }
}

// Login with email and password
export async function mobileLogin(email: string, password: string): Promise<MobileAuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user || !data.session) {
      return { success: false, error: "Authentication failed" }
    }

    // Register device
    await registerDevice(data.user.id)

    // Check if MFA is required
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("mfa_enabled, email_verified")
      .eq("user_id", data.user.id)
      .single()

    if (profile?.mfa_enabled) {
      return {
        success: false,
        requiresMFA: true,
        user: data.user,
      }
    }

    if (!profile?.email_verified) {
      return {
        success: false,
        requiresEmailVerification: true,
        user: data.user,
      }
    }

    // Store session offline
    await storeOfflineSession(data.session)

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Verify MFA code
export async function verifyMFACode(userId: string, code: string): Promise<MobileAuthResult> {
  try {
    const { data, error } = await supabase.rpc("verify_mfa_code", {
      p_user_id: userId,
      p_code: code,
    })

    if (error || !data) {
      return { success: false, error: "Invalid MFA code" }
    }

    const { data: sessionData } = await supabase.auth.getSession()

    if (sessionData.session) {
      await storeOfflineSession(sessionData.session)
    }

    return {
      success: true,
      session: sessionData.session,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Biometric authentication
export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  return hasHardware && isEnrolled
}

export async function enableBiometricAuth(): Promise<boolean> {
  const available = await isBiometricAvailable()

  if (!available) {
    return false
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Enable biometric authentication",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  })

  if (result.success) {
    await SecureStore.setItemAsync("biometric_enabled", "true")
    return true
  }

  return false
}

export async function authenticateWithBiometric(): Promise<MobileAuthResult> {
  try {
    const enabled = await SecureStore.getItemAsync("biometric_enabled")

    if (enabled !== "true") {
      return { success: false, error: "Biometric authentication not enabled" }
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    })

    if (!result.success) {
      return { success: false, error: "Biometric authentication failed" }
    }

    // Get stored session
    const session = await getOfflineSession()

    if (!session) {
      return { success: false, error: "No stored session found" }
    }

    // Refresh session
    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Push notifications
export async function getPushToken(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      return null
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    })

    return token.data
  } catch (error) {
    console.error("[v0] Error getting push token:", error)
    return null
  }
}

export async function sendSecurityAlert(userId: string, title: string, message: string, data?: any): Promise<void> {
  try {
    // Get user's push token
    const { data: device } = await supabase
      .from("auth_mobile_devices")
      .select("push_token")
      .eq("user_id", userId)
      .order("last_used_at", { ascending: false })
      .limit(1)
      .single()

    if (!device?.push_token) {
      return
    }

    // Send push notification via API
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: device.push_token,
        title,
        body: message,
        data,
        priority: "high",
        sound: "default",
      }),
    })
  } catch (error) {
    console.error("[v0] Error sending security alert:", error)
  }
}

// Offline support
export async function storeOfflineSession(session: any): Promise<void> {
  try {
    await AsyncStorage.setItem("offline_session", JSON.stringify(session))
    await AsyncStorage.setItem("offline_session_timestamp", Date.now().toString())
  } catch (error) {
    console.error("[v0] Error storing offline session:", error)
  }
}

export async function getOfflineSession(): Promise<any | null> {
  try {
    const sessionStr = await AsyncStorage.getItem("offline_session")
    const timestamp = await AsyncStorage.getItem("offline_session_timestamp")

    if (!sessionStr || !timestamp) {
      return null
    }

    // Check if session is expired (7 days)
    const sessionAge = Date.now() - Number.parseInt(timestamp)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

    if (sessionAge > maxAge) {
      await clearOfflineSession()
      return null
    }

    return JSON.parse(sessionStr)
  } catch (error) {
    console.error("[v0] Error getting offline session:", error)
    return null
  }
}

export async function clearOfflineSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem("offline_session")
    await AsyncStorage.removeItem("offline_session_timestamp")
  } catch (error) {
    console.error("[v0] Error clearing offline session:", error)
  }
}

// Logout
export async function mobileLogout(): Promise<void> {
  try {
    await supabase.auth.signOut()
    await clearOfflineSession()
    await SecureStore.deleteItemAsync("biometric_enabled")
  } catch (error) {
    console.error("[v0] Error during logout:", error)
  }
}

// Session refresh
export async function refreshSession(): Promise<MobileAuthResult> {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.session) {
      await storeOfflineSession(data.session)
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// OAuth login (Google, Facebook, etc.)
export async function mobileOAuthLogin(provider: "google" | "facebook" | "github") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.EXPO_PUBLIC_APP_URL}/auth/callback`,
      skipBrowserRedirect: false,
    },
  })

  return { data, error }
}

export { supabase }
