import { createServerClient } from "@/lib/supabase/server"

/**
 * Minimal Google Calendar integration scaffolding
 * - Generate OAuth2 consent URL
 * - Exchange code for tokens and persist to secure storage (Supabase)
 * - Refresh tokens
 * - Create calendar events
 *
 * This file intentionally keeps implementation minimal and well-typed, with
 * TODOs where runtime secrets or secure storage are needed.
 */

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3"

export function getGoogleConsentUrl({ clientId, redirectUri, scope = "https://www.googleapis.com/auth/calendar.events" }: { clientId: string; redirectUri: string; scope?: string }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope,
  })
  return `${GOOGLE_OAUTH_URL}?${params.toString()}`
}

export async function exchangeGoogleCodeForTokens({ clientId, clientSecret, code, redirectUri }: { clientId: string; clientSecret: string; code: string; redirectUri: string }) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  })

  const res = await fetch(GOOGLE_TOKEN_URL, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } })
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`)
  const data = await res.json()
  return data as { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type?: string }
}

export async function refreshGoogleAccessToken({ clientId, clientSecret, refreshToken }: { clientId: string; clientSecret: string; refreshToken: string }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })
  const res = await fetch(GOOGLE_TOKEN_URL, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } })
  if (!res.ok) throw new Error(`Google refresh failed: ${res.status}`)
  return res.json() as Promise<{ access_token: string; expires_in?: number }>
}

export async function createGoogleCalendarEvent({ accessToken, calendarId = "primary", event }: { accessToken: string; calendarId?: string; event: any }) {
  const res = await fetch(`${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  if (!res.ok) throw new Error(`Google create event failed: ${res.status}`)
  return res.json()
}
