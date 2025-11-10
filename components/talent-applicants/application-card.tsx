"use client"

import { useDraggable } from "@dnd-kit/core"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ApplicationCardProps {
  card: any
  context: any
}

export function ApplicationCard({ card, context }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={card.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>
            {card.first_name?.[0]}
            {card.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">
            {card.first_name} {card.last_name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{card.job_title}</p>
        </div>
        {card.rating && (
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{card.rating}</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {card.email && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{card.email}</span>
          </div>
        )}
        {card.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{card.phone}</span>
          </div>
        )}
        {card.applied_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Applied {format(new Date(card.applied_at), "MMM d")}</span>
          </div>
        )}
      </div>

      {card.skills && card.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {card.skills.slice(0, 3).map((skill: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {card.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{card.skills.length - 3}
            </Badge>
          )}
        </div>
      )}
    </Card>
  )
}
