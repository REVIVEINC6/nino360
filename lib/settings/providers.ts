export interface IntegrationProvider {
  id: string
  name: string
  description: string
  icon: string
  scopes: string[]
  authUrl?: string
}

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync interviews and meetings",
    icon: "📅",
    scopes: ["calendar.readonly", "calendar.events"],
  },
  {
    id: "slack_dm",
    name: "Slack",
    description: "Receive notifications via DM",
    icon: "💬",
    scopes: ["chat:write", "users:read"],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link code repositories",
    icon: "🐙",
    scopes: ["repo", "user"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Export reports to Notion",
    icon: "📝",
    scopes: ["read_content", "insert_content"],
  },
]
