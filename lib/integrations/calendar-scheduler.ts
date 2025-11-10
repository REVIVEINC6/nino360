/**
 * Small scheduler adapter that can create events using provider helper functions.
 * Providers should expose:
 * - createEvent({ accessToken, calendarId, event }) => Promise<any>
 * - refresh access token helpers where necessary
 */

type Provider = "google" | "microsoft"

export async function scheduleInterview({ provider, accessToken, calendarId, event }: { provider: Provider; accessToken: string; calendarId?: string; event: any }) {
  if (provider === "google") {
    const mod = await import("./google-calendar")
    return mod.createGoogleCalendarEvent({ accessToken, calendarId, event })
  }
  if (provider === "microsoft") {
    const mod = await import("./microsoft-calendar")
    return mod.createMicrosoftCalendarEvent({ accessToken, calendarId, event })
  }
  throw new Error("Unsupported provider")
}
