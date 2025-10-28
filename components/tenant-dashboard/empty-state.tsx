import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <Inbox className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </Card>
  )
}
