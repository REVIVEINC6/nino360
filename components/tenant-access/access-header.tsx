import { HashBadge } from "./hash-badge"

interface AccessHeaderProps {
  context: any
}

export function AccessHeader({ context }: AccessHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
        <p className="text-muted-foreground">Manage roles, permissions, feature flags, and access rules</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <div className="font-medium">{context.slug}</div>
          <div className="text-muted-foreground">Role: {context.myRole}</div>
        </div>
        <HashBadge hash={context.lastAuditHash} />
      </div>
    </div>
  )
}
