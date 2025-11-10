# Calendar Integration (scaffold)

This document describes the minimal scaffolding added for Google and Microsoft Outlook calendar integrations.

Files added
- `lib/integrations/google-calendar.ts` — OAuth helper, token exchange, refresh, and create event helper for Google Calendar.
- `lib/integrations/microsoft-calendar.ts` — OAuth helper, token exchange, refresh, and create event helper for Microsoft Graph/Outlook Calendar.
- `lib/integrations/calendar-scheduler.ts` — Small adapter that loads provider modules and calls createEvent.

Notes and next steps
- You must register OAuth apps in Google Cloud Console and Azure Portal to obtain client IDs and secrets.
- For production, persist tokens in secure storage (Supabase secrets table or server-only storage) and protect access with RLS.
- Add server routes (API) to start OAuth flows and handle callbacks; include CSRF/state handling.
- Add UI to connect/authorize calendars and allow users to select which calendar to use when scheduling.
- Optionally create meeting conferencing links: Google Meet (via `conferenceData.createRequest`) or Microsoft Teams (Graph has onlineMeeting options).

Example usage (server-side):

1. Generate consent URL:

  const url = getGoogleConsentUrl({ clientId: process.env.GOOGLE_CLIENT_ID!, redirectUri: `${process.env.APP_URL}/api/integrations/google/callback` })

2. Exchange code after callback and store tokens:

  const tokens = await exchangeGoogleCodeForTokens({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!, code, redirectUri })

3. Create an event:

  await createGoogleCalendarEvent({ accessToken: tokens.access_token, event: { summary: "Interview: Candidate Name", start: { dateTime: isoStart }, end: { dateTime: isoEnd }, attendees: [ { email: "candidate@example.com" } ] } })

Security: store client secrets in environment variables and user access/refresh tokens in secure storage. Use short-lived server-side service-role tokens only where necessary.
