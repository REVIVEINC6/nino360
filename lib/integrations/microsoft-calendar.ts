import { createServerClient } from "@/lib/supabase/server"

/**
 * Minimal Microsoft Graph (Outlook) calendar integration scaffolding
 * - Generate OAuth2 consent URL
 * - Exchange code for tokens and persist to secure storage (Supabase)
 * - Refresh tokens
 * - Create calendar events via Graph API
 */

const MS_OAUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
const MS_GRAPH_API = "https://graph.microsoft.com/v1.0"

export function getMicrosoftConsentUrl({ clientId, redirectUri, scope = "Calendars.ReadWrite" }: { clientId: string; redirectUri: string; scope?: string }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope,
    prompt: "consent",
  })
  return `${MS_OAUTH_URL}?${params.toString()}`
}

export async function exchangeMicrosoftCodeForTokens({ clientId, clientSecret, code, redirectUri }: { clientId: string; clientSecret: string; code: string; redirectUri: string }) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  })
  const res = await fetch(MS_TOKEN_URL, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } })
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status}`)
  return res.json()
}

export async function refreshMicrosoftAccessToken({ clientId, clientSecret, refreshToken }: { clientId: string; clientSecret: string; refreshToken: string }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })
  const res = await fetch(MS_TOKEN_URL, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } })
  if (!res.ok) throw new Error(`Microsoft refresh failed: ${res.status}`)
  return res.json()
}

export async function createMicrosoftCalendarEvent({ accessToken, calendarId = "calendar", event }: { accessToken: string; calendarId?: string; event: any }) {
  const res = await fetch(`${MS_GRAPH_API}/me/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  if (!res.ok) throw new Error(`Microsoft create event failed: ${res.status}`)
  return res.json()
}
