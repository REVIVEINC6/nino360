import { HashBadge } from "./hash-badge"

interface ConfigHeaderProps {
  tenantName: string
  saveStatus: "idle" | "saving" | "saved"
}

export function ConfigHeader({ tenantName, saveStatus }: ConfigHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
          Configuration
        </h1>
        <p className="text-muted-foreground mt-2">{tenantName}</p>
      </div>

      <div className="flex items-center gap-4">
        {saveStatus === "saving" && <span className="text-sm text-muted-foreground">Saving...</span>}
        {saveStatus === "saved" && <span className="text-sm text-green-500">Saved</span>}
        <HashBadge />
      </div>
    </div>
  )
}
