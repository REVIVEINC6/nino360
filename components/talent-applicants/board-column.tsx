"use client"

import { useDroppable } from "@dnd-kit/core"
import { ApplicationCard } from "./application-card"
import { cn } from "@/lib/utils"

interface BoardColumnProps {
  column: {
    key: string
    stage: string
    label: string
    color: string
    count: number
  }
  cards: any[]
  context: any
}

const stageColors: Record<string, string> = {
  applicant: "bg-blue-500/10 border-blue-500/20",
  screen: "bg-purple-500/10 border-purple-500/20",
  interview: "bg-amber-500/10 border-amber-500/20",
  offer: "bg-green-500/10 border-green-500/20",
  hired: "bg-emerald-500/10 border-emerald-500/20",
  rejected: "bg-red-500/10 border-red-500/20",
}

export function BoardColumn({ column, cards, context }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.stage,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-80 rounded-lg border bg-card/50 backdrop-blur-sm transition-colors",
        stageColors[column.stage] || "bg-card/50 border-border",
        isOver && "ring-2 ring-primary",
      )}
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{column.label}</h3>
          <span className="text-sm text-muted-foreground">{cards.length}</span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {cards.map((card) => (
          <ApplicationCard key={card.id} card={card} context={context} />
        ))}
        {cards.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">No applications in this stage</div>
        )}
      </div>
    </div>
  )
}
